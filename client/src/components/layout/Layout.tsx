import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationDialog from "@/components/NotificationDialog";
import FinancialTip from "@/components/FinancialTip";
import { useWebSocket } from "@/hooks/use-websocket";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Use WebSocket for real-time notifications and financial tips
  const { 
    isConnected, 
    notificationCount: wsNotificationCount, 
    financialTip, 
    dismissFinancialTip 
  } = useWebSocket();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Get notifications count (unread)
  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["/api/notifications"],
  });

  // Use either the WebSocket notification count or the query-based count
  const unreadCount = isConnected ? wsNotificationCount : notifications.filter((n: any) => !n.isRead).length || 0;

  const toggleSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar for desktop */}
      <Sidebar 
        showMobile={showMobileSidebar} 
        closeMobile={() => setShowMobileSidebar(false)} 
        user={user} 
        activePath={location} 
      />
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Button 
          onClick={toggleSidebar} 
          className="rounded-full h-12 w-12 p-0 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </Button>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Logo */}
            <div className="flex items-center md:hidden">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span className="text-xl font-semibold ml-2 text-neutral-800 md:hidden">LoanSpa</span>
            </div>
            
            {/* Search */}
            <div className="hidden sm:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm" 
                  placeholder="Search..." 
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleNotifications}
                className="relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary-500"></span>
                )}
              </Button>
              
              {/* Apply for New Loan */}
              <Button className="ml-4 hidden sm:inline-flex">
                Apply for New Loan
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Notifications Dialog */}
      <NotificationDialog
        open={showNotifications}
        onOpenChange={setShowNotifications}
      />
      
      {/* Financial Tips with Animation */}
      {financialTip && (
        <FinancialTip
          title={financialTip.title}
          message={financialTip.message}
          icon={financialTip.icon}
          onDismiss={dismissFinancialTip}
        />
      )}

      {/* Connection Indicator (only visible during development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center space-x-2 text-xs bg-white p-2 rounded-full shadow-md">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      )}
    </div>
  );
};

export default Layout;
