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

    def __str__(self):
        return self.title
    

class MediaUpload(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    upload = models.FileField(upload_to='events/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event.title} - {self.uploaded_at}"