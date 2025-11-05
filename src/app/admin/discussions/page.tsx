'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink } from 'lucide-react';
import { adminService, AdminDiscussion } from '@/lib/services/adminService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { toast } from 'sonner';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default function DiscussionsManagement() {
  const [discussions, setDiscussions] = useState<AdminDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discussionToDelete, setDiscussionToDelete] = useState<AdminDiscussion | null>(null);

  const loadDiscussions = async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await adminService.getAllDiscussions(ITEMS_PER_PAGE, skip);
      setDiscussions(response.discussions);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = (discussion: AdminDiscussion) => {
    setDiscussionToDelete(discussion);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!discussionToDelete) return;

    try {
      await adminService.deleteDiscussion(discussionToDelete.id);
      toast.success('Discussion deleted successfully');
      setDeleteDialogOpen(false);
      setDiscussionToDelete(null);
      loadDiscussions();
    } catch (error) {
      console.error('Failed to delete discussion:', error);
      toast.error('Failed to delete discussion');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: Column<AdminDiscussion>[] = [
    {
      key: 'username',
      header: 'User',
      render: (discussion) => (
        <div className="font-medium">
          {discussion.username || 'Unknown User'}
        </div>
      ),
    },
    {
      key: 'context',
      header: 'Context',
      render: (discussion) => {
        if (discussion.questionId && discussion.questionTitle) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Question</Badge>
              <span className="text-sm truncate max-w-xs" title={discussion.questionTitle}>
                {discussion.questionTitle}
              </span>
            </div>
          );
        }
        if (discussion.passageId && discussion.passageTitle) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Passage</Badge>
              <span className="text-sm truncate max-w-xs" title={discussion.passageTitle}>
                {discussion.passageTitle}
              </span>
            </div>
          );
        }
        return <span className="text-muted-foreground">No context</span>;
      },
    },
    {
      key: 'message',
      header: 'Message',
      render: (discussion) => (
        <div className="max-w-md truncate text-sm" title={discussion.message}>
          {discussion.message}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (discussion) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(discussion.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (discussion) => (
        <div className="flex gap-2">
          {discussion.questionId && (
            <Link href={`/admin/questions/${discussion.questionId}`}>
              <Button variant="ghost" size="sm" title="View Question">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {discussion.passageId && (
            <Link href={`/admin/passages/${discussion.passageId}`}>
              <Button variant="ghost" size="sm" title="View Passage">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(discussion)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">

      <DataTable
        data={discussions}
        columns={columns}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
        emptyMessage="No discussions found"
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Discussion?"
        description="This will permanently delete this discussion. This action cannot be undone."
      />
    </div>
  );
}
