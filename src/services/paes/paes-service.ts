
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
 * Servicio para gestionar preguntas oficiales de PAES (versión simplificada)
 */
export class PAESService {
  /**
   * Mock exam data since we don't have the examenes table
   */
  private static mockExam: PAESExam = {
    id: 1,
    codigo: 'FORMA_113_2024',
    nombre: 'PAES Matemática Forma 113',
    tipo: 'MATEMATICA_1',
    año: 2024,
    duracion_minutos: 120,
    total_preguntas: 65,
    preguntas_validas: 65,
    instrucciones: 'Instrucciones de la prueba PAES'
  };

  /**
   * Obtener información del examen PAES (versión mock)
   */
  static async getExam(codigo: string): Promise<PAESExam | null> {
    try {
      console.log(`Getting exam for code: ${codigo}`);
      // Return mock exam for now
      return this.mockExam;
    } catch (error) {
      console.error('Error en getExam:', error);
      return null;
    }
  }

  /**
   * Generar pregunta mock de PAES por rango de dificultad
   */
  static async getRandomQuestion(
    examCode: string = 'FORMA_113_2024',
    difficultyRange: { min: number; max: number } = { min: 1, max: 35 }
  ): Promise<PAESQuestion | null> {
    try {
      console.log(`🎯 Generando pregunta PAES mock (${difficultyRange.min}-${difficultyRange.max})`);

      // Generate a mock question
      const questionNumber = Math.floor(Math.random() * (difficultyRange.max - difficultyRange.min + 1)) + difficultyRange.min;
      
      const mockQuestion: PAESQuestion = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        numero: questionNumber,
        enunciado: `¿Cuál de las siguientes expresiones algebraicas representa correctamente la función lineal mostrada en el gráfico? (Pregunta ${questionNumber})`,
        contexto: 'Considera la función lineal f(x) = mx + b, donde m es la pendiente y b es el intercepto en y.',
        tipo_pregunta: 'multiple_choice',
        opciones: [
          { letra: 'A', contenido: 'f(x) = 2x + 3', es_correcta: true },
          { letra: 'B', contenido: 'f(x) = 3x + 2', es_correcta: false },
          { letra: 'C', contenido: 'f(x) = -2x + 3', es_correcta: false },
          { letra: 'D', contenido: 'f(x) = 2x - 3', es_correcta: false },
          { letra: 'E', contenido: 'f(x) = x + 5', es_correcta: false }
        ]
      };

      console.log(`✅ Pregunta PAES mock generada: #${mockQuestion.numero}`);
      return mockQuestion;

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
   * Obtener estadísticas del examen (versión mock)
   */
  static async getExamStats(examCode: string = 'FORMA_113_2024') {
    try {
      const exam = await this.getExam(examCode);
      if (!exam) return null;

      return {
        exam,
        questionsLoaded: exam.total_preguntas,
        totalQuestions: exam.total_preguntas,
        validQuestions: exam.preguntas_validas,
        loadingProgress: 100
      };
    } catch (error) {
      console.error('Error en getExamStats:', error);
      return null;
    }
  }
}
