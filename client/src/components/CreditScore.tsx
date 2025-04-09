import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreditScore() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Your Credit Score</CardTitle>
        <Button
          variant="secondary"
          size="sm"
          className="bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          Check Again
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-center mb-2">
          <div className="relative h-36 w-36">
            <svg viewBox="0 0 36 36" className="h-36 w-36 transform -rotate-90">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
                strokeDasharray="100, 100"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#score-gradient)"
                strokeWidth="3"
                strokeDasharray="80, 100"
              />
              <defs>
                <linearGradient
                  id="score-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900">880</div>
                <div className="text-xs font-medium text-muted-foreground">
                  +20 Points
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <div className="text-sm font-medium">TransUnion</div>
          <div className="text-xs text-muted-foreground mt-1">
            Score calculated using VantageScorer 3.0
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            March 11, 2025
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
