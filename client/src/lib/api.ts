import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { User, Loan, PaymentMethod, Payment, Activity, Reward, Notification } from "@shared/schema";

// User API
export const useUser = (id: number) => 
  useQuery<User>({
    queryKey: [`/api/users/${id}`],
  });

export const useUserByUsername = (username: string) => 
  useQuery<User>({
    queryKey: [`/api/users/username/${username}`],
  });

// Loan API
export const useUserLoans = (userId: number) => 
  useQuery<Loan[]>({
    queryKey: [`/api/loans/user/${userId}`],
  });

export const useLoan = (id: number) => 
  useQuery<Loan>({
    queryKey: [`/api/loans/${id}`],
  });

// Payment Methods API
export const usePaymentMethods = (userId: number) => 
  useQuery<PaymentMethod[]>({
    queryKey: [`/api/payment-methods/user/${userId}`],
  });

// Payments API
export const useLoanPayments = (loanId: number) => 
  useQuery<Payment[]>({
    queryKey: [`/api/payments/loan/${loanId}`],
  });

export const useUserPayments = (userId: number) => 
  useQuery<Payment[]>({
    queryKey: [`/api/payments/user/${userId}`],
  });

// Activities API
export const useUserActivities = (userId: number, limit: number = 10) => 
  useQuery<Activity[]>({
    queryKey: [`/api/activities/user/${userId}?limit=${limit}`],
  });

// Rewards API
export const useUserRewards = (userId: number) => 
  useQuery<Reward>({
    queryKey: [`/api/rewards/user/${userId}`],
  });

// Notifications API
export const useUserNotifications = (userId: number) => 
  useQuery<Notification[]>({
    queryKey: [`/api/notifications/user/${userId}`],
  });

// API Functions
export const createPaymentMethod = async (paymentMethod: any) => {
  return await apiRequest("POST", "/api/payment-methods", paymentMethod);
};

export const updatePaymentMethod = async (id: number, data: any) => {
  return await apiRequest("PATCH", `/api/payment-methods/${id}`, data);
};

export const createPayment = async (payment: any) => {
  return await apiRequest("POST", "/api/payments", payment);
};

export const updatePaymentStatus = async (id: number, status: string) => {
  return await apiRequest("PATCH", `/api/payments/${id}/status`, { status });
};

export const updateRewardPoints = async (userId: number, points: number) => {
  return await apiRequest("PATCH", `/api/rewards/user/${userId}`, { points });
};

export const markNotificationAsRead = async (id: number) => {
  return await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
};

export const markAllNotificationsAsRead = async (userId: number) => {
  return await apiRequest("POST", `/api/notifications/user/${userId}/mark-all-read`, {});
};
