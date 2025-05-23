
import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ValidationStatusProps {
  isValid: boolean;
  issuesCount: number;
  lastValidation?: Date;
  onRevalidate?: () => void;
  currentTest: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  isValid,
  issuesCount,
  lastValidation,
  onRevalidate,
  currentTest
}) => {
  if (isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Contenido Validado
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Todos los nodos de {currentTest} son coherentes temáticamente.
          {lastValidation && (
            <span className="text-xs block mt-1">
              Última validación: {lastValidation.toLocaleTimeString()}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 flex items-center gap-2">
        Inconsistencias Detectadas
        <Badge variant="destructive" className="text-xs">
          {issuesCount} problemas
        </Badge>
      </AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="space-y-2">
          <p>
            Se detectaron {issuesCount} nodos con problemas de coherencia temática en {currentTest}.
          </p>
          <div className="flex items-center gap-2">
            {onRevalidate && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRevalidate}
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Info className="h-3 w-3 mr-1" />
                Revalidar
              </Button>
            )}
            {lastValidation && (
              <span className="text-xs">
                Última verificación: {lastValidation.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
