'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MinimalTiptap } from '@/components/ui/shadcn-io/minimal-tiptap';
import { Badge } from '@/components/ui/badge';
import { X, Loader2, Search, XCircle } from 'lucide-react';
import { discussionService } from '@/lib/services/discussionService';
import { questionService } from '@/lib/services/questionService';
import { PartialQuestion } from '@/lib/models/question';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { toast } from 'sonner';

export default function NewDiscussionPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Question linking state
  const [selectedQuestion, setSelectedQuestion] = useState<PartialQuestion | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PartialQuestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

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

  const handleSearchQuestions = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      // Use topic filter for search (you may need to update backend to support text search)
      const results = await questionService.getQuestions({ topic: searchQuery, limit: 10 });
      setSearchResults(results.questions || []);
    } catch (error) {
      toast.error('Failed to search questions');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectQuestion = async (question: PartialQuestion) => {
    setSelectedQuestion(question);
    
    // Note: PartialQuestion doesn't have passage_id, so we can't fetch passage here
    // The backend will handle passage info when creating the discussion
    
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveQuestion = () => {
    setSelectedQuestion(null);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounce = setTimeout(() => {
        handleSearchQuestions();
      }, 500);
      return () => clearTimeout(debounce);
    } else {
      setSearchResults([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
      setLoading(true);
      const discussion = await discussionService.createDiscussion({
        title,
        description,
        tags,
        questionId: selectedQuestion?.id, // Add optional questionId
      });
      toast.success('Discussion created successfully');
      router.push(`/${username}/discuss/${discussion.id}`);
    } catch (error) {
      toast.error('Failed to create discussion');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mt-2 text-lg">
          Start a conversation with the community
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
              <MinimalTiptap
                content={description}
                onChange={setDescription}
                placeholder="Describe your discussion in detail..."
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

            <div className="space-y-2">
              <Label htmlFor="question">Link a Question (optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Optionally link this discussion to a specific question for context
              </p>
              
              {!selectedQuestion ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="question-search"
                      placeholder="Search questions by topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowSearch(true)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleSearchQuestions}
                      disabled={!searchQuery.trim() || searching}
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {showSearch && searchResults.length > 0 && (
                    <div className="border rounded-lg p-2 max-h-64 overflow-y-auto space-y-1">
                      {searchResults.map((question) => (
                        <button
                          key={question.id}
                          type="button"
                          onClick={() => handleSelectQuestion(question)}
                          className="w-full text-left p-3 rounded hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <QuestionTypeBadge type={question.question_type} />
                            <DifficultyBadge difficulty={question.difficulty_level} />
                          </div>
                          <div
                            className="text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: question.question_text }}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {question.topic}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showSearch && searchQuery && searchResults.length === 0 && !searching && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No questions found. Try a different search term.
                    </p>
                  )}
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-accent/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <QuestionTypeBadge type={selectedQuestion.question_type} />
                      <DifficultyBadge difficulty={selectedQuestion.difficulty_level} />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveQuestion}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div
                    className="text-sm mb-2"
                    dangerouslySetInnerHTML={{ __html: selectedQuestion.question_text }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Topic: {selectedQuestion.topic}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Discussion'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
