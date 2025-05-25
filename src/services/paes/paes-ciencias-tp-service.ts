
import { supabase } from '@/integrations/supabase/client';

export interface PAESCienciasTPExam {
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

export interface PAESCienciasTPQuestion {
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  es_piloto: boolean;
  modulo: 'COMUN' | 'TECNICO_PROFESIONAL';
  area_cientifica: 'BIOLOGIA' | 'FISICA' | 'QUIMICA' | 'METODOLOGIA';
  opciones: PAESCienciasTPOption[];
}

export interface PAESCienciasTPOption {
  letra: string;
  contenido: string;
  es_correcta: boolean;
}

export interface PAESCienciasTPExamComplete {
  examen: PAESCienciasTPExam;
  preguntas: PAESCienciasTPQuestion[];
}

/**
 * Código único del examen PAES Ciencias TP 2024
 */
const PAES_CIENCIAS_TP_EXAM_CODE = 'PAES_CIENCIAS_TP_2024_FORMA_183';

/**
 * Obtiene el examen completo de PAES Ciencias TP 2024
 */
export const fetchPAESCienciasTPExam = async (): Promise<PAESCienciasTPExamComplete | null> => {
  try {
    console.log('🔍 Fetching complete PAES Ciencias TP exam (80 questions)');
    
    const { data, error } = await supabase.rpc('obtener_examen_ciencias_completo', {
      codigo_examen_param: PAES_CIENCIAS_TP_EXAM_CODE
    });

    if (error) {
      console.error('Error fetching Ciencias TP exam via RPC:', error);
      return await fetchCienciasTPExamDirect();
    }

    if (!data) {
      console.warn('No data returned from Ciencias TP RPC function');
      return await fetchCienciasTPExamDirect();
    }

    console.log('✅ PAES Ciencias TP exam loaded via RPC:', data);
    return data as unknown as PAESCienciasTPExamComplete;

  } catch (error) {
    console.error('Error in fetchPAESCienciasTPExam:', error);
    return await fetchCienciasTPExamDirect();
  }
};

/**
 * Fallback: obtiene el examen usando consultas directas
 */
const fetchCienciasTPExamDirect = async (): Promise<PAESCienciasTPExamComplete | null> => {
  try {
    console.log('🔄 Using direct query fallback for Ciencias TP exam');
    
    const { data: examenData, error: examenError } = await supabase
      .from('examenes')
      .select('*')
      .eq('codigo', PAES_CIENCIAS_TP_EXAM_CODE)
      .single();

    if (examenError || !examenData) {
      console.error('Error fetching exam:', examenError);
      return null;
    }

    const { data: preguntasData, error: preguntasError } = await supabase
      .from('preguntas')
      .select(`
        *,
        preguntas_metadata(excluida_de_puntaje)
      `)
      .eq('examen_id', examenData.id)
      .order('numero');

    if (preguntasError) {
      console.error('Error fetching questions:', preguntasError);
      throw preguntasError;
    }

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

    const opcionesByPregunta: Record<string, any[]> = {};
    opcionesData?.forEach(opcion => {
      if (!opcionesByPregunta[opcion.pregunta_id]) {
        opcionesByPregunta[opcion.pregunta_id] = [];
      }
      opcionesByPregunta[opcion.pregunta_id].push(opcion);
    });

    const preguntas: PAESCienciasTPQuestion[] = (preguntasData || []).map(pregunta => ({
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto || undefined,
      imagen_url: pregunta.imagen_url || undefined,
      es_piloto: pregunta.preguntas_metadata?.[0]?.excluida_de_puntaje || false,
      modulo: pregunta.numero <= 54 ? 'COMUN' : 'TECNICO_PROFESIONAL',
      area_cientifica: pregunta.numero >= 1 && pregunta.numero <= 28 ? 'BIOLOGIA' :
                      pregunta.numero >= 29 && pregunta.numero <= 54 ? 'FISICA' :
                      pregunta.numero >= 55 && pregunta.numero <= 80 ? 'QUIMICA' : 'METODOLOGIA',
      opciones: (opcionesByPregunta[pregunta.id] || []).map(opcion => ({
        letra: opcion.letra,
        contenido: opcion.contenido,
        es_correcta: opcion.es_correcta
      }))
    }));

    const examen: PAESCienciasTPExam = {
      id: examenData.id.toString(),
      codigo: examenData.codigo,
      nombre: examenData.nombre,
      tipo: examenData.tipo,
      año: examenData.año,
      duracion_minutos: examenData.duracion_minutos,
      total_preguntas: examenData.total_preguntas,
      preguntas_validas: preguntas.filter(p => !p.es_piloto).length,
      instrucciones: examenData.instrucciones || undefined
    };

    return { examen, preguntas };

  } catch (error) {
    console.error('Error in fetchCienciasTPExamDirect:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas por área científica específica
 */
export const getCienciasTPQuestionsByArea = async (
  area: 'BIOLOGIA' | 'FISICA' | 'QUIMICA'
): Promise<PAESCienciasTPQuestion[]> => {
  try {
    const examData = await fetchPAESCienciasTPExam();
    
    if (!examData) {
      throw new Error('Ciencias TP exam not found');
    }

    return examData.preguntas.filter(p => p.area_cientifica === area);

  } catch (error) {
    console.error('Error getting Ciencias TP questions by area:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas por módulo específico
 */
export const getCienciasTPQuestionsByModulo = async (
  modulo: 'COMUN' | 'TECNICO_PROFESIONAL'
): Promise<PAESCienciasTPQuestion[]> => {
  try {
    const examData = await fetchPAESCienciasTPExam();
    
    if (!examData) {
      throw new Error('Ciencias TP exam not found');
    }

    return examData.preguntas.filter(p => p.modulo === modulo);

  } catch (error) {
    console.error('Error getting Ciencias TP questions by modulo:', error);
    throw error;
  }
};

/**
 * Obtiene preguntas aleatorias del examen
 */
export const getRandomCienciasTPQuestions = async (count: number = 10): Promise<PAESCienciasTPQuestion[]> => {
  try {
    const examData = await fetchPAESCienciasTPExam();
    
    if (!examData) {
      throw new Error('Ciencias TP exam not found');
    }

    const validQuestions = examData.preguntas.filter(p => !p.es_piloto);
    const shuffled = [...validQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);

  } catch (error) {
    console.error('Error getting random Ciencias TP questions:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas del examen de Ciencias TP
 */
export const getCienciasTPExamStats = async () => {
  try {
    const examData = await fetchPAESCienciasTPExam();
    
    if (!examData) {
      throw new Error('Ciencias TP exam not found');
    }

    const biologia = examData.preguntas.filter(p => p.area_cientifica === 'BIOLOGIA');
    const fisica = examData.preguntas.filter(p => p.area_cientifica === 'FISICA');
    const quimica = examData.preguntas.filter(p => p.area_cientifica === 'QUIMICA');
    const moduloComun = examData.preguntas.filter(p => p.modulo === 'COMUN');
    const moduloTP = examData.preguntas.filter(p => p.modulo === 'TECNICO_PROFESIONAL');
    const preguntasValidas = examData.preguntas.filter(p => !p.es_piloto);

    return {
      total: examData.preguntas.length,
      biologia: biologia.length,
      fisica: fisica.length,
      quimica: quimica.length,
      moduloComun: moduloComun.length,
      moduloTecnicoProfesional: moduloTP.length,
      preguntasValidas: preguntasValidas.length,
      preguntasPiloto: examData.preguntas.filter(p => p.es_piloto).length,
      duracionMinutos: examData.examen.duracion_minutos,
      año: examData.examen.año
    };
  } catch (error) {
    console.error('Error in getCienciasTPExamStats:', error);
    throw error;
  }
};

/**
 * Valida la integridad del examen PAES Ciencias TP
 */
export const validateCienciasTPExamIntegrity = async (): Promise<{
  isValid: boolean;
  issues: string[];
  stats: any;
}> => {
  try {
    const examData = await fetchPAESCienciasTPExam();
    const issues: string[] = [];
    
    if (!examData) {
      return {
        isValid: false,
        issues: ['Examen no encontrado'],
        stats: null
      };
    }

    const expectedCount = 80;
    if (examData.preguntas.length < expectedCount) {
      issues.push(`Se esperaban ${expectedCount} preguntas, se encontraron ${examData.preguntas.length}`);
    }

    // Validar distribución por áreas
    const biologia = examData.preguntas.filter(p => p.area_cientifica === 'BIOLOGIA');
    const fisica = examData.preguntas.filter(p => p.area_cientifica === 'FISICA');
    const quimica = examData.preguntas.filter(p => p.area_cientifica === 'QUIMICA');

    if (biologia.length !== 28) {
      issues.push(`Se esperaban 28 preguntas de Biología, se encontraron ${biologia.length}`);
    }
    if (fisica.length !== 26) {
      issues.push(`Se esperaban 26 preguntas de Física, se encontraron ${fisica.length}`);
    }
    if (quimica.length !== 26) {
      issues.push(`Se esperaban 26 preguntas de Química, se encontraron ${quimica.length}`);
    }

    // Validar opciones por pregunta
    examData.preguntas.forEach(pregunta => {
      if (!pregunta.opciones || pregunta.opciones.length === 0) {
        issues.push(`Pregunta ${pregunta.numero} no tiene opciones`);
        return;
      }

      if (![4, 5].includes(pregunta.opciones.length)) {
        issues.push(`Pregunta ${pregunta.numero} debe tener 4 o 5 opciones, tiene ${pregunta.opciones.length}`);
      }

      const correctas = pregunta.opciones.filter(o => o.es_correcta);
      if (correctas.length !== 1) {
        issues.push(`Pregunta ${pregunta.numero} tiene ${correctas.length} respuestas correctas, debe tener 1`);
      }
    });

    const stats = await getCienciasTPExamStats();

    return {
      isValid: issues.length === 0,
      issues,
      stats
    };

  } catch (error) {
    console.error('Error validating Ciencias TP exam integrity:', error);
    return {
      isValid: false,
      issues: [`Error durante validación: ${error}`],
      stats: null
    };
  }
};

/**
 * Obtiene el código del examen PAES Ciencias TP actual
 */
export const getPAESCienciasTPExamCode = (): string => {
  return PAES_CIENCIAS_TP_EXAM_CODE;
};
