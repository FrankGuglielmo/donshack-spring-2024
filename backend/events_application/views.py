from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
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


    def destroy(self, request, *args, **kwargs): # need to specify the destroy of the ViewSet on how it should handle the deletion
        user = self.get_object()
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['delete'], url_path='delete-all') # delete all method  TODO-- might need to create super users in the django admin to only have access
    def delete_all_users(self, request):
        User.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "All users have been deleted."})
    

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


    # Inside EventViewSet class
    @action(detail=False, methods=['delete'], url_path='delete-all') # delete all method  TODO-- might need to create super users in the django admin to only have access
    def delete_all_events(self, request):

        self.queryset.delete()
        return Response(status=status.HTTP_204_NO_CONTENT, data={"message": "All events have been deleted."})

    @transaction.atomic # make this an atomic delete such that if there are any exceptions it will kill the whole delete process -- work more like a SQL atomic transaction
    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        
        # delete all the media before we delete the event from the database
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

        event.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    # to get media uploads from a specific event 
    @action(detail=True, methods=['get'], url_path='media-uploads')
    def get_media_uploads(self, request, pk=None):  ## route /events/{event_id}/media-uploads/
        """
        Retrieve all media uploads for a specific event.
        """
        event = get_object_or_404(Event, pk=pk)
        media_uploads = MediaUpload.objects.filter(event=event)
        serializer = MediaUploadSerializer(media_uploads, many=True)
        return Response(serializer.data)

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
        # use the boto client to actually access the s3 and upload the file to the bucket
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                region_name=settings.AWS_S3_REGION_NAME)

        try:
            s3_key = f"events/{event_id}/{file.name}"  # path within the bucket where we want to store the media
            content_disposition = f'attachment; filename="{file.name}"' # setting ContentDisposition for file download 
            
            s3_client.upload_fileobj(
                Fileobj=file_content,
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=s3_key,
                ExtraArgs={
                    'ContentDisposition': content_disposition
                }
            )

            # Assuming your MediaUpload model's 'upload' field can store the S3 key/path
            media_upload = MediaUpload.objects.create(event=event, upload=s3_key)

            return Response({'message': 'File uploaded successfully to S3', 'event_id': event_id, 's3_key': s3_key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            file_content.close()


    @action(detail=True, methods=['delete'], url_path='delete-from-event')
    def delete_specific_media_upload(self, request, pk=None):  # route /media_uploads/{media_id}/delete-from-event/
        """
        Delete a specific media upload.
        """
        # Retrieve the specific media upload by its ID
        media_upload = get_object_or_404(MediaUpload, pk=pk)
        event_id = media_upload.event.id  # Store event ID for the response

        # Initialize the S3 client
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                region_name=settings.AWS_S3_REGION_NAME)
        
        # Extract the bucket name and the S3 key from the media upload's file path
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        object_key = str(media_upload.upload)  # Ensure this is the correct S3 key

        try:
            # Attempt to delete the file from S3
            s3_client.delete_object(Bucket=bucket_name, Key=object_key)
            logger.info(f"Successfully deleted {object_key} from S3 bucket {bucket_name}")
        except Exception as e:
            logger.error(f"Failed to delete {object_key} from S3 bucket {bucket_name}: {e}")
            return Response({'error': f"Failed to delete the file from S3: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Delete the media upload from the database
        media_upload.delete()

        return Response({'message': 'Media upload deleted successfully.', 'event_id': event_id}, status=status.HTTP_204_NO_CONTENT)

    # define the destroy method for the ViewSet to actually be able to delete 
    def destroy(self, request, *args, **kwargs):
        media_upload = self.get_object()
        s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                 region_name=settings.AWS_S3_REGION_NAME)
        
        # Extract bucket name and object key from the media upload's file path
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME  # get the bucket name
        object_key = str(media_upload.upload)  # the field here stores the s3 key here directly 

        try:
            s3_client.delete_object(Bucket=bucket_name, Key=object_key) # delete the object from the s3 bucket
            logger.info(f"Successfully deleted {object_key} from S3 bucket {bucket_name}")
        except Exception as e: # if we get an error here then just return a response dont try to delete the from the DB -- we need everything here to be an atomic transaction
            logger.error(f"Failed to delete {object_key} from S3 bucket {bucket_name}: {e}")
            return Response({'error': f"Failed to delete the file from S3: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        
        # delete from the DB after a successful S3 deletion
        return super().destroy(request, *args, **kwargs)