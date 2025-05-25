
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Play } from 'lucide-react';

interface DiagnosticInterfaceProps {
  diagnosticIntegration: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const DiagnosticInterface: React.FC<DiagnosticInterfaceProps> = ({
  diagnosticIntegration,
  onAction,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Diagnósticos PAES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="default">
              {diagnosticIntegration.availableTests} Disponibles
            </Badge>
            <Badge variant="outline" className="text-white border-white/20">
              {diagnosticIntegration.officialExercises} Ejercicios Oficiales
            </Badge>
          </div>
          
          <p className="text-white/70 mb-4">
            Evaluaciones basadas en exámenes oficiales PAES para medir tu progreso.
          </p>
          
          <Button onClick={() => diagnosticIntegration.startDiagnostic()}>
            <Play className="w-4 h-4 mr-2" />
            Comenzar Diagnóstico
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
