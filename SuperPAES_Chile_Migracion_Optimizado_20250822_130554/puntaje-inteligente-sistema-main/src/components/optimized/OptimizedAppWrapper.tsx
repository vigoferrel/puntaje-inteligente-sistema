/* eslint-disable react-refresh/only-export-components */
// src/components/optimized/OptimizedAppWrapper.tsx
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useGlobalStore } from '../../store/optimized-global-store';
import { OptimizedLoadingScreen } from './OptimizedLoadingScreen';
import { OptimizedErrorBoundary } from './OptimizedErrorBoundary';

// QueryClient optimizado con configuraciÃ³n inteligente
const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
        retry: (failureCount, error: unknown) => {
          // Retry inteligente basado en el tipo de error
          if (error?.status === 404) return false;
          if (error?.status >= 500) return failureCount < 2;
          return failureCount < 1;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchInterval: false
      },
      mutations: {
        retry: 1,
        retryDelay: 1000
      }
    }
  });
};

// Componente principal optimizado
export const OptimizedAppWrapper: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const queryClient = React.useMemo(() => createOptimizedQueryClient(), []);
  const updatePerformance = useGlobalStore((state) => state.actions.updatePerformance);
  
  React.useEffect(() => {
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      updatePerformance({ lastLoadTime: loadTime });
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [updatePerformance]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OptimizedErrorBoundary>
          <Suspense fallback={<OptimizedLoadingScreen />}>
            {children}
          </Suspense>
        </OptimizedErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Hook para componentes optimizados
export const useOptimizedComponent = (componentName: string) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  const handleError = React.useCallback((error: Error) => {
    console.error(`Error in ${componentName}:`, error);
    setHasError(true);
  }, [componentName]);
  
  return {
    ref,
    isVisible,
    hasError,
    handleError,
    resetError: () => setHasError(false)
  };
};

// HOC para optimizar componentes
export (...args: unknown[]) => unknown withOptimization<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    displayName?: string;
    lazyLoad?: boolean;
  } = {}
) {
  const OptimizedComponent = React.memo((props: P) => {
    const { ref, isVisible, hasError, handleError, resetError } = useOptimizedComponent(
      options.displayName || Component.name
    );
    
    if (options.lazyLoad && !isVisible) {
      return <div ref={ref} className="dynamic-height" data-height={'200px' } />;
    }
    
    if (hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p>Error en componente. <button onClick={resetError}>Reintentar</button></p>
        </div>
      );
    }
    
    try {
      return <Component {...props} />;
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  });
  
  OptimizedComponent.displayName = `Optimized(${options.displayName || Component.name})`;
  return OptimizedComponent;
}




