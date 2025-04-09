import { useQuery } from "@tanstack/react-query";
import { Reward } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

const RewardPoints = () => {
  const { data: reward, isLoading } = useQuery<Reward>({
    queryKey: ["/api/rewards"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Skeleton className="h-28 w-28 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mt-4" />
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  if (!reward) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reward Points</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">No reward information found.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentage for the progress circle
  const progressPercentage = Math.min(100, (reward.currentPoints / 1000) * 100);
  
  // Calculate points needed for next reward level (just for demo purposes)
  const pointsForNextReward = Math.max(0, 1000 - reward.currentPoints);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="mr-4">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage}, 100`}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-neutral-800">{reward.currentPoints}</span>
                <span className="text-xs text-neutral-500">points</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-2">
              Earn rewards while you borrow loan
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-600">Next reward</span>
                <span className="font-medium">{reward.currentPoints}/1000 points</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardPoints;
