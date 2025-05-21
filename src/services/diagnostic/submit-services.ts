
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";
import { updateUserSkillLevels } from "./skill-services";
import { fetchDiagnosticQuestions } from "./question-services";

/**
 * Submits diagnostic test results to Supabase
 */
export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  answers: Record<string, string>,
  timeSpentMinutes: number
) => {
  try {
    // Fetch the test to have access to questions and correct answers
    const { data: testData, error: testError } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .eq('id', diagnosticId)
      .single();
      
    if (testError) {
      console.error("Error fetching test:", testError);
      throw new Error("No se pudo recuperar la información del diagnóstico");
    }
    
    // Instead of directly accessing diagnostic_questions table, use fetchDiagnosticQuestions
    // which already handles question retrieval safely
    const questions = await fetchDiagnosticQuestions(diagnosticId, testData.test_id);
    
    if (!questions || questions.length === 0) {
      console.error("Error fetching questions: No questions found");
      throw new Error("No se pudieron recuperar las preguntas del diagnóstico");
    }
    
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
    
    // Instead of directly accessing question properties, we need to ensure 
    // we're working with the correct question model that includes skill and correct_answer
    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      // Find the matching question from our questions array
      const question = questions.find(q => q.id === questionId);
      
      if (question && question.skill) {
        const skill = question.skill as TPAESHabilidad;
        skillResults[skill].total += 1;
        
        if (userAnswer === question.correctAnswer) {
          skillResults[skill].correct += 1;
        }
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
