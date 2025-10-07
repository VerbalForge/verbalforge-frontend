'use client';

import { UserStats } from '@/lib/api';
import { DifficultyChart } from './DifficultyChart';
import { QuestionTypeChart } from './QuestionTypeChart';
import { PerformanceStats } from './PerformanceStats';

interface StatsOverviewProps {
  stats: UserStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
        <DifficultyChart
          totalSolved={stats.totalSolved}
          easySolved={stats.easySolved}
          mediumSolved={stats.mediumSolved}
          hardSolved={stats.hardSolved}
        />

      
      <QuestionTypeChart
        tcSolved={stats.tcSolved}
        seSolved={stats.seSolved}
        rcSolved={stats.rcSolved}
      />
      
      <PerformanceStats
        totalSolved={stats.totalSolved}
        totalAttempts={stats.totalAttempts}
        totalXP={stats.totalXP}
      />
    </div>
  );
}
