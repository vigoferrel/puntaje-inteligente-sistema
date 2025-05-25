
import { useUnifiedDiagnostic } from './use-unified-diagnostic';

// Legacy hook para compatibilidad - redirige al nuevo hook unificado
export const useDiagnosticIntelligence = (userId: string | undefined) => {
  const unifiedData = useUnifiedDiagnostic();
  
  return {
    baselineScores: unifiedData.baselineScores,
    currentScores: unifiedData.currentScores,
    progressTrends: unifiedData.progressTrends,
    skillAnalysis: unifiedData.skillAnalysis,
    personalizedStrategies: unifiedData.personalizedStrategies,
    predictedScores: unifiedData.predictedScores,
    isLoading: unifiedData.isLoading,
    needsInitialAssessment: unifiedData.needsInitialAssessment,
    lastAssessmentDate: unifiedData.lastAssessmentDate,
    nextRecommendedAssessment: unifiedData.nextRecommendedAssessment,
    performInitialAssessment: unifiedData.performInitialAssessment,
    scheduleProgressAssessment: unifiedData.scheduleProgressAssessment,
    generatePersonalizedExercises: unifiedData.generatePersonalizedExercises,
    refreshData: unifiedData.refreshData
  };
};
