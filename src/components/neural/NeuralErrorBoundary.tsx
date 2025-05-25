
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  silent?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class NeuralErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Solo loguear errores críticos para evitar spam en consola
    if (!this.props.silent && this.state.retryCount === 0) {
      console.error('🧠 Neural System Error:', error.message);
      this.props.onError?.(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1
      });
    }
  };

  handleHardReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
    window.location.reload();
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
            <Card className="max-w-lg mx-auto bg-black/40 backdrop-blur-xl border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Sistema Neural Recuperándose
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-yellow-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Detectada anomalía en el circuito neural</span>
                </div>
                
                <div className="text-white/80 text-sm">
                  El sistema está aplicando protocolos de auto-recuperación
                </div>

                {!this.props.silent && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                    <div className="text-red-300 text-xs font-mono">
                      {this.state.error?.message || 'Error desconocido'}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {this.state.retryCount < this.maxRetries && (
                    <Button 
                      onClick={this.handleRetry}
                      variant="outline" 
                      className="flex-1 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reintento Neural ({this.maxRetries - this.state.retryCount})
                    </Button>
                  )}
                  
                  <Button 
                    onClick={this.handleHardReset}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Reset Completo
                  </Button>
                </div>

                <div className="text-xs text-white/50 text-center">
                  Sistema de auto-recuperación neural activado
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

// Hook para usar error boundary programáticamente
export const useNeuralRecovery = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const recover = React.useCallback(() => {
    setError(null);
  }, []);

  const reportError = React.useCallback((error: Error) => {
    console.error('🧠 Neural Recovery:', error.message);
    setError(error);
  }, []);

  return { error, recover, reportError };
};
