/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { WifiOff, RefreshCw, CheckCircle, AlertTriangle, Wifi } from 'lucide-react';
import { openRouterService } from '../../services/openrouter/core';

interface ConnectionMonitorProps {
  onConnectionStatusChange?: (status: 'connected' | 'connecting' | 'disconnected') => void;
}

export const ConnectionMonitor: React.FC<ConnectionMonitorProps> = ({ 
  onConnectionStatusChange 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkConnection = async () => {
    try {
      setConnectionStatus('connecting');
      setLastError(null);
      onConnectionStatusChange?.('connecting');

      console.log('ConnectionMonitor: Verificando conexiÃ³n...');
      
      const response = await openRouterService({
        action: 'health_check',
        payload: {}
      });

      if (response) {
        console.log('ConnectionMonitor: ConexiÃ³n exitosa');
        setConnectionStatus('connected');
        setRetryCount(0);
        onConnectionStatusChange?.('connected');
      } else {
        throw new Error('No se recibiÃ³ respuesta del servicio');
      }
    } catch (error) {
      console.error('ConnectionMonitor: Error de conexiÃ³n:', error);
      setConnectionStatus('disconnected');
      setLastError(error instanceof Error ? error.message : 'Error de conexiÃ³n');
      onConnectionStatusChange?.('disconnected');
    }
  };

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await checkConnection();
    } finally {
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  useEffect(() => {
    // VerificaciÃ³n inicial despuÃ©s de un breve delay
    const initialCheck = setTimeout(() => {
      checkConnection();
    }, 1000);
    
    // Verificar conexiÃ³n cada 2 minutos
    const interval = setInterval(checkConnection, 120000);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
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
        return `Desconectado del servicio. ${retryCount > 0 ? `Intentos: ${retryCount}` : ''}`;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'connecting':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'disconnected':
        return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  // Solo mostrar cuando no estÃ¡ conectado
  if (connectionStatus === 'connected') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
        <Wifi className="h-4 w-4" />
        <span>Conectado</span>
      </div>
    );
  }

  return (
    <Alert className={`mb-4 ${getStatusColor()}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <AlertDescription className="flex-1">
          {getStatusMessage()}
          {lastError && connectionStatus === 'disconnected' && (
            <div className="text-xs mt-1 opacity-75">
              {lastError}
            </div>
          )}
        </AlertDescription>
        {connectionStatus === 'disconnected' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            disabled={isRetrying}
            className="ml-2 border-current"
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

