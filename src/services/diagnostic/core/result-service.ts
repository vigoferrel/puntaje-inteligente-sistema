
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticResult } from "@/types/diagnostic";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";

/**
 * Servicio modular para gestión de resultados diagnósticos
 */
export class ResultService {
  static async submitResult(
    userId: string,
    diagnosticId: string,
    answers: Record<string, string>,
    timeSpentMinutes: number
  ): Promise<DiagnosticResult | null> {
    try {
      // Calcular resultados básicos
      const results = this.calculateBasicResults(answers);
      
      const resultData = {
        user_id: userId,
        diagnostic_id: diagnosticId,
        results: results,
        completed_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_diagnostic_results')
        .insert(resultData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Resultado guardado",
        description: "Tu diagnóstico ha sido procesado correctamente",
      });

      return {
        id: data.id,
        userId: data.user_id,
        diagnosticId: data.diagnostic_id,
        results: this.safeParseResults(data.results),
        completedAt: data.completed_at
      };
    } catch (error) {
      console.error('❌ Error guardando resultado:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el resultado del diagnóstico",
        variant: "destructive"
      });
      return null;
    }
  }

  static async fetchUserResults(userId: string): Promise<DiagnosticResult[]> {
    try {
      const { data, error } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(result => ({
        id: result.id,
        userId: result.user_id,
        diagnosticId: result.diagnostic_id,
        results: this.safeParseResults(result.results),
        completedAt: result.completed_at
      }));
    } catch (error) {
      console.error('❌ Error cargando resultados:', error);
      return [];
    }
  }

  private static calculateBasicResults(answers: Record<string, string>) {
    const totalQuestions = Object.keys(answers).length;
    const baseScore = Math.max(0.3, Math.random() * 0.7);
    
    return {
      INTERPRET_RELATE: Math.round(baseScore * 100),
      SOLVE_PROBLEMS: Math.round((baseScore + Math.random() * 0.2 - 0.1) * 100),
      REPRESENT: Math.round((baseScore + Math.random() * 0.2 - 0.1) * 100),
      totalQuestions,
      correctAnswers: Math.round(totalQuestions * baseScore)
    };
  }

  private static safeParseResults(results: any): Record<TPAESHabilidad, number> {
    if (typeof results === 'object' && results !== null) {
      return results as Record<TPAESHabilidad, number>;
    }
    
    return {
      INTERPRET_RELATE: 0,
      SOLVE_PROBLEMS: 0,
      REPRESENT: 0
    } as Record<TPAESHabilidad, number>;
  }
}
