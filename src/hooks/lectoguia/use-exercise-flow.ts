
import { useState, useCallback } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { Exercise } from '@/types/ai-types';
import { toast } from '@/components/ui/use-toast';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { openRouterService } from '@/services/openrouter/core';

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
  
  const { addAssistantMessage } = useLectoGuiaChat();
  
  // Mapeo correcto de materias a habilidades principales
  const skillMap: Record<string, TPAESHabilidad> = {
    'general': 'INTERPRET_RELATE',
    'lectura': 'INTERPRET_RELATE',
    'matematicas-basica': 'SOLVE_PROBLEMS',
    'matematicas-avanzada': 'MODEL',
    'ciencias': 'APPLY_PRINCIPLES',
    'historia': 'SOURCE_ANALYSIS'
  };

  // Mapeo correcto de materias a pruebas PAES
  const subjectToPruebaMap: Record<string, TPAESPrueba> = {
    'general': 'COMPETENCIA_LECTORA',
    'lectura': 'COMPETENCIA_LECTORA',
    'matematicas-basica': 'MATEMATICA_1',
    'matematicas-avanzada': 'MATEMATICA_2',
    'ciencias': 'CIENCIAS',
    'historia': 'HISTORIA'
  };
  
  // Manejar la selección de opciones
  const handleOptionSelect = useCallback((index: number) => {
    if (selectedOption !== null) return; // Evitar cambios una vez seleccionada
    
    setSelectedOption(index);
    setShowFeedback(true);
  }, [selectedOption]);
  
  // Generar un nuevo ejercicio usando openRouterService
  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('Generando nuevo ejercicio para:', activeSubject);
      
      // Limpiar el estado actual
      setCurrentExercise(null);
      setSelectedOption(null);
      setShowFeedback(false);
      
      const currentSkill = skillMap[activeSubject] || 'INTERPRET_RELATE';
      const currentPrueba = subjectToPruebaMap[activeSubject] || 'COMPETENCIA_LECTORA';
      
      console.log(`Generando ejercicio: skill=${currentSkill}, prueba=${currentPrueba}, subject=${activeSubject}`);
      
      // Mapeo de materias para generar ejercicios apropiados
      const subjectNames: Record<string, string> = {
        'general': 'comprensión general',
        'lectura': 'comprensión lectora',
        'matematicas-basica': 'matemáticas básicas (7° a 2° medio)',
        'matematicas-avanzada': 'matemáticas avanzadas (3° y 4° medio)',
        'ciencias': 'ciencias naturales',
        'historia': 'historia y ciencias sociales'
      };
      
      const subjectName = subjectNames[activeSubject] || activeSubject;
      
      // Usar openRouterService para generar el ejercicio
      const response = await openRouterService({
        action: 'generate_exercise',
        payload: {
          skill: currentSkill,
          prueba: currentPrueba,
          difficulty: 'INTERMEDIATE',
          subject: subjectName,
          includeExplanation: true
        }
      });
      
      if (response) {
        // Type-safe property access with fallbacks
        const question = (response as any)?.question || (response as any)?.response || 'Ejercicio generado';
        const options = (response as any)?.options || [
          'Opción A',
          'Opción B', 
          'Opción C',
          'Opción D'
        ];
        const correctAnswer = (response as any)?.correctAnswer || (response as any)?.options?.[0] || 'Opción A';
        const explanation = (response as any)?.explanation || 'Selecciona una opción para ver la explicación detallada.';
        
        // Crear ejercicio estructurado a partir de la respuesta
        const exercise: Exercise = {
          id: `exercise-${Date.now()}`,
          nodeId: '',
          nodeName: '',
          prueba: currentPrueba, // Usar la prueba correcta según la materia
          skill: currentSkill,
          difficulty: 'INTERMEDIATE',
          question,
          options,
          correctAnswer,
          explanation
        };
        
        console.log(`Ejercicio generado correctamente:`, {
          prueba: exercise.prueba,
          skill: exercise.skill,
          activeSubject,
          question: exercise.question.substring(0, 50) + '...'
        });
        
        setCurrentExercise(exercise);
        setActiveTab('exercise');
        
        // Notificar al usuario con la información correcta
        addAssistantMessage(`✅ He generado un nuevo ejercicio de ${subjectName} (${currentPrueba}) para ti. Puedes verlo en la pestaña de Ejercicios.`);
        
        console.log('Ejercicio generado exitosamente y sincronizado');
        return exercise;
      } else {
        throw new Error('No se recibió un ejercicio válido del servicio');
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
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, setActiveTab, addAssistantMessage, skillMap, subjectToPruebaMap]);
  
  // Función para solicitar ejercicio que retorna una promesa
  const handleExerciseRequest = useCallback(async (): Promise<boolean> => {
    try {
      const exercise = await handleNewExercise();
      return exercise !== null;
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
    skillMap,
    subjectToPruebaMap
  };
}
