
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { ExerciseEmptyState } from './ExerciseEmptyState';
import { NodeIndicator } from './NodeIndicator';
import { ExerciseVisualContent } from './ExerciseVisualContent';
import { ExerciseQuestion } from './ExerciseQuestion';
import { ExerciseFeedback } from './ExerciseFeedback';

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

  return (
    <div className="space-y-6">
      {exercise.nodeId && <NodeIndicator />}
      
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold text-foreground mb-1">Lectura</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {exercise.skill || "Comprensión Lectora"}
          </span>
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
