
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Exercise } from "@/types/ai-types";
import { 
  getRandomCienciasTPQuestions, 
  getCienciasTPQuestionsByArea, 
  getPAESCienciasTPExamCode 
} from "@/services/paes/paes-ciencias-tp-service";
import { mapCienciasTPQuestionToSkill } from "@/utils/paes-ciencias-tp-mapper";

/**
 * Genera ejercicios de Ciencias TP PAES para un nodo específico
 */
export const generateCienciasTPExercisesForNode = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 5,
  area: 'BIOLOGIA' | 'FISICA' | 'QUIMICA' = 'BIOLOGIA'
): Promise<boolean> => {
  try {
    console.log(`🔄 Generando ${count} ejercicios de Ciencias TP para nodo: ${nodeId}, área: ${area}`);
    
    const cienciasTPQuestions = await getCienciasTPQuestionsByArea(area);
    
    if (!cienciasTPQuestions || cienciasTPQuestions.length === 0) {
      toast({
        title: "Error",
        description: `No se encontraron preguntas de ${area} en Ciencias TP`,
        variant: "destructive"
      });
      return false;
    }
    
    const validQuestions = cienciasTPQuestions.filter(q => !q.es_piloto);
    const selectedQuestions = validQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, validQuestions.length));
    
    const exercisesData = selectedQuestions.map(question => {
      const correctOption = question.opciones.find(opt => opt.es_correcta);
      const habilidadPAES = mapCienciasTPQuestionToSkill(question.numero, question.area_cientifica);
      
      return {
        node_id: nodeId,
        test_id: testId,
        skill_id: skillId,
        question: question.enunciado + (question.contexto ? `\n\nContexto: ${question.contexto}` : ''),
        options: question.opciones.map(opt => opt.contenido),
        correct_answer: correctOption?.contenido || question.opciones[0].contenido,
        explanation: `Pregunta ${question.numero} del examen PAES Ciencias TP 2024 (${getPAESCienciasTPExamCode()}) - Área: ${question.area_cientifica} - Módulo: ${question.modulo} - Habilidad: ${habilidadPAES}`,
        difficulty: 'advanced' as const,
        bloom_level: 'aplicar' as const
      };
    });
    
    for (const exerciseData of exercisesData) {
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);
      
      if (error) {
        console.error('Error al guardar ejercicio de Ciencias TP:', error);
        toast({
          title: "Error",
          description: "Error al guardar un ejercicio de Ciencias TP en la base de datos",
          variant: "destructive"
        });
        return false;
      }
    }
    
    toast({
      title: "Éxito",
      description: `Se generaron ${exercisesData.length} ejercicios de ${area} PAES Ciencias TP para el nodo`,
    });
    
    console.log(`✅ Ejercicios de Ciencias TP (${area}) generados exitosamente: ${exercisesData.length}`);
    return true;
    
  } catch (error) {
    console.error('Error al generar ejercicios de Ciencias TP:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar los ejercicios de Ciencias TP",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Genera ejercicios de Biología específicamente
 */
export const generateBiologiaExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateCienciasTPExercisesForNode(nodeId, skillId, testId, count, 'BIOLOGIA');
};

/**
 * Genera ejercicios de Física específicamente
 */
export const generateFisicaExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateCienciasTPExercisesForNode(nodeId, skillId, testId, count, 'FISICA');
};

/**
 * Genera ejercicios de Química específicamente
 */
export const generateQuimicaExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateCienciasTPExercisesForNode(nodeId, skillId, testId, count, 'QUIMICA');
};

/**
 * Genera ejercicios mixtos de Ciencias TP (todas las áreas)
 */
export const generateCienciasTPMixedExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 9
): Promise<boolean> => {
  try {
    const biologiaCount = Math.ceil(count * 0.35); // 35% Biología (28/80)
    const fisicaCount = Math.ceil(count * 0.325); // 32.5% Física (26/80)
    const quimicaCount = count - biologiaCount - fisicaCount; // Resto Química (26/80)
    
    const biologiaSuccess = await generateBiologiaExercises(nodeId, skillId, testId, biologiaCount);
    const fisicaSuccess = await generateFisicaExercises(nodeId, skillId, testId, fisicaCount);
    const quimicaSuccess = await generateQuimicaExercises(nodeId, skillId, testId, quimicaCount);
    
    return biologiaSuccess && fisicaSuccess && quimicaSuccess;
  } catch (error) {
    console.error('Error generating mixed Ciencias TP exercises:', error);
    return false;
  }
};
