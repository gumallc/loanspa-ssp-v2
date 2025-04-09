import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { Loan, PaymentMethod } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import { LoanOverview } from "@/components/dashboard";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PayoffPayment = () => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const loanId = params.id ? parseInt(params.id) : 1;
  
  const [paymentDate, setPaymentDate] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [payoffDiscounts, setPayoffDiscounts] = useState({
    principal: "0",
    interest: "0",
    lateFee: "0",
    nsfFee: "0"
  });
  const [discountReason, setDiscountReason] = useState("");
  
  const { data: loan, isLoading: isLoadingLoan } = useQuery<Loan>({
    queryKey: [`/api/loans/${loanId}`],
  });
  
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });
  
  useEffect(() => {
    // Set default payment date to today + 1 day in MM/DD/YYYY format
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setPaymentDate(today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }));
    
    // Set default payment method to the primary one
    const primaryMethod = paymentMethods?.find(method => method.isPrimary);
    if (primaryMethod) {
      setSelectedPaymentMethod(primaryMethod.id.toString());
    }
  }, [loan, paymentMethods]);
  
  const handleGetQuote = () => {
    setQuoteGenerated(true);
  };
  
  const handleSchedulePayment = () => {
    setConfirmDialogOpen(false);
    // In a real app, this would submit the payment to the backend
    // For now, we just redirect back to the dashboard
    setLocation("/");
  };
  
  if (isLoadingLoan || !loan) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-neutral-200 rounded mb-6"></div>
          </div>
        </div>
      </Layout>
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
            <CardTitle>Payoff Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Bank Name:</p>
                </div>
                <div className="w-2/3">
                  <p className="text-sm">Mechanics Bank,</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Account Number:</p>
                </div>
                <div className="w-2/3">
                  <p className="text-sm">############{loan.loanId.slice(-4)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Payment Method</p>
                </div>
                <div className="w-2/3">
                  <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="ACH" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods?.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          {method.type === "Checking Account" ? "ACH" : method.type}
                          {method.isPrimary && " (Primary)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Date</p>
                </div>
                <div className="w-2/3">
                  <div className="flex items-center">
                    <Input 
                      type="text" 
                      value={paymentDate} 
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-40"
                    />
                    <p className="text-xs text-neutral-500 ml-4">
                      Can't go past {new Date(new Date().setDate(new Date().getDate() + 14))
                        .toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Payoff Quote*</p>
                </div>
                <div className="w-2/3">
                  <span className="text-sm mr-4">$NaN</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGetQuote}
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
              
              {/* Payoff Discounts */}
              {quoteGenerated && (
                <>
                  <div className="flex items-start mt-6">
                    <div className="w-1/5">
                      <p className="text-sm font-medium text-neutral-700">Payoff Discounts</p>
                    </div>
                    
                    <div className="flex flex-wrap w-4/5 -mx-2">
                      <div className="px-2 w-1/4">
                        <p className="text-xs text-neutral-600 mb-1">Principal</p>
                        <div className="flex items-center">
                          <span className="mr-1 text-xs">$</span>
                          <Input 
                            type="text" 
                            value={payoffDiscounts.principal}
                            onChange={(e) => setPayoffDiscounts({...payoffDiscounts, principal: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="px-2 w-1/4">
                        <p className="text-xs text-neutral-600 mb-1">Interest</p>
                        <div className="flex items-center">
                          <span className="mr-1 text-xs">$</span>
                          <Input 
                            type="text" 
                            value={payoffDiscounts.interest}
                            onChange={(e) => setPayoffDiscounts({...payoffDiscounts, interest: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="px-2 w-1/4">
                        <p className="text-xs text-neutral-600 mb-1">Late Fee</p>
                        <div className="flex items-center">
                          <span className="mr-1 text-xs">$</span>
                          <Input 
                            type="text" 
                            value={payoffDiscounts.lateFee}
                            onChange={(e) => setPayoffDiscounts({...payoffDiscounts, lateFee: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="px-2 w-1/4">
                        <p className="text-xs text-neutral-600 mb-1">NSF Fee</p>
                        <div className="flex items-center">
                          <span className="mr-1 text-xs">$</span>
                          <Input 
                            type="text" 
                            value={payoffDiscounts.nsfFee}
                            onChange={(e) => setPayoffDiscounts({...payoffDiscounts, nsfFee: e.target.value})}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <p className="text-sm font-medium text-neutral-700">Discount Reason</p>
                    </div>
                    <div className="w-2/3">
                      <Select value={discountReason} onValueChange={setDiscountReason}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardship">Financial Hardship</SelectItem>
                          <SelectItem value="goodwill">Goodwill Adjustment</SelectItem>
                          <SelectItem value="error">Billing Error</SelectItem>
                          <SelectItem value="settlement">Settlement Agreement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Payoff Summary Table */}
                  <div className="mt-8">
                    <div className="overflow-hidden bg-white shadow-sm rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 w-1/4">Principal</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 w-1/4">Interest</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 w-1/4">Late Fee</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 w-1/4">NSF Fee</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700 w-1/4">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3 text-sm text-neutral-800">-</td>
                            <td className="px-4 py-3 text-sm text-neutral-800">-</td>
                            <td className="px-4 py-3 text-sm text-neutral-800">-</td>
                            <td className="px-4 py-3 text-sm text-neutral-800">-</td>
                            <td className="px-4 py-3 text-sm font-medium text-neutral-800">$NaN</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-xs text-neutral-600 mt-2">
                      * Quote is correct assuming all pending payments clear successfully. Otherwise there will be an outstanding balance owed.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={!quoteGenerated}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payoff</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to schedule this payoff payment?</p>
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialogOpen(false)}
                className="bg-neutral-200"
              >
                No
              </Button>
              <Button 
                onClick={handleSchedulePayment}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PayoffPayment;