from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)  #need to make sure we use auth0 PWs that are not plaintext here

#   event model
class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateTimeField() # date of the event
    hosted_by = models.ForeignKey(User, related_name='hosted_events', on_delete=models.CASCADE) # an event is only hosted by one user
    saved_by = models.ManyToManyField(User, related_name='saved_events', blank=True) # many users can save one event
    cover_photo = models.FileField(upload_to='event_covers/', blank=True, null=True)    # save the cover photo to be uploaded to the event_covers/ directory inside the S3 bucket

    def __str__(self):
        return self.title
    

def upload_to_event_directory(instance, filename):
    return f"events/{instance.event.id}/{filename}" # the path needs to be dynamic to upload the media files to the S3 based on what the event actually is

class MediaUpload(models.Model):
    event = models.ForeignKey(Event, related_name='media_uploads', on_delete=models.CASCADE)
    upload = models.FileField(upload_to=upload_to_event_directory) # call the dynmamic path to upload the file to 
    uploaded_at = models.DateTimeField(auto_now_add=True) # give the date/time the file was uploaded

    def __str__(self):
        return f"{self.event.title} - {self.uploaded_at}"