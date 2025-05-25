
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RealNeuralMetrics {
  neural_efficiency: number;
  universe_exploration_depth: number;
  paes_simulation_accuracy: number;
  gamification_engagement: number;
  adaptive_learning_rate: number;
  cognitive_load: number;
  prediction_accuracy: number;
  system_coherence: number;
  user_satisfaction: number;
  learning_velocity: number;
}

interface MetricsState {
  metrics: RealNeuralMetrics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

export const useRealNeuralMetrics = () => {
  const { user } = useAuth();
  const [state, setState] = useState<MetricsState>({
    metrics: null,
    isLoading: true,
    error: null,
    lastUpdate: null
  });

  // Calcular métricas basadas en datos reales
  const calculateMetrics = useCallback(async () => {
    if (!user?.id) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Usuario no autenticado' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Obtener datos reales de progreso
      const [progressData, diagnosticData, planData] = await Promise.all([
        supabase
          .from('node_progress')
          .select('mastery_level, completed_at')
          .eq('user_id', user.id),
        
        supabase
          .from('diagnostic_results')
          .select('results, completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('learning_plans')
          .select('progress, created_at')
          .eq('user_id', user.id)
      ]);

      // Calcular métricas neurales basadas en datos reales
      const nodeProgress = progressData.data || [];
      const diagnostics = diagnosticData.data || [];
      const plans = planData.data || [];

      // Neural efficiency basada en progreso promedio
      const neural_efficiency = nodeProgress.length > 0 
        ? Math.round(nodeProgress.reduce((acc, curr) => acc + (curr.mastery_level || 0), 0) / nodeProgress.length * 100)
        : 45;

      // Universe exploration basada en nodos completados
      const universe_exploration_depth = Math.min(95, Math.round((nodeProgress.length / 100) * 100));

      // PAES accuracy basada en diagnósticos recientes
      const paes_simulation_accuracy = diagnostics.length > 0
        ? Math.round(Object.values(diagnostics[0]?.results || {}).reduce((acc: number, score: any) => {
            return acc + (typeof score === 'number' ? score : 0);
          }, 0) / Object.keys(diagnostics[0]?.results || {}).length / 850 * 100)
        : 67;

      // Engagement basado en actividad reciente
      const recentActivity = [...nodeProgress, ...diagnostics, ...plans]
        .filter(item => {
          const date = new Date(item.completed_at || item.created_at);
          const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        });

      const gamification_engagement = Math.min(92, Math.round((recentActivity.length / 10) * 100));

      // Adaptive learning rate basado en mejora en diagnósticos
      const adaptive_learning_rate = diagnostics.length >= 2
        ? Math.round(Math.abs(
            Object.values(diagnostics[0]?.results || {}).reduce((acc: number, score: any) => acc + score, 0) -
            Object.values(diagnostics[1]?.results || {}).reduce((acc: number, score: any) => acc + score, 0)
          ) / 100)
        : 78;

      // Métricas calculadas dinámicamente
      const cognitive_load = Math.max(20, 100 - neural_efficiency);
      const prediction_accuracy = Math.round((neural_efficiency + paes_simulation_accuracy) / 2);
      const system_coherence = Math.round((neural_efficiency + universe_exploration_depth + gamification_engagement) / 3);
      const user_satisfaction = Math.round((gamification_engagement + adaptive_learning_rate) / 2);
      const learning_velocity = Math.round((adaptive_learning_rate + neural_efficiency) / 2);

      const calculatedMetrics: RealNeuralMetrics = {
        neural_efficiency,
        universe_exploration_depth,
        paes_simulation_accuracy,
        gamification_engagement,
        adaptive_learning_rate,
        cognitive_load,
        prediction_accuracy,
        system_coherence,
        user_satisfaction,
        learning_velocity
      };

      setState({
        metrics: calculatedMetrics,
        isLoading: false,
        error: null,
        lastUpdate: new Date()
      });

      console.log('🧠 Métricas neurales calculadas:', calculatedMetrics);

    } catch (error) {
      console.error('❌ Error calculando métricas neurales:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al calcular métricas neurales'
      }));
    }
  }, [user?.id]);

  // Actualización automática de métricas
  useEffect(() => {
    calculateMetrics();
    
    const interval = setInterval(calculateMetrics, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, [calculateMetrics]);

  // Función para obtener métrica específica para una dimensión
  const getMetricForDimension = useCallback((dimensionId: string): number => {
    if (!state.metrics) return 0;

    const dimensionMetricMap: Record<string, keyof RealNeuralMetrics> = {
      'neural_command': 'neural_efficiency',
      'educational_universe': 'universe_exploration_depth',
      'neural_training': 'adaptive_learning_rate',
      'progress_analysis': 'prediction_accuracy',
      'paes_simulation': 'paes_simulation_accuracy',
      'personalized_feedback': 'user_satisfaction',
      'battle_mode': 'gamification_engagement',
      'achievement_system': 'gamification_engagement',
      'vocational_prediction': 'prediction_accuracy',
      'financial_center': 'system_coherence',
      'calendar_management': 'learning_velocity',
      'settings_control': 'system_coherence'
    };

    const metricKey = dimensionMetricMap[dimensionId] || 'neural_efficiency';
    return state.metrics[metricKey];
  }, [state.metrics]);

  return {
    ...state,
    calculateMetrics,
    getMetricForDimension
  };
};
