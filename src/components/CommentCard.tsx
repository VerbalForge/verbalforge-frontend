'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MinimalTiptap } from '@/components/ui/shadcn-io/minimal-tiptap';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThumbsUp, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CommentCardProps {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  isOwner: boolean;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  onEdit?: (commentId: string, newText: string) => void;
}

export function CommentCard({
  id,
  username,
  text,
  createdAt,
  likes,
  hasLiked,
  isOwner,
  onLike,
  onDelete,
  onEdit,
}: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleSaveEdit = () => {
    if (onEdit && editText.trim()) {
      onEdit(id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(text);
    setIsEditing(false);
  };

  return (
    <div className="group">
      <div className="flex gap-3 py-3 px-4">
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarFallback className="text-xs">
            {username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{username}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true }).replace('about ', '')}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2 mt-2">
              <MinimalTiptap
                content={editText}
                onChange={setEditText}
                placeholder="Edit your comment..."
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editText.trim()}
                >
                  Update Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed mb-2"
                dangerouslySetInnerHTML={{ __html: text }}
              />
              
              <div className="flex items-center gap-2 -ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs gap-1.5",
                    hasLiked && "text-primary"
                  )}
                  onClick={() => onLike(id)}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {likes > 0 && <span>{likes}</span>}
                </Button>
              </div>
            </>
          )}
        </div>

        {!isEditing && isOwner && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
