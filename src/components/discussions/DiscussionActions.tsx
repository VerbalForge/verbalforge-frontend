'use client';

import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Eye } from 'lucide-react';

interface DiscussionActionsProps {
  likes: number;
  views: number;
  comments: number;
  hasLiked: boolean;
  onLike: () => void;
}

export function DiscussionActions({
  likes,
  views,
  comments,
  hasLiked,
  onLike,
}: DiscussionActionsProps) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <Button
        variant={hasLiked ? 'default' : 'ghost'}
        size="sm"
        onClick={onLike}
      >
        <ThumbsUp className="h-4 w-4 mr-2" />
        {likes}
      </Button>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{views} views</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        <span>{comments} comments</span>
      </div>
    </div>
  );
}
