'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface QuestionTypeChartProps {
  tcSolved: number;
  seSolved: number;
  rcSolved: number;
}

export function QuestionTypeChart({ tcSolved, seSolved, rcSolved }: QuestionTypeChartProps) {
  const total = tcSolved + seSolved + rcSolved;

  const chartData = [
    { type: 'TC', value: tcSolved, fill: '#14b8a6' }, // Teal-500
    { type: 'SE', value: seSolved, fill: '#3b82f6' }, // Blue-500
    { type: 'RC', value: rcSolved, fill: '#a855f7' }, // Purple-500
  ];

  const chartConfig = {
    value: {
      label: 'Questions',
    },
    tc: {
      label: 'Text Completion',
      color: '#14b8a6',
    },
    se: {
      label: 'Sentence Equivalence',
      color: '#3b82f6',
    },
    rc: {
      label: 'Reading Comprehension',
      color: '#a855f7',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Types</CardTitle>
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
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={70}
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold">{total}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Question Type Legend */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-sm font-medium">Text Completion</span>
              </div>
              <span className="text-sm font-bold">{tcSolved}/{total}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Sentence Eq.</span>
              </div>
              <span className="text-sm font-bold">{seSolved}/{total}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Reading Comp.</span>
              </div>
              <span className="text-sm font-bold">{rcSolved}/{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
