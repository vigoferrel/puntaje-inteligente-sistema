/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Badge } from '../../../components/ui/badge';
import { Timer } from 'lucide-react';
import { NodeDescriptor } from './NodeDescriptor';

interface Exercise {
  id: number;
  node: string;
  subject: string;
  difficulty: string;
  estimatedTime: number;
}

interface ExerciseHeaderProps {
  exercise: Exercise;
}

export const ExerciseHeader: FC<ExerciseHeaderProps> = ({ exercise }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Badge variant="default">Ejercicio {exercise.id}</Badge>
        <NodeDescriptor nodeCode={exercise.node} />
        <Badge 
          variant="secondary" 
          className={
            exercise.difficulty === 'avanzado' ? 'bg-red-100 text-red-800' :
            exercise.difficulty === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }
        >
          {exercise.difficulty}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Timer className="w-4 h-4" />
        <span>{exercise.estimatedTime} min</span>
      </div>
    </div>
  );
};

