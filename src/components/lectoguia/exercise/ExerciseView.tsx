
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { ExerciseEmptyState } from './ExerciseEmptyState';
import { NodeIndicator } from './NodeIndicator';
import { ExerciseVisualContent } from './ExerciseVisualContent';
import { ExerciseQuestion } from './ExerciseQuestion';
import { ExerciseFeedback } from './ExerciseFeedback';
import { Badge } from '@/components/ui/badge';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { getSkillName } from '@/utils/lectoguia-utils';

interface ExerciseViewProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue
}) => {
  if (!exercise) {
    return <ExerciseEmptyState />;
  }

  // Display name del tipo de prueba
  const pruebaName = exercise.prueba ? 
    getPruebaDisplayName(exercise.prueba as TPAESPrueba) : 'Comprensión Lectora';
    
  // Display name de la habilidad
  const skillName = exercise.skill ?
    getSkillName(exercise.skill) : 'Interpretación';

  return (
    <div className="space-y-6">
      {exercise.nodeId && <NodeIndicator nodeName={exercise.nodeName} />}
      
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Ejercicio</h3>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">
              {pruebaName}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {skillName}
            </Badge>
          </div>
        </div>
        
        <ExerciseVisualContent exercise={exercise} />
        
        <div className="bg-secondary/30 p-4 rounded-lg text-foreground border border-border">
          {exercise.text || exercise.context || "Sin contenido"}
        </div>
      </div>

      <ExerciseQuestion
        exercise={exercise}
        selectedOption={selectedOption}
        showFeedback={showFeedback}
        onOptionSelect={onOptionSelect}
      />
      
      <ExerciseFeedback
        exercise={exercise}
        selectedOption={selectedOption}
        showFeedback={showFeedback}
        onContinue={onContinue}
      />
    </div>
  );
};
