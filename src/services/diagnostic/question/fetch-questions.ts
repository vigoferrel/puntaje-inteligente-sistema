
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from '@/types/diagnostic';
import { mapExerciseToQuestion } from '../mappers';

/**
 * Fetch diagnostic questions from Supabase for a specific diagnostic test
 */
export const fetchDiagnosticQuestions = async (
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> => {
  try {
    // Use explicit typing to avoid excessive type inference
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('diagnostic_id', diagnosticId);

    if (error) throw error;
    
    // Convert the database format to our application format using our mapper
    return data ? data.map(item => mapExerciseToQuestion(item, testId)) : [];
  } catch (error) {
    console.error('Error fetching diagnostic questions:', error);
    return [];
  }
};

/**
 * Fetch a batch of questions for a specific test
 */
export const fetchQuestionBatch = async (
  testId: string,
  batchSize: number = 10,
  previousQuestions: string[] = []
): Promise<DiagnosticQuestion[]> => {
  try {
    // Using a more direct approach to avoid type instantiation issues
    let query = supabase
      .from('exercises')
      .select('*')
      .eq('test_id', testId);
      
    if (previousQuestions.length > 0) {
      query = query.not('id', 'in', `(${previousQuestions.join(',')})`);
    }
    
    query = query.limit(batchSize);

    // Use explicit typing to avoid deep inference
    const { data, error } = await query;

    if (error) throw error;
    
    // Use our mapper to convert database records to DiagnosticQuestion objects
    return data ? data.map(item => mapExerciseToQuestion(item, Number(testId))) : [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

/**
 * Get a single question by ID
 */
export const getQuestionById = async (questionId: string): Promise<DiagnosticQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Use our mapper to convert the database record
    return mapExerciseToQuestion(data);
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
};
