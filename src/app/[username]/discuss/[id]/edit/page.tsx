'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, ArrowLeft } from 'lucide-react';
import { Discussion } from '@/lib/models/discussion';
import { discussionService } from '@/lib/services/discussionService';
import { toast } from 'sonner';

export default function EditDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const discussionId = params.id as string;

  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionId]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getDiscussionById(discussionId);
      setDiscussion(data);
      setTitle(data.title);
      setDescription(data.description);
      setTags(data.tags || []);
    } catch (error) {
      toast.error('Failed to load discussion');
      console.error(error);
      router.push(`/${username}/discuss`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length < 5) {
      toast.error('Title must be at least 5 characters');
      return;
    }

    if (description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      await discussionService.updateDiscussion(discussionId, {
        title,
        description,
        tags,
      });
      toast.success('Discussion updated successfully');
      router.push(`/${username}/discuss/${discussionId}`);
    } catch (error) {
      toast.error('Failed to update discussion');
      console.error(error);
    } finally {
      setSubmitting(false);
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
    return null;
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push(`/${username}/discuss/${discussionId}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Discussion
      </Button>

      <div>
        <p className="text-muted-foreground mt-2">
          Update your discussion details
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Discussion Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What's your discussion about?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={5}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <RichTextEditor
                content={description}
                onChange={setDescription}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  disabled={tags.length >= 5}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5 || !tagInput.trim()}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pl-3 pr-2">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                You can add up to 5 tags ({tags.length}/5)
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/${username}/discuss/${discussionId}`)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Discussion'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
