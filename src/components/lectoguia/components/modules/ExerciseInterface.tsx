
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Play } from 'lucide-react';

interface ExerciseInterfaceProps {
  context: any;
  onAction: (action: any) => void;
  onNavigate: (module: string, context?: any) => void;
}

export const ExerciseInterface: React.FC<ExerciseInterfaceProps> = ({
  context,
  onAction,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Ejercicios Adaptativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 mb-4">
            Ejercicios personalizados basados en tu progreso y diagnósticos.
          </p>
          <Button onClick={() => onAction({ type: 'GENERATE_EXERCISE' })}>
            <Play className="w-4 h-4 mr-2" />
            Generar Ejercicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
