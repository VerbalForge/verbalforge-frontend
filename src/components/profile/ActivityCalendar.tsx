'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserActivityLog } from '@/lib/api';
import { useMemo } from 'react';

interface ActivityCalendarProps {
  activities: UserActivityLog[];
  days?: number;
}

export function ActivityCalendar({ activities, days = 180 }: ActivityCalendarProps) {
  // Generate calendar data for the last N days
  const calendarData = useMemo(() => {
    // Create a map for quick lookup - handle null/undefined activities
    const activityMap = new Map((activities || []).map(a => [a.date, a]));
    const data: { date: string; count: number; xp: number }[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr);
      
      data.push({
        date: dateStr,
        count: activity?.questionIds.length || 0,
        xp: activity?.xpGained || 0,
      });
    }
    
    return data;
  }, [days, activities]);

  // Get intensity level for color (0-4)
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  // Get color based on intensity
  const getColor = (intensity: number) => {
    const colors = [
      'bg-muted', // 0 - no activity
      'bg-green-200 dark:bg-green-900/40', // 1
      'bg-green-400 dark:bg-green-700/60', // 2
      'bg-green-600 dark:bg-green-500/80', // 3
      'bg-green-800 dark:bg-green-400', // 4
    ];
    return colors[intensity];
  };

  // Group by weeks with month separators
  type DayData = { date: string; count: number; xp: number };
  type WeekData = { days: DayData[]; isMonthSeparator?: boolean };
  
  const weeks = useMemo(() => {
    const weeksArray: WeekData[] = [];
    let currentWeek: DayData[] = [];
    let lastMonth = -1;
    
    calendarData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay();
      const currentMonth = new Date(day.date).getMonth();
      
      if (index === 0 && dayOfWeek !== 0) {
        // Fill empty days at the start
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: '', count: -1, xp: 0 });
        }
      }
      
      // Check if month changed
      if (lastMonth !== -1 && currentMonth !== lastMonth) {
        // Complete current week and add it
        while (currentWeek.length < 7) {
          currentWeek.push({ date: '', count: -1, xp: 0 });
        }
        weeksArray.push({ days: currentWeek });
        
        // Add month separator (empty column)
        weeksArray.push({ 
          days: Array(7).fill({ date: '', count: -1, xp: 0 }),
          isMonthSeparator: true 
        });
        
        currentWeek = [];
        
        // Fill empty days for the new week
        if (dayOfWeek !== 0) {
          for (let i = 0; i < dayOfWeek; i++) {
            currentWeek.push({ date: '', count: -1, xp: 0 });
          }
        }
      }
      
      currentWeek.push(day);
      lastMonth = currentMonth;
      
      if (dayOfWeek === 6 || index === calendarData.length - 1) {
        // Fill empty days at the end
        while (currentWeek.length < 7) {
          currentWeek.push({ date: '', count: -1, xp: 0 });
        }
        weeksArray.push({ days: currentWeek });
        currentWeek = [];
      }
    });
    
    return weeksArray;
  }, [calendarData]);

  const totalContributions = (activities || []).reduce((sum, a) => sum + a.questionIds.length, 0);
  const activeStreak = calculateStreak(calendarData);

  const getPeriodText = () => {
    if (days >= 365) return 'year';
    if (days >= 180) return '6 months';
    if (days >= 90) return '3 months';
    if (days >= 30) return 'month';
    return `${days} days`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity</CardTitle>
          <div className="text-sm text-muted-foreground">
            {totalContributions} questions in the last {getPeriodText()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="w-full overflow-x-auto">
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div 
                  key={weekIndex} 
                  className={`flex flex-col gap-1 ${week.isMonthSeparator ? 'opacity-0 w-2' : ''}`}
                >
                  {week.days.map((day, dayIndex) => {
                    if (day.count === -1) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }
                    
                    const intensity = getIntensity(day.count);
                    const dateObj = new Date(day.date);
                    const formattedDate = dateObj.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    });
                    
                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3 h-3 rounded-sm ${getColor(intensity)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="font-medium">{formattedDate}</div>
                          <div className="text-muted-foreground">
                            {day.count} {day.count === 1 ? 'question' : 'questions'} • {day.xp} XP
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Current streak: {activeStreak} days</div>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-sm ${getColor(i)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateStreak(data: { count: number }[]): number {
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
