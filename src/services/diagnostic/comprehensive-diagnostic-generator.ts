
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticTest, DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapDifficultyToSpanish } from "@/utils/difficulty-mapper";

export class ComprehensiveDiagnosticGenerator {
  private static instance: ComprehensiveDiagnosticGenerator;

  static getInstance(): ComprehensiveDiagnosticGenerator {
    if (!ComprehensiveDiagnosticGenerator.instance) {
      ComprehensiveDiagnosticGenerator.instance = new ComprehensiveDiagnosticGenerator();
    }
    return ComprehensiveDiagnosticGenerator.instance;
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
    return {
      id: exercise.id || `q-${Date.now()}-${Math.random()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: this.parseOptions(exercise.options),
      correctAnswer: exercise.correct_answer || 'Opción A',
      explanation: exercise.explanation || '',
      difficulty: mapDifficultyToSpanish(exercise.difficulty || 'intermediate'),
      skill: this.mapSkill(exercise.skill || exercise.competencia_especifica) as TPAESHabilidad,
      prueba: exercise.prueba || 'COMPETENCIA_LECTORA',
      metadata: {
        source: exercise.metadata?.source || 'database',
        originalId: exercise.id,
        nodoCode: exercise.nodo_code
      }
    };
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

  private mapSkill(skill: any): string {
    if (typeof skill === 'string') {
      const skillMapping: Record<string, TPAESHabilidad> = {
        'localizar': 'TRACK_LOCATE',
        'interpretar': 'INTERPRET_RELATE',
        'evaluar': 'EVALUATE_REFLECT',
        'resolver': 'SOLVE_PROBLEMS',
        'representar': 'REPRESENT',
        'modelar': 'MODEL',
        'argumentar': 'ARGUE_COMMUNICATE',
        'identificar': 'IDENTIFY_THEORIES',
        'procesar': 'PROCESS_ANALYZE',
        'aplicar': 'APPLY_PRINCIPLES',
        'cientifico': 'SCIENTIFIC_ARGUMENT',
        'temporal': 'TEMPORAL_THINKING',
        'fuentes': 'SOURCE_ANALYSIS',
        'multicausal': 'MULTICAUSAL_ANALYSIS',
        'critico': 'CRITICAL_THINKING',
        'reflexion': 'REFLECTION'
      };

      const lowerSkill = skill.toLowerCase();
      for (const [key, value] of Object.entries(skillMapping)) {
        if (lowerSkill.includes(key)) {
          return value;
        }
      }
    }
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
      difficulty: mapDifficultyToSpanish(targetLevel),
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

  private getDefaultSkillForPrueba(prueba: TPAESPrueba): TPAESHabilidad {
    const skills: Record<TPAESPrueba, TPAESHabilidad> = {
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
