import { User } from './auth';

export interface UserStats {
  userId: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  tcSolved: number;
  seSolved: number;
  rcSolved: number;
  totalXp: number;
  rank: number;
  currentStreak: number;
  longestStreak: number;
  lastLogin: string;
  totalAttempts: number;
  profileViews: number;
}

export interface UserProfile {
  user: User;
  stats: UserStats;
  recent_activity: RecentActivityItem[];
}

export interface RecentActivityItem {
  id: string;
  title: string;
  difficulty_level: string;
  question_type: string;
  solvedAt: string;
  xpGained: number;
  passageId?: string;
}

export interface ActivityCalendarResponse {
  date: string;
  count: number;
  level: number; // 0-4 for activity visualization
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  username: string;
  name: string;
  totalXP: number;
  totalSolved: number;
  currentStreak: number;
}
