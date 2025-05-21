
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { mapTestIdToEnum } from "@/utils/supabase-mappers";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Función para obtener preguntas de diagnóstico por ID de prueba.
 * Intenta obtener las preguntas desde Supabase, si no hay datos, genera preguntas de muestra.
 */
export const fetchDiagnosticQuestions = async (
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> => {
  try {
    // Intentar obtener datos reales desde la base de datos usando RPC
    const { data, error } = await supabase.rpc(
      'get_diagnostic_questions', 
      { 
        p_diagnostic_id: diagnosticId 
      }
    );

    if (error) {
      console.error('Error al obtener preguntas de diagnóstico:', error);
      throw error;
    }

    // Si no hay datos o la función RPC no existe, usar datos de muestra
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log('No se encontraron preguntas, generando datos de muestra');
      return generateMockQuestions(diagnosticId, testId);
    }

    // Mapear los datos al formato esperado
    if (Array.isArray(data)) {
      return data.map((q: any) => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        skill: q.skill as TPAESHabilidad,
        prueba: mapTestIdToEnum(testId),
        explanation: q.explanation || undefined
      }));
    }

    // Si llegamos aquí, el formato de datos no es el esperado
    console.warn('Formato de datos inesperado, usando datos de muestra');
    return generateMockQuestions(diagnosticId, testId);
  } catch (error) {
    console.error('Error en fetchDiagnosticQuestions:', error);
    // Fallback a datos de muestra en caso de error
    return generateMockQuestions(diagnosticId, testId);
  }
};

// Función auxiliar para generar preguntas de muestra
function generateMockQuestions(diagnosticId: string, testId: number): DiagnosticQuestion[] {
  const testType = mapTestIdToEnum(testId);
  const skills: TPAESHabilidad[] = [
    "TRACK_LOCATE", "INTERPRET_RELATE", "EVALUATE_REFLECT"
  ];

  // Crear 10 preguntas de muestra por diagnóstico
  return Array.from({ length: 10 }).map((_, index) => {
    const questionNumber = index + 1;
    const mockSkill = skills[index % skills.length];
    
    return {
      id: `q-${diagnosticId}-${questionNumber}`,
      question: `Pregunta ${questionNumber} del test de ${testType}`,
      options: [
        `Opción A para pregunta ${questionNumber}`,
        `Opción B para pregunta ${questionNumber}`,
        `Opción C para pregunta ${questionNumber}`,
        `Opción D para pregunta ${questionNumber}`
      ],
      correctAnswer: `Opción ${String.fromCharCode(65 + (index % 4))} para pregunta ${questionNumber}`,
      skill: mockSkill,
      prueba: testType,
      explanation: `Explicación de la pregunta ${questionNumber}`
    };
  });
}
