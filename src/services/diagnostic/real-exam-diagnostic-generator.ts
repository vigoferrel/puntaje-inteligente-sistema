import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapDifficultyToSpanish } from "@/utils/difficulty-mapper";

interface RealExamDiagnostic {
  examCode: string;
  title: string;
  description: string;
  testId: number;
  prueba: TPAESPrueba;
  questionCount: number;
}

interface ExamRPCResponse {
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

const REAL_EXAM_DIAGNOSTICS: RealExamDiagnostic[] = [
  {
    examCode: 'PAES-2024-FORM-103',
    title: 'Diagnóstico Comprensión Lectora PAES 2024',
    description: 'Evaluación basada en preguntas oficiales PAES de Competencia Lectora',
    testId: 1,
    prueba: 'COMPETENCIA_LECTORA',
    questionCount: 12
  },
  {
    examCode: 'MATEMATICA_M1_2024_FORMA_123',
    title: 'Diagnóstico Matemática M1 PAES 2024',
    description: 'Evaluación oficial de Matemática M1 con preguntas representativas',
    testId: 2,
    prueba: 'MATEMATICA_1',
    questionCount: 15
  },
  {
    examCode: 'MATEMATICA_M2_2024_FORMA_456',
    title: 'Diagnóstico Matemática M2 PAES 2024',
    description: 'Evaluación avanzada de Matemática M2 basada en examen oficial',
    testId: 3,
    prueba: 'MATEMATICA_2',
    questionCount: 15
  },
  {
    examCode: 'CIENCIAS_2024_FORMA_789',
    title: 'Diagnóstico Ciencias PAES 2024',
    description: 'Evaluación integral de Ciencias con preguntas oficiales',
    testId: 5,
    prueba: 'CIENCIAS',
    questionCount: 18
  },
  {
    examCode: 'HISTORIA_2024_FORMA_123',
    title: 'Diagnóstico Historia PAES 2024',
    description: 'Evaluación de competencias históricas basada en PAES oficial',
    testId: 4,
    prueba: 'HISTORIA',
    questionCount: 12
  }
];

export class RealExamDiagnosticGenerator {
  
  static async generateAllDiagnostics(): Promise<DiagnosticTest[]> {
    console.log('🔬 Generando diagnósticos desde exámenes reales...');
    
    const diagnostics: DiagnosticTest[] = [];
    
    for (const examConfig of REAL_EXAM_DIAGNOSTICS) {
      try {
        const diagnostic = await this.generateDiagnosticFromExam(examConfig);
        if (diagnostic) {
          diagnostics.push(diagnostic);
          console.log(`✅ Diagnóstico generado: ${diagnostic.title}`);
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo generar diagnóstico para ${examConfig.examCode}:`, error);
        // Crear diagnóstico fallback
        const fallbackDiagnostic = this.createFallbackDiagnostic(examConfig);
        diagnostics.push(fallbackDiagnostic);
      }
    }
    
    return diagnostics;
  }
  
  private static async generateDiagnosticFromExam(config: RealExamDiagnostic): Promise<DiagnosticTest | null> {
    try {
      // Intentar obtener preguntas del examen real
      const examData = await this.getExamQuestions(config.examCode);
      
      if (examData && examData.length > 0) {
        const selectedQuestions = this.selectRepresentativeQuestions(examData, config.questionCount);
        const diagnosticQuestions = selectedQuestions.map(q => this.convertToDelicateQuestion(q, config));
        
        return {
          id: `real-exam-${config.testId}`,
          title: config.title,
          description: config.description,
          testId: config.testId,
          questions: diagnosticQuestions,
          isCompleted: false
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error generando diagnóstico para ${config.examCode}:`, error);
      return null;
    }
  }
  
  private static async getExamQuestions(examCode: string): Promise<any[]> {
    try {
      // Usar función RPC para obtener examen completo
      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });
      
      if (error) throw error;
      
      // Cast seguro usando unknown como intermediario y validación
      const examResponse = this.validateAndCastExamResponse(data);
      return examResponse?.preguntas || [];
    } catch (error) {
      console.warn(`No se pudo obtener examen ${examCode}, usando consulta directa`);
      
      // Fallback: consulta directa
      const { data: examenes } = await supabase
        .from('examenes')
        .select('id')
        .eq('codigo', examCode)
        .single();
      
      if (!examenes) return [];
      
      const { data: preguntas } = await supabase
        .from('preguntas')
        .select(`
          numero,
          enunciado,
          contexto,
          opciones_respuesta (
            letra,
            contenido,
            es_correcta
          )
        `)
        .eq('examen_id', examenes.id)
        .limit(20);
      
      return preguntas || [];
    }
  }
  
  // Función auxiliar para validar y hacer cast seguro
  private static validateAndCastExamResponse(data: unknown): ExamRPCResponse | null {
    try {
      // Primer cast a unknown, luego validación de estructura
      const response = data as unknown;
      
      if (!response || typeof response !== 'object') {
        console.warn('Respuesta del examen no es un objeto válido');
        return null;
      }
      
      const examResponse = response as ExamRPCResponse;
      
      // Validar que tiene la estructura esperada
      if (!examResponse.examen || !Array.isArray(examResponse.preguntas)) {
        console.warn('Estructura de respuesta del examen no válida');
        return null;
      }
      
      return examResponse;
    } catch (error) {
      console.warn('Error validando respuesta del examen:', error);
      return null;
    }
  }
  
  private static selectRepresentativeQuestions(questions: any[], targetCount: number): any[] {
    // Seleccionar preguntas distribuidas uniformemente
    if (questions.length <= targetCount) {
      return questions;
    }
    
    const step = Math.floor(questions.length / targetCount);
    const selected = [];
    
    for (let i = 0; i < targetCount && i * step < questions.length; i++) {
      selected.push(questions[i * step]);
    }
    
    return selected;
  }
  
  private static convertToDelicateQuestion(rawQuestion: any, config: RealExamDiagnostic): DiagnosticQuestion {
    const options = rawQuestion.opciones || rawQuestion.opciones_respuesta || [];
    const correctOption = options.find((opt: any) => opt.es_correcta);
    
    return {
      id: `${config.examCode}-q${rawQuestion.numero}`,
      question: rawQuestion.enunciado,
      options: options.map((opt: any) => `${opt.letra}) ${opt.contenido}`),
      correctAnswer: correctOption ? `${correctOption.letra}) ${correctOption.contenido}` : options[0]?.contenido || 'A',
      skill: this.mapPruebaToSkill(config.prueba),
      prueba: config.prueba,
      explanation: rawQuestion.contexto || `Pregunta ${rawQuestion.numero} del examen oficial ${config.examCode}`,
      difficulty: mapDifficultyToSpanish('intermediate')
    };
  }
  
  private static mapPruebaToSkill(prueba: TPAESPrueba): TPAESHabilidad {
    const skillMap: Record<TPAESPrueba, TPAESHabilidad> = {
      'COMPETENCIA_LECTORA': 'INTERPRET_RELATE',
      'MATEMATICA_1': 'SOLVE_PROBLEMS',
      'MATEMATICA_2': 'MODEL',
      'CIENCIAS': 'PROCESS_ANALYZE',
      'HISTORIA': 'SOURCE_ANALYSIS'
    };
    
    return skillMap[prueba] || 'INTERPRET_RELATE';
  }
  
  private static createFallbackDiagnostic(config: RealExamDiagnostic): DiagnosticTest {
    const sampleQuestions: DiagnosticQuestion[] = Array.from({ length: Math.min(config.questionCount, 8) }, (_, i) => ({
      id: `fallback-${config.testId}-q${i + 1}`,
      question: `Pregunta diagnóstica ${i + 1} de ${config.title}`,
      options: [
        'A) Opción de muestra A',
        'B) Opción de muestra B', 
        'C) Opción de muestra C',
        'D) Opción de muestra D'
      ],
      correctAnswer: 'A) Opción de muestra A',
      skill: this.mapPruebaToSkill(config.prueba),
      prueba: config.prueba,
      explanation: `Pregunta generada automáticamente para ${config.title}`,
      difficulty: mapDifficultyToSpanish('basic')
    }));
    
    return {
      id: `fallback-${config.testId}`,
      title: config.title,
      description: `${config.description} (Versión de demostración)`,
      testId: config.testId,
      questions: sampleQuestions,
      isCompleted: false
    };
  }
}
