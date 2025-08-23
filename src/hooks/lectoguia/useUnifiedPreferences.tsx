
import { useState, useRef, useCallback } from 'react';
import { dynamicStorageManager } from '@/core/storage/DynamicStorageManager';
import { toast } from '@/hooks/use-toast';
import { saveUserPreference } from '@/services/lectoguia-service';

export function useUnifiedPreferences(
  initialPreferences: Record<string, string>,
  userId: string | null
) {
  const [preferences, setPreferences] = useState<Record<string, string>>(() => {
    // Cargar desde cache local usando el nuevo sistema dinámico
    if (userId) {
      const cached = dynamicStorageManager.getDynamicItem('user_preferences_cache_v2', userId);
      if (cached) {
        return { ...initialPreferences, ...cached };
      }
    }
    return initialPreferences;
  });

  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const setPreference = useCallback(async (key: string, value: string): Promise<boolean> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to save preferences.");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Actualizar estado local inmediatamente
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      
      // Guardar en cache local con debounce usando el nuevo sistema
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        dynamicStorageManager.setDynamicItem('user_preferences_cache_v2', userId, newPreferences);
      }, 2000);
      
      // Guardar en base de datos
      await saveUserPreference(userId, key, value);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving preference';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive"
      });
      
      // Revertir estado local
      setPreferences(prev => {
        const reverted = { ...prev };
        delete reverted[key];
        return reverted;
      });
      
      return false;
    } finally {
      setSaving(false);
    }
  }, [preferences, userId]);

  return {
    preferences,
    setPreference,
    setPreferences,
    saving,
    error
  };
}
