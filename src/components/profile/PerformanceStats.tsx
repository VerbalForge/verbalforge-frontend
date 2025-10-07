'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceStatsProps {
  totalSolved: number;
  totalAttempts: number;
  totalXP: number;
}

export function PerformanceStats({ totalSolved, totalAttempts, totalXP }: PerformanceStatsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
            <span className="text-sm font-bold">
              {totalAttempts > 0 
                ? Math.round((totalSolved / totalAttempts) * 100) 
                : 0}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Attempts</span>
            <span className="text-sm font-bold">{totalAttempts}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total XP</span>
            <span className="text-sm font-bold">{totalXP.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
