'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserStats } from '@/lib/api';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';

interface StatsGridProps {
  stats: UserStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  // Question type stats
  const typeStats = [
    { 
      type: 'Text Completion' as const,
      abbr: 'TC',
      total: stats.tcSolved
    },
    { 
      type: 'Sentence Equivalence' as const,
      abbr: 'SE',
      total: stats.seSolved
    },
    { 
      type: 'Reading Comprehension' as const,
      abbr: 'RC',
      total: stats.rcSolved
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Question Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Question Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {typeStats.map((stat) => {
            const totalSolved = stats.totalSolved;
            const percentage = totalSolved > 0 ? Math.round((stat.total / totalSolved) * 100) : 0;
            return (
              <div key={stat.abbr} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QuestionTypeBadge type={stat.type} />
                    <span className="text-sm font-medium">{stat.abbr}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stat.total} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
            <span className="text-lg font-semibold">
              {stats.totalAttempts > 0 
                ? Math.round((stats.totalSolved / stats.totalAttempts) * 100) 
                : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Attempts</span>
            <span className="text-lg font-semibold">{stats.totalAttempts}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Solved</span>
            <span className="text-lg font-semibold">{stats.totalSolved}</span>
          </div>
        </CardContent>
      </Card>

      {/* Streak Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Streaks & Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Streak</span>
            <span className="text-lg font-semibold">{stats.currentStreak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Longest Streak</span>
            <span className="text-lg font-semibold">{stats.longestStreak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Login</span>
            <span className="text-sm">
              {new Date(stats.lastLoginDate).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
