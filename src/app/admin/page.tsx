'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileQuestion, 
  MessageSquare, 
  MessageCircle, 
  ArrowRight, 
  FileText, 
  Users,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { faqService } from '@/lib/services/faqService';
import { supportService } from '@/lib/services/supportService';
import { feedbackService } from '@/lib/services/feedbackService';
import { adminService } from '@/lib/services/adminService';
import { StatsCard } from '@/components/admin/StatsCard';

interface Stats {
  faqs: number;
  support: number;
  feedback: number;
  questions: {
    total: number;
    published: number;
    unpublished: number;
  };
  passages: {
    total: number;
    published: number;
    unpublished: number;
  };
  discussions: number;
  users: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ 
    faqs: 0, 
    support: 0, 
    feedback: 0,
    questions: { total: 0, published: 0, unpublished: 0 },
    passages: { total: 0, published: 0, unpublished: 0 },
    discussions: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load support stats
      const [faqsResponse, supportResponse, feedbackResponse] = await Promise.all([
        faqService.getAllFAQs().catch(err => {
          console.error('Failed to load FAQs:', err);
          return { faqs: [] };
        }),
        supportService.getAllSupportTickets().catch(err => {
          console.error('Failed to load support tickets:', err);
          return { tickets: [] };
        }),
        feedbackService.getAllFeedback().catch(err => {
          console.error('Failed to load feedback:', err);
          return { feedback: [] };
        }),
      ]);

      // Get questions stats
      const [publishedQuestions, unpublishedQuestions] = await Promise.all([
        adminService.getQuestions({ published: true, limit: 1 }).catch(err => {
          console.error('Failed to load published questions:', err);
          return { total: 0, questions: [] };
        }),
        adminService.getQuestions({ published: false, limit: 1 }).catch(err => {
          console.error('Failed to load unpublished questions:', err);
          return { total: 0, questions: [] };
        }),
      ]);

      // Get passages stats
      const [publishedPassages, unpublishedPassages] = await Promise.all([
        adminService.getPassages({ published: true, limit: 1 }).catch(err => {
          console.error('Failed to load published passages:', err);
          return { total: 0, passages: [] };
        }),
        adminService.getPassages({ published: false, limit: 1 }).catch(err => {
          console.error('Failed to load unpublished passages:', err);
          return { total: 0, passages: [] };
        }),
      ]);

      // Get discussions and users stats
      const [discussionsResponse, usersResponse] = await Promise.all([
        adminService.getAllDiscussions(1).catch(err => {
          console.error('Failed to load discussions:', err);
          return { total: 0, discussions: [] };
        }),
        adminService.getTotalUsers().catch(err => {
          console.error('Failed to load users count:', err);
          return { total: 0 };
        }),
      ]);

      setStats({
        faqs: faqsResponse?.faqs?.length ?? 0,
        support: supportResponse?.tickets?.length ?? 0,
        feedback: feedbackResponse?.feedback?.length ?? 0,
        questions: {
          published: publishedQuestions.total ?? 0,
          unpublished: unpublishedQuestions.total ?? 0,
          total: (publishedQuestions.total ?? 0) + (unpublishedQuestions.total ?? 0),
        },
        passages: {
          published: publishedPassages.total ?? 0,
          unpublished: unpublishedPassages.total ?? 0,
          total: (publishedPassages.total ?? 0) + (unpublishedPassages.total ?? 0),
        },
        discussions: discussionsResponse.total ?? 0,
        users: usersResponse.total ?? 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentCards = [
    {
      title: 'Questions',
      total: stats.questions.total,
      published: stats.questions.published,
      unpublished: stats.questions.unpublished,
      icon: FileQuestion,
      href: '/admin/questions',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-950',
    },
    {
      title: 'Passages',
      total: stats.passages.total,
      published: stats.passages.published,
      unpublished: stats.passages.unpublished,
      icon: FileText,
      href: '/admin/passages',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-950',
    },
  ];

  const communityCards = [
    {
      title: 'Discussions',
      value: stats.discussions,
      description: 'Total discussions',
      icon: MessageSquare,
      href: '/admin/discussions',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
    },
    {
      title: 'Users',
      value: stats.users,
      description: 'Registered users',
      icon: Users,
      href: '/admin/users',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-100 dark:bg-pink-950',
    },
  ];

  const supportCards = [
    {
      title: 'FAQs',
      value: stats.faqs,
      description: 'Total FAQ submissions',
      icon: HelpCircle,
      href: '/admin/faqs',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
    },
    {
      title: 'Support Tickets',
      value: stats.support,
      description: 'Total support requests',
      icon: MessageSquare,
      href: '/admin/support',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950',
    },
    {
      title: 'Feedback',
      value: stats.feedback,
      description: 'Total feedback submissions',
      icon: MessageCircle,
      href: '/admin/feedback',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Content Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {contentCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow gap-0 py-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold">
                    {loading ? (
                      <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                    ) : (
                      card.total
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <div>
                        <span className="text-muted-foreground">Published: </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {loading ? '...' : card.published}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unpublished: </span>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {loading ? '...' : card.unpublished}
                        </span>
                      </div>
                    </div>
                    <Link href={card.href}>
                      <Button variant="outline" size="sm" className="h-auto py-1.5 px-3">
                        Manage {card.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Community Management</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {communityCards.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              iconColor={card.color}
              iconBgColor={card.bgColor}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Support Management Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Support Management</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {supportCards.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
              iconColor={card.color}
              iconBgColor={card.bgColor}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
