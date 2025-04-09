import { useState } from "react";
import Sidebar from "./Sidebar";
import Notifications from "./Notifications";
import { useLocation } from "wouter";
import { Search, BellDot, BellOff, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden ml-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="md:hidden flex items-center">
                <span className="ml-2 text-lg font-semibold text-neutral-800">LoanSpa</span>
              </div>
              
              <div className="relative w-full max-w-xs mx-4 md:mx-0">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Search..."
                />
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <span className="sr-only">View notifications</span>
                    {isNotificationsOpen ? (
                      <BellOff className="h-5 w-5 text-neutral-500" />
                    ) : (
                      <>
                        <BellDot className="h-5 w-5 text-neutral-500" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-primary"></span>
                      </>
                    )}
                  </Button>
                </div>
                
                <Button className="ml-6 bg-primary hover:bg-primary/90">
                  Apply for New Loan
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Notifications Panel */}
        {isNotificationsOpen && (
          <Notifications onClose={() => setIsNotificationsOpen(false)} />
        )}
      </div>
    </div>
  );
}
