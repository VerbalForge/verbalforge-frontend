import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Award } from 'lucide-react';
import { UserProfile, LeaderboardEntry } from '@/lib/models/user';
import { getInitials, getRankName, getRankColor } from '@/lib/utils/profile';

interface UserRankingCardProps {
  userProfile: UserProfile;
  userRank: number;
  leaderboard: LeaderboardEntry[];
}

export function UserRankingCard({ userProfile, userRank, leaderboard }: UserRankingCardProps) {
  const xpToTop100 = leaderboard.length > 0 && userRank > 100
    ? leaderboard[99]?.totalXP - userProfile.stats.totalXp
    : 0;

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Your Ranking
        </CardTitle>
        <CardDescription>Your current position on the leaderboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-base font-bold px-3 py-1">
              #{userRank}
            </Badge>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(userProfile.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userProfile.user.name}</p>
              <p className="text-xs text-muted-foreground">@{userProfile.user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm font-bold text-primary">
                {userProfile.stats.totalXp.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {userProfile.stats.totalSolved}
              </p>
              <p className="text-xs text-muted-foreground">Solved</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className={getRankColor(userProfile.stats.totalXp)}>
                {getRankName(userProfile.stats.totalXp)}
              </Badge>
            </div>
          </div>
        </div>
        {xpToTop100 > 0 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Keep practicing! You&apos;re{' '}
            <span className="font-bold text-primary">{xpToTop100.toLocaleString()} XP</span> away
            from the top 100! 🚀
          </p>
        )}
      </CardContent>
    </Card>
  );
}
