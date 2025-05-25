
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";

// Ultra-simplified interface to avoid any type recursion
interface BasicExerciseData {
  id: string;
  question?: string;
  options?: string;
  correct_answer?: string;
  explanation?: string;
  [key: string]: unknown; // Allow any other properties
}

export class ComprehensiveDiagnosticGenerator {
  private static instance: ComprehensiveDiagnosticGenerator;

  static getInstance(): ComprehensiveDiagnosticGenerator {
    if (!ComprehensiveDiagnosticGenerator.instance) {
      ComprehensiveDiagnosticGenerator.instance = new ComprehensiveDiagnosticGenerator();
    }
    return ComprehensiveDiagnosticGenerator.instance;
  }

  static async generateAllDiagnostics(userId: string): Promise<DiagnosticTest[]> {
    const generator = ComprehensiveDiagnosticGenerator.getInstance();
    
    try {
      console.log(`🎯 Generando todos los diagnósticos para usuario: ${userId}`);
      
      const allPruebas = [
        'COMPETENCIA_LECTORA',
        'MATEMATICA_1', 
        'MATEMATICA_2',
        'CIENCIAS',
        'HISTORIA'
      ];
      
      const diagnostics: DiagnosticTest[] = [];
      
      for (const prueba of allPruebas) {
        try {
          const diagnostic = await generator.generateComprehensiveDiagnostic(prueba, 'intermediate', 15);
          diagnostics.push(diagnostic);
        } catch (error) {
          console.warn(`⚠️ Error generando diagnóstico para ${prueba}:`, error);
        }
      }
      
      console.log(`✅ Generados ${diagnostics.length} diagnósticos integrales`);
      return diagnostics;
      
    } catch (error) {
      console.error('❌ Error en generateAllDiagnostics:', error);
      return [];
    }
  }

  async generateComprehensiveDiagnostic(
    prueba: string,
    targetLevel: string = 'intermediate',
    questionCount: number = 20
  ): Promise<DiagnosticTest> {
    console.log(`🎯 Generando diagnóstico comprehensivo para ${prueba}`);

    try {
      const questions = await this.fetchDatabaseQuestions(prueba, questionCount);
      
      if (questions.length === 0) {
        console.warn('⚠️ No se encontraron preguntas en BD, generando fallback');
        return this.generateFallbackDiagnostic(prueba, targetLevel, questionCount);
      }

      const diagnostic: DiagnosticTest = {
        id: `comprehensive-${prueba.toLowerCase()}-${Date.now()}`,
        title: `Diagnóstico Comprehensivo - ${this.getPruebaDisplayName(prueba)}`,
        description: `Evaluación integral de todas las habilidades de ${this.getPruebaDisplayName(prueba)}`,
        testId: this.getTestIdForPrueba(prueba),
        questions: questions.slice(0, questionCount),
        isCompleted: false,
        metadata: {
          source: 'comprehensive_generator',
          officialCount: questions.filter(q => q.metadata?.source === 'oficial').length,
          aiCount: questions.filter(q => q.metadata?.source === 'ai_generated').length,
          totalCostSavings: questions.length * 0.15,
          quality: 'high',
        }
      };

      console.log(`✅ Diagnóstico comprehensivo generado: ${questions.length} preguntas`);
      return diagnostic;

    } catch (error) {
      console.error('❌ Error generando diagnóstico comprehensivo:', error);
      return this.generateFallbackDiagnostic(prueba, targetLevel, questionCount);
    }
  }

  private async fetchDatabaseQuestions(
    prueba: string,
    limit: number
  ): Promise<DiagnosticQuestion[]> {
    try {
      const { data: exercises, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('prueba', prueba)
        .limit(limit);

      if (error || !exercises) {
        console.warn('⚠️ Error fetching exercises:', error);
        return [];
      }

      // Use explicit for loop with ultra-simple mapping
      const mappedQuestions: DiagnosticQuestion[] = [];
      for (let i = 0; i < exercises.length; i++) {
        const rawExercise = exercises[i] as unknown;
        const basicExercise = rawExercise as BasicExerciseData;
        const mappedQuestion = this.createBasicQuestion(basicExercise);
        mappedQuestions.push(mappedQuestion);
      }

      return mappedQuestions;
    } catch (error) {
      console.error('❌ Error in fetchDatabaseQuestions:', error);
      return [];
    }
  }

  // Ultra-simplified mapping function with explicit types
  private createBasicQuestion(exercise: BasicExerciseData): DiagnosticQuestion {
    const question: DiagnosticQuestion = {
      id: exercise.id || `q-${Date.now()}-${Math.random()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: this.parseBasicOptions(exercise.options),
      correctAnswer: exercise.correct_answer || 'Opción A',
      explanation: exercise.explanation || '',
      difficulty: 'INTERMEDIO' as const,
      skill: 'INTERPRET_RELATE',
      prueba: 'COMPETENCIA_LECTORA',
      metadata: {
        source: 'database' as const,
        originalId: exercise.id
      }
    };
    return question;
  }

  private parseBasicOptions(options: unknown): string[] {
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) {
          return parsed.map(String);
        }
        return [options];
      } catch {
        return [options];
      }
    }
    if (Array.isArray(options)) {
      return options.map(String);
    }
    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private generateFallbackDiagnostic(
    prueba: string,
    targetLevel: string,
    questionCount: number
  ): DiagnosticTest {
    console.log('🔄 Creando diagnóstico fallback locales...');
    
    const questions: DiagnosticQuestion[] = [];
    for (let i = 0; i < questionCount; i++) {
      const question: DiagnosticQuestion = {
        id: `fallback-${prueba}-${i + 1}`,
        question: `Pregunta ${i + 1} de ${this.getPruebaDisplayName(prueba)}. Evalúa tu comprensión de conceptos fundamentales.`,
        options: [
          'Opción A: Primera alternativa',
          'Opción B: Segunda alternativa',
          'Opción C: Tercera alternativa',
          'Opción D: Cuarta alternativa'
        ],
        correctAnswer: 'Opción A: Primera alternativa',
        explanation: `Esta pregunta evalúa habilidades fundamentales de ${this.getPruebaDisplayName(prueba)}.`,
        difficulty: 'INTERMEDIO' as const,
        skill: this.getDefaultSkillForPrueba(prueba),
        prueba,
        metadata: {
          source: 'fallback_generator' as const,
          template: true
        }
      };
      questions.push(question);
    }

    return {
      id: `fallback-comprehensive-${prueba.toLowerCase()}-${Date.now()}`,
      title: `Diagnóstico de Demostración - ${this.getPruebaDisplayName(prueba)}`,
      description: `Evaluación de demostración para ${this.getPruebaDisplayName(prueba)}`,
      testId: this.getTestIdForPrueba(prueba),
      questions,
      isCompleted: false,
      metadata: {
        source: 'fallback',
        officialCount: 0,
        aiCount: questionCount,
        quality: 'demo'
      }
    };
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

  private getTestIdForPrueba(prueba: string): number {
    const testIds: Record<string, number> = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'HISTORIA': 4,
      'CIENCIAS': 5
    };
    return testIds[prueba] || 1;
  }

  private getDefaultSkillForPrueba(prueba: string): string {
    const skills: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'INTERPRET_RELATE',
      'MATEMATICA_1': 'SOLVE_PROBLEMS',
      'MATEMATICA_2': 'REPRESENT',
      'CIENCIAS': 'PROCESS_ANALYZE',
      'HISTORIA': 'TEMPORAL_THINKING'
    };
    return skills[prueba] || 'INTERPRET_RELATE';
  }
}

export const comprehensiveDiagnosticGenerator = ComprehensiveDiagnosticGenerator.getInstance();
