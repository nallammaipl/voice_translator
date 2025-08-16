from django.urls import path
from .views import upload_and_transcribe,download_transcription,home

urlpatterns = [
    path("", home, name="home"),
    path("api/transcribe/", upload_and_transcribe, name="upload_and_transcribe"),
    path("api/transcribe/<int:transcription_id>/download/", download_transcription, name="download_transcription"),

]
