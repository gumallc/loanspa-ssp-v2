import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loan, Payment, PaymentMethod } from "@/lib/types";
import { CreditCard, Calendar, Banknote, Clock, ArrowRight, CheckCircle as CheckIcon } from "lucide-react";

const MakePayment = () => {
  const { toast } = useToast();
  
  // Get loan data
  const { data: loans, isLoading: isLoadingLoans } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });
  
  // Get current loan's payments
  const currentLoan = loans?.[0];
  const loanId = currentLoan?.id;
  
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/loans", loanId, "payments"],
    enabled: !!loanId,
  });
  
  // Get payment methods
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });
  
  const upcomingPayment = payments?.find(payment => payment.status === "Scheduled");
  const isLoading = isLoadingLoans || isLoadingPayments || isLoadingPaymentMethods;
  
  const handleMakePayment = () => {
    toast({
      title: "Payment option selected",
      description: "Redirecting to payment flow...",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!currentLoan) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">No Active Loans</h2>
        <p className="text-neutral-600 mb-6">You don't have any active loans at the moment.</p>
        <Button>Apply for a Loan</Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Make a Payment</h1>
        <p className="text-neutral-500 mt-1">
          Select a payment option for your loan
        </p>
      </div>
      
      {/* Loan Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-500 mb-1">Loan ID</div>
              <div className="font-medium">{currentLoan.loanId}</div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-500 mb-1">Outstanding Balance</div>
              <div className="font-medium">{formatCurrency(currentLoan.outstandingAmount)}</div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg">
              <div className="text-sm text-neutral-500 mb-1">Monthly Payment</div>
              <div className="font-medium">{formatCurrency(currentLoan.loanAmount / currentLoan.termMonths)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Payment */}
      {upcomingPayment && (
        <Card className="mb-6 border-2 border-primary-100">
          <CardHeader className="bg-primary-50">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Upcoming Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-neutral-500 mb-1">Due Date</div>
                <div className="font-medium">{formatDate(upcomingPayment.paymentDate)}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Amount</div>
                <div className="font-medium">{formatCurrency(upcomingPayment.amount)}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500 mb-1">Status</div>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {upcomingPayment.status}
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMakePayment}
              >
                Pay Now
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleMakePayment}
              >
                Schedule Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Options */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-3">Payment Options</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Pay down */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay Down</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Make a larger payment to reduce your principal balance.
            </p>
            <div className="mt-auto">
              <Link href={`/loans/${currentLoan.id}/paydown`}>
                <Button className="w-full justify-between" variant="outline">
                  Select <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Pay off */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4">
              <CheckIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay Off</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Pay off your loan completely and close the account.
            </p>
            <div className="mt-auto">
              <Link href={`/loans/${currentLoan.id}/payoff`}>
                <Button className="w-full justify-between" variant="outline">
                  Select <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Reschedule payment */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reschedule Payment</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Change your upcoming payment date to better align with your cash flow.
            </p>
            <div className="mt-auto">
              <Link href={`/loans/${currentLoan.id}/reschedule`}>
                <Button className="w-full justify-between" variant="outline">
                  Select <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Defer payment */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-50 mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Defer Payment</h3>
            <p className="text-neutral-600 text-sm mb-4">
              Skip your upcoming payment if you're experiencing financial hardship.
            </p>
            <div className="mt-auto">
              <Link href={`/loans/${currentLoan.id}/defer`}>
                <Button className="w-full justify-between" variant="outline">
                  Select <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Methods */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {paymentMethods?.map((method) => (
              <div key={method.id} className="flex items-center p-3 border rounded-lg">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {method.type === "Checking Account" 
                      ? `Checking Account (${method.accountNumber?.slice(-4)})` 
                      : `${method.type} (${method.cardNumber?.slice(-4)})`}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {method.bankName || ""}
                    {method.isPrimary && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Use
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Add New Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MakePayment;