'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  SquarePlus, 
  MessageCircle, 
  MessageCircleHeart, 
  ExternalLink 
} from 'lucide-react';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { getTimeAgo } from '@/lib/utils/profile';
import { userService } from '@/lib/services/userService';
import { UserActivity, QuestionActivityMetadata, DiscussionActivityMetadata } from '@/lib/models/user';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RecentActivityProps {
  username: string;
}

function getActivityIcon(activity: UserActivity) {
  if (activity.activityType === 'question') {
    const meta = activity.metadata as QuestionActivityMetadata;
    if (meta.solved) {
      return <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />;
    } else {
      return <Circle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />;
    }
  } else {
    const meta = activity.metadata as DiscussionActivityMetadata;
    switch (meta.action_type) {
      case 'created':
        return <SquarePlus className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />;
      case 'updated':
        return <SquarePlus className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />;
      case 'comment_added':
        return <MessageCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />;
      case 'comment_updated':
        return <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />;
      case 'discussion_liked':
      case 'comment_liked':
        return <MessageCircleHeart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />;
    }
  }
}

function getActivityDescription(activity: UserActivity): string {
  if (activity.activityType === 'question') {
    const meta = activity.metadata as QuestionActivityMetadata;
    return meta.solved ? 'Solved' : 'Attempted';
  } else {
    const meta = activity.metadata as DiscussionActivityMetadata;
    switch (meta.action_type) {
      case 'created':
        return 'Created discussion';
      case 'updated':
        return 'Updated discussion';
      case 'comment_added':
        return 'Commented on';
      case 'comment_updated':
        return 'Updated comment on';
      case 'discussion_liked':
        return 'Liked discussion';
      case 'comment_liked':
        return 'Liked comment';
      default:
        return 'Activity';
    }
  }
}

function getActivityText(activity: UserActivity): string {
  if (activity.activityType === 'question') {
    const meta = activity.metadata as QuestionActivityMetadata;
    return meta.question_text;
  } else {
    const meta = activity.metadata as DiscussionActivityMetadata;
    return meta.discussion_title;
  }
}

export function RecentActivity({ username }: RecentActivityProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activities = await userService.getUserActivities(username, 10);
        setActivities(activities || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [username]);

  const handleQuestionClick = (questionId: string, passageId?: string) => {
    if (passageId) {
      sessionStorage.setItem('navigationItems', JSON.stringify([
        {
          type: 'passage',
          id: passageId,
          questionIds: [questionId]
        }
      ]));
      sessionStorage.setItem('currentPassageId', passageId);
      sessionStorage.setItem('currentQuestionId', questionId);
    } else {
      sessionStorage.setItem('navigationItems', JSON.stringify([
        {
          type: 'question',
          id: questionId,
          questionIds: [questionId]
        }
      ]));
      sessionStorage.setItem('currentQuestionId', questionId);
      sessionStorage.removeItem('currentPassageId');
    }
    sessionStorage.setItem('backRoute', `/${username}/dashboard`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Loading...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
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
          {activities.map((activity) => {            
            const timeAgo = getTimeAgo(activity.timestamp);
            const description = getActivityDescription(activity);
            const text = getActivityText(activity);
            
            return (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                {getActivityIcon(activity)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-medium text-sm text-muted-foreground">{description}</span>
                    {activity.activityType === 'question' && (
                      <>
                        <DifficultyBadge difficulty={(activity.metadata as QuestionActivityMetadata).difficulty_level} />
                        <QuestionTypeBadge type={(activity.metadata as QuestionActivityMetadata).question_type} />
                        {(activity.metadata as QuestionActivityMetadata).xp_gained && (
                          <Badge variant="outline" className="text-xs">
                            +{(activity.metadata as QuestionActivityMetadata).xp_gained} XP
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                  <div className="mb-1">
                    {activity.activityType === 'question' ? (
                      <span className="text-sm truncate">{text}</span>
                    ) : (
                      <div 
                        className="text-sm line-clamp-2 prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: text }}
                      />
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <span>{timeAgo}</span>
                  </div>
                </div>

                {activity.activityType === 'question' ? (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <Link 
                      href={`/${username}/practice/${(activity.metadata as QuestionActivityMetadata).question_id}`}
                      onClick={() => handleQuestionClick(
                        (activity.metadata as QuestionActivityMetadata).question_id, 
                        (activity.metadata as QuestionActivityMetadata).passage_id
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open question</span>
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                  >
                    <Link href={`/${username}/discuss/${(activity.metadata as DiscussionActivityMetadata).discussion_id}`}>
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open discussion</span>
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
