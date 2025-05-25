
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";

// Ultra-simplified interface to prevent type recursion
interface BasicExerciseData {
  id: string;
  question?: string;
  enunciado?: string;
  options?: unknown;
  alternativas?: unknown;
  alternatives?: unknown;
  correct_answer?: string;
  respuesta_correcta?: string;
  correctAnswer?: string;
  explanation?: string;
  explicacion?: string;
  [key: string]: unknown; // Allow any other properties
}

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
      let query = supabase
        .from('exercises')
        .select('*')
        .eq('prueba', prueba)
        .limit(limit);

      if (year) {
        query = query.eq('year', year);
      }

      const { data: exercises, error } = await query;

      if (error || !exercises) {
        console.warn('⚠️ No se encontraron preguntas oficiales:', error);
        return this.generateFallbackQuestions(prueba, limit);
      }

      // Use explicit for loop to avoid type recursion
      const mappedQuestions: DiagnosticQuestion[] = [];
      for (let i = 0; i < exercises.length; i++) {
        const rawExercise = exercises[i] as unknown;
        const basicExercise = rawExercise as BasicExerciseData;
        const mappedQuestion = this.createBasicQuestion(basicExercise);
        mappedQuestions.push(mappedQuestion);
      }

      console.log(`✅ ${mappedQuestions.length} preguntas oficiales extraídas`);
      return mappedQuestions;
    } catch (error) {
      console.error('❌ Error extrayendo preguntas oficiales:', error);
      return this.generateFallbackQuestions(prueba, limit);
    }
  }

  // Ultra-simplified mapping function with explicit types
  private createBasicQuestion(exercise: BasicExerciseData): DiagnosticQuestion {
    const question: DiagnosticQuestion = {
      id: exercise.id || `extracted-${Date.now()}-${Math.random()}`,
      question: exercise.question || exercise.enunciado || 'Pregunta no disponible',
      options: this.extractBasicOptions(exercise),
      correctAnswer: this.extractBasicCorrectAnswer(exercise),
      explanation: exercise.explanation || exercise.explicacion || 'Explicación no disponible',
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

  private extractBasicOptions(exercise: BasicExerciseData): string[] {
    const optionsFields = ['options', 'alternativas', 'alternatives'];
    
    for (const field of optionsFields) {
      const fieldValue = exercise[field];
      if (fieldValue) {
        if (Array.isArray(fieldValue)) {
          return fieldValue.map((opt: unknown) => 
            typeof opt === 'string' ? opt : String(opt)
          );
        }
        
        if (typeof fieldValue === 'string') {
          try {
            const parsed = JSON.parse(fieldValue);
            if (Array.isArray(parsed)) {
              return parsed.map((opt: unknown) => String(opt));
            }
          } catch {
            return [fieldValue];
          }
        }
      }
    }

    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private extractBasicCorrectAnswer(exercise: BasicExerciseData): string {
    const answerFields = ['correct_answer', 'respuesta_correcta', 'correctAnswer'];
    
    for (const field of answerFields) {
      const fieldValue = exercise[field];
      if (fieldValue) {
        return String(fieldValue);
      }
    }

    return 'Opción A';
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
}

export const examQuestionExtractor = ExamQuestionExtractor.getInstance();
