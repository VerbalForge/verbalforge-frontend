'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/RichTextEditor';
import { TagInput } from './TagInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DiscussionFormData {
  title: string;
  description: string;
  tags: string[];
}

interface DiscussionFormProps {
  initialData?: DiscussionFormData;
  onSubmit: (data: DiscussionFormData) => Promise<void>;
  submitButtonText?: string;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function DiscussionForm({
  initialData = { title: '', description: '', tags: [] },
  onSubmit,
  submitButtonText = 'Create Discussion',
  isLoading = false,
  mode = 'create',
}: DiscussionFormProps) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [tags, setTags] = useState<string[]>(initialData.tags);

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

    await onSubmit({ title, description, tags });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Discussion Details' : 'Edit Discussion'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <RichTextEditor content={description} onChange={setDescription} />
            <p className="text-xs text-muted-foreground">
              Minimum 10 characters
            </p>
          </div>

          <TagInput
            tags={tags}
            onTagsChange={setTags}
            maxTags={5}
            label="Tags (Optional)"
            placeholder="Add a tag and press Enter"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              disabled={isLoading || title.length < 5 || description.length < 10}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
