
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
        email_timing: Array.isArray(item.email_timing) ? item.email_timing : ['15m', '1h'],
        push_timing: Array.isArray(item.push_timing) ? item.push_timing : ['15m'],
        sms_timing: Array.isArray(item.sms_timing) ? item.sms_timing : ['15m'],
        quiet_hours: item.quiet_hours || { start: '22:00', end: '08:00' },
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
        email_timing: Array.isArray(data.email_timing) ? data.email_timing : ['15m', '1h'],
        push_timing: Array.isArray(data.push_timing) ? data.push_timing : ['15m'],
        sms_timing: Array.isArray(data.sms_timing) ? data.sms_timing : ['15m'],
        quiet_hours: data.quiet_hours || { start: '22:00', end: '08:00' },
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
