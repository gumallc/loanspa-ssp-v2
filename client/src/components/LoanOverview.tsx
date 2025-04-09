import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface LoanOverviewProps {
  userId: number;
}

export default function LoanOverview({ userId }: LoanOverviewProps) {
  const { data: loans, isLoading } = useQuery({
    queryKey: [`/api/loans/user/${userId}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const loan = loans?.[0];

  if (!loan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No loans found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Personal Loan</div>
            <div className="mt-1 text-xl font-semibold">${Number(loan.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">Outstanding Amount</div>
            <div className="mt-1 text-xl font-semibold">${Number(loan.outstanding).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">EMI left</div>
            <div className="mt-1 text-xl font-semibold">{loan.paymentsLeft}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground">ROI (Rate of Interest)</div>
            <div className="mt-1 text-xl font-semibold">{loan.interestRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
