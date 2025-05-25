
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

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all real data in parallel
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

    // Neural Efficiency: Based on average mastery level of completed nodes
    const completedNodes = userProgress.filter(p => p.status === 'completed');
    const neural_efficiency = completedNodes.length > 0
      ? Math.round(completedNodes.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / completedNodes.length * 100)
      : 0;

    // Adaptive Learning Score: Based on success rate in recent exercises
    const recentAttempts = exerciseAttempts.slice(0, 50);
    const correctAttempts = recentAttempts.filter(a => a.is_correct).length;
    const adaptive_learning_score = recentAttempts.length > 0
      ? Math.round((correctAttempts / recentAttempts.length) * 100)
      : 0;

    // Cross-Pollination Rate: Based on diversity of subjects studied
    const subjectsStudied = new Set(userProgress.map(p => {
      const node = learningNodes.find(n => n.id === p.node_id);
      return node?.subject_area;
    }).filter(Boolean));
    const cross_pollination_rate = Math.min(100, subjectsStudied.size * 20);

    // User Experience Harmony: Based on study consistency and schedule adherence
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

    // PAES Simulation Accuracy: Based on diagnostic results
    const latestDiagnostic = diagnosticResults[0];
    const paes_simulation_accuracy = latestDiagnostic
      ? Math.round((latestDiagnostic.results?.overall_score || 0) * 100 / 850 * 100)
      : 0;

    // Universe Exploration Depth: Based on nodes explored vs available
    const totalNodes = learningNodes.length;
    const exploredNodes = userProgress.length;
    const universe_exploration_depth = totalNodes > 0
      ? Math.round((exploredNodes / totalNodes) * 100)
      : 0;

    // SuperPAES Coordination Level: Based on test coverage and performance
    const testCoverage = new Set(userProgress.map(p => {
      const node = learningNodes.find(n => n.id === p.node_id);
      return node?.test_id;
    }).filter(Boolean));
    const superpaes_coordination_level = Math.min(100, testCoverage.size * 25);

    // Gamification Engagement: Based on recent activity and progress
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

  const getMetricForDimension = (dimensionId: string): number => {
    if (!metrics) return 0;

    switch (dimensionId) {
      case 'neural_command':
        return metrics.neural_efficiency;
      case 'educational_universe':
      case 'universe_exploration':
      case 'paes_universe':
        return metrics.universe_exploration_depth;
      case 'superpaes_coordinator':
      case 'intelligence_hub':
        return metrics.superpaes_coordination_level;
      case 'neural_training':
        return metrics.adaptive_learning_score;
      case 'progress_analysis':
      case 'matrix_diagnostics':
        return metrics.cross_pollination_rate;
      case 'paes_simulation':
        return metrics.paes_simulation_accuracy;
      case 'personalized_feedback':
      case 'holographic_analytics':
        return Math.round((metrics.adaptive_learning_score + metrics.neural_efficiency) / 2);
      case 'battle_mode':
      case 'achievement_system':
        return metrics.gamification_engagement;
      case 'vocational_prediction':
        return metrics.superpaes_coordination_level;
      case 'financial_center':
        return Math.round(metrics.user_experience_harmony * 0.9);
      case 'calendar_management':
        return Math.round(metrics.user_experience_harmony * 0.85);
      case 'settings_control':
        return Math.round(metrics.neural_efficiency * 0.8);
      default:
        return metrics.neural_efficiency;
    }
  };

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
