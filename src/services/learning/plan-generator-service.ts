
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { fetchUserSkillLevels } from "../skills/skill-level-service";
import { ensureLearningNodesExist } from "./initialize-learning-service";
import { mapEnumToSkillId } from "@/utils/supabase-mappers";

/**
 * Genera un plan de aprendizaje personalizado basado en las habilidades del usuario
 */
export const generatePersonalizedLearningPlan = async (
  userId: string,
  title?: string,
  description?: string,
  targetDate?: string
): Promise<string | null> => {
  try {
    // Asegurar que existan nodos de aprendizaje
    const nodesExist = await ensureLearningNodesExist();
    if (!nodesExist) {
      throw new Error("No se pudieron crear los nodos de aprendizaje necesarios");
    }
    
    // Obtener niveles de habilidades del usuario
    const skillLevels = await fetchUserSkillLevels(userId);
    
    // Identificar habilidades que necesitan mejora (nivel < 0.6)
    const skillsToImprove: TPAESHabilidad[] = Object.entries(skillLevels)
      .filter(([, level]) => level < 0.6)
      .map(([skill]) => skill as TPAESHabilidad)
      .slice(0, 5); // Máximo 5 habilidades para enfocarse
    
    // Si no hay habilidades específicas para mejorar, tomar las 3 más bajas
    if (skillsToImprove.length === 0) {
      const sortedSkills = Object.entries(skillLevels)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 3)
        .map(([skill]) => skill as TPAESHabilidad);
      
      skillsToImprove.push(...sortedSkills);
    }
    
    // Crear plan con título predeterminado si no se proporciona
    const planTitle = title || `Plan de mejora PAES - ${new Date().toLocaleDateString()}`;
    const planDescription = description || 
      `Plan personalizado enfocado en mejorar las siguientes habilidades: ${skillsToImprove.join(', ')}`;
    
    // Calcular fecha objetivo si no se proporciona (3 meses desde ahora)
    const planTargetDate = targetDate || 
      new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString();
    
    // Crear el plan en la base de datos
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        title: planTitle,
        description: planDescription,
        target_date: planTargetDate
      })
      .select()
      .single();
    
    if (planError) {
      throw planError;
    }
    
    if (!planData) {
      throw new Error("No se pudo crear el plan de aprendizaje");
    }
    
    const planId = planData.id;
    
    // Ahora seleccionar nodos asociados a las habilidades por mejorar
    await addNodesToLearningPlan(planId, skillsToImprove);
    
    return planId;
  } catch (error) {
    console.error('Error generating personalized learning plan:', error);
    toast({
      title: "Error",
      description: "No se pudo generar el plan de aprendizaje",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Añade nodos al plan de aprendizaje basados en las habilidades por mejorar
 */
const addNodesToLearningPlan = async (
  planId: string,
  skillsToImprove: TPAESHabilidad[]
): Promise<boolean> => {
  try {
    // Obtener los IDs de las habilidades
    const skillIds = skillsToImprove.map(skill => mapEnumToSkillId(skill));
    
    // Consultar nodos relacionados con estas habilidades
    const { data: nodesData, error: nodesError } = await supabase
      .from('learning_nodes')
      .select('id, position, skill_id, difficulty, depends_on')
      .in('skill_id', skillIds)
      .order('difficulty', { ascending: true })
      .order('position', { ascending: true });
    
    if (nodesError) {
      throw nodesError;
    }
    
    if (!nodesData || nodesData.length === 0) {
      console.warn('No se encontraron nodos para las habilidades seleccionadas');
      return false;
    }
    
    // Seleccionar nodos para el plan (hasta 3 por habilidad, priorizando dificultad básica e intermedia)
    const selectedNodes: Record<number, any[]> = {};
    
    skillIds.forEach(skillId => {
      const skillNodes = nodesData
        .filter(node => node.skill_id === skillId)
        .slice(0, 3);
      
      selectedNodes[skillId] = skillNodes;
    });
    
    // Preparar nodos para inserción, ordenados por dificultad y posición
    let position = 1;
    const planNodes = [];
    
    // Primero añadir nodos básicos de todas las habilidades
    Object.values(selectedNodes).forEach(nodes => {
      nodes
        .filter(node => node.difficulty === 'basic')
        .forEach(node => {
          planNodes.push({
            plan_id: planId,
            node_id: node.id,
            position: position++
          });
        });
    });
    
    // Luego añadir nodos intermedios
    Object.values(selectedNodes).forEach(nodes => {
      nodes
        .filter(node => node.difficulty === 'intermediate')
        .forEach(node => {
          planNodes.push({
            plan_id: planId,
            node_id: node.id,
            position: position++
          });
        });
    });
    
    // Finalmente añadir nodos avanzados
    Object.values(selectedNodes).forEach(nodes => {
      nodes
        .filter(node => node.difficulty === 'advanced')
        .forEach(node => {
          planNodes.push({
            plan_id: planId,
            node_id: node.id,
            position: position++
          });
        });
    });
    
    // Insertar nodos en el plan
    if (planNodes.length > 0) {
      const { error: insertError } = await supabase
        .from('learning_plan_nodes')
        .insert(planNodes);
      
      if (insertError) {
        throw insertError;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding nodes to learning plan:', error);
    return false;
  }
};

/**
 * Verifica si un usuario tiene planes de aprendizaje
 */
export const checkUserHasLearningPlans = async (userId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('learning_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    return (count !== null && count > 0);
  } catch (error) {
    console.error('Error checking if user has learning plans:', error);
    return false;
  }
};

/**
 * Genera un plan de aprendizaje predeterminado si el usuario no tiene planes
 */
export const ensureUserHasLearningPlan = async (userId: string): Promise<boolean> => {
  try {
    const hasPlans = await checkUserHasLearningPlans(userId);
    
    if (!hasPlans) {
      console.log('Usuario sin planes de aprendizaje. Generando plan predeterminado...');
      const planId = await generatePersonalizedLearningPlan(userId);
      return !!planId;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring user has learning plan:', error);
    return false;
  }
};
