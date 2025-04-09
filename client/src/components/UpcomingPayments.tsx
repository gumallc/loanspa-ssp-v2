import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addMonths } from "date-fns";
import { Info } from "lucide-react";

interface UpcomingPaymentsProps {
  userId: number;
}

export default function UpcomingPayments({ userId }: UpcomingPaymentsProps) {
  const { data: loans } = useQuery({
    queryKey: [`/api/loans/user/${userId}`],
  });

  const loan = loans?.[0];

  if (!loan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentDate = new Date();
  const nextPaymentDate = addMonths(currentDate, 1);
  const missedPaymentDate = addMonths(currentDate, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="px-4 py-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">Personal Loan EMI, 4 Apr</div>
              <div className="mt-1 text-xs text-muted-foreground flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Regular monthly payment
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium">${Number(loan.principalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="mt-1">
                <Badge variant="outline" className="text-blue-500 bg-blue-50">
                  Upcoming
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" size="sm" className="w-full">
              Pay Now
            </Button>
          </div>
        </div>
        
        <div className="px-4 py-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">Personal Loan Missed EMI, 4 Apr</div>
              <div className="mt-1 text-xs text-muted-foreground flex items-center">
                <Info className="h-3 w-3 mr-1 text-red-500" />
                Payment overdue
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm font-medium">${Number(loan.principalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="mt-1">
                <Badge variant="destructive">
                  Late Fee Applied
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="secondary" size="sm" className="w-full">
              Pay Now
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t">
        <Button variant="link" className="text-primary">
          View All Payments
        </Button>
      </CardFooter>
    </Card>
  );
}
