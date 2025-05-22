
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useLectoGuiaExercise } from '@/hooks/use-lectoguia-exercise';
import { useLectoGuiaSession } from '@/hooks/use-lectoguia-session';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { SUBJECT_TO_PRUEBA_MAP } from '@/hooks/lectoguia/use-subjects';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook para gestionar el flujo de ejercicios en LectoGuia
 * Con mejor manejo de errores y feedback visual
 */
export function useExerciseFlow(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  const { addAssistantMessage } = useLectoGuiaChat();
  const { saveExerciseAttempt } = useLectoGuiaSession();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    resetExercise,
    handleOptionSelect: selectOption,
    isLoading
  } = useLectoGuiaExercise();
  
  // Mapeo específico de materias a habilidades PAES principales
  const skillMap: Record<string, TPAESHabilidad> = {
    'lectura': 'TRACK_LOCATE',
    'matematicas-basica': 'SOLVE_PROBLEMS',    // Matemáticas 1 (7° a 2° medio)
    'matematicas-avanzada': 'MODEL',           // Matemáticas 2 (3° y 4° medio)
    'ciencias': 'IDENTIFY_THEORIES',
    'historia': 'TEMPORAL_THINKING',
    'general': 'INTERPRET_RELATE'
  };
  
  // Obtener el tipo de prueba PAES correspondiente a la materia actual
  const getCurrentPrueba = (): TPAESPrueba => {
    return SUBJECT_TO_PRUEBA_MAP[activeSubject] || 'COMPETENCIA_LECTORA';
  };
  
  // Generar un ejercicio según la materia actual con mejor manejo de errores
  const handleExerciseRequest = async () => {
    try {
      setIsGenerating(true);
      
      // Mostrar toast de carga
      toast({
        title: "Generando ejercicio",
        description: "Estamos preparando un ejercicio para ti...",
      });
      
      const skill = skillMap[activeSubject];
      const prueba = getCurrentPrueba();
      
      console.log(`Generando ejercicio para materia: ${activeSubject}, skill: ${skill}, prueba: ${prueba}`);
      
      const exercise = await generateExercise(skill, prueba);
      
      if (exercise) {
        setTimeout(() => setActiveTab("exercise"), 500);
        
        // Mensaje de éxito
        toast({
          title: "Ejercicio generado",
          description: "Se ha creado un nuevo ejercicio para ti.",
        });
        
        // Agregar mensaje del asistente sobre el ejercicio generado
        addAssistantMessage(
          `He preparado un ejercicio de ${getCurrentSubjectDisplayName()} para ti. ` +
          `Es un ejercicio de dificultad ${exercise.difficulty || "intermedia"} que evalúa la habilidad de ` +
          `${exercise.skill || "interpretación"}. Puedes resolverlo en la pestaña de Ejercicios.`
        );
        return true;
      } else {
        // Mensaje de error específico para cuando no se pudo generar el ejercicio
        toast({
          title: "Error",
          description: "No se pudo generar el ejercicio. Inténtalo de nuevo.",
          variant: "destructive"
        });
        
        addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. Por favor, inténtalo más tarde.");
        return false;
      }
    } catch (error) {
      console.error("Error en handleExerciseRequest:", error);
      
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el ejercicio. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      
      addAssistantMessage("Lo siento, ha ocurrido un error al intentar generar el ejercicio. Por favor, inténtalo de nuevo más tarde.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Obtener el nombre de la materia actual para mostrar
  const getCurrentSubjectDisplayName = (): string => {
    const subjectNames: Record<string, string> = {
      'general': 'comprensión lectora',
      'lectura': 'comprensión lectora',
      'matematicas-basica': 'matemáticas para 7° a 2° medio',
      'matematicas-avanzada': 'matemáticas para 3° y 4° medio',
      'ciencias': 'ciencias',
      'historia': 'historia'
    };
    
    return subjectNames[activeSubject] || activeSubject;
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
        
        // Utilizar la prueba del ejercicio si está presente, o determinarla según la materia activa
        const prueba = currentExercise.prueba || getCurrentPrueba();
        
        console.log(`Guardando ejercicio con prueba: ${prueba}, materia: ${activeSubject}`);
        
        saveExerciseAttempt(
          currentExercise,
          index,
          isCorrect,
          currentExercise.skill || skillMap[activeSubject],
          prueba
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
    getCurrentPrueba,
    skillMap,
    isLoading: isLoading || isGenerating
  };
}
