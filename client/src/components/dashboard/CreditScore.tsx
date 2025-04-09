import { useQuery } from "@tanstack/react-query";
import { CreditScore as CreditScoreType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const CreditScore = () => {
  const { data: creditScore, isLoading } = useQuery<CreditScoreType>({
    queryKey: ["/api/credit-score"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
          <Skeleton className="h-9 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
      </Card>
    );
  }

  if (!creditScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Credit Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">
            Credit score information not available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 800) return "#10b981"; // Good - green
    if (score >= 670) return "#f59e0b"; // Fair - amber
    return "#ef4444"; // Poor - red
  };

  const scoreColor = getScoreColor(creditScore.score);

  // For the circular gauge
  const circumference = 2 * Math.PI * 86; // 2πr where r is 86
  const scorePercent = Math.min(
    100,
    Math.max(0, (creditScore.score / 900) * 100),
  );
  const offset = circumference - (scorePercent / 100) * circumference;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Your Credit Score</CardTitle>
        <Button
          variant="outline"
          size="sm"
          className="bg-neutral-800 hover:bg-neutral-900 text-white"
        >
          Check Again
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="180" height="180" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
                opacity="0.3"
              />

              {/* Red section */}
              <path
                d="M100,100 L100,12 A88,88 0 0,1 157,157 Z"
                fill="#ef4444"
                opacity="0.7"
              />

              {/* Yellow section */}
              <path
                d="M100,100 L157,157 A88,88 0 0,1 12,100 Z"
                fill="#f59e0b"
                opacity="0.7"
              />

              {/* Green section */}
              <path
                d="M100,100 L12,100 A88,88 0 0,1 100,12 Z"
                fill="#10b981"
                opacity="0.7"
              />

              {/* Center circle */}
              <circle cx="100" cy="100" r="70" fill="white" />

              {/* Score display */}
              <text
                x="100"
                y="90"
                textAnchor="middle"
                fontSize="48"
                fontWeight="bold"
                fill="#1f2937"
              >
                {creditScore.score}
              </text>

              {/* Point change indicator */}
              <text
                x="100"
                y="115"
                textAnchor="middle"
                fontSize="16"
                fill="#10b981"
                fontWeight="500"
              >
                +{creditScore.pointsChange || "20"} Points
              </text>
            </svg>

            {/* Score indicator */}
            <div
              className="absolute"
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                border: "2px solid white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                left: `${90 + 75 * Math.cos(Math.PI * 1.2)}px`,
                top: `${90 + 75 * Math.sin(Math.PI * 1.2)}px`,
              }}
            />
          </div>

          <div className="text-center text-sm text-neutral-500 mt-2">
            <p>
              <span className="font-medium">{creditScore.provider}</span>
            </p>
            <p className="text-xs">Score calculated using VantageScorer 3.0</p>
            <p className="text-xs mt-1">Last updated: March 11, 2025</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditScore;
