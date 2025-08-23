/**
 * ================================================================================
 * 🗓️ USE CALENDAR INTEGRATION HOOK - INTEGRACIÓN COMPLETA DEL CALENDARIO
 * ================================================================================
 * 
 * Hook personalizado que integra el calendario como centro de notificaciones
 * y recordatorios con todos los sistemas SuperPAES
 */

import { useState, useEffect, useCallback } from 'react';
import { calendarIntegrationService, CalendarEvent, Notification } from '../services/CalendarIntegrationService';
import { supabase } from '../lib/supabase';

// ==================== INTERFACES ====================

interface CalendarState {
  events: CalendarEvent[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  filters: {
    types: string[];
    priorities: string[];
    dateRange: {
      start: Date;
      end: Date;
    };
  };
  stats: {
    totalEvents: number;
    todayEvents: number;
    pendingEvents: number;
    completedEvents: number;
    unreadNotifications: number;
  };
}

interface CalendarActions {
  createEvent: (eventData: Partial<CalendarEvent>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  dismissNotification: (notificationId: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  setFilters: (filters: Partial<CalendarState['filters']>) => void;
}

// ==================== HOOK PRINCIPAL ====================

export const useCalendarIntegration = (): [CalendarState, CalendarActions] => {
  const [state, setState] = useState<CalendarState>({
    events: [],
    notifications: [],
    loading: false,
    error: null,
    filters: {
      types: [],
      priorities: [],
      dateRange: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    },
    stats: {
      totalEvents: 0,
      todayEvents: 0,
      pendingEvents: 0,
      completedEvents: 0,
      unreadNotifications: 0
    }
  });

  // ==================== CARGA INICIAL ====================

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Cargar eventos y notificaciones en paralelo
      const [events, notifications] = await Promise.all([
        loadEvents(),
        loadNotifications()
      ]);

      // Calcular estadísticas
      const stats = calculateStats(events, notifications);

      setState(prev => ({
        ...prev,
        events,
        notifications,
        stats,
        loading: false
      }));

      // Configurar listeners para actualizaciones en tiempo real
      setupRealtimeListeners();

    } catch (error) {
      console.error('Error inicializando calendario:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar el calendario',
        loading: false
      }));
    }
  }, []);

  // ==================== CARGA DE DATOS ====================

  const loadEvents = useCallback(async (): Promise<CalendarEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('startTime', { ascending: true });

      if (error) {
        console.error('Error cargando eventos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error en loadEvents:', error);
      return [];
    }
  }, []);

  const loadNotifications = useCallback(async (): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error cargando notificaciones:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error en loadNotifications:', error);
      return [];
    }
  }, []);

  // ==================== CÁLCULO DE ESTADÍSTICAS ====================

  const calculateStats = useCallback((events: CalendarEvent[], notifications: Notification[]) => {
    const today = new Date().toDateString();
    
    const todayEvents = events.filter(event => 
      event.startTime.toDateString() === today
    ).length;

    const pendingEvents = events.filter(event => 
      event.status === 'pending'
    ).length;

    const completedEvents = events.filter(event => 
      event.status === 'completed'
    ).length;

    const unreadNotifications = notifications.filter(notification => 
      notification.status === 'unread'
    ).length;

    return {
      totalEvents: events.length,
      todayEvents,
      pendingEvents,
      completedEvents,
      unreadNotifications
    };
  }, []);

  // ==================== LISTENERS EN TIEMPO REAL ====================

  const setupRealtimeListeners = useCallback(() => {
    // Listener para nuevos eventos
    const eventsSubscription = supabase
      .channel('calendar_events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'calendar_events' },
        (payload) => {
          console.log('🔄 Evento de calendario actualizado:', payload);
          refreshEvents();
        }
      )
      .subscribe();

    // Listener para nuevas notificaciones
    const notificationsSubscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('🔄 Notificación actualizada:', payload);
          refreshNotifications();
        }
      )
      .subscribe();

    // Listener para eventos del sistema
    calendarIntegrationService.addEventListener('event-created', (event: CalendarEvent) => {
      setState(prev => ({
        ...prev,
        events: [event, ...prev.events],
        stats: calculateStats([event, ...prev.events], prev.notifications)
      }));
    });

    calendarIntegrationService.addEventListener('notification-created', (notification: Notification) => {
      setState(prev => ({
        ...prev,
        notifications: [notification, ...prev.notifications],
        stats: calculateStats(prev.events, [notification, ...prev.notifications])
      }));
    });

    // Cleanup
    return () => {
      eventsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, []);

  // ==================== ACCIONES DEL CALENDARIO ====================

  const createEvent = useCallback(async (eventData: Partial<CalendarEvent>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const newEvent = await calendarIntegrationService.createEvent(eventData);

      setState(prev => ({
        ...prev,
        events: [newEvent, ...prev.events],
        stats: calculateStats([newEvent, ...prev.events], prev.notifications),
        loading: false
      }));

    } catch (error) {
      console.error('Error creando evento:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al crear el evento',
        loading: false
      }));
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const updatedEvent = await calendarIntegrationService.updateEvent(eventId, updates);

      setState(prev => ({
        ...prev,
        events: prev.events.map(event => 
          event.id === eventId ? updatedEvent : event
        ),
        stats: calculateStats(
          prev.events.map(event => event.id === eventId ? updatedEvent : event),
          prev.notifications
        ),
        loading: false
      }));

    } catch (error) {
      console.error('Error actualizando evento:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al actualizar el evento',
        loading: false
      }));
    }
  }, []);

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      await calendarIntegrationService.deleteEvent(eventId);

      setState(prev => ({
        ...prev,
        events: prev.events.filter(event => event.id !== eventId),
        stats: calculateStats(
          prev.events.filter(event => event.id !== eventId),
          prev.notifications
        ),
        loading: false
      }));

    } catch (error) {
      console.error('Error eliminando evento:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al eliminar el evento',
        loading: false
      }));
    }
  }, []);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marcando notificación como leída:', error);
        return;
      }

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, status: 'read' }
            : notification
        ),
        stats: calculateStats(
          prev.events,
          prev.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, status: 'read' }
              : notification
          )
        )
      }));

    } catch (error) {
      console.error('Error en markNotificationAsRead:', error);
    }
  }, []);

  const dismissNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'dismissed' })
        .eq('id', notificationId);

      if (error) {
        console.error('Error descartando notificación:', error);
        return;
      }

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, status: 'dismissed' }
            : notification
        ),
        stats: calculateStats(
          prev.events,
          prev.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, status: 'dismissed' }
              : notification
          )
        )
      }));

    } catch (error) {
      console.error('Error en dismissNotification:', error);
    }
  }, []);

  const refreshEvents = useCallback(async () => {
    try {
      const events = await loadEvents();
      setState(prev => ({
        ...prev,
        events,
        stats: calculateStats(events, prev.notifications)
      }));
    } catch (error) {
      console.error('Error refrescando eventos:', error);
    }
  }, [loadEvents, calculateStats]);

  const refreshNotifications = useCallback(async () => {
    try {
      const notifications = await loadNotifications();
      setState(prev => ({
        ...prev,
        notifications,
        stats: calculateStats(prev.events, notifications)
      }));
    } catch (error) {
      console.error('Error refrescando notificaciones:', error);
    }
  }, [loadNotifications, calculateStats]);

  const setFilters = useCallback((newFilters: Partial<CalendarState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  // ==================== INTEGRACIÓN CON SISTEMAS ====================

  // Integración con Spotify Neural
  const createSpotifyPlaylistEvent = useCallback(async (playlist: any) => {
    const eventData: Partial<CalendarEvent> = {
      title: `Playlist Diaria: ${playlist.name}`,
      description: `Tu playlist personalizada de ${playlist.subject} está lista para hoy`,
      type: 'playlist',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 30,
      tags: ['spotify', 'playlist', playlist.subject.toLowerCase()],
      metadata: {
        spotifyPlaylist: playlist,
        difficulty: playlist.difficulty,
        bloomLevel: playlist.bloomLevel
      }
    };

    await createEvent(eventData);
  }, [createEvent]);

  // Integración con ADN PAES
  const createPAESExerciseEvent = useCallback(async (exercise: any) => {
    const eventData: Partial<CalendarEvent> = {
      title: `Ejercicio PAES: ${exercise.prueba} - ${exercise.skill}`,
      description: `Ejercicio oficial del MINEDUC para mejorar tu puntaje en ${exercise.prueba}`,
      type: 'exercise',
      priority: 'high',
      startTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      duration: 45,
      tags: ['paes', 'ejercicio', exercise.prueba.toLowerCase(), exercise.skill.toLowerCase()],
      metadata: {
        paesExercise: exercise,
        difficulty: exercise.difficulty,
        bloomLevel: exercise.bloomLevel,
        expectedScore: exercise.expectedScore
      }
    };

    await createEvent(eventData);
  }, [createEvent]);

  // Integración con SuperPAES
  const createSuperPAESDiagnosticEvent = useCallback(async () => {
    const eventData: Partial<CalendarEvent> = {
      title: 'Diagnóstico Vocacional SuperPAES',
      description: 'Actualiza tu perfil vocacional y descubre nuevas oportunidades de carrera',
      type: 'diagnostic',
      priority: 'medium',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      duration: 60,
      tags: ['superpaes', 'diagnostico', 'vocacional', 'carrera'],
      metadata: {
        careerGoal: 'vocational_assessment'
      }
    };

    await createEvent(eventData);
  }, [createEvent]);

  // Integración con Sistema Neural
  const createNeuralAnalyticsEvent = useCallback(async () => {
    const eventData: Partial<CalendarEvent> = {
      title: 'Análisis Neural de Rendimiento',
      description: 'Revisión automática de tus patrones de aprendizaje y recomendaciones personalizadas',
      type: 'neural',
      priority: 'low',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      duration: 30,
      tags: ['neural', 'analisis', 'rendimiento', 'aprendizaje'],
      metadata: {
        neuralMetrics: {
          type: 'performance_analysis',
          frequency: 'weekly'
        }
      }
    };

    await createEvent(eventData);
  }, [createEvent]);

  // ==================== UTILIDADES ====================

  const getFilteredEvents = useCallback(() => {
    return state.events.filter(event => {
      // Filtro por tipo
      if (state.filters.types.length > 0 && !state.filters.types.includes(event.type)) {
        return false;
      }

      // Filtro por prioridad
      if (state.filters.priorities.length > 0 && !state.filters.priorities.includes(event.priority)) {
        return false;
      }

      // Filtro por fecha
      if (event.startTime < state.filters.dateRange.start || event.startTime > state.filters.dateRange.end) {
        return false;
      }

      return true;
    });
  }, [state.events, state.filters]);

  const getTodayEvents = useCallback(() => {
    const today = new Date().toDateString();
    return state.events.filter(event => event.startTime.toDateString() === today);
  }, [state.events]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return state.events
      .filter(event => event.startTime > now && event.status === 'pending')
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 5);
  }, [state.events]);

  const getUnreadNotifications = useCallback(() => {
    return state.notifications.filter(notification => notification.status === 'unread');
  }, [state.notifications]);

  // ==================== RETORNO ====================

  const actions: CalendarActions = {
    createEvent,
    updateEvent,
    deleteEvent,
    markNotificationAsRead,
    dismissNotification,
    refreshEvents,
    refreshNotifications,
    setFilters
  };

  return [state, actions];
};

// ==================== HOOKS ESPECIALIZADOS ====================

export const useSpotifyCalendarIntegration = () => {
  const [state, actions] = useCalendarIntegration();

  const spotifyEvents = state.events.filter(event => 
    event.type === 'playlist' && event.metadata.spotifyPlaylist
  );

  const createSpotifyEvent = useCallback(async (playlist: any) => {
    const eventData: Partial<CalendarEvent> = {
      title: `Playlist Diaria: ${playlist.name}`,
      description: `Tu playlist personalizada de ${playlist.subject} está lista para hoy`,
      type: 'playlist',
      priority: 'medium',
      startTime: new Date(),
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      duration: 30,
      tags: ['spotify', 'playlist', playlist.subject.toLowerCase()],
      metadata: {
        spotifyPlaylist: playlist,
        difficulty: playlist.difficulty,
        bloomLevel: playlist.bloomLevel
      }
    };

    await actions.createEvent(eventData);
  }, [actions]);

  return {
    spotifyEvents,
    createSpotifyEvent,
    ...actions
  };
};

export const usePAESCalendarIntegration = () => {
  const [state, actions] = useCalendarIntegration();

  const paesEvents = state.events.filter(event => 
    event.type === 'exercise' && event.metadata.paesExercise
  );

  const createPAESEvent = useCallback(async (exercise: any) => {
    const eventData: Partial<CalendarEvent> = {
      title: `Ejercicio PAES: ${exercise.prueba} - ${exercise.skill}`,
      description: `Ejercicio oficial del MINEDUC para mejorar tu puntaje en ${exercise.prueba}`,
      type: 'exercise',
      priority: 'high',
      startTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      duration: 45,
      tags: ['paes', 'ejercicio', exercise.prueba.toLowerCase(), exercise.skill.toLowerCase()],
      metadata: {
        paesExercise: exercise,
        difficulty: exercise.difficulty,
        bloomLevel: exercise.bloomLevel,
        expectedScore: exercise.expectedScore
      }
    };

    await actions.createEvent(eventData);
  }, [actions]);

  return {
    paesEvents,
    createPAESEvent,
    ...actions
  };
};

export const useSuperPAESCalendarIntegration = () => {
  const [state, actions] = useCalendarIntegration();

  const superPAESEvents = state.events.filter(event => 
    event.type === 'diagnostic' || event.type === 'career' || event.metadata.careerGoal
  );

  const createSuperPAESEvent = useCallback(async (diagnosticData: any) => {
    const eventData: Partial<CalendarEvent> = {
      title: 'Diagnóstico Vocacional SuperPAES',
      description: 'Actualiza tu perfil vocacional y descubre nuevas oportunidades de carrera',
      type: 'diagnostic',
      priority: 'medium',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      duration: 60,
      tags: ['superpaes', 'diagnostico', 'vocacional', 'carrera'],
      metadata: {
        careerGoal: 'vocational_assessment',
        expectedScore: diagnosticData.expectedScore
      }
    };

    await actions.createEvent(eventData);
  }, [actions]);

  return {
    superPAESEvents,
    createSuperPAESEvent,
    ...actions
  };
};

export default useCalendarIntegration;
