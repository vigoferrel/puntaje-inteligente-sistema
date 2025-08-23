
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

export interface ExamRPCResponse {
  examen: {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    año: number;
    duracion_minutos: number;
    total_preguntas: number;
    preguntas_validas: number;
    instrucciones?: string;
  };
  preguntas: Array<{
    numero: number;
    enunciado: string;
    contexto?: string;
    imagen_url?: string;
    opciones: Array<{
      letra: string;
      contenido: string;
      es_correcta: boolean;
    }>;
  }>;
}

export interface DiagnosticConfig {
  examCode: string;
  title: string;
  description: string;
  testId: number;
  prueba: TPAESPrueba;
  questionCount: number;
}

export abstract class DiagnosticBaseService {
  protected static validateExamResponse(data: unknown): ExamRPCResponse | null {
    try {
      // Safe type validation with unknown intermediate step
      const response = data as unknown as ExamRPCResponse;
      
      if (!response || typeof response !== 'object') {
        return null;
      }
      
      if (!response.examen || !Array.isArray(response.preguntas)) {
        return null;
      }
      
      return response;
    } catch (error) {
      console.warn('Error validating exam response:', error);
      return null;
    }
  }

  protected static mapPruebaToSkill(prueba: TPAESPrueba): TPAESHabilidad {
    const skillMap: Record<TPAESPrueba, TPAESHabilidad> = {
      'COMPETENCIA_LECTORA': 'INTERPRET_RELATE',
      'MATEMATICA_1': 'SOLVE_PROBLEMS',
      'MATEMATICA_2': 'MODEL',
      'CIENCIAS': 'PROCESS_ANALYZE',
      'HISTORIA': 'SOURCE_ANALYSIS'
    };
    
    return skillMap[prueba] || 'INTERPRET_RELATE';
  }

  protected static async getExamData(examCode: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });
      
      if (error) throw error;
      
      const validatedResponse = this.validateExamResponse(data);
      return validatedResponse?.preguntas || [];
    } catch (error) {
      console.warn(`No se pudo obtener examen ${examCode}:`, error);
      return [];
    }
  }
}
