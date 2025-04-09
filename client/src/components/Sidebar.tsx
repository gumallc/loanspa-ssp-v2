import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  Home,
  DollarSign,
  BadgePercent,
  Send,
  User,
  HelpCircle,
  MessageSquare,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Sidebar() {
  const [location] = useLocation();

  const { data: user } = useQuery({
    queryKey: ["/api/users/username/adam.smith"],
  });

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/request-funds", label: "Request Funds", icon: Send },
    { href: "/payment", label: "Make a Payment", icon: DollarSign },
    { href: "/rewards", label: "U Rewards", icon: BadgePercent },
    { href: "/profile", label: "My Profile", icon: User },
    { href: "/support", label: "Customer Support", icon: MessageSquare },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0">
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center mb-6">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ml-2 text-xl font-semibold text-neutral-800">LoanSpa</span>
        </div>
        
        {/* User info */}
        <div className="flex items-center mb-8">
          <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user?.name} className="h-full w-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-neutral-500" />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-900">{user?.name || "Loading..."}</p>
            <p className="text-xs text-neutral-500">Metrotech Center, NY 11201</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg",
                  isActive
                    ? "bg-primary-light bg-opacity-10 text-primary"
                    : "text-neutral-700 hover:bg-neutral-100"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          
          <Link
            href="/logout"
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Link>
        </nav>
      </div>
    </aside>
  );
}
