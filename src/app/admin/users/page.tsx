'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { userService } from '@/lib/services/userService';
import { LeaderboardEntry } from '@/lib/models';
import { DataTable, Column } from '@/components/admin/DataTable';
import { toast } from 'sonner';

export default function UsersAnalytics() {
  const router = useRouter();
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const leaderboard = await userService.getLeaderboard(1000);
      setUsers(leaderboard);
      setFilteredUsers(leaderboard);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<LeaderboardEntry>[] = [
    {
      key: 'rank',
      header: 'Rank',
      render: (user) => (
        <div className="font-semibold">
          # {user.rank || '-'}
        </div>
      ),
    },
    {
      key: 'username',
      header: 'User',
      render: (user) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
        </div>
      ),
    },
    {
      key: 'totalSolved',
      header: 'Total Solved',
      render: (user) => (
        <Badge variant="secondary" className="font-mono">
          {user.totalSolved || 0}
        </Badge>
      ),
    },
    {
      key: 'streak',
      header: 'Streak',
      render: (user) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">{user.currentStreak || 0}</span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
      ),
    },
    {
      key: 'xp',
      header: 'XP',
      render: (user) => (
        <Badge variant="outline" className="font-mono">
          {user.totalXP || 0}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/users/${user.userId}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        data={filteredUsers}
        columns={columns}
        loading={loading}
        emptyMessage="No users found"
      />
    </div>
  );
}
