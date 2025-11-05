'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye } from 'lucide-react';
import { supportService, SupportTicket } from '@/lib/services/supportService';
import { DataTable, Column } from '@/components/admin/DataTable';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [ticketToView, setTicketToView] = useState<SupportTicket | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await supportService.getAllSupportTickets();
      setTickets(response.tickets || []);
    } catch (error) {
      console.error('Failed to load tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleView = (ticket: SupportTicket) => {
    setTicketToView(ticket);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await supportService.updateSupportTicket(id, { status: status as SupportTicket['status'] });
      toast.success('Ticket status updated');
      loadTickets();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handlePriorityUpdate = async (id: string, priority: string) => {
    try {
      await supportService.updateSupportTicket(id, { priority: priority as SupportTicket['priority'] });
      toast.success('Ticket priority updated');
      loadTickets();
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority');
    }
  };

  const handleDelete = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      await supportService.deleteSupportTicket(ticketToDelete.id);
      toast.success('Ticket deleted successfully');
      loadTickets();
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      open: 'destructive',
      'in-progress': 'default',
      resolved: 'secondary',
      closed: 'outline',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      low: 'outline',
      medium: 'secondary',
      high: 'default',
      urgent: 'destructive',
    };
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const columns: Column<SupportTicket>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (ticket) => <span className="text-sm font-medium">{ticket.name}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (ticket) => <span className="text-sm">{ticket.email}</span>,
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (ticket) => (
        <div className="max-w-md">
          <p className="text-sm font-medium truncate">{ticket.subject}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (ticket) => (
        <Select
          value={ticket.status}
          onValueChange={(value) => handleStatusUpdate(ticket.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (ticket) => (
        <Select
          value={ticket.priority}
          onValueChange={(value) => handlePriorityUpdate(ticket.id, value)}
        >
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (ticket) => (
        <span className="text-sm text-muted-foreground">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ticket) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(ticket)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(ticket)}
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
        data={tickets}
        columns={columns}
        loading={loading}
        emptyMessage="No support tickets found"
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        itemName="this support ticket"
        description="This will permanently delete this support ticket."
      />

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Support Ticket Details</DialogTitle>
            <DialogDescription>
              Full ticket information and message
            </DialogDescription>
          </DialogHeader>
          {ticketToView && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{ticketToView.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{ticketToView.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-sm font-medium mt-1">{ticketToView.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{ticketToView.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(ticketToView.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Priority</p>
                  <div className="mt-1">{getPriorityBadge(ticketToView.priority)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(ticketToView.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{new Date(ticketToView.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
