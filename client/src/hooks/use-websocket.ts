import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';
import { queryClient } from '@/lib/queryClient';

type MessageTypes = 'NOTIFICATION_COUNT' | 'NEW_NOTIFICATION' | 'FINANCIAL_TIP';
type WebSocketMessage = {
  type: MessageTypes;
  [key: string]: any;
};

export function useWebSocket() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [financialTip, setFinancialTip] = useState<{
    title: string;
    message: string;
    icon: string;
  } | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  
  const connect = useCallback(() => {
    // Close existing connection if it exists
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Create a new WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        connect();
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        
        switch (data.type) {
          case 'NOTIFICATION_COUNT':
            setNotificationCount(data.count);
            break;
            
          case 'NEW_NOTIFICATION':
            // Update notification count
            setNotificationCount((prev) => prev + 1);
            
            // Invalidate notifications query to refresh the list
            queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
            
            // Show a toast notification
            toast({
              title: 'New Notification',
              description: data.notification.message,
              variant: 'default',
            });
            break;
            
          case 'FINANCIAL_TIP':
            setFinancialTip(data.tip);
            break;
            
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socketRef.current = socket;
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [toast]);
  
  // Connect when the component mounts
  useEffect(() => {
    const cleanup = connect();
    
    return () => {
      cleanup();
    };
  }, [connect]);
  
  const dismissFinancialTip = useCallback(() => {
    setFinancialTip(null);
  }, []);
  
  return {
    isConnected,
    notificationCount,
    financialTip,
    dismissFinancialTip
  };
}