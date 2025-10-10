'use client';

import { CommentCard } from '../CommentCard';

interface CommentSectionProps {
  comments: Array<{
    id: string;
    username: string;
    text: string;
    createdAt: string;
    likes: number;
    likedBy: string[];
    userId: string;
  }>;
  currentUserId?: string;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit?: (commentId: string, newText: string) => void;
}

export function CommentSection({
  comments,
  currentUserId,
  onLike,
  onDelete,
  onEdit,
}: CommentSectionProps) {
  return (
    <div className="border rounded-lg divide-y">
      {comments.length > 0 ? (
        comments.map((comment) => {
          const commentHasLiked = comment.likedBy.includes(currentUserId || '');
          const isCommentOwner = currentUserId === comment.userId;

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
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          );
        })
      ) : (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
}
