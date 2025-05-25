
import { supabase } from '@/integrations/supabase/client';

export interface PAESExam {
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

export interface PAESQuestion {
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  opciones: PAESOption[];
}

export interface PAESOption {
  letra: string;
  contenido: string;
  es_correcta: boolean;
}

export interface PAESExamComplete {
  examen: PAESExam;
  preguntas: PAESQuestion[];
}

/**
 * Obtiene un examen completo con todas sus preguntas y opciones
 */
export const fetchPAESExam = async (examCode: string): Promise<PAESExamComplete | null> => {
  try {
    console.log(`🔍 Fetching PAES exam: ${examCode}`);
    
    const { data, error } = await supabase.rpc('obtener_examen_completo', {
      codigo_examen: examCode
    });

    if (error) {
      console.error('Error fetching PAES exam:', error);
      throw error;
    }

    if (!data) {
      console.warn(`No exam found with code: ${examCode}`);
      return null;
    }

    console.log(`✅ PAES exam loaded: ${data.examen.nombre}`);
    return data as PAESExamComplete;

  } catch (error) {
    console.error('Error in fetchPAESExam:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de exámenes disponibles
 */
export const fetchAvailableExams = async (): Promise<PAESExam[]> => {
  try {
    const { data, error } = await supabase
      .from('examenes')
      .select('*')
      .order('año', { ascending: false });

    if (error) {
      console.error('Error fetching available exams:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchAvailableExams:', error);
    throw error;
  }
};

/**
 * Obtiene las respuestas correctas de un examen
 */
export const fetchCorrectAnswers = async (examCode: string): Promise<Record<number, string>> => {
  try {
    const { data, error } = await supabase.rpc('obtener_respuestas_correctas_examen', {
      codigo_examen: examCode
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
    console.error('Error in fetchCorrectAnswers:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas aleatorias del pool oficial para ejercicios
 */
export const getRandomQuestionsFromPool = async (
  examCode: string, 
  count: number = 5
): Promise<PAESQuestion[]> => {
  try {
    const examData = await fetchPAESExam(examCode);
    
    if (!examData) {
      throw new Error(`Exam not found: ${examCode}`);
    }

    // Mezclar preguntas y tomar las primeras N
    const shuffled = [...examData.preguntas].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);

  } catch (error) {
    console.error('Error getting random questions:', error);
    throw error;
  }
};
