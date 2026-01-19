import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  className?: string;
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  className = '', 
  message = 'Loading...' 
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center min-h-[200px] bg-background",
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingFallback;
