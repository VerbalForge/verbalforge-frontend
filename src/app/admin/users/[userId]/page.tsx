'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, Target, TrendingUp } from 'lucide-react';
import { adminService, UserAggregatedStats } from '@/lib/services/adminService';
import { StatsCard } from '@/components/admin/StatsCard';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { toast } from 'sonner';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [stats, setStats] = useState<UserAggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    document.title = username ? `${username} - User Activity - Admin Portal` : 'User Activity - Admin Portal';
  }, [username]);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const statsResponse = await adminService.getUserStats(userId);
      setStats(statsResponse);
      setUsername(statsResponse.username);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard
            title="Total Attempted"
            value={stats.total_attempted || 0}
            icon={Activity}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBgColor="bg-blue-100 dark:bg-blue-950"
            loading={loading}
          />
          <StatsCard
            title="Accuracy Rate"
            value={`${((stats.accuracy_rate || 0) * 100).toFixed(1)}%`}
            icon={Target}
            iconColor="text-green-600 dark:text-green-400"
            iconBgColor="bg-green-100 dark:bg-green-950"
            loading={loading}
          />
          <StatsCard
            title="Most Attempted"
            value={stats.most_attempted_type || 'N/A'}
            icon={TrendingUp}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBgColor="bg-purple-100 dark:bg-purple-950"
            loading={loading}
          />
        </div>
      )}

      {/* Type Breakdown */}
      {stats && stats.type_breakdown && Object.keys(stats.type_breakdown).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.entries(stats.type_breakdown).map(([type, data]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {data.attempted} attempts
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Correct:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {data.correct}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Accuracy:</span>
                      <span className="font-semibold">
                        {data.attempted > 0
                          ? `${((data.correct / data.attempted) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Viewer */}
      <RecentActivity 
        userId={userId} 
        limit={1000} 
        title="All Activities" 
        enablePagination={true}
        itemsPerPage={20}
      />
    </div>
  );
}
