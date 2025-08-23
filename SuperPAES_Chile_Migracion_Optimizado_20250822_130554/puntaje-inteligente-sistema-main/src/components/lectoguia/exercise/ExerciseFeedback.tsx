/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Exercise } from '../../../types/ai-types';
import { Button } from '../../../components/ui/button';

interface ExerciseFeedbackProps {
  exercise: Exercise;
  selectedOption: number | null;
  showFeedback: boolean;
  onContinue: () => void;
}

export const ExerciseFeedback: FC<ExerciseFeedbackProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onContinue
}) => {
  if (!showFeedback) return null;
  
  // Determine the correct answer as index
  const correctAnswerIndex = exercise.options.findIndex(
    option => option === exercise.correctAnswer
  );
  
  // If the correct answer is not found, use 0 as default
  const correctIndex = correctAnswerIndex >= 0 ? correctAnswerIndex : 0;
  
  const isCorrect = selectedOption === correctIndex;

  return (
    <div className={`p-4 rounded-lg mt-4 ${
      isCorrect 
        ? 'bg-green-500/20 border border-green-500/30' 
        : 'bg-red-500/20 border border-red-500/30'
    }`}>
      <h4 className="font-semibold mb-2">
        {isCorrect ? 'Â¡Correcto!' : 'Incorrecto'}
      </h4>
      <p>
        {isCorrect 
          ? exercise.explanation || "Â¡Bien hecho! Has seleccionado la respuesta correcta." 
          : `Respuesta incorrecta. La opciÃ³n correcta es: "${exercise.correctAnswer}". ${exercise.explanation || ""}`
        }
      </p>
      
      <div className="mt-4 flex justify-end">
        <Button onClick={onContinue} className="bg-primary hover:bg-primary/90">
          Continuar
        </Button>
      </div>
    </div>
  );
};

