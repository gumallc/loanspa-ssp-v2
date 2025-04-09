import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, Clock, DollarSign } from "lucide-react";

interface PaymentOption {
  title: string;
  icon: React.ElementType;
  description?: string;
}

interface PaymentScheduleProps {
  userId: number;
}

export default function PaymentSchedule({ userId }: PaymentScheduleProps) {
  const paymentOptions: PaymentOption[] = [
    {
      title: "Pay Down Loan",
      icon: CreditCard,
      description: "Make a partial payment"
    },
    {
      title: "Pay Off Loan",
      icon: DollarSign,
      description: "Pay the full amount"
    },
    {
      title: "Reschedule Deferred",
      icon: Calendar,
      description: "Change due date"
    },
    {
      title: "Deferred Payment",
      icon: Clock,
      description: "Postpone payment"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {paymentOptions.map((option, index) => {
            const Icon = option.icon;
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary-light hover:bg-opacity-5 transition-colors cursor-pointer"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary bg-opacity-10 text-primary mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-center">{option.title}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
