
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealProgressMetrics {
  overallProgress: number;
  learningVelocity: number;
  retentionRate: number;
  cognitiveLoad: number;
  weeklyGrowth: number;
  totalSessions: number;
  streakDays: number;
  completedNodes: number;
  totalNodes: number;
  totalStudyTime: number;
  subjectProgress: Record<string, number>;
}

export const useRealProgressData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgressData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Obtener progreso de nodos
      const { data: nodeProgressData } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes!inner(subject_area, test_id)
        `)
        .eq('user_id', user.id);

      // Obtener intentos de ejercicios
      const { data: exerciseAttemptsData } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      // Obtener resultados diagnósticos
      const { data: diagnosticData } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      const nodeProgress = nodeProgressData || [];
      const exerciseAttempts = exerciseAttemptsData || [];
      const diagnostics = diagnosticData || [];

      // Calcular métricas
      const totalNodes = nodeProgress.length || 1;
      const completedNodes = nodeProgress.filter(np => np.status === 'completed').length;
      const overallProgress = Math.round((completedNodes / totalNodes) * 100);

      // Calcular velocidad de aprendizaje basada en actividad reciente
      const recentAttempts = exerciseAttempts.slice(0, 20);
      const correctRecent = recentAttempts.filter(ea => ea.is_correct).length;
      const learningVelocity = recentAttempts.length > 0 
        ? Math.round((correctRecent / recentAttempts.length) * 100)
        : 0;

      // Calcular tasa de retención del dominio de nodos
      const avgMastery = nodeProgress.length > 0
        ? nodeProgress.reduce((sum, np) => sum + (np.mastery_level || 0), 0) / nodeProgress.length
        : 0;
      const retentionRate = Math.round(avgMastery * 100);

      // Calcular carga cognitiva (inverso de tasa de éxito)
      const avgSuccessRate = nodeProgress.length > 0
        ? nodeProgress.reduce((sum, np) => sum + (np.success_rate || 0), 0) / nodeProgress.length
        : 0.5;
      const cognitiveLoad = Math.round((1 - avgSuccessRate) * 100);

      // Calcular crecimiento semanal
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentActivity = nodeProgress.filter(np => 
        np.last_activity_at && new Date(np.last_activity_at) > weekAgo
      ).length;
      const weeklyGrowth = Math.round((recentActivity / Math.max(totalNodes, 1)) * 100);

      // Calcular tiempo total de estudio en horas
      const totalStudyMinutes = nodeProgress.reduce((sum, np) => sum + (np.time_spent_minutes || 0), 0);
      const totalStudyTime = Math.round(totalStudyMinutes / 60);

      // Calcular racha de días
      const streakDays = calculateStudyStreak(nodeProgress);

      // Calcular sesiones totales
      const totalSessions = exerciseAttempts.length + diagnostics.length;

      // Calcular progreso por materia
      const subjectProgress: Record<string, number> = {};
      const testMapping: Record<number, string> = {
        1: 'COMPETENCIA_LECTORA',
        2: 'MATEMATICA_1',
        3: 'MATEMATICA_2',
        4: 'HISTORIA_CIENCIAS_SOCIALES',
        5: 'CIENCIAS'
      };

      Object.values(testMapping).forEach(subject => {
        const subjectNodes = nodeProgress.filter(np => 
          testMapping[np.learning_nodes?.test_id] === subject
        );
        const subjectCompleted = subjectNodes.filter(np => np.status === 'completed').length;
        subjectProgress[subject] = subjectNodes.length > 0 
          ? Math.round((subjectCompleted / subjectNodes.length) * 100)
          : 0;
      });

      const realMetrics: RealProgressMetrics = {
        overallProgress,
        learningVelocity,
        retentionRate,
        cognitiveLoad,
        weeklyGrowth,
        totalSessions,
        streakDays,
        completedNodes,
        totalNodes,
        totalStudyTime,
        subjectProgress
      };

      setMetrics(realMetrics);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  return { metrics, isLoading, refetch: fetchProgressData };
};

// Función auxiliar para calcular racha de estudio
function calculateStudyStreak(nodeProgress: any[]): number {
  if (!nodeProgress.length) return 0;
  
  const sortedProgress = nodeProgress
    .filter(np => np.last_activity_at)
    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const progress of sortedProgress) {
    const activityDate = new Date(progress.last_activity_at);
    const daysDiff = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      streak++;
      currentDate = activityDate;
    } else {
      break;
    }
  }
  
  return streak;
}
