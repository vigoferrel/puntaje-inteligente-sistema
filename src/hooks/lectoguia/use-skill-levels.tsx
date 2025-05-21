
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { updateSkillLevelInDb } from '@/services/lectoguia-service';
import { getSkillId } from '@/utils/lectoguia-utils';

export function useSkillLevels(
  initialSkillLevels: Record<string, number>,
  userId: string | null
) {
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>(initialSkillLevels);

  const updateSkillLevel = async (skillCode: string, isCorrect: boolean) => {
    if (!userId) return;
    
    const skillId = getSkillId(skillCode);
    if (!skillId) return;
    
    try {
      // Obtener nivel actual de habilidad
      const currentLevel = skillLevels[skillCode] || 0;
      
      // Algoritmo simple para ajustar el nivel de habilidad:
      // Respuestas correctas aumentan el nivel en 0.05 hasta 1.0
      // Respuestas incorrectas disminuyen el nivel en 0.03, pero no bajan de 0
      let newLevel = currentLevel;
      
      if (isCorrect) {
        newLevel = Math.min(1, currentLevel + 0.05);
      } else {
        newLevel = Math.max(0, currentLevel - 0.03);
      }
      
      // Actualizar en la base de datos
      await updateSkillLevelInDb(userId, skillId, newLevel);
      
      // Actualizar el estado local
      setSkillLevels(prev => ({
        ...prev,
        [skillCode]: newLevel
      }));
      
    } catch (error) {
      console.error('Error al actualizar nivel de habilidad:', error);
    }
  };

  return {
    skillLevels,
    updateSkillLevel,
    setSkillLevels
  };
}
