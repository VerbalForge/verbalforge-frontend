'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Sample progress data
const progressData = {
  currentStreak: 7,
  longestStreak: 15,
  totalPractices: 34,
  totalTime: 142, // in minutes
  completedQuestions: 8,
  totalQuestions: 12,
  level: 3,
  levelProgress: 65,
  nextLevelPoints: 500,
  currentPoints: 325,
};

const recentActivity = [
  {
    id: 1,
    title: 'Introduction Speech',
    date: '2025-10-04',
    score: 85,
    duration: '2m 15s',
    feedback: 'Great pace and clarity!',
  },
  {
    id: 2,
    title: 'Storytelling',
    date: '2025-10-03',
    score: 92,
    duration: '3m 45s',
    feedback: 'Excellent emotional connection',
  },
  {
    id: 3,
    title: 'Product Pitch',
    date: '2025-10-02',
    score: 78,
    duration: '3m 20s',
    feedback: 'Good structure, work on persuasion',
  },
  {
    id: 4,
    title: 'Team Motivation',
    date: '2025-10-01',
    score: 88,
    duration: '2m 55s',
    feedback: 'Very energetic and inspiring',
  },
  {
    id: 5,
    title: 'Introduction Speech',
    date: '2025-09-30',
    score: 81,
    duration: '2m 10s',
    feedback: 'Clear delivery, good pace',
  },
];

const categoryProgress = [
  { name: 'Personal', completed: 3, total: 4, percentage: 75 },
  { name: 'Business', completed: 2, total: 5, percentage: 40 },
  { name: 'Debate', completed: 0, total: 2, percentage: 0 },
  { name: 'Creative', completed: 1, total: 3, percentage: 33 },
  { name: 'Technical', completed: 1, total: 2, percentage: 50 },
  { name: 'Leadership', completed: 1, total: 3, percentage: 33 },
];

const achievements = [
  { id: 1, title: 'First Steps', description: 'Complete your first practice', earned: true, icon: '🎯' },
  { id: 2, title: 'Week Warrior', description: 'Maintain a 7-day streak', earned: true, icon: '🔥' },
  { id: 3, title: 'Perfect Score', description: 'Score 100% on any practice', earned: false, icon: '⭐' },
  { id: 4, title: 'Consistent Learner', description: 'Practice 30 days in a row', earned: false, icon: '📚' },
  { id: 5, title: 'Master Speaker', description: 'Complete all practice questions', earned: false, icon: '🏆' },
  { id: 6, title: 'Community Helper', description: 'Get 50 likes on forum posts', earned: false, icon: '💬' },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Streak</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              🔥 {progressData.currentStreak}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Longest Streak</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              ⭐ {progressData.longestStreak}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">days achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Practices</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              🎯 {progressData.totalPractices}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">sessions completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Practice Time</CardDescription>
            <CardTitle className="text-4xl flex items-center gap-2">
              ⏱️ {progressData.totalTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">minutes total</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
          <CardDescription>
            Level {progressData.level} - {progressData.currentPoints}/{progressData.nextLevelPoints} XP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressData.levelProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {progressData.nextLevelPoints - progressData.currentPoints} XP until Level {progressData.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Category</CardTitle>
          <CardDescription>
            {progressData.completedQuestions}/{progressData.totalQuestions} questions completed overall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryProgress.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {category.completed}/{category.total}
                  </span>
                </div>
                <Progress value={category.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">{activity.date}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{activity.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.feedback}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`text-lg font-bold ${getScoreColor(activity.score)}`}
                  >
                    {activity.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            {achievements.filter(a => a.earned).length}/{achievements.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.earned
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/50 border-muted opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 border-green-300">
                    ✓ Earned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}