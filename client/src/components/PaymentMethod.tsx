import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CreditCard, Building } from "lucide-react";

interface PaymentMethodProps {
  userId: number;
}

export default function PaymentMethod({ userId }: PaymentMethodProps) {
  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: [`/api/payment-methods/user/${userId}`],
  });

  const maskLast4 = (value: string | undefined) => {
    if (!value) return "••••";
    return `••••${value.slice(-4)}`;
  };

  const renderPaymentItem = (method: any) => {
    const isBank = method.type === "bank";
    const bgColor = isBank ? "bg-neutral-800" : "bg-violet-600";
    const label = isBank ? "Checking Account" : "Debit Card";
    const icon = isBank ? (
      <Building className="h-8 w-8 mr-4" />
    ) : (
      <CreditCard className="h-8 w-8 mr-4" />
    );
    const maskedNumber = isBank
      ? maskLast4(method.accountNumber)
      : maskLast4(method.cardNumber);

    return (
      <div
        key={method.id}
        className={`flex items-center p-4 rounded-lg text-white ${bgColor}`}
      >
        {icon}
        <div className="flex-1">
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs opacity-80">
            {method.bankName} {maskedNumber}
          </div>
        </div>
        {method.isPrimary && (
          <div className="flex items-center justify-center h-6 w-6 bg-white bg-opacity-20 rounded-full">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Payment Method</CardTitle>
          <Skeleton className="h-9 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Payment Method</CardTitle>
        <Button variant="link" className="text-primary">
          Update Payment Method
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods?.map(renderPaymentItem)}

        <div className="flex items-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition cursor-pointer">
          <div className="h-8 w-8 mr-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <span className="text-xl font-medium text-neutral-400">+</span>
          </div>
          <div className="text-sm font-medium text-neutral-900">
            Add New Payment Method
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
