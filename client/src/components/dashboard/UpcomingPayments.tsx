import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loan, Payment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDateShort, getStatusColor } from "@/lib/utils";
import { InfoIcon, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

// Helper function to get background color based on status
const getStatusBgColor = (status: string): string => {
  switch (status) {
    case "Paid":
      return "#dcfce7"; // green-100
    case "In Progress":
      return "#e0f2fe"; // blue-100
    case "Deferred":
      return "#fef9c3"; // yellow-100
    case "Declined":
      return "#fee2e2"; // red-100
    case "Rescheduled":
      return "#f3e8ff"; // purple-100
    case "Paydown":
      return "#d1fae5"; // emerald-100
    case "Processing":
      return "#e0f2fe"; // blue-100
    case "Pending Approval":
      return "#fef3c7"; // amber-100
    case "Failed":
      return "#fee2e2"; // red-100
    case "Refunded":
      return "#e0e7ff"; // indigo-100
    case "Scheduled":
      return "#dbeafe"; // light-blue-100
    case "Missed":
      return "#fee2e2"; // red-100
    default:
      return "#f3f4f6"; // gray-100
  }
};

interface UpcomingPaymentsProps {
  userId?: number;
}

const UpcomingPayments = ({ userId }: UpcomingPaymentsProps) => {
  const [showAllPayments, setShowAllPayments] = useState(false);
  
  const { data: loans, isLoading: isLoadingLoans } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: [`/api/loans/${loans?.[0]?.id || 0}/payments`],
    enabled: !!loans && loans.length > 0,
  });

  // Filter upcoming payments (not paid yet)
  const upcomingPayments = payments?.filter(payment => 
    payment.status !== "Paid" && new Date(payment.paymentDate) > new Date()
  ).slice(0, 2) || [];

  // Filter missed payments
  const missedPayments = payments?.filter(payment => 
    payment.status === "Missed"
  ).slice(0, 2) || [];

  if (isLoadingLoans || isLoadingPayments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!loans || loans.length === 0 || !payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">No upcoming payments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingPayments && upcomingPayments.length > 0 ? (
            upcomingPayments.map((payment) => (
              <div key={payment.id} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <span className="text-neutral-800 font-medium">${payment.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <InfoIcon size={16} className="ml-1 text-neutral-400" />
                  </div>
                  <Button size="sm" variant="default" className="bg-indigo-600 hover:bg-indigo-700">Pay Now</Button>
                </div>
                <p className="text-sm text-neutral-600">
                  Personal Loan EMI, {formatDateShort(payment.paymentDate)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-500 mb-4">No upcoming payments scheduled.</p>
          )}
          
          {missedPayments && missedPayments.length > 0 && (
            <>
              <div className="border-t border-neutral-200 my-4"></div>
              {missedPayments.map((payment) => (
                <div key={payment.id} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-neutral-800 font-medium">${payment.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      <InfoIcon size={16} className="ml-1 text-neutral-400" />
                    </div>
                    <Button size="sm" variant="default" className="bg-indigo-600 hover:bg-indigo-700">Pay Now</Button>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm text-neutral-600">
                      Personal Loan Missed EMI, {formatDateShort(payment.paymentDate)}
                    </p>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Missed
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={() => setShowAllPayments(true)}
          >
            View All Payments
          </Button>
        </CardContent>
      </Card>

      {loans && loans.length > 0 && payments && (
        <Dialog open={showAllPayments} onOpenChange={setShowAllPayments}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>Payment Schedule</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <X size={18} />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="flex justify-between mb-6">
                <h3 className="text-lg font-medium">Personal Loan #{loans[0].loanId}</h3>
                <Button size="sm" variant="outline" className="flex items-center">
                  <Download size={16} className="mr-2" />
                  Download Schedule
                </Button>
              </div>
              
              <div className="grid grid-cols-[1fr_1fr_120px_120px] gap-4 py-3 border-b font-medium">
                <div>Payment Date</div>
                <div>Description</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              
              {[...payments]
                .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
                .map((payment) => (
                  <div key={payment.id} className="grid grid-cols-[1fr_1fr_120px_120px] gap-4 py-4 border-b">
                    <div>{formatDateShort(payment.paymentDate)}</div>
                    <div>Personal Loan EMI</div>
                    <div>${payment.amount.toFixed(2)}</div>
                    <div>
                      <span 
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getStatusBgColor(payment.status),
                          color: getStatusColor(payment.status),
                        }}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UpcomingPayments;