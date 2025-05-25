import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { toast } from '@/components/ui/use-toast';
import { useExerciseGeneration } from '@/hooks/exercise/use-exercise-generation';

interface DiagnosticIntelligenceState {
  baselineScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  progressTrends: Array<{
    date: string;
    scores: Record<TPAESPrueba, number>;
    improvements: Record<TPAESPrueba, number>;
  }>;
  skillAnalysis: Record<TPAESHabilidad, {
    level: number;
    trend: 'improving' | 'stable' | 'declining';
    exercises_completed: number;
    accuracy_rate: number;
    time_spent_minutes: number;
    recommendations: string[];
  }> | null;
  personalizedStrategies: Array<{
    area: TPAESPrueba | TPAESHabilidad;
    priority: 'high' | 'medium' | 'low';
    strategy: string;
    exercises: Array<{
      type: 'official_paes' | 'ai_generated' | 'lectoguia';
      difficulty: 'basic' | 'intermediate' | 'advanced';
      estimated_time: number;
      skills_targeted: TPAESHabilidad[];
    }>;
    estimated_improvement: number;
  }>;
  predictedScores: Record<TPAESPrueba, number> | null;
  isLoading: boolean;
  needsInitialAssessment: boolean;
  lastAssessmentDate: string | null;
  nextRecommendedAssessment: string | null;
}

export const useDiagnosticIntelligence = (userId: string | undefined) => {
  const [state, setState] = useState<DiagnosticIntelligenceState>({
    baselineScores: null,
    currentScores: null,
    progressTrends: [],
    skillAnalysis: null,
    personalizedStrategies: [],
    predictedScores: null,
    isLoading: true,
    needsInitialAssessment: false,
    lastAssessmentDate: null,
    nextRecommendedAssessment: null
  });

  const { generateExercise } = useExerciseGeneration();

  // Cargar datos del usuario
  const loadUserData = useCallback(async () => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Cargar resultados de diagnósticos - usando la tabla correcta
      const { data: diagnosticResults } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      // Cargar intentos de ejercicios para análisis de habilidades
      const { data: exerciseAttempts } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Cargar progreso de nodos
      const { data: nodeProgress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      // Procesar datos para generar estado
      const processedState = await processIntelligenceData(
        diagnosticResults || [],
        exerciseAttempts || [],
        nodeProgress || []
      );

      setState(prev => ({
        ...prev,
        ...processedState,
        isLoading: false
      }));

    } catch (error) {
      console.error('Error loading diagnostic intelligence data:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de diagnóstico",
        variant: "destructive"
      });
    }
  }, [userId]);

  // Procesar datos para inteligencia diagnóstica
  const processIntelligenceData = async (
    diagnosticResults: any[],
    exerciseAttempts: any[],
    nodeProgress: any[]
  ) => {
    // Determinar si necesita evaluación inicial
    const needsInitialAssessment = diagnosticResults.length === 0;

    if (needsInitialAssessment) {
      return { needsInitialAssessment: true };
    }

    // Calcular puntajes base y actuales
    const firstResult = diagnosticResults[diagnosticResults.length - 1];
    const latestResult = diagnosticResults[0];

    const baselineScores = firstResult?.results || {};
    const currentScores = latestResult?.results || {};

    // Calcular tendencias de progreso
    const progressTrends = diagnosticResults.slice(0, 10).reverse().map((result, index) => {
      const prevResult = index > 0 ? diagnosticResults[diagnosticResults.length - index] : null;
      const improvements: Record<TPAESPrueba, number> = {} as Record<TPAESPrueba, number>;
      
      if (prevResult) {
        Object.keys(result.results).forEach(prueba => {
          const currentScore = result.results[prueba] || 0;
          const prevScore = prevResult.results[prueba] || 0;
          improvements[prueba as TPAESPrueba] = currentScore - prevScore;
        });
      }
      
      return {
        date: result.completed_at,
        scores: result.results,
        improvements
      };
    });

    // Análisis de habilidades basado en ejercicios
    const skillAnalysis = await analyzeSkillsFromExercises(exerciseAttempts);

    // Generar estrategias personalizadas
    const personalizedStrategies = await generatePersonalizedStrategies(
      currentScores,
      skillAnalysis,
      nodeProgress
    );

    // Predicción de puntajes
    const predictedScores = await predictFutureScores(progressTrends, skillAnalysis);

    return {
      baselineScores,
      currentScores,
      progressTrends,
      skillAnalysis,
      personalizedStrategies,
      predictedScores,
      needsInitialAssessment: false,
      lastAssessmentDate: latestResult?.completed_at,
      nextRecommendedAssessment: calculateNextAssessmentDate(latestResult?.completed_at)
    };
  };

  // Análisis de habilidades desde ejercicios
  const analyzeSkillsFromExercises = async (exerciseAttempts: any[]) => {
    const skillStats: Record<string, any> = {};

    exerciseAttempts.forEach(attempt => {
      const skill = attempt.skill_demonstrated;
      if (!skillStats[skill]) {
        skillStats[skill] = {
          total: 0,
          correct: 0,
          timeSpent: 0,
          recent: []
        };
      }

      skillStats[skill].total++;
      if (attempt.is_correct) skillStats[skill].correct++;
      skillStats[skill].recent.push({
        date: attempt.created_at,
        correct: attempt.is_correct
      });
    });

    // Convertir a formato final con todos los skills requeridos
    const analysis: Record<TPAESHabilidad, any> = {
      'TRACK_LOCATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'INTERPRET_RELATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'EVALUATE_REFLECT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SOLVE_PROBLEMS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'REPRESENT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'MODEL': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'ARGUE_COMMUNICATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'IDENTIFY_THEORIES': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'PROCESS_ANALYZE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'APPLY_PRINCIPLES': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SCIENTIFIC_ARGUMENT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'TEMPORAL_THINKING': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SOURCE_ANALYSIS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'MULTICAUSAL_ANALYSIS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'CRITICAL_THINKING': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'REFLECTION': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] }
    };
    
    Object.entries(skillStats).forEach(([skill, stats]) => {
      const accuracyRate = stats.total > 0 ? stats.correct / stats.total : 0;
      const recentTrend = calculateTrend(stats.recent);
      
      if (skill in analysis) {
        analysis[skill as TPAESHabilidad] = {
          level: accuracyRate,
          trend: recentTrend,
          exercises_completed: stats.total,
          accuracy_rate: accuracyRate,
          time_spent_minutes: Math.round(stats.timeSpent / 60000),
          recommendations: generateSkillRecommendations(skill as TPAESHabilidad, accuracyRate, recentTrend)
        };
      }
    });

    return analysis;
  };

  // Generar estrategias personalizadas
  const generatePersonalizedStrategies = async (
    currentScores: Record<TPAESPrueba, number>,
    skillAnalysis: Record<TPAESHabilidad, any>,
    nodeProgress: any[]
  ) => {
    const strategies = [];

    // Identificar áreas débiles
    const weakAreas = Object.entries(currentScores)
      .filter(([_, score]) => score < 500)
      .sort(([_, a], [__, b]) => a - b);

    for (const [prueba, score] of weakAreas) {
      const strategy = {
        area: prueba as TPAESPrueba,
        priority: score < 400 ? 'high' as const : score < 500 ? 'medium' as const : 'low' as const,
        strategy: generateStrategyText(prueba as TPAESPrueba, score),
        exercises: await generateExerciseRecommendations(prueba as TPAESPrueba, score),
        estimated_improvement: Math.min(100, Math.max(20, (500 - score) * 0.3))
      };
      strategies.push(strategy);
    }

    return strategies;
  };

  // Predicción de puntajes futuros
  const predictFutureScores = async (
    progressTrends: any[],
    skillAnalysis: Record<TPAESHabilidad, any>
  ) => {
    if (progressTrends.length < 2) return null;

    const predictions: Record<TPAESPrueba, number> = {} as Record<TPAESPrueba, number>;

    // Análisis de tendencia simple para cada prueba
    Object.keys(progressTrends[0]?.scores || {}).forEach(prueba => {
      const scores = progressTrends.map(trend => trend.scores[prueba]).filter(Boolean);
      if (scores.length >= 2) {
        const trend = (scores[scores.length - 1] - scores[0]) / scores.length;
        const predicted = scores[scores.length - 1] + (trend * 4); // Proyección a 4 evaluaciones
        predictions[prueba as TPAESPrueba] = Math.max(150, Math.min(850, predicted));
      }
    });

    return predictions;
  };

  // Funciones auxiliares
  const calculateTrend = (recent: any[]) => {
    if (recent.length < 3) return 'stable';
    const recentAccuracy = recent.slice(-5).filter(r => r.correct).length / Math.min(5, recent.length);
    const olderAccuracy = recent.slice(-10, -5).filter(r => r.correct).length / Math.min(5, recent.slice(-10, -5).length);
    
    if (recentAccuracy > olderAccuracy + 0.1) return 'improving';
    if (recentAccuracy < olderAccuracy - 0.1) return 'declining';
    return 'stable';
  };

  const generateSkillRecommendations = (skill: TPAESHabilidad, accuracy: number, trend: string) => {
    const recommendations = [];
    
    if (accuracy < 0.6) {
      recommendations.push(`Enfócate en ejercicios básicos de ${skill}`);
      recommendations.push('Revisa conceptos fundamentales');
    }
    
    if (trend === 'declining') {
      recommendations.push('Necesitas práctica adicional en esta habilidad');
    }
    
    if (accuracy > 0.8) {
      recommendations.push('Prueba ejercicios de mayor dificultad');
    }

    return recommendations;
  };

  const generateStrategyText = (prueba: TPAESPrueba, score: number) => {
    if (score < 400) {
      return `Enfoque intensivo en ${prueba}: Comenzar con conceptos básicos y ejercicios guiados`;
    } else if (score < 500) {
      return `Refuerzo dirigido en ${prueba}: Combinar teoría con práctica progresiva`;
    }
    return `Optimización en ${prueba}: Enfocarse en ejercicios de mayor complejidad`;
  };

  const generateExerciseRecommendations = async (prueba: TPAESPrueba, score: number) => {
    const exercises = [];
    
    // Ejercicios oficiales PAES
    exercises.push({
      type: 'official_paes' as const,
      difficulty: score < 400 ? 'basic' as const : score < 500 ? 'intermediate' as const : 'advanced' as const,
      estimated_time: 45,
      skills_targeted: getSkillsForPrueba(prueba)
    });

    // Ejercicios generados por IA
    exercises.push({
      type: 'ai_generated' as const,
      difficulty: 'intermediate' as const,
      estimated_time: 30,
      skills_targeted: getSkillsForPrueba(prueba)
    });

    // LectoGuía si aplica
    if (prueba === 'COMPETENCIA_LECTORA') {
      exercises.push({
        type: 'lectoguia' as const,
        difficulty: 'intermediate' as const,
        estimated_time: 20,
        skills_targeted: ['INTERPRET_RELATE', 'EVALUATE_REFLECT'] as TPAESHabilidad[]
      });
    }

    return exercises;
  };

  const getSkillsForPrueba = (prueba: TPAESPrueba): TPAESHabilidad[] => {
    const skillMap: Record<TPAESPrueba, TPAESHabilidad[]> = {
      'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
      'MATEMATICA_2': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
      'CIENCIAS': ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
      'HISTORIA': ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING']
    };
    return skillMap[prueba] || [];
  };

  const calculateNextAssessmentDate = (lastDate: string) => {
    if (!lastDate) return null;
    const last = new Date(lastDate);
    const next = new Date(last);
    next.setDate(next.getDate() + 14); // Cada 2 semanas
    return next.toISOString();
  };

  // Acciones principales
  const performInitialAssessment = useCallback(async () => {
    setState(prev => ({ ...prev, needsInitialAssessment: false }));
    // Redirigir al sistema de diagnóstico tradicional para evaluación inicial
    window.location.href = '/diagnostico';
  }, []);

  const scheduleProgressAssessment = useCallback(async () => {
    // Generar diagnóstico de progreso adaptativo
    toast({
      title: "Evaluación Programada",
      description: "Generando diagnóstico adaptativo personalizado...",
    });
    
    setTimeout(() => {
      window.location.href = '/diagnostico';
    }, 1500);
  }, []);

  const generatePersonalizedExercises = useCallback(async (prueba: TPAESPrueba) => {
    const skills = getSkillsForPrueba(prueba);
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    
    await generateExercise(randomSkill, prueba, 'INTERMEDIATE');
    
    toast({
      title: "Ejercicios Generados",
      description: `Ejercicios personalizados creados para ${prueba}`,
    });
  }, [generateExercise]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    ...state,
    performInitialAssessment,
    scheduleProgressAssessment,
    generatePersonalizedExercises,
    refreshData: loadUserData
  };
};
