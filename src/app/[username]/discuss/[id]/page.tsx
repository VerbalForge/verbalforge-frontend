'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MinimalTiptap } from '@/components/ui/shadcn-io/minimal-tiptap';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ThumbsUp, MessageCircle, Eye, MoreVertical, Loader2, Edit, Trash, ArrowLeft, RefreshCw } from 'lucide-react';
import { Discussion } from '@/lib/models/discussion';
import { discussionService } from '@/lib/services/discussionService';
import { QuestionPreview } from '@/components/discussions/QuestionPreview';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { CommentCard } from '@/components/CommentCard';

export default function DiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const username = params.username as string;
  const discussionId = params.id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDiscussion, setDeletingDiscussion] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionId]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getDiscussionById(discussionId);
      setDiscussion(data);
      // Increment view
      await discussionService.incrementDiscussionView(discussionId);
    } catch (error) {
      toast.error('Failed to load discussion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await discussionService.getDiscussionById(discussionId);
      setDiscussion(data);
      toast.success('Discussion refreshed');
    } catch (error) {
      toast.error('Failed to refresh discussion');
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLikeDiscussion = async () => {
    if (!discussion) return;
    
    try {
      const result = await discussionService.toggleDiscussionLike(discussionId);
      setDiscussion({
        ...discussion,
        likes: result.liked ? discussion.likes + 1 : discussion.likes - 1,
        likedBy: result.liked
          ? [...discussion.likedBy, user?.id || '']
          : discussion.likedBy.filter(id => id !== user?.id),
      });
    } catch (error) {
      toast.error('Failed to update like');
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await discussionService.addComment(discussionId, { text: commentText });
      setCommentText('');
      await fetchDiscussion();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!discussion) return;

    try {
      const result = await discussionService.toggleCommentLike(discussionId, commentId);
      const updatedComments = discussion.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: result.liked ? comment.likes + 1 : comment.likes - 1,
            likedBy: result.liked
              ? [...comment.likedBy, user?.id || '']
              : comment.likedBy.filter(id => id !== user?.id),
          };
        }
        return comment;
      });
      setDiscussion({ ...discussion, comments: updatedComments });
    } catch (error) {
      toast.error('Failed to update like');
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await discussionService.deleteComment(discussionId, commentId);
      await fetchDiscussion();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error(error);
    }
  };

  const handleEditComment = async (commentId: string, newText: string) => {
    try {
      await discussionService.updateComment(discussionId, commentId, { text: newText });
      await fetchDiscussion();
      toast.success('Comment updated');
    } catch (error) {
      toast.error('Failed to update comment');
      console.error(error);
    }
  };

  const handleDeleteDiscussion = async () => {
    try {
      setDeletingDiscussion(true);
      await discussionService.deleteDiscussion(discussionId);
      toast.success('Discussion deleted');
      router.push(`/${username}/discuss`);
    } catch (error) {
      toast.error('Failed to delete discussion');
      console.error(error);
    } finally {
      setDeletingDiscussion(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Discussion not found</p>
        <Button
          variant="outline"
          onClick={() => router.push(`/${username}/discuss`)}
          className="mt-4"
        >
          Back to Discussions
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === discussion.createdBy;
  const hasLiked = discussion.likedBy.includes(user?.id || '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${username}/discuss`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discussions
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{discussion.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {discussion.createdByName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{discussion.createdByName}</p>
                  <p>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
              {discussion.tags && discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/${username}/discuss/${discussionId}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Show linked question if present */}
          {discussion.linkedQuestion && (
            <div className="mb-6">
              <QuestionPreview 
                linkedQuestion={discussion.linkedQuestion} 
                username={username}
                showLink={true}
              />
            </div>
          )}
          
          {/* Always show description */}
          <div
            className="prose prose-sm dark:prose-invert max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: discussion.description }}
          />
          
          <Separator className="my-6" />

          <div className="flex items-center gap-6 text-sm">
            <Button
              variant={hasLiked ? 'default' : 'ghost'}
              size="sm"
              onClick={handleLikeDiscussion}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {discussion.likes}
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{discussion.views} views</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{discussion.commentCount} comments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments ({discussion.commentCount})</h2>
        
        <div className="border rounded-lg py-3 px-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarFallback className="text-xs">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mb-3">
                <MinimalTiptap
                  content={commentText}
                  onChange={setCommentText}
                  placeholder="Add your comment here..."
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || submittingComment}
                  size="sm"
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Comment'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg divide-y">
          {discussion.comments.length > 0 ? (
            [...discussion.comments]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment) => {
              const commentHasLiked = comment.likedBy.includes(user?.id || '');
              const isCommentOwner = user?.id === comment.userId;

              return (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  username={comment.username}
                  text={comment.text}
                  createdAt={comment.createdAt}
                  likes={comment.likes}
                  hasLiked={commentHasLiked}
                  isOwner={isCommentOwner}
                  onLike={handleLikeComment}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                />
              );
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discussion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this discussion? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDiscussion}
              disabled={deletingDiscussion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingDiscussion ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
