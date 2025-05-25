import { supabase } from '@/integrations/supabase/client';
import { contentOrchestrator } from '@/services/content-optimization/ContentOrchestrator';
import { BancoEvaluacionesService } from '@/services/banco-evaluaciones/BancoEvaluacionesService';
import { DiagnosticTest, DiagnosticQuestion } from '@/types/diagnostic';

interface OptimizedDiagnosticConfig {
  prueba: string;
  totalQuestions: number;
  officialRatio: number; // % de preguntas oficiales vs IA
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  adaptiveMode: boolean;
}

/**
 * SERVICIO DIAGNÓSTICO OPTIMIZADO
 * 90% contenido oficial + 10% IA adaptativa personalizada
 */
export class OptimizedDiagnosticService {
  private static instance: OptimizedDiagnosticService;

  static getInstance(): OptimizedDiagnosticService {
    if (!OptimizedDiagnosticService.instance) {
      OptimizedDiagnosticService.instance = new OptimizedDiagnosticService();
    }
    return OptimizedDiagnosticService.instance;
  }

  /**
   * GENERAR DIAGNÓSTICO OPTIMIZADO
   * Prioriza preguntas oficiales PAES
   */
  async generateOptimizedDiagnostic(
    config: OptimizedDiagnosticConfig,
    userId?: string
  ): Promise<DiagnosticTest> {
    console.log(`🧪 Generando diagnóstico optimizado para ${config.prueba}`);

    const officialQuestions = Math.floor(config.totalQuestions * (config.officialRatio / 100));
    const aiQuestions = config.totalQuestions - officialQuestions;

    console.log(`📊 Distribución: ${officialQuestions} oficiales + ${aiQuestions} IA`);

    try {
      // 1. Obtener preguntas oficiales del banco
      const officialTestQuestions = await this.getOfficialQuestions(
        config.prueba,
        officialQuestions,
        config.difficulty
      );

      // 2. Generar preguntas IA solo si es necesario
      const aiTestQuestions = aiQuestions > 0 
        ? await this.generateAIQuestions(config.prueba, aiQuestions, config.difficulty, userId)
        : [];

      // 3. Combinar y ordenar aleatoriamente
      const allQuestions = [...officialTestQuestions, ...aiTestQuestions]
        .sort(() => Math.random() - 0.5);

      // 4. Crear test diagnóstico
      const diagnosticTest: DiagnosticTest = {
        id: `optimized-${config.prueba.toLowerCase()}-${Date.now()}`,
        title: `Diagnóstico Optimizado ${this.getPruebaDisplayName(config.prueba)}`,
        description: `Evaluación inteligente con ${officialQuestions} preguntas oficiales PAES + ${aiQuestions} preguntas adaptativas`,
        testId: this.getTestId(config.prueba),
        questions: allQuestions,
        isCompleted: false,
        metadata: {
          source: 'optimized',
          officialCount: officialQuestions,
          aiCount: aiQuestions,
          totalCostSavings: officialQuestions * 0.02, // Ahorro por pregunta oficial
          quality: 'premium'
        }
      };

      console.log(`✅ Diagnóstico optimizado generado: ${diagnosticTest.title}`);
      console.log(`💰 Ahorro estimado: $${diagnosticTest.metadata?.totalCostSavings?.toFixed(2)}`);

      return diagnosticTest;

    } catch (error) {
      console.error('Error generando diagnóstico optimizado:', error);
      return this.createFallbackDiagnostic(config);
    }
  }

  /**
   * OBTENER PREGUNTAS OFICIALES DEL BANCO
   */
  private async getOfficialQuestions(
    prueba: string,
    count: number,
    difficulty: string
  ): Promise<DiagnosticQuestion[]> {
    try {
      // Usar BancoEvaluacionesService para obtener preguntas reales
      const evaluacion = await BancoEvaluacionesService.generarEvaluacionOptimizada({
        tipo_evaluacion: 'diagnostica',
        prueba_paes: prueba,
        total_preguntas: count,
        duracion_minutos: count * 2,
        distribucion_dificultad: { 
          basico: difficulty === 'BASICO' ? 100 : 0,
          intermedio: difficulty === 'INTERMEDIO' ? 100 : 0,
          avanzado: difficulty === 'AVANZADO' ? 100 : 0
        }
      });

      if (evaluacion.preguntas && evaluacion.preguntas.length > 0) {
        return evaluacion.preguntas.map((pregunta: any, index: number) => ({
          id: `oficial-${pregunta.id}`,
          question: pregunta.enunciado,
          options: pregunta.alternativas?.map((alt: any) => alt.contenido) || [],
          correctAnswer: pregunta.alternativas?.find((alt: any) => alt.es_correcta)?.contenido || '',
          explanation: this.generateOfficialExplanation(pregunta),
          difficulty: difficulty as any,
          skill: this.mapToSkill(pregunta.competencia_especifica),
          prueba: prueba,
          metadata: {
            source: 'oficial_paes',
            originalId: pregunta.id,
            nodoCode: pregunta.nodo_code,
            costSaving: 0.02
          }
        }));
      }

      console.warn(`⚠️ No se encontraron preguntas oficiales para ${prueba}`);
      return [];

    } catch (error) {
      console.error('Error obteniendo preguntas oficiales:', error);
      return [];
    }
  }

  /**
   * GENERAR PREGUNTAS IA ADAPTATIVAS
   */
  private async generateAIQuestions(
    prueba: string,
    count: number,
    difficulty: string,
    userId?: string
  ): Promise<DiagnosticQuestion[]> {
    const questions: DiagnosticQuestion[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const exercise = await contentOrchestrator.generateOptimizedExercise(
          prueba,
          'INTERPRET_RELATE',
          difficulty,
          userId
        );

        questions.push({
          id: `ai-${exercise.id}`,
          question: exercise.question,
          options: exercise.options,
          correctAnswer: exercise.correctAnswer,
          explanation: exercise.explanation,
          difficulty: difficulty as any,
          skill: 'INTERPRET_RELATE',
          prueba: prueba,
          metadata: {
            source: 'ai_adaptive',
            costUsed: 0.015
          }
        });

      } catch (error) {
        console.error(`Error generando pregunta IA ${i + 1}:`, error);
        questions.push(this.createFallbackQuestion(prueba, difficulty, i + 1));
      }
    }

    return questions;
  }

  /**
   * DIAGNÓSTICO FALLBACK SEGURO
   */
  private createFallbackDiagnostic(config: OptimizedDiagnosticConfig): DiagnosticTest {
    const fallbackQuestions = Array.from({ length: config.totalQuestions }, (_, i) => 
      this.createFallbackQuestion(config.prueba, config.difficulty, i + 1)
    );

    return {
      id: `fallback-${config.prueba.toLowerCase()}-${Date.now()}`,
      title: `Diagnóstico ${this.getPruebaDisplayName(config.prueba)} (Modo Seguro)`,
      description: `Evaluación básica de ${config.prueba} con preguntas de práctica`,
      testId: this.getTestId(config.prueba),
      questions: fallbackQuestions,
      isCompleted: false,
      metadata: {
        source: 'fallback',
        quality: 'basic'
      }
    };
  }

  private createFallbackQuestion(prueba: string, difficulty: string, number: number): DiagnosticQuestion {
    const templates = this.getQuestionTemplates(prueba);
    const template = templates[Math.floor(Math.random() * templates.length)];

    return {
      id: `fallback-${prueba.toLowerCase()}-${number}`,
      question: template.question.replace('{number}', number.toString()),
      options: template.options,
      correctAnswer: template.options[0], // Primera opción siempre correcta en fallback
      explanation: template.explanation,
      difficulty: difficulty as any,
      skill: 'INTERPRET_RELATE',
      prueba: prueba,
      metadata: {
        source: 'fallback',
        template: true
      }
    };
  }

  // Métodos auxiliares
  private getQuestionTemplates(prueba: string) {
    const templates: Record<string, any[]> = {
      'COMPETENCIA_LECTORA': [
        {
          question: 'Pregunta {number} de Comprensión Lectora: ¿Cuál es la idea principal del texto?',
          options: ['La idea central del texto', 'Una idea secundaria', 'Un detalle específico', 'Una conclusión errónea'],
          explanation: 'La idea principal es el concepto central que desarrolla el texto.'
        }
      ],
      'MATEMATICA_1': [
        {
          question: 'Pregunta {number} de Matemática M1: Si x + 3 = 7, ¿cuál es el valor de x?',
          options: ['4', '3', '7', '10'],
          explanation: 'Para resolver x + 3 = 7, restamos 3 de ambos lados: x = 7 - 3 = 4'
        }
      ],
      'MATEMATICA_2': [
        {
          question: 'Pregunta {number} de Matemática M2: ¿Cuál es la derivada de f(x) = x²?',
          options: ['2x', 'x²', 'x', '2'],
          explanation: 'La derivada de x² es 2x aplicando la regla de potencias.'
        }
      ],
      'CIENCIAS': [
        {
          question: 'Pregunta {number} de Ciencias: ¿Cuál es la función principal de los cloroplastos?',
          options: ['Fotosíntesis', 'Respiración', 'Digestión', 'Reproducción'],
          explanation: 'Los cloroplastos son organelos responsables de la fotosíntesis en las plantas.'
        }
      ],
      'HISTORIA': [
        {
          question: 'Pregunta {number} de Historia: ¿En qué año se independizó Chile?',
          options: ['1810', '1818', '1820', '1823'],
          explanation: 'Chile declaró su independencia en 1810, consolidándola en 1818.'
        }
      ]
    };

    return templates[prueba] || templates['COMPETENCIA_LECTORA'];
  }

  private getPruebaDisplayName(prueba: string): string {
    const names: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'Comprensión Lectora',
      'MATEMATICA_1': 'Matemática M1',
      'MATEMATICA_2': 'Matemática M2', 
      'CIENCIAS': 'Ciencias',
      'HISTORIA': 'Historia y Geografía'
    };
    return names[prueba] || prueba;
  }

  private getTestId(prueba: string): number {
    const ids: Record<string, number> = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'CIENCIAS': 5,
      'HISTORIA': 4
    };
    return ids[prueba] || 1;
  }

  private mapToSkill(competencia?: string): string {
    if (!competencia) return 'INTERPRET_RELATE';
    
    if (competencia.includes('localizar') || competencia.includes('ubicar')) {
      return 'TRACK_LOCATE';
    }
    if (competencia.includes('evaluar') || competencia.includes('reflexionar')) {
      return 'EVALUATE_REFLECT';
    }
    
    return 'INTERPRET_RELATE';
  }

  private generateOfficialExplanation(pregunta: any): string {
    const base = `Esta es una pregunta oficial de PAES que evalúa ${pregunta.competencia_especifica || 'competencias fundamentales'}.`;
    
    if (pregunta.contexto_situacional) {
      return `${base} El contexto presenta una situación real que requiere aplicar conocimientos teóricos.`;
    }
    
    return `${base} Esta pregunta está diseñada según los estándares oficiales del DEMRE.`;
  }
}

export const optimizedDiagnosticService = OptimizedDiagnosticService.getInstance();
