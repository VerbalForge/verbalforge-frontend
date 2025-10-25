'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileQuestion, MessageSquare, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { faqService } from '@/lib/services/faqService';
import { supportService } from '@/lib/services/supportService';
import { feedbackService } from '@/lib/services/feedbackService';

interface Stats {
  faqs: number;
  support: number;
  feedback: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ faqs: 0, support: 0, feedback: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [faqsResponse, supportResponse, feedbackResponse] = await Promise.all([
        faqService.getAllFAQs(),
        supportService.getAllSupportTickets(),
        feedbackService.getAllFeedback(),
      ]);

      setStats({
        faqs: faqsResponse?.faqs?.length ?? 0,
        support: supportResponse?.tickets?.length ?? 0,
        feedback: feedbackResponse?.feedback?.length ?? 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'FAQs',
      value: stats.faqs,
      description: 'Total FAQ submissions',
      icon: FileQuestion,
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">Manage FAQs, support tickets, and user feedback</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between -mb-6">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
                <CardDescription className="mt-2">{card.description}</CardDescription>
                <Link href={card.href}>
                  <Button variant="link" className="mt-2 h-auto -ml-3">
                    View all
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
