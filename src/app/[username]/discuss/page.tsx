'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageCircle, Eye, ThumbsUp, Loader2 } from 'lucide-react';
import { Discussion } from '@/lib/models/discussion';
import { discussionService } from '@/lib/services/discussionService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function DiscussionsPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [previousCursors, setPreviousCursors] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  // Extract unique tags from discussions - safely handle null/undefined
  const allTags = ['All', ...Array.from(new Set((discussions || []).flatMap(d => d.tags || [])))];

  const fetchDiscussions = async (newCursor?: string) => {
    try {
      setLoading(true);
      const response = await discussionService.getDiscussions({
        cursor: newCursor,
        limit: 20,
        sortBy: 'newest',
        tags: selectedTag !== 'All' ? [selectedTag] : undefined,
      });
      setDiscussions(response.discussions);
      setNextCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (error) {
      toast.error('Failed to load discussions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset cursor when tag changes
    setCursor(undefined);
    setPreviousCursors([]);
    fetchDiscussions(undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag]);

  const handleNextPage = () => {
    if (nextCursor) {
      setPreviousCursors([...previousCursors, cursor || '']);
      setCursor(nextCursor);
      fetchDiscussions(nextCursor);
    }
  };

  const handlePreviousPage = () => {
    if (previousCursors.length > 0) {
      const newPreviousCursors = [...previousCursors];
      const prevCursor = newPreviousCursors.pop();
      setPreviousCursors(newPreviousCursors);
      setCursor(prevCursor || undefined);
      fetchDiscussions(prevCursor || undefined);
    }
  };

  const filteredDiscussions = selectedTag === 'All' 
    ? (discussions || [])
    : (discussions || []).filter(d => d.tags?.includes(selectedTag));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xl">
            Ask questions, share insights, and learn from the community
          </p>
        </div>
        <Button 
          className="w-full sm:w-auto"
          onClick={() => router.push(`/${username}/discuss/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* Tag Filter */}
      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      {/* Discussion List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No discussions found</p>
          <Button
            variant="outline"
            onClick={() => router.push(`/${username}/discuss/new`)}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create the first discussion
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => {
            const stripHtml = (html: string) => {
              if (!html) return '';
              const tmp = document.createElement('div');
              tmp.innerHTML = html;
              return tmp.textContent || tmp.innerText || '';
            };
            const description = stripHtml(discussion.description || '');
            const excerpt = description.substring(0, 150) + 
              (description.length > 150 ? '...' : '');

            return (
              <Card 
                key={discussion.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/${username}/discuss/${discussion.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg hover:text-primary transition-colors">
                          {discussion.title}
                        </CardTitle>
                        {discussion.isPinned && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
                            Pinned
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {excerpt}
                      </CardDescription>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10">
                              {(discussion.createdByName || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{discussion.createdByName || 'Unknown'}</span>
                        </div>
                        <span>•</span>
                        {discussion.tags && discussion.tags.length > 0 && (
                          <>
                            <Badge variant="outline" className="text-xs">
                              {discussion.tags[0]}
                            </Badge>
                            <span>•</span>
                          </>
                        )}
                        <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.commentCount || 0} replies</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{discussion.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{discussion.likes || 0} likes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(previousCursors.length > 0 || hasMore) && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={previousCursors.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!hasMore}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
