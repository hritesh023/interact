import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const content = (
    <Card className={`border-0 shadow-none ${fullScreen ? 'h-screen' : 'min-h-[400px]'}`}>
      <CardContent className="flex flex-col items-center justify-center h-full gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your content</p>
        </div>
      </CardContent>
    </Card>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default PageLoader;
