'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCircleProps {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export function StatsCircle({ total, easy, medium, hard }: StatsCircleProps) {
  const totalQuestions = 905; // Total available questions
  
  // Calculate arc lengths for each difficulty based on proportion
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentages
  const easyPercent = total > 0 ? (easy / total) : 0;
  const mediumPercent = total > 0 ? (medium / total) : 0;
  const hardPercent = total > 0 ? (hard / total) : 0;
  
  // Calculate arc lengths
  const easyArc = circumference * easyPercent;
  const mediumArc = circumference * mediumPercent;
  const hardArc = circumference * hardPercent;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Questions Solved</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {/* Segmented Circle */}
          <div className="relative w-40 h-40 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
                opacity="0.1"
              />
              
              {/* Easy arc (green) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray={`${easyArc} ${circumference - easyArc}`}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
              
              {/* Medium arc (yellow) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#eab308"
                strokeWidth="12"
                strokeDasharray={`${mediumArc} ${circumference - mediumArc}`}
                strokeDashoffset={-easyArc}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
              
              {/* Hard arc (red) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray={`${hardArc} ${circumference - hardArc}`}
                strokeDashoffset={-(easyArc + mediumArc)}
                className="transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500">✓</span> Solved
              </div>
            </div>
          </div>
          
          {/* Difficulty Stats */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Easy</span>
              </div>
              <span className="text-sm font-bold">{easy}/{Math.floor(totalQuestions * 0.33)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Medium</span>
              </div>
              <span className="text-sm font-bold">{medium}/{Math.floor(totalQuestions * 0.33)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Hard</span>
              </div>
              <span className="text-sm font-bold">{hard}/{Math.floor(totalQuestions * 0.34)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
