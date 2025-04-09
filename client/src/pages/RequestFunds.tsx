import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loan, User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Check, ArrowRight, Info } from "lucide-react";

const RequestFunds = () => {
  const [requestAmount, setRequestAmount] = useState(500);
  const [step, setStep] = useState(1);
  
  // Get user data
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });
  
  // Get loan data
  const { data: loans } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });
  
  const currentLoan = loans?.[0];
  
  const preQualifiedAmount = 2000; // This would come from API in real app
  const minAmount = 100;
  const maxAmount = preQualifiedAmount;
  
  // Calculate new payment details based on requested amount
  const calculateNewPayments = () => {
    // This is a simplified calculation
    const interestRate = currentLoan?.interestRate || 5.9;
    const termMonths = 12;
    
    // Simple monthly payment calculation (principal + interest) / term
    const monthlyInterestRate = interestRate / 100 / 12;
    const denominator = Math.pow(1 + monthlyInterestRate, termMonths) - 1;
    const monthlyPayment = requestAmount * monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, termMonths)) / denominator;
    
    const totalInterest = (monthlyPayment * termMonths) - requestAmount;
    const totalPayment = requestAmount + totalInterest;
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      termMonths
    };
  };
  
  const newPayments = calculateNewPayments();
  
  const handleAmountChange = (value: number[]) => {
    setRequestAmount(value[0]);
  };
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Request Additional Funds</h1>
        <p className="text-neutral-500 mt-1">
          Apply for a new express loan to get additional funds quickly
        </p>
      </div>
      
      {step === 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Pre-Qualification Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Good news, {user?.fullName}!</h3>
                  <div className="mt-2 text-green-700">
                    <p>You're pre-qualified for an Express Loan of up to:</p>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(preQualifiedAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                How much would you like to request?
              </label>
              <div className="mb-6">
                <Input
                  type="number"
                  min={minAmount}
                  max={maxAmount}
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(Number(e.target.value))}
                  className="text-lg font-bold mb-4"
                />
                <Slider
                  defaultValue={[requestAmount]}
                  max={maxAmount}
                  min={minAmount}
                  step={100}
                  onValueChange={handleAmountChange}
                  className="my-4"
                />
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>{formatCurrency(minAmount)}</span>
                  <span>{formatCurrency(maxAmount)}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleNextStep} className="flex items-center">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === 2 && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Loan Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">You're eligible!</h3>
                <p className="text-blue-700">Here's what your new payment schedule will look like:</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm text-neutral-500 mb-1">Loan Amount</div>
                  <div className="text-2xl font-bold">{formatCurrency(requestAmount)}</div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm text-neutral-500 mb-1">Monthly Payment</div>
                  <div className="text-2xl font-bold">{formatCurrency(parseFloat(newPayments.monthlyPayment))}</div>
                </div>
                
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="text-sm text-neutral-500 mb-1">Term</div>
                  <div className="text-2xl font-bold">{newPayments.termMonths} months</div>
                </div>
              </div>
              
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-neutral-800 mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(requestAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Interest Rate:</span>
                    <span className="font-medium">{currentLoan?.interestRate || 5.9}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Interest:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(newPayments.totalInterest))}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold">
                    <span>Total Payment:</span>
                    <span>{formatCurrency(parseFloat(newPayments.totalPayment))}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Confirm & Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-neutral-500" />
                <span>Important Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-neutral-600 space-y-4">
                <p>
                  This Express Loan will be disbursed as a separate loan from your existing loan(s).
                  Funds are typically available within 24 hours of approval.
                </p>
                <p>
                  By confirming, you agree to the terms of the loan agreement and authorize us to
                  perform a soft credit check, which will not affect your credit score.
                </p>
                <p>
                  <span className="font-semibold">Note:</span> The actual loan terms may vary based on final approval.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RequestFunds;