import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Loan, Payment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Download, CircleHelp, FileText } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const LoanDetails = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: loan, isLoading: isLoadingLoan } = useQuery<Loan>({
    queryKey: [`/api/loans/${id}`],
    onError: () => {
      // Redirect to dashboard if loan not found
      setLocation("/");
    }
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: [`/api/loans/${id}/payments`],
    enabled: !!id,
  });

  // Reset to page 1 when loan ID changes
  useEffect(() => {
    setCurrentPage(1);
  }, [id]);

  if (isLoadingLoan || isLoadingPayments) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-1/3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              <Skeleton className="h-7 w-1/3" />
            </CardTitle>
            <Skeleton className="h-9 w-32" />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Skeleton className="h-10 w-full" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-neutral-200 py-4">
                <div className="grid grid-cols-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">The requested loan information could not be found.</p>
          <Button className="mt-4" onClick={() => setLocation("/")}>
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = payments ? Math.ceil(payments.length / itemsPerPage) : 0;
  const paginatedPayments = payments
    ? payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Loan Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Current Loan Balance</h3>
              <p className="text-lg font-semibold text-neutral-800">{formatCurrency(loan.outstandingAmount)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Loan Status</h3>
              <p className="text-lg font-semibold text-neutral-800">{loan.status}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Loan ID</h3>
              <p className="text-lg font-semibold text-neutral-800">{loan.loanId}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Principal Loan Amount</h3>
              <p className="text-lg font-semibold text-neutral-800">{formatCurrency(loan.loanAmount)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500">Date Funded</h3>
              <p className="text-lg font-semibold text-neutral-800">{formatDate(loan.dateFunded)}</p>
            </div>
          </div>
          
          <div className="flex mt-6 space-x-4">
            <Button variant="outline" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Payment Schedule
            </Button>
            
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Loan Document
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Payment History</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardHeader>
        <CardContent>
          {/* Payment History Table */}
          <div className="rounded-md border">
            <div className="grid grid-cols-3 font-medium border-b bg-neutral-50 py-3 px-4">
              <div>Date</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map(payment => (
                <div key={payment.id} className="grid grid-cols-3 border-b py-3 px-4 last:border-b-0">
                  <div>{formatDate(payment.paymentDate)}</div>
                  <div>{formatCurrency(payment.amount)}</div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                    {payment.status === "Missed" || payment.status === "Deferred" ? (
                      <CircleHelp className="inline ml-1 h-4 w-4 text-neutral-400" />
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-neutral-500">
                No payment history available.
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show current page and surrounding pages
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageNum = currentPage - 3 + i;
                    }
                    if (currentPage > totalPages - 2) {
                      pageNum = totalPages - 5 + i + 1;
                    }
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanDetails;
