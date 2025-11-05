'use client';

import { useEffect, useState, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { faqService, type FAQ } from '@/lib/services/faqService';
import { toast } from 'sonner';

export default function AdminFAQsPage() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFAQs();
    }
  }, [user]);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqService.getAllFAQs();
      setFaqs(data?.faqs ?? []);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, answer?: string) => {
    try {
      await faqService.updateFAQStatus(id, { status: status as 'pending' | 'answered' | 'archived', answer });
      toast.success('FAQ status updated');
      // Update local state instead of refetching
      setFaqs(faqs.map(faq => 
        faq.id === id ? { ...faq, status: status as 'pending' | 'answered' | 'archived' } : faq
      ));
    } catch (error) {
      console.error('Failed to update FAQ:', error);
      toast.error('Failed to update FAQ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await faqService.deleteFAQ(id);
      toast.success('FAQ deleted');
      // Remove from local state instead of refetching
      setFaqs(faqs.filter(faq => faq.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>FAQ Submissions</CardTitle>
          <CardDescription>
            Manage frequently asked questions from users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!faqs || faqs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No FAQ submissions yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => (
                  <Fragment key={faq.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}>
                      <TableCell>
                        {expandedId === faq.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{faq.email}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate">{faq.question}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Select
                            value={faq.status}
                            onValueChange={(value) => handleStatusUpdate(faq.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="answered">Answered</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(faq.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === faq.id && (
                      <TableRow key={`${faq.id}-expanded`}>
                        <TableCell></TableCell>
                        <TableCell colSpan={4}>
                          <div className="py-4 space-y-2">
                            <div>
                              <span className="font-semibold">Full Question:</span>
                              <p className="mt-1 text-muted-foreground">{faq.question}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
