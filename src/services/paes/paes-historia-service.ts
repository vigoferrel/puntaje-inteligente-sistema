
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
 * Obtiene el examen completo de PAES Historia 2024 usando la función específica de historia
 */
export const fetchPAESHistoriaExam = async (): Promise<PAESHistoriaExamComplete | null> => {
  try {
    console.log('🔍 Fetching PAES Historia exam using historia-specific function');
    
    // Usar la función específica para historia
    const { data, error } = await supabase.rpc('obtener_examen_historia_completo', {
      codigo_examen_param: 'HISTORIA_2024_FORMA_123'
    });

    if (error) {
      console.error('Error fetching Historia exam via RPC:', error);
      // Fallback: usar consulta directa
      return await fetchHistoriaExamDirect();
    }

    if (!data) {
      console.warn('No data returned from Historia RPC function');
      return await fetchHistoriaExamDirect();
    }

    console.log('✅ PAES Historia exam loaded via RPC:', data);
    return data as PAESHistoriaExamComplete;

  } catch (error) {
    console.error('Error in fetchPAESHistoriaExam:', error);
    // Fallback: usar consulta directa
    return await fetchHistoriaExamDirect();
  }
};

/**
 * Fallback: obtiene el examen usando consultas directas
 */
const fetchHistoriaExamDirect = async (): Promise<PAESHistoriaExamComplete | null> => {
  try {
    console.log('🔄 Using direct query fallback for Historia exam');
    
    // Obtener examen base
    const { data: examenData, error: examenError } = await supabase
      .from('examenes')
      .select('*')
      .or('nombre.ilike.%historia%,nombre.ilike.%ciencias sociales%')
      .eq('año', 2024)
      .single();

    if (examenError || !examenData) {
      console.error('Error fetching exam:', examenError);
      return null;
    }

    console.log('📖 Found exam:', examenData.nombre, 'ID:', examenData.id);

    // Obtener preguntas con opciones usando join manual
    const { data: preguntasData, error: preguntasError } = await supabase
      .from('preguntas')
      .select('*')
      .eq('examen_id', examenData.id)
      .order('numero');

    if (preguntasError) {
      console.error('Error fetching questions:', preguntasError);
      throw preguntasError;
    }

    console.log(`📝 Found ${preguntasData?.length || 0} questions`);

    // Obtener todas las opciones para estas preguntas
    const preguntaIds = preguntasData?.map(p => p.id) || [];
    const { data: opcionesData, error: opcionesError } = await supabase
      .from('opciones_respuesta')
      .select('*')
      .in('pregunta_id', preguntaIds)
      .order('letra');

    if (opcionesError) {
      console.error('Error fetching options:', opcionesError);
      throw opcionesError;
    }

    console.log(`📋 Found ${opcionesData?.length || 0} options`);

    // Agrupar opciones por pregunta
    const opcionesByPregunta: Record<string, any[]> = {};
    opcionesData?.forEach(opcion => {
      if (!opcionesByPregunta[opcion.pregunta_id]) {
        opcionesByPregunta[opcion.pregunta_id] = [];
      }
      opcionesByPregunta[opcion.pregunta_id].push(opcion);
    });

    // Transformar datos al formato esperado
    const preguntas: PAESHistoriaQuestion[] = (preguntasData || []).map(pregunta => ({
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto || undefined,
      imagen_url: pregunta.imagen_url || undefined,
      opciones: (opcionesByPregunta[pregunta.id] || []).map(opcion => ({
        letra: opcion.letra,
        contenido: opcion.contenido,
        es_correcta: opcion.es_correcta
      }))
    }));

    const examen: PAESHistoriaExam = {
      id: examenData.id.toString(),
      codigo: examenData.codigo,
      nombre: examenData.nombre,
      tipo: examenData.tipo,
      año: examenData.año,
      duracion_minutos: examenData.duracion_minutos,
      total_preguntas: examenData.total_preguntas,
      preguntas_validas: preguntas.length,
      instrucciones: examenData.instrucciones || undefined
    };

    const result: PAESHistoriaExamComplete = {
      examen,
      preguntas
    };

    console.log(`✅ PAES Historia exam loaded via direct query: ${preguntas.length} preguntas`);
    return result;

  } catch (error) {
    console.error('Error in fetchHistoriaExamDirect:', error);
    throw error;
  }
};

/**
 * Obtiene las respuestas correctas del examen de Historia
 */
export const fetchHistoriaCorrectAnswers = async (): Promise<Record<number, string>> => {
  try {
    // Usar la función RPC para obtener respuestas correctas
    const { data, error } = await supabase.rpc('obtener_respuestas_correctas_examen_f153', {
      codigo_examen_param: 'HISTORIA_2024_FORMA_123'
    });

    if (error) {
      console.error('Error fetching correct answers via RPC:', error);
      // Fallback: consulta directa
      return await fetchCorrectAnswersDirect();
    }

    // Convertir a objeto para fácil acceso
    const answers: Record<number, string> = {};
    data?.forEach((row: any) => {
      answers[row.numero_pregunta] = row.respuesta_correcta;
    });

    console.log(`📊 Found ${Object.keys(answers).length} correct answers`);
    return answers;

  } catch (error) {
    console.error('Error in fetchHistoriaCorrectAnswers:', error);
    return await fetchCorrectAnswersDirect();
  }
};

/**
 * Fallback para obtener respuestas correctas
 */
const fetchCorrectAnswersDirect = async (): Promise<Record<number, string>> => {
  try {
    const { data: examenData } = await supabase
      .from('examenes')
      .select('id')
      .or('nombre.ilike.%historia%,nombre.ilike.%ciencias sociales%')
      .eq('año', 2024)
      .single();

    if (!examenData) {
      throw new Error('Examen no encontrado');
    }

    const { data: respuestasData, error } = await supabase
      .from('preguntas')
      .select(`
        numero,
        opciones_respuesta!inner (
          letra
        )
      `)
      .eq('examen_id', examenData.id)
      .eq('opciones_respuesta.es_correcta', true);

    if (error) {
      console.error('Error fetching correct answers direct:', error);
      throw error;
    }

    // Convertir a objeto para fácil acceso
    const answers: Record<number, string> = {};
    respuestasData?.forEach((row: any) => {
      if (row.opciones_respuesta && row.opciones_respuesta.length > 0) {
        answers[row.numero] = row.opciones_respuesta[0].letra;
      }
    });

    return answers;
  } catch (error) {
    console.error('Error in fetchCorrectAnswersDirect:', error);
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
