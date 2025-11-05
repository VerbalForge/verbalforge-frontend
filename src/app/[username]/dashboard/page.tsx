'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserProfile, ActivityCalendarResponse } from '@/lib/models/user';
import { userService } from '@/lib/services/userService';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsOverview } from '@/components/profile/StatsOverview';
import { ActivityCalendar } from '@/components/profile/ActivityCalendar';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<ActivityCalendarResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [profileData, statsData, activityResponse] = await Promise.all([
          userService.getUserProfile(username),
          userService.getUserStatsByUsername(username),
          userService.getActivityCalendar(username, 365)
        ]);
        
        // Combine into UserProfile structure
        setProfile({
          user: profileData.user,
          stats: statsData,
          recent_activity: [] // Not used anymore
        });
        
        setActivities(activityResponse);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">{error || 'Profile not found'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Stats Overview - Combined component */}
      <StatsOverview stats={profile.stats} />

      {/* Activity Calendar */}
      <ActivityCalendar activities={activities} days={365} />

      {/* Recent Activity */}
      <RecentActivity username={username} />
    </div>
  );
}