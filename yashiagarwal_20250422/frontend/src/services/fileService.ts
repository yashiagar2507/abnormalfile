import axios from 'axios';
import { FileType, UploadResponse } from '../types/file';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const fileService = {
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFiles(filters: Record<string, string | number | undefined> = {}): Promise<FileType[]> {
    const params = new URLSearchParams(filters as any).toString();
    const response = await axios.get(`${API_URL}/files/?${params}`);
    return response.data;
  },

  async deleteFile(id: number): Promise<void> {
    await axios.delete(`${API_URL}/files/${id}/`);
  }
};
