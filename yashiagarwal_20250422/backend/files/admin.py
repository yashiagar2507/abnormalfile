from django.contrib import admin
from .models import File  # ✅ your model

@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('id', 'original_filename', 'file_type', 'size', 'uploaded_at')  # ✅ fields to show
    search_fields = ('original_filename',)
