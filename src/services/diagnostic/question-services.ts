
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticQuestion } from '@/types/diagnostic';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

export async function fetchQuestionById(questionId: string): Promise<DiagnosticQuestion | null> {
  try {
    // Usamos la tabla correcta de diagnostic_tests y aceptamos que la respuesta sea transformada
    const { data, error } = await supabase
      .from('diagnostic_tests')
      .select('*, questions:exercises(id, question, options, correct_answer, skill, prueba, explanation)')
      .eq('id', questionId)
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.questions || !data.questions[0]) return null;
    
    // Mapear los datos al formato DiagnosticQuestion
    const question = data.questions[0];
    return {
      id: question.id,
      question: question.question,
      options: Array.isArray(question.options) ? question.options : JSON.parse(question.options || '[]'),
      correctAnswer: question.correct_answer,
      skill: question.skill as TPAESHabilidad,
      prueba: question.prueba as TPAESPrueba,
      explanation: question.explanation
    };
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

export async function fetchQuestionsByIds(
  questionIds: string[]
): Promise<DiagnosticQuestion[]> {
  try {
    if (!questionIds || questionIds.length === 0) {
      return [];
    }
    
    // Usamos la tabla correcta exercises para obtener las preguntas
    const { data, error } = await supabase
      .from('exercises')
      .select('id, question, options, correct_answer, skill, prueba, explanation')
      .in('id', questionIds);

    if (error) throw error;
    
    if (!data) return [];
    
    // Transformar los datos al formato DiagnosticQuestion
    return data.map(item => ({
      id: item.id,
      question: item.question,
      options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
      correctAnswer: item.correct_answer,
      skill: item.skill as TPAESHabilidad,
      prueba: item.prueba as TPAESPrueba,
      explanation: item.explanation
    }));
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    return [];
  }
}

// Implementar la función que realmente se usa en otras partes del código
export async function fetchDiagnosticQuestions(
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> {
  try {
    // Primero intentamos obtener preguntas para el diagnóstico específico
    const { data, error } = await supabase
      .from('exercises')
      .select('id, question, options, correct_answer, skill, prueba, explanation')
      .eq('diagnostic_id', diagnosticId)
      .eq('prueba', testId)
      .order('id');
    
    if (error) {
      console.error('Error fetching diagnostic questions:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // Fallback: fetch questions just by test ID if none found for specific diagnostic
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('exercises')
        .select('id, question, options, correct_answer, skill, prueba, explanation')
        .eq('prueba', testId)
        .order('id');
        
      if (fallbackError) {
        console.error('Error fetching fallback questions:', fallbackError);
        return [];
      }
      
      if (!fallbackData) return [];
      
      // Transformar los datos al formato DiagnosticQuestion
      return fallbackData.map(item => ({
        id: item.id,
        question: item.question,
        options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
        correctAnswer: item.correct_answer,
        skill: item.skill as TPAESHabilidad,
        prueba: item.prueba as TPAESPrueba,
        explanation: item.explanation
      }));
    }
    
    // Transformar los datos al formato DiagnosticQuestion
    return data.map(item => ({
      id: item.id,
      question: item.question,
      options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
      correctAnswer: item.correct_answer,
      skill: item.skill as TPAESHabilidad,
      prueba: item.prueba as TPAESPrueba,
      explanation: item.explanation
    }));
  } catch (error) {
    console.error('Error in fetchDiagnosticQuestions:', error);
    return [];
  }
}
