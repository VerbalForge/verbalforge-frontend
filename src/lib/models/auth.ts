export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio?: string;
  preferences: UserPreferences;
  totalXP: number;
  totalSolved: number;
  rank: number;
  currentStreak: number;
  longestStreak: number;
  lastLogin: string;
  totalAttempts: number;
  profileViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  profile: {
    visibility: boolean;
    progress: boolean;
    leaderboard: boolean;
  };
  theme: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
}

export interface UpdatePreferenceRequest {
  key: string;
  value: boolean;
}

export interface UpdateThemeRequest {
  theme: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}
