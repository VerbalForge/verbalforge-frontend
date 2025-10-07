'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { UserProfile } from '@/lib/api';
import { getInitials, getRankName, getRankColor } from '@/lib/utils/profile';
import { Trophy, Flame, Eye } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user, stats } = profile;

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://avatar.vercel.sh/${user.username}`} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              {/* Rank Badge */}
              <Badge className={`${getRankColor(stats.rank)} text-sm px-3 py-1`}>
                <Trophy className="w-3 h-3 mr-1" />
                {getRankName(stats.rank)}
              </Badge>

              {/* Current Streak */}
              <div className="flex items-center gap-1 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-medium">{stats.currentStreak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>

              {/* Longest Streak */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Longest: {stats.longestStreak} days</span>
              </div>

              {/* Profile Views */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{stats.profileViews} views</span>
              </div>
            </div>

            {/* XP and Questions */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="font-semibold text-lg">{stats.totalXP}</span>
                <span className="text-muted-foreground ml-1">XP</span>
              </div>
              <div>
                <span className="font-semibold text-lg">{stats.totalSolved}</span>
                <span className="text-muted-foreground ml-1">questions solved</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
