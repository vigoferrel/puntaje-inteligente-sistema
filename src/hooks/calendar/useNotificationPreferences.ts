
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
  quiet_hours: {
    start: string;
    end: string;
  };
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

      setPreferences(data || []);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (eventType: string, settings: any) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile.id,
          event_type: eventType,
          ...settings
        }, {
          onConflict: 'user_id,event_type'
        })
        .select()
        .single();

      if (error) throw error;

      setPreferences(prev => {
        const existing = prev.find(p => p.event_type === eventType);
        if (existing) {
          return prev.map(p => p.event_type === eventType ? data : p);
        } else {
          return [...prev, data];
        }
      });

      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación se han guardado"
      });

      return data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las preferencias",
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
