/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { 
  AlertCircle, 
  Wifi, 
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ConnectionStatus } from '../../hooks/use-openrouter';

interface ConnectionStatusIndicatorProps {
  status: ConnectionStatus;
  serviceStatus?: 'available' | 'degraded' | 'unavailable';
  onRetry?: () => void;
}

export const ConnectionStatusIndicator: FC<ConnectionStatusIndicatorProps> = ({
  status,
  serviceStatus = 'available',
  onRetry
}) => {
  // Determinar el color y el icono segÃºn el estado
  let statusColor = 'text-green-500';
  let StatusIcon = Wifi;
  let statusText = 'Conectado';
  
  if (status === 'disconnected' || serviceStatus === 'unavailable') {
    statusColor = 'text-red-500';
    StatusIcon = WifiOff;
    statusText = 'Desconectado';
  } else if (status === 'connecting' || serviceStatus === 'degraded') {
    statusColor = 'text-yellow-500';
    StatusIcon = AlertCircle;
    statusText = 'ConexiÃ³n limitada';
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-4 w-4 ${statusColor}`} />
            <span className="text-xs font-medium hidden md:inline">
              {statusText}
            </span>
            {(status === 'disconnected' || serviceStatus !== 'available') && onRetry && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onRetry}
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Estado del servicio: {statusText}
            {(status === 'disconnected' || serviceStatus !== 'available') && 
              " - Funcionando en modo offline con capacidades limitadas"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

