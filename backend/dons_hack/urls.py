"""
URL configuration for dons_hack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from events_application.views import UserViewSet, EventViewSet, MediaUploadViewSet

# using viewsets we use the default router to inherit all of the endpoints for the api
router = DefaultRouter()
router.register(r'users', UserViewSet) #    /users/
router.register(r'events', EventViewSet) #  /events/
router.register(r'media_uploads', MediaUploadViewSet, basename='mediaupload') # /media_uploads/

urlpatterns = [
    path('', include(router.urls)), # put include all of the routes
]