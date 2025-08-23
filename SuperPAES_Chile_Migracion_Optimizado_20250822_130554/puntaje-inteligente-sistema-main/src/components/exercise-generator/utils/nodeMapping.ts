/* eslint-disable react-refresh/only-export-components */
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';


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
    friendlyName: 'Lectura Literal BÃ¡sica',
    description: 'Identificar informaciÃ³n explÃ­cita en textos simples',
    category: 'ComprensiÃ³n Lectora',
    bloomLevel: 'Recordar',
    icon: 'ðŸ“–'
  },
  'CL-RL-02': {
    code: 'CL-RL-02',
    friendlyName: 'Datos y Hechos',
    description: 'Extraer datos especÃ­ficos y hechos del texto',
    category: 'ComprensiÃ³n Lectora',
    bloomLevel: 'Recordar',
    icon: 'ðŸ“Š'
  },
  'CL-IR-01': {
    code: 'CL-IR-01',
    friendlyName: 'Inferencias BÃ¡sicas',
    description: 'Realizar inferencias simples a partir del texto',
    category: 'InterpretaciÃ³n',
    bloomLevel: 'Comprender',
    icon: 'ðŸ§ '
  },
  'CL-IR-02': {
    code: 'CL-IR-02',
    friendlyName: 'Relaciones ImplÃ­citas',
    description: 'Identificar relaciones no explÃ­citas entre ideas',
    category: 'InterpretaciÃ³n',
    bloomLevel: 'Comprender',
    icon: 'ðŸ”—'
  },
  'CL-ER-01': {
    code: 'CL-ER-01',
    friendlyName: 'EvaluaciÃ³n CrÃ­tica',
    description: 'Evaluar la validez y calidad de argumentos',
    category: 'EvaluaciÃ³n',
    bloomLevel: 'Evaluar',
    icon: 'âš–ï¸'
  },

  // MatemÃ¡tica M1
  'M1-NUM-01': {
    code: 'M1-NUM-01',
    friendlyName: 'NÃºmeros Reales',
    description: 'Operaciones bÃ¡sicas con nÃºmeros reales',
    category: 'NÃºmeros',
    bloomLevel: 'Aplicar',
    icon: 'ðŸ”¢'
  },
  'M1-ALG-01': {
    code: 'M1-ALG-01',
    friendlyName: 'Ecuaciones Lineales',
    description: 'Resolver ecuaciones de primer grado',
    category: 'Ãlgebra',
    bloomLevel: 'Aplicar',
    icon: 'ðŸ“'
  },
  'M1-GEO-01': {
    code: 'M1-GEO-01',
    friendlyName: 'GeometrÃ­a Plana',
    description: 'Calcular Ã¡reas y perÃ­metros de figuras bÃ¡sicas',
    category: 'GeometrÃ­a',
    bloomLevel: 'Aplicar',
    icon: 'ðŸ“'
  },
  'M1-ALG-02': {
    code: 'M1-ALG-02',
    friendlyName: 'Sistemas de Ecuaciones',
    description: 'Resolver sistemas de ecuaciones lineales',
    category: 'Ãlgebra',
    bloomLevel: 'Analizar',
    icon: 'âš¡'
  },

  // MatemÃ¡tica M2
  'M2-ALG-01': {
    code: 'M2-ALG-01',
    friendlyName: 'Funciones CuadrÃ¡ticas',
    description: 'AnÃ¡lisis de funciones de segundo grado',
    category: 'Funciones',
    bloomLevel: 'Analizar',
    icon: 'ðŸ“ˆ'
  },
  'M2-CALC-01': {
    code: 'M2-CALC-01',
    friendlyName: 'LÃ­mites y Continuidad',
    description: 'Conceptos bÃ¡sicos de cÃ¡lculo diferencial',
    category: 'CÃ¡lculo',
    bloomLevel: 'Comprender',
    icon: 'âˆž'
  },

  // Historia
  'HST-37': {
    code: 'HST-37',
    friendlyName: 'Chile Republicano',
    description: 'FormaciÃ³n del Estado chileno en el siglo XIX',
    category: 'Historia Nacional',
    bloomLevel: 'Recordar',
    icon: 'ðŸ›ï¸'
  },
  'HST-20': {
    code: 'HST-20',
    friendlyName: 'Independencia',
    description: 'Proceso de independencia de Chile',
    category: 'Historia Nacional',
    bloomLevel: 'Comprender',
    icon: 'ðŸ—½'
  },
  'FC-01': {
    code: 'FC-01',
    friendlyName: 'Derechos Fundamentales',
    description: 'Derechos humanos y constitucionales',
    category: 'FormaciÃ³n Ciudadana',
    bloomLevel: 'Comprender',
    icon: 'âš–ï¸'
  },

  // Ciencias
  'CC-BIO-01': {
    code: 'CC-BIO-01',
    friendlyName: 'CÃ©lula y OrganizaciÃ³n',
    description: 'Estructura y funciÃ³n celular bÃ¡sica',
    category: 'BiologÃ­a',
    bloomLevel: 'Recordar',
    icon: 'ðŸ”¬'
  },
  'CC-FIS-01': {
    code: 'CC-FIS-01',
    friendlyName: 'MecÃ¡nica BÃ¡sica',
    description: 'Conceptos fundamentales de fuerza y movimiento',
    category: 'FÃ­sica',
    bloomLevel: 'Comprender',
    icon: 'âš½'
  },
  'CC-QUIM-01': {
    code: 'CC-QUIM-01',
    friendlyName: 'Estructura AtÃ³mica',
    description: 'Modelos atÃ³micos y tabla periÃ³dica',
    category: 'QuÃ­mica',
    bloomLevel: 'Recordar',
    icon: 'âš›ï¸'
  }
};

export const getNodeMapping = (code: string): NodeMapping => {
  return NODE_MAPPINGS[code] || {
    code,
    friendlyName: code,
    description: 'Nodo de aprendizaje PAES',
    category: 'General',
    bloomLevel: 'Aplicar',
    icon: 'ðŸ“š'
  };
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'ComprensiÃ³n Lectora': 'bg-blue-100 text-blue-800',
    'InterpretaciÃ³n': 'bg-purple-100 text-purple-800',
    'EvaluaciÃ³n': 'bg-red-100 text-red-800',
    'NÃºmeros': 'bg-green-100 text-green-800',
    'Ãlgebra': 'bg-yellow-100 text-yellow-800',
    'GeometrÃ­a': 'bg-orange-100 text-orange-800',
    'Funciones': 'bg-pink-100 text-pink-800',
    'CÃ¡lculo': 'bg-indigo-100 text-indigo-800',
    'Historia Nacional': 'bg-amber-100 text-amber-800',
    'FormaciÃ³n Ciudadana': 'bg-teal-100 text-teal-800',
    'BiologÃ­a': 'bg-emerald-100 text-emerald-800',
    'FÃ­sica': 'bg-cyan-100 text-cyan-800',
    'QuÃ­mica': 'bg-violet-100 text-violet-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};


