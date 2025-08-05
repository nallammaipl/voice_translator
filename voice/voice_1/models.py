from django.db import models
# from django.contrib.auth.models import User

# Stores uploaded audio files with user info
class AudioUpload(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='audio/')
    uploaded_at = models.DateTimeField(auto_now_add=True)  # ✅ Removed extra space

    def __str__(self):
        return f"{self.user.username} - {self.audio_file.name}"


# Stores the transcribed text of the audio
class Transcription(models.Model):
    audio = models.OneToOneField(AudioUpload, on_delete=models.CASCADE)
    transcribed_txt = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)  # ✅ Removed extra space

    def __str__(self):
        return f"Transcription of {self.audio.audio_file.name}"


# Stores the transcription as a .txt file
class TextFileStorage(models.Model):
    transcription = models.OneToOneField(Transcription, on_delete=models.CASCADE)
    text_file = models.FileField(upload_to='transcription/')
    saved_at = models.DateTimeField(auto_now_add=True)  # ✅ Fixed typo: 'svaed_at' -> 'saved_at'

    def __str__(self):
        return f"File For {self.transcription.audio.audio_file.name}"
