
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TPAESHabilidad } from '@/types/system-types';
import { UseSkillsState, initialSkillLevels } from './types';

export function useSkills(userId: string | null): UseSkillsState & { 
  activeSkill: TPAESHabilidad | null;
  setActiveSkill: (skill: TPAESHabilidad | null) => void;
} {
  const [skillLevels, setSkillLevels] = useState<Record<TPAESHabilidad, number>>(initialSkillLevels);
  const [activeSkill, setActiveSkill] = useState<TPAESHabilidad | null>(null);
  
  // Cargar niveles de habilidades del usuario desde user_exercise_attempts
  useEffect(() => {
    const fetchSkillLevels = async () => {
      if (!userId) return;
      
      try {
        // Obtener intentos de ejercicios del usuario para calcular niveles
        const { data: attempts, error } = await supabase
          .from('user_exercise_attempts')
          .select('skill_demonstrated, is_correct')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        if (attempts && attempts.length > 0) {
          const levels: Record<TPAESHabilidad, number> = { ...initialSkillLevels };
          
          // Calcular niveles basados en intentos
          const skillStats: Record<string, { correct: number; total: number }> = {};
          
          attempts.forEach((attempt: any) => {
            if (attempt.skill_demonstrated) {
              const skill = attempt.skill_demonstrated as TPAESHabilidad;
              if (!skillStats[skill]) {
                skillStats[skill] = { correct: 0, total: 0 };
              }
              skillStats[skill].total += 1;
              if (attempt.is_correct) {
                skillStats[skill].correct += 1;
              }
            }
          });
          
          // Convertir estadísticas a niveles (0-1)
          Object.entries(skillStats).forEach(([skill, stats]) => {
            levels[skill as TPAESHabilidad] = stats.total > 0 ? stats.correct / stats.total : 0;
          });
          
          setSkillLevels(levels);
        }
      } catch (error) {
        console.error('Error fetching skill levels:', error);
      }
    };
    
    fetchSkillLevels();
  }, [userId]);
  
  // Obtener ID de habilidad desde su código
  const getSkillIdFromCode = useCallback((skillCode: TPAESHabilidad): number | null => {
    const skillIds: Record<TPAESHabilidad, number> = {
      'TRACK_LOCATE': 1,
      'INTERPRET_RELATE': 2,
      'EVALUATE_REFLECT': 3,
      'SOLVE_PROBLEMS': 4,
      'REPRESENT': 5,
      'MODEL': 6,
      'ARGUE_COMMUNICATE': 7,
      'IDENTIFY_THEORIES': 8,
      'PROCESS_ANALYZE': 9,
      'APPLY_PRINCIPLES': 10,
      'SCIENTIFIC_ARGUMENT': 11,
      'TEMPORAL_THINKING': 12,
      'SOURCE_ANALYSIS': 13,
      'MULTICAUSAL_ANALYSIS': 14,
      'CRITICAL_THINKING': 15,
      'REFLECTION': 16
    };
    
    return skillIds[skillCode] || null;
  }, []);
  
  // Actualizar nivel de habilidad basado en progreso de nodos
  const updateSkillLevel = useCallback(async (skillId: number, isCorrect: boolean) => {
    if (!userId) return;
    
    try {
      // En lugar de usar user_skill_levels, actualizamos el progreso a través de user_node_progress
      // que luego se convertirá en niveles de habilidad via trigger
      console.log(`Skill level update for skill ${skillId}: ${isCorrect ? 'correct' : 'incorrect'}`);
      
      // Recalcular niveles basado en los nuevos intentos
      const { data: attempts, error } = await supabase
        .from('user_exercise_attempts')
        .select('skill_demonstrated, is_correct')
        .eq('user_id', userId);
        
      if (!error && attempts) {
        const levels: Record<TPAESHabilidad, number> = { ...initialSkillLevels };
        const skillStats: Record<string, { correct: number; total: number }> = {};
        
        attempts.forEach((attempt: any) => {
          if (attempt.skill_demonstrated) {
            const skill = attempt.skill_demonstrated as TPAESHabilidad;
            if (!skillStats[skill]) {
              skillStats[skill] = { correct: 0, total: 0 };
            }
            skillStats[skill].total += 1;
            if (attempt.is_correct) {
              skillStats[skill].correct += 1;
            }
          }
        });
        
        Object.entries(skillStats).forEach(([skill, stats]) => {
          levels[skill as TPAESHabilidad] = stats.total > 0 ? stats.correct / stats.total : 0;
        });
        
        setSkillLevels(levels);
      }
    } catch (error) {
      console.error("Error al actualizar nivel de habilidad:", error);
    }
  }, [userId]);
  
  // Manejador para iniciar simulación
  const handleStartSimulation = useCallback(() => {
    toast({
      title: "Simulación",
      description: "Esta función estará disponible próximamente"
    });
  }, []);
  
  return {
    skillLevels,
    updateSkillLevel,
    getSkillIdFromCode,
    handleStartSimulation,
    activeSkill,
    setActiveSkill
  };
}
