
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealQualityMetrics {
  comprehensionAccuracy: number;
  responseTime: number;
  consistencyRate: number;
  improvementTrend: 'improving' | 'stable' | 'declining';
  skillDistribution: Record<string, number>;
  lastAssessment: Date | null;
}

export function useRealQualityLectoGuia() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealQualityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateRealMetrics = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch real exercise attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('user_exercise_attempts')
        .select(`
          *,
          exercises!inner(test_id, skill_id, difficulty)
        `)
        .eq('user_id', user.id)
        .eq('exercises.test_id', 1) // Competencia Lectora
        .order('created_at', { ascending: false })
        .limit(50);

      if (attemptsError) throw attemptsError;

      // Fetch user progress on reading nodes
      const { data: nodeProgress, error: nodeError } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes!inner(test_id, skill_id)
        `)
        .eq('user_id', user.id)
        .eq('learning_nodes.test_id', 1);

      if (nodeError) throw nodeError;

      if (!attempts || attempts.length === 0) {
        setMetrics({
          comprehensionAccuracy: 0,
          responseTime: 0,
          consistencyRate: 0,
          improvementTrend: 'stable',
          skillDistribution: {},
          lastAssessment: null
        });
        return;
      }

      // Calculate comprehension accuracy
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      const comprehensionAccuracy = Math.round((correctAttempts / attempts.length) * 100);

      // Calculate average response time
      const totalTime = attempts.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0);
      const responseTime = Math.round(totalTime / attempts.length);

      // Calculate consistency rate (less variation in performance = higher consistency)
      const recentAttempts = attempts.slice(0, 10);
      const accuracyScores = recentAttempts.map(a => a.is_correct ? 100 : 0);
      const avgScore = accuracyScores.reduce((sum, score) => sum + score, 0) / accuracyScores.length;
      const variance = accuracyScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / accuracyScores.length;
      const consistencyRate = Math.max(0, Math.round(100 - (Math.sqrt(variance) / 10)));

      // Determine improvement trend
      const firstHalf = attempts.slice(0, Math.floor(attempts.length / 2));
      const secondHalf = attempts.slice(Math.floor(attempts.length / 2));
      
      const firstHalfAccuracy = firstHalf.filter(a => a.is_correct).length / firstHalf.length;
      const secondHalfAccuracy = secondHalf.filter(a => a.is_correct).length / secondHalf.length;
      
      let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (firstHalfAccuracy - secondHalfAccuracy > 0.1) {
        improvementTrend = 'improving';
      } else if (secondHalfAccuracy - firstHalfAccuracy > 0.1) {
        improvementTrend = 'declining';
      }

      // Calculate skill distribution from real node progress
      const skillDistribution: Record<string, number> = {};
      nodeProgress?.forEach(np => {
        const skillId = np.learning_nodes?.skill_id;
        const skillName = skillId === 1 ? 'Localizar' : 
                         skillId === 2 ? 'Interpretar' : 
                         skillId === 3 ? 'Evaluar' : 'General';
        skillDistribution[skillName] = Math.round((np.mastery_level || 0) * 100);
      });

      setMetrics({
        comprehensionAccuracy,
        responseTime,
        consistencyRate,
        improvementTrend,
        skillDistribution,
        lastAssessment: attempts[0] ? new Date(attempts[0].created_at) : null
      });

    } catch (error) {
      console.error('Error calculating real quality metrics:', error);
      setError('Error cargando métricas de calidad');
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    calculateRealMetrics();
  }, [calculateRealMetrics]);

  const refreshMetrics = useCallback(() => {
    calculateRealMetrics();
  }, [calculateRealMetrics]);

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics
  };
}
