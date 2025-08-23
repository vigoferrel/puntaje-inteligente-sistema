
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Exercise } from "@/types/ai-types";
import { getRandomHistoriaQuestions, getHistoriaQuestionsBySection, getPAESHistoriaExamCode } from "@/services/paes/paes-historia-service";
import { mapHistoriaQuestionToSkill } from "@/utils/paes-historia-mapper";

/**
 * Genera ejercicios de Historia PAES para un nodo específico
 */
export const generateHistoriaExercisesForNode = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 5,
  section: 'formacion_ciudadana' | 'historia' | 'sistema_economico' = 'historia'
): Promise<boolean> => {
  try {
    console.log(`🔄 Generando ${count} ejercicios de Historia para nodo: ${nodeId}`);
    
    // Determinar rango de preguntas según la sección
    let startQuestion = 1;
    let endQuestion = 65;
    
    switch (section) {
      case 'formacion_ciudadana':
        startQuestion = 1;
        endQuestion = 12;
        break;
      case 'historia':
        startQuestion = 13;
        endQuestion = 57;
        break;
      case 'sistema_economico':
        startQuestion = 58;
        endQuestion = 65;
        break;
    }
    
    // Obtener preguntas de la sección específica
    const historiaQuestions = await getHistoriaQuestionsBySection(startQuestion, endQuestion);
    
    if (!historiaQuestions || historiaQuestions.length === 0) {
      toast({
        title: "Error",
        description: "No se encontraron preguntas de Historia para esta sección",
        variant: "destructive"
      });
      return false;
    }
    
    // Seleccionar preguntas aleatorias de la sección
    const selectedQuestions = historiaQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, historiaQuestions.length));
    
    // Convertir preguntas PAES a formato de ejercicios
    const exercisesData = selectedQuestions.map(question => {
      const correctOption = question.opciones.find(opt => opt.es_correcta);
      const habilidadPAES = mapHistoriaQuestionToSkill(question.numero);
      
      return {
        node_id: nodeId,
        test_id: testId,
        skill_id: skillId,
        question: question.enunciado + (question.contexto ? `\n\nContexto: ${question.contexto}` : ''),
        options: question.opciones.map(opt => opt.contenido),
        correct_answer: correctOption?.contenido || question.opciones[0].contenido,
        explanation: `Pregunta ${question.numero} del examen PAES Historia y Ciencias Sociales 2024 (${getPAESHistoriaExamCode()}) - Habilidad: ${habilidadPAES}`,
        difficulty: 'intermediate' as const,
        bloom_level: 'comprender' as const
      };
    });
    
    // Guardar los ejercicios en la base de datos
    for (const exerciseData of exercisesData) {
      const { error } = await supabase
        .from('exercises')
        .insert(exerciseData);
      
      if (error) {
        console.error('Error al guardar ejercicio de Historia:', error);
        toast({
          title: "Error",
          description: "Error al guardar un ejercicio de Historia en la base de datos",
          variant: "destructive"
        });
        return false;
      }
    }
    
    toast({
      title: "Éxito",
      description: `Se generaron ${exercisesData.length} ejercicios de Historia PAES para el nodo`,
    });
    
    console.log(`✅ Ejercicios de Historia generados exitosamente: ${exercisesData.length}`);
    return true;
    
  } catch (error) {
    console.error('Error al generar ejercicios de Historia:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al generar los ejercicios de Historia",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Genera ejercicios de Formación Ciudadana específicamente
 */
export const generateFormacionCiudadanaExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateHistoriaExercisesForNode(nodeId, skillId, testId, count, 'formacion_ciudadana');
};

/**
 * Genera ejercicios de Sistema Económico específicamente
 */
export const generateSistemaEconomicoExercises = async (
  nodeId: string,
  skillId: number,
  testId: number,
  count: number = 3
): Promise<boolean> => {
  return await generateHistoriaExercisesForNode(nodeId, skillId, testId, count, 'sistema_economico');
};
