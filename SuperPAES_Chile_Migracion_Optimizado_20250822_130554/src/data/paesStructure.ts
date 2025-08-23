// ========================================
// SUPERPAES CHILE - ESTRUCTURA OFICIAL PAES CON NODOS Y BLOOM
// ========================================

export interface PAESNodo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  nivel: 1 | 2 | 3; // Tier del nodo
  habilidad: string;
  materia: string;
  bloomLevel: BloomLevel;
  dificultad: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  tiempoEstimado: number; // minutos
  ejerciciosOficiales: number;
  prerequisitos?: string[];
  pesoPAES: number; // Valor en puntaje PAES
}

export interface BloomLevel {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  icono: string;
  nivelCognitivo: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  tema: string;
}

export interface PAESPrueba {
  id: string;
  nombre: string;
  tipo: 'obligatoria' | 'electiva' | 'especial';
  duracion: number; // minutos
  preguntas: number;
  habilidades: string[];
  descripcion: string;
  carrerasRequeridas?: string[];
  ponderacionMinima?: number;
  ponderacionMaxima?: number;
  nodos: PAESNodo[];
}

export interface CarreraPAES {
  id: string;
  nombre: string;
  area: string;
  universidad: string;
  pruebasRequeridas: string[];
  ponderaciones: Record<string, number>;
  puntajeMinimo: number;
  puntajeMaximo: number;
  vacantes: number;
}

export interface DiagnosticoPAES {
  id: string;
  nombre: string;
  descripcion: string;
  pruebasIncluidas: string[];
  duracionTotal: number;
  preguntasTotal: number;
  tipo: 'inicial' | 'especifico' | 'integral' | 'carrera';
  carreraObjetivo?: string;
  nodosEvaluados: string[];
}

// ========================================
// TAXONOMÍA DE BLOOM OFICIAL
// ========================================

export const BLOOM_LEVELS: BloomLevel[] = [
  {
    id: 'L1',
    nombre: 'Memory Palace',
    descripcion: 'Recordar - Palacio de la Memoria',
    color: '#FF6B6B',
    icono: 'brain',
    nivelCognitivo: 'REMEMBER',
    tema: 'memory_palace'
  },
  {
    id: 'L2',
    nombre: 'Comprehension Lab',
    descripcion: 'Comprender - Laboratorio de Comprensión',
    color: '#4ECDC4',
    icono: 'search',
    nivelCognitivo: 'UNDERSTAND',
    tema: 'lab'
  },
  {
    id: 'L3',
    nombre: 'Workshop Arena',
    descripcion: 'Aplicar - Taller de Aplicación',
    color: '#45B7D1',
    icono: 'wrench',
    nivelCognitivo: 'APPLY',
    tema: 'workshop'
  },
  {
    id: 'L4',
    nombre: 'Detective Center',
    descripcion: 'Analizar - Centro de Análisis',
    color: '#96CEB4',
    icono: 'search',
    nivelCognitivo: 'ANALYZE',
    tema: 'detective'
  },
  {
    id: 'L5',
    nombre: 'Judgment Hub',
    descripcion: 'Evaluar - Hub de Evaluación',
    color: '#FFEAA7',
    icono: 'balance-scale',
    nivelCognitivo: 'EVALUATE',
    tema: 'court'
  },
  {
    id: 'L6',
    nombre: 'Innovation Space',
    descripcion: 'Crear - Espacio de Creación',
    color: '#DDA0DD',
    icono: 'palette',
    nivelCognitivo: 'CREATE',
    tema: 'studio'
  }
];

// ========================================
// NODOS OFICIALES PAES - COMPETENCIA LECTORA
// ========================================

export const NODOS_COMPETENCIA_LECTORA: PAESNodo[] = [
  // Rastrear-Localizar (30%)
  {
    id: 'CL-RL-01',
    codigo: 'CL-RL-01',
    nombre: 'Información explícita literal',
    descripcion: 'Localizar información explícita y literal en textos',
    nivel: 1,
    habilidad: 'Rastrear-Localizar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[0], // L1 - Recordar
    dificultad: 'BASIC',
    tiempoEstimado: 5,
    ejerciciosOficiales: 8,
    pesoPAES: 2.5
  },
  {
    id: 'CL-RL-02',
    codigo: 'CL-RL-02',
    nombre: 'Información explícita dispersa',
    descripcion: 'Localizar información explícita dispersa en el texto',
    nivel: 1,
    habilidad: 'Rastrear-Localizar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[1], // L2 - Comprender
    dificultad: 'BASIC',
    tiempoEstimado: 7,
    ejerciciosOficiales: 6,
    pesoPAES: 2.0
  },
  {
    id: 'CL-RL-03',
    codigo: 'CL-RL-03',
    nombre: 'Secuencias textuales',
    descripcion: 'Identificar secuencias y orden de información',
    nivel: 1,
    habilidad: 'Rastrear-Localizar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[1], // L2 - Comprender
    dificultad: 'BASIC',
    tiempoEstimado: 6,
    ejerciciosOficiales: 5,
    pesoPAES: 1.8
  },
  {
    id: 'CL-RL-04',
    codigo: 'CL-RL-04',
    nombre: 'Información en textos discontinuos',
    descripcion: 'Localizar información en gráficos, tablas y diagramas',
    nivel: 2,
    habilidad: 'Rastrear-Localizar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 8,
    ejerciciosOficiales: 4,
    pesoPAES: 2.2
  },
  {
    id: 'CL-RL-05',
    codigo: 'CL-RL-05',
    nombre: 'Vocabulario en contexto',
    descripcion: 'Comprender vocabulario específico en contexto',
    nivel: 1,
    habilidad: 'Rastrear-Localizar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[1], // L2 - Comprender
    dificultad: 'BASIC',
    tiempoEstimado: 4,
    ejerciciosOficiales: 7,
    pesoPAES: 1.5
  },

  // Interpretar-Relacionar (40%)
  {
    id: 'CL-IR-01',
    codigo: 'CL-IR-01',
    nombre: 'Inferencia léxica contextual',
    descripcion: 'Inferir significado de palabras por contexto',
    nivel: 2,
    habilidad: 'Interpretar-Relacionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 6,
    ejerciciosOficiales: 6,
    pesoPAES: 2.8
  },
  {
    id: 'CL-IR-02',
    codigo: 'CL-IR-02',
    nombre: 'Inferencia información implícita local',
    descripcion: 'Inferir información implícita en párrafos específicos',
    nivel: 2,
    habilidad: 'Interpretar-Relacionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 8,
    ejerciciosOficiales: 5,
    pesoPAES: 3.2
  },
  {
    id: 'CL-IR-03',
    codigo: 'CL-IR-03',
    nombre: 'Inferencia información implícita global',
    descripcion: 'Inferir información implícita en todo el texto',
    nivel: 3,
    habilidad: 'Interpretar-Relacionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[3], // L4 - Analizar
    dificultad: 'ADVANCED',
    tiempoEstimado: 10,
    ejerciciosOficiales: 4,
    pesoPAES: 3.8
  },
  {
    id: 'CL-IR-04',
    codigo: 'CL-IR-04',
    nombre: 'Síntesis de información',
    descripcion: 'Sintetizar información de diferentes partes del texto',
    nivel: 3,
    habilidad: 'Interpretar-Relacionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[3], // L4 - Analizar
    dificultad: 'ADVANCED',
    tiempoEstimado: 12,
    ejerciciosOficiales: 3,
    pesoPAES: 4.2
  },
  {
    id: 'CL-IR-05',
    codigo: 'CL-IR-05',
    nombre: 'Propósito comunicativo',
    descripcion: 'Identificar el propósito y función del texto',
    nivel: 2,
    habilidad: 'Interpretar-Relacionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[3], // L4 - Analizar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 7,
    ejerciciosOficiales: 4,
    pesoPAES: 2.5
  },

  // Evaluar-Reflexionar (30%)
  {
    id: 'CL-ER-01',
    codigo: 'CL-ER-01',
    nombre: 'Evaluación de la credibilidad',
    descripcion: 'Evaluar la credibilidad y confiabilidad de las fuentes',
    nivel: 3,
    habilidad: 'Evaluar-Reflexionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[4], // L5 - Evaluar
    dificultad: 'ADVANCED',
    tiempoEstimado: 10,
    ejerciciosOficiales: 3,
    pesoPAES: 3.5
  },
  {
    id: 'CL-ER-02',
    codigo: 'CL-ER-02',
    nombre: 'Evaluación de argumentos',
    descripcion: 'Evaluar la calidad y coherencia de argumentos',
    nivel: 3,
    habilidad: 'Evaluar-Reflexionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[4], // L5 - Evaluar
    dificultad: 'ADVANCED',
    tiempoEstimado: 12,
    ejerciciosOficiales: 2,
    pesoPAES: 4.0
  },
  {
    id: 'CL-ER-03',
    codigo: 'CL-ER-03',
    nombre: 'Identificación de sesgos',
    descripcion: 'Identificar sesgos y perspectivas en el texto',
    nivel: 3,
    habilidad: 'Evaluar-Reflexionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[4], // L5 - Evaluar
    dificultad: 'ADVANCED',
    tiempoEstimado: 11,
    ejerciciosOficiales: 2,
    pesoPAES: 3.8
  },
  {
    id: 'CL-ER-04',
    codigo: 'CL-ER-04',
    nombre: 'Reflexión sobre el contenido',
    descripcion: 'Reflexionar críticamente sobre el contenido del texto',
    nivel: 3,
    habilidad: 'Evaluar-Reflexionar',
    materia: 'Competencia Lectora',
    bloomLevel: BLOOM_LEVELS[5], // L6 - Crear
    dificultad: 'ADVANCED',
    tiempoEstimado: 15,
    ejerciciosOficiales: 1,
    pesoPAES: 4.5
  }
];

// ========================================
// NODOS OFICIALES PAES - MATEMÁTICA M1
// ========================================

export const NODOS_MATEMATICA_M1: PAESNodo[] = [
  // Números (25%)
  {
    id: 'M1-NUM-01',
    codigo: 'M1-NUM-01',
    nombre: 'Números enteros y racionales',
    descripcion: 'Operaciones con números enteros y racionales',
    nivel: 1,
    habilidad: 'Números',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[0], // L1 - Recordar
    dificultad: 'BASIC',
    tiempoEstimado: 4,
    ejerciciosOficiales: 8,
    pesoPAES: 2.0
  },
  {
    id: 'M1-NUM-02',
    codigo: 'M1-NUM-02',
    nombre: 'Números reales',
    descripcion: 'Propiedades y operaciones con números reales',
    nivel: 1,
    habilidad: 'Números',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[1], // L2 - Comprender
    dificultad: 'BASIC',
    tiempoEstimado: 5,
    ejerciciosOficiales: 6,
    pesoPAES: 1.8
  },

  // Álgebra y Funciones (35%)
  {
    id: 'M1-ALG-01',
    codigo: 'M1-ALG-01',
    nombre: 'Expresiones algebraicas',
    descripcion: 'Simplificación y operaciones con expresiones algebraicas',
    nivel: 2,
    habilidad: 'Álgebra y Funciones',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 6,
    ejerciciosOficiales: 7,
    pesoPAES: 2.5
  },
  {
    id: 'M1-ALG-02',
    codigo: 'M1-ALG-02',
    nombre: 'Ecuaciones lineales',
    descripcion: 'Resolución de ecuaciones lineales y sistemas',
    nivel: 2,
    habilidad: 'Álgebra y Funciones',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 8,
    ejerciciosOficiales: 6,
    pesoPAES: 3.0
  },
  {
    id: 'M1-ALG-03',
    codigo: 'M1-ALG-03',
    nombre: 'Funciones lineales',
    descripcion: 'Análisis y representación de funciones lineales',
    nivel: 2,
    habilidad: 'Álgebra y Funciones',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[3], // L4 - Analizar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 7,
    ejerciciosOficiales: 5,
    pesoPAES: 2.8
  },

  // Geometría (25%)
  {
    id: 'M1-GEO-01',
    codigo: 'M1-GEO-01',
    nombre: 'Geometría plana',
    descripcion: 'Propiedades y teoremas de figuras planas',
    nivel: 2,
    habilidad: 'Geometría',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 6,
    ejerciciosOficiales: 6,
    pesoPAES: 2.2
  },
  {
    id: 'M1-GEO-02',
    codigo: 'M1-GEO-02',
    nombre: 'Trigonometría básica',
    descripcion: 'Razones trigonométricas y aplicaciones',
    nivel: 2,
    habilidad: 'Geometría',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 8,
    ejerciciosOficiales: 4,
    pesoPAES: 2.5
  },

  // Probabilidad y Estadística (15%)
  {
    id: 'M1-PROB-01',
    codigo: 'M1-PROB-01',
    nombre: 'Probabilidad básica',
    descripcion: 'Cálculo de probabilidades simples y compuestas',
    nivel: 2,
    habilidad: 'Probabilidad y Estadística',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[2], // L3 - Aplicar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 7,
    ejerciciosOficiales: 4,
    pesoPAES: 2.0
  },
  {
    id: 'M1-PROB-02',
    codigo: 'M1-PROB-02',
    nombre: 'Estadística descriptiva',
    descripcion: 'Medidas de tendencia central y dispersión',
    nivel: 2,
    habilidad: 'Probabilidad y Estadística',
    materia: 'Matemática M1',
    bloomLevel: BLOOM_LEVELS[3], // L4 - Analizar
    dificultad: 'INTERMEDIATE',
    tiempoEstimado: 6,
    ejerciciosOficiales: 3,
    pesoPAES: 1.8
  }
];

// ========================================
// ESTRUCTURA OFICIAL DE PRUEBAS PAES 2025
// ========================================

export const PRUEBAS_PAES: PAESPrueba[] = [
  // PRUEBAS OBLIGATORIAS
  {
    id: 'comp_lectora',
    nombre: 'Competencia Lectora',
    tipo: 'obligatoria',
    duracion: 150,
    preguntas: 65,
    habilidades: [
      'Rastrear y Localizar',
      'Interpretar y Relacionar', 
      'Evaluar y Reflexionar'
    ],
    descripcion: 'Evalúa comprensión lectora, interpretación y análisis crítico de textos diversos',
    ponderacionMinima: 10,
    ponderacionMaxima: 30,
    nodos: NODOS_COMPETENCIA_LECTORA
  },
  {
    id: 'mat_m1',
    nombre: 'Competencia Matemática M1',
    tipo: 'obligatoria',
    duracion: 140,
    preguntas: 65,
    habilidades: [
      'Resolver Problemas',
      'Modelar',
      'Representar',
      'Argumentar'
    ],
    descripcion: 'Contenidos de 7° básico a 2° medio. Base para todas las carreras',
    ponderacionMinima: 10,
    ponderacionMaxima: 30,
    nodos: NODOS_MATEMATICA_M1
  },

  // PRUEBAS ELECTIVAS
  {
    id: 'mat_m2',
    nombre: 'Competencia Matemática M2',
    tipo: 'electiva',
    duracion: 140,
    preguntas: 55,
    habilidades: [
      'Álgebra Avanzada',
      'Geometría Analítica',
      'Cálculo Diferencial',
      'Probabilidad y Estadística'
    ],
    descripcion: 'Contenidos de 3° y 4° medio. Requerida para carreras STEM',
    carrerasRequeridas: [
      'Ingeniería Civil',
      'Ingeniería Comercial',
      'Medicina',
      'Odontología',
      'Física',
      'Matemática',
      'Química',
      'Ingeniería en Computación'
    ],
    ponderacionMinima: 15,
    ponderacionMaxima: 35,
    nodos: [] // Se agregarán los nodos específicos
  },
  {
    id: 'historia',
    nombre: 'Historia y Ciencias Sociales',
    tipo: 'electiva',
    duracion: 145,
    preguntas: 65,
    habilidades: [
      'Pensamiento Temporal',
      'Análisis de Fuentes',
      'Pensamiento Crítico',
      'Formación Ciudadana'
    ],
    descripcion: 'Historia de Chile, Historia Universal, Geografía y Formación Ciudadana',
    carrerasRequeridas: [
      'Derecho',
      'Periodismo',
      'Sociología',
      'Antropología',
      'Historia',
      'Geografía',
      'Pedagogía en Historia'
    ],
    ponderacionMinima: 10,
    ponderacionMaxima: 30,
    nodos: [] // Se agregarán los nodos específicos
  },
  {
    id: 'ciencias',
    nombre: 'Ciencias',
    tipo: 'electiva',
    duracion: 160,
    preguntas: 80,
    habilidades: [
      'Observar y Plantear',
      'Planificar',
      'Procesar',
      'Evaluar',
      'Comunicar'
    ],
    descripcion: 'Módulo común (obligatorio) + Módulo electivo (Biología, Física o Química)',
    carrerasRequeridas: [
      'Medicina',
      'Odontología',
      'Enfermería',
      'Química y Farmacia',
      'Biología',
      'Física',
      'Química',
      'Ingeniería Civil',
      'Ingeniería en Computación'
    ],
    ponderacionMinima: 15,
    ponderacionMaxima: 35,
    nodos: [] // Se agregarán los nodos específicos
  }
];

// ========================================
// CARRERAS Y PONDERACIONES OFICIALES
// ========================================

export const CARRERAS_PAES: CarreraPAES[] = [
  // MEDICINA
  {
    id: 'medicina',
    nombre: 'Medicina',
    area: 'Ciencias de la Salud',
    universidad: 'Universidades Chilenas',
    pruebasRequeridas: ['comp_lectora', 'mat_m1', 'mat_m2', 'ciencias'],
    ponderaciones: {
      'comp_lectora': 20,
      'mat_m1': 25,
      'mat_m2': 30,
      'ciencias': 25
    },
    puntajeMinimo: 750,
    puntajeMaximo: 850,
    vacantes: 1500
  },

  // INGENIERÍA CIVIL
  {
    id: 'ingenieria_civil',
    nombre: 'Ingeniería Civil',
    area: 'Ingeniería',
    universidad: 'Universidades Chilenas',
    pruebasRequeridas: ['comp_lectora', 'mat_m1', 'mat_m2'],
    ponderaciones: {
      'comp_lectora': 15,
      'mat_m1': 35,
      'mat_m2': 50
    },
    puntajeMinimo: 650,
    puntajeMaximo: 750,
    vacantes: 2000
  },

  // DERECHO
  {
    id: 'derecho',
    nombre: 'Derecho',
    area: 'Ciencias Sociales',
    universidad: 'Universidades Chilenas',
    pruebasRequeridas: ['comp_lectora', 'mat_m1', 'historia'],
    ponderaciones: {
      'comp_lectora': 40,
      'mat_m1': 20,
      'historia': 40
    },
    puntajeMinimo: 600,
    puntajeMaximo: 700,
    vacantes: 1800
  },

  // PERIODISMO
  {
    id: 'periodismo',
    nombre: 'Periodismo',
    area: 'Comunicación',
    universidad: 'Universidades Chilenas',
    pruebasRequeridas: ['comp_lectora', 'mat_m1', 'historia'],
    ponderaciones: {
      'comp_lectora': 50,
      'mat_m1': 20,
      'historia': 30
    },
    puntajeMinimo: 550,
    puntajeMaximo: 650,
    vacantes: 800
  },

  // PEDAGOGÍA
  {
    id: 'pedagogia',
    nombre: 'Pedagogía',
    area: 'Educación',
    universidad: 'Universidades Chilenas',
    pruebasRequeridas: ['comp_lectora', 'mat_m1'],
    ponderaciones: {
      'comp_lectora': 60,
      'mat_m1': 40
    },
    puntajeMinimo: 500,
    puntajeMaximo: 600,
    vacantes: 1200
  }
];

// ========================================
// DIAGNÓSTICOS PAES CON NODOS
// ========================================

export const DIAGNOSTICOS_PAES: DiagnosticoPAES[] = [
  // DIAGNÓSTICO INICIAL
  {
    id: 'diagnostico_inicial',
    nombre: 'Diagnóstico Inicial PAES',
    descripcion: 'Evaluación integral de todas las competencias básicas para identificar fortalezas y debilidades',
    pruebasIncluidas: ['comp_lectora', 'mat_m1'],
    duracionTotal: 290,
    preguntasTotal: 130,
    tipo: 'inicial',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  },

  // DIAGNÓSTICO ESPECÍFICO POR PRUEBA
  {
    id: 'diagnostico_lectora',
    nombre: 'Diagnóstico Competencia Lectora',
    descripcion: 'Evaluación específica de habilidades de comprensión lectora',
    pruebasIncluidas: ['comp_lectora'],
    duracionTotal: 150,
    preguntasTotal: 65,
    tipo: 'especifico',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04'
    ]
  },

  {
    id: 'diagnostico_matematica',
    nombre: 'Diagnóstico Matemática M1',
    descripcion: 'Evaluación específica de competencias matemáticas básicas',
    pruebasIncluidas: ['mat_m1'],
    duracionTotal: 140,
    preguntasTotal: 65,
    tipo: 'especifico',
    nodosEvaluados: [
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  },

  // DIAGNÓSTICO INTEGRAL
  {
    id: 'diagnostico_integral',
    nombre: 'Diagnóstico Integral PAES',
    descripcion: 'Evaluación completa de todas las pruebas PAES para identificar perfil académico',
    pruebasIncluidas: ['comp_lectora', 'mat_m1', 'mat_m2', 'historia', 'ciencias'],
    duracionTotal: 735,
    preguntasTotal: 330,
    tipo: 'integral',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  },

  // DIAGNÓSTICOS POR CARRERA
  {
    id: 'diagnostico_medicina',
    nombre: 'Diagnóstico Medicina',
    descripcion: 'Evaluación específica para postular a Medicina',
    pruebasIncluidas: ['comp_lectora', 'mat_m1', 'mat_m2', 'ciencias'],
    duracionTotal: 590,
    preguntasTotal: 265,
    tipo: 'carrera',
    carreraObjetivo: 'medicina',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  },

  {
    id: 'diagnostico_ingenieria',
    nombre: 'Diagnóstico Ingeniería',
    descripcion: 'Evaluación específica para carreras de Ingeniería',
    pruebasIncluidas: ['comp_lectora', 'mat_m1', 'mat_m2'],
    duracionTotal: 430,
    preguntasTotal: 185,
    tipo: 'carrera',
    carreraObjetivo: 'ingenieria_civil',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  },

  {
    id: 'diagnostico_derecho',
    nombre: 'Diagnóstico Derecho',
    descripcion: 'Evaluación específica para postular a Derecho',
    pruebasIncluidas: ['comp_lectora', 'mat_m1', 'historia'],
    duracionTotal: 435,
    preguntasTotal: 195,
    tipo: 'carrera',
    carreraObjetivo: 'derecho',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'CL-IR-01', 'CL-IR-02', 'CL-IR-03', 'CL-IR-04', 'CL-IR-05',
      'CL-ER-01', 'CL-ER-02', 'CL-ER-03', 'CL-ER-04',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02', 'M1-ALG-03',
      'M1-GEO-01', 'M1-GEO-02', 'M1-PROB-01', 'M1-PROB-02'
    ]
  }
];

// ========================================
// FUNCIONES DE UTILIDAD MEJORADAS
// ========================================

export const getPruebaById = (id: string): PAESPrueba | undefined => {
  return PRUEBAS_PAES.find(prueba => prueba.id === id);
};

export const getCarreraById = (id: string): CarreraPAES | undefined => {
  return CARRERAS_PAES.find(carrera => carrera.id === id);
};

export const getDiagnosticoById = (id: string): DiagnosticoPAES | undefined => {
  return DIAGNOSTICOS_PAES.find(diagnostico => diagnostico.id === id);
};

export const getNodoById = (id: string): PAESNodo | undefined => {
  const todosLosNodos = [
    ...NODOS_COMPETENCIA_LECTORA,
    ...NODOS_MATEMATICA_M1
  ];
  return todosLosNodos.find(nodo => nodo.id === id);
};

export const getNodosPorPrueba = (pruebaId: string): PAESNodo[] => {
  const prueba = getPruebaById(pruebaId);
  return prueba?.nodos || [];
};

export const getNodosPorBloomLevel = (bloomLevel: string): PAESNodo[] => {
  const todosLosNodos = [
    ...NODOS_COMPETENCIA_LECTORA,
    ...NODOS_MATEMATICA_M1
  ];
  return todosLosNodos.filter(nodo => nodo.bloomLevel.id === bloomLevel);
};

export const getNodosPorDificultad = (dificultad: string): PAESNodo[] => {
  const todosLosNodos = [
    ...NODOS_COMPETENCIA_LECTORA,
    ...NODOS_MATEMATICA_M1
  ];
  return todosLosNodos.filter(nodo => nodo.dificultad === dificultad);
};

export const getPruebasObligatorias = (): PAESPrueba[] => {
  return PRUEBAS_PAES.filter(prueba => prueba.tipo === 'obligatoria');
};

export const getPruebasElectivas = (): PAESPrueba[] => {
  return PRUEBAS_PAES.filter(prueba => prueba.tipo === 'electiva');
};

export const getCarrerasPorArea = (area: string): CarreraPAES[] => {
  return CARRERAS_PAES.filter(carrera => carrera.area === area);
};

export const getDiagnosticosPorTipo = (tipo: DiagnosticoPAES['tipo']): DiagnosticoPAES[] => {
  return DIAGNOSTICOS_PAES.filter(diagnostico => diagnostico.tipo === tipo);
};

export const calcularPuntajePonderado = (
  puntajes: Record<string, number>,
  ponderaciones: Record<string, number>
): number => {
  let puntajeTotal = 0;
  let ponderacionTotal = 0;

  Object.keys(puntajes).forEach(prueba => {
    const puntaje = puntajes[prueba];
    const ponderacion = ponderaciones[prueba] || 0;
    puntajeTotal += puntaje * ponderacion;
    ponderacionTotal += ponderacion;
  });

  return ponderacionTotal > 0 ? puntajeTotal / ponderacionTotal : 0;
};

export const generarPlanEstudio = (
  carreraObjetivo: string,
  puntajesActuales: Record<string, number>
): {
  pruebasPrioritarias: string[];
  metasPuntaje: Record<string, number>;
  tiempoEstimado: number;
  nodosPrioritarios: PAESNodo[];
} => {
  const carrera = getCarreraById(carreraObjetivo);
  if (!carrera) {
    throw new Error(`Carrera ${carreraObjetivo} no encontrada`);
  }

  // Calcular diferencias de puntaje
  const diferencias = carrera.pruebasRequeridas.map(prueba => ({
    prueba,
    diferencia: (carrera.ponderaciones[prueba] || 0) - (puntajesActuales[prueba] || 0)
  }));

  // Ordenar por mayor diferencia (mayor necesidad de mejora)
  diferencias.sort((a, b) => b.diferencia - a.diferencia);

  const pruebasPrioritarias = diferencias.map(d => d.prueba);
  
  // Establecer metas de puntaje
  const metasPuntaje: Record<string, number> = {};
  carrera.pruebasRequeridas.forEach(prueba => {
    const puntajeActual = puntajesActuales[prueba] || 0;
    const meta = Math.min(850, puntajeActual + 50); // Mejorar 50 puntos por prueba
    metasPuntaje[prueba] = meta;
  });

  // Obtener nodos prioritarios basados en las pruebas prioritarias
  const nodosPrioritarios: PAESNodo[] = [];
  pruebasPrioritarias.forEach(pruebaId => {
    const nodosPrueba = getNodosPorPrueba(pruebaId);
    // Priorizar nodos de mayor dificultad y peso PAES
    const nodosOrdenados = nodosPrueba.sort((a, b) => {
      if (a.dificultad !== b.dificultad) {
        const dificultadOrder = { 'ADVANCED': 3, 'INTERMEDIATE': 2, 'BASIC': 1 };
        return dificultadOrder[b.dificultad] - dificultadOrder[a.dificultad];
      }
      return b.pesoPAES - a.pesoPAES;
    });
    nodosPrioritarios.push(...nodosOrdenados.slice(0, 5)); // Top 5 nodos por prueba
  });

  // Calcular tiempo estimado (horas de estudio)
  const tiempoEstimado = carrera.pruebasRequeridas.length * 40; // 40 horas por prueba

  return {
    pruebasPrioritarias,
    metasPuntaje,
    tiempoEstimado,
    nodosPrioritarios
  };
};

export const generarDiagnosticoPersonalizado = (
  carreraObjetivo?: string,
  nivelEstudiante: 'basico' | 'intermedio' | 'avanzado' = 'intermedio'
): DiagnosticoPAES => {
  if (carreraObjetivo) {
    const carrera = getCarreraById(carreraObjetivo);
    if (carrera) {
      return {
        id: `diagnostico_${carreraObjetivo}_${nivelEstudiante}`,
        nombre: `Diagnóstico ${carrera.nombre} - ${nivelEstudiante}`,
        descripcion: `Evaluación personalizada para ${carrera.nombre} adaptada al nivel ${nivelEstudiante}`,
        pruebasIncluidas: carrera.pruebasRequeridas,
        duracionTotal: carrera.pruebasRequeridas.length * 140,
        preguntasTotal: carrera.pruebasRequeridas.length * 60,
        tipo: 'carrera',
        carreraObjetivo,
        nodosEvaluados: []
      };
    }
  }

  // Diagnóstico general basado en nivel
  return {
    id: `diagnostico_general_${nivelEstudiante}`,
    nombre: `Diagnóstico General - ${nivelEstudiante}`,
    descripcion: `Evaluación integral adaptada al nivel ${nivelEstudiante}`,
    pruebasIncluidas: ['comp_lectora', 'mat_m1'],
    duracionTotal: 290,
    preguntasTotal: 130,
    tipo: 'inicial',
    nodosEvaluados: [
      'CL-RL-01', 'CL-RL-02', 'CL-RL-03', 'CL-RL-04', 'CL-RL-05',
      'M1-NUM-01', 'M1-NUM-02', 'M1-ALG-01', 'M1-ALG-02'
    ]
  };
};
