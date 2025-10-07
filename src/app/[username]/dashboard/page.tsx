'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiService, UserProfile, UserActivityLog } from '@/lib/api';
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
  const [activities, setActivities] = useState<UserActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const profileData = await apiService.getUserProfile(username);
        setProfile(profileData);
        
        // Fetch activity calendar (last 365 days)
        const activityResponse = await apiService.getActivityCalendar(username, 365);
        setActivities(activityResponse.activities);
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
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader profile={profile} />

      {/* Stats Overview - Combined component */}
      <StatsOverview stats={profile.stats} />

      {/* Activity Calendar */}
      <ActivityCalendar activities={activities} days={365} />

      {/* Recent Activity */}
      <RecentActivity questions={profile.recent_activity} />
    </div>
  );
}