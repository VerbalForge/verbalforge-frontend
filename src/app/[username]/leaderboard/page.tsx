'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Sample leaderboard data
const leaderboardData = [
  {
    rank: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    points: 2847,
    streak: 23,
    practices: 156,
    level: 8,
    change: 'up',
  },
  {
    rank: 2,
    name: 'Michael Chen',
    initials: 'MC',
    points: 2654,
    streak: 18,
    practices: 142,
    level: 7,
    change: 'same',
  },
  {
    rank: 3,
    name: 'Emily Rodriguez',
    initials: 'ER',
    points: 2501,
    streak: 15,
    practices: 138,
    level: 7,
    change: 'up',
  },
  {
    rank: 4,
    name: 'David Kim',
    initials: 'DK',
    points: 2389,
    streak: 21,
    practices: 125,
    level: 7,
    change: 'down',
  },
  {
    rank: 5,
    name: 'Lisa Wang',
    initials: 'LW',
    points: 2276,
    streak: 12,
    practices: 119,
    level: 6,
    change: 'up',
  },
  {
    rank: 6,
    name: 'James Wilson',
    initials: 'JW',
    points: 2145,
    streak: 9,
    practices: 108,
    level: 6,
    change: 'same',
  },
  {
    rank: 7,
    name: 'Anna Martinez',
    initials: 'AM',
    points: 2034,
    streak: 14,
    practices: 102,
    level: 6,
    change: 'up',
  },
  {
    rank: 8,
    name: 'Robert Taylor',
    initials: 'RT',
    points: 1923,
    streak: 7,
    practices: 95,
    level: 5,
    change: 'down',
  },
  {
    rank: 9,
    name: 'Jennifer Lee',
    initials: 'JL',
    points: 1867,
    streak: 11,
    practices: 89,
    level: 5,
    change: 'up',
  },
  {
    rank: 10,
    name: 'Christopher Brown',
    initials: 'CB',
    points: 1756,
    streak: 6,
    practices: 84,
    level: 5,
    change: 'same',
  },
];

const topPerformers = [
  { title: 'Longest Streak', name: 'Sarah Johnson', value: '23 days', icon: '🔥' },
  { title: 'Most Practices', name: 'Sarah Johnson', value: '156 sessions', icon: '🎯' },
  { title: 'Highest Level', name: 'Sarah Johnson', value: 'Level 8', icon: '⭐' },
  { title: 'Most Active Today', name: 'Emily Rodriguez', value: '8 practices', icon: '⚡' },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  if (rank === 2) return 'bg-muted border-border text-foreground';
  if (rank === 3) return 'bg-orange-100 border-orange-300 text-orange-800';
  return 'bg-blue-50 border-blue-200 text-blue-800';
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
};

const getChangeIcon = (change: string) => {
  if (change === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (change === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-2">
            See how you rank against other learners
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeFilter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('today')}
          >
            Today
          </Button>
          <Button
            variant={timeFilter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('week')}
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('month')}
          >
            This Month
          </Button>
          <Button
            variant={timeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topPerformers.map((performer, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">{performer.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{performer.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{performer.name}</p>
                  <p className="text-xs text-muted-foreground">{performer.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>
            Top performers based on points, streak, and practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                  user.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <Badge
                      variant="outline"
                      className={`text-base font-bold px-2 py-1 ${getRankColor(user.rank)}`}
                    >
                      {getRankIcon(user.rank)}
                    </Badge>
                    {getChangeIcon(user.change)}
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                  </div>

                  {/* Stats - Hidden on mobile */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-bold text-primary">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-orange-600">🔥 {user.streak}</p>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-blue-600">{user.practices}</p>
                      <p className="text-xs text-muted-foreground">Practices</p>
                    </div>
                  </div>

                  {/* Stats - Mobile */}
                  <div className="flex md:hidden items-center gap-3 text-sm">
                    <Badge variant="outline" className="font-bold">
                      {user.points.toLocaleString()} XP
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Ranking Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Your Ranking
          </CardTitle>
          <CardDescription>
            Your current position on the leaderboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-base font-bold px-3 py-1">
                #47
              </Badge>
              <div>
                <p className="font-semibold">You</p>
                <p className="text-xs text-muted-foreground">Level 3</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm font-bold text-primary">325</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-orange-600">🔥 7</p>
                <p className="text-xs text-muted-foreground">Streak</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-600">34</p>
                <p className="text-xs text-muted-foreground">Practices</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Keep practicing! You&apos;re only <span className="font-bold text-primary">1431 points</span> away from the top 10! 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
