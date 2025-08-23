
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
    
    try {
      setSaving(true);
      setError(null);
      
      // Update local state immediately
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Save to database
      await saveUserPreference(userId, key, value);
      
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
      
      // Revert local state on error
      setPreferences(prev => {
        const reverted = { ...prev };
        delete reverted[key];
        return reverted;
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
