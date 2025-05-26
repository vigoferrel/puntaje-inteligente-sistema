
import React from 'react';
import { SystemErrorBoundary } from '@/core/error-handling/SystemErrorBoundary';
import { PerformanceMonitor } from '@/core/performance/PerformanceMonitor';
import { GlobalErrorRecoveryProvider } from '@/core/performance/GlobalErrorRecovery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { logger } from '@/core/logging/SystemLogger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: (failureCount, error) => {
        logger.warn('QueryClient', `Query failed ${failureCount} times`, error);
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        logger.warn('QueryClient', `Mutation failed ${failureCount} times`, error);
        return failureCount < 2;
      },
    },
  },
});

interface OptimizedProviderTreeProps {
  children: React.ReactNode;
}

export const OptimizedProviderTree: React.FC<OptimizedProviderTreeProps> = ({ children }) => {
  React.useEffect(() => {
    logger.info('OptimizedProviderTree', 'Provider tree initialized');
    
    return () => {
      logger.info('OptimizedProviderTree', 'Provider tree cleanup');
    };
  }, []);

  return (
    <SystemErrorBoundary moduleName="Provider Tree">
      <PerformanceMonitor>
        <GlobalErrorRecoveryProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryClientProvider>
        </GlobalErrorRecoveryProvider>
      </PerformanceMonitor>
    </SystemErrorBoundary>
  );
};
