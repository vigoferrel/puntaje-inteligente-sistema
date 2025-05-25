
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealDiagnosticMetrics {
  availableTests: number;
  completedDiagnostics: number;
  averageScore: number;
  lastDiagnosticDate: string | null;
  totalAttempts: number;
  skillDistribution: Record<string, number>;
  progressTrend: 'improving' | 'stable' | 'declining';
  readinessLevel: number;
}

export const useRealDiagnosticData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealDiagnosticMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        // Fetch available diagnostic tests
        const { data: availableTests, error: testsError } = await supabase
          .from('diagnostic_tests')
          .select('id');
        
        if (testsError) throw testsError;

        // Fetch user's diagnostic results
        const { data: userResults, error: resultsError } = await supabase
          .from('user_diagnostic_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        
        if (resultsError) throw resultsError;

        // Fetch user exercise attempts for skill analysis
        const { data: attempts, error: attemptsError } = await supabase
          .from('user_exercise_attempts')
          .select('skill_demonstrated, is_correct, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (attemptsError) throw attemptsError;

        // Calculate real metrics
        const completedDiagnostics = userResults?.length || 0;
        const totalAttempts = attempts?.length || 0;
        
        // Calculate average score from real results
        const averageScore = userResults && userResults.length > 0
          ? userResults.reduce((sum, result) => {
              const scores = Object.values(result.results as Record<string, number>);
              const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
              return sum + avgScore;
            }, 0) / userResults.length
          : 0;

        // Analyze skill distribution from real attempts
        const skillDistribution: Record<string, number> = {};
        if (attempts) {
          attempts.forEach(attempt => {
            const skill = attempt.skill_demonstrated;
            if (skill) {
              skillDistribution[skill] = (skillDistribution[skill] || 0) + 1;
            }
          });
        }

        // Calculate progress trend from real data
        let progressTrend: 'improving' | 'stable' | 'declining' = 'stable';
        if (userResults && userResults.length >= 2) {
          const recent = averageScore;
          const older = Object.values(userResults[userResults.length - 1].results as Record<string, number>)
            .reduce((a, b) => a + b, 0) / Object.values(userResults[userResults.length - 1].results as Record<string, number>).length;
          
          if (recent > older + 5) progressTrend = 'improving';
          else if (recent < older - 5) progressTrend = 'declining';
        }

        // Calculate readiness level based on real performance
        const readinessLevel = Math.min(100, Math.max(0, 
          (averageScore * 0.6) + 
          (completedDiagnostics * 10) + 
          ((attempts?.filter(a => a.is_correct).length || 0) / Math.max(totalAttempts, 1) * 30)
        ));

        const realMetrics: RealDiagnosticMetrics = {
          availableTests: availableTests?.length || 0,
          completedDiagnostics,
          averageScore: Math.round(averageScore),
          lastDiagnosticDate: userResults?.[0]?.completed_at || null,
          totalAttempts,
          skillDistribution,
          progressTrend,
          readinessLevel: Math.round(readinessLevel)
        };

        setMetrics(realMetrics);
        setError(null);
      } catch (err) {
        console.error('Error fetching real diagnostic data:', err);
        setError('No se pudieron cargar los datos reales');
        // Fallback to minimal real data
        setMetrics({
          availableTests: 0,
          completedDiagnostics: 0,
          averageScore: 0,
          lastDiagnosticDate: null,
          totalAttempts: 0,
          skillDistribution: {},
          progressTrend: 'stable',
          readinessLevel: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, [user?.id]);

  return { metrics, isLoading, error, refetch: () => {} };
};
