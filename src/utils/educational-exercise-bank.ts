
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

/**
 * Banco de ejercicios educativos pre-validados por habilidad y prueba
 */
export class EducationalExerciseBank {
  private static exerciseTemplates: Record<TPAESPrueba, Record<TPAESHabilidad, Exercise[]>> = {
    'COMPETENCIA_LECTORA': {
      'TRACK_LOCATE': [
        {
          question: "¿En qué párrafo del texto se menciona específicamente el año de fundación de la ciudad?",
          options: [
            "En el primer párrafo",
            "En el segundo párrafo", 
            "En el tercer párrafo",
            "No se menciona en el texto"
          ],
          correctAnswer: "En el segundo párrafo",
          explanation: "La información específica sobre fechas suele ubicarse en párrafos descriptivos o informativos.",
          skill: "TRACK_LOCATE",
          prueba: "COMPETENCIA_LECTORA",
          difficulty: "BASIC",
          text: "La habilidad de localizar información explícita requiere identificar datos específicos en el texto."
        }
      ],
      'INTERPRET_RELATE': [
        {
          question: "¿Cuál es la idea principal que el autor desarrolla a lo largo del texto?",
          options: [
            "La importancia de la educación en la sociedad moderna",
            "Los desafíos tecnológicos del siglo XXI",
            "La evolución histórica de las comunicaciones",
            "Las ventajas y desventajas de las redes sociales"
          ],
          correctAnswer: "La importancia de la educación en la sociedad moderna",
          explanation: "La idea principal se identifica analizando los argumentos centrales que el autor desarrolla consistentemente.",
          skill: "INTERPRET_RELATE",
          prueba: "COMPETENCIA_LECTORA",
          difficulty: "INTERMEDIATE",
          text: "Esta habilidad requiere comprender el mensaje central y las relaciones entre ideas."
        }
      ],
      'EVALUATE_REFLECT': [
        {
          question: "¿Qué opinas sobre la validez del argumento principal presentado por el autor?",
          options: [
            "Es completamente válido y está bien fundamentado",
            "Tiene fundamentos parciales pero carece de evidencia suficiente",
            "Es débil y no presenta argumentos convincentes",
            "No es posible evaluarlo con la información disponible"
          ],
          correctAnswer: "Tiene fundamentos parciales pero carece de evidencia suficiente",
          explanation: "La evaluación crítica requiere analizar la calidad de los argumentos y la evidencia presentada.",
          skill: "EVALUATE_REFLECT",
          prueba: "COMPETENCIA_LECTORA",
          difficulty: "ADVANCED",
          text: "Esta habilidad implica reflexionar críticamente sobre el contenido y formar juicios fundamentados."
        }
      ],
      'SOLVE_PROBLEMS': [],
      'REPRESENT': [],
      'MODEL': [],
      'ARGUE_COMMUNICATE': [],
      'IDENTIFY_THEORIES': [],
      'PROCESS_ANALYZE': [],
      'APPLY_PRINCIPLES': [],
      'SCIENTIFIC_ARGUMENT': [],
      'TEMPORAL_THINKING': [],
      'SOURCE_ANALYSIS': [],
      'MULTICAUSAL_ANALYSIS': [],
      'CRITICAL_THINKING': [],
      'REFLECTION': []
    },
    'MATEMATICA_1': {
      'SOLVE_PROBLEMS': [
        {
          question: "Si un rectángulo tiene un perímetro de 24 cm y su largo es el doble de su ancho, ¿cuál es el área del rectángulo?",
          options: [
            "32 cm²",
            "48 cm²", 
            "24 cm²",
            "16 cm²"
          ],
          correctAnswer: "32 cm²",
          explanation: "Si el ancho es x, entonces el largo es 2x. El perímetro es 2(x + 2x) = 6x = 24, por lo que x = 4. El área es 4 × 8 = 32 cm².",
          skill: "SOLVE_PROBLEMS",
          prueba: "MATEMATICA_1",
          difficulty: "INTERMEDIATE",
          text: "Este problema requiere plantear ecuaciones y resolver sistemáticamente."
        }
      ],
      'REPRESENT': [
        {
          question: "¿Cuál de las siguientes expresiones representa correctamente 'el triple de un número disminuido en 5'?",
          options: [
            "3x - 5",
            "3(x - 5)",
            "3 + x - 5", 
            "x³ - 5"
          ],
          correctAnswer: "3x - 5",
          explanation: "El triple de un número es 3x, y disminuido en 5 significa restar 5, resultando en 3x - 5.",
          skill: "REPRESENT",
          prueba: "MATEMATICA_1",
          difficulty: "BASIC",
          text: "La representación algebraica traduce lenguaje natural a expresiones matemáticas."
        }
      ],
      'TRACK_LOCATE': [],
      'INTERPRET_RELATE': [],
      'EVALUATE_REFLECT': [],
      'MODEL': [],
      'ARGUE_COMMUNICATE': [],
      'IDENTIFY_THEORIES': [],
      'PROCESS_ANALYZE': [],
      'APPLY_PRINCIPLES': [],
      'SCIENTIFIC_ARGUMENT': [],
      'TEMPORAL_THINKING': [],
      'SOURCE_ANALYSIS': [],
      'MULTICAUSAL_ANALYSIS': [],
      'CRITICAL_THINKING': [],
      'REFLECTION': []
    },
    'MATEMATICA_2': {
      'MODEL': [
        {
          question: "Una función cuadrática tiene vértice en (2, -3) y pasa por el punto (0, 1). ¿Cuál es su ecuación?",
          options: [
            "f(x) = x² - 4x + 1",
            "f(x) = x² + 4x - 3",
            "f(x) = (x - 2)² - 3",
            "f(x) = x² - 4x - 3"
          ],
          correctAnswer: "f(x) = x² - 4x + 1",
          explanation: "Usando la forma vértice f(x) = a(x-h)² + k con vértice (2,-3) y el punto (0,1) para encontrar a=1.",
          skill: "MODEL",
          prueba: "MATEMATICA_2",
          difficulty: "ADVANCED",
          text: "El modelamiento requiere traducir situaciones a expresiones matemáticas."
        }
      ],
      'ARGUE_COMMUNICATE': [
        {
          question: "¿Cuál es la justificación correcta para afirmar que la función f(x) = 2x + 3 es creciente?",
          options: [
            "Porque su pendiente es positiva",
            "Porque pasa por el origen",
            "Porque es una función lineal",
            "Porque su gráfica es una recta"
          ],
          correctAnswer: "Porque su pendiente es positiva",
          explanation: "Una función lineal es creciente cuando su pendiente (coeficiente de x) es positiva.",
          skill: "ARGUE_COMMUNICATE",
          prueba: "MATEMATICA_2", 
          difficulty: "INTERMEDIATE",
          text: "La argumentación matemática requiere justificar afirmaciones con fundamentos teóricos."
        }
      ],
      'TRACK_LOCATE': [],
      'INTERPRET_RELATE': [],
      'EVALUATE_REFLECT': [],
      'SOLVE_PROBLEMS': [],
      'REPRESENT': [],
      'IDENTIFY_THEORIES': [],
      'PROCESS_ANALYZE': [],
      'APPLY_PRINCIPLES': [],
      'SCIENTIFIC_ARGUMENT': [],
      'TEMPORAL_THINKING': [],
      'SOURCE_ANALYSIS': [],
      'MULTICAUSAL_ANALYSIS': [],
      'CRITICAL_THINKING': [],
      'REFLECTION': []
    },
    'CIENCIAS': {
      'IDENTIFY_THEORIES': [
        {
          question: "¿Cuál de las siguientes opciones describe mejor la teoría de la evolución por selección natural?",
          options: [
            "Los organismos evolucionan según su voluntad de cambiar",
            "Los organismos mejor adaptados al ambiente tienen mayor probabilidad de sobrevivir y reproducirse",
            "Todos los organismos evolucionan al mismo ritmo",
            "La evolución ocurre solo en condiciones extremas"
          ],
          correctAnswer: "Los organismos mejor adaptados al ambiente tienen mayor probabilidad de sobrevivir y reproducirse",
          explanation: "La selección natural favorece a los individuos con características que les proporcionan ventajas adaptativas.",
          skill: "IDENTIFY_THEORIES",
          prueba: "CIENCIAS",
          difficulty: "INTERMEDIATE",
          text: "Esta habilidad requiere reconocer y comprender teorías científicas fundamentales."
        }
      ],
      'PROCESS_ANALYZE': [
        {
          question: "En un experimento, se observa que al aumentar la temperatura, la velocidad de reacción química se duplica. ¿Qué conclusión es más apropiada?",
          options: [
            "La temperatura no afecta las reacciones químicas",
            "Existe una relación directa entre temperatura y velocidad de reacción",
            "La velocidad de reacción es independiente de factores externos", 
            "El experimento debe repetirse para obtener datos válidos"
          ],
          correctAnswer: "Existe una relación directa entre temperatura y velocidad de reacción",
          explanation: "Los datos muestran una correlación positiva entre temperatura y velocidad de reacción.",
          skill: "PROCESS_ANALYZE",
          prueba: "CIENCIAS",
          difficulty: "INTERMEDIATE",
          text: "El análisis de datos científicos requiere interpretar patrones y relaciones."
        }
      ],
      'TRACK_LOCATE': [],
      'INTERPRET_RELATE': [],
      'EVALUATE_REFLECT': [],
      'SOLVE_PROBLEMS': [],
      'REPRESENT': [],
      'MODEL': [],
      'ARGUE_COMMUNICATE': [],
      'APPLY_PRINCIPLES': [],
      'SCIENTIFIC_ARGUMENT': [],
      'TEMPORAL_THINKING': [],
      'SOURCE_ANALYSIS': [],
      'MULTICAUSAL_ANALYSIS': [],
      'CRITICAL_THINKING': [],
      'REFLECTION': []
    },
    'HISTORIA': {
      'TEMPORAL_THINKING': [
        {
          question: "¿Cuál de los siguientes eventos históricos ocurrió primero en Chile?",
          options: [
            "La independencia de Chile (1818)",
            "La llegada de los españoles (1541)",
            "La formación de la Primera Junta de Gobierno (1810)",
            "La Guerra del Pacífico (1879-1884)"
          ],
          correctAnswer: "La llegada de los españoles (1541)",
          explanation: "La secuencia cronológica es: llegada española (1541), Primera Junta (1810), independencia (1818), Guerra del Pacífico (1879-1884).",
          skill: "TEMPORAL_THINKING",
          prueba: "HISTORIA",
          difficulty: "BASIC",
          text: "El pensamiento temporal requiere ordenar eventos en secuencia cronológica."
        }
      ],
      'SOURCE_ANALYSIS': [
        {
          question: "Al analizar un documento histórico del siglo XIX, ¿qué aspecto es más importante considerar para evaluar su confiabilidad?",
          options: [
            "La fecha de creación del documento",
            "El contexto histórico y la perspectiva del autor",
            "La cantidad de páginas que tiene",
            "El idioma en que está escrito"
          ],
          correctAnswer: "El contexto histórico y la perspectiva del autor",
          explanation: "La confiabilidad de una fuente depende del contexto en que fue creada y los posibles sesgos del autor.",
          skill: "SOURCE_ANALYSIS",
          prueba: "HISTORIA",
          difficulty: "ADVANCED",
          text: "El análisis de fuentes requiere evaluar críticamente la procedencia y confiabilidad de la información."
        }
      ],
      'TRACK_LOCATE': [],
      'INTERPRET_RELATE': [],
      'EVALUATE_REFLECT': [],
      'SOLVE_PROBLEMS': [],
      'REPRESENT': [],
      'MODEL': [],
      'ARGUE_COMMUNICATE': [],
      'IDENTIFY_THEORIES': [],
      'PROCESS_ANALYZE': [],
      'APPLY_PRINCIPLES': [],
      'SCIENTIFIC_ARGUMENT': [],
      'MULTICAUSAL_ANALYSIS': [],
      'CRITICAL_THINKING': [],
      'REFLECTION': []
    }
  };

  /**
   * Obtiene un ejercicio de respaldo educativo apropiado
   */
  static getFallbackExercise(
    skill: TPAESHabilidad, 
    prueba: TPAESPrueba, 
    difficulty: string = 'INTERMEDIATE'
  ): Exercise | null {
    try {
      const pruebaExercises = this.exerciseTemplates[prueba];
      if (!pruebaExercises) return null;

      const skillExercises = pruebaExercises[skill];
      if (!skillExercises || skillExercises.length === 0) {
        return this.generateGenericFallback(skill, prueba, difficulty);
      }

      // Seleccionar ejercicio aleatorio de la habilidad
      const randomIndex = Math.floor(Math.random() * skillExercises.length);
      const baseExercise = skillExercises[randomIndex];

      // Crear una copia para evitar mutaciones
      return {
        ...baseExercise,
        id: `fallback-${skill}-${Date.now()}`,
        difficulty: difficulty
      };
    } catch (error) {
      console.error('Error obteniendo ejercicio de respaldo:', error);
      return this.generateGenericFallback(skill, prueba, difficulty);
    }
  }

  /**
   * Genera un ejercicio genérico cuando no hay uno específico disponible
   */
  private static generateGenericFallback(
    skill: TPAESHabilidad,
    prueba: TPAESPrueba, 
    difficulty: string
  ): Exercise {
    const skillDescriptions: Record<TPAESHabilidad, string> = {
      'TRACK_LOCATE': 'localizar información específica en textos',
      'INTERPRET_RELATE': 'interpretar y relacionar ideas en textos',
      'EVALUATE_REFLECT': 'evaluar y reflexionar sobre contenidos',
      'SOLVE_PROBLEMS': 'resolver problemas matemáticos',
      'REPRESENT': 'representar información matemáticamente',
      'MODEL': 'modelar situaciones con matemáticas',
      'ARGUE_COMMUNICATE': 'argumentar y comunicar ideas matemáticas',
      'IDENTIFY_THEORIES': 'identificar teorías científicas',
      'PROCESS_ANALYZE': 'procesar y analizar datos científicos',
      'APPLY_PRINCIPLES': 'aplicar principios científicos',
      'SCIENTIFIC_ARGUMENT': 'construir argumentos científicos',
      'TEMPORAL_THINKING': 'pensar temporalmente sobre eventos históricos',
      'SOURCE_ANALYSIS': 'analizar fuentes históricas',
      'MULTICAUSAL_ANALYSIS': 'analizar múltiples causas históricas',
      'CRITICAL_THINKING': 'pensar críticamente sobre eventos históricos',
      'REFLECTION': 'reflexionar sobre procesos históricos'
    };

    const description = skillDescriptions[skill] || 'desarrollar habilidades de pensamiento';

    return {
      id: `generic-fallback-${skill}-${Date.now()}`,
      question: `Este es un ejercicio de práctica para ${description}. ¿Cuál consideras que es la estrategia más efectiva para desarrollar esta habilidad?`,
      options: [
        "Practicar regularmente con ejercicios similares",
        "Estudiar la teoría sin hacer ejercicios",
        "Memorizar respuestas sin comprender",
        "Evitar este tipo de ejercicios"
      ],
      correctAnswer: "Practicar regularmente con ejercicios similares",
      explanation: `La práctica regular es fundamental para desarrollar ${description}. Este ejercicio de respaldo se muestra porque el sistema principal no está disponible temporalmente.`,
      skill: skill,
      prueba: prueba,
      difficulty: difficulty,
      text: `Ejercicio educativo de respaldo para la habilidad ${skill} en ${prueba}.`
    };
  }

  /**
   * Verifica si hay ejercicios disponibles para una habilidad específica
   */
  static hasExercisesForSkill(skill: TPAESHabilidad, prueba: TPAESPrueba): boolean {
    try {
      const pruebaExercises = this.exerciseTemplates[prueba];
      if (!pruebaExercises) return false;

      const skillExercises = pruebaExercises[skill];
      return skillExercises && skillExercises.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtiene estadísticas del banco de ejercicios
   */
  static getBankStatistics(): {
    totalExercises: number;
    exercisesByPrueba: Record<TPAESPrueba, number>;
    coverageBySkill: Record<TPAESHabilidad, number>;
  } {
    let totalExercises = 0;
    const exercisesByPrueba: Record<TPAESPrueba, number> = {
      'COMPETENCIA_LECTORA': 0,
      'MATEMATICA_1': 0,
      'MATEMATICA_2': 0,
      'CIENCIAS': 0,
      'HISTORIA': 0
    };
    const coverageBySkill: Record<TPAESHabilidad, number> = {
      'TRACK_LOCATE': 0,
      'INTERPRET_RELATE': 0,
      'EVALUATE_REFLECT': 0,
      'SOLVE_PROBLEMS': 0,
      'REPRESENT': 0,
      'MODEL': 0,
      'ARGUE_COMMUNICATE': 0,
      'IDENTIFY_THEORIES': 0,
      'PROCESS_ANALYZE': 0,
      'APPLY_PRINCIPLES': 0,
      'SCIENTIFIC_ARGUMENT': 0,
      'TEMPORAL_THINKING': 0,
      'SOURCE_ANALYSIS': 0,
      'MULTICAUSAL_ANALYSIS': 0,
      'CRITICAL_THINKING': 0,
      'REFLECTION': 0
    };

    Object.entries(this.exerciseTemplates).forEach(([prueba, skillMap]) => {
      Object.entries(skillMap).forEach(([skill, exercises]) => {
        const count = exercises.length;
        totalExercises += count;
        exercisesByPrueba[prueba as TPAESPrueba] += count;
        coverageBySkill[skill as TPAESHabilidad] += count;
      });
    });

    return {
      totalExercises,
      exercisesByPrueba,
      coverageBySkill
    };
  }
}
