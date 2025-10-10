import { httpClient } from '../api/httpClient';
import {
  User,
  UserProfile,
  UserStats,
  RecentActivityItem,
  ActivityCalendarResponse,
  LeaderboardEntry,
  UpdateProfileRequest,
  UpdatePreferenceRequest,
  UpdateThemeRequest,
  UserPreferences,
} from '../models';

export class UserService {
  // Profile methods
  async getProfile(): Promise<User> {
    return httpClient.get<User>('/user/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; user: User }> {
    return httpClient.put<{ message: string; user: User }>('/user/profile', data);
  }

  async getUserProfile(username: string): Promise<UserProfile> {
    return httpClient.get<UserProfile>(`/profile/${username}`);
  }

  async getUserStatsByUsername(username: string): Promise<UserStats> {
    return httpClient.get<UserStats>(`/profile/${username}/stats`);
  }

  async getRecentActivity(username: string, limit: number = 10): Promise<RecentActivityItem[]> {
    return httpClient.get<RecentActivityItem[]>(`/profile/${username}/activity?limit=${limit}`);
  }

  async getActivityCalendar(username: string, days: number = 365): Promise<ActivityCalendarResponse[]> {
    return httpClient.get<ActivityCalendarResponse[]>(
      `/profile/${username}/activity/summary?days=${days}`
    );
  }

  async incrementProfileView(username: string): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>(`/profile/${username}/view`);
  }

  // Preferences methods
  async getPreferences(): Promise<UserPreferences> {
    return httpClient.get<UserPreferences>('/user/preferences');
  }

  async updatePreference(data: UpdatePreferenceRequest): Promise<{ message: string; preferences: UserPreferences }> {
    return httpClient.patch<{ message: string; preferences: UserPreferences }>('/user/preferences', data);
  }

  async updateTheme(data: UpdateThemeRequest): Promise<{ message: string }> {
    return httpClient.patch<{ message: string }>('/user/theme', data);
  }

  // Leaderboard methods
  async getLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    return httpClient.get<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`);
  }

  async updateRanks(): Promise<{ message: string }> {
    return httpClient.post<{ message: string }>('/leaderboard/ranks/update');
  }
}

export const userService = new UserService();
