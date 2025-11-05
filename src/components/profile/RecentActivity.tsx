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
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { QuestionTypeBadge } from '@/components/QuestionTypeBadge';
import { getTimeAgo } from '@/lib/utils/profile';
import { userService } from '@/lib/services/userService';
import { UserActivity, QuestionActivityMetadata, DiscussionActivityMetadata } from '@/lib/models/user';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RecentActivityProps {
  username?: string;
  userId?: string; // For admin panel
  limit?: number; // Default 10 for profile, can be higher for admin
  title?: string; // Custom title
  enablePagination?: boolean; // Enable pagination (for admin)
  itemsPerPage?: number; // Items per page when pagination is enabled
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

export function RecentActivity({ 
  username, 
  userId, 
  limit = 10, 
  title = "Recent Activity",
  enablePagination = false,
  itemsPerPage = 20
}: RecentActivityProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // If userId is provided (admin panel), use it; otherwise use username (profile page)
        const identifier = userId || username;
        if (!identifier) {
          console.error('No username or userId provided to RecentActivity');
          return;
        }
        
        const activities = await userService.getUserActivities(identifier, limit);
        setActivities(activities || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [username, userId, limit]);

  // Pagination logic
  const totalPages = enablePagination ? Math.ceil(activities.length / itemsPerPage) : 1;
  const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = enablePagination ? startIndex + itemsPerPage : activities.length;
  const paginatedActivities = activities.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <CardTitle>{title}</CardTitle>
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
          <CardTitle>{title}</CardTitle>
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
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {enablePagination && totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedActivities.map((activity) => {            
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

        {/* Pagination Controls */}
        {enablePagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, activities.length)} of {activities.length} activities
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  const showEllipsis = 
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return <span key={page} className="px-2">...</span>;
                  }

                  if (!showPage) {
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
