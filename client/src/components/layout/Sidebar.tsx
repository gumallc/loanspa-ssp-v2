import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import {
  HomeIcon,
  Banknote,
  CreditCard,
  Gift,
  User as UserIcon,
  HelpCircle,
  LifeBuoy,
  LogOut,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  user?: User;
  activePath: string;
  showMobile: boolean;
  closeMobile: () => void;
}

const Sidebar = ({ user, activePath, showMobile, closeMobile }: SidebarProps) => {
  const { logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
        navigate("/auth");
      }
    });
  };
  
  const sidebarClasses = showMobile
    ? "fixed inset-0 z-50 bg-white" 
    : "hidden md:flex fixed h-screen z-30 bg-white";
    
  return (
    <aside className={`${sidebarClasses} w-64 flex-col border-r border-neutral-200 overflow-y-auto`}>
      {/* Mobile Close Button */}
      {showMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 md:hidden"
          onClick={closeMobile}
        >
          <X size={20} />
        </Button>
      )}
    
      {/* Logo */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center">
          <div className="text-xl font-semibold ml-2 text-neutral-800 flex items-center">
            <span className="text-primary font-bold">loan</span>
            <span className="text-cyan-500 font-bold">spa</span>
          </div>
        </div>
      </div>
      
      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.profileImage} alt={user.fullName} />
              <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-semibold text-neutral-800">{user.fullName}</p>
              <p className="text-xs text-neutral-500">{user.city}, {user.state} {user.zipCode}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul>
          <li className="mb-1">
            <Link href="/" className={`flex items-center px-4 py-3 rounded-lg ${activePath === "/" ? "bg-primary-50 text-primary" : "text-neutral-800 hover:bg-primary-50 hover:text-primary"}`}>
              <HomeIcon className="w-5 h-5 mr-3" />
              <span>Home</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/request-funds" className={`flex items-center px-4 py-3 rounded-lg ${activePath === "/request-funds" ? "bg-primary-50 text-primary" : "text-neutral-800 hover:bg-primary-50 hover:text-primary"}`}>
              <Banknote className="w-5 h-5 mr-3" />
              <span>Request Funds</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/make-payment" className={`flex items-center px-4 py-3 rounded-lg ${activePath === "/make-payment" ? "bg-primary-50 text-primary" : "text-neutral-800 hover:bg-primary-50 hover:text-primary"}`}>
              <CreditCard className="w-5 h-5 mr-3" />
              <span>Make a Payment</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/rewards" className={`flex items-center px-4 py-3 rounded-lg ${activePath === "/rewards" ? "bg-primary-50 text-primary" : "text-neutral-800 hover:bg-primary-50 hover:text-primary"}`}>
              <Gift className="w-5 h-5 mr-3" />
              <span>U Rewards</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/profile" className={`flex items-center px-4 py-3 rounded-lg ${activePath === "/profile" ? "bg-primary-50 text-primary" : "text-neutral-800 hover:bg-primary-50 hover:text-primary"}`}>
              <UserIcon className="w-5 h-5 mr-3" />
              <span>My Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Bottom Links */}
      <div className="mt-auto border-t border-neutral-200 py-4">
        <ul>
          <li className="mb-1">
            <Link href="/support" className="flex items-center px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary rounded-lg">
              <LifeBuoy className="w-5 h-5 mr-3" />
              <span>Customer Support</span>
            </Link>
          </li>
          <li className="mb-1">
            <Link href="/faq" className={`flex items-center px-4 py-2 rounded-lg ${activePath === "/faq" ? "bg-primary-50 text-primary" : "text-neutral-700 hover:bg-primary-50 hover:text-primary"}`}>
              <HelpCircle className="w-5 h-5 mr-3" />
              <span>FAQ</span>
            </Link>
          </li>
          <li>
            <button 
              className="w-full flex items-center px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary rounded-lg"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
