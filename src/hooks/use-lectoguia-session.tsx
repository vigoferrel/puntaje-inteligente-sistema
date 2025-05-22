import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LectoGuiaSession } from '@/types/lectoguia-types';
import { getInitialSkillLevels } from '@/utils/lectoguia-utils';
import { 
  fetchUserExerciseHistory, 
  fetchUserPreferences,
  fetchSkillLevels
} from '@/services/lectoguia-service';
import { useSkillLevels } from './lectoguia/use-skill-levels';
import { usePreferences } from './lectoguia/use-preferences';
import { useExerciseHistory } from './lectoguia/use-exercise-history';
import { toast } from '@/components/ui/use-toast';

export function useLectoGuiaSession() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize hooks with default values
  const { 
    skillLevels, 
    updateSkillLevel, 
    setSkillLevels,
    updating: updatingSkills,
    error: skillError
  } = useSkillLevels(getInitialSkillLevels(), userId);
  
  const { 
    preferences, 
    setPreference, 
    setPreferences,
    saving: savingPreferences,
    error: preferencesError
  } = usePreferences({}, userId);
  
  const { 
    exerciseHistory, 
    saveExerciseAttempt, 
    setExerciseHistory,
    saving: savingExercise,
    error: exerciseError
  } = useExerciseHistory([], userId, updateSkillLevel);

  // Load user data when authenticated
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Reset session when not authenticated
      resetSession();
    }
  }, [user?.id]);

  const resetSession = () => {
    setUserId(null);
    setExerciseHistory([]);
    setPreferences({});
    setSkillLevels(getInitialSkillLevels());
    setLoading(false);
    setError(null);
  };

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      setUserId(userId);
      
      // Load data in parallel
      const [exerciseData, prefData, skillData] = await Promise.all([
        fetchUserExerciseHistory(userId).catch(err => {
          console.error('Error loading exercise history:', err);
          toast({
            title: "Error",
            description: "Failed to load exercise history",
            variant: "destructive"
          });
          return [];
        }),
        fetchUserPreferences(userId).catch(err => {
          console.error('Error loading preferences:', err);
          toast({
            title: "Error",
            description: "Failed to load user preferences",
            variant: "destructive"
          });
          return {};
        }),
        fetchSkillLevels(userId).catch(err => {
          console.error('Error loading skill levels:', err);
          toast({
            title: "Error",
            description: "Failed to load skill levels",
            variant: "destructive"
          });
          return getInitialSkillLevels();
        })
      ]);
      
      // Update states
      setExerciseHistory(exerciseData);
      setPreferences(prefData);
      setSkillLevels(skillData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading LectoGuia data';
      console.error('Error loading LectoGuia data:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load LectoGuia session data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine all errors
  const combinedError = error || skillError || preferencesError || exerciseError;

  // Build session object
  const session: LectoGuiaSession = {
    userId,
    exerciseHistory,
    preferences,
    skillLevels,
    loading
  };

  return {
    session,
    saveExerciseAttempt,
    setPreference,
    updateSkillLevel,
    error: combinedError,
    isUpdating: loading || updatingSkills || savingPreferences || savingExercise
  };
}
