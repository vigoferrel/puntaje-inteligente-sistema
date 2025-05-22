
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from '@/types/diagnostic';
import { mapExerciseToQuestion } from '../mappers';
import { RawExerciseData } from '../types';

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
      .eq('diagnostic_id', diagnosticId)
      .returns<RawExerciseData[]>();

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
    const { data, error } = await query.returns<RawExerciseData[]>();

    if (error) throw error;
    
    // Convert string testId to number for the mapper function
    const numericTestId = Number(testId);
    
    // Use our mapper to convert database records to DiagnosticQuestion objects
    return data ? data.map(item => mapExerciseToQuestion(item, numericTestId)) : [];
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
      .single()
      .returns<RawExerciseData>();

    if (error) throw error;
    
    if (!data) return null;
    
    // Extract the test_id from the data and convert it to a number
    const testId = data.test_id ? Number(data.test_id) : undefined;
    
    // Use our mapper to convert the database record, passing testId as a number
    return mapExerciseToQuestion(data, testId);
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
};
