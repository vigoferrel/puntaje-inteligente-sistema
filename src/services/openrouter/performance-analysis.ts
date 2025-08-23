
import { TPAESHabilidad } from "@/types/system-types";
import { AIAnalysis } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Genera insights personalizados a partir de los datos de rendimiento de un usuario
 */
export const generatePerformanceInsights = async (
  userId: string,
  performanceData: any
): Promise<AIAnalysis | null> => {
  try {
    return await openRouterService<AIAnalysis>({
      action: 'analyze_performance',
      payload: {
        userId,
        performanceData,
        suppressToast: true, // Don't show errors to user for background tasks
        retry: true,         // Enable retries
        retryCount: 0        // Initial retry count
      }
    });
  } catch (error) {
    console.error('Error generating performance insights:', error);
    return null;
  }
};

/**
 * Analiza el rendimiento del usuario
 */
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
