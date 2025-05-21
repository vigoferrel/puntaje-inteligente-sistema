
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";
import { updateUserSkillLevels } from "./skill-services";

/**
 * Submits diagnostic test results to Supabase
 */
export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  test: DiagnosticTest,
  answers: Record<string, string>,
  timeSpentMinutes: number
) => {
  try {
    // Initialize default record with all skills at 0
    const defaultSkillResults: Record<TPAESHabilidad, { correct: number, total: number }> = {
      SOLVE_PROBLEMS: { correct: 0, total: 0 },
      REPRESENT: { correct: 0, total: 0 },
      MODEL: { correct: 0, total: 0 },
      INTERPRET_RELATE: { correct: 0, total: 0 },
      EVALUATE_REFLECT: { correct: 0, total: 0 },
      TRACK_LOCATE: { correct: 0, total: 0 },
      ARGUE_COMMUNICATE: { correct: 0, total: 0 },
      IDENTIFY_THEORIES: { correct: 0, total: 0 },
      PROCESS_ANALYZE: { correct: 0, total: 0 },
      APPLY_PRINCIPLES: { correct: 0, total: 0 },
      SCIENTIFIC_ARGUMENT: { correct: 0, total: 0 },
      TEMPORAL_THINKING: { correct: 0, total: 0 },
      SOURCE_ANALYSIS: { correct: 0, total: 0 },
      MULTICAUSAL_ANALYSIS: { correct: 0, total: 0 },
      CRITICAL_THINKING: { correct: 0, total: 0 },
      REFLECTION: { correct: 0, total: 0 }
    };
    
    // Calculate skill levels based on answers
    const skillResults = { ...defaultSkillResults };
    
    test.questions.forEach(question => {
      const skill = question.skill;
      
      skillResults[skill].total += 1;
      if (answers[question.id] === question.correctAnswer) {
        skillResults[skill].correct += 1;
      }
    });
    
    // Initialize default results with all skills at 0
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
    
    // Calculate level for each skill (0 to 1)
    const results = { ...defaultResults };
    Object.entries(skillResults).forEach(([skill, data]) => {
      results[skill as TPAESHabilidad] = data.total > 0 ? data.correct / data.total : 0;
    });
    
    // Save results to database
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .insert({
        user_id: userId,
        diagnostic_id: diagnosticId,
        results,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update user skill levels
    await updateUserSkillLevels(userId, results);
    
    // Return the result
    if (data) {
      // Cast data.results to the correct type
      const resultData = data.results as unknown as Record<TPAESHabilidad, number>;
      
      const newResult: DiagnosticResult = {
        id: data.id,
        userId: data.user_id,
        diagnosticId: data.diagnostic_id,
        results: resultData,
        completedAt: data.completed_at
      };
      
      return newResult;
    }
    
    return null;
  } catch (error) {
    console.error('Error submitting diagnostic result:', error);
    toast({
      title: "Error",
      description: "No se pudo guardar los resultados del diagnóstico",
      variant: "destructive"
    });
    return null;
  }
};
