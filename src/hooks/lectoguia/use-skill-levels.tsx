
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { fetchSkillLevels } from '@/services/lectoguia-service';
import { TPAESHabilidad } from '@/types/system-types';

export function useSkillLevels(
  initialSkillLevels: Record<string, number>,
  userId: string | null
) {
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(initialSkillLevels);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load skill levels when userId changes
  useEffect(() => {
    if (userId) {
      loadSkillLevels();
    }
  }, [userId]);

  const loadSkillLevels = async () => {
    if (!userId) return;
    
    try {
      setUpdating(true);
      setError(null);
      const levels = await fetchSkillLevels(userId);
      setSkillLevels(prev => ({ ...prev, ...levels }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading skill levels';
      console.error('Error loading skill levels:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load skill levels",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const updateSkillLevel = async (skillCode: string, isCorrect: boolean): Promise<boolean> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to update skill levels.");
      return false;
    }
    
    try {
      setUpdating(true);
      setError(null);
      
      // Calculate new level based on current performance
      const currentLevel = skillLevels[skillCode] || 0;
      let newLevel = currentLevel;
      
      if (isCorrect) {
        newLevel = Math.min(1, currentLevel + 0.05);
      } else {
        newLevel = Math.max(0, currentLevel - 0.03);
      }
      
      // Update local state immediately for better UX
      setSkillLevels(prev => ({
        ...prev,
        [skillCode]: newLevel
      }));
      
      // Reload skill levels from database to get accurate calculation
      await loadSkillLevels();
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error updating skill level';
      console.error('Error updating skill level:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to update skill level. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    skillLevels,
    updateSkillLevel,
    setSkillLevels,
    updating,
    error,
    reload: loadSkillLevels
  };
}
