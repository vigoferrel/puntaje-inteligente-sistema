
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { TLearningNode } from '@/types/lectoguia-types';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook para manejar la generación de ejercicios
 */
export function useExerciseGeneration() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { callOpenRouter } = useOpenRouter();
  
  // Generar un ejercicio básico
  const generateExercise = async (
    skill: TPAESHabilidad = "INTERPRET_RELATE",
    prueba: TPAESPrueba = "COMPETENCIA_LECTORA",
    difficulty: string = "INTERMEDIATE"
  ): Promise<Exercise | null> => {
    try {
      setIsLoading(true);
      console.log(`Generando ejercicio para skill: ${skill}, prueba: ${prueba}, dificultad: ${difficulty}`);
      
      // Generar un ejercicio usando OpenRouter con el tipo de prueba correcto
      const exercise = await callOpenRouter<Exercise>("generate_exercise", {
        skill,
        prueba, // Usar el tipo de prueba proporcionado
        difficulty,
        previousExercises: [],
        includeVisualContent: true
      });

      if (exercise) {
        console.log("Ejercicio generado con éxito:", exercise);
        
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
          prueba: exercise.prueba || prueba, // Guardar el tipo de prueba en el ejercicio
          difficulty: exercise.difficulty || difficulty,
          imageUrl: exercise.imageUrl || undefined,
          graphData: exercise.graphData || undefined,
          visualType: exercise.visualType,
          hasVisualContent: !!exercise.imageUrl || !!exercise.graphData || !!exercise.hasVisualContent
        };
        
        // Actualizar estado del ejercicio
        setCurrentExercise(generatedExercise);
        return generatedExercise;
      } else {
        console.error("La respuesta de OpenRouter no contiene datos de ejercicio");
        toast({
          title: "Error",
          description: "No se pudo generar el ejercicio. La respuesta está vacía.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el ejercicio. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generar un ejercicio basado en un nodo de aprendizaje específico
  const generateExerciseForNode = async (node: TLearningNode): Promise<Exercise | null> => {
    try {
      setIsLoading(true);
      // Obtener datos del nodo para generar un ejercicio más contextualizado
      const skill = node.skill;
      const difficulty = node.difficulty.toUpperCase();
      const prueba = node.prueba;
      
      console.log(`Generando ejercicio para nodo: ${node.id}, skill: ${skill}, prueba: ${prueba}, dificultad: ${difficulty}`);
      
      // Generar un ejercicio usando OpenRouter con contexto del nodo y el valor correcto de prueba
      const exercise = await callOpenRouter<Exercise>("generate_exercise", {
        skill,
        prueba, // Usar el valor directamente del nodo
        difficulty,
        nodeContext: {
          title: node.title,
          description: node.description,
          position: node.position
        },
        previousExercises: [],
        includeVisualContent: true
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
          prueba: prueba, // Guardar el tipo de prueba en el ejercicio
          difficulty: difficulty,
          nodeId: node.id,
          imageUrl: exercise.imageUrl || undefined,
          graphData: exercise.graphData || undefined,
          visualType: exercise.visualType,
          hasVisualContent: !!exercise.imageUrl || !!exercise.graphData || !!exercise.hasVisualContent
        };
        
        // Actualizar estado del ejercicio
        setCurrentExercise(generatedExercise);
        return generatedExercise;
      } else {
        console.error("La respuesta de OpenRouter para el nodo no contiene datos de ejercicio");
        toast({
          title: "Error",
          description: "No se pudo generar el ejercicio para este nodo. La respuesta está vacía.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al generar el ejercicio para este nodo. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode,
    isLoading
  };
}
