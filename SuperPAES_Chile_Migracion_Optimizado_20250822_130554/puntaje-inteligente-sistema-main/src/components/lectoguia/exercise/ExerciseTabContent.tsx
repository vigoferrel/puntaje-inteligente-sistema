/* eslint-disable react-refresh/only-export-components */

import React, { memo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Exercise } from '../../../types/ai-types';
import { CinematicExerciseView } from './CinematicExerciseView';
import { ExerciseCompletionCard } from './ExerciseCompletionCard';
import { getPruebaDisplayName } from '../../../types/system-types';

interface ExerciseTabContentProps {
  isLoading: boolean;
  showCompletionCard: boolean;
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  exerciseSource?: 'PAES' | 'AI' | null;
  progress: number;
  selectedPrueba: string | null;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  onCompletionContinue: () => void;
}

export const ExerciseTabContent = memo<ExerciseTabContentProps>(({
  isLoading,
  showCompletionCard,
  exercise,
  selectedOption,
  showFeedback,
  exerciseSource,
  progress,
  selectedPrueba,
  onOptionSelect,
  onContinue,
  onCompletionContinue
}) => {
  if (isLoading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-[600px] glass-morphism"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold">Preparando experiencia cinematogrÃ¡fica</h3>
          <p className="text-muted-foreground">
            Generando ejercicio interactivo...
          </p>
          {selectedPrueba && (
            <p className="text-xs text-muted-foreground">
              Configurando para {getPruebaDisplayName(selectedPrueba as unknown)}
            </p>
          )}
        </div>
        
        {/* Efectos de carga cinematogrÃ¡ficos */}
        <div className="mt-8 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  if (showCompletionCard && exercise) {
    const score = selectedOption === exercise.options.findIndex(o => o === exercise.correctAnswer) ? 100 : 0;
    
    return (
      <ExerciseCompletionCard 
        score={score}
        skillName={exercise.skill?.toString() || 'ComprensiÃ³n'}
        skillImprovement={5}
        onContinue={onCompletionContinue}
      />
    );
  }

  return (
    <CinematicExerciseView
      exercise={exercise}
      selectedOption={selectedOption}
      showFeedback={showFeedback}
      onOptionSelect={onOptionSelect}
      onContinue={onContinue}
      exerciseSource={exerciseSource}
      progress={progress}
    />
  );
});

ExerciseTabContent.displayName = 'ExerciseTabContent';

