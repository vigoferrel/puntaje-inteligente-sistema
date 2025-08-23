
import { Exercise } from '@/types/ai-types';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { v4 as uuidv4 } from 'uuid';

// Banco de ejercicios de ejemplo organizados por materia
const EXERCISE_BANK: Record<string, Exercise[]> = {
  COMPETENCIA_LECTORA: [
    {
      id: 'cl-001',
      nodeId: 'node-comprension-basica',
      nodeName: 'Comprensión Lectora Básica',
      prueba: 'COMPETENCIA_LECTORA',
      skill: 'INTERPRET_RELATE',
      difficulty: 'BASIC',
      question: 'Lee el siguiente texto: "El agua es esencial para la vida. Sin agua, los seres vivos no pueden sobrevivir más de unos pocos días." ¿Cuál es la idea principal?',
      options: [
        'El agua es un líquido',
        'Los seres vivos necesitan agua para vivir',
        'Hay diferentes tipos de agua',
        'El agua se encuentra en ríos y lagos'
      ],
      correctAnswer: 'Los seres vivos necesitan agua para vivir',
      explanation: 'La idea principal del texto es que el agua es esencial para la supervivencia de los seres vivos.'
    },
    {
      id: 'cl-002',
      nodeId: 'node-inferencia',
      nodeName: 'Comprensión Inferencial',
      prueba: 'COMPETENCIA_LECTORA',
      skill: 'INFER_CONCLUDE',
      difficulty: 'INTERMEDIATE',
      question: 'Texto: "María llegó tarde al trabajo por tercera vez esta semana. Su jefe la esperaba en la entrada con una expresión seria." ¿Qué se puede inferir?',
      options: [
        'María es muy trabajadora',
        'El jefe está contento con María',
        'María podría tener problemas en el trabajo',
        'Es viernes'
      ],
      correctAnswer: 'María podría tener problemas en el trabajo',
      explanation: 'La combinación de llegar tarde repetidamente y la expresión seria del jefe sugiere que María podría enfrentar consecuencias.'
    }
  ],
  MATEMATICA_1: [
    {
      id: 'm1-001',
      nodeId: 'node-funciones-lineales',
      nodeName: 'Funciones Lineales',
      prueba: 'MATEMATICA_1',
      skill: 'ANALYZE',
      difficulty: 'BASIC',
      question: 'Si f(x) = 3x + 2, ¿cuál es el valor de f(4)?',
      options: ['10', '12', '14', '16'],
      correctAnswer: '14',
      explanation: 'f(4) = 3(4) + 2 = 12 + 2 = 14'
    },
    {
      id: 'm1-002',
      nodeId: 'node-ecuaciones',
      nodeName: 'Ecuaciones de Primer Grado',
      prueba: 'MATEMATICA_1',
      skill: 'SOLVE',
      difficulty: 'INTERMEDIATE',
      question: 'Resuelve la ecuación: 2x + 5 = 13',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 'x = 4',
      explanation: '2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4'
    }
  ],
  MATEMATICA_2: [
    {
      id: 'm2-001',
      nodeId: 'node-funciones-cuadraticas',
      nodeName: 'Funciones Cuadráticas',
      prueba: 'MATEMATICA_2',
      skill: 'ANALYZE',
      difficulty: 'ADVANCED',
      question: 'Para la función f(x) = x² - 4x + 3, ¿cuál es el vértice de la parábola?',
      options: ['(2, -1)', '(2, 1)', '(-2, -1)', '(-2, 1)'],
      correctAnswer: '(2, -1)',
      explanation: 'El vértice se encuentra en x = -b/2a = -(-4)/2(1) = 2, y f(2) = 4 - 8 + 3 = -1'
    }
  ],
  CIENCIAS: [
    {
      id: 'c-001',
      nodeId: 'node-celula',
      nodeName: 'Estructura Celular',
      prueba: 'CIENCIAS',
      skill: 'IDENTIFY',
      difficulty: 'BASIC',
      question: '¿Cuál es la principal diferencia entre células procariotas y eucariotas?',
      options: [
        'El tamaño de la célula',
        'La presencia de núcleo definido',
        'La capacidad de reproducirse',
        'El tipo de membrana celular'
      ],
      correctAnswer: 'La presencia de núcleo definido',
      explanation: 'Las células eucariotas tienen núcleo definido rodeado por membrana nuclear, mientras que las procariotas no.'
    }
  ],
  HISTORIA: [
    {
      id: 'h-001',
      nodeId: 'node-independencia',
      nodeName: 'Independencia de Chile',
      prueba: 'HISTORIA',
      skill: 'CONTEXTUALIZE',
      difficulty: 'INTERMEDIATE',
      question: '¿En qué año se declaró la independencia de Chile?',
      options: ['1810', '1818', '1814', '1820'],
      correctAnswer: '1818',
      explanation: 'La independencia de Chile se declaró el 12 de febrero de 1818, aunque el proceso independentista comenzó en 1810.'
    }
  ]
};

export class LectoGuiaExerciseService {
  // Generar ejercicio por materia
  static generateExerciseBySubject(subject: string, difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' = 'INTERMEDIATE'): Exercise {
    console.log(`Generando ejercicio para materia: ${subject}, dificultad: ${difficulty}`);
    
    // Mapear materia a prueba PAES
    const subjectToPrueba: Record<string, TPAESPrueba> = {
      'general': 'COMPETENCIA_LECTORA',
      'lectura': 'COMPETENCIA_LECTORA',
      'matematicas': 'MATEMATICA_1',
      'matematicas-basica': 'MATEMATICA_1',
      'matematicas-avanzada': 'MATEMATICA_2',
      'ciencias': 'CIENCIAS',
      'historia': 'HISTORIA'
    };

    const prueba = subjectToPrueba[subject] || 'COMPETENCIA_LECTORA';
    const availableExercises = EXERCISE_BANK[prueba] || EXERCISE_BANK.COMPETENCIA_LECTORA;
    
    // Filtrar por dificultad si es posible
    const filteredExercises = availableExercises.filter(ex => ex.difficulty === difficulty);
    const exercisePool = filteredExercises.length > 0 ? filteredExercises : availableExercises;
    
    // Seleccionar ejercicio aleatorio
    const selectedExercise = exercisePool[Math.floor(Math.random() * exercisePool.length)];
    
    console.log(`Ejercicio seleccionado: ${selectedExercise.nodeName} (${selectedExercise.prueba})`);
    
    return {
      ...selectedExercise,
      id: `${selectedExercise.id}-${Date.now()}` // Generar ID único
    };
  }

  // Generar ejercicio por nodo específico
  static generateExerciseByNode(nodeId: string, prueba?: TPAESPrueba): Exercise | null {
    console.log(`Generando ejercicio para nodo: ${nodeId}, prueba: ${prueba}`);
    
    // Buscar en todos los bancos si no se especifica prueba
    const searchBanks = prueba ? [prueba] : Object.keys(EXERCISE_BANK) as TPAESPrueba[];
    
    for (const bank of searchBanks) {
      const exercises = EXERCISE_BANK[bank] || [];
      const nodeExercise = exercises.find(ex => ex.nodeId === nodeId);
      
      if (nodeExercise) {
        console.log(`Ejercicio encontrado para nodo: ${nodeExercise.nodeName}`);
        return {
          ...nodeExercise,
          id: `${nodeExercise.id}-${Date.now()}`
        };
      }
    }
    
    console.warn(`No se encontró ejercicio para nodo: ${nodeId}, generando fallback`);
    
    // Fallback: generar ejercicio genérico
    return this.createFallbackExercise(nodeId, prueba);
  }

  // Crear ejercicio de fallback
  private static createFallbackExercise(nodeId: string, prueba?: TPAESPrueba): Exercise {
    const fallbackPrueba = prueba || 'COMPETENCIA_LECTORA';
    
    const fallbackExercises: Record<TPAESPrueba, Exercise> = {
      COMPETENCIA_LECTORA: {
        id: `fallback-cl-${Date.now()}`,
        nodeId,
        nodeName: 'Ejercicio de Comprensión',
        prueba: 'COMPETENCIA_LECTORA',
        skill: 'INTERPRET_RELATE',
        difficulty: 'INTERMEDIATE',
        question: 'Este es un ejercicio de práctica de comprensión lectora. ¿Cuál consideras que es la mejor estrategia para mejorar tu comprensión?',
        options: [
          'Leer rápidamente sin detenerse',
          'Leer con atención e identificar ideas principales',
          'Memorizar todo el texto',
          'Leer solo el primer párrafo'
        ],
        correctAnswer: 'Leer con atención e identificar ideas principales',
        explanation: 'La comprensión efectiva requiere una lectura atenta que permita identificar y relacionar las ideas principales del texto.'
      },
      MATEMATICA_1: {
        id: `fallback-m1-${Date.now()}`,
        nodeId,
        nodeName: 'Ejercicio de Matemática Básica',
        prueba: 'MATEMATICA_1',
        skill: 'SOLVE',
        difficulty: 'INTERMEDIATE',
        question: 'Si tienes 3x + 6 = 15, ¿cuál es el valor de x?',
        options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
        correctAnswer: 'x = 3',
        explanation: '3x + 6 = 15 → 3x = 15 - 6 → 3x = 9 → x = 3'
      },
      MATEMATICA_2: {
        id: `fallback-m2-${Date.now()}`,
        nodeId,
        nodeName: 'Ejercicio de Matemática Avanzada',
        prueba: 'MATEMATICA_2',
        skill: 'ANALYZE',
        difficulty: 'ADVANCED',
        question: '¿Cuál es la derivada de f(x) = x² + 3x?',
        options: ['2x + 3', 'x + 3', '2x', 'x²'],
        correctAnswer: '2x + 3',
        explanation: 'La derivada de x² es 2x y la derivada de 3x es 3, por lo tanto f\'(x) = 2x + 3'
      },
      CIENCIAS: {
        id: `fallback-c-${Date.now()}`,
        nodeId,
        nodeName: 'Ejercicio de Ciencias',
        prueba: 'CIENCIAS',
        skill: 'IDENTIFY',
        difficulty: 'INTERMEDIATE',
        question: '¿Cuál es la unidad básica de la vida?',
        options: ['El átomo', 'La molécula', 'La célula', 'El tejido'],
        correctAnswer: 'La célula',
        explanation: 'La célula es considerada la unidad básica de la vida, ya que es la estructura más simple que puede realizar todas las funciones vitales.'
      },
      HISTORIA: {
        id: `fallback-h-${Date.now()}`,
        nodeId,
        nodeName: 'Ejercicio de Historia',
        prueba: 'HISTORIA',
        skill: 'CONTEXTUALIZE',
        difficulty: 'INTERMEDIATE',
        question: '¿Cuál fue el principal motivo de la Primera Guerra Mundial?',
        options: [
          'Disputas económicas',
          'El asesinato del archiduque Francisco Fernando',
          'Conflictos religiosos',
          'La expansión colonial'
        ],
        correctAnswer: 'El asesinato del archiduque Francisco Fernando',
        explanation: 'El asesinato del archiduque Francisco Fernando de Austria en Sarajevo fue el detonante inmediato que llevó al estallido de la Primera Guerra Mundial.'
      }
    };

    return fallbackExercises[fallbackPrueba];
  }

  // Obtener ejercicios por dificultad
  static getExercisesByDifficulty(difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'): Exercise[] {
    const allExercises: Exercise[] = [];
    
    Object.values(EXERCISE_BANK).forEach(exercises => {
      allExercises.push(...exercises.filter(ex => ex.difficulty === difficulty));
    });
    
    return allExercises;
  }

  // Validar respuesta de ejercicio
  static validateAnswer(exercise: Exercise, selectedOption: string): {
    isCorrect: boolean;
    feedback: string;
  } {
    const isCorrect = selectedOption === exercise.correctAnswer;
    
    return {
      isCorrect,
      feedback: isCorrect 
        ? '¡Correcto! ' + exercise.explanation
        : `Incorrecto. La respuesta correcta es: ${exercise.correctAnswer}. ${exercise.explanation}`
    };
  }

  // Obtener estadísticas del banco de ejercicios
  static getExerciseStats(): {
    totalExercises: number;
    exercisesBySubject: Record<string, number>;
    exercisesByDifficulty: Record<string, number>;
  } {
    let totalExercises = 0;
    const exercisesBySubject: Record<string, number> = {};
    const exercisesByDifficulty: Record<string, number> = { BASIC: 0, INTERMEDIATE: 0, ADVANCED: 0 };

    Object.entries(EXERCISE_BANK).forEach(([subject, exercises]) => {
      exercisesBySubject[subject] = exercises.length;
      totalExercises += exercises.length;
      
      exercises.forEach(ex => {
        exercisesByDifficulty[ex.difficulty]++;
      });
    });

    return {
      totalExercises,
      exercisesBySubject,
      exercisesByDifficulty
    };
  }
}
