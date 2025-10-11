import { useState, useEffect, useMemo } from 'react';
import { LeaderboardEntry, UserProfile } from '@/lib/models/user';
import { userService } from '@/lib/services/userService';

export function useLeaderboard(currentUsername: string) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch leaderboard
        const leaderboardResponse = await userService.getLeaderboard(100);
        setLeaderboard(leaderboardResponse || []);

        // Fetch current user's profile to get their stats
        try {
          const profile = await userService.getUserProfile(currentUsername);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [currentUsername]);

  // Memoized computed values
  const topPerformer = useMemo(
    () => (leaderboard.length > 0 ? leaderboard[0] : null),
    [leaderboard]
  );

  const topSolved = useMemo(
    () =>
      leaderboard.length > 0
        ? [...leaderboard].sort((a, b) => b.totalSolved - a.totalSolved)[0]
        : null,
    [leaderboard]
  );

  const userInLeaderboard = useMemo(
    () => leaderboard.find((entry) => entry.username === currentUsername),
    [leaderboard, currentUsername]
  );

  const userRank = userProfile?.user?.rank;

  return {
    leaderboard,
    userProfile,
    loading,
    error,
    topPerformer,
    topSolved,
    userInLeaderboard,
    userRank,
  };
}
