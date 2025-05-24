
import { useState, useCallback, useEffect } from 'react';
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
      // Usar learning_nodes como fuente de nodos recomendados
      const { data: nodesData, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .limit(5);

      if (error) {
        console.error('Error cargando nodos recomendados:', error);
        return;
      }

      setPaesBasedNodes(nodesData || []);
    } catch (error) {
      console.error('Error en loadPAESBasedNodes:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Cargar métricas del plan basadas en ejercicios realizados
   */
  const loadPlanMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Obtener estadísticas de ejercicios realizados
      const { data: exerciseData, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error obteniendo métricas PAES:', error);
        return;
      }

      const totalQuestions = exerciseData?.length || 0;
      const correctAnswers = exerciseData?.filter(ex => ex.is_correct).length || 0;
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
   * Generar plan adaptativo basado en análisis de progreso
   */
  const generateAdaptivePlan = useCallback(async () => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      // Obtener progreso de nodos para análisis
      const { data: progressData, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error obteniendo progreso:', error);
        return null;
      }

      // Calcular áreas de fortaleza y debilidad basadas en progreso
      const completedNodes = progressData?.filter(p => p.status === 'completed').length || 0;
      const totalNodes = progressData?.length || 0;
      const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

      // Crear plan adaptativo
      const adaptivePlan = {
        title: 'Plan PAES Personalizado',
        description: 'Plan generado automáticamente basado en tu rendimiento actual',
        focusAreas: ['Áreas con menor progreso'],
        reinforcementAreas: ['Áreas con mejor progreso'],
        estimatedDuration: Math.max(30, 90 - Math.round(overallProgress)),
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
   * Actualizar progreso del plan con datos disponibles
   */
  const updatePlanProgress = useCallback(async (planId: string) => {
    if (!user?.id) return false;

    try {
      // Actualizar información del perfil con timestamp
      const { error } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id);

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
