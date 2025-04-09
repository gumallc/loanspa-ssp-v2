export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  profileImage?: string;
  homePhone?: string;
  cellPhone?: string;
}

export interface Loan {
  id: number;
  userId: number;
  loanType: string;
  loanAmount: number;
  outstandingAmount: number;
  interestRate: number;
  termMonths: number;
  paymentsLeft: number;
  loanId: string;
  dateFunded: string;
  status: string;
}

export interface PaymentMethod {
  id: number;
  userId: number;
  type: string;
  bankName?: string;
  accountNumber?: string;
  cardNumber?: string;
  isPrimary: boolean;
}

export interface Payment {
  id: number;
  loanId: number;
  userId: number;
  amount: number;
  paymentDate: string;
  status: string;
}

export interface Transaction {
  id: number;
  userId: number;
  name: string;
  amount: number;
  date: string;
  status: string;
  type: string;
}

export interface Reward {
  id: number;
  userId: number;
  currentPoints: number;
  totalEarnedPoints: number;
}

export interface CreditScore {
  id: number;
  userId: number;
  score: number;
  provider: string;
  lastUpdated: string;
  pointsChange?: number;
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  timestamp: string;
  isRead: boolean;
  category?: string;
}
