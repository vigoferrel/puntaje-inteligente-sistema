
import { useState, useCallback, useEffect } from 'react';
import { PAESAnalyticsService } from '@/services/paes/paes-analytics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para integrar análisis PAES con Mi Plan
 */
export function usePAESPlanIntegration() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paesBasedNodes, setPaesBasedNodes] = useState<any[]>([]);
  const [planMetrics, setPlanMetrics] = useState<{
    totalPAESQuestions: number;
    correctPAESAnswers: number;
    paesAccuracy: number;
    estimatedReadiness: number;
  }>({
    totalPAESQuestions: 0,
    correctPAESAnswers: 0,
    paesAccuracy: 0,
    estimatedReadiness: 0
  });

  /**
   * Cargar nodos recomendados basados en análisis PAES
   */
  const loadPAESBasedNodes = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const recommendations = await PAESAnalyticsService.generateNodeRecommendations(user.id);
      setPaesBasedNodes(recommendations);
    } catch (error) {
      console.error('Error cargando nodos basados en PAES:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Cargar métricas del plan basadas en PAES
   */
  const loadPlanMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Obtener estadísticas de progreso PAES
      const { data: paesProgress, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error obteniendo métricas PAES:', error);
        return;
      }

      const totalQuestions = paesProgress?.length || 0;
      const correctAnswers = paesProgress?.filter(p => p.is_correct).length || 0;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      
      // Calcular preparación estimada (basada en cantidad y precisión)
      const readinessFromAccuracy = Math.min(accuracy, 100);
      const readinessFromVolume = Math.min((totalQuestions / 50) * 100, 100);
      const estimatedReadiness = (readinessFromAccuracy * 0.7) + (readinessFromVolume * 0.3);

      setPlanMetrics({
        totalPAESQuestions: totalQuestions,
        correctPAESAnswers: correctAnswers,
        paesAccuracy: accuracy,
        estimatedReadiness: Math.round(estimatedReadiness)
      });
    } catch (error) {
      console.error('Error calculando métricas del plan:', error);
    }
  }, [user?.id]);

  /**
   * Generar plan adaptativo basado en análisis PAES
   */
  const generateAdaptivePlan = useCallback(async () => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      // Obtener análisis de fortalezas y debilidades
      const analysis = await PAESAnalyticsService.getStrengthsAndWeaknesses(user.id);
      
      if (!analysis) {
        return null;
      }

      // Crear plan adaptativo
      const adaptivePlan = {
        title: 'Plan PAES Personalizado',
        description: 'Plan generado automáticamente basado en tu rendimiento en preguntas oficiales PAES',
        focusAreas: analysis.weaknesses,
        reinforcementAreas: analysis.strengths,
        estimatedDuration: Math.max(30, 90 - Math.round(analysis.overallAccuracy)),
        recommendedNodes: paesBasedNodes,
        metrics: planMetrics
      };

      console.log('📋 Plan adaptativo generado:', adaptivePlan);
      return adaptivePlan;
    } catch (error) {
      console.error('Error generando plan adaptativo:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id, paesBasedNodes, planMetrics]);

  /**
   * Actualizar progreso del plan con datos PAES
   */
  const updatePlanProgress = useCallback(async (planId: string) => {
    if (!user?.id) return false;

    try {
      // Actualizar progreso del plan basado en métricas PAES
      const { error } = await supabase
        .from('learning_plans')
        .update({
          updated_at: new Date().toISOString(),
          // Agregar campos específicos de progreso PAES si existen
        })
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error actualizando progreso del plan:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error en updatePlanProgress:', error);
      return false;
    }
  }, [user?.id]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.id) {
      loadPAESBasedNodes();
      loadPlanMetrics();
    }
  }, [user?.id, loadPAESBasedNodes, loadPlanMetrics]);

  return {
    loading,
    paesBasedNodes,
    planMetrics,
    loadPAESBasedNodes,
    loadPlanMetrics,
    generateAdaptivePlan,
    updatePlanProgress
  };
}
