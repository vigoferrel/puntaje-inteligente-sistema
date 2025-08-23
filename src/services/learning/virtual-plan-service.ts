
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { calculateSkillLevelsFromAttempts } from "../diagnostic/skill-services";

/**
 * Virtual Learning Plan - basado en user_node_progress existente
 */
interface VirtualLearningPlan {
  id: string;
  title: string;
  description: string;
  nodes: any[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  createdAt: string;
}

/**
 * Genera un plan de aprendizaje virtual basado en las habilidades del usuario
 */
export const generateVirtualLearningPlan = async (
  userId: string,
  title?: string,
  description?: string
): Promise<VirtualLearningPlan | null> => {
  try {
    // Obtener niveles de habilidades del usuario
    const skillLevels = await calculateSkillLevelsFromAttempts(userId);
    
    // Identificar habilidades que necesitan mejora (nivel < 0.6)
    const skillsToImprove: TPAESHabilidad[] = Object.entries(skillLevels)
      .filter(([, level]) => level < 0.6)
      .map(([skill]) => skill as TPAESHabilidad)
      .slice(0, 5);
    
    // Si no hay habilidades específicas para mejorar, tomar las 3 más bajas
    if (skillsToImprove.length === 0) {
      const sortedSkills = Object.entries(skillLevels)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 3)
        .map(([skill]) => skill as TPAESHabilidad);
      
      skillsToImprove.push(...sortedSkills);
    }
    
    // Crear plan virtual
    const planTitle = title || `Plan de mejora PAES - ${new Date().toLocaleDateString()}`;
    const planDescription = description || 
      `Plan personalizado enfocado en mejorar las siguientes habilidades: ${skillsToImprove.join(', ')}`;
    
    // Obtener nodos recomendados basados en habilidades
    const recommendedNodes = await getRecommendedNodesForSkills(skillsToImprove);
    
    // Obtener progreso del usuario en estos nodos
    const userProgress = await getUserProgressForNodes(userId, recommendedNodes.map(n => n.id));
    
    const completedNodes = userProgress.filter(p => p.status === 'completed').length;
    
    const virtualPlan: VirtualLearningPlan = {
      id: `virtual-plan-${userId}-${Date.now()}`,
      title: planTitle,
      description: planDescription,
      nodes: recommendedNodes,
      progress: {
        completed: completedNodes,
        total: recommendedNodes.length,
        percentage: recommendedNodes.length > 0 ? (completedNodes / recommendedNodes.length) * 100 : 0
      },
      createdAt: new Date().toISOString()
    };
    
    return virtualPlan;
  } catch (error) {
    console.error('Error generating virtual learning plan:', error);
    toast({
      title: "Error",
      description: "No se pudo generar el plan de aprendizaje",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Obtiene nodos recomendados para habilidades específicas
 */
const getRecommendedNodesForSkills = async (skills: TPAESHabilidad[]) => {
  try {
    const { data: nodes, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .order('difficulty', { ascending: true })
      .order('position', { ascending: true })
      .limit(15);
    
    if (error) throw error;
    
    return nodes || [];
  } catch (error) {
    console.error('Error fetching recommended nodes:', error);
    return [];
  }
};

/**
 * Obtiene el progreso del usuario en nodos específicos
 */
const getUserProgressForNodes = async (userId: string, nodeIds: string[]) => {
  try {
    const { data: progress, error } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (error) throw error;
    
    return progress || [];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};

/**
 * Verifica si un usuario tiene progreso en nodos (equivalente a planes)
 */
export const checkUserHasProgress = async (userId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('user_node_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (count !== null && count > 0);
  } catch (error) {
    console.error('Error checking if user has progress:', error);
    return false;
  }
};

/**
 * Asegura que el usuario tenga un plan virtual
 */
export const ensureUserHasVirtualPlan = async (userId: string): Promise<boolean> => {
  try {
    const hasProgress = await checkUserHasProgress(userId);
    
    if (!hasProgress) {
      console.log('Usuario sin progreso. Generando plan virtual...');
      const plan = await generateVirtualLearningPlan(userId);
      return !!plan;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring user has virtual plan:', error);
    return false;
  }
};

/**
 * Obtiene el plan virtual actual del usuario
 */
export const getCurrentVirtualPlan = async (userId: string): Promise<VirtualLearningPlan | null> => {
  try {
    return await generateVirtualLearningPlan(userId);
  } catch (error) {
    console.error('Error getting current virtual plan:', error);
    return null;
  }
};
