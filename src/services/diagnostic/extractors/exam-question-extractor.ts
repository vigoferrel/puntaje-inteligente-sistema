
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";

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

      const questions = exercises.map(exercise => this.mapExerciseToQuestion(exercise));
      console.log(`✅ ${questions.length} preguntas oficiales extraídas`);

      return questions;
    } catch (error) {
      console.error('❌ Error extrayendo preguntas oficiales:', error);
      return this.generateFallbackQuestions(prueba, limit);
    }
  }

  private mapExerciseToQuestion(exercise: any): DiagnosticQuestion {
    // Simplified mapping to avoid infinite recursion
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
        source: 'oficial_extracted',
        originalId: exercise.id,
        nodoCode: exercise.nodo_code,
        year: exercise.year
      }
    };
    return question;
  }

  private extractOptions(exercise: any): string[] {
    const optionsFields = ['options', 'alternativas', 'alternatives'];
    
    for (const field of optionsFields) {
      if (exercise[field]) {
        if (Array.isArray(exercise[field])) {
          return exercise[field].map((opt: any) => 
            typeof opt === 'string' ? opt : opt.contenido || opt.text || String(opt)
          );
        }
        
        if (typeof exercise[field] === 'string') {
          try {
            const parsed = JSON.parse(exercise[field]);
            if (Array.isArray(parsed)) {
              return parsed.map((opt: any) => 
                typeof opt === 'string' ? opt : opt.contenido || opt.text || String(opt)
              );
            }
          } catch {
            return [exercise[field]];
          }
        }
      }
    }

    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private extractCorrectAnswer(exercise: any): string {
    const answerFields = ['correct_answer', 'respuesta_correcta', 'correctAnswer'];
    
    for (const field of answerFields) {
      if (exercise[field]) {
        return String(exercise[field]);
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
    return Array.from({ length: count }, (_, i) => ({
      id: `fallback-extracted-${prueba}-${i + 1}`,
      question: `Pregunta extraída ${i + 1} para ${prueba}`,
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      correctAnswer: 'Opción A',
      explanation: 'Pregunta de demostración extraída del sistema.',
      difficulty: 'INTERMEDIO' as const,
      skill: 'INTERPRET_RELATE',
      prueba,
      metadata: {
        source: 'fallback_extractor',
        template: true
      }
    }));
  }
}

export const examQuestionExtractor = ExamQuestionExtractor.getInstance();
