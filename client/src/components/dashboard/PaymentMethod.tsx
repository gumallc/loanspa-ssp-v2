import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentMethod as PaymentMethodType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodProps {
  userId?: number;
}

const PaymentMethod = ({ userId }: PaymentMethodProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);

  const { data: paymentMethods, isLoading } = useQuery<PaymentMethodType[]>({
    queryKey: ["/api/payment-methods"],
  });

  const setPrimaryMutation = useMutation({
    mutationFn: async (methodId: number) => {
      await apiRequest("POST", "/api/payment-methods/set-primary", {
        methodId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Payment method updated",
        description:
          "Your primary payment method has been updated successfully.",
      });
      setUpdating(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
      setUpdating(false);
    },
  });

  const handleUpdatePaymentMethod = () => {
    setUpdating(!updating);
  };

  const handleSetPrimary = (methodId: number) => {
    setPrimaryMutation.mutate(methodId);
  };

  const maskLast4 = (val?: string) => (val ? `••••${val.slice(-4)}` : "••••");

  const renderPaymentMethod = (method: PaymentMethodType) => {
    const isPrimary = method.isPrimary;
    const typeLabel =
      method.type === "Checking Account" ? "Checking Account" : "Debit Card";
    const idLabel =
      method.type === "Checking Account"
        ? maskLast4(method.accountNumber)
        : maskLast4(method.cardNumber);

    return (
      <div
        key={method.id}
        className={`relative rounded-lg p-4 mb-4 shadow-sm transition-all ${
          isPrimary
            ? "bg-indigo-600 text-white"
            : "bg-white border border-neutral-200 text-neutral-800"
        }`}
      >
        {/* Primary badge */}
        {isPrimary && (
          <div className="absolute top-3 right-3">
            <Check size={18} className="text-white" />
          </div>
        )}

        {/* Type and ID */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold">{typeLabel}</div>
          {isPrimary && (
            <span className="text-xs font-medium bg-white text-indigo-800 px-2 py-0.5 rounded-full">
              Primary
            </span>
          )}
        </div>

        {/* Bank and Account/Card Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <div
              className={`text-xs font-medium ${isPrimary ? "text-indigo-100" : "text-neutral-500"}`}
            >
              Bank Name
            </div>
            <div
              className={`text-sm font-medium ${isPrimary ? "text-white" : "text-neutral-900"}`}
            >
              {method.bankName}
            </div>
          </div>
          <div>
            <div
              className={`text-xs font-medium ${isPrimary ? "text-indigo-100" : "text-neutral-500"}`}
            >
              {method.type === "Checking Account"
                ? "Account Number"
                : "Card Number"}
            </div>
            <div
              className={`text-sm font-medium ${isPrimary ? "text-white" : "text-neutral-900"}`}
            >
              {idLabel}
            </div>
          </div>
        </div>

        {/* Action button */}
        {updating && !isPrimary && (
          <div className="mt-4 text-right">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleSetPrimary(method.id)}
              className="text-xs"
            >
              Set as Primary
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
          <Skeleton className="h-9 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Payment Method</CardTitle>
        <Button
          variant="outline"
          onClick={handleUpdatePaymentMethod}
          size="sm"
          className="bg-neutral-600 hover:bg-neutral-700 text-white text-xs"
        >
          {updating ? "Cancel" : "Update Payment Method"}
        </Button>
      </CardHeader>
      <CardContent>{paymentMethods?.map(renderPaymentMethod)}</CardContent>
    </Card>
  );
};

export default PaymentMethod;
