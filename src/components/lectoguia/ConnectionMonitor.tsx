
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { openRouterService } from '@/services/openrouter/core';

interface ConnectionMonitorProps {
  onConnectionStatusChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;
}

export const ConnectionMonitor: React.FC<ConnectionMonitorProps> = ({ 
  onConnectionStatusChange 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      setConnectionStatus('connecting');
      setLastError(null);
      onConnectionStatusChange?.('connecting');

      console.log('ConnectionMonitor: Verificando conexión...');
      
      const response = await openRouterService({
        action: 'health_check',
        payload: {}
      });

      if (response) {
        console.log('ConnectionMonitor: Conexión exitosa');
        setConnectionStatus('connected');
        onConnectionStatusChange?.('connected');
      } else {
        throw new Error('No se recibió respuesta del servicio');
      }
    } catch (error) {
      console.error('ConnectionMonitor: Error de conexión:', error);
      setConnectionStatus('disconnected');
      setLastError(error instanceof Error ? error.message : 'Error de conexión');
      onConnectionStatusChange?.('disconnected');
    }
  };

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    await checkConnection();
    setTimeout(() => setIsRetrying(false), 2000);
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar conexión cada 2 minutos
    const interval = setInterval(checkConnection, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado al servicio de IA';
      case 'connecting':
        return 'Conectando...';
      case 'disconnected':
        return `Desconectado del servicio${lastError ? `: ${lastError}` : ''}`;
    }
  };

  if (connectionStatus === 'connected') {
    return null; // No mostrar nada cuando está conectado
  }

  return (
    <Alert variant={connectionStatus === 'disconnected' ? 'destructive' : 'default'} className="mb-4">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <AlertDescription className="flex-1">
          {getStatusMessage()}
        </AlertDescription>
        {connectionStatus === 'disconnected' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isRetrying}
            className="ml-2"
          >
            {isRetrying ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              'Reintentar'
            )}
          </Button>
        )}
      </div>
    </Alert>
  );
};
