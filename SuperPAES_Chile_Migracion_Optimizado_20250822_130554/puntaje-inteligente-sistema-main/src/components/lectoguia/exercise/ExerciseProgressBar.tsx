/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Progress } from '../../../components/ui/progress';
import { motion } from 'framer-motion';

interface ExerciseProgressBarProps {
  progress: number;
  difficulty?: string;
}

export const ExerciseProgressBar: FC<ExerciseProgressBarProps> = ({
  progress,
  difficulty = 'INTERMEDIO'
}) => {
  // Determinar color segÃºn dificultad
  const getColorClass = () => {
    switch (difficulty.toLowerCase()) {
      case 'basico':
      case 'basic':
        return 'bg-green-500';
      case 'intermedio':
      case 'intermediate':
        return 'bg-blue-500';
      case 'avanzado':
      case 'advanced':
        return 'bg-purple-500';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="w-full mb-4 space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Progreso del ejercicio</span>
        <motion.span 
          className="text-xs font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={progress}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
      <Progress 
        value={progress} 
        className="h-1.5"
        indicatorClassName={getColorClass()}
      />
    </div>
  );
};

