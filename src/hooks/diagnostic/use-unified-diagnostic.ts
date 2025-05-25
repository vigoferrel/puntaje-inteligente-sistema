
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DiagnosticOrchestrator, UnifiedDiagnosticData } from '@/services/diagnostic/diagnostic-orchestrator';
import { TPAESPrueba } from '@/types/system-types';
import { toast } from '@/components/ui/use-toast';

export const useUnifiedDiagnostic = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UnifiedDiagnosticData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orchestrator, setOrchestrator] = useState<DiagnosticOrchestrator | null>(null);

  // Initialize orchestrator when user is available
  useEffect(() => {
    if (user?.id) {
      const newOrchestrator = new DiagnosticOrchestrator(user.id);
      setOrchestrator(newOrchestrator);
    }
  }, [user?.id]);

  // Load data when orchestrator is ready
  const loadData = useCallback(async () => {
    if (!orchestrator) return;

    setIsLoading(true);
    try {
      const unifiedData = await orchestrator.loadUnifiedData();
      setData(unifiedData);
    } catch (error) {
      console.error('Error loading unified diagnostic data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de diagnóstico",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [orchestrator]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Main actions
  const performInitialAssessment = useCallback(async () => {
    if (!orchestrator) return;
    await orchestrator.performInitialAssessment();
  }, [orchestrator]);

  const scheduleProgressAssessment = useCallback(async () => {
    if (!orchestrator) return;
    await orchestrator.scheduleProgressAssessment();
  }, [orchestrator]);

  const generatePersonalizedExercises = useCallback(async (prueba: TPAESPrueba) => {
    if (!orchestrator) return;
    await orchestrator.generatePersonalizedExercises(prueba);
  }, [orchestrator]);

  const refreshData = useCallback(() => {
    if (orchestrator) {
      orchestrator.clearCache();
    }
    loadData();
  }, [loadData, orchestrator]);

  return {
    // Data
    data,
    isLoading,
    
    // Actions
    performInitialAssessment,
    scheduleProgressAssessment,
    generatePersonalizedExercises,
    refreshData,

    // Computed properties for easy access
    tests: data?.tests || [],
    skills: data?.skills || [],
    baselineScores: data?.baselineScores,
    currentScores: data?.currentScores,
    progressTrends: data?.progressTrends || [],
    skillAnalysis: data?.skillAnalysis,
    personalizedStrategies: data?.personalizedStrategies || [],
    predictedScores: data?.predictedScores,
    needsInitialAssessment: data?.needsInitialAssessment || false,
    lastAssessmentDate: data?.lastAssessmentDate,
    nextRecommendedAssessment: data?.nextRecommendedAssessment
  };
};
