
import { DiagnosticQuestion, QuestionFeedback, QuestionStatus } from './types';
import { TPAESHabilidad } from "@/types/system-types";
import { supabase } from "@/integrations/supabase/client";
import { getAuthUser } from '@/contexts/auth-utils';
import { v4 as uuidv4 } from 'uuid';
import { 
  calculateQuestionPenalty,
  calculateSkillLevelChange 
} from './skill-services';

// Fetch diagnostic questions from Supabase
export const fetchDiagnosticQuestions = async (
  diagnosticId: string,
  testId: number
): Promise<DiagnosticQuestion[]> => {
  try {
    // Since we're seeing errors with the "questions" table, let's use "exercises" instead
    // which appears to be in our Supabase schema
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('diagnostic_id', diagnosticId);

    if (error) throw error;
    
    // Convert the database format to our application format
    return (data || []).map(item => ({
      id: item.id,
      question: item.question,
      options: Array.isArray(item.options) ? item.options : [],
      correctAnswer: item.correct_answer,
      skill: item.skill,
      prueba: testId,
      explanation: item.explanation
    })) as DiagnosticQuestion[];
  } catch (error) {
    console.error('Error fetching diagnostic questions:', error);
    return [];
  }
};

// Fetch a batch of questions for a specific test
export const fetchQuestionBatch = async (
  testId: string,
  batchSize: number = 10,
  previousQuestions: string[] = []
): Promise<DiagnosticQuestion[]> => {
  try {
    // Since we're seeing errors with the "questions" table, let's use "exercises" instead
    let query = supabase
      .from('exercises')
      .select('*')
      .eq('test_id', testId);
      
    if (previousQuestions.length > 0) {
      query = query.not('id', 'in', `(${previousQuestions.join(',')})`);
    }
    
    query = query.limit(batchSize);

    const { data, error } = await query;

    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.id,
      question: item.question,
      options: Array.isArray(item.options) ? item.options : [],
      correctAnswer: item.correct_answer,
      skill: item.skill,
      prueba: Number(testId),
      explanation: item.explanation
    })) as DiagnosticQuestion[];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

// Get a single question by ID
export const getQuestionById = async (questionId: string): Promise<DiagnosticQuestion | null> => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      question: data.question,
      options: Array.isArray(data.options) ? data.options : [],
      correctAnswer: data.correct_answer,
      skill: data.skill,
      prueba: data.test_id,
      explanation: data.explanation
    } as DiagnosticQuestion;
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
};

// Record the user's answer to a question
export const recordAnswer = async (
  questionId: string,
  selectedOption: string,
  isCorrect: boolean,
  timeSpentSeconds: number,
  skillsAssessed: TPAESHabilidad[]
): Promise<boolean> => {
  try {
    const user = await getAuthUser();
    if (!user) return false;

    // Insert the answer into the database
    const { error } = await supabase
      .from('user_exercise_attempts')  // Changed from user_answers to user_exercise_attempts
      .insert({
        id: uuidv4(),
        user_id: user.id,
        exercise_id: questionId,  // Changed from question_id to exercise_id
        answer: selectedOption,
        is_correct: isCorrect,
        time_taken_seconds: timeSpentSeconds
      });

    if (error) throw error;

    // Update skill levels if needed
    for (const skill of skillsAssessed) {
      const penalty = calculateQuestionPenalty(timeSpentSeconds, isCorrect);
      const levelChange = calculateSkillLevelChange(isCorrect, penalty);
      
      // We'll implement this function in skill-services.ts
      await updateUserSkillLevel(user.id, skill, levelChange);
    }

    return true;
  } catch (error) {
    console.error('Error recording answer:', error);
    return false;
  }
};

// Update user's skill level
const updateUserSkillLevel = async (
  userId: string,
  skill: TPAESHabilidad,
  levelChange: number
): Promise<boolean> => {
  try {
    // First get current skill level if exists
    const { data, error } = await supabase
      .from('user_skill_levels')
      .select('level')
      .eq('user_id', userId)
      .eq('skill_id', skill)
      .single();

    if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') {
      throw error;
    }

    const currentLevel = data ? data.level : 0.5; // Default to middle if not found
    const newLevel = Math.max(0.1, Math.min(0.99, currentLevel + levelChange));

    // Insert or update the skill level - assuming skill_id is a string in this table
    const { error: upsertError } = await supabase
      .from('user_skill_levels')
      .upsert({
        user_id: userId,
        skill_id: Number(skill), // Convert skill to number
        level: newLevel
      });

    if (upsertError) throw upsertError;
    return true;
  } catch (error) {
    console.error('Error updating skill level:', error);
    return false;
  }
};

// Get question feedback based on user answer
export const getQuestionFeedback = async (
  questionId: string,
  isCorrect: boolean
): Promise<QuestionFeedback> => {
  // For correct answers, simple congratulation
  if (isCorrect) {
    return {
      message: "¡Respuesta correcta!",
      explanation: "Has contestado correctamente a esta pregunta.",
      tips: ["Continúa con el mismo nivel de concentración."],
      status: QuestionStatus.CORRECT
    };
  }

  // For incorrect answers, fetch explanation if available
  try {
    const question = await getQuestionById(questionId);
    
    if (!question) {
      throw new Error("Question not found");
    }

    return {
      message: "Respuesta incorrecta",
      explanation: question.explanation || "La respuesta seleccionada no es la correcta.",
      tips: [
        "Revisa el contenido relacionado con esta pregunta.",
        "Presta atención a los detalles en preguntas similares."
      ],
      status: QuestionStatus.INCORRECT
    };
  } catch (error) {
    console.error('Error getting question feedback:', error);
    return {
      message: "Respuesta incorrecta",
      explanation: "No se pudo obtener la explicación detallada.",
      tips: ["Intenta revisar el contenido relacionado."],
      status: QuestionStatus.INCORRECT
    };
  }
};
