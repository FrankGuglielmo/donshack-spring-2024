# Class used to create forms for uploading media to an event 

from django import forms
from .models import MediaUpload

class MediaUploadForm(forms.ModelForm):
    class Meta:
        model = MediaUpload
        fields = ('upload',)
