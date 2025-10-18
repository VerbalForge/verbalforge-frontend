'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Discussion } from '@/lib/models/discussion';
import { DiscussionCard } from '@/components/DiscussionCard';
import { discussionService } from '@/lib/services/discussionService';
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg text-muted-foreground">
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
          {filteredDiscussions.map((discussion) => (
            <DiscussionCard 
              key={discussion.id} 
              discussion={discussion} 
              username={username}
            />
          ))}
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
