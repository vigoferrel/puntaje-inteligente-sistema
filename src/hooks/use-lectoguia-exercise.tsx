
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad } from '@/types/system-types';
import { TLearningNode } from '@/types/lectoguia-types';
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
        previousExercises: [],
        includeVisualContent: true // Solicitar contenido visual si es posible
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
          difficulty: exercise.difficulty || difficulty,
          // Propiedades relacionadas con contenido visual
          imageUrl: exercise.imageUrl || undefined,
          graphData: exercise.graphData || undefined,
          visualType: exercise.visualType,
          hasVisualContent: !!exercise.imageUrl || !!exercise.graphData || !!exercise.hasVisualContent
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
  
  // Generar un ejercicio basado en un nodo de aprendizaje específico
  const generateExerciseForNode = async (node: TLearningNode): Promise<Exercise | null> => {
    try {
      // Obtener datos del nodo para generar un ejercicio más contextualizado
      const skill = node.skill;
      const difficulty = node.difficulty.toUpperCase();
      const prueba = node.prueba;
      
      console.log(`Generando ejercicio para nodo: ${node.id}, skill: ${skill}, dificultad: ${difficulty}`);
      
      // Generar un ejercicio usando OpenRouter con contexto del nodo
      const exercise = await callOpenRouter<Exercise>("generate_exercise", {
        skill,
        prueba,
        difficulty,
        nodeContext: {
          title: node.title,
          description: node.description,
          position: node.position
        },
        previousExercises: [],
        includeVisualContent: true // Solicitar contenido visual si es relevante para este nodo
      });

      if (exercise) {
        console.log("Ejercicio generado para nodo:", exercise);
        
        // Crear un objeto de ejercicio a partir de la respuesta
        const generatedExercise: Exercise = {
          id: exercise.id || uuidv4(),
          text: exercise.context || exercise.text || "",
          question: exercise.question || `¿Cuál es la respuesta correcta según el tema "${node.title}"?`,
          options: exercise.options || [
            "Opción A",
            "Opción B", 
            "Opción C",
            "Opción D"
          ],
          correctAnswer: exercise.correctAnswer || exercise.options?.[0] || "Opción A",
          explanation: exercise.explanation || "No se proporcionó explicación.",
          skill: skill,
          difficulty: difficulty,
          nodeId: node.id,
          // Propiedades relacionadas con contenido visual
          imageUrl: exercise.imageUrl || undefined,
          graphData: exercise.graphData || undefined,
          visualType: exercise.visualType,
          hasVisualContent: !!exercise.imageUrl || !!exercise.graphData || !!exercise.hasVisualContent
        };
        
        // Actualizar estado del ejercicio
        setCurrentExercise(generatedExercise);
        setSelectedOption(null);
        setShowFeedback(false);
        
        return generatedExercise;
      }
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
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
    generateExerciseForNode,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise
  };
}
