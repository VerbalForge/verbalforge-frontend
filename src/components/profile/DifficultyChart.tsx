'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface DifficultyChartProps {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export function DifficultyChart({ easySolved, mediumSolved, hardSolved }: DifficultyChartProps) {
  const totalQuestions = easySolved + mediumSolved + hardSolved;

  const chartData = [
    { difficulty: 'Easy', value: easySolved, fill: '#10b981' },
    { difficulty: 'Medium', value: mediumSolved, fill: '#eab308' },
    { difficulty: 'Hard', value: hardSolved, fill: '#ef4444' },
  ];

  const chartConfig = {
    value: {
      label: 'Questions',
    },
    easy: {
      label: 'Easy',
      color: '#10b981',
    },
    medium: {
      label: 'Medium',
      color: '#eab308',
    },
    hard: {
      label: 'Hard',
      color: '#ef4444',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Difficulty Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-10">
          {/* Pie Chart */}
          <div className="relative flex-shrink-0">
            <ChartContainer
              config={chartConfig}
              className="w-[140px] h-[140px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="difficulty"
                  innerRadius={50}
                  outerRadius={70}
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold">{totalQuestions}</div>
              <div className="text-[10px] text-muted-foreground">Solved</div>
            </div>
          </div>

          {/* Difficulty Stats */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Easy</span>
              </div>
              <span className="text-sm font-bold">{easySolved}/{totalQuestions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Medium</span>
              </div>
              <span className="text-sm font-bold">{mediumSolved}/{Math.floor(totalQuestions)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Hard</span>
              </div>
              <span className="text-sm font-bold">{hardSolved}/{Math.floor(totalQuestions)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
