'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { getTimeAgo } from '@/lib/utils/profile';
import { RecentActivityItem } from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface RecentActivityProps {
  questions: RecentActivityItem[];
}

export function RecentActivity({ questions }: RecentActivityProps) {
  const params = useParams();
  const username = params.username as string;

  const handleQuestionClick = (questionId: string) => {
    // Set up navigation for a single question
    // This makes the back button go to dashboard and disables prev/next
    sessionStorage.setItem('navigationItems', JSON.stringify([
      {
        type: 'question',
        id: questionId,
        questionIds: [questionId]
      }
    ]));
    sessionStorage.setItem('currentQuestionId', questionId);
    sessionStorage.removeItem('currentPassageId');
    sessionStorage.setItem('backRoute', `/${username}/dashboard`); // Save dashboard as the back route
  };
  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity yet. Start solving questions!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => {
            const timeAgo = getTimeAgo(question.solvedAt);
            
            return (
              <div key={question.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-sm truncate">{question.title}</span>
                    <div className="flex items-center gap-1">
                      <DifficultyBadge difficulty={question.difficulty} />
                      <QuestionTypeBadge type={question.type} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{timeAgo}</span>
                    <Badge variant="outline" className="text-xs">
                      +{question.xpGained} XP
                    </Badge>
                  </div>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                >
                  <Link 
                    href={`/${username}/practice/${question.id}`}
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open question</span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
