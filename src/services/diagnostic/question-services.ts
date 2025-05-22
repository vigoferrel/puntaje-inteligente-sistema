
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticQuestion } from '@/types/diagnostic';

export async function fetchQuestionById(questionId: string): Promise<DiagnosticQuestion | null> {
  try {
    // Using the correct table name from the database
    const { data, error } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) throw error;
    if (!data) return null;
    
    return data as DiagnosticQuestion;
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
    
    // Using the correct table name from the database
    const { data, error } = await supabase
      .from('diagnostic_questions')
      .select('*')
      .in('id', questionIds);

    if (error) throw error;
    
    return (data || []) as DiagnosticQuestion[];
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    return [];
  }
}

// Add the missing exported function that was being imported by other files
export async function fetchDiagnosticQuestions(
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> {
  try {
    // Get questions for specific diagnostic test from the database
    const { data, error } = await supabase
      .from('diagnostic_questions')
      .select('*')
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
        .from('diagnostic_questions')
        .select('*')
        .eq('prueba', testId)
        .order('id');
        
      if (fallbackError) {
        console.error('Error fetching fallback questions:', fallbackError);
        return [];
      }
      
      return (fallbackData || []) as unknown as DiagnosticQuestion[];
    }
    
    return data as unknown as DiagnosticQuestion[];
  } catch (error) {
    console.error('Error in fetchDiagnosticQuestions:', error);
    return [];
  }
}
