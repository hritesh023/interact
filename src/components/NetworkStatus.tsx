import React from 'react';
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetwork } from '@/contexts/NetworkContext';

const NetworkStatus: React.FC = () => {
  const { isOnline, isSlowConnection, connectionType, retryCount } = useNetwork();

  if (isOnline && !isSlowConnection) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      {!isOnline ? (
        <Alert className="bg-red-500/10 border-red-500/50 text-red-500 backdrop-blur-sm">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className="font-medium">You're offline</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="ml-2 border-red-500/50 text-red-500 hover:bg-red-500/20"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry {retryCount > 0 && `(${retryCount})`}
            </Button>
          </AlertDescription>
        </Alert>
      ) : isSlowConnection ? (
        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-500 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Slow connection detected</span>
            <span className="text-xs block mt-1">
              Connection: {connectionType} • Some features may be limited
            </span>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
};

export default NetworkStatus;
