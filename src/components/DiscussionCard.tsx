'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Eye, Pin } from 'lucide-react';
import { Discussion } from '@/lib/models/discussion';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface DiscussionCardProps {
  discussion: Discussion;
  username: string;
}

export function DiscussionCard({ discussion, username }: DiscussionCardProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const description = stripHtml(discussion.description);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/${username}/discuss/${discussion.id}`}
            className="flex-1 hover:underline"
          >
            <h3 className="text-lg font-semibold line-clamp-2 flex items-center gap-2">
              {discussion.isPinned && (
                <Pin className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              {discussion.title}
            </h3>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {discussion.createdByName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>{discussion.createdByName}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateText(description)}
        </p>
        {discussion.tags && discussion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {discussion.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{discussion.views}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-4 w-4" />
          <span>{discussion.likes}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{discussion.commentCount}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
