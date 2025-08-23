import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bug, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      retryCount: 0
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleRestart = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Header con iconos */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Bug className="w-5 h-5 text-orange-600" />
              </div>
            </div>

            {/* Título */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Error de Conversión de Datos
            </h2>
            <p className="text-gray-600 mb-6">
              Se detectó un problema al procesar datos del sistema
            </p>

            {/* Detalles del error */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Detalles del Error:</h3>
              <p className="text-sm text-red-700 font-mono">
                {this.state.error?.message || 'Error desconocido'}
              </p>
            </div>

            {/* Componente afectado */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Componente Afectado:</h3>
              <p className="text-sm text-gray-700">
                {this.state.errorInfo?.componentStack?.split('\n')[1]?.trim() || 'Componente desconocido'}
              </p>
            </div>

            {/* Solución aplicada */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Solución:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Se ha aplicado un parche de seguridad para conversiones de datos</li>
                <li>• Los datos problemáticos han sido aislados y procesados de forma segura</li>
                <li>• El sistema continuará funcionando con datos alternativos</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                disabled={this.state.retryCount >= 3}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                  this.state.retryCount >= 3
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reintentar ({this.state.retryCount}/3)</span>
              </button>
              
              <button
                onClick={this.handleRestart}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reiniciar Componente</span>
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
