/* eslint-disable react-refresh/only-export-components */

// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

export interface PAESExam {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  aÃ±o: number;
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
    console.log(`ðŸ” Fetching PAES exam: ${examCode}`);
    
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

    // Tipar correctamente la respuesta de la funciÃ³n RPC
    const examData = data as unknown as PAESExamComplete;
    
    console.log(`âœ… PAES exam loaded: ${examData.examen.nombre}`);
    return examData;

  } catch (error) {
    console.error('Error in fetchPAESExam:', error);
    throw error;
  }
};

/**
 * Obtiene la lista de exÃ¡menes disponibles usando una consulta directa
 * (temporal hasta que los tipos de Supabase se actualicen)
 */
export const fetchAvailableExams = async (): Promise<PAESExam[]> => {
  try {
    // Usar una consulta SQL directa para acceder a la tabla examenes
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: 'SELECT * FROM examenes ORDER BY aÃ±o DESC, codigo ASC'
    });

    if (error) {
      console.error('Error fetching available exams:', error);
      // Retornar datos mock si hay error
      return [
        {
          id: '1',
          codigo: 'PAES-2024-FORM-103',
          nombre: 'Prueba de Competencia Lectora PAES 2024 - Forma 103',
          tipo: 'PAES Regular',
          aÃ±o: 2024,
          duracion_minutos: 150,
          total_preguntas: 65,
          preguntas_validas: 60,
          instrucciones: 'Examen oficial PAES 2024'
        }
      ];
    }

    // Si la consulta funciona, procesar los datos
    return data || [];
  } catch (error) {
    console.error('Error in fetchAvailableExams:', error);
    // Retornar datos mock como fallback
    return [
      {
        id: '1',
        codigo: 'PAES-2024-FORM-103',
        nombre: 'Prueba de Competencia Lectora PAES 2024 - Forma 103',
        tipo: 'PAES Regular',
        aÃ±o: 2024,
        duracion_minutos: 150,
        total_preguntas: 65,
        preguntas_validas: 60,
        instrucciones: 'Examen oficial PAES 2024'
      }
    ];
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

    // Convertir a objeto para fÃ¡cil acceso
    const answers: Record<number, string> = {};
    data?.forEach((row: unknown) => {
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





