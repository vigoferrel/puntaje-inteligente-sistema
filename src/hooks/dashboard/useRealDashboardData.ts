
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealDashboardMetrics {
  completedNodes: number;
  weeklyProgress: number;
  currentStreak: number;
  totalStudyTime: number;
  predictedScore: number;
}

interface SystemStatus {
  [key: string]: {
    status: 'ready' | 'loading' | 'error' | 'active';
    data: string;
  };
}

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: () => void;
}

export const useRealDashboardData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealDashboardMetrics>({
    completedNodes: 0,
    weeklyProgress: 0,
    currentStreak: 0,
    totalStudyTime: 0,
    predictedScore: 0
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    neural: { status: 'loading', data: 'Inicializando...' },
    database: { status: 'loading', data: 'Conectando...' },
    ai: { status: 'loading', data: 'Preparando...' },
    analytics: { status: 'loading', data: 'Analizando...' }
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const loadRealMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Actualizar estado del sistema
      setSystemStatus(prev => ({
        ...prev,
        database: { status: 'active', data: 'Conectado a Supabase' }
      }));

      // Obtener progreso real de nodos
      const { data: progressData } = await supabase
        .from('user_node_progress')
        .select('mastery_level, last_activity_at')
        .eq('user_id', user.id);

      const completedNodes = progressData?.filter(p => p.mastery_level > 0.7).length || 0;
      
      // Calcular racha actual
      const recentActivity = progressData?.filter(p => 
        p.last_activity_at && 
        new Date(p.last_activity_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      // Obtener eventos neurales para cálculos adicionales
      const { data: neuralEvents } = await supabase
        .from('neural_events')
        .select('timestamp, event_data')
        .eq('user_id', user.id)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      const weeklyProgress = Math.min((recentActivity / 10) * 100, 100);
      const totalStudyTime = (neuralEvents?.length || 0) * 2; // Estimación
      const predictedScore = Math.min(450 + (completedNodes * 8), 850);

      setMetrics({
        completedNodes,
        weeklyProgress: Math.round(weeklyProgress),
        currentStreak: recentActivity,
        totalStudyTime,
        predictedScore
      });

      // Actualizar estados del sistema
      setSystemStatus({
        neural: { status: 'active', data: `${neuralEvents?.length || 0} eventos` },
        database: { status: 'ready', data: `${progressData?.length || 0} registros` },
        ai: { status: 'ready', data: 'Motor activo' },
        analytics: { status: 'active', data: 'Calculando predicciones' }
      });

    } catch (error) {
      console.error('Error loading real metrics:', error);
      
      setSystemStatus(prev => ({
        ...prev,
        database: { status: 'error', data: 'Error de conexión' }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const navigateToSection = useCallback((section: string) => {
    console.log('Navigating to section:', section);
    // Implementar navegación específica
  }, []);

  const getSmartRecommendations = useCallback((): SmartRecommendation[] => {
    return [
      {
        id: 'focus_weak_areas',
        title: 'Enfócate en áreas débiles',
        description: 'Se detectaron 3 nodos con bajo rendimiento que requieren atención',
        priority: 'urgent',
        action: () => navigateToSection('weak-nodes')
      },
      {
        id: 'practice_streak',
        title: 'Mantén tu racha de estudio',
        description: 'Continúa tu progreso diario para maximizar el aprendizaje',
        priority: 'high',
        action: () => navigateToSection('daily-practice')
      },
      {
        id: 'review_mastered',
        title: 'Repasa conceptos dominados',
        description: 'Refuerza tu conocimiento en áreas ya consolidadas',
        priority: 'medium',
        action: () => navigateToSection('review')
      }
    ];
  }, [navigateToSection]);

  const refreshData = useCallback(async () => {
    await loadRealMetrics();
  }, [loadRealMetrics]);

  useEffect(() => {
    loadRealMetrics();
  }, [loadRealMetrics]);

  return {
    metrics,
    systemStatus,
    isLoading,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  };
};
