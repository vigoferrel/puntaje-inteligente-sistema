
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapDifficultyToSpanish } from "@/utils/difficulty-mapper";

export class ExamQuestionExtractor {
  private static instance: ExamQuestionExtractor;

  static getInstance(): ExamQuestionExtractor {
    if (!ExamQuestionExtractor.instance) {
      ExamQuestionExtractor.instance = new ExamQuestionExtractor();
    }
    return ExamQuestionExtractor.instance;
  }

  async extractOfficialQuestions(
    prueba: TPAESPrueba,
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
    return {
      id: exercise.id || `extracted-${Date.now()}-${Math.random()}`,
      question: exercise.question || exercise.enunciado || 'Pregunta no disponible',
      options: this.extractOptions(exercise),
      correctAnswer: this.extractCorrectAnswer(exercise),
      explanation: exercise.explanation || exercise.explicacion || 'Explicación no disponible',
      difficulty: mapDifficultyToSpanish('INTERMEDIO'),
      skill: this.mapSkillToEnumSafe(exercise.skill || exercise.competencia_especifica),
      prueba: exercise.prueba || 'COMPETENCIA_LECTORA',
      metadata: {
        source: 'oficial_extracted',
        originalId: exercise.id,
        year: exercise.year,
        nodoCode: exercise.nodo_code
      }
    };
  }

  private extractOptions(exercise: any): string[] {
    // Try different field names for options
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
            // If JSON parsing fails, return as single option
            return [exercise[field]];
          }
        }
      }
    }

    // Default fallback options
    return ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
  }

  private extractCorrectAnswer(exercise: any): string {
    // Try different field names for correct answer
    const answerFields = ['correct_answer', 'respuesta_correcta', 'correctAnswer'];
    
    for (const field of answerFields) {
      if (exercise[field]) {
        return String(exercise[field]);
      }
    }

    // Try to find correct answer in alternativas array
    if (exercise.alternativas && Array.isArray(exercise.alternativas)) {
      const correctOption = exercise.alternativas.find((alt: any) => alt.es_correcta || alt.isCorrect);
      if (correctOption) {
        return correctOption.contenido || correctOption.text || 'Opción A';
      }
    }

    return 'Opción A';
  }

  private mapSkillToEnumSafe(skill: any): string {
    if (!skill) return 'INTERPRET_RELATE';

    const skillString = String(skill).toLowerCase();
    
    // Simplified mapping to avoid type recursion
    if (skillString.includes('localizar') || skillString.includes('ubicar')) return 'TRACK_LOCATE';
    if (skillString.includes('interpretar') || skillString.includes('relacionar')) return 'INTERPRET_RELATE';
    if (skillString.includes('evaluar') || skillString.includes('reflexionar')) return 'EVALUATE_REFLECT';
    if (skillString.includes('resolver') || skillString.includes('solucionar')) return 'SOLVE_PROBLEMS';
    if (skillString.includes('representar')) return 'REPRESENT';
    if (skillString.includes('modelar')) return 'MODEL';
    if (skillString.includes('argumentar') || skillString.includes('comunicar')) return 'ARGUE_COMMUNICATE';
    if (skillString.includes('identificar') || skillString.includes('teorias')) return 'IDENTIFY_THEORIES';
    if (skillString.includes('procesar') || skillString.includes('analizar')) return 'PROCESS_ANALYZE';
    if (skillString.includes('aplicar') || skillString.includes('principios')) return 'APPLY_PRINCIPLES';
    if (skillString.includes('cientifico') || skillString.includes('argumento')) return 'SCIENTIFIC_ARGUMENT';
    if (skillString.includes('temporal') || skillString.includes('tiempo')) return 'TEMPORAL_THINKING';
    if (skillString.includes('fuentes')) return 'SOURCE_ANALYSIS';
    if (skillString.includes('multicausal') || skillString.includes('causas')) return 'MULTICAUSAL_ANALYSIS';
    if (skillString.includes('critico') || skillString.includes('pensamiento')) return 'CRITICAL_THINKING';
    if (skillString.includes('reflexion')) return 'REFLECTION';

    return 'INTERPRET_RELATE';
  }

  private generateFallbackQuestions(prueba: TPAESPrueba, count: number): DiagnosticQuestion[] {
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
