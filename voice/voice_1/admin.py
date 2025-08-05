from django.contrib import admin

# usename:jaree
# email:jareenan42@gmail.com
# nishu@2005

from .models import AudioUpload,Transcription,TextFileStorage


admin.site.register(AudioUpload)
admin.site.register(Transcription)
admin.site.register(TextFileStorage)
