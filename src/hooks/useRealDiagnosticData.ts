
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

      // Obtener resultados diagnósticos del usuario
      const { data: diagnosticResults, error: diagnosticError } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (diagnosticError) {
        console.error('Error fetching diagnostic results:', diagnosticError);
        throw diagnosticError;
      }

      // Obtener tests diagnósticos disponibles
      const { data: availableTests, error: testsError } = await supabase
        .from('diagnostic_tests')
        .select('*');

      if (testsError) {
        console.error('Error fetching available tests:', testsError);
      }

      const results = diagnosticResults || [];
      const tests = availableTests || [];

      // Calcular métricas
      const completedDiagnostics = results.length;
      const availableTestsCount = tests.length;

      // Calcular nivel de preparación basado en resultados
      let readinessLevel = 0;
      let averageScore = 0;
      let strongAreas: string[] = [];
      let weakAreas: string[] = [];
      let progressTrend: 'up' | 'down' | 'stable' = 'stable';

      if (results.length > 0) {
        const latestResult = results[0];
        const resultData = latestResult.results;

        if (resultData && typeof resultData === 'object') {
          const scores = Object.values(resultData).filter(score => typeof score === 'number') as number[];
          if (scores.length > 0) {
            averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
            readinessLevel = Math.min(100, Math.max(0, (averageScore - 150) / 7)); // Escala PAES a porcentaje
          }

          // Identificar áreas fuertes y débiles
          Object.entries(resultData).forEach(([area, score]) => {
            if (typeof score === 'number') {
              if (score > 600) {
                strongAreas.push(area);
              } else if (score < 450) {
                weakAreas.push(area);
              }
            }
          });
        }

        // Calcular tendencia de progreso comparando últimos resultados
        if (results.length > 1) {
          const previousResult = results[1];
          const previousData = previousResult.results;
          
          if (previousData && typeof previousData === 'object') {
            const previousScores = Object.values(previousData).filter(score => typeof score === 'number') as number[];
            if (previousScores.length > 0) {
              const previousAverage = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length;
              if (averageScore > previousAverage + 10) {
                progressTrend = 'up';
              } else if (averageScore < previousAverage - 10) {
                progressTrend = 'down';
              }
            }
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
        lastDiagnosticDate: results.length > 0 ? results[0].completed_at : null,
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
