import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(numAmount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'in progress':
      return 'text-blue-600 bg-blue-100';
    case 'deferred':
      return 'text-amber-600 bg-amber-100';
    case 'declined':
      return 'text-red-600 bg-red-100';
    case 'rescheduled':
      return 'text-purple-600 bg-purple-100';
    case 'paydown':
      return 'text-indigo-600 bg-indigo-100';
    case 'processing':
      return 'text-blue-600 bg-blue-100';
    case 'pending approval':
      return 'text-orange-600 bg-orange-100';
    case 'failed':
      return 'text-red-600 bg-red-100';
    case 'refunded':
      return 'text-emerald-600 bg-emerald-100';
    case 'sent':
      return 'text-green-600 bg-green-100';
    case 'missed':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function calculateProgressPercentage(current: number, total: number): number {
  return Math.min(100, Math.max(0, (current / total) * 100));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}
