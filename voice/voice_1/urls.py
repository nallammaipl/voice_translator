from django.urls import path
from .views import upload_and_transcribe

urlpatterns = [
    path('', upload_and_transcribe, name='upload_transcribe'),
]

