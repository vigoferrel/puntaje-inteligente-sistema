
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticQuestion } from '@/types/diagnostic';
import { TPAESPrueba } from '@/types/system-types';
import { RawExerciseData } from './types';
import { mapExerciseToQuestion } from './mappers';

/**
 * Fetches a question by its ID
 */
export async function fetchQuestionById(questionId: string): Promise<DiagnosticQuestion | null> {
  try {
    // Query directly from exercises table
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', questionId)
      .maybeSingle();

    if (error) throw error;
    
    // Check if we got data back
    if (!data) return null;
    
    // Transform the raw DB data into our DiagnosticQuestion type
    return mapExerciseToQuestion(data as RawExerciseData);
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

/**
 * Fetches questions by an array of IDs
 */
export async function fetchQuestionsByIds(
  questionIds: string[]
): Promise<DiagnosticQuestion[]> {
  try {
    if (!questionIds || questionIds.length === 0) {
      return [];
    }
    
    // Query from exercises table
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .in('id', questionIds);

    if (error) throw error;
    
    if (!data || !Array.isArray(data)) return [];
    
    // Transform each row into a DiagnosticQuestion
    return data.map(exercise => mapExerciseToQuestion(exercise as RawExerciseData));
  } catch (error) {
    console.error('Error fetching questions by IDs:', error);
    return [];
  }
}

/**
 * Fetches diagnostic questions for a specific diagnostic and test
 */
export async function fetchDiagnosticQuestions(
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> {
  try {
    // First try to get exercises for the specific diagnostic
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('diagnostic_id', diagnosticId)
      .eq('prueba', testId)
      .order('id');
    
    if (error) {
      console.error('Error fetching diagnostic questions:', error);
      throw error;
    }
    
    // If no specific diagnostic questions found, fall back to general test exercises
    if (!data || !Array.isArray(data) || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('exercises')
        .select('*')
        .eq('prueba', testId)
        .order('id');
        
      if (fallbackError) {
        console.error('Error fetching fallback questions:', fallbackError);
        return [];
      }
      
      if (!fallbackData || !Array.isArray(fallbackData)) return [];
      
      // Map the fallback data
      return fallbackData.map(exercise => mapExerciseToQuestion(exercise as RawExerciseData));
    }
    
    // Map the data
    return data.map(exercise => mapExerciseToQuestion(exercise as RawExerciseData));
  } catch (error) {
    console.error('Error in fetchDiagnosticQuestions:', error);
    return [];
  }
}
