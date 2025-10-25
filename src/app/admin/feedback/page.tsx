'use client';

import { useEffect, useState, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { feedbackService, type Feedback } from '@/lib/services/feedbackService';
import { toast } from 'sonner';

export default function AdminFeedbackPage() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFeedbacks();
    }
  }, [user]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllFeedback();
      setFeedbacks(data?.feedback ?? []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await feedbackService.updateFeedbackStatus(id, { status: status as 'new' | 'reviewed' | 'archived' });
      toast.success('Feedback status updated');
      // Update local state instead of refetching
      setFeedbacks(feedbacks.map(feedback => 
        feedback.id === id ? { ...feedback, status: status as 'new' | 'reviewed' | 'archived' } : feedback
      ));
    } catch (error) {
      console.error('Failed to update feedback:', error);
      toast.error('Failed to update feedback');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await feedbackService.deleteFeedback(id);
      toast.success('Feedback deleted');
      // Remove from local state instead of refetching
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
      if (expandedId === id) setExpandedId(null);
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User Feedback</CardTitle>
          <CardDescription>
            Manage user feedback, suggestions, and bug reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!feedbacks || feedbacks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No feedback submissions yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <Fragment key={feedback.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === feedback.id ? null : feedback.id)}>
                      <TableCell>
                        {expandedId === feedback.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {feedback.email || 'Anonymous'}
                      </TableCell>
                      <TableCell>{getTypeBadge(feedback.type)}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate">{feedback.message}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(feedback.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === feedback.id && (
                      <TableRow key={`${feedback.id}-expanded`}>
                        <TableCell></TableCell>
                        <TableCell colSpan={5}>
                          <div className="py-4 space-y-2">
                            <div>
                              <span className="font-semibold">Full Message:</span>
                              <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{feedback.message}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
