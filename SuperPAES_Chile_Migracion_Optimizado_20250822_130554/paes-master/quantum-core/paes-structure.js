#!/usr/bin/env node

/**
 * 📚 PAES STRUCTURE - Estructura Oficial PAES
 * Respetando Matemáticas 1 y 2, usando nodos como backbone y Bloom para jerarquizar
 * Basado en el esquema SQL de Supabase
 */

export const PAES_STRUCTURE = {
  COMPETENCIA_LECTORA: {
    name: 'Competencia Lectora',
    skills: ['Localizar', 'Interpretar', 'Evaluar'],
    subSkills: {
      'Localizar': ['Información explícita', 'Información implícita'],
      'Interpretar': ['Sentido global', 'Sentido local'],
      'Evaluar': ['Contenido', 'Forma']
    },
    bloomMapping: {
      'Información explícita': 'L1',
      'Información implícita': 'L2',
      'Sentido global': 'L2',
      'Sentido local': 'L3',
      'Contenido': 'L4',
      'Forma': 'L5'
    }
  },
  
  MATEMATICA_M1: {
    name: 'Matemática M1',
    skills: ['Números', 'Álgebra', 'Funciones', 'Geometría'],
    subSkills: {
      'Números': ['Enteros', 'Racionales', 'Reales'],
      'Álgebra': ['Básica', 'Ecuaciones', 'Sistemas'],
      'Funciones': ['Lineales', 'Cuadráticas', 'Exponenciales'],
      'Geometría': ['Plana', 'Analítica', 'Trigonometría']
    },
    bloomMapping: {
      'Enteros': 'L1',
      'Racionales': 'L2',
      'Reales': 'L3',
      'Básica': 'L2',
      'Ecuaciones': 'L3',
      'Sistemas': 'L4',
      'Lineales': 'L2',
      'Cuadráticas': 'L3',
      'Exponenciales': 'L4',
      'Plana': 'L2',
      'Analítica': 'L3',
      'Trigonometría': 'L4'
    }
  },
  
  MATEMATICA_M2: {
    name: 'Matemática M2',
    skills: ['Probabilidad', 'Estadística', 'Cálculo', 'Geometría Avanzada'],
    subSkills: {
      'Probabilidad': ['Eventos', 'Distribuciones', 'Teoremas'],
      'Estadística': ['Descriptiva', 'Inferencial', 'Regresión'],
      'Cálculo': ['Límites', 'Derivadas', 'Integrales'],
      'Geometría Avanzada': ['Vectores', 'Cónicas', 'Espacial']
    },
    bloomMapping: {
      'Eventos': 'L2',
      'Distribuciones': 'L3',
      'Teoremas': 'L4',
      'Descriptiva': 'L2',
      'Inferencial': 'L3',
      'Regresión': 'L4',
      'Límites': 'L3',
      'Derivadas': 'L4',
      'Integrales': 'L5',
      'Vectores': 'L3',
      'Cónicas': 'L4',
      'Espacial': 'L5'
    }
  },
  
  CIENCIAS: {
    name: 'Ciencias',
    skills: ['Biología', 'Química', 'Física'],
    subSkills: {
      'Biología': ['Celular', 'Genética', 'Evolución'],
      'Química': ['Orgánica', 'Inorgánica', 'Fisicoquímica'],
      'Física': ['Mecánica', 'Termodinámica', 'Electromagnetismo']
    },
    bloomMapping: {
      'Celular': 'L2',
      'Genética': 'L3',
      'Evolución': 'L4',
      'Orgánica': 'L3',
      'Inorgánica': 'L2',
      'Fisicoquímica': 'L4',
      'Mecánica': 'L2',
      'Termodinámica': 'L3',
      'Electromagnetismo': 'L4'
    }
  },
  
  HISTORIA: {
    name: 'Historia',
    skills: ['Historia Universal', 'Historia de Chile'],
    subSkills: {
      'Historia Universal': ['Antigua', 'Medieval', 'Contemporánea'],
      'Historia de Chile': ['Colonial', 'Independencia', 'República']
    },
    bloomMapping: {
      'Antigua': 'L2',
      'Medieval': 'L3',
      'Contemporánea': 'L4',
      'Colonial': 'L2',
      'Independencia': 'L3',
      'República': 'L4'
    }
  }
};

export const BLOOM_TAXONOMY = {
  L1: {
    name: 'Recordar',
    description: 'Memoria y reconocimiento',
    color: '#FF6B6B',
    verbs: ['identificar', 'listar', 'definir', 'recordar', 'reconocer'],
    examples: ['Definir conceptos básicos', 'Identificar elementos', 'Listar características']
  },
  L2: {
    name: 'Comprender',
    description: 'Comprensión básica',
    color: '#4ECDC4',
    verbs: ['explicar', 'describir', 'interpretar', 'comparar', 'resumir'],
    examples: ['Explicar procesos', 'Describir fenómenos', 'Interpretar datos']
  },
  L3: {
    name: 'Aplicar',
    description: 'Aplicación práctica',
    color: '#45B7D1',
    verbs: ['aplicar', 'resolver', 'calcular', 'implementar', 'ejecutar'],
    examples: ['Resolver problemas', 'Aplicar fórmulas', 'Calcular resultados']
  },
  L4: {
    name: 'Analizar',
    description: 'Análisis crítico',
    color: '#96CEB4',
    verbs: ['analizar', 'comparar', 'contrastar', 'examinar', 'investigar'],
    examples: ['Analizar estructuras', 'Comparar métodos', 'Examinar relaciones']
  },
  L5: {
    name: 'Evaluar',
    description: 'Evaluación y juicio',
    color: '#FFEAA7',
    verbs: ['evaluar', 'juzgar', 'criticar', 'valorar', 'determinar'],
    examples: ['Evaluar argumentos', 'Juzgar calidad', 'Valorar resultados']
  },
  L6: {
    name: 'Crear',
    description: 'Creación e innovación',
    color: '#DDA0DD',
    verbs: ['crear', 'diseñar', 'desarrollar', 'construir', 'producir'],
    examples: ['Crear soluciones', 'Diseñar modelos', 'Desarrollar teorías']
  }
};

export class PAESStructureManager {
  constructor() {
    this.structure = PAES_STRUCTURE;
    this.bloom = BLOOM_TAXONOMY;
  }

  // Obtener estructura completa
  getStructure() {
    return this.structure;
  }

  // Obtener estructura por tipo de prueba
  getTestTypeStructure(testType) {
    return this.structure[testType];
  }

  // Obtener habilidades por tipo de prueba
  getSkills(testType) {
    const testStructure = this.structure[testType];
    return testStructure ? testStructure.skills : [];
  }

  // Obtener sub-habilidades por habilidad
  getSubSkills(testType, skill) {
    const testStructure = this.structure[testType];
    if (!testStructure) return [];
    
    return testStructure.subSkills[skill] || [];
  }

  // Obtener nivel Bloom por sub-habilidad
  getBloomLevel(testType, subSkill) {
    const testStructure = this.structure[testType];
    if (!testStructure) return 'L1';
    
    return testStructure.bloomMapping[subSkill] || 'L1';
  }

  // Validar estructura
  validateStructure(testType, skill, subSkill) {
    const testStructure = this.structure[testType];
    if (!testStructure) return false;
    
    if (!testStructure.skills.includes(skill)) return false;
    
    const subSkills = testStructure.subSkills[skill];
    if (!subSkills || !subSkills.includes(subSkill)) return false;
    
    return true;
  }

  // Crear nodo de aprendizaje
  createLearningNode(testType, skill, subSkill, data = {}) {
    if (!this.validateStructure(testType, skill, subSkill)) {
      throw new Error(`Estructura inválida: ${testType} - ${skill} - ${subSkill}`);
    }

    const bloomLevel = this.getBloomLevel(testType, subSkill);
    const testStructure = this.getTestTypeStructure(testType);

    return {
      id: `node-${testType}-${skill}-${subSkill}`,
      testType,
      skill,
      subSkill,
      bloomLevel,
      name: `${testStructure.name} - ${skill} - ${subSkill}`,
      description: `Nodo de aprendizaje para ${subSkill} en ${skill}`,
      difficulty: this.getDifficultyByBloom(bloomLevel),
      position: this.getPosition(testType, skill, subSkill),
      prerequisites: this.getPrerequisites(testType, skill, subSkill),
      learningObjectives: this.getLearningObjectives(testType, skill, subSkill),
      estimatedTimeMinutes: this.getEstimatedTime(bloomLevel),
      ...data
    };
  }

  // Obtener dificultad por nivel Bloom
  getDifficultyByBloom(bloomLevel) {
    const difficultyMap = {
      'L1': 'principiante',
      'L2': 'intermedio',
      'L3': 'intermedio',
      'L4': 'avanzado',
      'L5': 'avanzado',
      'L6': 'experto'
    };
    return difficultyMap[bloomLevel] || 'intermedio';
  }

  // Obtener posición en la jerarquía
  getPosition(testType, skill, subSkill) {
    const testStructure = this.structure[testType];
    if (!testStructure) return 0;
    
    const skillIndex = testStructure.skills.indexOf(skill);
    const subSkillIndex = testStructure.subSkills[skill]?.indexOf(subSkill) || 0;
    
    return (skillIndex * 100) + subSkillIndex;
  }

  // Obtener prerrequisitos
  getPrerequisites(testType, skill, subSkill) {
    const prerequisites = [];
    const testStructure = this.structure[testType];
    
    if (!testStructure) return prerequisites;
    
    const skillIndex = testStructure.skills.indexOf(skill);
    const subSkillIndex = testStructure.subSkills[skill]?.indexOf(subSkill) || 0;
    
    // Prerrequisito: habilidad anterior
    if (skillIndex > 0) {
      const prevSkill = testStructure.skills[skillIndex - 1];
      const prevSubSkills = testStructure.subSkills[prevSkill];
      if (prevSubSkills && prevSubSkills.length > 0) {
        prerequisites.push(`node-${testType}-${prevSkill}-${prevSubSkills[prevSubSkills.length - 1]}`);
      }
    }
    
    // Prerrequisito: sub-habilidad anterior en la misma habilidad
    if (subSkillIndex > 0) {
      const prevSubSkill = testStructure.subSkills[skill][subSkillIndex - 1];
      prerequisites.push(`node-${testType}-${skill}-${prevSubSkill}`);
    }
    
    return prerequisites;
  }

  // Obtener objetivos de aprendizaje
  getLearningObjectives(testType, skill, subSkill) {
    const bloomLevel = this.getBloomLevel(testType, subSkill);
    const bloomInfo = this.bloom[bloomLevel];
    
    return [
      `${bloomInfo.verbs[0]} ${subSkill.toLowerCase()}`,
      `${bloomInfo.verbs[1]} conceptos relacionados con ${subSkill}`,
      `${bloomInfo.verbs[2]} problemas de ${skill}`
    ];
  }

  // Obtener tiempo estimado por nivel Bloom
  getEstimatedTime(bloomLevel) {
    const timeMap = {
      'L1': 20,
      'L2': 30,
      'L3': 40,
      'L4': 50,
      'L5': 60,
      'L6': 75
    };
    return timeMap[bloomLevel] || 30;
  }

  // Generar estructura completa de nodos
  generateCompleteNodeStructure() {
    const nodes = [];
    
    for (const [testType, testStructure] of Object.entries(this.structure)) {
      for (const skill of testStructure.skills) {
        for (const subSkill of testStructure.subSkills[skill]) {
          const node = this.createLearningNode(testType, skill, subSkill);
          nodes.push(node);
        }
      }
    }
    
    return nodes.sort((a, b) => a.position - b.position);
  }

  // Obtener progreso por estructura
  getProgressByStructure(userProgress) {
    const progress = {};
    
    for (const testType of Object.keys(this.structure)) {
      progress[testType] = {};
      
      for (const skill of this.getSkills(testType)) {
        progress[testType][skill] = {};
        
        for (const subSkill of this.getSubSkills(testType, skill)) {
          const nodeId = `node-${testType}-${skill}-${subSkill}`;
          progress[testType][skill][subSkill] = userProgress[nodeId] || {
            status: 'not_started',
            progress: 0,
            bloomLevel: this.getBloomLevel(testType, subSkill)
          };
        }
      }
    }
    
    return progress;
  }
}

export default PAESStructureManager;
