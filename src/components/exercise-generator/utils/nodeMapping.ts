
export interface NodeMapping {
  code: string;
  friendlyName: string;
  description: string;
  category: string;
  bloomLevel: string;
  icon: string;
}

export const NODE_MAPPINGS: Record<string, NodeMapping> = {
  // Competencia Lectora
  'CL-RL-01': {
    code: 'CL-RL-01',
    friendlyName: 'Lectura Literal Básica',
    description: 'Identificar información explícita en textos simples',
    category: 'Comprensión Lectora',
    bloomLevel: 'Recordar',
    icon: '📖'
  },
  'CL-RL-02': {
    code: 'CL-RL-02',
    friendlyName: 'Datos y Hechos',
    description: 'Extraer datos específicos y hechos del texto',
    category: 'Comprensión Lectora',
    bloomLevel: 'Recordar',
    icon: '📊'
  },
  'CL-IR-01': {
    code: 'CL-IR-01',
    friendlyName: 'Inferencias Básicas',
    description: 'Realizar inferencias simples a partir del texto',
    category: 'Interpretación',
    bloomLevel: 'Comprender',
    icon: '🧠'
  },
  'CL-IR-02': {
    code: 'CL-IR-02',
    friendlyName: 'Relaciones Implícitas',
    description: 'Identificar relaciones no explícitas entre ideas',
    category: 'Interpretación',
    bloomLevel: 'Comprender',
    icon: '🔗'
  },
  'CL-ER-01': {
    code: 'CL-ER-01',
    friendlyName: 'Evaluación Crítica',
    description: 'Evaluar la validez y calidad de argumentos',
    category: 'Evaluación',
    bloomLevel: 'Evaluar',
    icon: '⚖️'
  },

  // Matemática M1
  'M1-NUM-01': {
    code: 'M1-NUM-01',
    friendlyName: 'Números Reales',
    description: 'Operaciones básicas con números reales',
    category: 'Números',
    bloomLevel: 'Aplicar',
    icon: '🔢'
  },
  'M1-ALG-01': {
    code: 'M1-ALG-01',
    friendlyName: 'Ecuaciones Lineales',
    description: 'Resolver ecuaciones de primer grado',
    category: 'Álgebra',
    bloomLevel: 'Aplicar',
    icon: '📐'
  },
  'M1-GEO-01': {
    code: 'M1-GEO-01',
    friendlyName: 'Geometría Plana',
    description: 'Calcular áreas y perímetros de figuras básicas',
    category: 'Geometría',
    bloomLevel: 'Aplicar',
    icon: '📏'
  },
  'M1-ALG-02': {
    code: 'M1-ALG-02',
    friendlyName: 'Sistemas de Ecuaciones',
    description: 'Resolver sistemas de ecuaciones lineales',
    category: 'Álgebra',
    bloomLevel: 'Analizar',
    icon: '⚡'
  },

  // Matemática M2
  'M2-ALG-01': {
    code: 'M2-ALG-01',
    friendlyName: 'Funciones Cuadráticas',
    description: 'Análisis de funciones de segundo grado',
    category: 'Funciones',
    bloomLevel: 'Analizar',
    icon: '📈'
  },
  'M2-CALC-01': {
    code: 'M2-CALC-01',
    friendlyName: 'Límites y Continuidad',
    description: 'Conceptos básicos de cálculo diferencial',
    category: 'Cálculo',
    bloomLevel: 'Comprender',
    icon: '∞'
  },

  // Historia
  'HST-37': {
    code: 'HST-37',
    friendlyName: 'Chile Republicano',
    description: 'Formación del Estado chileno en el siglo XIX',
    category: 'Historia Nacional',
    bloomLevel: 'Recordar',
    icon: '🏛️'
  },
  'HST-20': {
    code: 'HST-20',
    friendlyName: 'Independencia',
    description: 'Proceso de independencia de Chile',
    category: 'Historia Nacional',
    bloomLevel: 'Comprender',
    icon: '🗽'
  },
  'FC-01': {
    code: 'FC-01',
    friendlyName: 'Derechos Fundamentales',
    description: 'Derechos humanos y constitucionales',
    category: 'Formación Ciudadana',
    bloomLevel: 'Comprender',
    icon: '⚖️'
  },

  // Ciencias
  'CC-BIO-01': {
    code: 'CC-BIO-01',
    friendlyName: 'Célula y Organización',
    description: 'Estructura y función celular básica',
    category: 'Biología',
    bloomLevel: 'Recordar',
    icon: '🔬'
  },
  'CC-FIS-01': {
    code: 'CC-FIS-01',
    friendlyName: 'Mecánica Básica',
    description: 'Conceptos fundamentales de fuerza y movimiento',
    category: 'Física',
    bloomLevel: 'Comprender',
    icon: '⚽'
  },
  'CC-QUIM-01': {
    code: 'CC-QUIM-01',
    friendlyName: 'Estructura Atómica',
    description: 'Modelos atómicos y tabla periódica',
    category: 'Química',
    bloomLevel: 'Recordar',
    icon: '⚛️'
  }
};

export const getNodeMapping = (code: string): NodeMapping => {
  return NODE_MAPPINGS[code] || {
    code,
    friendlyName: code,
    description: 'Nodo de aprendizaje PAES',
    category: 'General',
    bloomLevel: 'Aplicar',
    icon: '📚'
  };
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Comprensión Lectora': 'bg-blue-100 text-blue-800',
    'Interpretación': 'bg-purple-100 text-purple-800',
    'Evaluación': 'bg-red-100 text-red-800',
    'Números': 'bg-green-100 text-green-800',
    'Álgebra': 'bg-yellow-100 text-yellow-800',
    'Geometría': 'bg-orange-100 text-orange-800',
    'Funciones': 'bg-pink-100 text-pink-800',
    'Cálculo': 'bg-indigo-100 text-indigo-800',
    'Historia Nacional': 'bg-amber-100 text-amber-800',
    'Formación Ciudadana': 'bg-teal-100 text-teal-800',
    'Biología': 'bg-emerald-100 text-emerald-800',
    'Física': 'bg-cyan-100 text-cyan-800',
    'Química': 'bg-violet-100 text-violet-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};
