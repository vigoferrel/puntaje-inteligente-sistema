
import { AIFeedback } from "@/types/ai-types";
import { provideExerciseFeedback } from "@/services/openrouter/feedback";

export const provideFeedback = async (
  exerciseAttempt: { question: string; answer: string },
  correctAnswer: string,
  explanation: string
): Promise<AIFeedback | null> => {
  return await provideExerciseFeedback(exerciseAttempt, correctAnswer, explanation);
};
