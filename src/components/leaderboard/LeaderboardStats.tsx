import { Card, CardContent } from '@/components/ui/card';
import { LeaderboardEntry } from '@/lib/models/user';

interface LeaderboardStatsProps {
  topPerformer?: LeaderboardEntry | null;
  topSolved?: LeaderboardEntry | null;
  userRank?: number;
  userXP?: number;
}

export function LeaderboardStats({ topPerformer, topSolved, userRank, userXP = 0 }: LeaderboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground mb-2">Top Performer</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-semibold text-sm">{topPerformer?.name || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {topPerformer?.totalXP.toLocaleString() || 0} XP
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground mb-2">Most Solved</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-sm">{topSolved?.name || 'N/A'}</p>
              <p className="text-xs text-muted-foreground">
                {topSolved?.totalSolved || 0} questions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-muted-foreground mb-2">Your Rank</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-sm">
                {userRank && userRank > 0 ? `#${userRank}` : 'Unranked'}
              </p>
              <p className="text-xs text-muted-foreground">{userXP.toLocaleString()} XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
