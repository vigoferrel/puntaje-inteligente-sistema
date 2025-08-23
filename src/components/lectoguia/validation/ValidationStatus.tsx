
import React from 'react';
import { AlertTriangle, CheckCircle, Info, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ValidationStatusProps {
  isValid: boolean;
  issuesCount: number;
  lastValidation?: Date;
  onRevalidate?: () => void;
  currentTest: string;
  issuesByType?: Record<string, number>;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  isValid,
  issuesCount,
  lastValidation,
  onRevalidate,
  currentTest,
  issuesByType
}) => {
  if (isValid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">
          Sistema Completamente Coherente ✨
        </AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="space-y-2">
            <p>Todos los nodos de {currentTest} son coherentes temáticamente.</p>
            <div className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-3 w-3" />
              <span>Validación integral completada</span>
              {lastValidation && (
                <span className="text-xs opacity-75">
                  • {lastValidation.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertTitle className="text-orange-800 flex items-center gap-2">
          Problemas de Coherencia Detectados
          <Badge variant="destructive" className="text-xs">
            {issuesCount} problemas
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-orange-700">
          <div className="space-y-3">
            <p>
              Se detectaron {issuesCount} problemas de coherencia en el sistema.
              El sistema aplicó correcciones automáticas donde fue posible.
            </p>
            
            {issuesByType && Object.keys(issuesByType).length > 0 && (
              <Card className="border-orange-200 bg-white/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-orange-800">
                    Distribución de Problemas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(issuesByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center text-sm">
                      <span className="capitalize text-orange-700">
                        {type.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <div className="flex items-center gap-2 pt-2">
              {onRevalidate && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRevalidate}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Info className="h-3 w-3 mr-1" />
                  Revalidar Sistema
                </Button>
              )}
              {lastValidation && (
                <span className="text-xs text-orange-600">
                  Última verificación: {lastValidation.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="text-xs text-orange-600 bg-orange-100 p-2 rounded">
              💡 Tip: Revisa la consola del navegador para ver detalles específicos de cada problema.
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};
