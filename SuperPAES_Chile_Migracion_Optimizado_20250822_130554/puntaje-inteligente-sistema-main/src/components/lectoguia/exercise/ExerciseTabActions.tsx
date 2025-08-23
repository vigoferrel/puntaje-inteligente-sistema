/* eslint-disable react-refresh/only-export-components */

import React, { memo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Exercise } from '../../../types/ai-types';
import { ContextualActionButtons } from '../action-buttons/ContextualActionButtons';

interface ExerciseTabActionsProps {
  exercise: Exercise | null;
  isLoading: boolean;
  showCompletionCard: boolean;
  onAction: (action: string, params?: unknown) => Promise<void>;
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
        skill={exercise.skill as unknown}
        prueba={exercise.prueba as unknown}
        onAction={onAction}
        className="justify-center md:justify-start"
      />
    </motion.div>
  );
});

ExerciseTabActions.displayName = 'ExerciseTabActions';

