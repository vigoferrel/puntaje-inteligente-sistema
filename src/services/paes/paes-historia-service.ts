
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
 * Obtiene el examen completo de PAES Historia 2024 usando la estructura de tablas actual
 */
export const fetchPAESHistoriaExam = async (): Promise<PAESHistoriaExamComplete | null> => {
  try {
    console.log('🔍 Fetching PAES Historia exam from current database structure');
    
    // Obtener examen base
    const { data: examenData, error: examenError } = await supabase
      .from('examenes')
      .select('*')
      .eq('nombre', 'PAES Historia y Ciencias Sociales')
      .eq('año', 2024)
      .single();

    if (examenError || !examenData) {
      console.warn('No se encontró el examen PAES Historia 2024');
      return null;
    }

    // Obtener preguntas con opciones
    const { data: preguntasData, error: preguntasError } = await supabase
      .from('preguntas')
      .select(`
        numero,
        enunciado,
        contexto_adicional,
        opciones (
          letra,
          texto,
          es_correcta
        )
      `)
      .eq('examen_id', examenData.id)
      .order('numero');

    if (preguntasError) {
      console.error('Error fetching questions:', preguntasError);
      throw preguntasError;
    }

    // Transformar datos al formato esperado
    const preguntas: PAESHistoriaQuestion[] = (preguntasData || []).map(pregunta => ({
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto_adicional,
      imagen_url: undefined,
      opciones: (pregunta.opciones || []).map(opcion => ({
        letra: opcion.letra,
        contenido: opcion.texto,
        es_correcta: opcion.es_correcta
      }))
    }));

    const examen: PAESHistoriaExam = {
      id: examenData.id.toString(),
      codigo: `${examenData.nombre}_${examenData.año}_FORMA_${examenData.forma}`,
      nombre: examenData.nombre,
      tipo: examenData.tipo,
      año: examenData.año,
      duracion_minutos: examenData.duracion_minutos,
      total_preguntas: examenData.total_preguntas,
      preguntas_validas: preguntas.length,
      instrucciones: undefined
    };

    const result: PAESHistoriaExamComplete = {
      examen,
      preguntas
    };

    console.log(`✅ PAES Historia exam loaded: ${preguntas.length} preguntas`);
    return result;

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
    const { data: examenData } = await supabase
      .from('examenes')
      .select('id')
      .eq('nombre', 'PAES Historia y Ciencias Sociales')
      .eq('año', 2024)
      .single();

    if (!examenData) {
      throw new Error('Examen no encontrado');
    }

    const { data: respuestasData, error } = await supabase
      .from('preguntas')
      .select(`
        numero,
        opciones!inner (
          letra
        )
      `)
      .eq('examen_id', examenData.id)
      .eq('opciones.es_correcta', true);

    if (error) {
      console.error('Error fetching correct answers:', error);
      throw error;
    }

    // Convertir a objeto para fácil acceso
    const answers: Record<number, string> = {};
    respuestasData?.forEach((row: any) => {
      if (row.opciones && row.opciones.length > 0) {
        answers[row.numero] = row.opciones[0].letra;
      }
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
    const examData = await fetchPAESHistoriaExam();
    
    if (!examData) {
      throw new Error('Historia exam not found');
    }

    const formacionCiudadana = examData.preguntas.filter(p => p.numero >= 1 && p.numero <= 12);
    const historia = examData.preguntas.filter(p => p.numero >= 13 && p.numero <= 57);
    const sistemaEconomico = examData.preguntas.filter(p => p.numero >= 58 && p.numero <= 65);

    return {
      total: examData.preguntas.length,
      formacionCiudadana: formacionCiudadana.length,
      historia: historia.length,
      sistemaEconomico: sistemaEconomico.length,
      duracionMinutos: examData.examen.duracion_minutos,
      año: examData.examen.año
    };
  } catch (error) {
    console.error('Error in getHistoriaExamStats:', error);
    throw error;
  }
};
