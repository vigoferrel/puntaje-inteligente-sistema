
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { 
  fetchLearningPlans as fetchPlans,
  createLearningPlan as createPlan,
  updatePlanProgress as updateProgress
} from "@/services/plan-service";
import { ensureUserHasLearningPlan } from "@/services/learning/plan-generator-service";

/**
 * Fetches all learning plans for a user
 */
export const fetchLearningPlans = async (userId: string): Promise<LearningPlan[]> => {
  console.log('Iniciando carga de planes de estudio...');
  const startTime = performance.now();
  
  try {
    // Execute operations in parallel to optimize
    const initPromise = ensureUserHasLearningPlan(userId);
    const plansPromise = fetchPlans(userId);
    
    // Wait for both operations to complete
    const [plansWithNodes] = await Promise.all([
      plansPromise,
      initPromise
    ]);
    
    const endTime = performance.now();
    console.log(`Planes cargados exitosamente en ${(endTime - startTime).toFixed(2)}ms`);
    
    return plansWithNodes;
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    throw error;
  }
};

/**
 * Creates a learning plan for a user
 */
export const createLearningPlan = async (
  userId: string,
  title: string,
  description?: string,
  targetDate?: string,
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<LearningPlan | null> => {
  try {
    return await createPlan(userId, title, description, targetDate, skillPriorities);
  } catch (error) {
    console.error('Error creating learning plan:', error);
    throw error;
  }
};

/**
 * Updates progress for a learning plan
 */
export const updatePlanProgress = async (
  userId: string, 
  planId: string,
  cachedProgress?: Record<string, PlanProgress>
): Promise<PlanProgress | false> => {
  try {
    console.log(`Actualizando progreso para plan ${planId}`);
    
    // Check if we have cached data
    if (cachedProgress?.[planId]) {
      console.log('Usando datos de progreso en caché mientras se actualiza');
    }
    
    const progress = await updateProgress(userId, planId);
    if (!progress) {
      throw new Error("No se pudo actualizar el progreso del plan");
    }
    
    return progress;
  } catch (error) {
    console.error('Error updating plan progress:', error);
    // Return cached data if available
    if (cachedProgress?.[planId]) {
      console.log('Devolviendo datos de progreso en caché debido al error');
      return cachedProgress[planId];
    }
    return false;
  }
};
