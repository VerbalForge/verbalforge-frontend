import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, getRankName, getRankColor } from '@/lib/utils/profile';
import { LeaderboardEntry } from '@/lib/models/user';

interface LeaderboardRowProps {
  user: LeaderboardEntry;
  isCurrentUser: boolean;
}

const getRankIcon = (rank: number) => {
  if (rank === 1) return '# 1';
  if (rank === 2) return '# 2';
  if (rank === 3) return '# 3';
  if (rank === 0) return '# -';
  return `#${rank}`;
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300';
  if (rank === 2) return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-300';
  if (rank === 3) return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-300';
  return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
};

export function LeaderboardRow({ user, isCurrentUser }: LeaderboardRowProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
        user.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
      } ${isCurrentUser ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Rank */}
        <div className="flex items-center gap-2 min-w-[60px]">
          <Badge
            variant="outline"
            className={`text-base font-bold px-2 py-1 ${getRankBadgeColor(user.rank)}`}
          >
            {getRankIcon(user.rank)}
          </Badge>
        </div>

        {/* Avatar and Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">
              {user.name} {isCurrentUser && <span className="text-primary">(You)</span>}
            </p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* Stats - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm font-bold text-primary">{user.totalXP.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{user.totalSolved}</p>
            <p className="text-xs text-muted-foreground">Solved</p>
          </div>
          <div className="text-center">
            <Badge variant="outline" className={getRankColor(user.totalXP)}>
              {getRankName(user.totalXP)}
            </Badge>
          </div>
        </div>

        {/* Stats - Mobile */}
        <div className="flex md:hidden items-center gap-3 text-sm">
          <Badge variant="outline" className="font-bold">
            {user.totalXP.toLocaleString()} XP
          </Badge>
        </div>
      </div>
    </div>
  );
}
