
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
    
    // TO DO: Actualizar el progreso del usuario
  }, [selectedOption]);
  
  // Generar un nuevo ejercicio
  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Primero, limpiar el estado actual
      setCurrentExercise(null);
      setSelectedOption(null);
      setShowFeedback(false);
      
      const currentSkill = skillMap[activeSubject] || 'INTERPRET_RELATE';
      
      // Solicitar un ejercicio nuevo al backend
      const response = await fetch('/api/lectoguia/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: activeSubject,
          skill: currentSkill,
          difficulty: 'INTERMEDIATE'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al generar ejercicio: ${response.statusText}`);
      }
      
      const exercise = await response.json();
      
      setCurrentExercise(exercise);
      // Cambiar a la pestaña de ejercicio
      setActiveTab('exercise');
    } catch (error) {
      console.error("Error generando ejercicio:", error);
      toast({
        title: "Error",
        description: "No se pudo generar un ejercicio. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      
      // Volvemos a la pestaña de chat
      setActiveTab('chat');
      addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. ¿Te gustaría intentar con otro tema?");
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, setActiveTab, addAssistantMessage]);
  
  // Solicitar un ejercicio específico usando la interfaz de chat
  const handleExerciseRequest = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Hacer una solicitud de ejercicio usando la interfaz de chat
      const result = await processUserMessage(
        `Genera un ejercicio sobre ${activeSubject} con formato de opción múltiple`
      );
      
      if (result) {
        // Parsear el ejercicio desde la respuesta (simulado por ahora)
        // En un caso real, deberíamos tener una respuesta estructurada desde la API
        const mockExercise: Exercise = {
          id: `exercise-${Date.now()}`,
          nodeId: '',
          nodeName: '',
          prueba: 'COMPETENCIA_LECTORA', 
          skill: skillMap[activeSubject] || 'INTERPRET_RELATE',
          difficulty: 'INTERMEDIATE',
          question: result,
          options: ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
          correctAnswer: 'Opción 1',
          explanation: 'Selecciona una opción para ver la explicación'
        };
        
        setCurrentExercise(mockExercise);
        setSelectedOption(null);
        setShowFeedback(false);
        setActiveTab('exercise');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error solicitando ejercicio:", error);
      toast({
        title: "Error",
        description: "No se pudo generar un ejercicio. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, processUserMessage, setActiveTab, skillMap]);
  
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
