'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { feedbackService, Feedback } from '@/lib/services/feedbackService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [feedbackToView, setFeedbackToView] = useState<Feedback | null>(null);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await feedbackService.getAllFeedback();
      setFeedbacks(response.feedback || []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleView = (feedback: Feedback) => {
    setFeedbackToView(feedback);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await feedbackService.updateFeedbackStatus(id, { status: status as 'new' | 'reviewed' | 'archived' });
      toast.success('Feedback status updated');
      loadFeedbacks();
    } catch (error) {
      console.error('Failed to update feedback:', error);
      toast.error('Failed to update feedback');
    }
  };

  const handleDelete = (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      await feedbackService.deleteFeedback(feedbackToDelete.id);
      toast.success('Feedback deleted successfully');
      loadFeedbacks();
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
      toast.error('Failed to delete feedback');
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      suggestion: 'default',
      bug: 'destructive',
      general: 'secondary',
      praise: 'outline',
    };
    return <Badge variant={variants[type] || 'secondary'}>{type}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      new: 'default',
      reviewed: 'secondary',
      archived: 'outline',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns: Column<Feedback>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (feedback) => (
        <span className="text-sm">{feedback.email || 'Anonymous'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (feedback) => getTypeBadge(feedback.type),
    },
    {
      key: 'message',
      header: 'Message',
      render: (feedback) => (
        <div className="max-w-md">
          <p className="text-sm truncate">{feedback.message}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (feedback) => (
        <Select
          value={feedback.status}
          onValueChange={(value) => handleStatusUpdate(feedback.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (feedback) => (
        <span className="text-sm text-muted-foreground">
          {new Date(feedback.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (feedback) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(feedback)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(feedback)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={feedbacks}
        columns={columns}
        loading={loading}
        emptyMessage="No feedback found"
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName="this feedback"
        description="This will permanently delete this feedback."
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Full feedback message and details
            </DialogDescription>
          </DialogHeader>
          {feedbackToView && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{feedbackToView.email || 'Anonymous'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <div className="mt-1">{getTypeBadge(feedbackToView.type)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{feedbackToView.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(feedbackToView.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <p className="text-sm">{new Date(feedbackToView.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
