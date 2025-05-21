
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { saveUserPreference } from '@/services/lectoguia-service';

export function usePreferences(
  initialPreferences: Record<string, string>,
  userId: string | null
) {
  const [preferences, setPreferences] = useState<Record<string, string>>(initialPreferences);

  const setPreference = async (key: string, value: string) => {
    if (!userId) return;
    
    try {
      // Actualizar en la base de datos
      await saveUserPreference(userId, key, value);
      
      // Actualizar el estado local
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
    } catch (error) {
      console.error('Error al guardar preferencia:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la preferencia",
        variant: "destructive"
      });
    }
  };

  return {
    preferences,
    setPreference,
    setPreferences
  };
}
