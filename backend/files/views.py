from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny  # 👈 NEW: allow access without auth
from .models import File
from .serializers import FileSerializer
import hashlib
from datetime import datetime
from django.shortcuts import get_object_or_404

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()
    permission_classes = [AllowAny]  # 👈 Allow any user (no login required)

    def get_queryset(self):
        queryset = File.objects.all()
        params = self.request.query_params

        filename = params.get('filename')
        file_type = params.get('file_type')
        size_min = params.get('size_min')
        size_max = params.get('size_max')
        uploaded_after = params.get('uploaded_after')
        uploaded_before = params.get('uploaded_before')

        if filename:
            queryset = queryset.filter(original_filename__icontains=filename)
        if file_type:
            queryset = queryset.filter(file_type__icontains=file_type)
        if size_min:
            queryset = queryset.filter(size__gte=int(size_min))
        if size_max:
            queryset = queryset.filter(size__lte=int(size_max))
        if uploaded_after:
            try:
                after_date = datetime.strptime(uploaded_after, '%Y-%m-%d')
                queryset = queryset.filter(uploaded_at__date__gte=after_date)
            except ValueError:
                pass
        if uploaded_before:
            try:
                before_date = datetime.strptime(uploaded_before, '%Y-%m-%d')
                queryset = queryset.filter(uploaded_at__date__lte=before_date)
            except ValueError:
                pass

        return queryset.order_by('-uploaded_at')

    def create(self, request, *args, **kwargs):
    print("➡️ Received a file upload request")

    file_obj = request.FILES.get('file')
    if not file_obj:
        print("❌ No file provided in request")
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    # 🔁 Calculate SHA256 hash of file content
    hasher = hashlib.sha256()
    for chunk in file_obj.chunks():
        hasher.update(chunk)
    file_hash = hasher.hexdigest()
    print(f"🧮 Calculated hash: {file_hash}")

    # 🔍 Check for duplicate
    existing_file = File.objects.filter(hash=file_hash).first()
    if existing_file:
        print(f"🚨 Duplicate file detected: {existing_file.original_filename}")
        return Response({
            'message': 'Duplicate file',
            'duplicate': True,
            'file': FileSerializer(existing_file).data,
            'saved_storage': file_obj.size
        }, status=status.HTTP_200_OK)

    # ✅ Save unique file
    data = {
        'file': file_obj,
        'original_filename': file_obj.name,
        'file_type': file_obj.content_type,
        'size': file_obj.size,
        'hash': file_hash
    }

    serializer = self.get_serializer(data=data)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)

    print(f"✅ File saved to DB: {serializer.data}")

    return Response({
        'message': 'File uploaded',
        'duplicate': False,
        'file': serializer.data,
        'saved_storage': 0
    }, status=status.HTTP_201_CREATED)


    def destroy(self, request, *args, **kwargs):
        instance = get_object_or_404(File, pk=kwargs["pk"])
        instance.file.delete()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
