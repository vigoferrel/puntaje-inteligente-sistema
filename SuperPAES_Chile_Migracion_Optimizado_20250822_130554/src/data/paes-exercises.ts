// ========================================
// SUPERPAES CHILE - EJERCICIOS PAES REALES
// ========================================

export interface PAESExercise {
  id: string;
  subject: 'Competencia Lectora' | 'Matemática M1' | 'Matemática M2' | 'Ciencias' | 'Historia';
  topic: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Excelencia';
  bloomLevel: 'Recordar' | 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar' | 'Crear';
  question: string;
  contextText?: string; // Texto de contexto para ejercicios de lectura
  contextImage?: string; // Imagen de contexto (gráficos, diagramas, fórmulas)
  contextFormula?: string; // Fórmula matemática en LaTeX
  alternatives: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  explanationFormula?: string; // Fórmula en la explicación
  imageUrl?: string;
  tags: string[];
  points: number;
}

export const PAES_EXERCISES: PAESExercise[] = [
  // ========================================
  // COMPETENCIA LECTORA - EJERCICIOS REALES
  // ========================================
  {
    id: 'CL001',
    subject: 'Competencia Lectora',
    topic: 'Información Explícita',
    difficulty: 'Intermedio',
    bloomLevel: 'Comprender',
    contextText: `Los bosques tropicales son ecosistemas complejos que albergan más del 50% de la biodiversidad terrestre del planeta. Estos ecosistemas no solo proporcionan hábitat para innumerables especies, sino que también desempeñan un papel crucial en la regulación del clima global. Los árboles absorben dióxido de carbono de la atmósfera durante la fotosíntesis, actuando como sumideros naturales de carbono. Además, liberan oxígeno como subproducto de este proceso, contribuyendo significativamente al aire que respiramos. Los bosques también regulan las precipitaciones y las temperaturas locales, creando microclimas que sostienen la vida en sus alrededores.`,
    question: 'Según el texto, ¿cuál es la principal función de los bosques en el ecosistema?',
    alternatives: {
      A: 'Proporcionar madera para la industria',
      B: 'Actuar como sumideros de carbono y reguladores del clima',
      C: 'Servir como hábitat exclusivo para aves',
      D: 'Generar ingresos económicos a través del turismo'
    },
    correctAnswer: 'B',
    explanation: 'Los bosques actúan como sumideros de carbono, absorbiendo CO2 de la atmósfera y liberando oxígeno, además de regular el clima local y global.',
    tags: ['información explícita', 'medio ambiente', 'ecosistema'],
    points: 15
  },
  {
    id: 'CL002',
    subject: 'Competencia Lectora',
    topic: 'Inferencia',
    difficulty: 'Avanzado',
    bloomLevel: 'Analizar',
    contextText: `La revolución tecnológica ha transformado radicalmente la forma en que vivimos, trabajamos y nos comunicamos. Las innovaciones en inteligencia artificial, automatización y conectividad digital han generado oportunidades sin precedentes para mejorar la calidad de vida y resolver problemas complejos. Sin embargo, esta transformación también ha traído consigo desafíos significativos, como la creciente brecha digital, la pérdida de empleos tradicionales y preocupaciones sobre la privacidad y seguridad de los datos. El ritmo acelerado del cambio tecnológico requiere que las sociedades desarrollen nuevas habilidades y adapten sus sistemas educativos y laborales para aprovechar las oportunidades mientras mitigan los riesgos asociados.`,
    question: '¿Qué se puede inferir sobre la actitud del autor hacia la tecnología según el texto?',
    alternatives: {
      A: 'Es completamente optimista y no ve desventajas',
      B: 'Mantiene una postura neutral y objetiva',
      C: 'Reconoce beneficios pero también advierte sobre riesgos',
      D: 'Es pesimista y considera que causa más problemas que soluciones'
    },
    correctAnswer: 'C',
    explanation: 'El autor presenta una visión equilibrada, reconociendo las ventajas de la tecnología pero también alertando sobre sus posibles consecuencias negativas.',
    tags: ['inferencia', 'actitud del autor', 'tecnología'],
    points: 20
  },
  {
    id: 'CL003',
    subject: 'Competencia Lectora',
    topic: 'Vocabulario Contextual',
    difficulty: 'Básico',
    bloomLevel: 'Comprender',
    contextText: `El desarrollo sustentable se ha convertido en un concepto fundamental para el futuro de nuestro planeta. Este enfoque busca satisfacer las necesidades del presente sin comprometer la capacidad de las generaciones futuras para satisfacer sus propias necesidades. En la práctica, esto significa implementar políticas y prácticas que promuevan el uso responsable de los recursos naturales, la reducción de la contaminación y la creación de sistemas económicos que puedan mantenerse a largo plazo sin agotar los recursos del planeta. Las empresas, gobiernos y ciudadanos están adoptando cada vez más este modelo de desarrollo como una forma de asegurar un futuro más equilibrado y saludable para todos.`,
    question: 'En el contexto del texto, la palabra "sustentable" se refiere a:',
    alternatives: {
      A: 'Algo que es muy costoso',
      B: 'Un proceso que puede mantenerse a largo plazo sin agotar recursos',
      C: 'Una actividad que genera muchas ganancias',
      D: 'Un proyecto que requiere mucha tecnología'
    },
    correctAnswer: 'B',
    explanation: 'Sustentable se refiere a la capacidad de mantener un proceso o actividad a largo plazo sin agotar los recursos naturales o causar daño al medio ambiente.',
    tags: ['vocabulario contextual', 'sustentabilidad', 'medio ambiente'],
    points: 10
  },
  {
    id: 'CL004',
    subject: 'Competencia Lectora',
    topic: 'Comprensión de Ideas Principales',
    difficulty: 'Intermedio',
    bloomLevel: 'Comprender',
    contextText: `La inteligencia artificial ha revolucionado múltiples campos de la medicina moderna. Desde el diagnóstico temprano de enfermedades hasta la personalización de tratamientos, las tecnologías de IA están transformando la forma en que los profesionales de la salud abordan los desafíos médicos. Los algoritmos de machine learning pueden analizar grandes volúmenes de datos médicos, identificando patrones que serían imposibles de detectar para el ojo humano. Esta capacidad ha permitido mejorar significativamente la precisión diagnóstica y optimizar los protocolos de tratamiento, especialmente en áreas como la oncología y la radiología. Sin embargo, es importante destacar que la IA no reemplaza al juicio clínico humano, sino que actúa como una herramienta complementaria que potencia las capacidades de los profesionales médicos.`,
    question: '¿Cuál es la idea principal del texto?',
    alternatives: {
      A: 'La IA ha reemplazado completamente a los médicos en el diagnóstico',
      B: 'La IA es una herramienta complementaria que mejora la medicina',
      C: 'La IA solo es útil en oncología y radiología',
      D: 'La IA es peligrosa y no debe usarse en medicina'
    },
    correctAnswer: 'B',
    explanation: 'El texto enfatiza que la IA actúa como herramienta complementaria que potencia las capacidades de los profesionales médicos, no como reemplazo.',
    tags: ['idea principal', 'inteligencia artificial', 'medicina'],
    points: 15
  },
  {
    id: 'CL005',
    subject: 'Competencia Lectora',
    topic: 'Análisis de Argumentos',
    difficulty: 'Avanzado',
    bloomLevel: 'Evaluar',
    contextText: `El debate sobre la implementación de energías renovables en Chile ha generado posiciones encontradas entre diferentes sectores. Los defensores argumentan que la transición hacia fuentes de energía limpia es esencial para combatir el cambio climático y reducir la dependencia de combustibles fósiles importados. Además, destacan el potencial de Chile para convertirse en líder regional en energías renovables, aprovechando sus recursos naturales como el sol del desierto de Atacama y los vientos de la Patagonia. Por otro lado, los críticos señalan que esta transición requiere inversiones masivas en infraestructura y que podría generar desempleo en sectores tradicionales de la energía. También argumentan que las energías renovables son intermitentes y no pueden garantizar un suministro constante.`,
    question: '¿Cuál de los siguientes argumentos a favor de las energías renovables se menciona en el texto?',
    alternatives: {
      A: 'Son más baratas que los combustibles fósiles',
      B: 'Chile puede convertirse en líder regional en energías renovables',
      C: 'No requieren inversión en infraestructura',
      D: 'Garantizan un suministro constante de energía'
    },
    correctAnswer: 'B',
    explanation: 'El texto menciona específicamente que Chile tiene el potencial de convertirse en líder regional en energías renovables.',
    tags: ['análisis de argumentos', 'energías renovables', 'Chile'],
    points: 18
  },

  // ========================================
  // MATEMÁTICA M1 - EJERCICIOS REALES
  // ========================================
  {
    id: 'M1001',
    subject: 'Matemática M1',
    topic: 'Ecuaciones de Primer Grado',
    difficulty: 'Intermedio',
    bloomLevel: 'Aplicar',
    contextFormula: '3x + 5 = 2x + 12',
    question: 'Si 3x + 5 = 2x + 12, entonces el valor de x es:',
    alternatives: {
      A: '7',
      B: '5',
      C: '3',
      D: '1'
    },
    correctAnswer: 'A',
    explanation: '3x + 5 = 2x + 12 → 3x - 2x = 12 - 5 → x = 7',
    explanationFormula: 'x = 7',
    tags: ['ecuaciones', 'primer grado', 'álgebra'],
    points: 15
  },
  {
    id: 'M1002',
    subject: 'Matemática M1',
    topic: 'Sistemas de Ecuaciones',
    difficulty: 'Avanzado',
    bloomLevel: 'Analizar',
    contextFormula: '\\begin{cases} 2x + y = 8 \\\\ x - y = 1 \\end{cases}',
    question: 'En el sistema de ecuaciones: 2x + y = 8 y x - y = 1, el valor de x es:',
    alternatives: {
      A: '2',
      B: '3',
      C: '4',
      D: '5'
    },
    correctAnswer: 'B',
    explanation: 'Sumando las ecuaciones: 2x + y + x - y = 8 + 1 → 3x = 9 → x = 3',
    explanationFormula: 'x = 3',
    tags: ['sistemas de ecuaciones', 'álgebra', 'método de eliminación'],
    points: 20
  },
  {
    id: 'M1003',
    subject: 'Matemática M1',
    topic: 'Funciones Lineales',
    difficulty: 'Básico',
    bloomLevel: 'Comprender',
    contextText: 'Considera los puntos P₁(2, 3) y P₂(4, 7) en el plano cartesiano.',
    contextFormula: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
    question: 'La pendiente de la recta que pasa por los puntos (2, 3) y (4, 7) es:',
    alternatives: {
      A: '1',
      B: '2',
      C: '3',
      D: '4'
    },
    correctAnswer: 'B',
    explanation: 'm = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2',
    explanationFormula: 'm = \\frac{7 - 3}{4 - 2} = \\frac{4}{2} = 2',
    tags: ['funciones lineales', 'pendiente', 'geometría analítica'],
    points: 12
  },

  // ========================================
  // MATEMÁTICA M2 - EJERCICIOS REALES
  // ========================================
  {
    id: 'M2001',
    subject: 'Matemática M2',
    topic: 'Función Cuadrática',
    difficulty: 'Avanzado',
    bloomLevel: 'Aplicar',
    question: 'El vértice de la parábola y = x² - 4x + 3 tiene coordenadas:',
    alternatives: {
      A: '(2, -1)',
      B: '(2, 1)',
      C: '(-2, -1)',
      D: '(-2, 1)'
    },
    correctAnswer: 'A',
    explanation: 'x_v = -b/(2a) = -(-4)/(2·1) = 2. y_v = f(2) = 2² - 4(2) + 3 = 4 - 8 + 3 = -1',
    tags: ['función cuadrática', 'vértice', 'parábola'],
    points: 18
  },
  {
    id: 'M2002',
    subject: 'Matemática M2',
    topic: 'Logaritmos',
    difficulty: 'Intermedio',
    bloomLevel: 'Aplicar',
    question: 'Si log₂(x) = 3, entonces x es igual a:',
    alternatives: {
      A: '6',
      B: '8',
      C: '9',
      D: '12'
    },
    correctAnswer: 'B',
    explanation: 'log₂(x) = 3 → x = 2³ = 8',
    tags: ['logaritmos', 'propiedades', 'álgebra'],
    points: 15
  },

  // ========================================
  // CIENCIAS - EJERCICIOS REALES
  // ========================================
  {
    id: 'C001',
    subject: 'Ciencias',
    topic: 'Biología Celular',
    difficulty: 'Intermedio',
    bloomLevel: 'Comprender',
    contextText: 'En la célula eucariota, cada orgánulo tiene funciones específicas. La producción de energía es fundamental para el funcionamiento celular.',
    contextImage: 'https://ejemplo.com/celula-eucariota.png',
    question: '¿Cuál de las siguientes estructuras celulares es responsable de la producción de energía?',
    alternatives: {
      A: 'Núcleo',
      B: 'Mitocondria',
      C: 'Retículo endoplásmico',
      D: 'Aparato de Golgi'
    },
    correctAnswer: 'B',
    explanation: 'Las mitocondrias son los orgánulos responsables de la producción de ATP a través de la respiración celular.',
    tags: ['biología celular', 'mitocondria', 'energía celular'],
    points: 15
  },
  {
    id: 'C002',
    subject: 'Ciencias',
    topic: 'Química',
    difficulty: 'Avanzado',
    bloomLevel: 'Analizar',
    contextText: 'En una reacción química, los reactantes se combinan en proporciones definidas según la ecuación estequiométrica.',
    contextFormula: '2H_2 + O_2 \\rightarrow 2H_2O',
    question: 'En la reacción 2H₂ + O₂ → 2H₂O, si reaccionan 4 moles de H₂, ¿cuántos moles de O₂ se necesitan?',
    alternatives: {
      A: '1 mol',
      B: '2 moles',
      C: '4 moles',
      D: '8 moles'
    },
    correctAnswer: 'B',
    explanation: 'Según la estequiometría: 2 moles H₂ : 1 mol O₂. Si hay 4 moles H₂, se necesitan 2 moles O₂.',
    explanationFormula: '\\frac{4 \\text{ moles } H_2}{2} = 2 \\text{ moles } O_2',
    tags: ['química', 'estequiometría', 'reacciones químicas'],
    points: 20
  },
  {
    id: 'C003',
    subject: 'Ciencias',
    topic: 'Física',
    difficulty: 'Intermedio',
    bloomLevel: 'Aplicar',
    contextText: 'En física, el movimiento rectilíneo uniforme (MRU) se caracteriza por una velocidad constante.',
    contextFormula: 'v = \\frac{d}{t}',
    question: 'Si un automóvil recorre 120 km en 2 horas, ¿cuál es su velocidad en km/h?',
    alternatives: {
      A: '40 km/h',
      B: '60 km/h',
      C: '80 km/h',
      D: '120 km/h'
    },
    correctAnswer: 'B',
    explanation: 'v = d/t = 120 km / 2 h = 60 km/h',
    explanationFormula: 'v = \\frac{120 \\text{ km}}{2 \\text{ h}} = 60 \\text{ km/h}',
    tags: ['física', 'movimiento', 'velocidad'],
    points: 15
  },
  {
    id: 'C004',
    subject: 'Ciencias',
    topic: 'Genética',
    difficulty: 'Avanzado',
    bloomLevel: 'Analizar',
    contextText: 'En genética, el cruce de dos organismos heterocigotos puede producir diferentes combinaciones genéticas.',
    contextImage: 'https://ejemplo.com/cuadro-punnett.png',
    question: 'Si se cruzan dos plantas heterocigotas (Aa), ¿qué porcentaje de la descendencia será homocigota recesiva (aa)?',
    alternatives: {
      A: '0%',
      B: '25%',
      C: '50%',
      D: '75%'
    },
    correctAnswer: 'B',
    explanation: 'En un cruce Aa × Aa, el 25% será AA, 50% Aa, y 25% aa.',
    tags: ['genética', 'herencia', 'cuadro de Punnett'],
    points: 18
  },

  // ========================================
  // HISTORIA - EJERCICIOS REALES
  // ========================================
  {
    id: 'H001',
    subject: 'Historia',
    topic: 'Historia de Chile',
    difficulty: 'Intermedio',
    bloomLevel: 'Recordar',
    question: '¿En qué año se proclamó la independencia de Chile?',
    alternatives: {
      A: '1810',
      B: '1818',
      C: '1820',
      D: '1825'
    },
    correctAnswer: 'B',
    explanation: 'La independencia de Chile se proclamó oficialmente el 12 de febrero de 1818.',
    tags: ['historia de chile', 'independencia', 'siglo XIX'],
    points: 10
  },
  {
    id: 'H002',
    subject: 'Historia',
    topic: 'Historia Universal',
    difficulty: 'Avanzado',
    bloomLevel: 'Analizar',
    question: '¿Cuál fue una de las principales consecuencias de la Revolución Industrial?',
    alternatives: {
      A: 'El fortalecimiento del sistema feudal',
      B: 'La urbanización masiva y el surgimiento de la clase obrera',
      C: 'El retorno a la economía agrícola',
      D: 'La eliminación del comercio internacional'
    },
    correctAnswer: 'B',
    explanation: 'La Revolución Industrial provocó la migración masiva del campo a la ciudad, creando centros urbanos y una nueva clase social: el proletariado.',
    tags: ['historia universal', 'revolución industrial', 'siglo XIX'],
    points: 18
  }
];

// ========================================
// TAXONOMÍA DE BLOOM - IMPLEMENTACIÓN
// ========================================

export interface BloomLevel {
  name: string;
  description: string;
  verbs: string[];
  difficulty: number;
  color: string;
}

export const BLOOM_LEVELS: BloomLevel[] = [
  {
    name: 'Recordar',
    description: 'Recordar información previamente aprendida',
    verbs: ['definir', 'identificar', 'listar', 'nombrar', 'recordar', 'repetir'],
    difficulty: 1,
    color: '#3b82f6'
  },
  {
    name: 'Comprender',
    description: 'Comprender el significado de la información',
    verbs: ['explicar', 'describir', 'interpretar', 'resumir', 'comparar', 'clasificar'],
    difficulty: 2,
    color: '#10b981'
  },
  {
    name: 'Aplicar',
    description: 'Usar información en situaciones nuevas',
    verbs: ['aplicar', 'calcular', 'resolver', 'demostrar', 'ejecutar', 'implementar'],
    difficulty: 3,
    color: '#f59e0b'
  },
  {
    name: 'Analizar',
    description: 'Descomponer información en partes',
    verbs: ['analizar', 'comparar', 'contrastar', 'examinar', 'investigar', 'categorizar'],
    difficulty: 4,
    color: '#ef4444'
  },
  {
    name: 'Evaluar',
    description: 'Juzgar el valor de la información',
    verbs: ['evaluar', 'juzgar', 'criticar', 'valorar', 'justificar', 'argumentar'],
    difficulty: 5,
    color: '#8b5cf6'
  },
  {
    name: 'Crear',
    description: 'Crear algo nuevo a partir de la información',
    verbs: ['crear', 'diseñar', 'desarrollar', 'formular', 'construir', 'producir'],
    difficulty: 6,
    color: '#ec4899'
  }
];

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

export const getExercisesBySubject = (subject: string): PAESExercise[] => {
  return PAES_EXERCISES.filter(exercise => exercise.subject === subject);
};

export const getExercisesByBloomLevel = (bloomLevel: string): PAESExercise[] => {
  return PAES_EXERCISES.filter(exercise => exercise.bloomLevel === bloomLevel);
};

export const getExercisesByDifficulty = (difficulty: string): PAESExercise[] => {
  return PAES_EXERCISES.filter(exercise => exercise.difficulty === difficulty);
};

export const getRandomExercise = (filters?: {
  subject?: string;
  bloomLevel?: string;
  difficulty?: string;
}): PAESExercise => {
  let exercises = PAES_EXERCISES;
  
  if (filters?.subject) {
    exercises = exercises.filter(ex => ex.subject === filters.subject);
  }
  if (filters?.bloomLevel) {
    exercises = exercises.filter(ex => ex.bloomLevel === filters.bloomLevel);
  }
  if (filters?.difficulty) {
    exercises = exercises.filter(ex => ex.difficulty === filters.difficulty);
  }
  
  const randomIndex = Math.floor(Math.random() * exercises.length);
  return exercises[randomIndex];
};

export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const getBloomLevelInfo = (bloomLevel: string): BloomLevel | undefined => {
  return BLOOM_LEVELS.find(level => level.name === bloomLevel);
};
