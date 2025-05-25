
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NeuralMetrics } from '@/components/neural-command/config/neuralTypes';

interface RealNeuralData {
  userProgress: any[];
  exerciseAttempts: any[];
  diagnosticResults: any[];
  learningNodes: any[];
  studySchedule: any[];
}

// Unified cache for all system components
const metricsCache = new Map<string, { data: NeuralMetrics; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useRealNeuralMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<NeuralMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRealData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cacheKey = `metrics_${user.id}`;
    const cached = metricsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setMetrics(cached.data);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Optimized parallel data fetching
      const [
        nodeProgressData,
        exerciseAttemptsData,
        diagnosticResultsData,
        learningNodesData,
        studyScheduleData
      ] = await Promise.all([
        supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', user.id),
        
        supabase
          .from('user_exercise_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        
        supabase
          .from('user_diagnostic_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false }),
        
        supabase
          .from('learning_nodes')
          .select('*')
          .limit(500),
        
        supabase
          .from('user_study_schedules')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
      ]);

      if (nodeProgressData.error) throw nodeProgressData.error;
      if (exerciseAttemptsData.error) throw exerciseAttemptsData.error;
      if (diagnosticResultsData.error) throw diagnosticResultsData.error;
      if (learningNodesData.error) throw learningNodesData.error;
      if (studyScheduleData.error) throw studyScheduleData.error;

      const realData: RealNeuralData = {
        userProgress: nodeProgressData.data || [],
        exerciseAttempts: exerciseAttemptsData.data || [],
        diagnosticResults: diagnosticResultsData.data || [],
        learningNodes: learningNodesData.data || [],
        studySchedule: studyScheduleData.data || []
      };

      const calculatedMetrics = calculateRealMetrics(realData);
      
      // Cache the results
      metricsCache.set(cacheKey, {
        data: calculatedMetrics,
        timestamp: Date.now()
      });
      
      setMetrics(calculatedMetrics);

    } catch (error) {
      console.error('Error fetching real neural data:', error);
      setError('Error al cargar métricas neurales');
      
      // Fallback to minimal real metrics
      setMetrics({
        neural_efficiency: 0,
        adaptive_learning_score: 0,
        cross_pollination_rate: 0,
        user_experience_harmony: 0,
        paes_simulation_accuracy: 0,
        universe_exploration_depth: 0,
        superpaes_coordination_level: 0,
        gamification_engagement: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const calculateRealMetrics = (data: RealNeuralData): NeuralMetrics => {
    const { userProgress, exerciseAttempts, diagnosticResults, learningNodes, studySchedule } = data;

    // Enhanced neural efficiency calculation
    const completedNodes = userProgress.filter(p => p.status === 'completed');
    const neural_efficiency = completedNodes.length > 0
      ? Math.round(completedNodes.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / completedNodes.length * 100)
      : 0;

    // Adaptive learning with time-weighted scoring
    const recentAttempts = exerciseAttempts.slice(0, 50);
    const correctAttempts = recentAttempts.filter(a => a.is_correct).length;
    const adaptive_learning_score = recentAttempts.length > 0
      ? Math.round((correctAttempts / recentAttempts.length) * 100)
      : 0;

    // Cross-pollination based on subject diversity
    const subjectsStudied = new Set(userProgress.map(p => {
      const node = learningNodes.find(n => n.id === p.node_id);
      return node?.subject_area;
    }).filter(Boolean));
    const cross_pollination_rate = Math.min(100, subjectsStudied.size * 20);

    // User experience harmony with schedule adherence
    const hasActiveSchedule = studySchedule.length > 0;
    const recentActivity = userProgress.filter(p => {
      const lastActivity = new Date(p.last_activity_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return lastActivity > weekAgo;
    }).length;
    const user_experience_harmony = Math.round(
      (hasActiveSchedule ? 30 : 0) + 
      Math.min(70, recentActivity * 10)
    );

    // PAES simulation accuracy from diagnostics
    const latestDiagnostic = diagnosticResults[0];
    const paes_simulation_accuracy = latestDiagnostic
      ? Math.round((latestDiagnostic.results as any)?.overall_score || 0 * 100 / 850 * 100)
      : 0;

    // Universe exploration depth
    const totalNodes = learningNodes.length;
    const exploredNodes = userProgress.length;
    const universe_exploration_depth = totalNodes > 0
      ? Math.round((exploredNodes / totalNodes) * 100)
      : 0;

    // SuperPAES coordination level
    const testCoverage = new Set(userProgress.map(p => {
      const node = learningNodes.find(n => n.id === p.node_id);
      return node?.test_id;
    }).filter(Boolean));
    const superpaes_coordination_level = Math.min(100, testCoverage.size * 25);

    // Gamification engagement
    const totalTimeSpent = userProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);
    const gamification_engagement = Math.min(100, 
      Math.round((recentActivity * 20) + (totalTimeSpent / 60 * 2))
    );

    return {
      neural_efficiency,
      adaptive_learning_score,
      cross_pollination_rate,
      user_experience_harmony,
      paes_simulation_accuracy,
      universe_exploration_depth,
      superpaes_coordination_level,
      gamification_engagement
    };
  };

  const getMetricForDimension = useCallback((dimensionId: string): number => {
    if (!metrics) return 0;

    const mappings: Record<string, keyof NeuralMetrics> = {
      'neural_command': 'neural_efficiency',
      'educational_universe': 'universe_exploration_depth',
      'universe_exploration': 'universe_exploration_depth',
      'paes_universe': 'universe_exploration_depth',
      'superpaes_coordinator': 'superpaes_coordination_level',
      'intelligence_hub': 'superpaes_coordination_level',
      'neural_training': 'adaptive_learning_score',
      'progress_analysis': 'cross_pollination_rate',
      'matrix_diagnostics': 'cross_pollination_rate',
      'paes_simulation': 'paes_simulation_accuracy',
      'personalized_feedback': 'user_experience_harmony',
      'holographic_analytics': 'user_experience_harmony',
      'battle_mode': 'gamification_engagement',
      'achievement_system': 'gamification_engagement',
      'vocational_prediction': 'superpaes_coordination_level',
      'financial_center': 'user_experience_harmony',
      'calendar_management': 'user_experience_harmony',
      'settings_control': 'neural_efficiency'
    };

    const metricKey = mappings[dimensionId];
    return metricKey ? metrics[metricKey] : metrics.neural_efficiency;
  }, [metrics]);

  // Clear cache when user changes
  useEffect(() => {
    if (user?.id) {
      metricsCache.clear();
    }
  }, [user?.id]);

  useEffect(() => {
    fetchRealData();
  }, [fetchRealData]);

  return {
    metrics,
    isLoading,
    error,
    getMetricForDimension,
    refetch: fetchRealData
  };
};
