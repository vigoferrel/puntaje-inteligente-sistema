
import { AIFeedback } from "@/types/ai-types";
import { openRouterService } from "./openrouter-service";

export const provideFeedback = async (
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
