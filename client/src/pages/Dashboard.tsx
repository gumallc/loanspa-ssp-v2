import { useQuery } from "@tanstack/react-query";
import LoanOverview from "@/components/dashboard/LoanOverview";
import PaymentMethod from "@/components/dashboard/PaymentMethod";
import PaymentSchedule from "@/components/dashboard/PaymentSchedule";
import RecentActivity from "@/components/dashboard/RecentActivity";
import RewardPoints from "@/components/dashboard/RewardPoints";
import UpcomingPayments from "@/components/dashboard/UpcomingPayments";
import CreditScore from "@/components/dashboard/CreditScore";
import { Loan, User } from "@/lib/types";

const Dashboard = () => {
  // Load loan data to check if there's an active loan
  const { data: loans, isLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });
  
  // In a real app, we would get the user ID from authentication
  // For now, use a hardcoded value that matches our sample data
  const userId = 1;
  
  // Get user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });
  
  const hasActiveLoan = !isLoading && loans && loans.length > 0;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-500 mt-1">
          Welcome back, {user?.fullName || 'User'}! Here's your financial overview.
        </p>
      </div>
      
      {/* Loan Overview Section */}
      {hasActiveLoan && (
        <div className="mb-6">
          <LoanOverview />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Section */}
          <PaymentMethod userId={userId} />
          
          {/* Payment Schedule Section */}
          <PaymentSchedule userId={userId} />
          
          {/* Recent Activity Section */}
          <RecentActivity userId={userId} />
        </div>
        
        <div className="space-y-6">
          {/* Reward Points Section */}
          <RewardPoints userId={userId} />
          
          {/* Upcoming Payments Section */}
          <UpcomingPayments userId={userId} />
          
          {/* Credit Score Section */}
          <CreditScore />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
