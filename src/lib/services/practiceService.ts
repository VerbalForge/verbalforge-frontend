import { httpClient } from '../api/httpClient';
import { PracticeResponse, PracticeFilters } from '../models';

/**
 * Practice service for fetching unified practice content
 * Uses new page-based pagination endpoint
 */
export class PracticeService {
  /**
   * Get practice items with page-based pagination
   */
  async getPracticeItems(filters?: PracticeFilters): Promise<PracticeResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.type) queryParams.append('type', filters.type);

    const url = `/practice${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return httpClient.get<PracticeResponse>(url);
  }

  /**
   * Invalidate the backend cache for specific filters
   */
  async invalidateCache(difficulty?: string, type?: string): Promise<void> {
    const queryParams = new URLSearchParams();
    
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (type) queryParams.append('type', type);

    const url = `/practice/invalidate${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    await httpClient.post(url, {});
  }
}

export const practiceService = new PracticeService();

