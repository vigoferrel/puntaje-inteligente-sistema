
import { useState, useCallback } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { Exercise } from '@/types/ai-types';
import { toast } from '@/components/ui/use-toast';
import { TPAESHabilidad } from '@/types/system-types';

/**
 * Hook para manejar el flujo de ejercicios en LectoGuia
 */
export function useExerciseFlow(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { addAssistantMessage, processUserMessage } = useLectoGuiaChat();
  
  // Mapeo de materias a habilidades principales
  const skillMap: Record<string, TPAESHabilidad> = {
    'general': 'INTERPRET_RELATE',
    'lectura': 'INTERPRET_RELATE',
    'matematicas-basica': 'SOLVE_PROBLEMS',
    'matematicas-avanzada': 'MODEL',
    'ciencias': 'APPLY_PRINCIPLES',
    'historia': 'SOURCE_ANALYSIS'
  };
  
  // Manejar la selección de opciones
  const handleOptionSelect = useCallback((index: number) => {
    if (selectedOption !== null) return; // Evitar cambios una vez seleccionada
    
    setSelectedOption(index);
    setShowFeedback(true);
  }, [selectedOption]);
  
  // Generar un nuevo ejercicio usando el chat
  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Limpiar el estado actual
      setCurrentExercise(null);
      setSelectedOption(null);
      setShowFeedback(false);
      
      const currentSkill = skillMap[activeSubject] || 'INTERPRET_RELATE';
      
      // Generar ejercicio usando el chat de LectoGuía
      const exercisePrompt = `Genera un ejercicio de opción múltiple para ${activeSubject}. 
      Debe incluir:
      - Una pregunta clara
      - 4 opciones de respuesta (A, B, C, D)
      - Una respuesta correcta
      - Una explicación detallada
      
      Formato el ejercicio de manera estructurada.`;
      
      const response = await processUserMessage(exercisePrompt);
      
      if (response) {
        // Crear un ejercicio simulado basado en la respuesta
        const exercise: Exercise = {
          id: `exercise-${Date.now()}`,
          nodeId: '',
          nodeName: '',
          prueba: 'COMPETENCIA_LECTORA', 
          skill: currentSkill,
          difficulty: 'INTERMEDIATE',
          question: response,
          options: [
            'Opción A - Análisis de la primera alternativa',
            'Opción B - Consideración de la segunda alternativa', 
            'Opción C - Evaluación de la tercera alternativa',
            'Opción D - Examen de la cuarta alternativa'
          ],
          correctAnswer: 'Opción A - Análisis de la primera alternativa',
          explanation: 'La respuesta correcta es A. Selecciona una opción para ver la explicación detallada.'
        };
        
        setCurrentExercise(exercise);
        setActiveTab('exercise');
        
        // Notificar al usuario
        addAssistantMessage('He generado un nuevo ejercicio para ti. Puedes verlo en la pestaña de Ejercicios.');
      }
    } catch (error) {
      console.error("Error generando ejercicio:", error);
      toast({
        title: "Error",
        description: "No se pudo generar un ejercicio. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      
      setActiveTab('chat');
      addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. ¿Te gustaría intentar con otro tema?");
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, setActiveTab, addAssistantMessage, processUserMessage, skillMap]);
  
  // Función para solicitar ejercicio que retorna una promesa
  const handleExerciseRequest = useCallback(async (): Promise<boolean> => {
    try {
      await handleNewExercise();
      return true;
    } catch (error) {
      console.error("Error en solicitud de ejercicio:", error);
      return false;
    }
  }, [handleNewExercise]);
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    handleExerciseRequest,
    isLoading,
    setIsLoading,
    setCurrentExercise,
    skillMap
  };
}
