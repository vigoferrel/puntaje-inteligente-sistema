
import { TPAESHabilidad } from "@/types/system-types";
import { AIAnalysis } from "@/types/ai-types";
import { openRouterService } from "./openrouter-service";

export const analyzePerformance = async (
  userId: string,
  skillLevels: Record<TPAESHabilidad, number>,
  exerciseResults: any[]
): Promise<AIAnalysis | null> => {
  return await openRouterService<AIAnalysis>({
    action: 'analyze_performance',
    payload: {
      userId,
      skillLevels,
      exerciseResults
    }
  });
};
