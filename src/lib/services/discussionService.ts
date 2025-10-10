import { httpClient } from '../api/httpClient';
import {
  Discussion,
  DiscussionsResponse,
  CreateDiscussionRequest,
  UpdateDiscussionRequest,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../models';
import { DiscussionFilters, SearchParams } from '../types/api';

export class DiscussionService {
  async getDiscussions(filters?: DiscussionFilters): Promise<DiscussionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.cursor) queryParams.append('cursor', filters.cursor);
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.tags) {
      queryParams.append('tags', filters.tags.join(','));
    }
    
    const url = `/discussions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return httpClient.get<DiscussionsResponse>(url);
  }

  async getDiscussionById(id: string): Promise<Discussion> {
    return httpClient.get<Discussion>(`/discussions/${id}`);
  }

  async createDiscussion(data: CreateDiscussionRequest): Promise<Discussion> {
    return httpClient.post<Discussion>('/discussions', data);
  }

  async updateDiscussion(id: string, data: UpdateDiscussionRequest): Promise<Discussion> {
    return httpClient.put<Discussion>(`/discussions/${id}`, data);
  }

  async deleteDiscussion(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/discussions/${id}`);
  }

  async incrementDiscussionView(id: string): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>(`/discussions/${id}/view`);
  }

  async toggleDiscussionLike(id: string): Promise<{ liked: boolean }> {
    return httpClient.post<{ liked: boolean }>(`/discussions/${id}/like`);
  }

  // Comment methods
  async addComment(discussionId: string, data: CreateCommentRequest): Promise<Comment> {
    return httpClient.post<Comment>(`/discussions/${discussionId}/comments`, data);
  }

  async updateComment(discussionId: string, commentId: string, data: UpdateCommentRequest): Promise<{ message: string }> {
    return httpClient.put<{ message: string }>(`/discussions/${discussionId}/comments/${commentId}`, data);
  }

  async deleteComment(discussionId: string, commentId: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/discussions/${discussionId}/comments/${commentId}`);
  }

  async toggleCommentLike(discussionId: string, commentId: string): Promise<{ liked: boolean }> {
    return httpClient.post<{ liked: boolean }>(`/discussions/${discussionId}/comments/${commentId}/like`);
  }

  // User discussions
  async getUserDiscussions(username: string, filters?: { limit?: number; cursor?: string }): Promise<DiscussionsResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.cursor) queryParams.append('cursor', filters.cursor);
    
    const url = `/profile/${username}/discussions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return httpClient.get<DiscussionsResponse>(url);
  }

  // Search discussions
  async searchDiscussions(params: SearchParams): Promise<DiscussionsResponse> {
    const queryParams = new URLSearchParams({ q: params.q });
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.cursor) queryParams.append('cursor', params.cursor);
    
    const url = `/discussions/search?${queryParams.toString()}`;
    return httpClient.get<DiscussionsResponse>(url);
  }
}

export const discussionService = new DiscussionService();
