
import { supabase } from "@/integrations/supabase/client";
import { TLearningCyclePhase } from "@/types/system-types";
import { ensureUserHasLearningPlan } from "../learning/plan-generator-service";

/**
 * Determines the current learning cycle phase for a user
 */
export const getLearningCyclePhase = async (userId: string): Promise<TLearningCyclePhase> => {
  try {
    // Primero intentamos obtener la fase desde la base de datos
    const { data, error } = await supabase
      .from('profiles')
      .select('learning_phase')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching learning phase:", error);
      return "DIAGNOSIS"; // Fase predeterminada
    }
    
    // Si tenemos un valor, devolverlo como fase de aprendizaje
    if (data && data.learning_phase) {
      return data.learning_phase as TLearningCyclePhase;
    }
    
    // Si no hay valor en la base de datos, determinar la fase basada en el progreso
    // Verificar si el usuario ha completado el diagnóstico
    const { count: diagnosticCount, error: diagnosticError } = await supabase
      .from('user_diagnostic_results')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (diagnosticError) {
      console.error("Error checking diagnostic results:", diagnosticError);
      return "DIAGNOSIS";
    }
    
    // Si no ha completado ningún diagnóstico, está en la fase de diagnóstico
    if (!diagnosticCount || diagnosticCount === 0) {
      return "DIAGNOSIS";
    }
    
    // Verificar si tiene un plan personalizado
    const hasLearningPlan = await ensureUserHasLearningPlan(userId);
    
    // Si tiene un plan, está en la fase de entrenamiento de habilidades
    if (hasLearningPlan) {
      // Actualizar la fase en la base de datos para futuras consultas
      await updateLearningPhase(userId, "SKILL_TRAINING");
      return "SKILL_TRAINING";
    }
    
    // Si no tiene un plan pero ha completado diagnóstico, está en fase de planificación
    await updateLearningPhase(userId, "PERSONALIZED_PLAN");
    return "PERSONALIZED_PLAN";
  } catch (error) {
    console.error("Error in getLearningCyclePhase:", error);
    return "DIAGNOSIS"; // Fase predeterminada en caso de error
  }
};

/**
 * Updates a user's learning cycle phase
 */
const updateLearningPhase = async (userId: string, phase: TLearningCyclePhase): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ learning_phase: phase })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating learning phase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateLearningPhase:", error);
    return false;
  }
};

/**
 * Advances a user to the next learning phase
 */
export const advanceToNextLearningPhase = async (userId: string): Promise<TLearningCyclePhase | null> => {
  try {
    // Obtener fase actual
    const currentPhase = await getLearningCyclePhase(userId);
    
    // Definir el orden de las fases
    const phases: TLearningCyclePhase[] = [
      "DIAGNOSIS",
      "PERSONALIZED_PLAN",
      "SKILL_TRAINING",
      "CONTENT_STUDY",
      "PERIODIC_TESTS",
      "FEEDBACK_ANALYSIS",
      "REINFORCEMENT",
      "FINAL_SIMULATIONS"
    ];
    
    // Encontrar la fase actual y determinar la siguiente
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < 0 || currentIndex >= phases.length - 1) {
      console.warn("Cannot advance phase: current phase not found or already at last phase");
      return null;
    }
    
    const nextPhase = phases[currentIndex + 1];
    
    // Actualizar la fase
    const success = await updateLearningPhase(userId, nextPhase);
    
    if (!success) {
      return null;
    }
    
    return nextPhase;
  } catch (error) {
    console.error("Error advancing learning phase:", error);
    return null;
  }
};
