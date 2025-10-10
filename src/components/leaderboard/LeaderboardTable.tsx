import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '@/lib/models/user';
import { LeaderboardRow } from './LeaderboardRow';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
  currentUsername: string;
}

export function LeaderboardTable({ leaderboard, currentUsername }: LeaderboardTableProps) {
  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Rankings
          </CardTitle>
          <CardDescription>Top performers based on total XP earned</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">No users on leaderboard yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Rankings
        </CardTitle>
        <CardDescription>Top performers based on total XP earned</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <LeaderboardRow
              key={user.username}
              user={user}
              isCurrentUser={user.username === currentUsername}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
