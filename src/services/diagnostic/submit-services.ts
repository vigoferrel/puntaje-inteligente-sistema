
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchDiagnosticQuestions } from "./question/fetch-questions";

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
    // Pasamos diagnosticId como primer argumento, el segundo es opcional
    // Según la firma de la función en fetch-questions.ts, necesita 2 argumentos
    const { data: testData, error: testError } = await supabase
      .from('diagnostic_tests')
      .select('*')
      .eq('id', diagnosticId)
      .single();
      
    if (testError) {
      console.error("Error fetching test:", testError);
      toast({
        title: "Error",
        description: "No se pudo recuperar la información del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    // Ahora pasamos ambos argumentos requeridos
    const questions = await fetchDiagnosticQuestions(diagnosticId, testData.test_id);
    
    if (!questions || questions.length === 0) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las preguntas del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
    
    // Inicializar resultados por habilidad según las enumeraciones actualizadas
    const skillResults: Record<TPAESHabilidad, number> = {
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
        
        // Verificar que la habilidad del ejercicio es una habilidad válida
        if (Object.keys(skillResults).includes(question.skill)) {
          // Incrementar contadores
          skillCounts[question.skill].total++;
          if (isCorrect) {
            skillCounts[question.skill].correct++;
          }
        } else {
          console.warn(`Habilidad no reconocida: ${question.skill}`);
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
        completed_at: new Date().toISOString()
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
      results: data.results as Record<TPAESHabilidad, number>,
      completedAt: data.completed_at
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
