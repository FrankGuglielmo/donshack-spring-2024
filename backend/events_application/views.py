from django.shortcuts import render


# Create your views here.

import json
import boto3
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from .models import User, Event, MediaUpload
from .forms import MediaUploadForm
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from io import BytesIO
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

from .models import User, Event, MediaUpload
from .serializers import UserSerializer, EventSerializer, MediaUploadSerializer

import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

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
            
            # You might need to adjust the response to include more info as needed
            return Response({'message': 'File uploaded successfully to S3', 'event_id': event_id, 's3_key': s3_key}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            file_content.close()