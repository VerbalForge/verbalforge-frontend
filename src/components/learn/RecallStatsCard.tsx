'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, XCircle, BookOpen } from 'lucide-react';
import { useWordRecall } from '@/hooks/useWordRecall';

interface RecallStatsCardProps {
  totalWords: number;
}

export function RecallStatsCard({ totalWords }: RecallStatsCardProps) {
  const { getRecallStats } = useWordRecall();
  const stats = getRecallStats();

  if (stats.total === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Learning Progress
        </CardTitle>
        <CardDescription>
          Track your vocabulary recall performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">{stats.recalled}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Check className="h-3 w-3" />
              Known
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-red-600">{stats.notRecalled}</div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <XCircle className="h-3 w-3" />
              Need Practice
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-muted-foreground">{totalWords - stats.total}</div>
            <div className="text-sm text-muted-foreground">
              Not Attempted
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{stats.percentage}% recalled</span>
          </div>
          <Progress 
            value={stats.percentage} 
            className="h-2 bg-gray-200"
          />
          <div className="text-xs text-muted-foreground text-center">
            {stats.total} of {totalWords} words attempted
          </div>
        </div>
      </CardContent>
    </Card>
  );
}