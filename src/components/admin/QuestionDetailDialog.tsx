'use client';

import { AdminQuestion } from '@/lib/services/adminService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionDetailDialogProps {
  question: AdminQuestion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionDetailDialog({ 
  question, 
  isOpen, 
  onClose 
}: QuestionDetailDialogProps) {
  
  if (!question) return null;

  const isPublished = Boolean(question.metadata.published_at && question.metadata.published_at !== '');

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-2xl font-bold">
                Question Details
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant={isPublished ? 'default' : 'secondary'}>
                  {isPublished ? 'Published' : 'Draft'}
                </Badge>
                <Badge variant="outline">{question.question_type}</Badge>
                <Badge variant="outline">{question.difficulty_level}</Badge>
                {question.topic && (
                  <Badge variant="outline">{question.topic}</Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            ID: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{question.id}</code>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Passage Reference */}
          {question.passage_id && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Passage ID:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {question.passage_id}
                  </code>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question Text */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">Question</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-base">
                    {question.question_text}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer Choices */}
          {question.choices && question.choices.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Answer Choices
                    {question.question_type === 'TC' && question.choices.some(c => c.blank > 1) && (
                      <span className="ml-2 text-xs font-normal">(Multiple Blanks)</span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {question.choices.map((choice, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border-2 transition-colors",
                          choice.is_correct
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-muted bg-muted/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {choice.is_correct ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-base">
                                {choice.option}
                              </p>
                              {question.question_type === 'TC' && choice.blank > 1 && (
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  Blank {choice.blank}
                                </Badge>
                              )}
                            </div>
                            {choice.reasoning && (
                              <p className="text-sm text-muted-foreground italic">
                                {choice.reasoning}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">
                    {new Date(question.metadata.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Updated:</span>
                  <p className="font-medium">
                    {new Date(question.metadata.updated_at).toLocaleDateString()}
                  </p>
                </div>
                {isPublished && question.metadata.published_at && (
                  <div>
                    <span className="text-muted-foreground">Published:</span>
                    <p className="font-medium">
                      {new Date(question.metadata.published_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {question.metadata.batch_id && (
                  <div>
                    <span className="text-muted-foreground">Batch ID:</span>
                    <p className="font-medium text-xs">{question.metadata.batch_id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
