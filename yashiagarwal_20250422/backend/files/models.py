from django.db import models
from django.conf import settings
import os

class File(models.Model):
    file = models.FileField(upload_to='uploads/')
    original_filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    size = models.PositiveIntegerField()
    hash = models.CharField(max_length=64)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # Optional user field (can be null/blank)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files',
        null=True,
        blank=True
    )

    class Meta:
        unique_together = ['user', 'hash']

    def __str__(self):
        return self.original_filename

    def delete(self, *args, **kwargs):
        if self.file and os.path.isfile(self.file.path):
            os.remove(self.file.path)
        super().delete(*args, **kwargs)
