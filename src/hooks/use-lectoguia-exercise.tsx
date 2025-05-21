
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad } from '@/types/system-types';
import { useOpenRouter } from '@/hooks/use-openrouter';

export function useLectoGuiaExercise() {
  // Estado del ejercicio actual
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const { callOpenRouter } = useOpenRouter();
  
  // Generar un ejercicio
  const generateExercise = async (
    skill: TPAESHabilidad = "INTERPRET_RELATE",
    difficulty: string = "INTERMEDIATE"
  ): Promise<Exercise | null> => {
    try {
      // Generar un ejercicio usando OpenRouter
      const exercise = await callOpenRouter<Exercise>("generate_exercise", {
        skill,
        prueba: "COMPREHENSION_LECTORA",
        difficulty,
        previousExercises: []
      });

      if (exercise) {
        console.log("Ejercicio generado:", exercise);
        
        // Crear un objeto de ejercicio a partir de la respuesta
        const generatedExercise: Exercise = {
          id: exercise.id || uuidv4(),
          text: exercise.context || exercise.text || "",
          question: exercise.question || "¿Cuál es la idea principal del texto?",
          options: exercise.options || [
            "Opción A",
            "Opción B", 
            "Opción C",
            "Opción D"
          ],
          correctAnswer: exercise.correctAnswer || exercise.options?.[0] || "Opción A",
          explanation: exercise.explanation || "No se proporcionó explicación.",
          skill: exercise.skill || skill,
          difficulty: exercise.difficulty || difficulty
        };
        
        // Actualizar estado del ejercicio
        setCurrentExercise(generatedExercise);
        setSelectedOption(null);
        setShowFeedback(false);
        
        return generatedExercise;
      }
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      return null;
    }
  };
  
  // Manejar la selección de una opción en el ejercicio
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };
  
  // Resetear el estado del ejercicio
  const resetExercise = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise
  };
}
