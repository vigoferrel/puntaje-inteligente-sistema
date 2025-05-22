
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticQuestion } from '@/types/diagnostic';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { mapSkillIdToEnum, mapTestIdToEnum } from '@/utils/supabase-mappers';

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
    return mapExerciseToQuestion(data);
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
    return data.map(exercise => mapExerciseToQuestion(exercise));
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
      return fallbackData.map(exercise => mapExerciseToQuestion(exercise));
    }
    
    // Map the data
    return data.map(exercise => mapExerciseToQuestion(exercise));
  } catch (error) {
    console.error('Error in fetchDiagnosticQuestions:', error);
    return [];
  }
}

/**
 * Helper function to transform a raw exercise row from the database into our DiagnosticQuestion type
 */
// Define a simplified type for the database exercise to prevent circular references
interface RawExerciseData {
  id?: string;
  question?: string;
  options?: string[] | string | null;
  correct_answer?: string;
  skill?: number | string;
  prueba?: number | string;
  explanation?: string;
  diagnostic_id?: string;
}

function mapExerciseToQuestion(exercise: RawExerciseData): DiagnosticQuestion {
  // Safely parse options if they're stored as a JSON string
  let options: string[] = [];
  
  try {
    if (exercise?.options) {
      if (Array.isArray(exercise.options)) {
        options = exercise.options;
      } else if (typeof exercise.options === 'string') {
        options = JSON.parse(exercise.options || '[]');
      } else if (typeof exercise.options === 'object') {
        // If options is already an object (from JSONB column)
        options = Array.isArray(exercise.options) ? exercise.options : [];
      }
    }
  } catch (e) {
    console.error('Error parsing options:', e);
    options = [];
  }

  // Map skill and prueba to their respective enums
  let skill: TPAESHabilidad = 'SOLVE_PROBLEMS';
  if (typeof exercise?.skill === 'number') {
    skill = mapSkillIdToEnum(exercise.skill);
  } else if (typeof exercise?.skill === 'string') {
    // Check if the string is a valid TPAESHabilidad
    skill = (Object.values(TPAESHabilidad) as string[]).includes(exercise.skill)
      ? exercise.skill as TPAESHabilidad
      : 'SOLVE_PROBLEMS';
  }

  let prueba: TPAESPrueba = 'MATEMATICA_1';
  if (typeof exercise?.prueba === 'number') {
    prueba = mapTestIdToEnum(exercise.prueba);
  } else if (typeof exercise?.prueba === 'string') {
    // Check if the string is a valid TPAESPrueba
    prueba = (Object.values(TPAESPrueba) as string[]).includes(exercise.prueba)
      ? exercise.prueba as TPAESPrueba
      : 'MATEMATICA_1';
  }

  // Return the mapped question with explicitly typed properties
  return {
    id: exercise?.id || '',
    question: exercise?.question || '',
    options: options,
    correctAnswer: exercise?.correct_answer || '',
    skill: skill,
    prueba: prueba,
    explanation: exercise?.explanation || undefined
  };
}
