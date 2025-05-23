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
  
  // Cargar niveles de habilidades del usuario
  useEffect(() => {
    const fetchSkillLevels = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_skill_levels')
          .select('*,paes_skills(code)')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const levels: Record<TPAESHabilidad, number> = { ...initialSkillLevels };
          
          data.forEach((skillLevel: any) => {
            if (skillLevel.paes_skills && skillLevel.paes_skills.code) {
              levels[skillLevel.paes_skills.code as TPAESHabilidad] = skillLevel.level;
            }
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
  
  // Actualizar nivel de habilidad en la base de datos
  const updateSkillLevel = useCallback(async (skillId: number, isCorrect: boolean) => {
    if (!userId) return;
    
    try {
      // Verificar si ya existe un registro para esta habilidad
      const { data: existingLevel } = await supabase
        .from('user_skill_levels')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .maybeSingle();
      
      const change = isCorrect ? 0.05 : -0.02;
      
      if (existingLevel) {
        // Actualizar nivel existente
        const newLevel = Math.min(1, Math.max(0, existingLevel.level + change));
        
        await supabase
          .from('user_skill_levels')
          .update({ level: newLevel })
          .eq('id', existingLevel.id);
      } else {
        // Crear nuevo nivel
        const initialLevel = isCorrect ? 0.05 : 0;
        
        await supabase
          .from('user_skill_levels')
          .insert({
            user_id: userId,
            skill_id: skillId,
            level: initialLevel
          });
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
