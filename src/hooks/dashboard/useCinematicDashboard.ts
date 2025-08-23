
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RealDashboardData {
  stats: {
    nodes: number;
    completedNodes: number;
    totalStudyTime: number;
    currentStreak: number;
  };
  system: {
    isInitialized: boolean;
    isLoading: boolean;
    phase: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    targetCareer?: string;
    learningPhase?: string;
  };
  progress: {
    globalProgress: number;
    weeklyGoal: number;
    studyStreak: number;
    totalStudyTime: number;
  };
  performance: {
    averageScore: number;
    targetScore: number;
    improvement: number;
    lastTestDate?: string;
  };
}

export const useCinematicDashboard = () => {
  const { user } = useAuth();

  // Cargar datos del perfil del usuario
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error cargando perfil:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id
  });

  // Cargar progreso de nodos
  const { data: nodeProgress } = useQuery({
    queryKey: ['user-node-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cargando progreso de nodos:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id
  });

  // Cargar logros del usuario
  const { data: achievements } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error cargando logros:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id
  });

  // Cargar métricas neurales reales
  const { data: neuralMetrics } = useQuery({
    queryKey: ['neural-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('neural_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('last_calculated_at', { ascending: false });

      if (error) {
        console.error('Error cargando métricas neurales:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id
  });

  const dashboardData = useMemo((): RealDashboardData => {
    const completedNodes = nodeProgress?.filter(np => np.status === 'completed').length || 0;
    const totalNodes = nodeProgress?.length || 0;
    const totalStudyTime = nodeProgress?.reduce((sum, np) => sum + (np.time_spent_minutes || 0), 0) || 0;
    
    // Calcular racha de estudio basada en actividad reciente
    const studyStreak = calculateStudyStreak(nodeProgress || []);
    
    // Calcular progreso global
    const globalProgress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
    
    // Obtener último puntaje de pruebas diagnósticas
    const lastScore = getLastDiagnosticScore(nodeProgress || []);
    
    return {
      stats: {
        nodes: totalNodes,
        completedNodes,
        totalStudyTime: Math.round(totalStudyTime / 60), // convertir a horas
        currentStreak: studyStreak,
      },
      system: {
        isInitialized: !!profile,
        isLoading: false,
        phase: profile?.learning_phase || 'DIAGNOSIS',
      },
      user: {
        id: user?.id || '',
        name: profile?.name || user?.email?.split('@')[0] || 'Usuario',
        email: user?.email || '',
        targetCareer: profile?.target_career,
        learningPhase: profile?.learning_phase,
      },
      progress: {
        globalProgress,
        weeklyGoal: 85,
        studyStreak,
        totalStudyTime: Math.round(totalStudyTime / 60),
      },
      performance: {
        averageScore: lastScore,
        targetScore: profile?.target_score || 700,
        improvement: calculateImprovement(nodeProgress || []),
        lastTestDate: getLastTestDate(nodeProgress || []),
      }
    };
  }, [profile, nodeProgress, achievements, neuralMetrics, user]);

  return dashboardData;
};

// Funciones auxiliares para cálculos
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

function getLastDiagnosticScore(nodeProgress: any[]): number {
  const scoresWithActivity = nodeProgress
    .filter(np => np.last_performance_score && np.last_activity_at)
    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime());
  
  if (scoresWithActivity.length === 0) return 0;
  
  // Convertir a escala PAES (150-850)
  const normalizedScore = scoresWithActivity[0].last_performance_score;
  return Math.round(150 + (normalizedScore * 700));
}

function calculateImprovement(nodeProgress: any[]): number {
  if (nodeProgress.length < 2) return 0;
  
  const recentScores = nodeProgress
    .filter(np => np.last_performance_score && np.last_activity_at)
    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())
    .slice(0, 10);
  
  if (recentScores.length < 2) return 0;
  
  const latestAvg = recentScores.slice(0, 3).reduce((sum, np) => sum + np.last_performance_score, 0) / 3;
  const olderAvg = recentScores.slice(-3).reduce((sum, np) => sum + np.last_performance_score, 0) / 3;
  
  return Math.round((latestAvg - olderAvg) * 100);
}

function getLastTestDate(nodeProgress: any[]): string | undefined {
  const lastActivity = nodeProgress
    .filter(np => np.last_activity_at)
    .sort((a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime())[0];
  
  return lastActivity?.last_activity_at;
}
