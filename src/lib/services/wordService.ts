import { httpClient } from '../api/httpClient';
import { Word, WordFilters, WordsResponse } from '../models/word';

class WordService {
  private baseUrl = '/words';

  async getWords(filters?: WordFilters): Promise<WordsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.sources && filters.sources.length > 0) {
      params.append('sources', filters.sources.join(','));
    }
    
    if (filters?.search) {
      params.append('search', filters.search);
    }
    
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    
    if (filters?.known !== undefined) {
      params.append('known', filters.known.toString());
    }
    
    if (filters?.practice !== undefined) {
      params.append('practice', filters.practice.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    return httpClient.get<WordsResponse>(url);
  }

  async getWordById(id: string): Promise<Word> {
    return httpClient.get<Word>(`${this.baseUrl}/${id}`);
  }

  async getSources(): Promise<string[]> {
    const response = await httpClient.get<{ sources: string[] }>(`${this.baseUrl}/sources`);
    return response.sources;
  }

  async searchWords(query: string, sources?: string[], limit?: number): Promise<WordsResponse> {
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (sources && sources.length > 0) {
      params.append('sources', sources.join(','));
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }

    return httpClient.get<WordsResponse>(`${this.baseUrl}/search?${params.toString()}`);
  }
}

export const wordService = new WordService();