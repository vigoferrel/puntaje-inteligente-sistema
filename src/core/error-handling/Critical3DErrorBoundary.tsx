
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Critical3DErrorState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  fallbackMode: boolean;
}

interface Critical3DErrorProps {
  children: ReactNode;
  componentName: string;
  fallback2D?: ReactNode;
  maxRetries?: number;
}

export class Critical3DErrorBoundary extends Component<Critical3DErrorProps, Critical3DErrorState> {
  private readonly maxRetries: number;

  constructor(props: Critical3DErrorProps) {
    super(props);
    this.maxRetries = props.maxRetries || 2;
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      fallbackMode: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<Critical3DErrorState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`🚨 3D Critical Error in ${this.props.componentName}:`, error.message);
    
    // Si es un error de WebGL, activar modo fallback inmediatamente
    if (error.message.includes('WebGL') || error.message.includes('context')) {
      this.setState({ fallbackMode: true });
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: null,
        retryCount: this.state.retryCount + 1
      });
    } else {
      this.setState({ fallbackMode: true });
    }
  };

  handleFallback2D = () => {
    this.setState({
      hasError: false,
      fallbackMode: true,
      retryCount: 0
    });
  };

  render() {
    if (this.state.fallbackMode && this.props.fallback2D) {
      return this.props.fallback2D;
    }

    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg border border-red-500/30">
          <Card className="max-w-md bg-red-950/50 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Error en {this.props.componentName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-300 text-sm">
                Error en visualización 3D. El sistema puede continuar en modo 2D.
              </p>
              
              <div className="flex gap-2">
                {this.state.retryCount < this.maxRetries && (
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar ({this.maxRetries - this.state.retryCount})
                  </Button>
                )}
                
                {this.props.fallback2D && (
                  <Button
                    onClick={this.handleFallback2D}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Modo 2D
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
