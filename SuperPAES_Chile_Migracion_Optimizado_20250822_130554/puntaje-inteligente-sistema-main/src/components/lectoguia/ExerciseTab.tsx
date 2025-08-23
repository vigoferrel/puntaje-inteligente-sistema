/* eslint-disable react-refresh/only-export-components */

import React, { useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Exercise } from "../../types/ai-types";
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { useLectoGuia } from '../../contexts/LectoGuiaContext';
import { useContextualActions } from '../../hooks/lectoguia/use-contextual-actions';
import { useExerciseTabState } from '../../hooks/lectoguia/use-exercise-tab-state';
import { useExerciseProgress } from '../../hooks/lectoguia/use-exercise-progress';
import { ExerciseTabHeader } from './exercise/ExerciseTabHeader';
import { ExerciseTabContent } from './exercise/ExerciseTabContent';
import { ExerciseTabActions } from './exercise/ExerciseTabActions';
import { getPruebaDisplayName } from '../../types/system-types';

interface ExerciseTabProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  isLoading?: boolean;
  exerciseSource?: 'PAES' | 'AI' | null;
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  isLoading = false,
  exerciseSource = null
}) => {
  const { 
    setActiveTab, 
    handleNewExercise, 
    selectedPrueba, 
    nodes, 
    nodeProgress, 
    skillLevels,
    activeSubject
  } = useLectoGuia();

  // Estado del tab
  const {
    exerciseProgress,
    showCompletionCard,
    updateProgress,
    completeExercise,
    setShowCompletionCard
  } = useExerciseTabState();

  // Manejo del progreso del ejercicio
  useExerciseProgress({
    exercise,
    selectedOption,
    showFeedback,
    isLoading,
    updateProgress,
    completeExercise
  });

  // Manejo de acciones contextuales
  const handleExerciseRequest = useCallback(async (): Promise<boolean> => {
    try {
      await handleNewExercise();
      return true;
    } catch (error) {
      console.error("Error en solicitud de ejercicio:", error);
      return false;
    }
  }, [handleNewExercise]);

  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);

  // Manejo de continuaciÃ³n despuÃ©s de completar el ejercicio
  const handleExerciseContinue = useCallback(() => {
    setShowCompletionCard(false);
    onContinue();
  }, [setShowCompletionCard, onContinue]);

  // ConstrucciÃ³n de breadcrumbs
  const breadcrumbItems = [
    { 
      label: 'LectoGuÃ­a', 
      active: false, 
      onClick: () => setActiveTab('chat') 
    },
    { 
      label: 'Ejercicios', 
      active: true,
      onClick: () => setActiveTab('exercise')
    }
  ];

  // AÃ±adir prueba actual si existe
  if (exercise?.prueba) {
    breadcrumbItems.splice(1, 0, {
      label: getPruebaDisplayName(exercise.prueba as unknown),
      active: false,
      onClick: () => setActiveTab('chat')
    });
  }

  return (
    <div className="space-y-4">
      {/* Header con estadÃ­sticas */}
      <ExerciseTabHeader
        activeSubject={activeSubject}
        selectedPrueba={selectedPrueba}
        hasExercise={!!exercise}
        isLoading={isLoading}
        nodes={nodes}
        nodeProgress={nodeProgress}
        skillLevels={skillLevels}
      />
      
      {/* Contenedor principal */}
      <div className="relative">
        {/* Breadcrumbs */}
        {!showCompletionCard && (
          <div className="mb-4 px-4 py-2 glass-morphism rounded-lg">
            <LectoGuiaBreadcrumb items={breadcrumbItems} />
          </div>
        )}
        
        {/* Vista principal del ejercicio */}
        <div className="relative overflow-hidden rounded-3xl">
          <ExerciseTabContent
            isLoading={isLoading}
            showCompletionCard={showCompletionCard}
            exercise={exercise}
            selectedOption={selectedOption}
            showFeedback={showFeedback}
            exerciseSource={exerciseSource}
            progress={exerciseProgress}
            selectedPrueba={selectedPrueba}
            onOptionSelect={onOptionSelect}
            onContinue={onContinue}
            onCompletionContinue={handleExerciseContinue}
          />
        </div>
        
        {/* Botones de acciÃ³n contextual */}
        <ExerciseTabActions
          exercise={exercise}
          isLoading={isLoading}
          showCompletionCard={showCompletionCard}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};

