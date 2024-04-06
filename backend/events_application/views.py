from django.shortcuts import render


# Create your views here.

import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from .models import User, Event, MediaUpload
from .forms import MediaUploadForm
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime

# View for creating a new user
@csrf_exempt
def create_user(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))  # Parse JSON data
        name = data.get('name')
        password = data.get('password')
        if not name or not password:
            return JsonResponse({'error': 'Name and password are required.'}, status=400)
        password = make_password(password)  # Hash the password
        user = User.objects.create(name=name, password=password)
        return JsonResponse({'id': user.id, 'name': user.name})  # Send back some info as JSON
    return JsonResponse({'error': 'This endpoint supports only POST requests.'}, status=405)


@csrf_exempt
def get_all_users(request):
    if request.method == 'GET':
        users = User.objects.all()
        users_data = [{"id": user.id, "name": user.name} for user in users]
        return JsonResponse({"users": users_data}, status=200)
    else:
        return JsonResponse({'error': 'This endpoint supports only GET requests.'}, status=405)

# View for creating a new event
@csrf_exempt
def create_event(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        title = data.get('title')
        description = data.get('description')
        date = parse_datetime(data.get('date')) # we need to parse the JSON to get the date time out
        hosted_by_id = data.get('hosted_by')  # Assuming the user ID is passed in the request
        
        if not all([title, date, hosted_by_id]): # get all the required fields for the event objects
            return JsonResponse({'error': 'Missing required fields.'}, status=400)
        
        try:
            hosted_by = User.objects.get(id=hosted_by_id) # find who the event is being hosted by and verify it 
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=404)

        event = Event.objects.create(title=title, description=description, date=date, hosted_by=hosted_by)
        return JsonResponse({'id': event.id, 'title': event.title, 'hosted_by': event.hosted_by_id}, status=201)
    else:
        return JsonResponse({'error': 'This endpoint supports only POST requests.'}, status=405)


@csrf_exempt
def get_all_events(request):
    if request.method == 'GET':
        events = Event.objects.all()
        events_data = [
            {
                "id": event.id,
                "title": event.title,
                "description": event.description,
                "date": event.date,
                "hosted_by": event.hosted_by_id  # Assuming you want to include the ID of the user who hosts the event
            }
            for event in events
        ]
        return JsonResponse({"events": events_data}, status=200)
    else:
        return JsonResponse({'error': 'This endpoint supports only GET requests.'}, status=405)


# View for uploading media to an event
@csrf_exempt
def upload_media(request, event_id):
    if request.method == 'POST':
        print("IN HERE")
        form = MediaUploadForm(request.POST, request.FILES)
        if form.is_valid():
            media_upload = form.save(commit=False)
            media_upload.event_id = event_id
            media_upload.save()
            return JsonResponse({'message': 'File uploaded successfully', 'event_id': event_id}, status=201)
        else:
            return JsonResponse({'error': 'Invalid form data.'}, status=400)
    else:
        return JsonResponse({'error': 'This endpoint supports only POST requests.'}, status=405)
