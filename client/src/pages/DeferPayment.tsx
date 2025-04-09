import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loan, Payment } from "@/lib/types";
import { AlertCircle, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import LoanOverview from "@/components/dashboard/LoanOverview";

export default function DeferPayment() {
  const params = useParams();
  const loanId = params?.id ? parseInt(params.id) : undefined;

  const [success, setSuccess] = useState(false);
  const [deferOption, setDeferOption] = useState("2-weeks");

  // Get loan data
  const { data: loan, isLoading: isLoadingLoan } = useQuery<Loan>({
    queryKey: ["/api/loans", loanId],
    enabled: !!loanId,
  });

  // Get scheduled payments data
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: [`/api/loans/${loanId}/payments`],
    enabled: !!loanId,
  });

  const isLoading = isLoadingLoan || isLoadingPayments;

  // Get the current scheduled payment - force it to exist for the UI mockup
  // In a real app, we would use the actual scheduled payment
  const currentPayment = {
    id: 14,
    loanId: loanId || 1,
    userId: 1,
    amount: 215.0,
    paymentDate: "2025-04-20",
    status: "Scheduled",
  };

  // Set fixed due date to April 20, 2025 as per requirements
  const currentDate = new Date(2025, 3, 20); // April 20, 2025
  const paymentAmount = 215.0; // As per requirements

  const handleDefer = () => {
    // In a real app, you would call an API to update the payment date
    setSuccess(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!loan || !currentPayment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No payment scheduled</h2>
        <p className="text-neutral-600 mb-6">
          There is no upcoming payment to defer.
        </p>
        <Link href="/make-payment">
          <Button>Return to Payments</Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto pt-8 px-4">
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-8 shadow-sm">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Deferred</h2>
          <p className="text-neutral-600 mb-6 text-center">
            Your payment has been successfully deferred.
          </p>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <LoanOverview showBackButton={true} />
        </div>

        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Defer Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-6">
                <div className="flex items-center">
                  <div className="w-1/3">
                    <p className="text-sm font-medium text-neutral-700">
                      Payment Method
                    </p>
                  </div>
                  <div className="w-2/3">
                    <Select defaultValue="ach">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ach">ACH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">
                    Select Payment
                  </p>
                </div>
                <div className="w-2/3">
                  <Select defaultValue="payment-april-20">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment-april-20">
                        April 20, 2025 - $215.00
                      </SelectItem>
                      <SelectItem value="payment-may-20">
                        May 20, 2025 - $215.00
                      </SelectItem>
                      <SelectItem value="payment-june-20">
                        June 20, 2025 - $215.00
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="mt-8 py-4 border-t">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-500">Due Date</p>
                  <p className="font-medium">April 20, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Amount</p>
                  <p className="font-medium">${paymentAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <p className="font-medium text-green-600">
                    Eligible for Deferral
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-medium mb-3">Deferral Options:</p>
                <RadioGroup
                  value={deferOption}
                  onValueChange={setDeferOption}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-week" id="1-week" />
                    <Label
                      htmlFor="1-week"
                      className="font-normal cursor-pointer"
                    >
                      1 Week (New due date: April 27, 2025)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-weeks" id="2-weeks" />
                    <Label
                      htmlFor="2-weeks"
                      className="font-normal cursor-pointer"
                    >
                      2 Weeks (New due date: May 4, 2025)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-month" id="1-month" />
                    <Label
                      htmlFor="1-month"
                      className="font-normal cursor-pointer"
                    >
                      1 Month (New due date: May 20, 2025)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start mb-6">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  Deferment will shift your repayment schedule and may increase
                  the total repayment amount.
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" className="border-neutral-200">
                Cancel
              </Button>
              <Button
                onClick={handleDefer}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
