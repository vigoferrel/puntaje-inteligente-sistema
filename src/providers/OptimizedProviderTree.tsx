
import React, { memo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntersectionalProvider } from "@/contexts/IntersectionalProvider";
import { OptimizedCacheProvider } from "@/core/performance/OptimizedCacheSystem";
import { UnifiedContextCache } from "./UnifiedContextCache";

// QueryClient optimizado con configuración mejorada
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface OptimizedProviderTreeProps {
  children: ReactNode;
}

// Provider tree optimizado con memoización
export const OptimizedProviderTree = memo<OptimizedProviderTreeProps>(({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <IntersectionalProvider>
            <OptimizedCacheProvider>
              <UnifiedContextCache>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </TooltipProvider>
              </UnifiedContextCache>
            </OptimizedCacheProvider>
          </IntersectionalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
});

OptimizedProviderTree.displayName = 'OptimizedProviderTree';
