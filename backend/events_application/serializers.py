from rest_framework import serializers
from .models import User, Event, MediaUpload

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'password']  

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class MediaUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaUpload
        fields = '__all__'
