
import { useState, useCallback, useEffect } from 'react';
import { PAESCycleIntegrationService } from '@/services/paes/paes-cycle-integration';
import { PAESAnalyticsService } from '@/services/paes/paes-analytics';
import { TPAESHabilidad, TPAESPrueba, TLearningCyclePhase } from '@/types/system-types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para integrar contenido PAES con el ciclo de aprendizaje
 */
export function usePAESCycleIntegration() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phaseProgress, setPhaseProgress] = useState<Record<string, any>>({});
  const [predictedScore, setPredictedScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  /**
   * Cargar progreso por fase
   */
  const loadPhaseProgress = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const progress = await PAESCycleIntegrationService.getPAESProgressByPhase(user.id);
      setPhaseProgress(progress || {});
    } catch (error) {
      console.error('Error cargando progreso por fase:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Cargar análisis predictivo
   */
  const loadPredictiveAnalysis = useCallback(async () => {
    if (!user?.id) return;

    try {
      const analysis = await PAESAnalyticsService.calculatePredictedScore(user.id);
      setPredictedScore(analysis?.overall || null);

      const nodeRecommendations = await PAESAnalyticsService.generateNodeRecommendations(user.id);
      setRecommendations(nodeRecommendations);
    } catch (error) {
      console.error('Error en análisis predictivo:', error);
    }
  }, [user?.id]);

  /**
   * Generar ejercicios para una fase específica
   */
  const generatePhaseExercises = useCallback(async (
    phase: TLearningCyclePhase,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba
  ) => {
    setLoading(true);
    try {
      const result = await PAESCycleIntegrationService.generatePhaseExercises(
        phase,
        skill,
        prueba,
        user?.id
      );
      
      console.log(`✅ Ejercicios generados para ${phase}:`, result.stats);
      return result.exercises;
    } catch (error) {
      console.error('Error generando ejercicios por fase:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Actualizar progreso en pregunta PAES
   */
  const updatePAESProgress = useCallback(async (
    questionId: number,
    isCorrect: boolean,
    skill: TPAESHabilidad,
    phase: TLearningCyclePhase
  ) => {
    if (!user?.id) return false;

    const success = await PAESCycleIntegrationService.updatePAESProgress(
      user.id,
      questionId,
      isCorrect,
      skill,
      phase
    );

    if (success) {
      // Recargar progreso
      await loadPhaseProgress();
      await loadPredictiveAnalysis();
    }

    return success;
  }, [user?.id, loadPhaseProgress, loadPredictiveAnalysis]);

  /**
   * Obtener configuración para una fase
   */
  const getPhaseConfig = useCallback((phase: TLearningCyclePhase) => {
    return PAESCycleIntegrationService.getPhaseConfig(phase);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.id) {
      loadPhaseProgress();
      loadPredictiveAnalysis();
    }
  }, [user?.id, loadPhaseProgress, loadPredictiveAnalysis]);

  return {
    loading,
    phaseProgress,
    predictedScore,
    recommendations,
    generatePhaseExercises,
    updatePAESProgress,
    getPhaseConfig,
    loadPhaseProgress,
    loadPredictiveAnalysis
  };
}
