import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  X,
} from "lucide-react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface RecentActivityProps {
  userId?: number;
}

const RecentActivity = ({ userId }: RecentActivityProps) => {
  const [showAll, setShowAll] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const displayedTransactions = showAll
    ? transactions
    : transactions?.slice(0, 4);

  const getTransactionIcon = (transaction: Transaction) => {
    switch (transaction.type.toLowerCase()) {
      case "payment":
        return <Calendar className="w-5 h-5" />;
      case "credit purchase":
        return <DollarSign className="w-5 h-5" />;
      case "refund":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const renderSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          <Skeleton className="h-7 w-1/3" />
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardHeader>
      <CardContent>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border-b border-neutral-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0"
          >
            <div className="flex items-start">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">No recent activity found.</p>
        </CardContent>
      </Card>
    );
  }

  // Component to render a single transaction item
  const TransactionItem = ({ transaction }: { transaction: Transaction }) => (
    <div className="border-b border-neutral-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-neutral-100 text-neutral-600">
              {getInitials(transaction.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-800">
              {transaction.name}
            </h3>
            <span className="text-sm font-medium text-neutral-500">
              {formatDate(transaction.date)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
            </div>
            <span className="text-sm font-medium text-neutral-800">
              {formatCurrency(transaction.amount)} USD
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex items-center">
            <Button
              variant="link"
              className="text-sm flex items-center"
              onClick={() => setShowAll(!showAll)}
            >
              View {showAll ? "Less" : "All"}
              <ExternalLink size={16} className="ml-1" />
            </Button>
            <Button variant="link" className="text-sm flex items-center ml-2">
              Download PDF
              <Download size={16} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {displayedTransactions?.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}

          <Button
            variant="outline"
            className="w-full mt-4 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => setDialogOpen(true)}
          >
            View All Transactions
          </Button>
        </CardContent>
      </Card>

      {/* Dialog for viewing all transactions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>All Transactions</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="py-2">
            {transactions?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="ml-auto mr-2"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => window.print()}
            >
              Download PDF
              <Download size={16} className="ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecentActivity;
