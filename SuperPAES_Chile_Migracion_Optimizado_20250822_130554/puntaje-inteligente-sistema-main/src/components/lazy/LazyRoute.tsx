/* eslint-disable react-refresh/only-export-components */
// LAZY ROUTE - Componente para rutas con lazy loading
// Wrapper optimizado para carga perezosa de rutas

import React, { Suspense } from 'react';
import { createLazyComponent } from '../../utils/performance/LazyLoading';

interface LazyRouteProps {
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>;
  fallback?: React.ComponentNode;
  retryCount?: number;
  retryDelay?: number;
}

export const LazyRoute: React.FC<LazyRouteProps> = ({
  importFn,
  fallback = <div className="loading-spinner">Cargando...</div>,
  retryCount = 3,
  retryDelay = 1000
}) => {
  const LazyComponent = createLazyComponent(importFn, {
    retryCount,
    retryDelay
  });

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Componente de loading optimizado
export const OptimizedLoader: React.FC<{ message?: string }> = ({ 
  message = "Cargando..." 
}) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">{message}</span>
  </div>
);

// Error boundary para lazy components
interface LazyErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class LazyErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  LazyErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): LazyErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyComponent error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 border border-red-300 rounded bg-red-50">
          <h3 className="text-red-800 font-semibold">Error cargando componente</h3>
          <p className="text-red-600 text-sm mt-2">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}



