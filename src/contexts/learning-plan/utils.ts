
import { TPAESHabilidad } from "@/types/system-types";

// Helper function to map node skill safely
export function mapNodeSkillSafely(skillId: number | undefined | null): TPAESHabilidad {
  if (skillId === undefined || skillId === null) return 'MODEL';
  
  try {
    // Use a hardcoded mapping to avoid import issues
    const skillMapping: Record<number, TPAESHabilidad> = {
      1: "TRACK_LOCATE",
      2: "INTERPRET_RELATE",
      3: "EVALUATE_REFLECT",
      4: "SOLVE_PROBLEMS",
      5: "REPRESENT",
      6: "MODEL",
      7: "ARGUE_COMMUNICATE",
      8: "IDENTIFY_THEORIES",
      9: "PROCESS_ANALYZE",
      10: "APPLY_PRINCIPLES",
      11: "SCIENTIFIC_ARGUMENT",
      12: "TEMPORAL_THINKING",
      13: "SOURCE_ANALYSIS",
      14: "MULTICAUSAL_ANALYSIS",
      15: "CRITICAL_THINKING",
      16: "REFLECTION"
    };
    
    return skillMapping[skillId] || 'MODEL';
  } catch (e) {
    console.error(`Error mapping skill ID ${skillId}:`, e);
    return 'MODEL';
  }
}
