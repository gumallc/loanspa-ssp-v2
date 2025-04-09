import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rewards FAQ</CardTitle>
          <p className="text-sm text-neutral-600">By participating in the Rewards Program, you agree to be bound by all of the U Rewards Terms and Conditions.</p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="claim-points">
              <AccordionTrigger>How do I claim my points?</AccordionTrigger>
              <AccordionContent>
                You can claim your points by logging into your account and accessing the "Rewards" section.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="earn-points">
              <AccordionTrigger>How do I earn points?</AccordionTrigger>
              <AccordionContent>
                You earn points by making timely payments on your loan, referring friends, or completing account activities.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="redeem-points">
              <AccordionTrigger>How do I redeem my points</AccordionTrigger>
              <AccordionContent>
                To redeem your points, log in to your account and select the "U Rewards" button. Click the "Redeem Rewards" button and select your choice of redemption option. A $50 gift card can be redeemed for 5,000 points, and a $100 gift card can be redeemed for 10,000 points. You can also redeem any number of points towards a principal paydown by selecting the principal paydown option. Your account must be in good standing to redeem your points. Newly earned points can be redeemed after four days.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="points-value">
              <AccordionTrigger>What can I get with my points?</AccordionTrigger>
              <AccordionContent>
                You can redeem your points for gift cards, loan payment credits, or statement credits, depending on your point balance.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="check-points">
              <AccordionTrigger>How do I check my points balance?</AccordionTrigger>
              <AccordionContent>
                Your current points balance is displayed on the dashboard and in the Rewards section of your account.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="points-processing">
              <AccordionTrigger>How long does it take for new points to appear in my client portal?</AccordionTrigger>
              <AccordionContent>
                New points typically appear in your account within 24-48 hours of the qualifying action.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="points-expiry">
              <AccordionTrigger>Do my points expire?</AccordionTrigger>
              <AccordionContent>
                Points expire 12 months after they are earned if not redeemed. Points earned through promotional activities may have different expiration terms.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cash-value">
              <AccordionTrigger>Do my points have any cash value?</AccordionTrigger>
              <AccordionContent>
                Points have no cash value and cannot be exchanged for cash. They can only be redeemed for the rewards options available in the program.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Faq;
