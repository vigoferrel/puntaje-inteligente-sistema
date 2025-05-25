
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";

// Define types explicitly to avoid recursion
type TPAESPrueba = 'COMPETENCIA_LECTORA' | 'MATEMATICA_1' | 'MATEMATICA_2' | 'CIENCIAS' | 'HISTORIA';

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
      
      const allPruebas: TPAESPrueba[] = [
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
          // Continue with other diagnostics even if one fails
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
    prueba: TPAESPrueba,
    targetLevel: 'basic' | 'intermediate' | 'advanced' = 'intermediate',
    questionCount: number = 20
  ): Promise<DiagnosticTest> {
    console.log(`🎯 Generando diagnóstico comprehensivo para ${prueba}`);

    try {
      // Fetch questions from database
      const questions = await this.fetchDatabaseQuestions(prueba, questionCount);
      
      if (questions.length === 0) {
        console.warn('⚠️ No se encontraron preguntas en BD, generando fallback');
        return this.generateFallbackDiagnostic(prueba, targetLevel, questionCount);
      }

      // Create comprehensive diagnostic
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
          totalCostSavings: questions.length * 0.15, // Estimate
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
    prueba: TPAESPrueba,
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

      return exercises.map(exercise => this.mapExerciseToQuestion(exercise));
    } catch (error) {
      console.error('❌ Error in fetchDatabaseQuestions:', error);
      return [];
    }
  }

  private mapExerciseToQuestion(exercise: any): DiagnosticQuestion {
    // Simplified mapping to avoid infinite recursion
    const question: DiagnosticQuestion = {
      id: exercise.id || `q-${Date.now()}-${Math.random()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: this.parseOptions(exercise.options),
      correctAnswer: exercise.correct_answer || 'Opción A',
      explanation: exercise.explanation || '',
      difficulty: 'INTERMEDIO' as const,
      skill: this.getSkillString(exercise.skill || exercise.competencia_especifica),
      prueba: exercise.prueba || 'COMPETENCIA_LECTORA',
      metadata: {
        source: exercise.metadata?.source || 'database',
        originalId: exercise.id,
        nodoCode: exercise.nodo_code,
        year: exercise.year
      }
    };
    return question;
  }

  private parseOptions(options: any): string[] {
    if (Array.isArray(options)) {
      return options.map(String);
    }
    if (typeof options === 'string') {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed.map(String) : ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
      } catch {
        return [options];
      }
    }
    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private getSkillString(skill: any): string {
    if (!skill) return 'INTERPRET_RELATE';
    
    const skillStr = String(skill).toLowerCase();
    
    if (skillStr.includes('localizar')) return 'TRACK_LOCATE';
    if (skillStr.includes('interpretar')) return 'INTERPRET_RELATE';
    if (skillStr.includes('evaluar')) return 'EVALUATE_REFLECT';
    if (skillStr.includes('resolver')) return 'SOLVE_PROBLEMS';
    if (skillStr.includes('representar')) return 'REPRESENT';
    if (skillStr.includes('modelar')) return 'MODEL';
    if (skillStr.includes('argumentar')) return 'ARGUE_COMMUNICATE';
    if (skillStr.includes('identificar')) return 'IDENTIFY_THEORIES';
    if (skillStr.includes('procesar')) return 'PROCESS_ANALYZE';
    if (skillStr.includes('aplicar')) return 'APPLY_PRINCIPLES';
    if (skillStr.includes('cientifico')) return 'SCIENTIFIC_ARGUMENT';
    if (skillStr.includes('temporal')) return 'TEMPORAL_THINKING';
    if (skillStr.includes('fuentes')) return 'SOURCE_ANALYSIS';
    if (skillStr.includes('multicausal')) return 'MULTICAUSAL_ANALYSIS';
    if (skillStr.includes('critico')) return 'CRITICAL_THINKING';
    if (skillStr.includes('reflexion')) return 'REFLECTION';
    
    return 'INTERPRET_RELATE';
  }

  private generateFallbackDiagnostic(
    prueba: TPAESPrueba,
    targetLevel: string,
    questionCount: number
  ): DiagnosticTest {
    const questions: DiagnosticQuestion[] = Array.from({ length: questionCount }, (_, i) => ({
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
        source: 'fallback_generator',
        template: true
      }
    }));

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

  private getPruebaDisplayName(prueba: TPAESPrueba): string {
    const names: Record<TPAESPrueba, string> = {
      'COMPETENCIA_LECTORA': 'Comprensión Lectora',
      'MATEMATICA_1': 'Matemática M1',
      'MATEMATICA_2': 'Matemática M2',
      'CIENCIAS': 'Ciencias',
      'HISTORIA': 'Historia y Geografía'
    };
    return names[prueba] || prueba;
  }

  private getTestIdForPrueba(prueba: TPAESPrueba): number {
    const testIds: Record<TPAESPrueba, number> = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'HISTORIA': 4,
      'CIENCIAS': 5
    };
    return testIds[prueba] || 1;
  }

  private getDefaultSkillForPrueba(prueba: TPAESPrueba): string {
    const skills: Record<TPAESPrueba, string> = {
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
