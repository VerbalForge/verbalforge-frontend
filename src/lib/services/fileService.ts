import { httpClient } from '../api/httpClient';

export class FileService {
  async uploadFile(file: File): Promise<{ url: string }> {
    return httpClient.uploadFile('/upload', file);
  }
}

export const fileService = new FileService();
