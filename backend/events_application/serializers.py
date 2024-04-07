from rest_framework import serializers
from .models import User, Event, MediaUpload
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}} # make the passwords write only so they don't actually show up in the database for read/GET requests

    def create(self, validated_data):
        user = User.objects.create(
            name=validated_data['name'],
            password=make_password(validated_data['password'])
        )
        return user


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class MediaUploadSerializer(serializers.ModelSerializer):
    s3_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MediaUpload
        fields = ['upload', 'event', 's3_url']

    def get_s3_url(self, obj):
        if obj.upload:
            return obj.upload.url
        return None
