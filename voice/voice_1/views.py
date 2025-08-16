from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, Http404, JsonResponse
from io import BytesIO
import os
import whisper

from .models import Transcription
from .forms import AudioUploadForm

# Load Whisper model once
model = whisper.load_model("base")

@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_and_transcribe(request):
    """
    Upload audio → transcribe with Whisper → save transcript in DB → return JSON (no .txt saved).
    """
    form = AudioUploadForm(request.POST, request.FILES)
    if not form.is_valid():
        return Response({"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST)

    try:
        audio_obj = form.save()
        audio_path = audio_obj.audio_file.path

        result = model.transcribe(audio_path)
        transcript_text = result.get("text", "").strip()

        transcription = Transcription.objects.create(
            audio=audio_obj,
            transcribed_txt=transcript_text
        )

        base_name = os.path.splitext(os.path.basename(audio_obj.audio_file.name))[0]
        filename = f"{base_name}_transcript.txt"

        return Response(
            {
                "id": transcription.id,
                "transcribed_text": transcript_text,
                "filename": filename,
                "download_url": request.build_absolute_uri(
                    f"/api/transcribe/{transcription.id}/download/"
                ),
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def download_transcription(request, transcription_id: int):
    """
    Stream a .txt file on the fly from DB text (no disk write).
    """
    try:
        t = Transcription.objects.get(pk=transcription_id)
    except Transcription.DoesNotExist:
        raise Http404("Transcription not found")

    # Build file in memory
    text = (t.transcribed_txt or "").encode("utf-8")
    buffer = BytesIO(text)
    buffer.seek(0)

    # Suggest a nice filename
    base_name = os.path.splitext(os.path.basename(t.audio.audio_file.name))[0]
    filename = f"{base_name}_transcript.txt"

    return FileResponse(buffer, as_attachment=True, filename=filename)


def home(request):
    return JsonResponse({"message": "Welcome to the Transcription API!"})
