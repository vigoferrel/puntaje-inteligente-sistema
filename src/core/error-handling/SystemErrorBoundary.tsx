
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/core/logging/SystemLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class SystemErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log del error
    logger.critical(this.props.moduleName || 'Unknown Module', `Error Boundary Triggered: ${error.message}`, {
      errorId,
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleCopyError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      module: this.props.moduleName || 'Unknown',
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-2xl w-full bg-red-950/50 border-red-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-400">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </motion.div>
                  Error en {this.props.moduleName || 'Sistema'}
                </CardTitle>
                <div className="text-sm text-red-300">
                  ID: {this.state.errorId}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-red-300">
                  Se produjo un error inesperado. El sistema de recuperación automática está activado.
                </p>

                {this.state.error && (
                  <div className="bg-black/30 p-3 rounded text-xs text-gray-300">
                    <div className="font-bold mb-2">Error:</div>
                    <div className="mb-2">{this.state.error.message}</div>
                    {process.env.NODE_ENV === 'development' && (
                      <details>
                        <summary className="cursor-pointer">Stack Trace</summary>
                        <pre className="mt-2 whitespace-pre-wrap text-xs">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Inicio
                  </Button>

                  <Button
                    onClick={this.handleCopyError}
                    variant="outline"
                    size="sm"
                    className="border-gray-500 text-gray-400 hover:bg-gray-500/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Error
                  </Button>
                </div>

                <div className="text-xs text-white/50 text-center">
                  Sistema de auto-recuperación neuronal activado
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC para envolver componentes automáticamente
export const withSystemErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  moduleName: string
) => {
  return (props: P) => (
    <SystemErrorBoundary moduleName={moduleName}>
      <Component {...props} />
    </SystemErrorBoundary>
  );
};
