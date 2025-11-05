'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { faqService, FAQ } from '@/lib/services/faqService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { FAQFormDialog } from '@/components/admin/FAQFormDialog';
import { toast } from 'sonner';
import { useAddButton } from '../layout';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FAQ | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FAQ | null>(null);

  const { setOnAddClick } = useAddButton();

  const loadFAQs = async () => {
    setLoading(true);
    try {
      const response = await faqService.getAllFAQs();
      setFaqs(response.faqs || []);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleEdit = (faq: FAQ) => {
    setFaqToEdit(faq);
    setFormDialogOpen(true);
  };

  const handleCreate = () => {
    setFaqToEdit(null);
    setFormDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setFaqToEdit(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadFAQs();
  };

  useEffect(() => {
    setOnAddClick(() => handleCreate);
    return () => setOnAddClick(null);
  }, [setOnAddClick]);

  const handleDelete = (faq: FAQ) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;

    try {
      await faqService.deleteFAQ(faqToDelete.id);
      toast.success('FAQ deleted successfully');
      loadFAQs();
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      pending: 'secondary',
      answered: 'default',
      archived: 'outline',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const columns: Column<FAQ>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (faq) => (
        <span className="text-sm">{faq.email}</span>
      ),
    },
    {
      key: 'question',
      header: 'Question',
      render: (faq) => (
        <div className="max-w-md">
          <p className="text-sm truncate">{faq.question}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (faq) => getStatusBadge(faq.status),
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      render: (faq) => (
        <span className="text-sm text-muted-foreground">
          {new Date(faq.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (faq) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(faq)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(faq)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={faqs}
        columns={columns}
        loading={loading}
        emptyMessage="No FAQs found"
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName={faqToDelete?.question}
        description="This will permanently delete this FAQ."
      />

      <FAQFormDialog
        open={formDialogOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        faq={faqToEdit}
      />
    </div>
  );
}
