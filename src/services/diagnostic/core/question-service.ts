
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Servicio modular para gestión de preguntas diagnósticas
 */

// Función segura para parsear opciones desde Json[]
export const safeParseOptions = (options: any): string[] => {
  if (Array.isArray(options)) {
    return options.map((option: any) => {
      if (typeof option === 'string') return option;
      if (typeof option === 'object' && option !== null) {
        return option.contenido || option.text || option.label || 'Opción';
      }
      return String(option);
    });
  }
  
  if (typeof options === 'object' && options !== null) {
    return Object.values(options).map(val => String(val));
  }
  
  return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
};

export const fetchTestQuestions = async (testId: string): Promise<DiagnosticQuestion[]> => {
  try {
    const { data: exercises, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('diagnostic_id', testId)
      .limit(15);

    if (error || !exercises) {
      console.warn('⚠️ No se encontraron preguntas para test:', testId);
      return [];
    }

    return exercises.map(exercise => ({
      id: exercise.id || `q-${Date.now()}-${Math.random()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: safeParseOptions(exercise.options),
      correctAnswer: exercise.correct_answer || 'Opción A',
      skill: 'INTERPRET_RELATE' as TPAESHabilidad,
      prueba: 'COMPETENCIA_LECTORA',
      explanation: exercise.explanation || '',
      difficulty: 'intermediate'
    }));
  } catch (error) {
    console.error('❌ Error cargando preguntas:', error);
    return [];
  }
};

export const validateQuestionData = (question: any): boolean => {
  return !!(
    question.id &&
    question.question &&
    question.options &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    question.correctAnswer
  );
};
