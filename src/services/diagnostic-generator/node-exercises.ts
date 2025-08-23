
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Exercise } from "@/types/ai-types";
import { mapSkillIdToEnum } from "@/utils/supabase-mappers";
import { generateExercisesBatch } from "@/services/openrouter-service";
import { mapDifficulty } from "./difficulty-mapper";

/**
 * Genera una serie de ejercicios para un nodo específico y los guarda en la base de datos
 */
export const generateExercisesForNode = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 5
): Promise<boolean> => {
  try {
    // Convertir IDs numéricos a los enums usados en la aplicación
    const skill = mapSkillIdToEnum(skillId);
    
    // Generar los ejercicios usando OpenRouter
    const exercises = await generateExercisesBatch(
      nodeId,
      skill,
      testId,
      count,
      'MIXED' // Mezcla de dificultades
    );
    
    if (!exercises || exercises.length === 0) {
      toast({
        title: "Error",
        description: "No se pudieron generar los ejercicios para el nodo",
        variant: "destructive"
      });
      return false;
    }
    
    // Convertir los ejercicios al formato de la base de datos y asegurar que difficulty sea compatible
    const exercisesData = exercises.map(exercise => {
      // Mapear el string de dificultad a uno de los valores permitidos
      const mappedDifficulty = mapDifficulty(exercise.difficulty || 'intermediate');
      
      return {
        node_id: nodeId,
        test_id: testId,
        skill_id: skillId,
        question: exercise.question,
        options: exercise.options, // Supabase convierte arrays a JSON automáticamente
        correct_answer: exercise.correctAnswer,
        explanation: exercise.explanation || '',
        difficulty: mappedDifficulty
      };
    });
    
    // Guardar los ejercicios en la base de datos uno a uno
    for (const exerciseData of exercisesData) {
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);
      
      if (error) {
        console.error('Error al guardar el ejercicio:', error);
        toast({
          title: "Error",
          description: "Error al guardar un ejercicio en la base de datos",
          variant: "destructive"
        });
        return false;
      }
    }
    
    toast({
      title: "Éxito",
      description: `Se generaron ${exercises.length} ejercicios para el nodo`,
    });
    
    return true;
  } catch (error) {
    console.error('Error al generar ejercicios para el nodo:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar los ejercicios",
      variant: "destructive"
    });
    return false;
  }
};
