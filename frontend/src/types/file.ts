export interface FileType {
  id: number;
  original_filename: string;
  file_type: string;
  size: number;
  uploaded_at: string;
}

export interface UploadResponse {
  message: string;
  duplicate: boolean;
  file: FileType;
  saved_storage: number;
}
