
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { updateSkillLevelInDb } from '@/services/lectoguia-service';
import { getSkillId } from '@/utils/lectoguia-utils';

export function useSkillLevels(
  initialSkillLevels: Record<string, number>,
  userId: string | null
) {
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(initialSkillLevels);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateSkillLevel = async (skillCode: string, isCorrect: boolean): Promise<boolean> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to update skill levels.");
      return false;
    }
    
    const skillId = getSkillId(skillCode);
    if (!skillId) {
      setError(`Invalid skill code: ${skillCode}`);
      return false;
    }
    
    try {
      setUpdating(true);
      setError(null);
      
      // Obtain current level of skill
      const currentLevel = skillLevels[skillCode] || 0;
      
      // Simple algorithm to adjust skill level:
      // Correct answers increase the level by 0.05 up to 1.0
      // Incorrect answers decrease the level by 0.03, but not below 0
      let newLevel = currentLevel;
      
      if (isCorrect) {
        newLevel = Math.min(1, currentLevel + 0.05);
      } else {
        newLevel = Math.max(0, currentLevel - 0.03);
      }
      
      // Update in database
      await updateSkillLevelInDb(userId, skillId, newLevel);
      
      // Update local state
      setSkillLevels(prev => ({
        ...prev,
        [skillCode]: newLevel
      }));
      
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
    error
  };
}
