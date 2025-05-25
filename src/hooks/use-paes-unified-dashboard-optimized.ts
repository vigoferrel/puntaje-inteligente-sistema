
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface PAESTestPerformance {
  testId: string;
  testName: string;
  testCode: string;
  totalQuestions: number;
  completedQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageDifficulty: number;
  projectedScore: number;
  lastActivity: string;
  skillBreakdown: Record<string, number>;
  criticalAreas: string[];
  strengths: string[];
}

export interface PAESUnifiedMetrics {
  globalScore: number;
  readinessLevel: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'REQUIERE_REFUERZO';
  confidenceLevel: number;
  studyTimeNeeded: number;
  priorityTests: string[];
  nextRecommendedAction: string;
  projectedAdmissionChance: number;
}

export interface PAESComparativeAnalysis {
  testComparison: Record<string, {
    relative_strength: number;
    improvement_potential: number;
    impact_on_total: number;
  }>;
  skillGaps: Array<{
    skill: string;
    tests_affected: string[];
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    recommended_hours: number;
  }>;
  timeline: Array<{
    week: number;
    focus_test: string;
    expected_improvement: number;
  }>;
}

// Cache para evitar re-cálculos innecesarios
const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const usePAESUnifiedDashboardOptimized = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testPerformances, setTestPerformances] = useState<PAESTestPerformance[]>([]);
  const [unifiedMetrics, setUnifiedMetrics] = useState<PAESUnifiedMetrics | null>(null);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<PAESComparativeAnalysis | null>(null);
  const [availableTests, setAvailableTests] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<number>(0);

  // Función para verificar cache
  const getCachedData = useCallback((key: string) => {
    const cached = dataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  // Función para guardar en cache
  const setCachedData = useCallback((key: string, data: any) => {
    dataCache.set(key, { data, timestamp: Date.now() });
  }, []);

  // Cargar tests PAES una sola vez
  const loadAvailableTests = useCallback(async () => {
    const cacheKey = 'paes_tests';
    const cached = getCachedData(cacheKey);
    if (cached) {
      setAvailableTests(cached);
      return cached;
    }

    try {
      const { data: tests, error } = await supabase
        .from('paes_tests')
        .select('*')
        .order('id');

      if (error) throw error;
      
      const testsData = tests || [];
      setAvailableTests(testsData);
      setCachedData(cacheKey, testsData);
      return testsData;
    } catch (error) {
      console.error('Error loading PAES tests:', error);
      return [];
    }
  }, [getCachedData, setCachedData]);

  // Optimizar carga de rendimiento usando una sola consulta
  const loadTestPerformances = useCallback(async () => {
    if (!user?.id) return;

    const cacheKey = `test_performances_${user.id}`;
    const cached = getCachedData(cacheKey);
    if (cached && Date.now() - lastRefresh < CACHE_DURATION) {
      setTestPerformances(cached);
      return;
    }

    setLoading(true);
    try {
      // Una sola consulta optimizada con JOIN
      const { data: attempts, error } = await supabase
        .from('user_exercise_attempts')
        .select(`
          *,
          exercises!inner(
            test_id,
            skill_id,
            difficulty,
            paes_tests!inner(id, name, code)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const performances: PAESTestPerformance[] = [];

      // Agrupar y procesar datos eficientemente
      const testGroups = (attempts || []).reduce((groups, attempt) => {
        const testId = attempt.exercises?.test_id;
        if (!testId) return groups;

        if (!groups[testId]) {
          groups[testId] = {
            attempts: [],
            testInfo: attempt.exercises.paes_tests
          };
        }
        groups[testId].attempts.push(attempt);
        return groups;
      }, {} as Record<string, { attempts: any[]; testInfo: any }>);

      // Calcular métricas para cada test
      for (const [testId, { attempts: testAttempts, testInfo }] of Object.entries(testGroups)) {
        if (!testInfo) continue;

        const totalQuestions = testAttempts.length;
        const correctAnswers = testAttempts.filter(a => a.is_correct).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Calcular skill breakdown eficientemente
        const skillBreakdown = testAttempts.reduce((acc, attempt) => {
          const skill = attempt.skill_demonstrated || 'unknown';
          acc[skill] = (acc[skill] || 0) + (attempt.is_correct ? 1 : 0);
          return acc;
        }, {} as Record<string, number>);

        const projectedScore = Math.round(150 + (accuracy / 100) * 700);

        const skillEntries = Object.entries(skillBreakdown);
        const strengths = skillEntries
          .filter(([_, correct]) => correct >= 3)
          .map(([skill]) => skill);
        const criticalAreas = skillEntries
          .filter(([_, correct]) => correct < 2)
          .map(([skill]) => skill);

        performances.push({
          testId: testId,
          testName: testInfo.name,
          testCode: testInfo.code,
          totalQuestions,
          completedQuestions: totalQuestions,
          correctAnswers,
          accuracy,
          averageDifficulty: 1.2,
          projectedScore,
          lastActivity: testAttempts[testAttempts.length - 1]?.created_at || '',
          skillBreakdown,
          criticalAreas,
          strengths
        });
      }

      setTestPerformances(performances);
      setCachedData(cacheKey, performances);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Error loading test performances:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las métricas de rendimiento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCachedData, setCachedData, lastRefresh]);

  // Memoizar cálculo de métricas unificadas
  const unifiedMetricsCalculated = useMemo(() => {
    if (testPerformances.length === 0) return null;

    const weightedScores = testPerformances.map(perf => {
      const weight = perf.testCode.includes('COMPETENCIA_LECTORA') ? 0.25 :
                    perf.testCode.includes('MATEMATICA') ? 0.35 :
                    perf.testCode.includes('CIENCIAS') ? 0.25 :
                    perf.testCode.includes('HISTORIA') ? 0.15 : 0.2;
      return perf.projectedScore * weight;
    });

    const globalScore = Math.round(weightedScores.reduce((sum, score) => sum + score, 0));

    let readinessLevel: PAESUnifiedMetrics['readinessLevel'];
    let confidenceLevel: number;
    let studyTimeNeeded: number;

    if (globalScore >= 650) {
      readinessLevel = 'EXCELENTE';
      confidenceLevel = 90;
      studyTimeNeeded = 20;
    } else if (globalScore >= 550) {
      readinessLevel = 'BUENO';
      confidenceLevel = 75;
      studyTimeNeeded = 60;
    } else if (globalScore >= 450) {
      readinessLevel = 'REGULAR';
      confidenceLevel = 60;
      studyTimeNeeded = 100;
    } else {
      readinessLevel = 'REQUIERE_REFUERZO';
      confidenceLevel = 40;
      studyTimeNeeded = 160;
    }

    const priorityTests = testPerformances
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2)
      .map(perf => perf.testName);

    const projectedAdmissionChance = Math.min(95, Math.max(5, (globalScore - 450) / 4));

    return {
      globalScore,
      readinessLevel,
      confidenceLevel,
      studyTimeNeeded,
      priorityTests,
      nextRecommendedAction: priorityTests.length > 0 
        ? `Enfócate en ${priorityTests[0]}` 
        : 'Mantén el nivel actual',
      projectedAdmissionChance
    };
  }, [testPerformances]);

  // Memoizar análisis comparativo
  const comparativeAnalysisCalculated = useMemo(() => {
    if (testPerformances.length < 2) return null;

    const testComparison: Record<string, any> = {};
    const avgAccuracy = testPerformances.reduce((sum, perf) => sum + perf.accuracy, 0) / testPerformances.length;

    testPerformances.forEach(perf => {
      testComparison[perf.testName] = {
        relative_strength: perf.accuracy - avgAccuracy,
        improvement_potential: 100 - perf.accuracy,
        impact_on_total: perf.testCode.includes('MATEMATICA') ? 0.35 : 0.25
      };
    });

    const allSkills = new Set<string>();
    testPerformances.forEach(perf => {
      Object.keys(perf.skillBreakdown).forEach(skill => allSkills.add(skill));
    });

    const skillGaps = Array.from(allSkills).map(skill => {
      const testsAffected = testPerformances
        .filter(perf => (perf.skillBreakdown[skill] || 0) < 2)
        .map(perf => perf.testName);

      let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      if (testsAffected.length >= 3) severity = 'HIGH';
      else if (testsAffected.length >= 2) severity = 'MEDIUM';

      return {
        skill,
        tests_affected: testsAffected,
        severity,
        recommended_hours: testsAffected.length * 8
      };
    }).filter(gap => gap.tests_affected.length > 0);

    const timeline = Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      focus_test: testPerformances[i % testPerformances.length]?.testName || '',
      expected_improvement: Math.round(5 + Math.random() * 10)
    }));

    return {
      testComparison,
      skillGaps,
      timeline
    };
  }, [testPerformances]);

  // Actualizar estados cuando cambien los cálculos
  useEffect(() => {
    setUnifiedMetrics(unifiedMetricsCalculated);
  }, [unifiedMetricsCalculated]);

  useEffect(() => {
    setComparativeAnalysis(comparativeAnalysisCalculated);
  }, [comparativeAnalysisCalculated]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAvailableTests();
  }, [loadAvailableTests]);

  useEffect(() => {
    if (availableTests.length > 0) {
      loadTestPerformances();
    }
  }, [availableTests.length, loadTestPerformances]);

  const simulateScenario = useCallback((improvements: Record<string, number>) => {
    const simulatedPerformances = testPerformances.map(perf => ({
      ...perf,
      accuracy: Math.min(100, perf.accuracy + (improvements[perf.testName] || 0)),
      projectedScore: Math.round(150 + (Math.min(100, perf.accuracy + (improvements[perf.testName] || 0)) / 100) * 700)
    }));

    const weightedScores = simulatedPerformances.map(perf => {
      const weight = perf.testCode.includes('COMPETENCIA_LECTORA') ? 0.25 :
                    perf.testCode.includes('MATEMATICA') ? 0.35 :
                    perf.testCode.includes('CIENCIAS') ? 0.25 :
                    perf.testCode.includes('HISTORIA') ? 0.15 : 0.2;
      return perf.projectedScore * weight;
    });

    return Math.round(weightedScores.reduce((sum, score) => sum + score, 0));
  }, [testPerformances]);

  const refreshData = useCallback(() => {
    // Limpiar cache específico del usuario
    const userCacheKeys = Array.from(dataCache.keys()).filter(key => 
      key.includes(user?.id || '')
    );
    userCacheKeys.forEach(key => dataCache.delete(key));
    
    setLastRefresh(0);
    loadTestPerformances();
  }, [user?.id, loadTestPerformances]);

  return {
    loading,
    testPerformances,
    unifiedMetrics,
    comparativeAnalysis,
    availableTests,
    refreshData,
    simulateScenario
  };
};
