
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchDiagnosticQuestions, getQuestionById } from "./question/fetch-questions";

/**
 * Submits a diagnostic test result
 */
export const submitDiagnosticResult = async (
  userId: string,
  diagnosticId: string,
  answers: Record<string, string>,
  timeSpentMinutes: number
): Promise<DiagnosticResult | null> => {
  try {
    // Obtener las preguntas del diagnóstico
    const questions = await fetchDiagnosticQuestions(diagnosticId);
    
    if (!questions || questions.length === 0) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las preguntas del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    // Inicializar resultados por habilidad
    const skillResults: Record<TPAESHabilidad, number> = {
      'LT-1': 0,
      'LT-2': 0,
      'LT-3': 0,
      'M1': 0,
      'M2': 0,
      'M3': 0,
      'H1': 0,
      'H2': 0,
      'C1': 0,
      'C2': 0,
      'C3': 0
    };
    
    // Contadores para calcular porcentajes por habilidad
    const skillCounts: Record<TPAESHabilidad, { correct: number, total: number }> = {} as any;
    
    // Inicializar contadores
    Object.keys(skillResults).forEach(skill => {
      skillCounts[skill as TPAESHabilidad] = { correct: 0, total: 0 };
    });
    
    // Calcular resultados
    for (const questionId of Object.keys(answers)) {
      const question = questions.find(q => q.id === questionId);
      
      if (question) {
        const userAnswer = answers[questionId];
        const isCorrect = userAnswer === question.correctAnswer;
        
        // Incrementar contadores
        skillCounts[question.skill].total++;
        if (isCorrect) {
          skillCounts[question.skill].correct++;
        }
      }
    }
    
    // Calcular porcentajes por habilidad
    Object.keys(skillCounts).forEach(skill => {
      const { correct, total } = skillCounts[skill as TPAESHabilidad];
      
      if (total > 0) {
        skillResults[skill as TPAESHabilidad] = Math.round((correct / total) * 100);
      } else {
        skillResults[skill as TPAESHabilidad] = 0;
      }
    });
    
    // Guardar resultados en la base de datos
    const { data, error } = await supabase
      .from('user_diagnostic_results')
      .insert({
        user_id: userId,
        diagnostic_id: diagnosticId,
        results: skillResults,
        time_spent: timeSpentMinutes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error submitting diagnostic result:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    // Formatear resultados
    const diagnosticResult: DiagnosticResult = {
      id: data.id,
      userId: data.user_id,
      diagnosticId: data.diagnostic_id,
      results: data.results,
      completedAt: data.created_at
    };
    
    return diagnosticResult;
  } catch (error) {
    console.error('Error in submitDiagnosticResult:', error);
    toast({
      title: "Error",
      description: "Ocurrió un error al procesar los resultados",
      variant: "destructive"
    });
    return null;
  }
};
