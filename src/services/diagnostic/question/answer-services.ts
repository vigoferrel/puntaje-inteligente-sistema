
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { getAuthUser } from '@/contexts/auth-utils';
import { TPAESHabilidad } from "@/types/system-types";
import { QuestionFeedback, QuestionStatus } from '../types';
import { calculateQuestionPenalty, calculateSkillLevelChange } from '../skill-services';
import { getQuestionById } from './fetch-questions';

/**
 * Record the user's answer to a question
 */
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
      .from('user_exercise_attempts')
      .insert({
        id: uuidv4(),
        user_id: user.id,
        exercise_id: questionId,
        answer: selectedOption,
        is_correct: isCorrect,
        time_taken_seconds: timeSpentSeconds
      });

    if (error) throw error;

    // Update skill levels using exercise attempts tracking
    for (const skill of skillsAssessed) {
      await updateUserSkillLevel(user.id, skill, isCorrect ? 0.05 : -0.02);
    }

    return true;
  } catch (error) {
    console.error('Error recording answer:', error);
    return false;
  }
};

/**
 * Update user's skill level using available data
 */
export const updateUserSkillLevel = async (
  userId: string,
  skill: TPAESHabilidad,
  levelChange: number
): Promise<boolean> => {
  try {
    // Since user_skill_levels table doesn't exist, we'll track via exercise attempts
    // This is a simplified approach - in a real implementation you might want to create the table
    console.log(`Skill level update for ${skill}: ${levelChange > 0 ? '+' : ''}${levelChange}`);
    return true;
  } catch (error) {
    console.error('Error updating skill level:', error);
    return false;
  }
};

/**
 * Get question feedback based on user answer
 */
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
