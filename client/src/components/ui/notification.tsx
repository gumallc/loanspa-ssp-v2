import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { BellRing, Info, DollarSign, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDialog({ open, onOpenChange }: NotificationDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/mark-all-read", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const getNotificationIcon = (category?: string) => {
    switch (category) {
      case "category1":
        return <BellRing className="h-5 w-5 text-primary-600" />;
      case "category2":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "category3":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="all">
              All
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-1 text-xs bg-primary text-white rounded-full px-1.5">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="category1">Category 1</TabsTrigger>
            <TabsTrigger value="category2">Category 2</TabsTrigger>
            <TabsTrigger value="category3">Category 3</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[300px] pr-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex p-3 rounded-lg mb-2 ${notification.isRead ? 'bg-neutral-50' : 'bg-primary-50'}`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.category)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-neutral-800">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-neutral-600">
                      {formatDate(notification.timestamp)} at {new Date(notification.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 mt-4">No notifications found</p>
            )}
          </ScrollArea>
        </Tabs>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark All as Read
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
