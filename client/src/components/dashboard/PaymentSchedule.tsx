import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowDown, Clock, Calendar } from "lucide-react";
import { Loan } from "@/lib/types";

interface PaymentScheduleProps {
  userId: number;
}

const PaymentSchedule = ({ userId }: PaymentScheduleProps) => {
  const [, setLocation] = useLocation();

  const { data: loans } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });

  const loanId = loans?.[0]?.id || 1;

  const handlePayDown = () => {
    setLocation(`/loans/${loanId}/paydown`);
  };

  const handlePayOff = () => {
    setLocation(`/loans/${loanId}/payoff`);
  };

  const handleReschedulePayment = () => {
    setLocation(`/loans/${loanId}/reschedule`);
  };

  const handleDeferPayment = () => {
    setLocation(`/loans/${loanId}/defer`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Pay Down Loan */}
          <div
            onClick={handlePayDown}
            className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition duration-150 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-200">
              <CreditCard size={24} />
            </div>
            <span className="text-sm font-medium text-neutral-800 text-center">
              Pay Down Loan
            </span>
          </div>

          {/* Pay Off Loan */}
          <div
            onClick={handlePayOff}
            className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition duration-150 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:bg-green-200">
              <ArrowDown size={24} />
            </div>
            <span className="text-sm font-medium text-neutral-800 text-center">
              Pay Off Loan
            </span>
          </div>

          {/* Reschedule Payment */}
          <div
            onClick={handleReschedulePayment}
            className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition duration-150 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-200">
              <Calendar size={24} />
            </div>
            <span className="text-sm font-medium text-neutral-800 text-center">
              Reschedule Payment
            </span>
          </div>

          {/* Defer Payment */}
          <div
            onClick={handleDeferPayment}
            className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition duration-150 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-200">
              <Clock size={24} />
            </div>
            <span className="text-sm font-medium text-neutral-800 text-center">
              Defer Payment
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSchedule;
