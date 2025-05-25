
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";

// Simplified interface to avoid type recursion
interface SimpleExerciseData {
  id: string;
  question?: string;
  enunciado?: string;
  options?: any;
  alternativas?: any;
  alternatives?: any;
  correct_answer?: string;
  respuesta_correcta?: string;
  correctAnswer?: string;
  explanation?: string;
  explicacion?: string;
  skill?: any;
  competencia_especifica?: any;
  prueba?: string;
  nodo_code?: string;
  year?: number;
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

      // Use explicit for loop instead of map to avoid type recursion
      const mappedQuestions: DiagnosticQuestion[] = [];
      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i] as SimpleExerciseData;
        const mappedQuestion = this.createSimpleQuestion(exercise);
        mappedQuestions.push(mappedQuestion);
      }

      console.log(`✅ ${mappedQuestions.length} preguntas oficiales extraídas`);
      return mappedQuestions;
    } catch (error) {
      console.error('❌ Error extrayendo preguntas oficiales:', error);
      return this.generateFallbackQuestions(prueba, limit);
    }
  }

  // Isolated mapping function with explicit types
  private createSimpleQuestion(exercise: SimpleExerciseData): DiagnosticQuestion {
    const question: DiagnosticQuestion = {
      id: exercise.id || `extracted-${Date.now()}-${Math.random()}`,
      question: exercise.question || exercise.enunciado || 'Pregunta no disponible',
      options: this.extractOptions(exercise),
      correctAnswer: this.extractCorrectAnswer(exercise),
      explanation: exercise.explanation || exercise.explicacion || 'Explicación no disponible',
      difficulty: 'INTERMEDIO' as const,
      skill: this.getSkillString(exercise.skill || exercise.competencia_especifica),
      prueba: exercise.prueba || 'COMPETENCIA_LECTORA',
      metadata: {
        source: 'oficial_extracted' as const,
        originalId: exercise.id,
        nodoCode: exercise.nodo_code,
        year: exercise.year
      }
    };
    return question;
  }

  private extractOptions(exercise: SimpleExerciseData): string[] {
    const optionsFields = ['options', 'alternativas', 'alternatives'];
    
    for (const field of optionsFields) {
      const fieldValue = (exercise as any)[field];
      if (fieldValue) {
        if (Array.isArray(fieldValue)) {
          return fieldValue.map((opt: any) => 
            typeof opt === 'string' ? opt : opt.contenido || opt.text || String(opt)
          );
        }
        
        if (typeof fieldValue === 'string') {
          try {
            const parsed = JSON.parse(fieldValue);
            if (Array.isArray(parsed)) {
              return parsed.map((opt: any) => 
                typeof opt === 'string' ? opt : opt.contenido || opt.text || String(opt)
              );
            }
          } catch {
            return [fieldValue];
          }
        }
      }
    }

    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private extractCorrectAnswer(exercise: SimpleExerciseData): string {
    const answerFields = ['correct_answer', 'respuesta_correcta', 'correctAnswer'];
    
    for (const field of answerFields) {
      const fieldValue = (exercise as any)[field];
      if (fieldValue) {
        return String(fieldValue);
      }
    }

    if (exercise.alternativas && Array.isArray(exercise.alternativas)) {
      const correctOption = exercise.alternativas.find((alt: any) => alt.es_correcta || alt.isCorrect);
      if (correctOption) {
        return correctOption.contenido || correctOption.text || 'Opción A';
      }
    }

    return 'Opción A';
  }

  private getSkillString(skill: any): string {
    if (!skill) return 'INTERPRET_RELATE';

    const skillString = String(skill).toLowerCase();
    
    if (skillString.includes('localizar')) return 'TRACK_LOCATE';
    if (skillString.includes('interpretar')) return 'INTERPRET_RELATE';
    if (skillString.includes('evaluar')) return 'EVALUATE_REFLECT';
    if (skillString.includes('resolver')) return 'SOLVE_PROBLEMS';
    if (skillString.includes('representar')) return 'REPRESENT';
    if (skillString.includes('modelar')) return 'MODEL';
    if (skillString.includes('argumentar')) return 'ARGUE_COMMUNICATE';

    return 'INTERPRET_RELATE';
  }

  private generateFallbackQuestions(prueba: string, count: number): DiagnosticQuestion[] {
    // Use explicit for loop instead of Array.from().map()
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
