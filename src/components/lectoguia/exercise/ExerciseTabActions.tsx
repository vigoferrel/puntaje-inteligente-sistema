
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Exercise } from '@/types/ai-types';
import { ContextualActionButtons } from '../action-buttons/ContextualActionButtons';

interface ExerciseTabActionsProps {
  exercise: Exercise | null;
  isLoading: boolean;
  showCompletionCard: boolean;
  onAction: (action: string, params?: any) => Promise<void>;
}

export const ExerciseTabActions = memo<ExerciseTabActionsProps>(({
  exercise,
  isLoading,
  showCompletionCard,
  onAction
}) => {
  if (!exercise || isLoading || showCompletionCard) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6 p-4 glass-morphism rounded-2xl"
    >
      <ContextualActionButtons 
        context="exercise"
        skill={exercise.skill as any}
        prueba={exercise.prueba as any}
        onAction={onAction}
        className="justify-center md:justify-start"
      />
    </motion.div>
  );
});

ExerciseTabActions.displayName = 'ExerciseTabActions';
