
import { TPAESHabilidad } from "@/types/system-types";
import { AIAnalysis } from "@/types/ai-types";
import { analyzePerformance as analyzePerformanceApi } from "@/services/openrouter/performance-analysis";

export const analyzePerformance = async (
  userId: string,
  skillLevels: Record<TPAESHabilidad, number>,
  exerciseResults: any[]
): Promise<AIAnalysis | null> => {
  return await analyzePerformanceApi(userId, skillLevels, exerciseResults);
};
