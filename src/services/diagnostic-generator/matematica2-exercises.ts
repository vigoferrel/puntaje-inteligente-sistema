
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Exercise } from "@/types/ai-types";
import { getRandomMatematica2Questions, getMatematica2QuestionsByEje, getPAESMatematica2ExamCode } from "@/services/paes/paes-matematica2-service";
import { mapMatematica2QuestionToSkill } from "@/utils/paes-matematica2-mapper";

/**
 * Genera ejercicios de Matemática 2 PAES para un nodo específico
 */
export const generateMatematica2ExercisesForNode = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 5,
  eje: 'algebra' | 'geometria' | 'probabilidad' | 'calculo' = 'algebra'
): Promise<boolean> => {
  try {
    console.log(`🔄 Generando ${count} ejercicios de Matemática 2 para nodo: ${nodeId}`);
    
    // Obtener preguntas del eje específico
    const matematica2Questions = await getMatematica2QuestionsByEje(eje);
    
    if (!matematica2Questions || matematica2Questions.length === 0) {
      toast({
        title: "Error",
        description: "No se encontraron preguntas de Matemática 2 para este eje",
        variant: "destructive"
      });
      return false;
    }
    
    // Seleccionar preguntas aleatorias del eje
    const selectedQuestions = matematica2Questions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, matematica2Questions.length));
    
    // Convertir preguntas PAES a formato de ejercicios
    const exercisesData = selectedQuestions.map(question => {
      const correctOption = question.opciones.find(opt => opt.es_correcta);
      const habilidadPAES = mapMatematica2QuestionToSkill(question.numero);
      
      return {
        node_id: nodeId,
        test_id: testId,
        skill_id: skillId,
        question: question.enunciado + (question.contexto ? `\n\nContexto: ${question.contexto}` : ''),
        options: question.opciones.map(opt => opt.contenido),
        correct_answer: correctOption?.contenido || question.opciones[0].contenido,
        explanation: `Pregunta ${question.numero} del examen PAES Matemática 2 2024 (${getPAESMatematica2ExamCode()}) - Habilidad: ${habilidadPAES}`,
        difficulty: 'advanced' as const,
        bloom_level: 'aplicar' as const
      };
    });
    
    // Guardar los ejercicios en la base de datos
    for (const exerciseData of exercisesData) {
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);
      
      if (error) {
        console.error('Error al guardar ejercicio de Matemática 2:', error);
        toast({
          title: "Error",
          description: "Error al guardar un ejercicio de Matemática 2 en la base de datos",
          variant: "destructive"
        });
        return false;
      }
    }
    
    toast({
      title: "Éxito",
      description: `Se generaron ${exercisesData.length} ejercicios de Matemática 2 PAES para el nodo`,
    });
    
    console.log(`✅ Ejercicios de Matemática 2 generados exitosamente: ${exercisesData.length}`);
    return true;
    
  } catch (error) {
    console.error('Error al generar ejercicios de Matemática 2:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar los ejercicios de Matemática 2",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Genera ejercicios de Álgebra específicamente
 */
export const generateAlgebraExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateMatematica2ExercisesForNode(nodeId, skillId, testId, count, 'algebra');
};

/**
 * Genera ejercicios de Geometría específicamente
 */
export const generateGeometriaExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateMatematica2ExercisesForNode(nodeId, skillId, testId, count, 'geometria');
};

/**
 * Genera ejercicios de Probabilidad específicamente
 */
export const generateProbabilidadExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateMatematica2ExercisesForNode(nodeId, skillId, testId, count, 'probabilidad');
};

/**
 * Genera ejercicios de Cálculo específicamente
 */
export const generateCalculoExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateMatematica2ExercisesForNode(nodeId, skillId, testId, count, 'calculo');
};
