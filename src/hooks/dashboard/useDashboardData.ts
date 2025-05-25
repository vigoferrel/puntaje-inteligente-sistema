
import { useState, useEffect, useCallback } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { useLectoGuiaUnified } from '@/hooks/lectoguia/useLectoGuiaUnified';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardMetrics {
  totalStudyTime: number;
  completedNodes: number;
  weeklyProgress: number;
  nextDeadline: Date | null;
  currentStreak: number;
  skillsImproved: number;
  systemCoherence: number;
}

interface SystemStatus {
  diagnostic: {
    status: 'ready' | 'loading' | 'error';
    data: string;
  };
  plan: {
    status: 'active' | 'pending' | 'error';
    data: string;
  };
  calendar: {
    status: 'active' | 'empty' | 'error';
    data: string;
  };
  lectoguia: {
    status: 'ready' | 'initializing' | 'error';
    data: string;
  };
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudyTime: 0,
    completedNodes: 0,
    weeklyProgress: 0,
    nextDeadline: null,
    currentStreak: 0,
    skillsImproved: 0,
    systemCoherence: 100
  });

  // Hooks de sistemas - corregir nombres de propiedades
  const diagnosticSystem = useDiagnosticSystem();
  const { plans, currentPlan, loading: plansLoading } = useLearningPlans();
  const { events, loading: eventsLoading } = useCalendarEvents();
  const lectoGuiaSystem = useLectoGuiaUnified(user?.id);

  // Calcular métricas unificadas
  const calculateMetrics = useCallback(() => {
    if (!diagnosticSystem.isSystemReady) return;

    const completedNodes = diagnosticSystem.learningNodes.filter(
      node => node.status === 'completed' || (node as any).progress >= 80
    ).length;
    
    const upcomingEvents = events.filter(
      event => new Date(event.start_date) > new Date()
    ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
    const nextDeadline = upcomingEvents.find(
      event => event.event_type === 'deadline'
    );

    const totalNodes = diagnosticSystem.learningNodes.length;
    const weeklyProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

    setMetrics({
      totalStudyTime: completedNodes * 45,
      completedNodes,
      weeklyProgress,
      nextDeadline: nextDeadline ? new Date(nextDeadline.start_date) : null,
      currentStreak: Math.floor(completedNodes / 5),
      skillsImproved: diagnosticSystem.tier1Nodes.length,
      systemCoherence: lectoGuiaSystem.validationStatus.isValid ? 100 : 75
    });
  }, [diagnosticSystem, events, lectoGuiaSystem]);

  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const systemStatus: SystemStatus = {
    diagnostic: {
      status: diagnosticSystem.isSystemReady ? 'ready' : 'loading',
      data: `${diagnosticSystem.learningNodes.length} nodos disponibles`
    },
    plan: {
      status: currentPlan ? 'active' : 'pending',
      data: currentPlan ? currentPlan.title : 'Sin plan activo'
    },
    calendar: {
      status: events.length > 0 ? 'active' : 'empty',
      data: `${events.length} eventos programados`
    },
    lectoguia: {
      status: lectoGuiaSystem.systemState.phase === 'ready' ? 'ready' : 'initializing',
      data: lectoGuiaSystem.validationStatus.isValid ? 'Sistema coherente' : 'Validando...'
    }
  };

  const navigateToSection = useCallback((section: string, context?: any) => {
    switch (section) {
      case 'diagnostic':
        return '/diagnostico';
      case 'plan':
        return '/plan';
      case 'calendar':
        return '/calendario';
      case 'lectoguia':
        return '/lectoguia';
      case 'paes':
        return '/paes';
      case 'ejercicios':
        return '/ejercicios';
      case 'finanzas':
        return '/finanzas';
      default:
        return '/';
    }
  }, []);

  const getSmartRecommendations = useCallback(() => {
    const recommendations = [];

    if (!diagnosticSystem.isSystemReady || diagnosticSystem.learningNodes.length < 10) {
      recommendations.push({
        id: 'run-diagnostic',
        title: 'Ejecutar Diagnóstico Completo',
        description: 'Mejora la precisión de tus recomendaciones',
        priority: 'high',
        action: () => navigateToSection('diagnostic')
      });
    }

    if (!currentPlan) {
      recommendations.push({
        id: 'create-plan',
        title: 'Crear Plan de Estudio',
        description: 'Organiza tu tiempo y objetivos',
        priority: 'medium',
        action: () => navigateToSection('plan')
      });
    }

    if (events.length < 3) {
      recommendations.push({
        id: 'schedule-sessions',
        title: 'Programar Sesiones de Estudio',
        description: 'Establece una rutina consistente',
        priority: 'medium',
        action: () => navigateToSection('calendar')
      });
    }

    if (diagnosticSystem.tier1Nodes.length > 0) {
      const nextNode = diagnosticSystem.tier1Nodes[0];
      recommendations.push({
        id: 'study-next-node',
        title: `Estudiar: ${nextNode.title}`,
        description: `Nodo recomendado de alta prioridad`,
        priority: 'urgent',
        action: () => navigateToSection('lectoguia')
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - 
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  }, [diagnosticSystem, currentPlan, events, navigateToSection]);

  return {
    metrics,
    systemStatus,
    isLoading: plansLoading || eventsLoading,
    isSystemReady: diagnosticSystem.isSystemReady && lectoGuiaSystem.systemState.phase === 'ready',
    diagnosticData: diagnosticSystem,
    planData: { plans, currentPlan },
    calendarData: { events },
    lectoGuiaData: lectoGuiaSystem,
    navigateToSection,
    getSmartRecommendations: getSmartRecommendations(),
    calculateMetrics
  };
};
