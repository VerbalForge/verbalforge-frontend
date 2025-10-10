'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, Pin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DiscussionHeaderProps {
  title: string;
  authorName: string;
  authorInitial: string;
  createdAt: string;
  tags?: string[];
  isPinned?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  className?: string;
}

export function DiscussionHeader({
  title,
  authorName,
  authorInitial,
  createdAt,
  tags = [],
  isPinned = false,
  isOwner = false,
  onEdit,
  onDelete,
  onPin,
  className = '',
}: DiscussionHeaderProps) {
  return (
    <div className={`group ${className}`}>
      <div className="flex gap-3 py-3 px-4">
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarFallback className="text-xs">
            {authorInitial}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isPinned && (
              <Pin className="h-3.5 w-3.5 text-primary" />
            )}
            <span className="font-semibold text-sm">{authorName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true }).replace('about ', '')}
            </span>
          </div>

          <h1 className="text-xl font-bold mb-1">{title}</h1>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {isOwner && (onEdit || onDelete || onPin) && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onPin && (
                  <DropdownMenuItem onClick={onPin}>
                    <Pin className="h-4 w-4 mr-2" />
                    {isPinned ? 'Unpin' : 'Pin'}
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
