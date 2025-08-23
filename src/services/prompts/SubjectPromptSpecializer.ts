
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

export interface PromptTemplate {
  systemPrompt: string;
  userPrompt: string;
  validationCriteria: string[];
  expectedFields: string[];
}

/**
 * Especialista en Prompts por Materia PAES
 * Genera prompts optimizados según la prueba y habilidad específica
 */
export class SubjectPromptSpecializer {
  private static instance: SubjectPromptSpecializer;
  
  static getInstance(): SubjectPromptSpecializer {
    if (!SubjectPromptSpecializer.instance) {
      SubjectPromptSpecializer.instance = new SubjectPromptSpecializer();
    }
    return SubjectPromptSpecializer.instance;
  }

  /**
   * Genera prompt especializado para una materia y habilidad específica
   */
  generateSpecializedPrompt(
    prueba: TPAESPrueba, 
    skill: TPAESHabilidad, 
    difficulty: string,
    context?: any
  ): PromptTemplate {
    const baseTemplate = this.getBaseTemplate();
    const subjectSpecialization = this.getSubjectSpecialization(prueba);
    const skillSpecialization = this.getSkillSpecialization(skill);
    const difficultyAdjustment = this.getDifficultyAdjustment(difficulty);
    
    return {
      systemPrompt: this.buildSystemPrompt(baseTemplate, subjectSpecialization, skillSpecialization),
      userPrompt: this.buildUserPrompt(prueba, skill, difficulty, difficultyAdjustment, context),
      validationCriteria: this.getValidationCriteria(prueba, skill),
      expectedFields: this.getExpectedFields(prueba)
    };
  }

  /**
   * Template base para todos los ejercicios PAES
   */
  private getBaseTemplate() {
    return {
      role: 'Eres un especialista en la creación de ejercicios PAES de alta calidad.',
      standards: 'Todos los ejercicios deben cumplir estándares oficiales PAES/DEMRE.',
      format: 'Responde ÚNICAMENTE con JSON válido, sin texto adicional.',
      structure: `{
  "question": "Pregunta completa con contexto si es necesario",
  "options": ["A) Opción 1", "B) Opción 2", "C) Opción 3", "D) Opción 4"],
  "correctAnswer": "A) Opción 1",
  "explanation": "Explicación detallada de por qué es correcta",
  "skill": "habilidad_evaluada",
  "difficulty": "dificultad_del_ejercicio",
  "metadata": {
    "source": "ai_generated",
    "prueba": "materia_correspondiente",
    "conceptos": ["concepto1", "concepto2"]
  }
}`
    };
  }

  /**
   * Especialización por materia
   */
  private getSubjectSpecialization(prueba: TPAESPrueba) {
    const specializations = {
      'COMPETENCIA_LECTORA': {
        focus: 'comprensión lectora y análisis textual',
        requirements: [
          'SIEMPRE incluir un texto de contexto antes de la pregunta',
          'Evaluar comprensión, interpretación, análisis o evaluación crítica',
          'Texto entre 100-400 palabras según dificultad',
          'Preguntas sobre idea principal, inferencias, propósito comunicativo, o análisis crítico'
        ],
        structure: 'Texto de contexto + salto de línea + pregunta específica',
        concepts: ['comprensión literal', 'inferencias', 'propósito comunicativo', 'análisis crítico', 'estructura textual']
      },
      'MATEMATICA_1': {
        focus: 'números, álgebra básica, geometría y datos',
        requirements: [
          'Incluir elementos numéricos, algebraicos o geométricos',
          'Usar notación matemática correcta',
          'Proporcionar datos suficientes para resolver',
          'Evaluar procedimientos de cálculo y razonamiento'
        ],
        structure: 'Planteamiento del problema + datos + pregunta',
        concepts: ['números reales', 'ecuaciones lineales', 'geometría plana', 'estadística descriptiva', 'proporcionalidad']
      },
      'MATEMATICA_2': {
        focus: 'álgebra avanzada, funciones, probabilidad y estadística',
        requirements: [
          'Incluir funciones, derivadas, límites o probabilidades',
          'Usar notación matemática avanzada',
          'Evaluar razonamiento matemático complejo',
          'Incluir gráficos o representaciones cuando sea pertinente'
        ],
        structure: 'Contexto matemático + problema específico + pregunta',
        concepts: ['funciones', 'límites', 'derivadas', 'probabilidad condicional', 'distribuciones']
      },
      'CIENCIAS': {
        focus: 'biología, física, química y método científico',
        requirements: [
          'Incluir conceptos científicos específicos',
          'Contextualizar en situaciones reales o experimentos',
          'Evaluar comprensión de procesos científicos',
          'Usar terminología científica precisa'
        ],
        structure: 'Contexto científico + situación específica + pregunta',
        concepts: ['célula', 'energía', 'reacciones químicas', 'ecosistemas', 'método científico']
      },
      'HISTORIA': {
        focus: 'procesos históricos, análisis temporal y multicausal',
        requirements: [
          'Incluir contexto histórico específico',
          'Evaluar pensamiento temporal y análisis causal',
          'Referenciar fuentes históricas cuando sea apropiado',
          'Conectar pasado con presente cuando sea relevante'
        ],
        structure: 'Contexto histórico + situación específica + pregunta analítica',
        concepts: ['proceso histórico', 'multicausalidad', 'fuentes históricas', 'pensamiento temporal', 'continuidad y cambio']
      }
    };
    
    return specializations[prueba];
  }

  /**
   * Especialización por habilidad
   */
  private getSkillSpecialization(skill: TPAESHabilidad) {
    const specializations = {
      'TRACK_LOCATE': {
        focus: 'localización y extracción de información explícita',
        verbs: ['localizar', 'identificar', 'encontrar', 'ubicar', 'señalar'],
        questionTypes: ['¿Cuál?', '¿Dónde?', '¿Qué?', '¿Quién?', '¿Cuándo?']
      },
      'INTERPRET_RELATE': {
        focus: 'interpretación y establecimiento de relaciones',
        verbs: ['interpretar', 'relacionar', 'comparar', 'contrastar', 'asociar'],
        questionTypes: ['¿Por qué?', '¿Cómo se relaciona?', '¿Qué significa?', '¿Cuál es la diferencia?']
      },
      'EVALUATE_REFLECT': {
        focus: 'evaluación crítica y reflexión',
        verbs: ['evaluar', 'analizar', 'valorar', 'juzgar', 'reflexionar'],
        questionTypes: ['¿Es correcto?', '¿Qué opinas?', '¿Cuál es la mejor?', '¿Es válido?']
      },
      'SOLVE_PROBLEMS': {
        focus: 'resolución de problemas y aplicación',
        verbs: ['resolver', 'calcular', 'determinar', 'hallar', 'aplicar'],
        questionTypes: ['¿Cuál es el resultado?', '¿Cómo se resuelve?', '¿Cuál es el valor?']
      },
      'REPRESENT': {
        focus: 'representación y expresión de información',
        verbs: ['representar', 'graficar', 'expresar', 'mostrar', 'ilustrar'],
        questionTypes: ['¿Cómo se representa?', '¿Cuál es el gráfico?', '¿Cómo se expresa?']
      },
      'MODEL': {
        focus: 'modelación y formulación',
        verbs: ['modelar', 'formular', 'construir', 'diseñar', 'simular'],
        questionTypes: ['¿Cuál es el modelo?', '¿Cómo se formula?', '¿Qué ecuación?']
      },
      'ARGUE_COMMUNICATE': {
        focus: 'argumentación y comunicación',
        verbs: ['argumentar', 'explicar', 'justificar', 'fundamentar', 'comunicar'],
        questionTypes: ['¿Por qué?', '¿Cómo se explica?', '¿Cuál es la razón?', '¿Qué justifica?']
      }
    };
    
    return specializations[skill as keyof typeof specializations] || specializations['INTERPRET_RELATE'];
  }

  /**
   * Ajuste por dificultad
   */
  private getDifficultyAdjustment(difficulty: string) {
    const adjustments = {
      'BASIC': {
        complexity: 'conceptos fundamentales y directos',
        textLength: '100-200 palabras para contexto',
        questionStyle: 'pregunta directa sobre información explícita',
        vocabulary: 'vocabulario simple y claro'
      },
      'INTERMEDIATE': {
        complexity: 'conceptos de nivel medio con algunas relaciones',
        textLength: '200-300 palabras para contexto',
        questionStyle: 'pregunta que requiere interpretación o análisis básico',
        vocabulary: 'vocabulario técnico básico apropiado'
      },
      'ADVANCED': {
        complexity: 'conceptos complejos con múltiples relaciones',
        textLength: '300-400 palabras para contexto',
        questionStyle: 'pregunta que requiere análisis profundo o síntesis',
        vocabulary: 'vocabulario técnico avanzado y preciso'
      }
    };
    
    return adjustments[difficulty as keyof typeof adjustments] || adjustments['INTERMEDIATE'];
  }

  /**
   * Construye el system prompt especializado
   */
  private buildSystemPrompt(baseTemplate: any, subjectSpec: any, skillSpec: any): string {
    return `${baseTemplate.role}

ESPECIALIZACIÓN EN ${subjectSpec.focus.toUpperCase()}:
${subjectSpec.requirements.map((req: string) => `- ${req}`).join('\n')}

HABILIDAD A EVALUAR: ${skillSpec.focus}
- Usar verbos como: ${skillSpec.verbs.join(', ')}
- Tipos de preguntas apropiadas: ${skillSpec.questionTypes.join(', ')}

ESTRUCTURA REQUERIDA:
${subjectSpec.structure}

ESTÁNDARES DE CALIDAD:
- ${baseTemplate.standards}
- Usar conceptos específicos: ${subjectSpec.concepts.join(', ')}
- ${baseTemplate.format}

FORMATO DE RESPUESTA:
${baseTemplate.structure}`;
  }

  /**
   * Construye el user prompt específico
   */
  private buildUserPrompt(
    prueba: TPAESPrueba, 
    skill: TPAESHabilidad, 
    difficulty: string, 
    difficultyAdjustment: any,
    context?: any
  ): string {
    const contextualInfo = context ? `\n\nContexto del estudiante: ${JSON.stringify(context)}` : '';
    
    return `Genera un ejercicio de ${prueba} que evalúe la habilidad "${skill}" en nivel ${difficulty}.

REQUISITOS ESPECÍFICOS:
- Complejidad: ${difficultyAdjustment.complexity}
- Longitud de contexto: ${difficultyAdjustment.textLength}
- Estilo de pregunta: ${difficultyAdjustment.questionStyle}
- Vocabulario: ${difficultyAdjustment.vocabulary}

El ejercicio debe ser completamente original, educativo y apropiado para estudiantes preparándose para la PAES.${contextualInfo}

Responde ÚNICAMENTE con el JSON del ejercicio, sin texto adicional.`;
  }

  /**
   * Criterios de validación por materia y habilidad
   */
  private getValidationCriteria(prueba: TPAESPrueba, skill: TPAESHabilidad): string[] {
    const baseCriteria = [
      'Estructura JSON válida',
      'Cuatro alternativas con formato A), B), C), D)',
      'Una respuesta correcta claramente identificable',
      'Explicación pedagógica clara'
    ];
    
    const subjectCriteria = this.getSubjectValidationCriteria(prueba);
    const skillCriteria = this.getSkillValidationCriteria(skill);
    
    return [...baseCriteria, ...subjectCriteria, ...skillCriteria];
  }

  private getSubjectValidationCriteria(prueba: TPAESPrueba): string[] {
    const criteria = {
      'COMPETENCIA_LECTORA': [
        'Incluye texto de contexto apropiado',
        'Evalúa comprensión o análisis textual',
        'Vocabulario apropiado para el nivel'
      ],
      'MATEMATICA_1': [
        'Incluye elementos numéricos o algebraicos',
        'Datos suficientes para resolver',
        'Notación matemática correcta'
      ],
      'MATEMATICA_2': [
        'Conceptos matemáticos avanzados',
        'Notación matemática precisa',
        'Razonamiento matemático complejo'
      ],
      'CIENCIAS': [
        'Conceptos científicos específicos',
        'Terminología científica precisa',
        'Contexto científico relevante'
      ],
      'HISTORIA': [
        'Contexto histórico específico',
        'Análisis temporal o causal',
        'Conexiones históricas válidas'
      ]
    };
    
    return criteria[prueba] || [];
  }

  private getSkillValidationCriteria(skill: TPAESHabilidad): string[] {
    const criteria = {
      'TRACK_LOCATE': ['Información localizable en el contexto'],
      'INTERPRET_RELATE': ['Requiere interpretación o análisis'],
      'EVALUATE_REFLECT': ['Involucra evaluación o juicio crítico'],
      'SOLVE_PROBLEMS': ['Plantea problema con solución clara'],
      'REPRESENT': ['Incluye representación o expresión'],
      'MODEL': ['Involucra modelación o formulación'],
      'ARGUE_COMMUNICATE': ['Requiere argumentación o explicación']
    };
    
    return criteria[skill as keyof typeof criteria] || [];
  }

  /**
   * Campos esperados según la materia
   */
  private getExpectedFields(prueba: TPAESPrueba): string[] {
    const baseFields = ['question', 'options', 'correctAnswer', 'explanation', 'skill', 'difficulty', 'metadata'];
    
    const subjectFields = {
      'COMPETENCIA_LECTORA': ['context_text', 'text_type', 'reading_strategy'],
      'MATEMATICA_1': ['mathematical_concept', 'calculation_steps', 'formula_used'],
      'MATEMATICA_2': ['advanced_concept', 'mathematical_reasoning', 'graph_description'],
      'CIENCIAS': ['scientific_concept', 'experiment_context', 'scientific_method'],
      'HISTORIA': ['historical_period', 'historical_process', 'source_type']
    };
    
    return [...baseFields, ...(subjectFields[prueba] || [])];
  }
}

export const subjectPromptSpecializer = SubjectPromptSpecializer.getInstance();
