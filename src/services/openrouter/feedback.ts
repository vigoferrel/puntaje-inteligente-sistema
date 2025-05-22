
import { AIFeedback } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Proporciona retroalimentación sobre la respuesta de un usuario a un ejercicio
 */
export const provideFeedback = async (
  userAnswer: string,
  correctAnswer: string,
  context: string
): Promise<AIFeedback | null> => {
  try {
    return await openRouterService<AIFeedback>({
      action: 'provide_feedback',
      payload: {
        userAnswer,
        correctAnswer,
        context
      }
    });
  } catch (error) {
    console.error('Error providing feedback:', error);
    return null;
  }
};

/**
 * Proporciona retroalimentación para un intento de ejercicio
 */
export const provideExerciseFeedback = async (
  exerciseAttempt: { question: string; answer: string },
  correctAnswer: string,
  explanation: string
): Promise<AIFeedback | null> => {
  return await openRouterService<AIFeedback>({
    action: 'provide_feedback',
    payload: {
      exerciseAttempt,
      correctAnswer,
      explanation
    }
  });
};
