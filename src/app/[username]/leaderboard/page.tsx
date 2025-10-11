'use client';

import { useParams } from 'next/navigation';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { UserRankingCard } from '@/components/leaderboard/UserRankingCard';
import { LeaderboardSkeleton } from '@/components/leaderboard/LeaderboardSkeleton';
import { LeaderboardError } from '@/components/leaderboard/LeaderboardError';

export default function LeaderboardPage() {
  const params = useParams();
  const currentUsername = params.username as string;

  const {
    leaderboard,
    userProfile,
    loading,
    error,
    topPerformer,
    topSolved,
    userInLeaderboard,
    userRank,
  } = useLeaderboard(currentUsername);

  if (loading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return <LeaderboardError error={error} />;
  }

  const showUserRankingCard = userProfile && !userInLeaderboard && userRank && userRank > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xl">See how you rank against other learners!</p>
        </div>
      </div>

      <LeaderboardStats
        topPerformer={topPerformer}
        topSolved={topSolved}
        userRank={userRank}
        userXP={userProfile?.user?.totalXP || 0}
      />

      <LeaderboardTable leaderboard={leaderboard} currentUsername={currentUsername} />

      {showUserRankingCard && (
        <UserRankingCard
          userProfile={userProfile}
          userRank={userRank}
          leaderboard={leaderboard}
        />
      )}
    </div>
  );
}