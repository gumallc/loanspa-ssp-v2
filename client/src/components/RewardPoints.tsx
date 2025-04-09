import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface RewardPointsProps {
  userId: number;
}

export default function RewardPoints({ userId }: RewardPointsProps) {
  const { data: rewards, isLoading } = useQuery({
    queryKey: [`/api/rewards/user/${userId}`],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rewards) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reward Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No rewards information available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="h-32 w-32 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="h-16 w-16 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.1046 15 14 14.1046 14 13C14 11.8954 13.1046 11 12 11C10.8954 11 10 11.8954 10 13C10 14.1046 10.8954 15 12 15Z" fill="currentColor" />
                <path d="M19.9999 13C19.9999 13.9154 19.8767 14.8112 19.6424 15.6693C19.4135 16.5086 19.0788 17.3035 18.6493 18.0307C18.5029 18.2752 18.3431 18.5114 18.1715 18.7383C17.3443 19.8842 16.253 20.7855 14.9863 21.3589C14.0396 21.7656 13.0194 22 11.9999 22C10.9804 22 9.96024 21.7656 9.01353 21.3589C7.74689 20.7855 6.65555 19.8842 5.82839 18.7383C5.65672 18.5114 5.49691 18.2752 5.35047 18.0307C4.92099 17.3035 4.58633 16.5086 4.35742 15.6693C4.1231 14.8112 3.99989 13.9154 3.99989 13C3.99989 9.13401 7.13391 6 11 6C14.8661 6 18.0001 9.13401 18.0001 13H19.9999Z" fill="currentColor" />
                <path d="M15 2H9C8.44772 2 8 2.44772 8 3V6H16V3C16 2.44772 15.5523 2 15 2Z" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">{rewards.points}</div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-center mb-6">
          Earn rewards while you borrow loan
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-muted-foreground">10 points for each loan payment</span>
          </div>
          <div className="flex items-center text-sm">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-muted-foreground">Bonus points for early payments</span>
          </div>
          <div className="flex items-center text-sm">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-muted-foreground">5,000 points = $50 discount</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          View Rewards Catalog
        </Button>
      </CardFooter>
    </Card>
  );
}
