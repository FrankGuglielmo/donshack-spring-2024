from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  #need to make sure we use auth0 PWs that are not plaintext here

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField()
    hosted_by = models.ForeignKey(User, related_name='hosted_events', on_delete=models.CASCADE)
    saved_by = models.ManyToManyField(User, related_name='saved_events', blank=True)
    cover_photo = models.FileField(upload_to='event_covers/', blank=True, null=True)

    def __str__(self):
        return self.title
    

def upload_to_event_directory(instance, filename):
    return f"events/{instance.event.id}/{filename}" # the path needs to be dynamic to upload the media files to the S3 based on what the event actually is

class MediaUpload(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    upload = models.FileField(upload_to=upload_to_event_directory) # call the dynmamic path
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event.title} - {self.uploaded_at}"