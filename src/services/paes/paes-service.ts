
import { supabase } from '@/integrations/supabase/client';

export interface PAESQuestion {
  id: number;
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  tipo_pregunta: string;
  opciones: {
    letra: string;
    contenido: string;
    es_correcta: boolean;
  }[];
}

export interface PAESExam {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  año: number;
  duracion_minutos: number;
  total_preguntas: number;
  preguntas_validas: number;
  instrucciones: string;
}

/**
 * Servicio para gestionar preguntas oficiales de PAES
 */
export class PAESService {
  /**
   * Obtener información del examen PAES
   */
  static async getExam(codigo: string): Promise<PAESExam | null> {
    try {
      const { data, error } = await supabase
        .from('examenes')
        .select('*')
        .eq('codigo', codigo)
        .single();

      if (error) {
        console.error('Error obteniendo examen:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error en getExam:', error);
      return null;
    }
  }

  /**
   * Obtener una pregunta aleatoria de PAES por rango de dificultad
   */
  static async getRandomQuestion(
    examCode: string = 'FORMA_113_2024',
    difficultyRange: { min: number; max: number } = { min: 1, max: 35 }
  ): Promise<PAESQuestion | null> {
    try {
      console.log(`🎯 Obteniendo pregunta PAES aleatoria (${difficultyRange.min}-${difficultyRange.max})`);

      // Primero obtener el examen
      const exam = await this.getExam(examCode);
      if (!exam) {
        console.error('Examen no encontrado:', examCode);
        return null;
      }

      // Obtener pregunta aleatoria en el rango especificado
      const { data: questions, error } = await supabase
        .from('preguntas')
        .select(`
          id,
          numero,
          enunciado,
          contexto,
          imagen_url,
          tipo_pregunta,
          opciones_respuesta (
            letra,
            contenido,
            es_correcta
          )
        `)
        .eq('examen_id', exam.id)
        .gte('numero', difficultyRange.min)
        .lte('numero', difficultyRange.max);

      if (error) {
        console.error('Error obteniendo preguntas:', error);
        return null;
      }

      if (!questions || questions.length === 0) {
        console.warn('No hay preguntas disponibles en el rango especificado');
        return null;
      }

      // Seleccionar pregunta aleatoria
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      // Formatear la respuesta
      const formattedQuestion: PAESQuestion = {
        id: randomQuestion.id,
        numero: randomQuestion.numero,
        enunciado: randomQuestion.enunciado,
        contexto: randomQuestion.contexto,
        imagen_url: randomQuestion.imagen_url,
        tipo_pregunta: randomQuestion.tipo_pregunta,
        opciones: (randomQuestion.opciones_respuesta as any[]).map(option => ({
          letra: option.letra,
          contenido: option.contenido,
          es_correcta: option.es_correcta
        }))
      };

      console.log(`✅ Pregunta PAES obtenida: #${formattedQuestion.numero}`);
      return formattedQuestion;

    } catch (error) {
      console.error('Error en getRandomQuestion:', error);
      return null;
    }
  }

  /**
   * Obtener preguntas por nivel de dificultad conceptual
   */
  static async getQuestionsByDifficulty(
    examCode: string = 'FORMA_113_2024',
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO'
  ): Promise<PAESQuestion | null> {
    // Mapear dificultades a rangos de preguntas
    const difficultyRanges = {
      'BASICO': { min: 1, max: 15 },      // Preguntas más básicas
      'INTERMEDIO': { min: 16, max: 25 }, // Preguntas intermedias
      'AVANZADO': { min: 26, max: 35 }    // Preguntas más complejas
    };

    const range = difficultyRanges[difficulty];
    return this.getRandomQuestion(examCode, range);
  }

  /**
   * Obtener estadísticas del examen
   */
  static async getExamStats(examCode: string = 'FORMA_113_2024') {
    try {
      const exam = await this.getExam(examCode);
      if (!exam) return null;

      const { data: questionCount, error } = await supabase
        .from('preguntas')
        .select('numero', { count: 'exact' })
        .eq('examen_id', exam.id);

      if (error) {
        console.error('Error obteniendo estadísticas:', error);
        return null;
      }

      return {
        exam,
        questionsLoaded: questionCount?.length || 0,
        totalQuestions: exam.total_preguntas,
        validQuestions: exam.preguntas_validas,
        loadingProgress: ((questionCount?.length || 0) / exam.total_preguntas) * 100
      };
    } catch (error) {
      console.error('Error en getExamStats:', error);
      return null;
    }
  }
}
