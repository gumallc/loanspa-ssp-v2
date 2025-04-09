import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { X, Bell, Check } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface NotificationsProps {
  onClose: () => void;
}

export default function Notifications({ onClose }: NotificationsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["/api/notifications/user/1"],
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/user/1/mark-all-read", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/user/1"] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/user/1"] });
    },
  });

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  return (
    <div className="fixed inset-0 overflow-hidden z-20">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-neutral-900">Notifications</h2>
                  <button 
                    className="text-sm font-medium text-primary"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="mt-3">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="all" className="text-xs">
                        All
                        <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary bg-opacity-25 text-xs">
                          {notifications.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger value="Category 1" className="text-xs">Category 1</TabsTrigger>
                      <TabsTrigger value="Category 2" className="text-xs">Category 2</TabsTrigger>
                      <TabsTrigger value="Category 3" className="text-xs">Category 3</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-6">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div key={notification.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Bell className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            {notification.message}
                          </p>
                          <div className="mt-1 text-xs text-yellow-600">
                            Today at {format(new Date(notification.timestamp), "h:mm a")}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-8 px-2 text-xs bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Mark as read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t border-neutral-200 p-6">
                <Button className="w-full" variant="outline" onClick={onClose}>
                  Close Notifications
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
