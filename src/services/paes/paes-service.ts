
import { supabase } from "@/integrations/supabase/client";

// Interfaces para las respuestas de las funciones RPC
interface ExamenCompleto {
  examen: {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    año: number;
    duracion_minutos: number;
    total_preguntas: number;
    preguntas_validas: number;
    instrucciones: string;
  };
  preguntas: Array<{
    numero: number;
    enunciado: string;
    contexto?: string;
    imagen_url?: string;
    opciones: Array<{
      letra: string;
      contenido: string;
      es_correcta: boolean;
    }>;
  }>;
}

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
  id: string; // Cambiado de number a string para coincidir con Supabase
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
 * Cache para evitar consultas repetitivas
 */
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 300000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

/**
 * Servicio para gestionar preguntas oficiales de PAES conectado a Supabase
 */
export class PAESService {
  
  /**
   * Obtener información del examen PAES desde la base de datos
   */
  static async getExam(codigo: string): Promise<PAESExam | null> {
    try {
      console.log(`🔍 Obteniendo examen: ${codigo}`);
      
      const cacheKey = `exam_${codigo}`;
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Usando datos cacheados para examen');
        return cached;
      }

      const { data, error } = await supabase
        .from('examenes')
        .select('*')
        .eq('codigo', codigo)
        .single();

      if (error) {
        console.error('Error al obtener examen:', error);
        return null;
      }

      if (!data) {
        console.warn(`No se encontró examen con código: ${codigo}`);
        return null;
      }

      const exam: PAESExam = {
        id: data.id, // Ya es string en Supabase
        codigo: data.codigo,
        nombre: data.nombre,
        tipo: data.tipo,
        año: data.año,
        duracion_minutos: data.duracion_minutos,
        total_preguntas: data.total_preguntas,
        preguntas_validas: data.preguntas_validas,
        instrucciones: data.instrucciones || ''
      };

      setCachedData(cacheKey, exam);
      console.log(`✅ Examen obtenido: ${exam.nombre}`);
      return exam;

    } catch (error) {
      console.error('Error en getExam:', error);
      return null;
    }
  }

  /**
   * Obtener pregunta aleatoria por rango de dificultad usando RPC
   */
  static async getRandomQuestion(
    examCode: string = 'PAES-2024-FORM-103',
    difficultyRange: { min: number; max: number } = { min: 1, max: 35 }
  ): Promise<PAESQuestion | null> {
    try {
      console.log(`🎯 Obteniendo pregunta aleatoria de ${examCode} (${difficultyRange.min}-${difficultyRange.max})`);

      const cacheKey = `questions_${examCode}_${difficultyRange.min}_${difficultyRange.max}`;
      const cached = getCachedData(cacheKey);
      
      if (cached && cached.length > 0) {
        const randomQuestion = cached[Math.floor(Math.random() * cached.length)];
        console.log('📦 Usando pregunta cacheada');
        return randomQuestion;
      }

      // Usar la función RPC para obtener el examen completo
      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });

      if (error) {
        console.error('Error en RPC obtener_examen_completo:', error);
        return null;
      }

      if (!data) {
        console.warn(`No se encontraron datos para ${examCode}`);
        return null;
      }

      // Convertir la respuesta a tipo conocido
      const examData = data as ExamenCompleto;
      
      if (!examData.preguntas || examData.preguntas.length === 0) {
        console.warn(`No se encontraron preguntas para ${examCode}`);
        return null;
      }

      // Filtrar preguntas por rango de número
      const preguntasEnRango = examData.preguntas.filter(p => 
        p.numero >= difficultyRange.min && p.numero <= difficultyRange.max
      );

      if (preguntasEnRango.length === 0) {
        console.warn(`No hay preguntas en el rango ${difficultyRange.min}-${difficultyRange.max}`);
        return null;
      }

      // Cache las preguntas filtradas
      setCachedData(cacheKey, preguntasEnRango, 600000); // 10 minutos

      // Seleccionar pregunta aleatoria
      const preguntaSeleccionada = preguntasEnRango[Math.floor(Math.random() * preguntasEnRango.length)];

      const question: PAESQuestion = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        numero: preguntaSeleccionada.numero,
        enunciado: preguntaSeleccionada.enunciado,
        contexto: preguntaSeleccionada.contexto,
        imagen_url: preguntaSeleccionada.imagen_url,
        tipo_pregunta: 'multiple_choice',
        opciones: preguntaSeleccionada.opciones || []
      };

      console.log(`✅ Pregunta obtenida: #${question.numero}`);
      return question;

    } catch (error) {
      console.error('Error en getRandomQuestion:', error);
      return null;
    }
  }

  /**
   * Obtener preguntas por nivel de dificultad conceptual
   */
  static async getQuestionsByDifficulty(
    examCode: string = 'PAES-2024-FORM-103',
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO'
  ): Promise<PAESQuestion | null> {
    // Mapear dificultades a rangos de preguntas basado en patrones reales PAES
    const difficultyRanges = {
      'BASICO': { min: 1, max: 20 },      // Preguntas iniciales más básicas
      'INTERMEDIO': { min: 21, max: 45 }, // Preguntas intermedias
      'AVANZADO': { min: 46, max: 65 }    // Preguntas finales más complejas
    };

    const range = difficultyRanges[difficulty];
    return this.getRandomQuestion(examCode, range);
  }

  /**
   * Obtener estadísticas del examen desde la base de datos
   */
  static async getExamStats(examCode: string = 'PAES-2024-FORM-103') {
    try {
      console.log(`📊 Obteniendo estadísticas para ${examCode}`);

      const cacheKey = `stats_${examCode}`;
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Usando estadísticas cacheadas');
        return cached;
      }

      const exam = await this.getExam(examCode);
      if (!exam) {
        console.warn(`No se encontró examen ${examCode}`);
        return null;
      }

      // Contar preguntas reales en la base de datos usando el id como string
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('preguntas')
        .select('id')
        .eq('examen_id', exam.id); // exam.id ya es string

      if (preguntasError) {
        console.error('Error al contar preguntas:', preguntasError);
      }

      const questionsLoaded = preguntasData?.length || 0;
      const loadingProgress = exam.total_preguntas > 0 
        ? Math.round((questionsLoaded / exam.total_preguntas) * 100)
        : 0;

      const stats = {
        exam,
        questionsLoaded,
        totalQuestions: exam.total_preguntas,
        validQuestions: exam.preguntas_validas,
        loadingProgress
      };

      setCachedData(cacheKey, stats, 900000); // 15 minutos
      console.log(`✅ Estadísticas obtenidas: ${questionsLoaded}/${exam.total_preguntas} preguntas`);
      return stats;

    } catch (error) {
      console.error('Error en getExamStats:', error);
      return null;
    }
  }

  /**
   * Obtener lista de exámenes disponibles
   */
  static async getAvailableExams(): Promise<PAESExam[]> {
    try {
      console.log('📚 Obteniendo exámenes disponibles');

      const cacheKey = 'available_exams';
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Usando lista cacheada de exámenes');
        return cached;
      }

      const { data, error } = await supabase
        .from('examenes')
        .select('*')
        .order('año', { ascending: false })
        .order('codigo', { ascending: true });

      if (error) {
        console.error('Error al obtener exámenes:', error);
        return [];
      }

      const exams: PAESExam[] = (data || []).map(exam => ({
        id: exam.id, // Ya es string en Supabase
        codigo: exam.codigo,
        nombre: exam.nombre,
        tipo: exam.tipo,
        año: exam.año,
        duracion_minutos: exam.duracion_minutos,
        total_preguntas: exam.total_preguntas,
        preguntas_validas: exam.preguntas_validas,
        instrucciones: exam.instrucciones || ''
      }));

      setCachedData(cacheKey, exams, 1800000); // 30 minutos
      console.log(`✅ ${exams.length} exámenes disponibles`);
      return exams;

    } catch (error) {
      console.error('Error en getAvailableExams:', error);
      return [];
    }
  }

  /**
   * Obtener preguntas específicas por números
   */
  static async getQuestionsByNumbers(
    examCode: string,
    questionNumbers: number[]
  ): Promise<PAESQuestion[]> {
    try {
      console.log(`🔢 Obteniendo preguntas específicas: ${questionNumbers.join(', ')}`);

      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });

      if (error || !data) {
        console.error('Error al obtener preguntas específicas:', error);
        return [];
      }

      // Convertir la respuesta a tipo conocido
      const examData = data as ExamenCompleto;
      
      if (!examData.preguntas) {
        console.warn('No se encontraron preguntas en la respuesta');
        return [];
      }

      const preguntasEspecificas = examData.preguntas
        .filter(p => questionNumbers.includes(p.numero))
        .map(p => ({
          id: Date.now() + p.numero,
          numero: p.numero,
          enunciado: p.enunciado,
          contexto: p.contexto,
          imagen_url: p.imagen_url,
          tipo_pregunta: 'multiple_choice' as const,
          opciones: p.opciones || []
        }));

      console.log(`✅ ${preguntasEspecificas.length} preguntas específicas obtenidas`);
      return preguntasEspecificas;

    } catch (error) {
      console.error('Error en getQuestionsByNumbers:', error);
      return [];
    }
  }

  /**
   * Validar que un examen existe y tiene preguntas
   */
  static async validateExam(examCode: string): Promise<boolean> {
    try {
      const exam = await this.getExam(examCode);
      return exam !== null && exam.total_preguntas > 0;
    } catch (error) {
      console.error('Error validando examen:', error);
      return false;
    }
  }

  /**
   * Limpiar cache (útil para desarrollo)
   */
  static clearCache(): void {
    cache.clear();
    console.log('🗑️ Cache limpiado');
  }
}
