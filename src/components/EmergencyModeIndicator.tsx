
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

export const EmergencyModeIndicator: React.FC = () => {
  return (
    <Alert className="border-amber-500 bg-amber-50 text-amber-800 mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Modo de Emergencia Activado</AlertTitle>
      <AlertDescription className="text-sm">
        Algunas funciones pueden estar limitadas debido a problemas de conectividad. 
        La aplicación funciona con capacidades básicas.
      </AlertDescription>
    </Alert>
  );
};
