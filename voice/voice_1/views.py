from django.shortcuts import render
from . models import Transcription,TextFileStorage
from . forms import AudioUploadForm
import os
import whisper
# from django.conf import settings
from django.core.files.base import ContentFile


# loading whisper
model = whisper.load_model("base")


def upload_and_transcribe(request):
    if request.method == 'POST':
        form = AudioUploadForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                # Save audio without assigning a user
                audio_obj = form.save()
                print("Audio path:", audio_obj.audio_file.path)
                
                print("File exists?", os.path.exists(audio_obj.audio_file.path))


                audio_path = audio_obj.audio_file.path
                result = model.transcribe(audio_path)
                transcript_text = result['text']

                # Save transcription
                transcription = Transcription.objects.create(
                    audio=audio_obj,
                    transcribed_txt=transcript_text
                )

                # Save as text file
                text_file_name = f"{audio_obj.audio_file.name}.txt"
                content = ContentFile(transcript_text.encode('utf-8')) #utf-8 ""unicode transformation format" used to transform char to bytes 
                text_file = TextFileStorage.objects.create(transcription=transcription)
                text_file.text_file.save(text_file_name, content)

                return render(request, 'result.html', {'transcription': transcription})

            except Exception as e:
                print("Error during transcription:", e)
                return render(request, 'upload_audio.html', {'form': form, 'error': str(e)})
        else:
            print("Form errors:", form.errors)
    else:
        form = AudioUploadForm()

    return render(request, 'upload_audio.html', {'form': form})