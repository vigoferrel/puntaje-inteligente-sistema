
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealDashboardMetrics {
  completedNodes: number;
  weeklyProgress: number;
  currentStreak: number;
  totalStudyTime: number;
  predictedScore: number;
  userId: string;
  lastActivity: string;
}

interface SystemStatus {
  [key: string]: {
    status: 'ready' | 'loading' | 'error' | 'active';
    data: string;
  };
}

export const useRealDashboardData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealDashboardMetrics>({
    completedNodes: 0,
    weeklyProgress: 0,
    currentStreak: 0,
    totalStudyTime: 0,
    predictedScore: 450,
    userId: '',
    lastActivity: new Date().toISOString()
  });
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    neural: { status: 'loading', data: 'Conectando...' },
    database: { status: 'loading', data: 'Conectando...' },
    ai: { status: 'loading', data: 'Inicializando...' },
    analytics: { status: 'loading', data: 'Calculando...' }
  });

  const [isLoading, setIsLoading] = useState(true);

  const loadRealMetrics = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('📊 Cargando métricas REALES del usuario:', user.id);

      // Cargar progreso real del usuario
      const { data: userProgress, error: progressError } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        console.warn('Error loading user progress:', progressError);
      }

      // Cargar análisis de evaluaciones del usuario
      const { data: userAnalysis, error: analysisError } = await supabase
        .from('analisis_evaluacion')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (analysisError) {
        console.warn('Error loading user analysis:', analysisError);
      }

      // Cargar eventos del calendario del usuario
      const { data: userCalendar, error: calendarError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_date', new Date().toISOString())
        .order('start_date');

      if (calendarError) {
        console.warn('Error loading calendar:', calendarError);
      }

      // Calcular métricas REALES basadas en datos del usuario
      const completedNodes = userProgress?.filter(p => p.status === 'completed').length || 0;
      const totalNodes = userProgress?.length || 1;
      const totalStudyTime = userProgress?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
      
      // Progreso semanal basado en actividad real
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentProgress = userProgress?.filter(p => 
        p.last_activity_at && new Date(p.last_activity_at) >= oneWeekAgo
      ) || [];
      const weeklyProgress = recentProgress.length > 0 
        ? Math.round((recentProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / recentProgress.length))
        : 0;

      // Calcular racha real
      const sortedActivities = userProgress?.filter(p => p.last_activity_at)
        .sort((a, b) => new Date(b.last_activity_at!).getTime() - new Date(a.last_activity_at!).getTime()) || [];
      
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const activity of sortedActivities) {
        const activityDate = new Date(activity.last_activity_at!);
        activityDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === currentStreak) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Puntaje predictivo basado en análisis real
      const avgAnalysisScore = userAnalysis?.length 
        ? userAnalysis.reduce((sum, a) => sum + (a.nivel_habilidad_estimado || 0), 0) / userAnalysis.length
        : 0;
      const predictedScore = Math.min(850, 450 + (avgAnalysisScore * 400) + (completedNodes * 5));

      setMetrics({
        completedNodes,
        weeklyProgress,
        currentStreak,
        totalStudyTime: Math.round(totalStudyTime / 60), // convertir a horas
        predictedScore: Math.round(predictedScore),
        userId: user.id,
        lastActivity: sortedActivities[0]?.last_activity_at || new Date().toISOString()
      });

      setSystemStatus({
        neural: { 
          status: 'active', 
          data: `${completedNodes} nodos procesados`
        },
        database: { 
          status: 'ready', 
          data: `${totalNodes} nodos disponibles`
        },
        ai: { 
          status: userAnalysis?.length ? 'active' : 'ready',
          data: `${userAnalysis?.length || 0} análisis completados`
        },
        analytics: { 
          status: 'active', 
          data: `${Math.round(weeklyProgress)}% progreso semanal`
        }
      });

      console.log(`✅ Métricas REALES cargadas: ${completedNodes} nodos, ${weeklyProgress}% progreso`);

    } catch (error) {
      console.error('❌ Error loading REAL dashboard data:', error);
      
      setSystemStatus(prev => ({
        ...prev,
        database: { status: 'error', data: 'Error de conexión' },
        neural: { status: 'error', data: 'Sistema offline' }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const navigateToSection = useCallback((section: string) => {
    console.log('🧭 Navegando a sección:', section);
    // Scroll suave a la sección
    const element = document.querySelector(`[data-section="${section}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadRealMetrics();
      
      // Actualizar cada 2 minutos para datos frescos
      const interval = setInterval(loadRealMetrics, 120000);
      return () => clearInterval(interval);
    }
  }, [loadRealMetrics, user?.id]);

  return {
    metrics,
    systemStatus,
    isLoading,
    navigateToSection,
    refreshData: loadRealMetrics
  };
};
