import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { insertPaymentSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Get user loans
  app.get("/api/loans", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    const loans = await storage.getLoansByUserId(userId!);
    res.json(loans);
  });
  
  // Get loan by ID
  app.get("/api/loans/:id", async (req, res) => {
    const loanId = parseInt(req.params.id);
    const loan = await storage.getLoan(loanId);
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    res.json(loan);
  });
  
  // Get payment methods for user
  app.get("/api/payment-methods", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    const methods = await storage.getPaymentMethods(userId!);
    res.json(methods);
  });
  
  // Set primary payment method
  app.post("/api/payment-methods/set-primary", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const schema = z.object({
      methodId: z.number()
    });
    
    try {
      const { methodId } = schema.parse(req.body);
      const userId = req.user?.id;
      await storage.setPrimaryPaymentMethod(userId!, methodId);
      const updatedMethods = await storage.getPaymentMethods(userId!);
      res.json(updatedMethods);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Get payments for a loan
  app.get("/api/loans/:id/payments", async (req, res) => {
    const loanId = parseInt(req.params.id);
    const payments = await storage.getPayments(loanId);
    res.json(payments);
  });
  
  // Make a payment
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(paymentData);
      
      // Update loan information (decrement payments left)
      const loan = await storage.getLoan(payment.loanId);
      if (loan) {
        await storage.updateLoan(loan.id, {
          paymentsLeft: Math.max(0, loan.paymentsLeft - 1),
          outstandingAmount: String(Number(loan.outstandingAmount) - Number(payment.amount))
        });
      }
      
      // Add reward points for payment
      const reward = await storage.getRewardsByUserId(payment.userId);
      if (reward) {
        await storage.updateRewardPoints(payment.userId, 10);
      }
      
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data" });
    }
  });
  
  // Update payment status (for rescheduling, deferring)
  app.patch("/api/payments/:id/status", async (req, res) => {
    const schema = z.object({
      status: z.string()
    });
    
    try {
      const { status } = schema.parse(req.body);
      const paymentId = parseInt(req.params.id);
      const updatedPayment = await storage.updatePaymentStatus(paymentId, status);
      
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(updatedPayment);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });
  
  // Get recent transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const userId = req.user?.id;
    const transactions = await storage.getTransactionsByUserId(userId!, limit);
    res.json(transactions);
  });
  
  // Get reward information
  app.get("/api/rewards", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    const reward = await storage.getRewardsByUserId(userId!);
    
    if (!reward) {
      return res.status(404).json({ message: "Rewards not found" });
    }
    
    res.json(reward);
  });
  
  // Get credit score
  app.get("/api/credit-score", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    const creditScore = await storage.getCreditScore(userId!);
    
    if (!creditScore) {
      return res.status(404).json({ message: "Credit score not found" });
    }
    
    res.json(creditScore);
  });
  
  // Get notifications
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    const notifications = await storage.getNotifications(userId!);
    res.json(notifications);
  });
  
  // Mark notification as read
  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const notificationId = parseInt(req.params.id);
    const updatedNotification = await storage.markNotificationAsRead(notificationId);
    
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.json(updatedNotification);
  });
  
  // Mark all notifications as read
  app.post("/api/notifications/mark-all-read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user?.id;
    await storage.markAllNotificationsAsRead(userId!);
    const updatedNotifications = await storage.getNotifications(userId!);
    res.json(updatedNotifications);
  });
  
  // Create a new notification (for testing purposes)
  app.post("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const schema = z.object({
      message: z.string(),
      category: z.string().optional()
    });
    
    try {
      const { message, category } = schema.parse(req.body);
      const userId = req.user?.id;
      
      const newNotification = await storage.createNotification({
        userId: userId!,
        message,
        category,
        isRead: false
      });
      
      // Broadcast the new notification to connected clients
      if (typeof broadcastNotification === 'function') {
        broadcastNotification(userId!, newNotification);
      }
      
      res.json(newNotification);
    } catch (error) {
      res.status(400).json({ message: "Invalid notification data" });
    }
  });

  const httpServer = createServer(app);
  
  // Create a WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients: Map<number, WebSocket[]> = new Map();
  
  wss.on('connection', (ws, req) => {
    // We need to determine the user ID from the session
    // This is a simplified approach - in a real app, we'd verify the session cookie
    // and get the user ID from it
    const cookieHeader = req.headers.cookie || '';
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    // Default to user id 1 in development if we can't get it from session
    let userId = 1;
    
    // Add this client to the clients map
    if (!clients.has(userId)) {
      clients.set(userId, []);
    }
    clients.get(userId)?.push(ws);
    
    // Send initial notification count
    storage.getNotifications(userId).then((notifications) => {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      const message = JSON.stringify({ 
        type: 'NOTIFICATION_COUNT', 
        count: unreadCount 
      });
      ws.send(message);
    });
    
    // Handle client disconnection
    ws.on('close', () => {
      const userClients = clients.get(userId) || [];
      const index = userClients.indexOf(ws);
      if (index !== -1) {
        userClients.splice(index, 1);
      }
    });
  });
  
  // Add a function to broadcast notifications to all connected clients for a user
  const broadcastNotification = (userId: number, notification: any) => {
    const userClients = clients.get(userId) || [];
    const message = JSON.stringify({
      type: 'NEW_NOTIFICATION',
      notification
    });
    
    userClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };
  
  // Create a function to send financial tips
  const sendFinancialTip = (userId: number) => {
    const tips = [
      {
        title: "Saving Tip",
        message: "Set aside 20% of your income for savings and future investments.",
        icon: "piggy-bank"
      },
      {
        title: "Budget Smart",
        message: "Track your expenses with our app to identify areas where you can reduce spending.",
        icon: "calculator"
      },
      {
        title: "Debt Reduction",
        message: "Consider making extra payments on high-interest debts to save money in the long run.",
        icon: "credit-card"
      },
      {
        title: "Emergency Fund",
        message: "Aim to save 3-6 months of expenses in an emergency fund for unexpected situations.",
        icon: "alert-circle"
      },
      {
        title: "Credit Score Boost",
        message: "Making on-time payments consistently is the best way to improve your credit score.",
        icon: "trending-up"
      }
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    const userClients = clients.get(userId) || [];
    const message = JSON.stringify({
      type: 'FINANCIAL_TIP',
      tip: randomTip
    });
    
    userClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };
  
  // Send a financial tip every few minutes
  setInterval(() => {
    sendFinancialTip(1); // User ID 1 for demo purposes
  }, 60000); // Send a tip every minute
  
  // Expose WebSocket broadcast function globally
  (global as any).broadcastNotification = broadcastNotification;
  
  return httpServer;
}
