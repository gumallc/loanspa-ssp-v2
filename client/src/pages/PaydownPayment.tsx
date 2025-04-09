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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Loan, PaymentMethod } from "@/lib/types";
import Layout from "@/components/layout/Layout";
import { LoanOverview } from "@/components/dashboard";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const PaydownPayment = () => {
  const [, setLocation] = useLocation();
  const params = useParams();
  const loanId = params.id ? parseInt(params.id) : 1;
  
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  
  const { data: loan, isLoading: isLoadingLoan } = useQuery<Loan>({
    queryKey: [`/api/loans/${loanId}`],
  });
  
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  // Calculate the max paydown amount (same as outstanding amount)
  const maxPaydownAmount = loan?.outstandingAmount || 0;
  
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
    
    // Generate mock payment schedule based on current data
    if (loan) {
      generatePaymentSchedule();
    }
  }, [loan, paymentMethods]);
  
  const generatePaymentSchedule = () => {
    if (!loan) return;
    
    const scheduleDate = new Date();
    const amount = parseFloat(paymentAmount) || 0;
    
    // Create an initial paydown payment for the entered amount
    const initialPayment = {
      date: new Date(paymentDate || scheduleDate).toLocaleDateString('en-US'),
      method: 'ACH',
      type: 'Paydown',
      principal: amount,
      interest: 0,
      loanFee: 0,
      lateFee: 0,
      nsfFee: 0,
      total: amount,
      status: 'Scheduled'
    };
    
    // Calculate remaining payments
    const remainingPayments = [];
    const monthlyPayment = (loan.outstandingAmount - amount) / loan.paymentsLeft;
    const monthlyInterest = (loan.outstandingAmount - amount) * (loan.interestRate / 100) / 12;
    
    for (let i = 0; i < 6; i++) {
      scheduleDate.setDate(scheduleDate.getDate() + 14);
      
      const payment = {
        date: scheduleDate.toLocaleDateString('en-US'),
        method: 'ACH',
        type: 'Regular',
        principal: i === 0 ? 0 : 0,
        interest: i === 0 ? monthlyInterest : 0,
        loanFee: 0,
        lateFee: 0,
        nsfFee: 0,
        total: i === 0 ? monthlyInterest : 0,
        status: 'Scheduled'
      };
      
      remainingPayments.push(payment);
    }
    
    setPaymentSchedule([initialPayment, ...remainingPayments]);
  };
  
  useEffect(() => {
    generatePaymentSchedule();
  }, [paymentAmount, paymentDate]);
  
  const handleSchedulePayment = () => {
    setConfirmDialogOpen(false);
    // In a real app, this would submit the payment to the backend
    // For now, we just redirect back to the dashboard
    setLocation("/");
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input with up to 2 decimal places
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      setPaymentAmount(parts.join('.'));
    } else {
      setPaymentAmount(value);
    }
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
            <CardTitle>Paydown Payment</CardTitle>
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
                  <p className="text-sm font-medium text-neutral-700">Outstanding Principal</p>
                </div>
                <div className="w-2/3">
                  <p className="text-sm">{formatCurrency(loan.outstandingAmount)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-1/3">
                  <p className="text-sm font-medium text-neutral-700">Max Paydown Amount (?)</p>
                </div>
                <div className="w-2/3 flex items-center">
                  <p className="text-sm mr-4">{formatCurrency(maxPaydownAmount)}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                  >
                    Update Max Amount
                  </Button>
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
                  <p className="text-sm font-medium text-neutral-700">Amount $</p>
                </div>
                <div className="w-2/3">
                  <Input 
                    type="text" 
                    value={paymentAmount} 
                    onChange={handleAmountChange}
                    className="w-40"
                  />
                </div>
              </div>
              
              {/* Payment Schedule Table */}
              <div className="mt-8">
                <div className="overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Method</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Principal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Interest</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Loan Fee</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Late Fee</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">NSF Fee</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Total</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentSchedule.map((payment, index) => (
                        <tr key={index} className={index === 0 ? "bg-blue-50" : ""}>
                          <td className="px-4 py-2 text-xs text-neutral-800">{payment.date}</td>
                          <td className="px-4 py-2 text-xs text-neutral-800">{payment.method}</td>
                          <td className="px-4 py-2 text-xs text-neutral-800">{payment.type}</td>
                          <td className="px-4 py-2 text-xs text-neutral-800">
                            {payment.principal > 0 ? formatCurrency(payment.principal) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800">
                            {payment.interest > 0 ? formatCurrency(payment.interest) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800">
                            {payment.loanFee > 0 ? formatCurrency(payment.loanFee) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800">
                            {payment.lateFee > 0 ? formatCurrency(payment.lateFee) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800">
                            {payment.nsfFee > 0 ? formatCurrency(payment.nsfFee) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800 font-medium">
                            {payment.total > 0 ? formatCurrency(payment.total) : "-"}
                          </td>
                          <td className="px-4 py-2 text-xs text-neutral-800">{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
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
              <DialogTitle>Paydown</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to schedule this paydown payment?</p>
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

export default PaydownPayment;