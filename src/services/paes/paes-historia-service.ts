
import { supabase } from '@/integrations/supabase/client';

export interface PAESHistoriaExam {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  año: number;
  duracion_minutos: number;
  total_preguntas: number;
  preguntas_validas: number;
  instrucciones?: string;
}

export interface PAESHistoriaQuestion {
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  opciones: PAESHistoriaOption[];
}

export interface PAESHistoriaOption {
  letra: string;
  contenido: string;
  es_correcta: boolean;
}

export interface PAESHistoriaExamComplete {
  examen: PAESHistoriaExam;
  preguntas: PAESHistoriaQuestion[];
}

/**
 * Obtiene el examen completo de PAES Historia 2024 con todas sus preguntas y opciones
 */
export const fetchPAESHistoriaExam = async (): Promise<PAESHistoriaExamComplete | null> => {
  try {
    console.log('🔍 Fetching PAES Historia exam: PAES_HISTORIA_2024_FORMA_123');
    
    const { data, error } = await supabase.rpc('obtener_examen_historia_completo', {
      codigo_examen_param: 'PAES_HISTORIA_2024_FORMA_123'
    });

    if (error) {
      console.error('Error fetching PAES Historia exam:', error);
      throw error;
    }

    if (!data) {
      console.warn('No exam found with code: PAES_HISTORIA_2024_FORMA_123');
      return null;
    }

    console.log('✅ PAES Historia exam loaded:', data.examen?.nombre);
    return data as PAESHistoriaExamComplete;

  } catch (error) {
    console.error('Error in fetchPAESHistoriaExam:', error);
    throw error;
  }
};

/**
 * Obtiene las respuestas correctas del examen de Historia
 */
export const fetchHistoriaCorrectAnswers = async (): Promise<Record<number, string>> => {
  try {
    const { data, error } = await supabase.rpc('obtener_respuestas_correctas_examen_f153', {
      codigo_examen_param: 'PAES_HISTORIA_2024_FORMA_123'
    });

    if (error) {
      console.error('Error fetching correct answers:', error);
      throw error;
    }

    // Convertir a objeto para fácil acceso
    const answers: Record<number, string> = {};
    data?.forEach((row: any) => {
      answers[row.numero_pregunta] = row.respuesta_correcta;
    });

    return answers;
  } catch (error) {
    console.error('Error in fetchHistoriaCorrectAnswers:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas aleatorias del examen de Historia para ejercicios
 */
export const getRandomHistoriaQuestions = async (count: number = 5): Promise<PAESHistoriaQuestion[]> => {
  try {
    const examData = await fetchPAESHistoriaExam();
    
    if (!examData) {
      throw new Error('Historia exam not found');
    }

    // Mezclar preguntas y tomar las primeras N
    const shuffled = [...examData.preguntas].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);

  } catch (error) {
    console.error('Error getting random Historia questions:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas por sección específica
 */
export const getHistoriaQuestionsBySection = async (startQuestion: number, endQuestion: number): Promise<PAESHistoriaQuestion[]> => {
  try {
    const examData = await fetchPAESHistoriaExam();
    
    if (!examData) {
      throw new Error('Historia exam not found');
    }

    // Filtrar preguntas por rango
    return examData.preguntas.filter(
      pregunta => pregunta.numero >= startQuestion && pregunta.numero <= endQuestion
    );

  } catch (error) {
    console.error('Error getting Historia questions by section:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del examen de Historia
 */
export const getHistoriaExamStats = async () => {
  try {
    const { data, error } = await supabase.rpc('obtener_estadisticas_respuestas_examen', {
      codigo_examen: 'PAES_HISTORIA_2024_FORMA_123'
    });

    if (error) {
      console.error('Error fetching Historia exam stats:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getHistoriaExamStats:', error);
    throw error;
  }
};
