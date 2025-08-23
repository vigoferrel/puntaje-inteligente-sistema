
import { useState, useCallback } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { Exercise } from '@/types/ai-types';
import { toast } from '@/components/ui/use-toast';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { openRouterService } from '@/services/openrouter/core';
import { usePAESIntegration } from './use-paes-integration';

/**
 * Hook mejorado para flujo de ejercicios con integración PAES
 */
export function useEnhancedExerciseFlow(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseSource, setExerciseSource] = useState<'PAES' | 'AI' | null>(null);
  
  const { addAssistantMessage } = useLectoGuiaChat();
  const { generatePAESExercise, hasPAESContent } = usePAESIntegration();
  
  // Mapeo de materias a habilidades principales
  const skillMap: Record<string, TPAESHabilidad> = {
    'general': 'INTERPRET_RELATE',
    'lectura': 'INTERPRET_RELATE',
    'matematicas-basica': 'SOLVE_PROBLEMS',
    'matematicas-avanzada': 'MODEL',
    'ciencias': 'APPLY_PRINCIPLES',
    'historia': 'SOURCE_ANALYSIS'
  };

  // Mapeo de materias a pruebas PAES
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
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Logging mejorado para rastrear fuente
    const source = exerciseSource === 'PAES' ? 'oficial PAES' : 'generado por AI';
    console.log(`📝 Respuesta seleccionada en ejercicio ${source}: opción ${index + 1}`);
  }, [selectedOption, exerciseSource]);
  
  // Generar ejercicio usando IA tradicional
  const generateAIExercise = useCallback(async (skill: TPAESHabilidad, prueba: TPAESPrueba) => {
    try {
      const subjectNames: Record<string, string> = {
        'general': 'comprensión general',
        'lectura': 'comprensión lectora',
        'matematicas-basica': 'matemáticas básicas (7° a 2° medio)',
        'matematicas-avanzada': 'matemáticas avanzadas (3° y 4° medio)',
        'ciencias': 'ciencias naturales',
        'historia': 'historia y ciencias sociales'
      };
      
      const subjectName = subjectNames[activeSubject] || activeSubject;
      
      const response = await openRouterService({
        action: 'generate_exercise',
        payload: {
          skill,
          prueba,
          difficulty: 'INTERMEDIATE',
          subject: subjectName,
          includeExplanation: true
        }
      });
      
      if (response) {
        const question = (response as any)?.question || (response as any)?.response || 'Ejercicio generado';
        const options = (response as any)?.options || ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
        const correctAnswer = (response as any)?.correctAnswer || options[0];
        const explanation = (response as any)?.explanation || 'Selecciona una opción para ver la explicación.';
        
        return {
          id: `ai-exercise-${Date.now()}`,
          nodeId: '',
          nodeName: '',
          prueba,
          skill,
          difficulty: 'INTERMEDIATE',
          question,
          options,
          correctAnswer,
          explanation
        } as Exercise;
      }
      
      return null;
    } catch (error) {
      console.error('Error generando ejercicio con AI:', error);
      return null;
    }
  }, [activeSubject]);
  
  // Generar nuevo ejercicio (intenta PAES primero, luego AI)
  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log(`🎯 Generando ejercicio para ${activeSubject}`);
      
      // Limpiar estado
      setCurrentExercise(null);
      setSelectedOption(null);
      setShowFeedback(false);
      setExerciseSource(null);
      
      const currentSkill = skillMap[activeSubject] || 'INTERPRET_RELATE';
      const currentPrueba = subjectToPruebaMap[activeSubject] || 'COMPETENCIA_LECTORA';
      
      let exercise: Exercise | null = null;
      let source: 'PAES' | 'AI' = 'AI';
      
      // Intentar generar ejercicio PAES primero si está disponible
      if (hasPAESContent(activeSubject)) {
        console.log(`📚 Intentando generar ejercicio PAES oficial para ${activeSubject}`);
        exercise = await generatePAESExercise(activeSubject, currentSkill, currentPrueba);
        
        if (exercise) {
          source = 'PAES';
          console.log(`✅ Ejercicio PAES oficial generado`);
        }
      }
      
      // Si no hay ejercicio PAES, usar AI
      if (!exercise) {
        console.log(`🤖 Generando ejercicio con AI para ${activeSubject}`);
        exercise = await generateAIExercise(currentSkill, currentPrueba);
        source = 'AI';
      }
      
      if (exercise) {
        setCurrentExercise(exercise);
        setExerciseSource(source);
        setActiveTab('exercise');
        
        // Mensaje diferenciado según la fuente
        const sourceMessage = source === 'PAES' 
          ? '✅ He generado un ejercicio oficial de PAES'
          : '✅ He generado un ejercicio personalizado';
          
        addAssistantMessage(
          `${sourceMessage} de ${subjectToPruebaMap[activeSubject]} para ti. ` +
          `Puedes verlo en la pestaña de Ejercicios.`
        );
        
        return exercise;
      } else {
        throw new Error('No se pudo generar ningún ejercicio');
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
  }, [activeSubject, hasPAESContent, generatePAESExercise, generateAIExercise, setActiveTab, addAssistantMessage, skillMap, subjectToPruebaMap]);
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    setIsLoading,
    setCurrentExercise,
    exerciseSource,
    skillMap,
    subjectToPruebaMap
  };
}
