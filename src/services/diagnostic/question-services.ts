
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticQuestion } from '@/types/diagnostic';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { mapSkillIdToEnum, mapTestIdToEnum } from '@/utils/supabase-mappers';

// Importamos el tipo Json de Supabase para ayudar con la tipificación
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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
 * Definimos una interfaz para los datos crudos del ejercicio desde la base de datos
 */
interface RawExerciseData {
  id?: string;
  question?: string;
  options?: Json; // Aquí cambiamos para aceptar Json, que puede manejar array, string o null
  correct_answer?: string;
  skill?: number | string;
  prueba?: number | string;
  explanation?: string;
  diagnostic_id?: string;
  node_id?: string;
  difficulty?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Helper function to transform a raw exercise row from the database into our DiagnosticQuestion type
 */
function mapExerciseToQuestion(exercise: RawExerciseData): DiagnosticQuestion {
  // Safely parse options if they're stored as a JSON string
  let options: string[] = [];
  
  try {
    if (exercise?.options) {
      if (Array.isArray(exercise.options)) {
        options = exercise.options.map(String);
      } else if (typeof exercise.options === 'string') {
        options = JSON.parse(exercise.options || '[]');
      } else if (typeof exercise.options === 'object') {
        // Si options ya es un objeto (de una columna JSONB)
        const optionsObj = exercise.options as unknown;
        options = Array.isArray(optionsObj) ? optionsObj.map(String) : [];
      }
    }
  } catch (e) {
    console.error('Error parsing options:', e);
    options = [];
  }

  // Map skill usando una función de ayuda segura
  const safeMapSkill = (skillValue: number | string | undefined): TPAESHabilidad => {
    if (typeof skillValue === 'number') {
      return mapSkillIdToEnum(skillValue);
    } else if (typeof skillValue === 'string') {
      // Verificamos si el string está en los valores permitidos de TPAESHabilidad
      const validSkills = [
        'SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'INTERPRET_RELATE', 
        'EVALUATE_REFLECT', 'TRACK_LOCATE', 'ARGUE_COMMUNICATE', 
        'IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 
        'SCIENTIFIC_ARGUMENT', 'TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 
        'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION'
      ];
      
      return validSkills.includes(skillValue) 
        ? skillValue as TPAESHabilidad 
        : 'SOLVE_PROBLEMS';
    }
    return 'SOLVE_PROBLEMS'; // valor predeterminado
  };

  // Map prueba usando una función de ayuda segura
  const safeMapPrueba = (pruebaValue: number | string | undefined): TPAESPrueba => {
    if (typeof pruebaValue === 'number') {
      return mapTestIdToEnum(pruebaValue);
    } else if (typeof pruebaValue === 'string') {
      // Verificamos si el string está en los valores permitidos de TPAESPrueba
      const validPruebas = [
        'COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 
        'CIENCIAS', 'HISTORIA'
      ];
      
      return validPruebas.includes(pruebaValue) 
        ? pruebaValue as TPAESPrueba 
        : 'MATEMATICA_1';
    }
    return 'MATEMATICA_1'; // valor predeterminado
  };

  // Return the mapped question with explicitly typed properties
  return {
    id: exercise?.id || '',
    question: exercise?.question || '',
    options: options,
    correctAnswer: exercise?.correct_answer || '',
    skill: safeMapSkill(exercise?.skill),
    prueba: safeMapPrueba(exercise?.prueba),
    explanation: exercise?.explanation || undefined
  };
}
