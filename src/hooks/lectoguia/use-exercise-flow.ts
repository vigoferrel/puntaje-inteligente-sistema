
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useLectoGuiaExercise } from '@/hooks/use-lectoguia-exercise';
import { useLectoGuiaSession } from '@/hooks/use-lectoguia-session';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
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
  
  // Mapeo de materias a habilidades
  const skillMap: Record<string, TPAESHabilidad> = {
    'lectura': 'TRACK_LOCATE',
    'matematicas-basica': 'SOLVE_PROBLEMS',
    'matematicas-avanzada': 'SOLVE_PROBLEMS',
    'ciencias': 'IDENTIFY_THEORIES',
    'historia': 'TEMPORAL_THINKING',
    'general': 'INTERPRET_RELATE'
  };
  
  // Mapeo de materias a pruebas PAES
  const pruebaMap: Record<string, TPAESPrueba> = {
    'lectura': 'COMPETENCIA_LECTORA',
    'matematicas-basica': 'MATEMATICA_1',      // 7° a 2° medio
    'matematicas-avanzada': 'MATEMATICA_2',    // 3° y 4° medio
    'ciencias': 'CIENCIAS',
    'historia': 'HISTORIA',
    'general': 'COMPETENCIA_LECTORA'
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
      const prueba = pruebaMap[activeSubject];
      
      console.log(`Generando ejercicio para materia: ${activeSubject}, skill: ${skill}, prueba: ${prueba}`);
      
      const exercise = await generateExercise(skill, prueba);
      
      if (exercise) {
        setTimeout(() => setActiveTab("exercise"), 500);
        
        // Mensaje de éxito
        toast({
          title: "Ejercicio generado",
          description: "Se ha creado un nuevo ejercicio para ti.",
        });
        
        // Determinar el nombre de la materia para el mensaje
        let materiaName = activeSubject === 'general' ? 'comprensión lectora' : 
          activeSubject === 'matematicas-basica' ? 'matemáticas para 7° a 2° medio' :
          activeSubject === 'matematicas-avanzada' ? 'matemáticas para 3° y 4° medio' :
          activeSubject;
        
        // Agregar mensaje del asistente sobre el ejercicio generado
        addAssistantMessage(
          `He preparado un ejercicio de ${materiaName} para ti. ` +
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
    skillMap,
    isLoading: isLoading || isGenerating
  };
}
