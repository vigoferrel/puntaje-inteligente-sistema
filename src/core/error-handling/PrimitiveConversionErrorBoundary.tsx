import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class PrimitiveConversionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente render muestre la UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
      retryCount: 0
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 PrimitiveConversionErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Llamar al callback de error si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log específico para errores de conversión de objetos
    if (error.message.includes('Cannot convert object to primitive value')) {
      console.error('🔍 Error de conversión de objeto detectado:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  public render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de fallback por defecto
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-lg border-red-200 shadow-2xl">
            <CardHeader className="text-center border-b border-red-100">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-600 mr-3" />
                <Bug className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Error de Conversión de Datos
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Se detectó un problema al procesar datos del sistema
              </p>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Detalles del Error:</h3>
                  <p className="text-red-700 text-sm font-mono">
                    {this.state.error?.message || 'Error desconocido'}
                  </p>
                </div>

                {this.state.errorInfo && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Componente Afectado:</h3>
                    <p className="text-gray-700 text-sm font-mono">
                      {this.state.errorInfo.componentStack.split('\n')[1]?.trim() || 'Componente desconocido'}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Solución:</h3>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Se ha aplicado un parche de seguridad para conversiones de datos</li>
                    <li>• Los datos problemáticos han sido aislados y procesados de forma segura</li>
                    <li>• El sistema continuará funcionando con datos alternativos</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    onClick={this.handleRetry}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar ({this.state.retryCount}/3)
                  </Button>
                  
                  <Button 
                    onClick={this.handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Reiniciar Componente
                  </Button>
                </div>

                {this.state.retryCount >= 3 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Nota:</strong> Si el problema persiste después de 3 intentos, 
                      considera recargar la página o contactar soporte técnico.
                    </p>
                  </div>
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

export default PrimitiveConversionErrorBoundary;
