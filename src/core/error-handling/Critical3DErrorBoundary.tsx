
import React, { Component, ReactNode } from 'react';
import { productionErrorRecovery } from './ProductionErrorRecovery';

interface Props {
  children: ReactNode;
  componentName: string;
  fallback2D?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class Critical3DErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Critical 3D Error:', error, errorInfo);
    
    // Trigger production error recovery
    productionErrorRecovery.manualRecovery('webgl');
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Force full recovery after max retries
      productionErrorRecovery.manualRecovery('full');
      this.setState({
        hasError: false,
        error: undefined,
        retryCount: 0
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback2D personalizado, renderizarlo en lugar del error UI
      if (this.props.fallback2D) {
        return this.props.fallback2D;
      }

      // Fallback de error por defecto
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white p-8 bg-black/30 backdrop-blur-md rounded-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-4">Error Crítico del Sistema</h2>
            <p className="text-red-300 mb-4">
              {this.props.componentName}: {this.state.error?.message || 'Error desconocido'}
            </p>
            <p className="text-white/70 mb-6">
              Intentos de recuperación: {this.state.retryCount}/{this.maxRetries}
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
            >
              {this.state.retryCount >= this.maxRetries ? 'Recuperación Completa' : 'Reintentar'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
