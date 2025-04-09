import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Payment, Loan } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Extended payment type with additional attributes for payment history
interface ExtendedPayment extends Payment {
  principalAllocation: number;
  feeAllocation: number;
  feeDue: number;
  remainingBalance: number;
}

export default function PaymentHistory() {
  const [, params] = useRoute("/loans/:id/payments");
  const loanId = params?.id ? parseInt(params.id) : undefined;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const itemsPerPage = 10;
  
  // Get loan data
  const { data: loan, isLoading: isLoadingLoan } = useQuery<Loan>({
    queryKey: ["/api/loans", loanId],
    enabled: !!loanId,
  });
  
  // Get payments data
  const { data: rawPayments = [], isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/loans", loanId, "payments"],
    enabled: !!loanId,
  });

  const isLoading = isLoadingLoan || isLoadingPayments;
  
  // Convert to extended payments with principal, fee allocations and balance
  // In a real application, this data would come from the API
  const extendedPayments: ExtendedPayment[] = rawPayments.map((payment, index) => {
    // Calculate example values for demonstration
    const principalAllocation = payment.amount * 0.85; // 85% to principal
    const feeAllocation = payment.amount * 0.15; // 15% to fees
    const feeDue = feeAllocation * 1.2; // sample fee due calculation
    // Calculate a decreasing balance (this would normally come from the API)
    const startingBalance = loan?.loanAmount || 10000;
    const prevPayments = rawPayments.slice(0, index);
    const prevPaymentsTotal = prevPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = startingBalance - prevPaymentsTotal - principalAllocation;
    
    return {
      ...payment,
      principalAllocation,
      feeAllocation,
      feeDue,
      remainingBalance: Math.max(0, remainingBalance),
    };
  });
  
  // Filter payments by search term and status
  const filteredPayments = extendedPayments.filter(payment => {
    const matchesSearch = payment.id.toString().includes(searchTerm) || 
                         formatDate(payment.paymentDate).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const handleDownloadCSV = () => {
    // Generate CSV data
    const headers = ["No.", "Date", "Amount", "PrincAlloc", "FeeAlloc", "FeeDue", "Balance", "Status"];
    const csvData = filteredPayments.map(payment => [
      payment.id,
      formatDate(payment.paymentDate),
      payment.amount.toFixed(2),
      payment.principalAllocation.toFixed(2),
      payment.feeAllocation.toFixed(2),
      payment.feeDue.toFixed(2),
      payment.remainingBalance.toFixed(2),
      payment.status
    ]);
    
    // Convert to CSV string
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payment_history_loan_${loanId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        {/* Header with back button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="p-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Payment History</h1>
          <p className="text-neutral-500">
            {loan ? `Loan ${loan.loanId}: ${loan.loanType}` : "View all your payment transactions"}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Payment Transactions</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Payment History Table */}
            <div className="border rounded-md overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Principal</TableHead>
                    <TableHead className="hidden md:table-cell">Fee Alloc</TableHead>
                    <TableHead className="hidden md:table-cell">Fee Due</TableHead>
                    <TableHead className="hidden md:table-cell">Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPayments.length > 0 ? (
                    paginatedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(payment.principalAllocation)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(payment.feeAllocation)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(payment.feeDue)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatCurrency(payment.remainingBalance)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${payment.status === 'Completed' && 'bg-green-100 text-green-800'}
                            ${payment.status === 'Processing' && 'bg-blue-100 text-blue-800'}
                            ${payment.status === 'Scheduled' && 'bg-purple-100 text-purple-800'}
                            ${payment.status === 'Declined' && 'bg-red-100 text-red-800'}
                          `}>
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-neutral-500">
                        No payments found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {filteredPayments.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
                  {filteredPayments.length} payments
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Loan Summary Card */}
        {loan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Loan Summary</CardTitle>
              <CardDescription>Overview of your loan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Original Amount</div>
                  <div className="text-lg font-semibold">{formatCurrency(loan.loanAmount)}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Outstanding Balance</div>
                  <div className="text-lg font-semibold">{formatCurrency(loan.outstandingAmount)}</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Interest Rate</div>
                  <div className="text-lg font-semibold">{loan.interestRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500 mb-1">Payments Remaining</div>
                  <div className="text-lg font-semibold">{loan.paymentsLeft}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}