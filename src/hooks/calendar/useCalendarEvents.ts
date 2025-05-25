
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Definir tipo local para eventos del calendario
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'study_session' | 'paes_date' | 'deadline' | 'reminder';
  start_date: string;
  end_date?: string;
  all_day: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  is_recurring: boolean;
  recurrence_pattern?: any;
  related_node_id?: string;
  related_plan_id?: string;
  metadata?: any;
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  const fetchEvents = async () => {
    if (!profile) return;

    try {
      // Usar el cliente de Supabase directamente con el tipo correcto
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', profile.id)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Mapear los datos de la base de datos al tipo local
      const mappedEvents: CalendarEvent[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        event_type: item.event_type as 'study_session' | 'paes_date' | 'deadline' | 'reminder',
        start_date: item.start_date,
        end_date: item.end_date,
        all_day: item.all_day,
        color: item.color || '#4F46E5',
        priority: item.priority as 'low' | 'medium' | 'high' | 'critical',
        location: item.location,
        is_recurring: item.is_recurring || false,
        recurrence_pattern: item.recurrence_pattern,
        related_node_id: item.related_node_id,
        related_plan_id: item.related_plan_id,
        metadata: item.metadata
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos del calendario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<CalendarEvent>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          ...eventData,
          user_id: profile.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Mapear el resultado al tipo local
      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        event_type: data.event_type as 'study_session' | 'paes_date' | 'deadline' | 'reminder',
        start_date: data.start_date,
        end_date: data.end_date,
        all_day: data.all_day,
        color: data.color || '#4F46E5',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        location: data.location,
        is_recurring: data.is_recurring || false,
        recurrence_pattern: data.recurrence_pattern,
        related_node_id: data.related_node_id,
        related_plan_id: data.related_plan_id,
        metadata: data.metadata
      };

      setEvents(prev => [...prev, newEvent]);
      await scheduleNotifications(newEvent);
      
      toast({
        title: "Evento creado",
        description: "El evento se ha creado correctamente"
      });

      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive"
      });
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      // Mapear el resultado al tipo local
      const updatedEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        event_type: data.event_type as 'study_session' | 'paes_date' | 'deadline' | 'reminder',
        start_date: data.start_date,
        end_date: data.end_date,
        all_day: data.all_day,
        color: data.color || '#4F46E5',
        priority: data.priority as 'low' | 'medium' | 'high' | 'critical',
        location: data.location,
        is_recurring: data.is_recurring || false,
        recurrence_pattern: data.recurrence_pattern,
        related_node_id: data.related_node_id,
        related_plan_id: data.related_plan_id,
        metadata: data.metadata
      };

      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));

      // Cancelar notificaciones existentes y crear nuevas
      await cancelScheduledNotifications(eventId);
      await scheduleNotifications(updatedEvent);

      toast({
        title: "Evento actualizado",
        description: "El evento se ha actualizado correctamente"
      });

      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el evento",
        variant: "destructive"
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== eventId));
      await cancelScheduledNotifications(eventId);

      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado correctamente"
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive"
      });
    }
  };

  const scheduleNotifications = async (event: CalendarEvent) => {
    if (!profile) return;

    try {
      // Obtener preferencias de notificación del usuario
      const { data: preferences, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', profile.id)
        .eq('event_type', event.event_type)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', prefsError);
        return;
      }

      if (!preferences) return;

      const eventTime = new Date(event.start_date);
      const notifications = [];

      // Programar notificaciones de email
      if (preferences.email_enabled) {
        for (const timing of preferences.email_timing as string[]) {
          const sendTime = calculateSendTime(eventTime, timing);
          if (sendTime > new Date()) {
            notifications.push({
              event_id: event.id,
              user_id: profile.id,
              notification_type: 'email',
              send_at: sendTime.toISOString(),
              content: {
                subject: `Recordatorio: ${event.title}`,
                body: `Tu evento "${event.title}" está programado para ${eventTime.toLocaleString()}.`,
                event: event
              }
            });
          }
        }
      }

      // Programar notificaciones push
      if (preferences.push_enabled) {
        for (const timing of preferences.push_timing as string[]) {
          const sendTime = calculateSendTime(eventTime, timing);
          if (sendTime > new Date()) {
            notifications.push({
              event_id: event.id,
              user_id: profile.id,
              notification_type: 'push',
              send_at: sendTime.toISOString(),
              content: {
                title: `Recordatorio: ${event.title}`,
                body: `Tu evento está programado para ${eventTime.toLocaleString()}`,
                icon: '/favicon.ico',
                event: event
              }
            });
          }
        }
      }

      if (notifications.length > 0) {
        const { error } = await supabase
          .from('scheduled_notifications')
          .insert(notifications);

        if (error) {
          console.error('Error scheduling notifications:', error);
        }
      }
    } catch (error) {
      console.error('Error in scheduleNotifications:', error);
    }
  };

  const cancelScheduledNotifications = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .delete()
        .eq('event_id', eventId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error canceling notifications:', error);
      }
    } catch (error) {
      console.error('Error in cancelScheduledNotifications:', error);
    }
  };

  const calculateSendTime = (eventTime: Date, timing: string): Date => {
    const timingValue = parseInt(timing.slice(0, -1));
    const timingUnit = timing.slice(-1);
    
    let milliseconds = 0;
    switch (timingUnit) {
      case 'm':
        milliseconds = timingValue * 60 * 1000;
        break;
      case 'h':
        milliseconds = timingValue * 60 * 60 * 1000;
        break;
      case 'd':
        milliseconds = timingValue * 24 * 60 * 60 * 1000;
        break;
      case 'w':
        milliseconds = timingValue * 7 * 24 * 60 * 60 * 1000;
        break;
    }

    return new Date(eventTime.getTime() - milliseconds);
  };

  useEffect(() => {
    fetchEvents();
  }, [profile]);

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
