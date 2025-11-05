'use client';

import { useEffect, useState, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supportService, type SupportTicket, type UpdateSupportTicketRequest } from '@/lib/services/supportService';
import { toast } from 'sonner';

export default function AdminSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await supportService.getAllSupportTickets();
      setTickets(data?.tickets ?? []);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: UpdateSupportTicketRequest) => {
    try {
      await supportService.updateSupportTicket(id, updates);
      toast.success('Support ticket updated');
      // Update local state instead of refetching
      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ...updates } : ticket
      ));
    } catch (error) {
      console.error('Failed to update support ticket:', error);
      toast.error('Failed to update support ticket');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this support ticket?')) return;
    
    try {
      await supportService.deleteSupportTicket(id);
      toast.success('Support ticket deleted');
      // Remove from local state instead of refetching
      setTickets(tickets.filter(ticket => ticket.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (error) {
      console.error('Failed to delete support ticket:', error);
      toast.error('Failed to delete support ticket');
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
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            Manage user support requests and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tickets || tickets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No support tickets yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <Fragment key={ticket.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}>
                      <TableCell>
                        {expandedId === ticket.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{ticket.name}</TableCell>
                      <TableCell>{ticket.email}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{ticket.subject}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => handleUpdate(ticket.id, { status: value as 'open' | 'in-progress' | 'resolved' | 'closed' })}
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
                          <Select
                            value={ticket.priority}
                            onValueChange={(value) => handleUpdate(ticket.id, { priority: value as 'low' | 'medium' | 'high' | 'urgent' })}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(ticket.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === ticket.id && (
                      <TableRow key={`${ticket.id}-expanded`}>
                        <TableCell></TableCell>
                        <TableCell colSpan={5}>
                          <div className="py-4 space-y-3">
                            <div>
                              <span className="font-semibold">Subject:</span>
                              <p className="mt-1 text-muted-foreground">{ticket.subject}</p>
                            </div>
                            <div>
                              <span className="font-semibold">Message:</span>
                              <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{ticket.message}</p>
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
