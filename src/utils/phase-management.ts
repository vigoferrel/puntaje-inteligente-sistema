
import { setLearningPhase } from "@/services/node/learning-cycle-service";
import { TLearningCyclePhase } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";

/**
 * Sets the learning phase for a user
 * @param userId User ID
 * @param phase Phase to set
 * @returns Promise<boolean> Success status
 */
export const setUserLearningPhase = async (
  userId: string, 
  phase: TLearningCyclePhase
): Promise<boolean> => {
  try {
    const success = await setLearningPhase(userId, phase);
    
    if (success) {
      toast({
        title: "Fase actualizada",
        description: `La fase de aprendizaje ha sido actualizada exitosamente`
      });
      return true;
    } else {
      toast({
        title: "Error",
        description: "No se pudo actualizar la fase de aprendizaje",
        variant: "destructive"
      });
      return false;
    }
  } catch (error) {
    console.error("Error setting learning phase:", error);
    toast({
      title: "Error",
      description: "Ocurrió un error al actualizar la fase de aprendizaje",
      variant: "destructive"
    });
    return false;
  }
};

// Función para avanzar directamente a la fase 3 (SKILL_TRAINING)
export const advanceToPhase3 = async (userId: string): Promise<boolean> => {
  console.log("Advancing to phase 3 (SKILL_TRAINING)...");
  return await setUserLearningPhase(userId, "SKILL_TRAINING");
};
