import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Loan } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface LoanOverviewProps {
  showBackButton?: boolean;
}

const LoanOverview: React.FC<LoanOverviewProps> = ({ showBackButton = false }) => {
  const [, setLocation] = useLocation();
  const params = useParams();
  
  const { data: loans, isLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });
  
  const handleBack = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
          {showBackButton && (
            <Skeleton className="h-9 w-24" />
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loans || loans.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loan Overview</CardTitle>
          {showBackButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">No active loans found.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If we have an ID from the URL, use that loan, otherwise use the first one
  const loanId = params.id ? parseInt(params.id) : loans[0].id;
  const loan = loans.find(l => l.id === loanId) || loans[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Loan Overview</CardTitle>
        {showBackButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-neutral-500">Personal Loan</h3>
            <p className="text-lg font-semibold text-neutral-800">${loan.loanAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-500">Outstanding Amount</h3>
            <p className="text-lg font-semibold text-neutral-800">${loan.outstandingAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-500">EMI left</h3>
            <p className="text-lg font-semibold text-neutral-800">{loan.paymentsLeft}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-500">ROI (Rate of Interest)</h3>
            <p className="text-lg font-semibold text-neutral-800">{loan.interestRate.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanOverview;
