import { useState, useEffect } from 'react';
import {
  PiggyBank,
  Calculator,
  CreditCard,
  AlertCircle,
  TrendingUp,
  X,
  DollarSign,
  LightbulbIcon,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialTipProps {
  title: string;
  message: string;
  icon: string;
  onDismiss: () => void;
}

export default function FinancialTip({ title, message, icon, onDismiss }: FinancialTipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [bounceAnimation, setBounceAnimation] = useState(false);
  
  useEffect(() => {
    // Delay the appearance slightly
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Start bounce animation after appearance
    const bounceTimer = setTimeout(() => {
      setBounceAnimation(true);
    }, 1000);
    
    // Auto dismiss after some time
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 15000); // 15 seconds
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(bounceTimer);
      clearTimeout(dismissTimer);
    };
  }, []);
  
  const getIcon = () => {
    switch (icon) {
      case 'piggy-bank':
        return <PiggyBank className="h-6 w-6" />;
      case 'calculator':
        return <Calculator className="h-6 w-6" />;
      case 'credit-card':
        return <CreditCard className="h-6 w-6" />;
      case 'alert-circle':
        return <AlertCircle className="h-6 w-6" />;
      case 'trending-up':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <LightbulbIcon className="h-6 w-6" />;
    }
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Give time for the exit animation
  };
  
  // Animation elements that float around the tip
  const animationElements = [
    { icon: <DollarSign className="h-4 w-4 text-green-500" />, position: 'top-2 right-10', delay: '0.5s' },
    { icon: <BarChart3 className="h-4 w-4 text-blue-500" />, position: 'top-10 right-2', delay: '0.8s' },
    { icon: <PiggyBank className="h-4 w-4 text-pink-500" />, position: 'bottom-2 right-10', delay: '1.2s' },
    { icon: <TrendingUp className="h-4 w-4 text-purple-500" />, position: 'bottom-10 right-2', delay: '0.3s' }
  ];
  
  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 z-50 w-80 transform transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      )}
    >
      <div className="relative bg-white rounded-lg shadow-lg border border-primary-100 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-white opacity-50" />
        
        {/* Animation elements */}
        {animationElements.map((el, i) => (
          <div 
            key={i}
            className={cn(
              'absolute animate-float opacity-0',
              el.position,
              isVisible && 'opacity-70'
            )}
            style={{ 
              animationDelay: el.delay,
              animationDuration: '3s'
            }}
          >
            {el.icon}
          </div>
        ))}
        
        <div className="p-4 relative">
          {/* Header with icon and title */}
          <div className="flex items-center mb-2">
            <div 
              className={cn(
                "flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3",
                bounceAnimation && "animate-bounce"
              )}
            >
              <span className="text-primary">
                {getIcon()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-neutral-900">{title}</h3>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Message */}
          <p className="text-neutral-700 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}