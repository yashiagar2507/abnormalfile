import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../services/fileService';
import FileFilter from './FileFilter';

const FileList: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});

  const { data: files, isLoading, isError, refetch } = useQuery({
    queryKey: ['files', filters],
    queryFn: () => fileService.getFiles(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: fileService.deleteFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files'] }),
  });

  return (
    <div className="p-4">
      <FileFilter filters={filters} setFilters={setFilters} />
      <button onClick={() => refetch()} className="btn mt-2">Apply Filters</button>

      {isLoading && <p className="text-sm text-gray-500 mt-4">Loading files...</p>}
      {isError && <p className="text-sm text-red-600 mt-4">Failed to load files.</p>}

      <ul className="mt-4 space-y-2">
        {files?.map((file) => (
          <li key={file.id} className="p-3 border rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{file.original_filename}</p>
                <p className="text-sm text-gray-600">
                  {file.file_type}, {file.size} bytes
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded {new Date(file.uploaded_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(file.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
