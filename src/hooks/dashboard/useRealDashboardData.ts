
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface DashboardMetrics {
  completedNodes: number;
  weeklyProgress: number;
  totalStudyTime: number;
  currentStreak: number;
  nextDeadline?: Date;
}

interface SystemStatus {
  [key: string]: {
    status: 'ready' | 'loading' | 'error' | 'active' | 'initializing';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    completedNodes: 0,
    weeklyProgress: 0,
    totalStudyTime: 0,
    currentStreak: 0
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({});
  const [diagnosticData, setDiagnosticData] = useState<any>({
    learningNodes: [],
    tier1Nodes: []
  });
  const [planData, setPlanData] = useState<any>({
    plans: [],
    currentPlan: undefined
  });
  const [calendarData, setCalendarData] = useState<any>({ events: [] });
  const [lectoGuiaData, setLectoGuiaData] = useState<any>({
    enabled: true,
    sessionCount: 0,
    totalMessages: 0
  });

  const loadRealData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      logger.info('useRealDashboardData', 'Loading real dashboard data for user', { userId: user.id });

      // Cargar métricas reales del usuario usando solo columnas existentes
      const [
        nodeProgressData,
        exerciseAttemptsData,
        plansData,
        eventsData,
        conversationsData
      ] = await Promise.all([
        supabase
          .from('user_node_progress')
          .select('mastery_level, last_activity_at')
          .eq('user_id', user.id),
        
        supabase
          .from('user_exercise_attempts')
          .select('created_at, is_correct')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('generated_study_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true),
        
        supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .gte('start_date', new Date().toISOString()),
        
        supabase
          .from('lectoguia_conversations')
          .select('session_id, created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Calcular métricas reales usando datos disponibles
      const completedNodes = nodeProgressData.data?.filter(n => n.mastery_level > 0.8).length || 0;
      const weeklyExercises = exerciseAttemptsData.data?.length || 0;
      const weeklyCorrect = exerciseAttemptsData.data?.filter(e => e.is_correct).length || 0;
      const weeklyProgress = weeklyExercises > 0 ? (weeklyCorrect / weeklyExercises) * 100 : 0;

      // Calcular racha de estudio usando last_activity_at
      const activityDates = (nodeProgressData.data || [])
        .filter(n => n.last_activity_at)
        .map(n => new Date(n.last_activity_at).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort();
      
      let currentStreak = 0;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      
      if (activityDates.includes(today) || activityDates.includes(yesterday)) {
        currentStreak = 1;
        // Calcular racha completa hacia atrás
        for (let i = activityDates.length - 2; i >= 0; i--) {
          const prevDate = new Date(activityDates[i + 1]);
          const currDate = new Date(activityDates[i]);
          const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (24 * 60 * 60 * 1000));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      const realMetrics = {
        completedNodes,
        weeklyProgress: Math.round(weeklyProgress),
        totalStudyTime: weeklyExercises * 3, // Estimación: 3 min por ejercicio
        currentStreak
      };

      // Estado del sistema real
      const realSystemStatus = {
        database: { status: 'ready' as const, data: 'Conectado a Supabase' },
        diagnostics: { status: completedNodes > 0 ? 'active' as const : 'ready' as const, data: `${completedNodes} nodos completados` },
        exercises: { status: weeklyExercises > 0 ? 'active' as const : 'ready' as const, data: `${weeklyExercises} ejercicios esta semana` },
        plans: { status: (plansData.data?.length || 0) > 0 ? 'active' as const : 'ready' as const, data: `${plansData.data?.length || 0} planes activos` }
      };

      // Datos reales de diagnóstico
      const { data: learningNodesData } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('tier_priority', 'tier1_critico')
        .limit(10);

      const realDiagnosticData = {
        learningNodes: learningNodesData || [],
        tier1Nodes: learningNodesData || []
      };

      // Datos reales de planes
      const realPlanData = {
        plans: plansData.data || [],
        currentPlan: plansData.data?.[0] || undefined
      };

      // Datos reales de calendario
      const realCalendarData = {
        events: (eventsData.data || []).map(event => ({
          id: event.id,
          title: event.title,
          date: event.start_date,
          type: event.event_type
        }))
      };

      // Datos reales de LectoGuía
      const sessionIds = [...new Set(conversationsData.data?.map(c => c.session_id) || [])];
      const realLectoGuiaData = {
        enabled: true,
        sessionCount: sessionIds.length,
        totalMessages: conversationsData.data?.length || 0
      };

      // Actualizar todos los estados con datos reales
      setMetrics(realMetrics);
      setSystemStatus(realSystemStatus);
      setDiagnosticData(realDiagnosticData);
      setPlanData(realPlanData);
      setCalendarData(realCalendarData);
      setLectoGuiaData(realLectoGuiaData);
      
      logger.info('useRealDashboardData', 'Real dashboard data loaded successfully', realMetrics);
    } catch (error) {
      logger.error('useRealDashboardData', 'Error loading real dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealData();
  }, [user?.id]);

  const navigateToSection = (section: string) => {
    const routes = {
      lectoguia: '/lectoguia',
      diagnostico: '/diagnostic',
      ejercicios: '/exercise-generator',
      calendario: '/calendar',
      finanzas: '/financial',
      plan: '/plans'
    };
    
    const route = routes[section as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  const getSmartRecommendations = (): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    if (metrics.completedNodes < 5) {
      recommendations.push({
        id: 'r1',
        title: 'Completar Nodos Básicos',
        description: `Has completado ${metrics.completedNodes} nodos. Completa más para mejorar tu progreso`,
        priority: 'high',
        action: () => navigate('/diagnostic')
      });
    }

    if (metrics.currentStreak === 0) {
      recommendations.push({
        id: 'r2',
        title: 'Mantener Racha de Estudio',
        description: 'Estudia hoy para comenzar una nueva racha',
        priority: 'urgent',
        action: () => navigate('/exercise-generator')
      });
    }

    if (calendarData.events.length === 0) {
      recommendations.push({
        id: 'r3',
        title: 'Programar Evaluaciones',
        description: 'No tienes evaluaciones programadas próximamente',
        priority: 'medium',
        action: () => navigate('/evaluations')
      });
    }

    if (!planData.currentPlan) {
      recommendations.push({
        id: 'r4',
        title: 'Crear Plan de Estudio',
        description: 'Genera un plan personalizado para optimizar tu preparación',
        priority: 'high',
        action: () => navigate('/plans')
      });
    }

    if (metrics.weeklyProgress < 50) {
      recommendations.push({
        id: 'r5',
        title: 'Aumentar Actividad Semanal',
        description: `Tu progreso semanal es del ${metrics.weeklyProgress}%. Intenta aumentarlo`,
        priority: 'medium',
        action: () => navigate('/exercise-generator')
      });
    }

    return recommendations.slice(0, 6);
  };

  const isSystemReady = Object.values(systemStatus).every(
    status => status.status === 'ready' || status.status === 'active'
  );

  return {
    metrics,
    systemStatus,
    isLoading,
    isSystemReady,
    diagnosticData,
    planData,
    calendarData,
    lectoGuiaData,
    navigateToSection,
    getSmartRecommendations,
    refreshData: loadRealData
  };
};
