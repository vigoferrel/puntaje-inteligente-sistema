
import { useState, useCallback, useEffect } from 'react';
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

export const usePAESUnifiedDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testPerformances, setTestPerformances] = useState<PAESTestPerformance[]>([]);
  const [unifiedMetrics, setUnifiedMetrics] = useState<PAESUnifiedMetrics | null>(null);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<PAESComparativeAnalysis | null>(null);
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  // Cargar todos los tests PAES disponibles
  const loadAvailableTests = useCallback(async () => {
    try {
      const { data: tests, error } = await supabase
        .from('paes_tests')
        .select('*')
        .order('id');

      if (error) throw error;
      setAvailableTests(tests || []);
    } catch (error) {
      console.error('Error loading PAES tests:', error);
    }
  }, []);

  // Cargar rendimiento por test
  const loadTestPerformances = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const performances: PAESTestPerformance[] = [];

      // Obtener datos de ejercicios realizados por test
      const { data: attempts, error } = await supabase
        .from('user_exercise_attempts')
        .select(`
          *,
          exercises!inner(
            test_id,
            skill_id,
            difficulty
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Agrupar por test y calcular métricas
      const testGroups = (attempts || []).reduce((groups, attempt) => {
        const testId = attempt.exercises?.test_id;
        if (!testId) return groups;

        if (!groups[testId]) {
          groups[testId] = [];
        }
        groups[testId].push(attempt);
        return groups;
      }, {} as Record<string, any[]>);

      // Calcular métricas para cada test
      for (const [testId, testAttempts] of Object.entries(testGroups)) {
        const test = availableTests.find(t => t.id === parseInt(testId));
        if (!test) continue;

        const totalQuestions = testAttempts.length;
        const correctAnswers = testAttempts.filter(a => a.is_correct).length;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        // Calcular skill breakdown
        const skillBreakdown: Record<string, number> = {};
        testAttempts.forEach(attempt => {
          const skill = attempt.skill_demonstrated || 'unknown';
          skillBreakdown[skill] = (skillBreakdown[skill] || 0) + (attempt.is_correct ? 1 : 0);
        });

        // Proyectar puntaje PAES (escala 150-850)
        const projectedScore = Math.round(150 + (accuracy / 100) * 700);

        // Identificar fortalezas y áreas críticas
        const skillEntries = Object.entries(skillBreakdown);
        const strengths = skillEntries
          .filter(([_, correct]) => correct >= 3)
          .map(([skill]) => skill);
        const criticalAreas = skillEntries
          .filter(([_, correct]) => correct < 2)
          .map(([skill]) => skill);

        performances.push({
          testId: testId,
          testName: test.name,
          testCode: test.code,
          totalQuestions,
          completedQuestions: totalQuestions,
          correctAnswers,
          accuracy,
          averageDifficulty: 1.2, // Placeholder
          projectedScore,
          lastActivity: testAttempts[testAttempts.length - 1]?.created_at || '',
          skillBreakdown,
          criticalAreas,
          strengths
        });
      }

      setTestPerformances(performances);
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
  }, [user?.id, availableTests]);

  // Calcular métricas unificadas
  const calculateUnifiedMetrics = useCallback(() => {
    if (testPerformances.length === 0) return;

    // Calcular puntaje global ponderado
    const weightedScores = testPerformances.map(perf => {
      const weight = perf.testCode.includes('COMPETENCIA_LECTORA') ? 0.25 :
                    perf.testCode.includes('MATEMATICA') ? 0.35 :
                    perf.testCode.includes('CIENCIAS') ? 0.25 :
                    perf.testCode.includes('HISTORIA') ? 0.15 : 0.2;
      return perf.projectedScore * weight;
    });

    const globalScore = Math.round(weightedScores.reduce((sum, score) => sum + score, 0));

    // Determinar nivel de preparación
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

    // Identificar tests prioritarios (menor rendimiento)
    const priorityTests = testPerformances
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 2)
      .map(perf => perf.testName);

    // Calcular probabilidad de admisión (simplificado)
    const projectedAdmissionChance = Math.min(95, Math.max(5, (globalScore - 450) / 4));

    const metrics: PAESUnifiedMetrics = {
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

    setUnifiedMetrics(metrics);
  }, [testPerformances]);

  // Generar análisis comparativo
  const generateComparativeAnalysis = useCallback(() => {
    if (testPerformances.length < 2) return;

    const testComparison: Record<string, any> = {};
    const avgAccuracy = testPerformances.reduce((sum, perf) => sum + perf.accuracy, 0) / testPerformances.length;

    testPerformances.forEach(perf => {
      testComparison[perf.testName] = {
        relative_strength: perf.accuracy - avgAccuracy,
        improvement_potential: 100 - perf.accuracy,
        impact_on_total: perf.testCode.includes('MATEMATICA') ? 0.35 : 0.25
      };
    });

    // Identificar gaps de habilidades críticas
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

    // Generar timeline de estudio
    const timeline = Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      focus_test: testPerformances[i % testPerformances.length]?.testName || '',
      expected_improvement: Math.round(5 + Math.random() * 10)
    }));

    setComparativeAnalysis({
      testComparison,
      skillGaps,
      timeline
    });
  }, [testPerformances]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAvailableTests();
  }, [loadAvailableTests]);

  useEffect(() => {
    if (availableTests.length > 0) {
      loadTestPerformances();
    }
  }, [availableTests, loadTestPerformances]);

  useEffect(() => {
    calculateUnifiedMetrics();
    generateComparativeAnalysis();
  }, [testPerformances, calculateUnifiedMetrics, generateComparativeAnalysis]);

  // Función para simular diferentes escenarios
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

  return {
    loading,
    testPerformances,
    unifiedMetrics,
    comparativeAnalysis,
    availableTests,
    loadTestPerformances,
    simulateScenario,
    refreshData: () => {
      loadAvailableTests();
      loadTestPerformances();
    }
  };
};
