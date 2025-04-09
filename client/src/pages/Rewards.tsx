import { useQuery } from "@tanstack/react-query";
import { Reward } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Ticket, CreditCard, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Rewards = () => {
  const { data: reward, isLoading } = useQuery<Reward>({
    queryKey: ["/api/rewards"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
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

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-1/3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reward) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">No reward information available.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentage for the progress circle
  const progressPercentage = Math.min(100, (reward.currentPoints / 1000) * 100);
  
  // Calculate points needed for next reward level
  const pointsForNextReward = Math.max(0, 1000 - reward.currentPoints);

  // Mock reward options for the UI
  const rewardOptions = [
    {
      title: "$50 Gift Card",
      points: 5000,
      icon: <Gift className="h-8 w-8" />,
      description: "Redeem for popular retailers and restaurants"
    },
    {
      title: "Loan Payment Credit",
      points: 7500,
      icon: <CreditCard className="h-8 w-8" />,
      description: "Apply points directly to your next loan payment"
    },
    {
      title: "Interest Rate Discount",
      points: 10000,
      icon: <Ticket className="h-8 w-8" />,
      description: "0.25% reduction on your next loan"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>U Rewards Program</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-10">
              <div className="w-36 h-36 mx-auto relative">
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-neutral-800">{reward.currentPoints}</span>
                  <span className="text-sm text-neutral-500">points</span>
                </div>
                <svg viewBox="0 0 36 36" className="w-36 h-36 transform -rotate-90">
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
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Welcome to your Rewards Dashboard</h2>
              <p className="text-neutral-600 mb-4">
                Earn points by making on-time payments, referring friends, and maintaining your account in good standing.
                Redeem your points for gift cards, payment credits, or interest rate discounts.
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600">Current progress to next reward</span>
                  <span className="font-medium">{reward.currentPoints}/1000 points</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-primary-50 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-primary-600">{pointsForNextReward}</div>
                  <div className="text-xs text-neutral-600">Points needed for next reward</div>
                </div>
                
                <div className="bg-secondary-50 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-secondary-600">{reward.totalEarnedPoints}</div>
                  <div className="text-xs text-neutral-600">Total points earned</div>
                </div>
                
                <div className="bg-neutral-100 p-3 rounded-lg">
                  <div className="text-lg font-semibold text-neutral-800">3</div>
                  <div className="text-xs text-neutral-600">Available rewards</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewardOptions.map((option, index) => (
              <div 
                key={index} 
                className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    {option.icon}
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-neutral-100 text-neutral-800 px-2 py-1 rounded-full text-xs font-medium">
                      {option.points} points
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">{option.title}</h3>
                <p className="text-sm text-neutral-600 mb-4">{option.description}</p>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  disabled={reward.currentPoints < option.points}
                >
                  {reward.currentPoints >= option.points ? "Redeem Now" : "Not Enough Points"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How to Earn More Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 flex-shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Make On-Time Payments</h3>
                <p className="text-sm text-neutral-600">Earn 10 points for each loan payment made on or before the due date.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 flex-shrink-0">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Account Longevity</h3>
                <p className="text-sm text-neutral-600">Earn 50 bonus points for every 6 months your account is in good standing.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Refer Friends</h3>
                <p className="text-sm text-neutral-600">Earn 200 points for each friend who signs up using your referral code and is approved for a loan.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-4 flex-shrink-0">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-800 mb-1">Special Promotions</h3>
                <p className="text-sm text-neutral-600">Keep an eye out for limited-time promotions and bonus point opportunities.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Reward Points FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="claim-points">
              <AccordionTrigger>How do I claim my points?</AccordionTrigger>
              <AccordionContent>
                Your points are automatically credited to your account. You don't need to claim them manually. They will appear in your rewards dashboard within 48 hours of the qualifying activity.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="points-expire">
              <AccordionTrigger>Do my points expire?</AccordionTrigger>
              <AccordionContent>
                Points expire 12 months after they are earned if not redeemed. Points earned through promotional activities may have different expiration terms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="redeem-minimum">
              <AccordionTrigger>Is there a minimum number of points I need to redeem?</AccordionTrigger>
              <AccordionContent>
                Yes, most rewards require a minimum of 1,000 points to redeem. Some premium rewards may require 5,000 points or more.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="transfer-points">
              <AccordionTrigger>Can I transfer my points to someone else?</AccordionTrigger>
              <AccordionContent>
                No, points are non-transferable and can only be redeemed by the account holder who earned them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
