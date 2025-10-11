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

export interface QuestionActivityMetadata {
  question_id: string;
  question_text: string;
  solved: boolean;
  passage_id?: string;
  difficulty_level: string;
  question_type: string;
  time_taken: number;
  xp_gained?: number;
}

export interface DiscussionActivityMetadata {
  discussion_id: string;
  discussion_title: string;
  comment_id?: string;
  parent_id?: string;
  tags?: string[];
  action_type: 'created' | 'updated' | 'comment_added' | 'comment_updated' | 'discussion_liked' | 'comment_liked';
  is_comment: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'question' | 'discussion';
  date: string;
  timestamp: string;
  metadata: QuestionActivityMetadata | DiscussionActivityMetadata;
  createdAt: string;
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
