
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TypeFirewall, RawDatabaseRecord, FirewallExercise } from "../types/firewall-types";

export class ExamQuestionExtractor {
  private static instance: ExamQuestionExtractor;

  static getInstance(): ExamQuestionExtractor {
    if (!ExamQuestionExtractor.instance) {
      ExamQuestionExtractor.instance = new ExamQuestionExtractor();
    }
    return ExamQuestionExtractor.instance;
  }

  async extractOfficialQuestions(
    prueba: string,
    year?: number,
    limit: number = 50
  ): Promise<DiagnosticQuestion[]> {
    console.log(`📚 Extrayendo preguntas oficiales para ${prueba}`);

    try {
      // FIREWALL: Query específico para evitar recursión de tipos
      let query = supabase
        .from('exercises')
        .select('id,question,options,correct_answer,explanation,skill_id,test_id,diagnostic_id,node_id,difficulty,bloom_level,created_at,updated_at')
        .eq('test_id', this.getTestIdForPrueba(prueba))
        .limit(limit);

      if (year) {
        // No agregamos filtro de año ya que no existe en la tabla exercises
        console.log(`Año ${year} solicitado pero no disponible en exercises`);
      }

      const { data: exercises, error } = await query;

      if (error || !exercises) {
        console.warn('⚠️ No se encontraron preguntas oficiales:', error);
        return this.generateFallbackQuestions(prueba, limit);
      }

      // FIREWALL: Procesar como datos raw sin tipos complejos
      const rawRecords = exercises as RawDatabaseRecord[];
      const firewallExercises = TypeFirewall.processRawExerciseArray(rawRecords);

      // Mapear usando firewall anti-recursión
      const mappedQuestions: DiagnosticQuestion[] = [];
      for (let i = 0; i < firewallExercises.length; i++) {
        const exercise = firewallExercises[i];
        const mappedQuestion = this.createFirewallQuestion(exercise);
        mappedQuestions.push(mappedQuestion);
      }

      console.log(`✅ ${mappedQuestions.length} preguntas oficiales extraídas`);
      return mappedQuestions;
    } catch (error) {
      console.error('❌ Error extrayendo preguntas oficiales:', error);
      return this.generateFallbackQuestions(prueba, limit);
    }
  }

  // FIREWALL: Mapping seguro de ejercicio a pregunta
  private createFirewallQuestion(exercise: FirewallExercise): DiagnosticQuestion {
    const question: DiagnosticQuestion = {
      id: exercise.id || `extracted-${Date.now()}-${Math.random()}`,
      question: exercise.question || 'Pregunta no disponible',
      options: TypeFirewall.safeStringArray(exercise.options),
      correctAnswer: exercise.correct_answer || 'Opción A',
      explanation: exercise.explanation || 'Explicación no disponible',
      difficulty: 'INTERMEDIO' as const,
      skill: 'INTERPRET_RELATE',
      prueba: 'COMPETENCIA_LECTORA',
      metadata: {
        source: 'oficial_extracted' as const,
        originalId: exercise.id
      }
    };
    return question;
  }

  private generateFallbackQuestions(prueba: string, count: number): DiagnosticQuestion[] {
    const questions: DiagnosticQuestion[] = [];
    for (let i = 0; i < count; i++) {
      const question: DiagnosticQuestion = {
        id: `fallback-extracted-${prueba}-${i + 1}`,
        question: `Pregunta extraída ${i + 1} para ${prueba}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A',
        explanation: 'Pregunta de demostración extraída del sistema.',
        difficulty: 'INTERMEDIO' as const,
        skill: 'INTERPRET_RELATE',
        prueba,
        metadata: {
          source: 'fallback_extractor' as const,
          template: true
        }
      };
      questions.push(question);
    }
    return questions;
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
}

export const examQuestionExtractor = ExamQuestionExtractor.getInstance();
