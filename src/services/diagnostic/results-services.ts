
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Fetches diagnostic results for a user from Supabase
 */
export const fetchDiagnosticResults = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (data) {
      // Initialize default results record
      const defaultResults: Record<TPAESHabilidad, number> = {
        SOLVE_PROBLEMS: 0,
        REPRESENT: 0,
        MODEL: 0,
        INTERPRET_RELATE: 0,
        EVALUATE_REFLECT: 0,
        TRACK_LOCATE: 0,
        ARGUE_COMMUNICATE: 0,
        IDENTIFY_THEORIES: 0,
        PROCESS_ANALYZE: 0,
        APPLY_PRINCIPLES: 0,
        SCIENTIFIC_ARGUMENT: 0,
        TEMPORAL_THINKING: 0,
        SOURCE_ANALYSIS: 0,
        MULTICAUSAL_ANALYSIS: 0,
        CRITICAL_THINKING: 0,
        REFLECTION: 0
      };
      
      const mappedResults: DiagnosticResult[] = data.map(result => ({
        id: result.id,
        userId: result.user_id,
        diagnosticId: result.diagnostic_id,
        // Cast database results to our type or use default values
        results: (result.results as unknown as Record<TPAESHabilidad, number>) || defaultResults,
        completedAt: result.completed_at
      }));
      
      return mappedResults;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching diagnostic results:', error);
    return [];
  }
};
