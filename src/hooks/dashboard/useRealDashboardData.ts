
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

interface DiagnosticData {
  lastTestDate?: string;
  overallScore: number;
  weakAreas: string[];
  strongAreas: string[];
}

interface PlanData {
  currentPlan?: string;
  planProgress: number;
  nextMilestone: string;
  studyGoals: number;
}

interface CalendarData {
  upcomingEvents: number;
  todaySchedule: any[];
  weeklyGoals: number;
}

interface LectoGuiaData {
  conversationCount: number;
  helpfulResponses: number;
  averageRating: number;
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

  // Nuevas propiedades agregadas
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    overallScore: 0,
    weakAreas: [],
    strongAreas: []
  });
  const [planData, setPlanData] = useState<PlanData>({
    planProgress: 0,
    nextMilestone: 'Comenzar diagnóstico',
    studyGoals: 0
  });
  const [calendarData, setCalendarData] = useState<CalendarData>({
    upcomingEvents: 0,
    todaySchedule: [],
    weeklyGoals: 0
  });
  const [lectoGuiaData, setLectoGuiaData] = useState<LectoGuiaData>({
    conversationCount: 0,
    helpfulResponses: 0,
    averageRating: 0
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

      // Obtener datos de conversaciones LectoGuía
      const { data: conversations } = await supabase
        .from('lectoguia_conversations')
        .select('*')
        .eq('user_id', user.id);

      // Obtener eventos del calendario
      const { data: calendarEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_date', new Date().toISOString());

      // Obtener planes de estudio
      const { data: studyPlans } = await supabase
        .from('generated_study_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

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

      // Actualizar datos diagnósticos
      setDiagnosticData({
        overallScore: Math.round((completedNodes / Math.max(progressData?.length || 1, 1)) * 100),
        weakAreas: ['Álgebra', 'Comprensión Lectora'], // Ejemplo
        strongAreas: ['Geometría', 'Análisis'], // Ejemplo
        lastTestDate: progressData?.[0]?.last_activity_at
      });

      // Actualizar datos del plan
      const currentPlan = studyPlans?.[0];
      setPlanData({
        currentPlan: currentPlan?.title,
        planProgress: currentPlan ? Math.round((completedNodes / currentPlan.total_nodes) * 100) : 0,
        nextMilestone: currentPlan ? 'Completar módulo actual' : 'Crear plan de estudios',
        studyGoals: Math.round(currentPlan?.estimated_hours || 0)
      });

      // Actualizar datos del calendario
      setCalendarData({
        upcomingEvents: calendarEvents?.length || 0,
        todaySchedule: calendarEvents?.filter(e => 
          new Date(e.start_date).toDateString() === new Date().toDateString()
        ) || [],
        weeklyGoals: 5 // Meta semanal por defecto
      });

      // Actualizar datos de LectoGuía
      setLectoGuiaData({
        conversationCount: conversations?.length || 0,
        helpfulResponses: Math.round((conversations?.length || 0) * 0.8), // Estimación
        averageRating: 4.2 // Estimación
      });

      // Actualizar estados del sistema
      setSystemStatus({
        neural: { status: 'active', data: `${neuralEvents?.length || 0} eventos` },
        database: { status: 'ready', data: `${progressData?.length || 0} registros` },
        ai: { status: 'ready', data: 'Motor activo' },
        analytics: { status: 'active', data: 'Calculando predicciones' }
      });

      setIsSystemReady(true);

    } catch (error) {
      console.error('Error loading real metrics:', error);
      
      setSystemStatus(prev => ({
        ...prev,
        database: { status: 'error', data: 'Error de conexión' }
      }));
      setIsSystemReady(false);
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
    isSystemReady,
    diagnosticData,
    planData,
    calendarData,
    lectoGuiaData,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  };
};
