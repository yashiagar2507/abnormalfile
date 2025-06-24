import React, { useState, useRef } from 'react';
import { fileService } from '../services/fileService';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadResponse } from '../types/file';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation<UploadResponse, Error, File>({
    mutationFn: fileService.uploadFile,
    onSuccess: (data) => {
      alert(data.duplicate
        ? `🚫 Duplicate file! You saved ${data.saved_storage} bytes.`
        : '✅ File uploaded successfully.'
      );

      queryClient.invalidateQueries({ queryKey: ['files'] });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess();
    },
    onError: () => {
      setError('Failed to upload file. Please try again.');
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setError(null);
    await uploadMutation.mutateAsync(selectedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <CloudArrowUpIcon className="h-6 w-6 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
      >
        <div className="text-center space-y-1">
          <div className="text-sm text-gray-600 flex">
            <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-primary-600">
              <span>Upload a file</span>
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                className="sr-only"
                onChange={handleFileSelect}
                disabled={uploadMutation.isPending}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">Any file up to 10MB</p>
        </div>
      </div>

      {selectedFile && (
        <div className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 mt-2 rounded">{error}</div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploadMutation.isPending}
        className={`mt-4 w-full py-2 px-4 rounded-md text-white text-sm font-medium ${
          !selectedFile || uploadMutation.isPending
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};
