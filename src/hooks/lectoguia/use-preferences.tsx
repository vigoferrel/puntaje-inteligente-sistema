
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { saveUserPreference } from '@/services/lectoguia-service';

export function usePreferences(
  initialPreferences: Record<string, string>,
  userId: string | null
) {
  const [preferences, setPreferences] = useState<Record<string, string>>(initialPreferences);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setPreference = async (key: string, value: string): Promise<boolean> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to save preferences.");
      return false;
    }
    
    if (!key || key.trim() === '') {
      setError("Invalid preference key");
      return false;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Save to database
      await saveUserPreference(userId, key, value);
      
      // Update local state
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving preference';
      console.error('Error saving preference:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    setPreference,
    setPreferences,
    saving,
    error
  };
}
