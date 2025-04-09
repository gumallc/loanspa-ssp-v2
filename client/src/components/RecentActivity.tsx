import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ChevronRight, Download, CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface RecentActivityProps {
  userId: number;
}

export default function RecentActivity({ userId }: RecentActivityProps) {
  const [page, setPage] = useState(1);

  const { data: activities, isLoading } = useQuery({
    queryKey: [`/api/activities/user/${userId}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Recent Activity</CardTitle>
          <Skeleton className="h-9 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return { variant: "outline", children: "Processing" };
      case "sent":
        return { variant: "secondary", children: "Sent" };
      case "completed":
        return { variant: "secondary", children: "Completed" };
      case "declined":
        return { variant: "destructive", children: "Declined" };
      case "scheduled":
        return { variant: "outline", children: "Scheduled" };
      default:
        return { variant: "outline", children: status };
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "declined":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
            <Download className="mr-2 h-3 w-3" />
            Download PDF
          </Button>
          <Link href={`/loans/1/payments`}>
            <Button variant="default" size="sm" className="h-8 px-2 text-xs">
              View All
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium">
                    {activity.type === 'payment' ? 'Loan Payment' : activity.description}
                    {activity.loanId && <span className="text-neutral-500"> • Loan #{activity.loanId}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(activity.date), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
                <Badge 
                  variant={
                    activity.status.toLowerCase() === "processing" ? "outline" : 
                    activity.status.toLowerCase() === "completed" ? "secondary" : 
                    activity.status.toLowerCase() === "declined" ? "destructive" : 
                    "outline"
                  } 
                  className="ml-2"
                >
                  {activity.status}
                </Badge>
                <div className="ml-4 text-sm font-medium">
                  ${Number(activity.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-neutral-500">
              No recent activity to display
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <span className="text-sm text-muted-foreground">
          Showing page {page} of {Math.ceil((activities?.length || 0) / 4)}
        </span>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil((activities?.length || 0) / 4)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
