import { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { Bell, Check, AlertTriangle, Info, Calendar, CreditCard } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Notification } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateShort } from '@/lib/utils';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function NotificationDialog({
  open,
  onOpenChange,
}: NotificationDialogProps) {
  const { data: notifications = [], refetch } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/notifications/mark-all-read', {});
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('PATCH', `/api/notifications/${id}/read`, { id });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-neutral-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-neutral-500">
            {notifications.filter(n => !n.isRead).length} unread notifications
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={
              markAllAsReadMutation.isPending ||
              !notifications.some(n => !n.isRead)
            }
          >
            Mark all as read
          </Button>
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-2 pr-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No notifications to display
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead
                      ? 'bg-neutral-50 border-neutral-200'
                      : 'bg-primary-50 border-primary-200'
                  } relative`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getCategoryIcon(notification.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">
                          {notification.message}
                        </div>
                        <div className="text-xs text-neutral-500 ml-2 whitespace-nowrap">
                          {formatDateShort(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-1 right-1 h-7 px-2"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-xs">Mark read</span>
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}