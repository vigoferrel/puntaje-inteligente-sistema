
import { supabase } from "@/integrations/supabase/client";

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
 * Servicio para gestionar preguntas oficiales de PAES conectado a Supabase
 */
export class PAESService {
  
  /**
   * Obtener información del examen PAES desde la base de datos
   */
  static async getExam(codigo: string): Promise<PAESExam | null> {
    try {
      console.log(`🔍 Obteniendo examen: ${codigo}`);
      
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
        id: data.id,
        codigo: data.codigo,
        nombre: data.nombre,
        tipo: data.tipo,
        año: data.año,
        duracion_minutos: data.duracion_minutos,
        total_preguntas: data.total_preguntas,
        preguntas_validas: data.preguntas_validas,
        instrucciones: data.instrucciones || ''
      };

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

      // Usar la función RPC para obtener el examen completo
      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });

      if (error) {
        console.error('Error en RPC obtener_examen_completo:', error);
        return null;
      }

      if (!data || !data.preguntas || data.preguntas.length === 0) {
        console.warn(`No se encontraron preguntas para ${examCode}`);
        return null;
      }

      // Filtrar preguntas por rango de número
      const preguntasEnRango = data.preguntas.filter((p: any) => 
        p.numero >= difficultyRange.min && p.numero <= difficultyRange.max
      );

      if (preguntasEnRango.length === 0) {
        console.warn(`No hay preguntas en el rango ${difficultyRange.min}-${difficultyRange.max}`);
        return null;
      }

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

      const exam = await this.getExam(examCode);
      if (!exam) {
        console.warn(`No se encontró examen ${examCode}`);
        return null;
      }

      // Contar preguntas reales en la base de datos
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('preguntas')
        .select('id')
        .eq('examen_id', exam.id);

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
        id: exam.id,
        codigo: exam.codigo,
        nombre: exam.nombre,
        tipo: exam.tipo,
        año: exam.año,
        duracion_minutos: exam.duracion_minutos,
        total_preguntas: exam.total_preguntas,
        preguntas_validas: exam.preguntas_validas,
        instrucciones: exam.instrucciones || ''
      }));

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

      if (error || !data?.preguntas) {
        console.error('Error al obtener preguntas específicas:', error);
        return [];
      }

      const preguntasEspecificas = data.preguntas
        .filter((p: any) => questionNumbers.includes(p.numero))
        .map((p: any) => ({
          id: Date.now() + p.numero,
          numero: p.numero,
          enunciado: p.enunciado,
          contexto: p.contexto,
          imagen_url: p.imagen_url,
          tipo_pregunta: 'multiple_choice',
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
}
