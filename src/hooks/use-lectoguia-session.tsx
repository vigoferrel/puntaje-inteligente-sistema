
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise } from '@/types/ai-types';
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

export function useLectoGuiaSession() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Inicializar hooks con valores por defecto
  const { skillLevels, updateSkillLevel, setSkillLevels } = useSkillLevels(
    getInitialSkillLevels(),
    userId
  );
  
  const { preferences, setPreference, setPreferences } = usePreferences(
    {},
    userId
  );
  
  const { exerciseHistory, saveExerciseAttempt, setExerciseHistory } = useExerciseHistory(
    [],
    userId,
    updateSkillLevel
  );

  // Cargar datos del usuario cuando está autenticado
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Reiniciar sesión cuando no está autenticado
      setUserId(null);
      setExerciseHistory([]);
      setPreferences({});
      setSkillLevels(getInitialSkillLevels());
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);
      setUserId(userId);
      
      // Cargar datos en paralelo
      const [exerciseData, prefData, skillData] = await Promise.all([
        fetchUserExerciseHistory(userId),
        fetchUserPreferences(userId),
        fetchSkillLevels(userId)
      ]);
      
      // Actualizar estados
      setExerciseHistory(exerciseData);
      setPreferences(prefData);
      setSkillLevels(skillData);
      
    } catch (error) {
      console.error('Error al cargar datos de LectoGuia:', error);
    } finally {
      setLoading(false);
    }
  };

  // Construir el objeto de sesión
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
    updateSkillLevel
  };
}
