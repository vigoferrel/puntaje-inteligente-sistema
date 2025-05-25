
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play } from 'lucide-react';
import { TLearningCyclePhase } from '@/types/system-types';

interface StudyContentGeneratorProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const StudyContentGenerator: React.FC<StudyContentGeneratorProps> = ({
  selectedSubject,
  currentPhase,
  onGenerate,
  isGenerating
}) => {
  const handleGenerate = () => {
    onGenerate({
      materialType: 'study_content',
      subject: selectedSubject,
      phase: currentPhase,
      count: 3
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Generador de Contenido de Estudio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Genera material teórico personalizado para reforzar conceptos fundamentales.
        </p>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Generar Contenido de Estudio
        </Button>
      </CardContent>
    </Card>
  );
};
