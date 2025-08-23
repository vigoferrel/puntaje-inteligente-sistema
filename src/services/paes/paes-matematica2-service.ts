
import { supabase } from '@/integrations/supabase/client';

export interface PAESMatematica2Exam {
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

export interface PAESMatematica2Question {
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  opciones: PAESMatematica2Option[];
}

export interface PAESMatematica2Option {
  letra: string;
  contenido: string;
  es_correcta: boolean;
}

export interface PAESMatematica2ExamComplete {
  examen: PAESMatematica2Exam;
  preguntas: PAESMatematica2Question[];
}

/**
 * Código único del examen PAES Matemática 2 consolidado
 */
const PAES_MATEMATICA2_EXAM_CODE = 'PAES_MATEMATICA2_2024_FORMA_193';

/**
 * Obtiene el examen completo de PAES Matemática 2 2024 usando la función específica
 */
export const fetchPAESMatematica2Exam = async (): Promise<PAESMatematica2ExamComplete | null> => {
  try {
    console.log('🔍 Fetching complete PAES Matemática 2 exam (55 questions)');
    
    // Usar la función específica para Matemática 2 con el código correcto
    const { data, error } = await supabase.rpc('obtener_examen_matematica2_completo', {
      codigo_examen_param: PAES_MATEMATICA2_EXAM_CODE
    });

    if (error) {
      console.error('Error fetching Matemática 2 exam via RPC:', error);
      // Fallback: usar consulta directa
      return await fetchMatematica2ExamDirect();
    }

    if (!data) {
      console.warn('No data returned from Matemática 2 RPC function');
      return await fetchMatematica2ExamDirect();
    }

    console.log('✅ PAES Matemática 2 exam loaded via RPC:', data);
    return data as unknown as PAESMatematica2ExamComplete;

  } catch (error) {
    console.error('Error in fetchPAESMatematica2Exam:', error);
    return await fetchMatematica2ExamDirect();
  }
};

/**
 * Fallback: obtiene el examen usando consultas directas
 */
const fetchMatematica2ExamDirect = async (): Promise<PAESMatematica2ExamComplete | null> => {
  try {
    console.log('🔄 Using direct query fallback for Matemática 2 exam');
    
    // Obtener examen base
    const { data: examenData, error: examenError } = await supabase
      .from('examenes')
      .select('*')
      .eq('codigo', PAES_MATEMATICA2_EXAM_CODE)
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
    const preguntas: PAESMatematica2Question[] = (preguntasData || []).map(pregunta => ({
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

    const examen: PAESMatematica2Exam = {
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

    const result: PAESMatematica2ExamComplete = {
      examen,
      preguntas
    };

    console.log(`✅ PAES Matemática 2 exam loaded via direct query: ${preguntas.length} preguntas`);
    return result;

  } catch (error) {
    console.error('Error in fetchMatematica2ExamDirect:', error);
    throw error;
  }
};

/**
 * Obtiene las respuestas correctas del examen de Matemática 2
 */
export const fetchMatematica2CorrectAnswers = async (): Promise<Record<number, string>> => {
  try {
    // Usar la función RPC para obtener respuestas correctas
    const { data, error } = await supabase.rpc('obtener_respuestas_correctas_examen_f153', {
      codigo_examen_param: PAES_MATEMATICA2_EXAM_CODE
    });

    if (error) {
      console.error('Error fetching correct answers via RPC:', error);
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
    console.error('Error in fetchMatematica2CorrectAnswers:', error);
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
      .eq('codigo', PAES_MATEMATICA2_EXAM_CODE)
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
 * Obtiene preguntas aleatorias del examen de Matemática 2 para ejercicios
 */
export const getRandomMatematica2Questions = async (count: number = 5): Promise<PAESMatematica2Question[]> => {
  try {
    const examData = await fetchPAESMatematica2Exam();
    
    if (!examData) {
      throw new Error('Matemática 2 exam not found');
    }

    // Mezclar preguntas y tomar las primeras N
    const shuffled = [...examData.preguntas].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);

  } catch (error) {
    console.error('Error getting random Matemática 2 questions:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas por eje temático específico
 */
export const getMatematica2QuestionsByEje = async (eje: 'algebra' | 'geometria' | 'probabilidad' | 'calculo'): Promise<PAESMatematica2Question[]> => {
  try {
    const examData = await fetchPAESMatematica2Exam();
    
    if (!examData) {
      throw new Error('Matemática 2 exam not found');
    }

    // Mapear ejes temáticos a rangos de preguntas
    let filteredQuestions: PAESMatematica2Question[] = [];
    
    switch (eje) {
      case 'algebra':
        // Álgebra y funciones (preguntas 1-20)
        filteredQuestions = examData.preguntas.filter(p => p.numero >= 1 && p.numero <= 20);
        break;
      case 'geometria':
        // Geometría (preguntas 21-35)
        filteredQuestions = examData.preguntas.filter(p => p.numero >= 21 && p.numero <= 35);
        break;
      case 'probabilidad':
        // Probabilidad y estadística (preguntas 36-45)
        filteredQuestions = examData.preguntas.filter(p => p.numero >= 36 && p.numero <= 45);
        break;
      case 'calculo':
        // Cálculo y límites (preguntas 46-55)
        filteredQuestions = examData.preguntas.filter(p => p.numero >= 46 && p.numero <= 55);
        break;
    }

    return filteredQuestions;

  } catch (error) {
    console.error('Error getting Matemática 2 questions by eje:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del examen de Matemática 2
 */
export const getMatematica2ExamStats = async () => {
  try {
    const examData = await fetchPAESMatematica2Exam();
    
    if (!examData) {
      throw new Error('Matemática 2 exam not found');
    }

    const algebra = examData.preguntas.filter(p => p.numero >= 1 && p.numero <= 20);
    const geometria = examData.preguntas.filter(p => p.numero >= 21 && p.numero <= 35);
    const probabilidad = examData.preguntas.filter(p => p.numero >= 36 && p.numero <= 45);
    const calculo = examData.preguntas.filter(p => p.numero >= 46 && p.numero <= 55);

    return {
      total: examData.preguntas.length,
      algebra: algebra.length,
      geometria: geometria.length,
      probabilidad: probabilidad.length,
      calculo: calculo.length,
      duracionMinutos: examData.examen.duracion_minutos,
      año: examData.examen.año,
      preguntasValidas: examData.examen.preguntas_validas,
      preguntasExcluidas: examData.examen.total_preguntas - examData.examen.preguntas_validas
    };
  } catch (error) {
    console.error('Error in getMatematica2ExamStats:', error);
    throw error;
  }
};

/**
 * Valida la integridad del examen PAES Matemática 2
 */
export const validateMatematica2ExamIntegrity = async (): Promise<{
  isValid: boolean;
  issues: string[];
  stats: any;
}> => {
  try {
    const examData = await fetchPAESMatematica2Exam();
    const issues: string[] = [];
    
    if (!examData) {
      return {
        isValid: false,
        issues: ['Examen no encontrado'],
        stats: null
      };
    }

    // Validar que tengamos las preguntas esperadas
    const expectedCount = 55;
    if (examData.preguntas.length < expectedCount) {
      issues.push(`Se esperaban ${expectedCount} preguntas, se encontraron ${examData.preguntas.length}`);
    }

    // Validar numeración secuencial
    const numeros = examData.preguntas.map(p => p.numero).sort((a, b) => a - b);
    const expectedNumbers = Array.from({length: examData.preguntas.length}, (_, i) => i + 1);
    
    expectedNumbers.forEach(expectedNum => {
      if (!numeros.includes(expectedNum)) {
        issues.push(`Falta la pregunta número ${expectedNum}`);
      }
    });

    // Validar opciones por pregunta
    examData.preguntas.forEach(pregunta => {
      // Verificar que tenga opciones
      if (!pregunta.opciones || pregunta.opciones.length === 0) {
        issues.push(`Pregunta ${pregunta.numero} no tiene opciones`);
        return;
      }

      // Matemática 2 tiene mayormente preguntas de 4 opciones, algunas de 5
      const expectedOptions = [4, 5];
      if (!expectedOptions.includes(pregunta.opciones.length)) {
        issues.push(`Pregunta ${pregunta.numero} debe tener 4 o 5 opciones, tiene ${pregunta.opciones.length}`);
      }

      // Validar que cada pregunta tenga exactamente una respuesta correcta
      const correctas = pregunta.opciones.filter(o => o.es_correcta);
      if (correctas.length !== 1) {
        issues.push(`Pregunta ${pregunta.numero} tiene ${correctas.length} respuestas correctas, debe tener 1`);
      }
    });

    const stats = await getMatematica2ExamStats();

    return {
      isValid: issues.length === 0,
      issues,
      stats
    };

  } catch (error) {
    console.error('Error validating Matemática 2 exam integrity:', error);
    return {
      isValid: false,
      issues: [`Error durante validación: ${error}`],
      stats: null
    };
  }
};

/**
 * Obtiene el código del examen PAES Matemática 2 actual
 */
export const getPAESMatematica2ExamCode = (): string => {
  return PAES_MATEMATICA2_EXAM_CODE;
};
