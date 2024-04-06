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
from django.urls import path
from events_application import views

urlpatterns = [
    path('admin/', admin.site.urls),
     path('create_user/', views.create_user, name='create_user'),
    path('create_event/', views.create_event, name='create_event'),
    path('upload_media/<int:event_id>/', views.upload_media, name='upload_media'),
     path('get_all_users/', views.get_all_users, name='get_all_users'),
    path('get_all_events/', views.get_all_events, name='get_all_events'),
]
