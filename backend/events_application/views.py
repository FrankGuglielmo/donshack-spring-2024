from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .serializers import MediaUploadSerializer
import boto3
from django.conf import settings
from io import BytesIO
from django.db import transaction

from .models import User, Event, MediaUpload
from .serializers import UserSerializer, EventSerializer, MediaUploadSerializer

import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Optionally, add any specific logic you need to handle before deleting the user
        # For example, logging, sending notifications, etc.
        
        # Cascading delete will handle related objects if your models are set up with on_delete=models.CASCADE
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'], url_path='delete-all')
    def delete_all_users(self, request):
        User.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "All users have been deleted."})
    

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


    # Inside EventViewSet class
    @action(detail=False, methods=['delete'], url_path='delete-all')
    def delete_all_events(self, request):

        self.queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "All events have been deleted."})

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        
        # Before deleting the event, delete related media uploads from S3
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 region_name=settings.AWS_S3_REGION_NAME)
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME

        media_uploads = event.media_uploads.all()
        for media_upload in media_uploads:
            object_key = str(media_upload.upload)
            try:
                s3_client.delete_object(Bucket=bucket_name, Key=object_key)
                logger.info(f"Successfully deleted {object_key} from S3 bucket {bucket_name}")
            except Exception as e:
                logger.error(f"Failed to delete {object_key} from S3 bucket {bucket_name}: {e}")
                # Decide how to handle the failure

        # After deleting media uploads from S3, delete the event
        event.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class MediaUploadViewSet(viewsets.ModelViewSet):
    queryset = MediaUpload.objects.all()
    serializer_class = MediaUploadSerializer

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_media_to_event(self, request):
        event_id = request.data.get('event_id')
        if not event_id:
            return Response({'error': 'Event ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            event = Event.objects.get(pk=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

        file = request.FILES.get('upload')
        if not file:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        file_content = BytesIO(file.read())
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 region_name=settings.AWS_S3_REGION_NAME)

        try:
            s3_key = f"events/{event_id}/{file.name}"
            s3_client.upload_fileobj(file_content, settings.AWS_STORAGE_BUCKET_NAME, s3_key)
            
            # Assuming your MediaUpload model's 'upload' field can store the S3 key/path
            media_upload = MediaUpload.objects.create(event=event, upload=s3_key)
            
            return Response({'message': 'File uploaded successfully to S3', 'event_id': event_id, 's3_key': s3_key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            file_content.close()

    def destroy(self, request, *args, **kwargs):
        media_upload = self.get_object()
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 region_name=settings.AWS_S3_REGION_NAME)
        
        # Extract bucket name and object key from the media upload's file path
        # Assuming `upload` field stores the S3 key directly
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        object_key = str(media_upload.upload)  # Convert FileField path to string if necessary

        try:
            # Attempt to delete the file from S3
            s3_client.delete_object(Bucket=bucket_name, Key=object_key)
            logger.info(f"Successfully deleted {object_key} from S3 bucket {bucket_name}")
        except Exception as e:
            logger.error(f"Failed to delete {object_key} from S3 bucket {bucket_name}: {e}")
            # Decide how to handle the failure. You might choose to still delete the record from the DB, or return an error.
            return Response({'error': f"Failed to delete the file from S3: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Proceed with the standard delete process after successfully deleting from S3
        return super().destroy(request, *args, **kwargs)