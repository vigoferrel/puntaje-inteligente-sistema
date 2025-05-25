
import { useCallback, useEffect, useState } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useCalendarEvents } from '@/hooks/calendar/useCalendarEvents';
import { useLectoGuiaUnified } from '@/hooks/lectoguia/useLectoGuiaUnified';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SystemStatus {
  diagnostic: { ready: boolean; nodes: number; tier1: number };
  plan: { active: boolean; progress: number; nodes: number };
  calendar: { events: number; nextSession: Date | null };
  lectoguia: { ready: boolean; phase: string };
  overall: { coherence: number; synchronized: boolean };
}

export const useSystemIntegration = () => {
  const { user } = useAuth();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    diagnostic: { ready: false, nodes: 0, tier1: 0 },
    plan: { active: false, progress: 0, nodes: 0 },
    calendar: { events: 0, nextSession: null },
    lectoguia: { ready: false, phase: 'initializing' },
    overall: { coherence: 0, synchronized: false }
  });

  // Hooks de sistemas
  const diagnosticSystem = useDiagnosticSystem();
  const { plans, currentPlan } = useLearningPlans();
  const { events, createEvent } = useCalendarEvents();
  const lectoGuiaSystem = useLectoGuiaUnified(user?.id);

  // Función de sincronización principal
  const synchronizeSystems = useCallback(async () => {
    try {
      console.log('🔄 Iniciando sincronización de sistemas...');

      // Calcular estado actual
      const diagnostic = {
        ready: diagnosticSystem.isSystemReady,
        nodes: diagnosticSystem.learningNodes.length,
        tier1: diagnosticSystem.tier1Nodes.length
      };

      const plan = {
        active: !!currentPlan,
        progress: currentPlan?.progress?.percentage || 0,
        nodes: currentPlan?.nodes?.length || 0
      };

      const calendar = {
        events: events.length,
        nextSession: events.find(e => 
          new Date(e.start_date) > new Date() && e.event_type === 'study_session'
        )?.start_date ? new Date(events.find(e => 
          new Date(e.start_date) > new Date() && e.event_type === 'study_session'
        )!.start_date) : null
      };

      const lectoguia = {
        ready: lectoGuiaSystem.systemState.phase === 'ready',
        phase: lectoGuiaSystem.systemState.phase
      };

      // Calcular coherencia del sistema
      let coherence = 0;
      if (diagnostic.ready) coherence += 25;
      if (plan.active) coherence += 25;
      if (calendar.events > 0) coherence += 25;
      if (lectoguia.ready) coherence += 25;

      const newStatus: SystemStatus = {
        diagnostic,
        plan,
        calendar,
        lectoguia,
        overall: {
          coherence,
          synchronized: coherence >= 75
        }
      };

      setSystemStatus(newStatus);
      setLastSync(new Date());

      // Auto-crear sesiones si es necesario
      if (diagnostic.ready && plan.active && calendar.events < 2) {
        await createSmartStudySession();
      }

      console.log('✅ Sincronización completada:', newStatus);
      
      if (coherence >= 75) {
        toast({
          title: "Sistema Sincronizado",
          description: "Todos los módulos están funcionando correctamente",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      toast({
        title: "Error de Sincronización",
        description: "No se pudieron sincronizar todos los sistemas",
        variant: "destructive"
      });
    }
  }, [diagnosticSystem, currentPlan, events, lectoGuiaSystem, createEvent]);

  // Crear sesión de estudio inteligente
  const createSmartStudySession = useCallback(async () => {
    if (!diagnosticSystem.tier1Nodes.length) return;

    const nextNode = diagnosticSystem.tier1Nodes[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setMinutes(endTime.getMinutes() + nextNode.estimatedTimeMinutes);

    await createEvent({
      title: `Sesión: ${nextNode.title}`,
      description: `Sesión automática generada para estudiar ${nextNode.title}`,
      event_type: 'study_session',
      start_date: tomorrow.toISOString(),
      end_date: endTime.toISOString(),
      all_day: false,
      priority: 'high',
      color: '#10B981',
      related_node_id: nextNode.id
    });

    console.log('📅 Sesión de estudio creada automáticamente');
  }, [diagnosticSystem.tier1Nodes, createEvent]);

  // Obtener recomendaciones inteligentes
  const getSmartRecommendations = useCallback(() => {
    const recommendations = [];

    // Recomendaciones basadas en estado del sistema
    if (!systemStatus.diagnostic.ready) {
      recommendations.push({
        id: 'run-diagnostic',
        title: 'Ejecutar Diagnóstico',
        description: 'Mejora la precisión del sistema',
        priority: 'high',
        action: 'diagnostic'
      });
    }

    if (systemStatus.diagnostic.ready && !systemStatus.plan.active) {
      recommendations.push({
        id: 'create-plan',
        title: 'Crear Plan de Estudio',
        description: 'Organiza tu aprendizaje',
        priority: 'medium',
        action: 'plan'
      });
    }

    if (systemStatus.plan.active && systemStatus.calendar.events < 3) {
      recommendations.push({
        id: 'schedule-sessions',
        title: 'Programar Sesiones',
        description: 'Establece una rutina de estudio',
        priority: 'medium',
        action: 'calendar'
      });
    }

    if (systemStatus.diagnostic.tier1 > 0) {
      recommendations.push({
        id: 'continue-study',
        title: 'Continuar Estudio',
        description: `${systemStatus.diagnostic.tier1} nodos prioritarios disponibles`,
        priority: 'urgent',
        action: 'study'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - 
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  }, [systemStatus]);

  // Sincronización automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && systemStatus.overall.synchronized) {
        synchronizeSystems();
      }
    }, 300000); // 5 minutos

    return () => clearInterval(interval);
  }, [user, systemStatus.overall.synchronized, synchronizeSystems]);

  // Sincronización inicial
  useEffect(() => {
    if (user) {
      setTimeout(synchronizeSystems, 2000);
    }
  }, [user, synchronizeSystems]);

  return {
    systemStatus,
    lastSync,
    synchronizeSystems,
    createSmartStudySession,
    getSmartRecommendations: getSmartRecommendations(),
    isSystemHealthy: systemStatus.overall.coherence >= 75,
    needsAttention: systemStatus.overall.coherence < 50
  };
};
