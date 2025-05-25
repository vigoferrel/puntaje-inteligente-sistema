
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<any>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  moduleName?: string;
}

export class AdvancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log del error
    console.error(`Error en ${this.props.moduleName || 'Componente'}:`, error, errorInfo);
    
    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Auto-retry para errores transitorios
    if (this.state.retryCount < 3) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 2000 * (this.state.retryCount + 1));
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return <FallbackComponent error={this.state.error} onRetry={this.handleRetry} />;
      }

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4"
          >
            <Card className="max-w-lg w-full bg-red-950/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </motion.div>
                  Error en {this.props.moduleName || 'Aplicación'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-red-300">
                  Se produjo un error inesperado. Estamos trabajando para solucionarlo.
                </p>
                
                {this.state.retryCount > 0 && (
                  <p className="text-yellow-300 text-sm">
                    Intentos de recuperación: {this.state.retryCount}/3
                  </p>
                )}

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="bg-black/30 p-3 rounded text-xs text-gray-300">
                    <summary className="cursor-pointer">Detalles técnicos</summary>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                  </details>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Inicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes con error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  moduleName: string
) => {
  return (props: P) => (
    <AdvancedErrorBoundary moduleName={moduleName}>
      <Component {...props} />
    </AdvancedErrorBoundary>
  );
};
