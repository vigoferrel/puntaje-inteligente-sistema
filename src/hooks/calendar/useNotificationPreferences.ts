
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  user_id: string;
  event_type: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  email_timing: string[];
  push_timing: string[];
  sms_timing: string[];
  quiet_hours: { start: string; end: string };
  timezone: string;
}

// Helper para convertir Json a string[] de forma segura
const convertJsonToStringArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === 'string');
  }
  return ['15m'];
};

// Helper para convertir Json a objeto quiet_hours de forma segura
const convertJsonToQuietHours = (value: any): { start: string; end: string } => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      start: typeof value.start === 'string' ? value.start : '22:00',
      end: typeof value.end === 'string' ? value.end : '08:00'
    };
  }
  return { start: '22:00', end: '08:00' };
};

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();

  const fetchPreferences = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', profile.id);

      if (error) throw error;

      const mappedPreferences: NotificationPreference[] = (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        event_type: item.event_type,
        email_enabled: item.email_enabled,
        push_enabled: item.push_enabled,
        sms_enabled: item.sms_enabled,
        email_timing: convertJsonToStringArray(item.email_timing),
        push_timing: convertJsonToStringArray(item.push_timing),
        sms_timing: convertJsonToStringArray(item.sms_timing),
        quiet_hours: convertJsonToQuietHours(item.quiet_hours),
        timezone: item.timezone || 'America/Santiago'
      }));

      setPreferences(mappedPreferences);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las preferencias de notificación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (eventType: string, updates: Partial<NotificationPreference>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile.id,
          event_type: eventType,
          ...updates
        })
        .select()
        .single();

      if (error) throw error;

      const updatedPreference: NotificationPreference = {
        id: data.id,
        user_id: data.user_id,
        event_type: data.event_type,
        email_enabled: data.email_enabled,
        push_enabled: data.push_enabled,
        sms_enabled: data.sms_enabled,
        email_timing: convertJsonToStringArray(data.email_timing),
        push_timing: convertJsonToStringArray(data.push_timing),
        sms_timing: convertJsonToStringArray(data.sms_timing),
        quiet_hours: convertJsonToQuietHours(data.quiet_hours),
        timezone: data.timezone || 'America/Santiago'
      };

      setPreferences(prev => {
        const filtered = prev.filter(p => p.event_type !== eventType);
        return [...filtered, updatedPreference];
      });

      toast({
        title: "Preferencias actualizadas",
        description: "Las preferencias de notificación se han guardado correctamente"
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las preferencias",
        variant: "destructive"
      });
    }
  };

  const getPreferenceForEventType = (eventType: string) => {
    return preferences.find(p => p.event_type === eventType);
  };

  useEffect(() => {
    fetchPreferences();
  }, [profile]);

  return {
    preferences,
    isLoading,
    updatePreferences,
    getPreferenceForEventType,
    refetch: fetchPreferences
  };
};
