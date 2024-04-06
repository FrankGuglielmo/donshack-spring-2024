from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from .models import User, Event, MediaUpload
from .serializers import UserSerializer, EventSerializer, MediaUploadSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class MediaUploadViewSet(viewsets.ModelViewSet):
    queryset = MediaUpload.objects.all()
    serializer_class = MediaUploadSerializer
