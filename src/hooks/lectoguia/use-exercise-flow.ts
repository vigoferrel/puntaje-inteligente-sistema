
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useLectoGuiaExercise } from '@/hooks/use-lectoguia-exercise';
import { useLectoGuiaSession } from '@/hooks/use-lectoguia-session';
import { TPAESHabilidad } from '@/types/system-types';

/**
 * Hook para gestionar el flujo de ejercicios en LectoGuia
 */
export function useExerciseFlow(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  const { addAssistantMessage } = useLectoGuiaChat();
  const { saveExerciseAttempt } = useLectoGuiaSession();
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    resetExercise,
    handleOptionSelect: selectOption
  } = useLectoGuiaExercise();
  
  // Mapeo de materias a habilidades
  const skillMap: Record<string, TPAESHabilidad> = {
    'lectura': 'TRACK_LOCATE',
    'matematicas': 'SOLVE_PROBLEMS',
    'ciencias': 'IDENTIFY_THEORIES',
    'historia': 'TEMPORAL_THINKING',
    'general': 'INTERPRET_RELATE'
  };
  
  // Generar un ejercicio según la materia actual
  const handleExerciseRequest = async () => {
    const exercise = await generateExercise(skillMap[activeSubject]);
    
    if (exercise) {
      setTimeout(() => setActiveTab("exercise"), 500);
      
      // Agregar mensaje del asistente sobre el ejercicio generado
      addAssistantMessage(
        `He preparado un ejercicio de ${activeSubject === 'general' ? 'comprensión lectora' : activeSubject} para ti. ` +
        `Es un ejercicio de dificultad ${exercise.difficulty || "intermedia"} que evalúa la habilidad de ` +
        `${exercise.skill || "interpretación"}. Puedes resolverlo en la pestaña de Ejercicios.`
      );
      return true;
    } else {
      addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. Por favor, inténtalo más tarde.");
      return false;
    }
  };
  
  // Manejar la selección de una opción en el ejercicio
  const handleOptionSelect = (index: number) => {
    selectOption(index);
    
    setTimeout(() => {
      // Guardar el intento de ejercicio si el usuario está logueado y el ejercicio es válido
      if (currentExercise && currentExercise.id && currentExercise.options) {
        const correctAnswerIndex = currentExercise.options.findIndex(
          option => option === currentExercise.correctAnswer
        );
        
        const isCorrect = index === (correctAnswerIndex >= 0 ? correctAnswerIndex : 0);
        
        saveExerciseAttempt(
          currentExercise,
          index,
          isCorrect,
          currentExercise.skill || 'INTERPRET_RELATE'
        );
      }
    }, 300);
  };
  
  // Manejar la solicitud de un nuevo ejercicio
  const handleNewExercise = () => {
    setActiveTab("chat");
    resetExercise();
    
    addAssistantMessage("Excelente trabajo. ¿Te gustaría continuar con otro ejercicio o prefieres que trabajemos en otra materia?");
  };
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    handleExerciseRequest,
    handleOptionSelect,
    handleNewExercise,
    skillMap
  };
}
