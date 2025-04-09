import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Inbox,
  Mail,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const supportItems = [
  {
    icon: <Phone className="w-6 h-6 text-primary" />,
    title: "Phone Support",
    description:
      "For Customer Success, Past-Due Payments, or to speak with our Loan Specialists, please call us at:",
    action: "(888) 273-0204",
    href: "tel:+18882730204",
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-primary" />,
    title: "Online Chat",
    description:
      "During regular business hours, use our online chat feature to receive real-time help from our Loan Specialists.",
    action: "Start a Chat",
    href: "#", // Replace with your actual chat handler if needed
  },
  {
    icon: <Inbox className="w-6 h-6 text-primary" />,
    title: "E-mail",
    description:
      "Email us your question or concern. We respond within one business day.",
    action: "CustomerService@Loanspa.com",
    href: "mailto:CustomerService@Loanspa.com",
  },
  {
    icon: <Mail className="w-6 h-6 text-primary" />,
    title: "Mail",
    description: "LoanSpa\nPO Box 5002\nFredericksburg, VA 22403-5002",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
    title: "Text and SMS",
    description: "Text us at (888) 628-0777 and we’ll respond promptly.",
    action: "(888) 628-0777",
    href: "sms:+18886280777",
  },
  {
    icon: <HelpCircle className="w-6 h-6 text-primary" />,
    title: "FAQ",
    description: "Find answers about applying, receiving, or repaying a loan.",
    action: "Visit FAQ Page",
    href: "/faq",
  },
];

const Support = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {supportItems.map((item, index) => (
        <Card
          key={index}
          className="transition-transform transform hover:scale-[1.02] hover:shadow-lg duration-300 ease-in-out"
        >
          <CardHeader className="flex flex-row items-center gap-3">
            {item.icon}
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 whitespace-pre-line">
              {item.description}
            </p>
            {item.href && (
              <a
                href={item.href}
                className="block mt-2 text-sm font-medium text-primary hover:underline"
              >
                {item.action}
              </a>
            )}
            {!item.href && item.action && (
              <p className="mt-2 text-sm font-semibold text-neutral-800">
                {item.action}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Support;
