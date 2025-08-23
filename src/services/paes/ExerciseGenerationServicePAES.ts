
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { openRouterService } from '@/services/openrouter/core';
import { logger } from '@/core/logging/SystemLogger';

interface PAESExerciseConfig {
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  includeVisuals: boolean;
  context?: string;
}

interface PAESExerciseStructure {
  hasText: boolean;
  hasImages: boolean;
  hasGraphs: boolean;
  hasTables: boolean;
  hasFormulas: boolean;
  optionsCount: number;
  estimatedTime: number;
}

export class ExerciseGenerationServicePAES {
  
  /**
   * Genera ejercicio PAES según la estructura específica de cada materia
   */
  static async generatePAESExercise(config: PAESExerciseConfig): Promise<Exercise | null> {
    try {
      logger.info('ExerciseGenerationServicePAES', 'Generando ejercicio PAES', config);
      
      const structure = this.getExerciseStructure(config.prueba);
      const prompt = this.buildSpecializedPrompt(config, structure);
      
      // Generar ejercicio base
      const baseExercise = await this.generateBaseExercise(prompt, config);
      if (!baseExercise) return null;
      
      // Enriquecer con contenido visual si es necesario
      const enrichedExercise = await this.enrichWithVisualContent(baseExercise, config, structure);
      
      // Validar calidad específica PAES
      const validatedExercise = await this.validatePAESQuality(enrichedExercise, config);
      
      return validatedExercise;
    } catch (error) {
      logger.error('ExerciseGenerationServicePAES', 'Error generando ejercicio PAES', error);
      return null;
    }
  }
  
  /**
   * Define la estructura específica de cada prueba PAES
   */
  private static getExerciseStructure(prueba: TPAESPrueba): PAESExerciseStructure {
    const structures: Record<TPAESPrueba, PAESExerciseStructure> = {
      'COMPETENCIA_LECTORA': {
        hasText: true,
        hasImages: false,
        hasGraphs: false,
        hasTables: false,
        hasFormulas: false,
        optionsCount: 4,
        estimatedTime: 180
      },
      'MATEMATICA_1': {
        hasText: false,
        hasImages: true,
        hasGraphs: true,
        hasTables: true,
        hasFormulas: true,
        optionsCount: 4,
        estimatedTime: 120
      },
      'MATEMATICA_2': {
        hasText: false,
        hasImages: true,
        hasGraphs: true,
        hasTables: true,
        hasFormulas: true,
        optionsCount: 4,
        estimatedTime: 150
      },
      'CIENCIAS': {
        hasText: true,
        hasImages: true,
        hasGraphs: true,
        hasTables: true,
        hasFormulas: true,
        optionsCount: 4,
        estimatedTime: 135
      },
      'HISTORIA': {
        hasText: true,
        hasImages: true,
        hasGraphs: false,
        hasTables: true,
        hasFormulas: false,
        optionsCount: 4,
        estimatedTime: 120
      }
    };
    
    return structures[prueba];
  }
  
  /**
   * Construye prompt especializado según la materia
   */
  private static buildSpecializedPrompt(config: PAESExerciseConfig, structure: PAESExerciseStructure): string {
    const basePrompt = `Genera un ejercicio PAES auténtico para ${config.prueba} nivel ${config.difficulty}.`;
    
    const structurePrompts = {
      'COMPETENCIA_LECTORA': `
ESTRUCTURA REQUERIDA COMPRENSIÓN LECTORA:
- Texto base auténtico (300-600 palabras)
- Pregunta específica sobre el texto
- 4 alternativas plausibles
- Evaluación de habilidad: ${config.skill}

TIPOS DE TEXTO VÁLIDOS:
- Artículos periodísticos
- Textos académicos
- Literatura chilena
- Textos informativos
- Ensayos argumentativos

EJEMPLO ESTRUCTURA:
{
  "text": "Texto base completo aquí...",
  "question": "Según el texto, ¿cuál es la idea principal del segundo párrafo?",
  "options": ["A) Primera alternativa", "B) Segunda alternativa", "C) Tercera alternativa", "D) Cuarta alternativa"],
  "correctAnswer": "A) Primera alternativa",
  "explanation": "Explicación detallada..."
}`,

      'MATEMATICA_1': `
ESTRUCTURA REQUERIDA MATEMÁTICA M1:
- Problema matemático directo
- Puede incluir gráficos, tablas o fórmulas
- 4 alternativas numéricas precisas
- Evaluación de habilidad: ${config.skill}

ÁREAS DE CONTENIDO:
- Números y operaciones
- Álgebra básica
- Geometría elemental
- Datos y azar básico

EJEMPLO ESTRUCTURA:
{
  "question": "Si f(x) = 2x + 3, ¿cuál es el valor de f(5)?",
  "hasVisualContent": true,
  "visualType": "formula",
  "options": ["A) 10", "B) 13", "C) 15", "D) 18"],
  "correctAnswer": "B) 13",
  "explanation": "f(5) = 2(5) + 3 = 10 + 3 = 13"
}`,

      'MATEMATICA_2': `
ESTRUCTURA REQUERIDA MATEMÁTICA M2:
- Problema matemático avanzado
- Frecuentemente incluye gráficos o funciones
- 4 alternativas precisas
- Evaluación de habilidad: ${config.skill}

ÁREAS DE CONTENIDO:
- Álgebra y funciones
- Geometría analítica
- Probabilidad y estadística
- Cálculo diferencial básico

EJEMPLO ESTRUCTURA:
{
  "question": "Dada la función f(x) = x² - 4x + 3, determine el vértice de la parábola",
  "hasVisualContent": true,
  "visualType": "graph",
  "options": ["A) (2, -1)", "B) (2, 1)", "C) (-2, -1)", "D) (-2, 1)"],
  "correctAnswer": "A) (2, -1)",
  "explanation": "El vértice se encuentra en x = -b/2a = 4/2 = 2, y f(2) = 4 - 8 + 3 = -1"
}`,

      'CIENCIAS': `
ESTRUCTURA REQUERIDA CIENCIAS:
- Contexto científico auténtico
- Puede incluir experimentos, gráficos, tablas
- 4 alternativas científicamente válidas
- Evaluación de habilidad: ${config.skill}

ÁREAS DE CONTENIDO:
- Biología (células, ecosistemas, genética)
- Física (mecánica, electricidad, ondas)
- Química (reacciones, estructura atómica)

EJEMPLO ESTRUCTURA:
{
  "text": "En un experimento se observó que...",
  "question": "¿Qué conclusión se puede extraer del experimento?",
  "hasVisualContent": true,
  "visualType": "table",
  "options": ["A) Primera conclusión", "B) Segunda conclusión", "C) Tercera conclusión", "D) Cuarta conclusión"],
  "correctAnswer": "A) Primera conclusión",
  "explanation": "La evidencia experimental demuestra que..."
}`,

      'HISTORIA': `
ESTRUCTURA REQUERIDA HISTORIA:
- Contexto histórico chileno o universal
- Puede incluir fuentes, mapas, imágenes históricas
- 4 alternativas históricamente precisas
- Evaluación de habilidad: ${config.skill}

ÁREAS DE CONTENIDO:
- Historia de Chile
- Historia universal
- Geografía humana
- Educación cívica

EJEMPLO ESTRUCTURA:
{
  "text": "Durante el gobierno de...",
  "question": "¿Cuál fue la principal consecuencia de este proceso histórico?",
  "hasVisualContent": false,
  "options": ["A) Primera consecuencia", "B) Segunda consecuencia", "C) Tercera consecuencia", "D) Cuarta consecuencia"],
  "correctAnswer": "A) Primera consecuencia",
  "explanation": "Este proceso histórico llevó a..."
}`
    };
    
    return basePrompt + '\n\n' + structurePrompts[config.prueba];
  }
  
  /**
   * Genera el ejercicio base usando OpenRouter
   */
  private static async generateBaseExercise(prompt: string, config: PAESExerciseConfig): Promise<Exercise | null> {
    try {
      const response = await openRouterService({
        action: 'generate_paes_exercise',
        payload: {
          systemPrompt: `Eres un experto en PAES chileno. Genera ejercicios auténticos y de alta calidad educativa.`,
          userPrompt: prompt,
          model: 'openai/gpt-4o',
          maxTokens: 1500,
          temperature: 0.7
        }
      });
      
      if (!response) return null;
      
      // Type-safe access to response properties
      const responseData = response as any;
      
      const exercise: Exercise = {
        id: `paes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: responseData.question || '',
        text: responseData.text || '',
        options: responseData.options || [],
        correctAnswer: responseData.correctAnswer || '',
        explanation: responseData.explanation || '',
        skill: config.skill,
        prueba: config.prueba,
        difficulty: config.difficulty,
        hasVisualContent: responseData.hasVisualContent || false,
        visualType: responseData.visualType || undefined,
        estimatedTime: responseData.estimatedTime || 120,
        metadata: {
          source: 'ai_paes_specialized',
          generatedAt: new Date().toISOString(),
          prueba: config.prueba,
          skill: config.skill,
          difficulty: config.difficulty
        }
      };
      
      return exercise;
    } catch (error) {
      logger.error('ExerciseGenerationServicePAES', 'Error en generación base', error);
      return null;
    }
  }
  
  /**
   * Enriquece el ejercicio con contenido visual cuando es necesario
   */
  private static async enrichWithVisualContent(
    exercise: Exercise, 
    config: PAESExerciseConfig, 
    structure: PAESExerciseStructure
  ): Promise<Exercise> {
    if (!config.includeVisuals || !structure.hasImages) {
      return exercise;
    }
    
    try {
      // Para matemáticas y ciencias, generar gráficos/diagramas
      if (config.prueba.startsWith('MATEMATICA') || config.prueba === 'CIENCIAS') {
        const visualPrompt = this.buildVisualPrompt(exercise, config.prueba);
        
        const visualResponse = await openRouterService({
          action: 'generate_visual_description',
          payload: {
            systemPrompt: 'Describe visual content for PAES exercises in detail.',
            userPrompt: visualPrompt,
            model: 'openai/gpt-4o',
            maxTokens: 500
          }
        });
        
        if (visualResponse) {
          const visualData = visualResponse as any;
          if (visualData.description) {
            exercise.graphData = {
              description: visualData.description,
              type: exercise.visualType || 'graph',
              elements: visualData.elements || []
            };
          }
        }
      }
      
      return exercise;
    } catch (error) {
      logger.error('ExerciseGenerationServicePAES', 'Error enriqueciendo contenido visual', error);
      return exercise;
    }
  }
  
  /**
   * Construye prompt para generación de contenido visual
   */
  private static buildVisualPrompt(exercise: Exercise, prueba: TPAESPrueba): string {
    const visualPrompts = {
      'MATEMATICA_1': `Describe un gráfico o diagrama para este problema de Matemática M1: ${exercise.question}`,
      'MATEMATICA_2': `Describe una función, gráfico o representación visual para este problema de Matemática M2: ${exercise.question}`,
      'CIENCIAS': `Describe un diagrama, tabla o gráfico científico para este problema de Ciencias: ${exercise.question}`
    };
    
    return visualPrompts[prueba] || `Describe contenido visual para: ${exercise.question}`;
  }
  
  /**
   * Valida la calidad específica PAES del ejercicio
   */
  private static async validatePAESQuality(exercise: Exercise, config: PAESExerciseConfig): Promise<Exercise | null> {
    const validationChecks = {
      hasQuestion: !!exercise.question && exercise.question.length > 10,
      hasOptions: exercise.options && exercise.options.length === 4,
      hasCorrectAnswer: !!exercise.correctAnswer && exercise.options.includes(exercise.correctAnswer),
      hasExplanation: !!exercise.explanation && exercise.explanation.length > 20,
      appropriateLength: exercise.question.length < 1000,
      validStructure: this.validateStructureBySubject(exercise, config.prueba)
    };
    
    const isValid = Object.values(validationChecks).every(check => check);
    
    if (!isValid) {
      logger.warn('ExerciseGenerationServicePAES', 'Ejercicio no pasó validación de calidad', {
        config,
        validationChecks
      });
      return null;
    }
    
    return exercise;
  }
  
  /**
   * Valida estructura específica por materia
   */
  private static validateStructureBySubject(exercise: Exercise, prueba: TPAESPrueba): boolean {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return !!(exercise.text && exercise.text.length > 100);
      
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return exercise.options.every(option => 
          /^[A-D]\)/.test(option) && (
            /\d/.test(option) || 
            /[+\-*/=()]/.test(option) ||
            /[xyz]/.test(option)
          )
        );
      
      case 'CIENCIAS':
        return !!(exercise.question.includes('experimento') || 
                 exercise.question.includes('proceso') ||
                 exercise.question.includes('fenómeno') ||
                 exercise.text);
      
      case 'HISTORIA':
        return !!(exercise.text || 
                 exercise.question.includes('período') ||
                 exercise.question.includes('proceso histórico') ||
                 exercise.question.includes('gobierno'));
      
      default:
        return true;
    }
  }
  
  /**
   * Genera lote de ejercicios PAES
   */
  static async generatePAESBatch(
    config: PAESExerciseConfig,
    count: number = 5
  ): Promise<Exercise[]> {
    const exercises: Exercise[] = [];
    
    for (let i = 0; i < count; i++) {
      const exercise = await this.generatePAESExercise(config);
      if (exercise) {
        exercises.push(exercise);
      }
      
      // Pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    logger.info('ExerciseGenerationServicePAES', 'Lote de ejercicios generado', {
      requested: count,
      generated: exercises.length,
      config
    });
    
    return exercises;
  }
}
