
import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AutoRecoverySystemProps {
  children: React.ReactNode;
}

export const AutoRecoverySystem: React.FC<AutoRecoverySystemProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('🚨 Error detectado por AutoRecoverySystem:', error);
      setErrorCount(prev => prev + 1);
      
      if (errorCount >= 3) {
        setHasError(true);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Promise rejection detectada:', event.reason);
      setErrorCount(prev => prev + 1);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [errorCount]);

  const handleRecovery = async () => {
    setIsRecovering(true);
    
    try {
      // Limpiar cache y reiniciar
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Esperar y reiniciar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasError(false);
      setErrorCount(0);
      setIsRecovering(false);
      
      // Recargar si es necesario
      if (errorCount > 5) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error en recovery:', error);
      setIsRecovering(false);
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-red-950/50 border-red-500/30">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-400" />
            <h2 className="text-xl font-bold text-white">Sistema en Recuperación</h2>
            <p className="text-red-300">
              Se detectaron múltiples errores. Iniciando proceso de recuperación automática.
            </p>
            <Button 
              onClick={handleRecovery} 
              disabled={isRecovering}
              className="w-full"
            >
              {isRecovering ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Recuperando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Iniciar Recuperación
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
