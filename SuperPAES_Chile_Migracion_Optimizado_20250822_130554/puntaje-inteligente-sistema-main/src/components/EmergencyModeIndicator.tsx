/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export const EmergencyModeIndicator: FC = () => {
  return (
    <Alert className="border-amber-500 bg-amber-50 text-amber-800 mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Modo de Emergencia Activado</AlertTitle>
      <AlertDescription className="text-sm">
        Algunas funciones pueden estar limitadas debido a problemas de conectividad. 
        La aplicaciÃ³n funciona con capacidades bÃ¡sicas.
      </AlertDescription>
    </Alert>
  );
};

