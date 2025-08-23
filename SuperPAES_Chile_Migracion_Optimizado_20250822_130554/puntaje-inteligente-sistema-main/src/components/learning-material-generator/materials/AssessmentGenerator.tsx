/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { TestTube, Play } from 'lucide-react';
import { TLearningCyclePhase } from '../../../types/system-types';

interface AssessmentGeneratorProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  onGenerate: (config: unknown) => void;
  isGenerating: boolean;
}

export const AssessmentGenerator: FC<AssessmentGeneratorProps> = ({
  selectedSubject,
  currentPhase,
  onGenerate,
  isGenerating
}) => {
  const handleGenerate = () => {
    onGenerate({
      materialType: 'diagnostic_tests',
      subject: selectedSubject,
      phase: currentPhase,
      count: 10
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Generador de Evaluaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Crea evaluaciones diagnÃ³sticas para medir tu progreso y detectar Ã¡reas de mejora.
        </p>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Generar EvaluaciÃ³n DiagnÃ³stica
        </Button>
      </CardContent>
    </Card>
  );
};

