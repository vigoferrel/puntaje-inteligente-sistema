
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealDiagnosticMetrics {
  readinessLevel: number;
  completedDiagnostics: number;
  availableTests: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
  lastDiagnosticDate: string | null;
  nextRecommendedTest: string | null;
  progressTrend: 'up' | 'down' | 'stable';
}

export const useRealDiagnosticData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealDiagnosticMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnosticData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch real exercise attempts instead of non-existent user_diagnostic_results
      const { data: exerciseAttempts, error: attemptsError } = await supabase
        .from('user_exercise_attempts')
        .select(`
          *,
          exercises(test_id, skill_id, difficulty)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (attemptsError) {
        console.error('Error fetching exercise attempts:', attemptsError);
        throw attemptsError;
      }

      // Fetch available diagnostic tests
      const { data: availableTests, error: testsError } = await supabase
        .from('diagnostic_tests')
        .select('*');

      if (testsError) {
        console.error('Error fetching diagnostic tests:', testsError);
      }

      // Fetch user progress on learning nodes
      const { data: nodeProgress, error: nodeError } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes!inner(test_id, skill_id, subject_area)
        `)
        .eq('user_id', user.id);

      if (nodeError) {
        console.error('Error fetching node progress:', nodeError);
      }

      const attempts = exerciseAttempts || [];
      const tests = availableTests || [];
      const progress = nodeProgress || [];

      // Calculate metrics from real data
      const completedDiagnostics = tests.filter(test => 
        attempts.some(attempt => attempt.exercises?.test_id === test.test_id)
      ).length;
      
      const availableTestsCount = tests.length;

      // Calculate readiness and average score from exercise attempts
      let readinessLevel = 0;
      let averageScore = 0;
      let strongAreas: string[] = [];
      let weakAreas: string[] = [];
      let progressTrend: 'up' | 'down' | 'stable' = 'stable';

      if (attempts.length > 0) {
        // Calculate average performance
        const correctAttempts = attempts.filter(a => a.is_correct).length;
        averageScore = Math.round((correctAttempts / attempts.length) * 100);
        
        // Readiness based on performance and coverage
        readinessLevel = Math.min(100, Math.max(0, 
          (averageScore * 0.7) + (completedDiagnostics * 20)
        ));

        // Analyze performance by subject area from node progress
        const subjectPerformance: Record<string, { correct: number; total: number }> = {};
        
        progress.forEach(np => {
          const subjectArea = np.learning_nodes?.subject_area || 'general';
          if (!subjectPerformance[subjectArea]) {
            subjectPerformance[subjectArea] = { correct: 0, total: 0 };
          }
          subjectPerformance[subjectArea].total += 1;
          if (np.mastery_level && np.mastery_level > 0.7) {
            subjectPerformance[subjectArea].correct += 1;
          }
        });

        // Identify strong and weak areas
        Object.entries(subjectPerformance).forEach(([area, perf]) => {
          if (perf.total > 0) {
            const performance = perf.correct / perf.total;
            if (performance > 0.75) {
              strongAreas.push(area);
            } else if (performance < 0.5) {
              weakAreas.push(area);
            }
          }
        });

        // Calculate trend from recent vs older attempts
        if (attempts.length > 4) {
          const recentAttempts = attempts.slice(0, Math.floor(attempts.length / 2));
          const olderAttempts = attempts.slice(Math.floor(attempts.length / 2));
          
          const recentScore = recentAttempts.filter(a => a.is_correct).length / recentAttempts.length;
          const olderScore = olderAttempts.filter(a => a.is_correct).length / olderAttempts.length;
          
          if (recentScore > olderScore + 0.1) {
            progressTrend = 'up';
          } else if (recentScore < olderScore - 0.1) {
            progressTrend = 'down';
          }
        }
      }

      const diagnosticMetrics: RealDiagnosticMetrics = {
        readinessLevel: Math.round(readinessLevel),
        completedDiagnostics,
        availableTests: availableTestsCount,
        averageScore,
        strongAreas,
        weakAreas,
        lastDiagnosticDate: attempts.length > 0 ? attempts[0].created_at : null,
        nextRecommendedTest: weakAreas.length > 0 ? weakAreas[0] : null,
        progressTrend
      };

      setMetrics(diagnosticMetrics);
    } catch (error) {
      console.error('Error in fetchDiagnosticData:', error);
      setError('Error cargando datos diagnósticos');
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDiagnosticData();
  }, [fetchDiagnosticData]);

  return { metrics, isLoading, error, refetch: fetchDiagnosticData };
};
