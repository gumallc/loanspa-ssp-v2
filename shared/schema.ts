import { pgTable, text, serial, numeric, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  profileImage: text("profile_image"),
  homePhone: text("home_phone"),
  cellPhone: text("cell_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loans table
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  loanType: text("loan_type").notNull(), // Personal, Auto, Mortgage, etc.
  loanAmount: numeric("loan_amount").notNull(),
  outstandingAmount: numeric("outstanding_amount").notNull(),
  interestRate: numeric("interest_rate").notNull(),
  termMonths: integer("term_months").notNull(),
  paymentsLeft: integer("payments_left").notNull(),
  loanId: text("loan_id").notNull(), // Unique identifier for the loan (e.g., PX3ERF9ND)
  dateFunded: timestamp("date_funded").notNull(),
  status: text("status").notNull(), // Current, Paid, Default, etc.
});

// Payment Methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // Card, Bank Account, etc.
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  cardNumber: text("card_number"),
  isPrimary: boolean("is_primary").default(false),
});

// Payments table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull(),
  status: text("status").notNull(), // Paid, Missed, Deferred, Processing
});

// Transactions table (for Recent Activity)
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // Processing, Sent, etc.
  type: text("type").notNull(), // Payment, Credit Purchase, etc.
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  currentPoints: integer("current_points").notNull().default(0),
  totalEarnedPoints: integer("total_earned_points").notNull().default(0),
});

// Credit Score table
export const creditScores = pgTable("credit_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  score: integer("score").notNull(),
  provider: text("provider").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
  pointsChange: integer("points_change"), // Can be positive or negative
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isRead: boolean("is_read").default(false),
  category: text("category"), // For categorizing notifications
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertLoanSchema = createInsertSchema(loans).omit({ id: true });
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertRewardSchema = createInsertSchema(rewards).omit({ id: true });
export const insertCreditScoreSchema = createInsertSchema(creditScores).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;

export type CreditScore = typeof creditScores.$inferSelect;
export type InsertCreditScore = z.infer<typeof insertCreditScoreSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
