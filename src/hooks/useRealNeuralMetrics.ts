
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

  // Calcular métricas basadas en datos reales existentes en Supabase
  const calculateMetrics = useCallback(async () => {
    if (!user?.id) {
      setState(prev => ({ ...prev, isLoading: false, error: 'Usuario no autenticado' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Obtener datos reales de las tablas existentes
      const [nodeProgressData, userGoalsData, exerciseAttemptsData] = await Promise.all([
        supabase
          .from('user_node_progress')
          .select('mastery_level, status, time_spent_minutes')
          .eq('user_id', user.id),
        
        supabase
          .from('user_goals')
          .select('target_score_cl, target_score_m1, target_score_m2, created_at')
          .eq('user_id', user.id)
          .eq('is_active', true),
        
        supabase
          .from('user_exercise_attempts')
          .select('is_correct, time_taken_seconds, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      // Calcular métricas neurales basadas en datos reales
      const nodeProgress = nodeProgressData.data || [];
      const userGoals = userGoalsData.data || [];
      const exerciseAttempts = exerciseAttemptsData.data || [];

      // Neural efficiency basada en progreso promedio de nodos
      const neural_efficiency = nodeProgress.length > 0 
        ? Math.round(nodeProgress.reduce((acc, curr) => acc + (curr.mastery_level || 0), 0) / nodeProgress.length * 100)
        : 45;

      // Universe exploration basada en nodos completados
      const completedNodes = nodeProgress.filter(n => n.status === 'completed').length;
      const universe_exploration_depth = Math.min(95, Math.round((completedNodes / 50) * 100));

      // PAES accuracy basada en intentos de ejercicios recientes
      const recentCorrectAttempts = exerciseAttempts.filter(a => a.is_correct).length;
      const paes_simulation_accuracy = exerciseAttempts.length > 0
        ? Math.round((recentCorrectAttempts / exerciseAttempts.length) * 100)
        : 67;

      // Engagement basado en actividad reciente
      const recentActivity = exerciseAttempts.filter(attempt => {
        const date = new Date(attempt.created_at);
        const daysAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo <= 7;
      });

      const gamification_engagement = Math.min(92, Math.round((recentActivity.length / 20) * 100));

      // Adaptive learning rate basado en mejora de tiempo
      const avgTimeRecent = recentActivity.slice(0, 10).reduce((acc, curr) => acc + (curr.time_taken_seconds || 0), 0) / 10;
      const avgTimeOlder = exerciseAttempts.slice(10, 20).reduce((acc, curr) => acc + (curr.time_taken_seconds || 0), 0) / 10;
      const adaptive_learning_rate = avgTimeOlder > 0 
        ? Math.min(95, Math.round((1 - (avgTimeRecent / avgTimeOlder)) * 100 + 50))
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
