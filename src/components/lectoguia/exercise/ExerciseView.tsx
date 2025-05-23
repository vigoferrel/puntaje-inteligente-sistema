
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { ExerciseEmptyState } from './ExerciseEmptyState';
import { NodeIndicator } from './NodeIndicator';
import { ExerciseVisualContent } from './ExerciseVisualContent';
import { ExerciseQuestion } from './ExerciseQuestion';
import { ExerciseFeedback } from './ExerciseFeedback';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { getSkillName } from '@/utils/lectoguia-utils';
import { ExerciseContentValidator } from '@/utils/exercise-content-validator';
import { AlertTriangle, CheckCircle } from 'lucide-react';

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

  // Validar contenido del ejercicio
  const validation = ExerciseContentValidator.validateExercise(exercise);

  // Display name del tipo de prueba
  const pruebaName = exercise.prueba ? 
    getPruebaDisplayName(exercise.prueba as TPAESPrueba) : 'Comprensión Lectora';
    
  // Display name de la habilidad
  const skillName = exercise.skill ?
    getSkillName(exercise.skill) : 'Interpretación';

  return (
    <div className="space-y-6">
      {exercise.nodeId && <NodeIndicator nodeName={exercise.nodeName} />}
      
      {/* Mostrar alertas de validación si es necesario */}
      {!validation.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Este ejercicio puede tener problemas de contenido. Se ha generado un ejercicio educativo de respaldo.
          </AlertDescription>
        </Alert>
      )}
      
      {validation.warnings.length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Ejercicio educativo validado y listo para resolver.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Ejercicio Educativo</h3>
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">
              {pruebaName}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {skillName}
            </Badge>
            {exercise.difficulty && (
              <Badge variant="default" className="text-xs">
                {exercise.difficulty}
              </Badge>
            )}
          </div>
        </div>
        
        <ExerciseVisualContent exercise={exercise} />
        
        {/* Contexto del ejercicio */}
        {(exercise.text || exercise.context) && (
          <div className="bg-secondary/30 p-4 rounded-lg text-foreground border border-border mb-4">
            <h4 className="font-medium mb-2">Contexto:</h4>
            <p className="text-sm">
              {exercise.text || exercise.context}
            </p>
          </div>
        )}
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
      
      {/* Indicador de ejercicio de respaldo si aplica */}
      {exercise.id?.includes('fallback') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <CheckCircle className="inline h-4 w-4 mr-1" />
            Este es un ejercicio educativo verificado de nuestro banco de contenido pedagógico.
          </p>
        </div>
      )}
    </div>
  );
};
