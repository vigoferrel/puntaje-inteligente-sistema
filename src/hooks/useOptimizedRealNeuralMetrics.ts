
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NeuralMetrics {
  neural_efficiency: number;
  adaptive_learning_rate: number;
  system_coherence: number;
  user_satisfaction: number;
  paes_simulation_accuracy: number;
  universe_exploration_depth: number;
  prediction_accuracy: number;
  gamification_engagement: number;
  pattern_recognition: number;
  adaptive_intelligence: number;
  creative_synthesis: number;
  strategic_thinking: number;
  achievement_momentum: number;
  battle_readiness: number;
  vocational_alignment: number;
  learning_velocity: number;
  innovation_index: number;
  emotional_intelligence: number;
  leadership_potential: number;
}

interface UseOptimizedRealNeuralMetricsReturn {
  metrics: NeuralMetrics | null;
  isLoading: boolean;
  error: string | null;
  getMetricForDimension: (dimensionId: string) => number;
  refetch: () => Promise<void>;
}

export const useOptimizedRealNeuralMetrics = (): UseOptimizedRealNeuralMetricsReturn => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<NeuralMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateMetricsFromUserData = useCallback(async () => {
    if (!user?.id) {
      setError('Usuario no autenticado');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cargar datos del usuario para calcular métricas
      const [progressData, achievementsData, diagnosticData] = await Promise.all([
        // Progreso de nodos
        supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', user.id),
        
        // Logros del usuario
        supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id),
        
        // Resultados diagnósticos
        supabase
          .from('user_diagnostic_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(5)
      ]);

      const nodeProgress = progressData.data || [];
      const achievements = achievementsData.data || [];
      const diagnosticResults = diagnosticData.data || [];

      // Calcular métricas reales basadas en datos del usuario
      const calculatedMetrics = calculateRealNeuralMetrics(
        nodeProgress,
        achievements,
        diagnosticResults
      );

      // Guardar métricas calculadas en la base de datos
      await saveCalculatedMetrics(user.id, calculatedMetrics);

      setMetrics(calculatedMetrics);
      setIsLoading(false);

    } catch (err) {
      console.error('Error calculando métricas:', err);
      setError('Error al cargar métricas neurales');
      setIsLoading(false);
    }
  }, [user?.id]);

  const getMetricForDimension = useCallback((dimensionId: string): number => {
    if (!metrics) return 0;
    
    // Mapear IDs de dimensiones a métricas
    const dimensionMap: Record<string, keyof NeuralMetrics> = {
      'neural_efficiency': 'neural_efficiency',
      'adaptive_learning_rate': 'adaptive_learning_rate',
      'system_coherence': 'system_coherence',
      'user_satisfaction': 'user_satisfaction',
      'paes_simulation_accuracy': 'paes_simulation_accuracy',
      'universe_exploration_depth': 'universe_exploration_depth',
      'prediction_accuracy': 'prediction_accuracy',
      'gamification_engagement': 'gamification_engagement',
      'pattern_recognition': 'pattern_recognition',
      'adaptive_intelligence': 'adaptive_intelligence',
      'creative_synthesis': 'creative_synthesis',
      'strategic_thinking': 'strategic_thinking',
      'achievement_momentum': 'achievement_momentum',
      'battle_readiness': 'battle_readiness',
      'vocational_alignment': 'vocational_alignment',
      'learning_velocity': 'learning_velocity',
      'innovation_index': 'innovation_index',
      'emotional_intelligence': 'emotional_intelligence',
      'leadership_potential': 'leadership_potential'
    };

    const metricKey = dimensionMap[dimensionId];
    return metricKey ? metrics[metricKey] : 0;
  }, [metrics]);

  useEffect(() => {
    if (user?.id) {
      calculateMetricsFromUserData();
    }
  }, [user?.id, calculateMetricsFromUserData]);

  return {
    metrics,
    isLoading,
    error,
    getMetricForDimension,
    refetch: calculateMetricsFromUserData
  };
};

// Función para calcular métricas reales basadas en datos del usuario
function calculateRealNeuralMetrics(
  nodeProgress: any[],
  achievements: any[],
  diagnosticResults: any[]
): NeuralMetrics {
  const totalNodes = nodeProgress.length;
  const completedNodes = nodeProgress.filter(np => np.status === 'completed').length;
  const averageSuccess = totalNodes > 0 
    ? nodeProgress.reduce((sum, np) => sum + (np.success_rate || 0), 0) / totalNodes
    : 0;

  const totalStudyTime = nodeProgress.reduce((sum, np) => sum + (np.time_spent_minutes || 0), 0);
  const recentActivity = nodeProgress.filter(np => {
    const lastActivity = new Date(np.last_activity_at || 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastActivity > weekAgo;
  }).length;

  const achievementPoints = achievements.reduce((sum, ach) => sum + (ach.points_awarded || 0), 0);
  
  // Calcular score promedio de diagnósticos
  const averageDiagnosticScore = diagnosticResults.length > 0
    ? diagnosticResults.reduce((sum, dr) => {
        const results = dr.results || {};
        const scores = Object.values(results).filter(score => typeof score === 'number') as number[];
        return sum + (scores.reduce((a, b) => a + b, 0) / scores.length || 0);
      }, 0) / diagnosticResults.length
    : 0.5;

  return {
    neural_efficiency: Math.min(100, Math.round(averageSuccess * 100)),
    adaptive_learning_rate: Math.min(100, Math.round((recentActivity / Math.max(totalNodes, 1)) * 100)),
    system_coherence: Math.min(100, Math.round((completedNodes / Math.max(totalNodes, 1)) * 100)),
    user_satisfaction: Math.min(100, Math.round(averageDiagnosticScore * 100)),
    paes_simulation_accuracy: Math.min(100, Math.round(averageDiagnosticScore * 100)),
    universe_exploration_depth: Math.min(100, Math.round((totalStudyTime / 600) * 100)), // 10 horas = 100%
    prediction_accuracy: Math.min(100, Math.round(averageSuccess * 100)),
    gamification_engagement: Math.min(100, Math.round((achievementPoints / 1000) * 100)),
    pattern_recognition: Math.min(100, Math.round((averageSuccess + averageDiagnosticScore) * 50)),
    adaptive_intelligence: Math.min(100, Math.round(((recentActivity / Math.max(totalNodes, 1)) + averageSuccess) * 50)),
    creative_synthesis: Math.min(100, Math.round((achievementPoints / 500) * 50 + averageSuccess * 50)),
    strategic_thinking: Math.min(100, Math.round(((completedNodes / Math.max(totalNodes, 1)) + averageSuccess) * 50)),
    achievement_momentum: Math.min(100, Math.round((achievementPoints / 100) * 10)),
    battle_readiness: Math.min(100, Math.round(averageSuccess * 100)),
    vocational_alignment: Math.min(100, Math.round(averageDiagnosticScore * 100)),
    learning_velocity: Math.min(100, Math.round((recentActivity / 7) * 100)), // actividad por día
    innovation_index: Math.min(100, Math.round((achievementPoints / 200) * 20 + averageSuccess * 80)),
    emotional_intelligence: Math.min(100, Math.round((averageSuccess + (recentActivity / Math.max(totalNodes, 1))) * 50)),
    leadership_potential: Math.min(100, Math.round((achievementPoints / 300) * 30 + averageSuccess * 70))
  };
}

// Función para guardar métricas calculadas
async function saveCalculatedMetrics(userId: string, metrics: NeuralMetrics) {
  const metricsToSave = Object.entries(metrics).map(([dimension_id, current_value]) => ({
    user_id: userId,
    dimension_id,
    metric_type: 'neural',
    current_value,
    previous_value: 0, // Se actualizará en futuras iteraciones
    change_rate: 0,
    trend: 'stable' as const,
    last_calculated_at: new Date().toISOString(),
    metadata: { calculated_from_user_data: true }
  }));

  // Insertar o actualizar métricas
  for (const metric of metricsToSave) {
    await supabase
      .from('neural_metrics')
      .upsert(metric, {
        onConflict: 'user_id,dimension_id',
        ignoreDuplicates: false
      });
  }
}
