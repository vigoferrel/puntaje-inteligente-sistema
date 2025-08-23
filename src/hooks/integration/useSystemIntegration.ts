
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

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action: string;
  estimatedTime?: number;
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

  // Obtener recomendaciones inteligentes mejoradas
  const getSmartRecommendations = useCallback((): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Recomendaciones basadas en estado del sistema
    if (!systemStatus.diagnostic.ready) {
      recommendations.push({
        id: 'run-diagnostic',
        title: 'Ejecutar Diagnóstico',
        description: 'Mejora la precisión del sistema ejecutando un diagnóstico completo',
        priority: 'high',
        action: 'diagnostic',
        estimatedTime: 15
      });
    }

    if (systemStatus.diagnostic.ready && !systemStatus.plan.active) {
      recommendations.push({
        id: 'create-plan',
        title: 'Crear Plan de Estudio',
        description: 'Organiza tu aprendizaje con un plan personalizado',
        priority: 'medium',
        action: 'plan',
        estimatedTime: 5
      });
    }

    if (systemStatus.plan.active && systemStatus.calendar.events < 3) {
      recommendations.push({
        id: 'schedule-sessions',
        title: 'Programar Sesiones',
        description: 'Establece una rutina de estudio consistente',
        priority: 'medium',
        action: 'calendar',
        estimatedTime: 10
      });
    }

    if (systemStatus.diagnostic.tier1 > 0) {
      recommendations.push({
        id: 'continue-study',
        title: 'Continuar Estudio',
        description: `${systemStatus.diagnostic.tier1} nodos críticos requieren atención inmediata`,
        priority: 'urgent',
        action: 'study',
        estimatedTime: 30
      });
    }

    // Recomendaciones avanzadas basadas en progreso
    if (systemStatus.plan.progress > 50 && systemStatus.plan.progress < 80) {
      recommendations.push({
        id: 'intensive-review',
        title: 'Revisión Intensiva',
        description: 'Refuerza conceptos clave antes del examen final',
        priority: 'high',
        action: 'review',
        estimatedTime: 45
      });
    }

    if (systemStatus.overall.coherence < 50) {
      recommendations.push({
        id: 'system-repair',
        title: 'Reparar Sistema',
        description: 'Algunos módulos requieren atención para funcionar correctamente',
        priority: 'high',
        action: 'repair',
        estimatedTime: 10
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - 
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });
  }, [systemStatus]);

  // Sincronización automática mejorada
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
    needsAttention: systemStatus.overall.coherence < 50,
    // Nuevas funciones útiles
    getSystemHealthMessage: () => {
      if (systemStatus.overall.coherence >= 90) return 'Sistema funcionando óptimamente';
      if (systemStatus.overall.coherence >= 75) return 'Sistema funcionando correctamente';
      if (systemStatus.overall.coherence >= 50) return 'Sistema requiere atención';
      return 'Sistema requiere reparación urgente';
    },
    getNextRecommendedAction: () => {
      const recs = getSmartRecommendations();
      return recs.length > 0 ? recs[0] : null;
    }
  };
};
