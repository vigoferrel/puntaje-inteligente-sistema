
import { useCallback } from 'react';
import { useCalendarEvents } from './useCalendarEvents';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';

interface CalendarIntegrationItem {
  id: string;
  title: string;
  type: 'node' | 'exercise' | 'plan' | 'deadline';
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export const useCalendarIntegration = () => {
  const { events, createEvent } = useCalendarEvents();
  const { currentPlan } = useLearningPlans();
  const diagnosticSystem = useDiagnosticSystem();

  // Obtener elementos para programar desde diferentes sistemas
  const getSchedulableItems = useCallback((): CalendarIntegrationItem[] => {
    const items: CalendarIntegrationItem[] = [];

    // Nodos de alta prioridad
    diagnosticSystem.tier1Nodes.slice(0, 10).forEach((node, index) => {
      items.push({
        id: `node-${node.id}`,
        title: `Estudiar: ${node.title}`,
        type: 'node',
        estimatedTime: node.estimatedTimeMinutes,
        priority: index < 3 ? 'high' : 'medium',
        source: 'diagnostic-system'
      });
    });

    // Ejercicios del plan actual
    if (currentPlan && currentPlan.nodes) {
      currentPlan.nodes.slice(0, 5).forEach((planNode) => {
        items.push({
          id: `plan-${planNode.id}`,
          title: `Plan: ${planNode.title}`,
          type: 'exercise',
          estimatedTime: 30,
          priority: planNode.isCompleted ? 'low' : 'medium',
          source: 'learning-plan'
        });
      });
    }

    return items;
  }, [diagnosticSystem.tier1Nodes, currentPlan]);

  // Programar automáticamente un elemento
  const scheduleItem = useCallback(async (
    item: CalendarIntegrationItem,
    preferredDate?: Date,
    timeSlot?: 'morning' | 'afternoon' | 'evening'
  ) => {
    const scheduleDate = preferredDate || new Date();
    
    // Configurar horario según slot preferido
    let hour = 10; // Default morning
    if (timeSlot === 'afternoon') hour = 14;
    if (timeSlot === 'evening') hour = 18;
    
    scheduleDate.setHours(hour, 0, 0, 0);
    
    const endDate = new Date(scheduleDate);
    endDate.setMinutes(endDate.getMinutes() + item.estimatedTime);

    const eventData = {
      title: item.title,
      description: `Programado automáticamente desde ${item.source}`,
      event_type: item.type === 'node' ? 'study_session' : 'reminder' as const,
      start_date: scheduleDate.toISOString(),
      end_date: endDate.toISOString(),
      all_day: false,
      priority: item.priority,
      color: item.priority === 'high' || item.priority === 'critical' ? '#EF4444' : '#3B82F6'
    };

    return await createEvent(eventData);
  }, [createEvent]);

  // Sugerir horarios óptimos basados en eventos existentes
  const suggestOptimalTimes = useCallback((targetDate: Date) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start_date);
      return eventDate.toDateString() === targetDate.toDateString();
    });

    const suggestions = [];
    const timeSlots = [
      { name: 'Mañana temprano', hour: 8 },
      { name: 'Media mañana', hour: 10 },
      { name: 'Tarde', hour: 14 },
      { name: 'Tarde media', hour: 16 },
      { name: 'Noche', hour: 18 }
    ];

    timeSlots.forEach(slot => {
      const slotTime = new Date(targetDate);
      slotTime.setHours(slot.hour, 0, 0, 0);
      
      const hasConflict = dayEvents.some(event => {
        const eventStart = new Date(event.start_date);
        const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
        
        return slotTime >= eventStart && slotTime <= eventEnd;
      });

      if (!hasConflict) {
        suggestions.push({
          time: slotTime,
          label: slot.name,
          available: true
        });
      }
    });

    return suggestions;
  }, [events]);

  // Crear sesión de estudio inteligente
  const createSmartStudySession = useCallback(async (duration: number = 45) => {
    const nextNodes = diagnosticSystem.tier1Nodes.slice(0, 3);
    if (nextNodes.length === 0) return null;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const optimalTimes = suggestOptimalTimes(tomorrow);
    const preferredTime = optimalTimes[0]?.time || tomorrow;

    const endTime = new Date(preferredTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    const sessionData = {
      title: `Sesión: ${nextNodes[0].title}`,
      description: `Sesión inteligente programada automáticamente. Nodos: ${nextNodes.map(n => n.title).join(', ')}`,
      event_type: 'study_session' as const,
      start_date: preferredTime.toISOString(),
      end_date: endTime.toISOString(),
      all_day: false,
      priority: 'high' as const,
      color: '#10B981'
    };

    return await createEvent(sessionData);
  }, [diagnosticSystem.tier1Nodes, suggestOptimalTimes, createEvent]);

  return {
    // Datos
    events,
    schedulableItems: getSchedulableItems(),
    
    // Funciones
    scheduleItem,
    suggestOptimalTimes,
    createSmartStudySession,
    
    // Estados
    hasUpcomingEvents: events.filter(e => new Date(e.start_date) > new Date()).length > 0,
    todayEvents: events.filter(e => {
      const eventDate = new Date(e.start_date);
      const today = new Date();
      return eventDate.toDateString() === today.toDateString();
    })
  };
};
