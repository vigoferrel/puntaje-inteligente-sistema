
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { RealDashboardDataService } from '@/services/dashboard/RealDashboardDataService';
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

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      logger.info('useRealDashboardData', 'Loading dashboard data for user', { userId: user.id });

      const [
        userMetrics,
        systemStatusData,
        diagnosticInfo,
        planInfo,
        calendarInfo,
        lectoGuiaInfo
      ] = await Promise.all([
        RealDashboardDataService.getUserMetrics(user.id),
        RealDashboardDataService.getSystemStatus(),
        RealDashboardDataService.getDiagnosticData(user.id),
        RealDashboardDataService.getPlanData(user.id),
        RealDashboardDataService.getCalendarData(user.id),
        RealDashboardDataService.getLectoGuiaData(user.id)
      ]);

      setMetrics(userMetrics);
      setSystemStatus(systemStatusData);
      setDiagnosticData(diagnosticInfo);
      setPlanData(planInfo);
      setCalendarData(calendarInfo);
      setLectoGuiaData(lectoGuiaInfo);
      
      logger.info('useRealDashboardData', 'Dashboard data loaded successfully');
    } catch (error) {
      logger.error('useRealDashboardData', 'Error loading dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const navigateToSection = (section: string) => {
    const routes = {
      lectoguia: '/lectoguia',
      diagnostico: '/diagnostico',
      ejercicios: '/ejercicios',
      calendario: '/calendario',
      finanzas: '/finanzas',
      plan: '/plan'
    };
    
    const route = routes[section as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  const getSmartRecommendations = (): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Generar recomendaciones basadas en datos reales
    if (metrics.completedNodes < 5) {
      recommendations.push({
        id: 'r1',
        title: 'Completar Nodos Básicos',
        description: `Has completado ${metrics.completedNodes} nodos. Completa más para mejorar tu progreso`,
        priority: 'high',
        action: () => navigate('/lectoguia')
      });
    }

    if (metrics.currentStreak === 0) {
      recommendations.push({
        id: 'r2',
        title: 'Mantener Racha de Estudio',
        description: 'Estudia hoy para comenzar una nueva racha',
        priority: 'urgent',
        action: () => navigate('/diagnostico')
      });
    }

    if (calendarData.events.length === 0) {
      recommendations.push({
        id: 'r3',
        title: 'Programar Evaluaciones',
        description: 'No tienes evaluaciones programadas próximamente',
        priority: 'medium',
        action: () => navigate('/calendario')
      });
    }

    if (!planData.currentPlan) {
      recommendations.push({
        id: 'r4',
        title: 'Crear Plan de Estudio',
        description: 'Genera un plan personalizado para optimizar tu preparación',
        priority: 'high',
        action: () => navigate('/plan')
      });
    }

    if (metrics.weeklyProgress < 50) {
      recommendations.push({
        id: 'r5',
        title: 'Aumentar Actividad Semanal',
        description: `Tu progreso semanal es del ${metrics.weeklyProgress}%. Intenta aumentarlo`,
        priority: 'medium',
        action: () => navigate('/ejercicios')
      });
    }

    return recommendations.slice(0, 6); // Máximo 6 recomendaciones
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
    refreshData: loadData
  };
};
