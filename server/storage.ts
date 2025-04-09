import {
  type User,
  type InsertUser,
  type Loan,
  type InsertLoan,
  type PaymentMethod,
  type InsertPaymentMethod,
  type Payment,
  type InsertPayment,
  type Transaction,
  type InsertTransaction,
  type Reward,
  type InsertReward,
  type CreditScore,
  type InsertCreditScore,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scryptSync, randomBytes } from "crypto";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Loan operations
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByUserId(userId: number): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: number, loan: Partial<Loan>): Promise<Loan | undefined>;

  // Payment Method operations
  getPaymentMethods(userId: number): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(
    id: number,
    method: Partial<PaymentMethod>,
  ): Promise<PaymentMethod | undefined>;
  setPrimaryPaymentMethod(userId: number, methodId: number): Promise<void>;

  // Payment operations
  getPayments(loanId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<Payment | undefined>;

  // Transaction operations
  getTransactionsByUserId(
    userId: number,
    limit?: number,
  ): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Reward operations
  getRewardsByUserId(userId: number): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  updateRewardPoints(
    userId: number,
    pointsToAdd: number,
  ): Promise<Reward | undefined>;

  // Credit Score operations
  getCreditScore(userId: number): Promise<CreditScore | undefined>;
  createCreditScore(creditScore: InsertCreditScore): Promise<CreditScore>;
  updateCreditScore(
    userId: number,
    score: number,
    pointsChange?: number,
  ): Promise<CreditScore | undefined>;

  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<number, User>;
  private loans: Map<number, Loan>;
  private paymentMethods: Map<number, PaymentMethod>;
  private payments: Map<number, Payment>;
  private transactions: Map<number, Transaction>;
  private rewards: Map<number, Reward>;
  private creditScores: Map<number, CreditScore>;
  private notifications: Map<number, Notification>;

  private userIdCounter: number;
  private loanIdCounter: number;
  private paymentMethodIdCounter: number;
  private paymentIdCounter: number;
  private transactionIdCounter: number;
  private rewardIdCounter: number;
  private creditScoreIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 1 day in milliseconds
    });

    this.users = new Map();
    this.loans = new Map();
    this.paymentMethods = new Map();
    this.payments = new Map();
    this.transactions = new Map();
    this.rewards = new Map();
    this.creditScores = new Map();
    this.notifications = new Map();

    this.userIdCounter = 1;
    this.loanIdCounter = 1;
    this.paymentMethodIdCounter = 1;
    this.paymentIdCounter = 1;
    this.transactionIdCounter = 1;
    this.rewardIdCounter = 1;
    this.creditScoreIdCounter = 1;
    this.notificationIdCounter = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  // private initializeSampleData() {
  //   // Create a sample user
  //   const user: User = {
  //     id: this.userIdCounter++,
  //     username: "adam.smith",
  //     password: "password123", // In prod app, this would be hashed
  //     fullName: "Adam Smith",
  //     email: "adam.smith@gmail.com",
  //     address: "13 Grimmald Place",
  //     city: "Phoenix",
  //     state: "Arizona",
  //     zipCode: "03151",
  //     profileImage: "/assets/profile.jpg",
  //     homePhone: "111-333-444",
  //     cellPhone: "333-333-333",
  //     createdAt: new Date(),
  //   };
  //   this.users.set(user.id, user);

  private initializeSampleData() {
    // Helper to hash a password with salt
    const hashSamplePassword = (password: string): string => {
      const salt = randomBytes(16).toString("hex");
      const hashed = scryptSync(password, salt, 64);
      return `${hashed.toString("hex")}.${salt}`;
    };

    // Create a sample user
    const user: User = {
      id: this.userIdCounter++,
      username: "adam.smith",
      password: hashSamplePassword("password123"), // ✅ securely hashed
      fullName: "Adam Smith",
      email: "adam.smith@gmail.com",
      address: "13 Grimmald Place",
      city: "Phoenix",
      state: "Arizona",
      zipCode: "03151",
      profileImage: "/assets/profile.jpg",
      homePhone: "111-333-444",
      cellPhone: "333-333-333",
      createdAt: new Date(),
    };

    this.users.set(user.id, user);

    // Create a personal loan
    const loan: Loan = {
      id: this.loanIdCounter++,
      userId: user.id,
      loanType: "Personal Loan",
      loanAmount: 80000.0,
      outstandingAmount: 40000.0,
      interestRate: 11.8,
      termMonths: 60,
      paymentsLeft: 10,
      loanId: "PX3ERF9ND",
      dateFunded: new Date("2024-01-10"),
      status: "Current",
    };
    this.loans.set(loan.id, loan);

    // Create payment methods
    const checkingAccount: PaymentMethod = {
      id: this.paymentMethodIdCounter++,
      userId: user.id,
      type: "Checking Account",
      bankName: "JPMorgan Chase",
      accountNumber: "6384918489",
      cardNumber: null,
      isPrimary: true,
    };
    this.paymentMethods.set(checkingAccount.id, checkingAccount);

    const debitCard: PaymentMethod = {
      id: this.paymentMethodIdCounter++,
      userId: user.id,
      type: "Debit Card",
      bankName: "JPMorgan Chase",
      accountNumber: null,
      cardNumber: "XXXX XXXX XXXX 4538",
      isPrimary: false,
    };
    this.paymentMethods.set(debitCard.id, debitCard);

    // Create payments
    const paymentDates = [
      new Date("2024-01-10"),
      new Date("2024-02-10"),
      new Date("2024-04-10"),
      new Date("2024-05-10"),
      new Date("2024-06-10"),
      new Date("2024-07-10"),
      new Date("2024-09-10"),
      new Date("2024-01-10"),
    ];

    const paymentStatuses = [
      "Paid",
      "Paid",
      "Paid",
      "Paid",
      "Paid",
      "Paid",
      "Paid",
      "Paid",
    ];

    paymentDates.forEach((date, index) => {
      const payment: Payment = {
        id: this.paymentIdCounter++,
        loanId: loan.id,
        userId: user.id,
        amount: 1484.34,
        paymentDate: date,
        status: paymentStatuses[index],
      };
      this.payments.set(payment.id, payment);
    });

    // Add a few upcoming/missed payments
    const upcomingPaymentDates = [
      new Date("2024-10-10"),
      new Date("2024-11-10"),
      new Date("2024-08-10"),
      new Date("2025-04-20"), // Next scheduled payment (matches the date shown in the defer/reschedule pages)
      new Date("2025-05-20"), // Future payment
      new Date("2025-06-20"), // Future payment
    ];

    const upcomingPaymentStatuses = [
      "Missed",
      "Deferred",
      "Deferred",
      "Scheduled",
      "Scheduled",
      "Scheduled",
    ];

    upcomingPaymentDates.forEach((date, index) => {
      const payment: Payment = {
        id: this.paymentIdCounter++,
        loanId: loan.id,
        userId: user.id,
        amount: 1484.34,
        paymentDate: date,
        status: upcomingPaymentStatuses[index],
      };
      this.payments.set(payment.id, payment);
    });

    // Create recent transactions with all status types

    const transactions: InsertTransaction[] = [
      {
        userId: user.id,
        name: "Payment ID 1",
        amount: 350.0,
        date: new Date("2023-04-04"),
        status: "Processing",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 2",
        amount: 130.0,
        date: new Date("2023-02-11"),
        status: "Paid",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 3",
        amount: 100.0,
        date: new Date("2022-12-19"),
        status: "In Progress",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 4",
        amount: 410.0,
        date: new Date("2023-04-01"),
        status: "Deferred",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 5",
        amount: 275.5,
        date: new Date("2023-06-15"),
        status: "Declined",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 6",
        amount: 189.99,
        date: new Date("2023-07-22"),
        status: "Rescheduled",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 7",
        amount: 500.0,
        date: new Date("2023-08-05"),
        status: "Paydown",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 8",
        amount: 215.75,
        date: new Date("2023-09-10"),
        status: "Pending Approval",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 9",
        amount: 320.45,
        date: new Date("2023-10-18"),
        status: "Failed",
        type: "Payment",
      },
      {
        userId: user.id,
        name: "Payment ID 10",
        amount: 75.0,
        date: new Date("2023-11-27"),
        status: "Refunded",
        type: "Refund",
      },
    ];

    // const transactions: InsertTransaction[] = [
    //   {
    //     userId: user.id,
    //     name: "James Smith",
    //     amount: 350.0,
    //     date: new Date("2023-04-04"),
    //     status: "Processing",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Alex Chin",
    //     amount: 130.0,
    //     date: new Date("2023-02-11"),
    //     status: "Paid",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "James Smith",
    //     amount: 100.0,
    //     date: new Date("2022-12-19"),
    //     status: "In Progress",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Eva Robinson",
    //     amount: 410.0,
    //     date: new Date("2023-04-01"),
    //     status: "Deferred",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Michael Johnson",
    //     amount: 275.5,
    //     date: new Date("2023-06-15"),
    //     status: "Declined",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Sarah Thompson",
    //     amount: 189.99,
    //     date: new Date("2023-07-22"),
    //     status: "Rescheduled",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "David Wilson",
    //     amount: 500.0,
    //     date: new Date("2023-08-05"),
    //     status: "Paydown",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Emily Davis",
    //     amount: 215.75,
    //     date: new Date("2023-09-10"),
    //     status: "Pending Approval",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Chris Martinez",
    //     amount: 320.45,
    //     date: new Date("2023-10-18"),
    //     status: "Failed",
    //     type: "Payment",
    //   },
    //   {
    //     userId: user.id,
    //     name: "Jessica Black",
    //     amount: 75.0,
    //     date: new Date("2023-11-27"),
    //     status: "Refunded",
    //     type: "Refund",
    //   },
    // ];

    transactions.forEach((transaction) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: this.transactionIdCounter++,
      };
      this.transactions.set(newTransaction.id, newTransaction);
    });

    // Create reward
    const reward: Reward = {
      id: this.rewardIdCounter++,
      userId: user.id,
      currentPoints: 630,
      totalEarnedPoints: 1200,
    };
    this.rewards.set(reward.id, reward);

    // Create credit score
    const creditScore: CreditScore = {
      id: this.creditScoreIdCounter++,
      userId: user.id,
      score: 880,
      provider: "TransUnion",
      lastUpdated: new Date("2025-03-11"),
      pointsChange: 20,
    };
    this.creditScores.set(creditScore.id, creditScore);

    // Create notifications
    const notifications: InsertNotification[] = [
      {
        userId: user.id,
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        isRead: false,
        category: "category1",
      },
      {
        userId: user.id,
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        isRead: false,
        category: "category1",
      },
      {
        userId: user.id,
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        isRead: false,
        category: "category2",
      },
      {
        userId: user.id,
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        isRead: false,
        category: "category3",
      },
    ];

    notifications.forEach((notification) => {
      const newNotification: Notification = {
        ...notification,
        id: this.notificationIdCounter++,
        timestamp: new Date(),
      };
      this.notifications.set(newNotification.id, newNotification);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Loan operations
  async getLoan(id: number): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async getLoansByUserId(userId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(
      (loan) => loan.userId === userId,
    );
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const id = this.loanIdCounter++;
    const loan: Loan = { ...insertLoan, id };
    this.loans.set(id, loan);
    return loan;
  }

  async updateLoan(
    id: number,
    loanUpdate: Partial<Loan>,
  ): Promise<Loan | undefined> {
    const loan = this.loans.get(id);
    if (!loan) return undefined;

    const updatedLoan = { ...loan, ...loanUpdate };
    this.loans.set(id, updatedLoan);
    return updatedLoan;
  }

  // Payment Method operations
  async getPaymentMethods(userId: number): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(
      (method) => method.userId === userId,
    );
  }

  async createPaymentMethod(
    insertMethod: InsertPaymentMethod,
  ): Promise<PaymentMethod> {
    const id = this.paymentMethodIdCounter++;
    const method: PaymentMethod = { ...insertMethod, id };
    this.paymentMethods.set(id, method);
    return method;
  }

  async updatePaymentMethod(
    id: number,
    methodUpdate: Partial<PaymentMethod>,
  ): Promise<PaymentMethod | undefined> {
    const method = this.paymentMethods.get(id);
    if (!method) return undefined;

    const updatedMethod = { ...method, ...methodUpdate };
    this.paymentMethods.set(id, updatedMethod);
    return updatedMethod;
  }

  async setPrimaryPaymentMethod(
    userId: number,
    methodId: number,
  ): Promise<void> {
    const userMethods = await this.getPaymentMethods(userId);

    for (const method of userMethods) {
      const updatedMethod = { ...method, isPrimary: method.id === methodId };
      this.paymentMethods.set(method.id, updatedMethod);
    }
  }

  // Payment operations
  async getPayments(loanId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter((payment) => payment.loanId === loanId)
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.paymentIdCounter++;
    const payment: Payment = { ...insertPayment, id };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePaymentStatus(
    id: number,
    status: string,
  ): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;

    const updatedPayment = { ...payment, status };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Transaction operations
  async getTransactionsByUserId(
    userId: number,
    limit?: number,
  ): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return limit ? transactions.slice(0, limit) : transactions;
  }

  async createTransaction(
    insertTransaction: InsertTransaction,
  ): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Reward operations
  async getRewardsByUserId(userId: number): Promise<Reward | undefined> {
    return Array.from(this.rewards.values()).find(
      (reward) => reward.userId === userId,
    );
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const reward: Reward = { ...insertReward, id };
    this.rewards.set(id, reward);
    return reward;
  }

  async updateRewardPoints(
    userId: number,
    pointsToAdd: number,
  ): Promise<Reward | undefined> {
    const reward = Array.from(this.rewards.values()).find(
      (r) => r.userId === userId,
    );
    if (!reward) return undefined;

    const updatedReward = {
      ...reward,
      currentPoints: reward.currentPoints + pointsToAdd,
      totalEarnedPoints: reward.totalEarnedPoints + Math.max(0, pointsToAdd), // Only add positive points to totalEarned
    };

    this.rewards.set(reward.id, updatedReward);
    return updatedReward;
  }

  // Credit Score operations
  async getCreditScore(userId: number): Promise<CreditScore | undefined> {
    return Array.from(this.creditScores.values()).find(
      (score) => score.userId === userId,
    );
  }

  async createCreditScore(
    insertCreditScore: InsertCreditScore,
  ): Promise<CreditScore> {
    const id = this.creditScoreIdCounter++;
    const creditScore: CreditScore = { ...insertCreditScore, id };
    this.creditScores.set(id, creditScore);
    return creditScore;
  }

  async updateCreditScore(
    userId: number,
    score: number,
    pointsChange?: number,
  ): Promise<CreditScore | undefined> {
    const creditScore = Array.from(this.creditScores.values()).find(
      (cs) => cs.userId === userId,
    );
    if (!creditScore) return undefined;

    const updatedCreditScore = {
      ...creditScore,
      score,
      pointsChange:
        pointsChange !== undefined ? pointsChange : creditScore.pointsChange,
      lastUpdated: new Date(),
    };

    this.creditScores.set(creditScore.id, updatedCreditScore);
    return updatedCreditScore;
  }

  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createNotification(
    insertNotification: InsertNotification,
  ): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification: Notification = {
      ...insertNotification,
      id,
      timestamp: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;

    const updatedNotification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = await this.getNotifications(userId);

    for (const notification of userNotifications) {
      const updatedNotification = { ...notification, isRead: true };
      this.notifications.set(notification.id, updatedNotification);
    }
  }
}

export const storage = new MemStorage();
