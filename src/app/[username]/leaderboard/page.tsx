'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal } from 'lucide-react';
import { apiService, LeaderboardEntry } from '@/lib/api';
import { getInitials, getRankName, getRankColor } from '@/lib/utils/profile';

const getRankIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300';
  if (rank === 2) return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300';
  if (rank === 3) return 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300';
  return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300';
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getLeaderboard(100);
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">{error}</p>
      </Card>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top performers by XP</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThree.map((user) => (
            <Card key={user.rank} className={`relative ${user.rank === 1 ? 'md:col-start-2 md:row-start-1' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Rank Icon */}
                  <div className="text-4xl">{getRankIcon(user.rank)}</div>
                  
                  {/* Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-lg">{user.totalXP}</div>
                      <div className="text-muted-foreground">XP</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{user.totalSolved}</div>
                      <div className="text-muted-foreground">Solved</div>
                    </div>
                  </div>

                  {/* Rank Badge */}
                  <Badge className={getRankColor(user.rank)}>
                    <Medal className="w-3 h-3 mr-1" />
                    {getRankName(user.rank)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rest of Leaderboard */}
      {rest.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rest.map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  {/* Rank */}
                  <Badge variant="outline" className={`${getRankBadgeColor(user.rank)} font-bold min-w-[3rem] justify-center`}>
                    #{user.rank}
                  </Badge>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 items-center">
                    <div className="text-right">
                      <div className="font-semibold">{user.totalXP}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{user.totalSolved}</div>
                      <div className="text-xs text-muted-foreground">Solved</div>
                    </div>
                    <Badge className={`${getRankColor(user.rank)} hidden sm:flex`}>
                      {getRankName(user.rank)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {leaderboard.length === 0 && !loading && (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No users on the leaderboard yet</p>
        </Card>
      )}
    </div>
  );
}
