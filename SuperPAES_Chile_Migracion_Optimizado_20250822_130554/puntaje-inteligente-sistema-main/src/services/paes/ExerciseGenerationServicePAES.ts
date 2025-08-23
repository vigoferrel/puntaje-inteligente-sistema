/* eslint-disable react-refresh/only-export-components */

import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { Exercise } from '@/types/ai-types';
import { openRouterServiceFunction } from '@/services/openrouter/core';
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
   * Genera ejercicio PAES segÃºn la estructura especÃ­fica de cada materia
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
      
      // Validar calidad especÃ­fica PAES
      const validatedExercise = await this.validatePAESQuality(enrichedExercise, config);
      
      return validatedExercise;
    } catch (error) {
      logger.error('ExerciseGenerationServicePAES', 'Error generando ejercicio PAES', error);
      return null;
    }
  }
  
  /**
   * Define la estructura especÃ­fica de cada prueba PAES
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
   * Construye prompt especializado segÃºn la materia
   */
  private static buildSpecializedPrompt(config: PAESExerciseConfig, structure: PAESExerciseStructure): string {
    const basePrompt = `Genera un ejercicio PAES autÃ©ntico para ${config.prueba} nivel ${config.difficulty}.`;
    
    const structurePrompts = {
      'COMPETENCIA_LECTORA': `
ESTRUCTURA REQUERIDA COMPRENSIÃ“N LECTORA:
- Texto base autÃ©ntico (300-600 palabras)
- Pregunta especÃ­fica sobre el texto
- 4 alternativas plausibles
- EvaluaciÃ³n de habilidad: ${config.skill}

TIPOS DE TEXTO VÃLIDOS:
- ArtÃ­culos periodÃ­sticos
- Textos acadÃ©micos
- Literatura chilena
- Textos informativos
- Ensayos argumentativos

EJEMPLO ESTRUCTURA:
{
  "text": "Texto base completo aquÃ­...",
  "question": "SegÃºn el texto, Â¿cuÃ¡l es la idea principal del segundo pÃ¡rrafo?",
  "options": ["A) Primera alternativa", "B) Segunda alternativa", "C) Tercera alternativa", "D) Cuarta alternativa"],
  "correctAnswer": "A) Primera alternativa",
  "explanation": "ExplicaciÃ³n detallada..."
}`,

      'MATEMATICA_1': `
ESTRUCTURA REQUERIDA MATEMÃTICA M1:
- Problema matemÃ¡tico directo
- Puede incluir grÃ¡ficos, tablas o fÃ³rmulas
- 4 alternativas numÃ©ricas precisas
- EvaluaciÃ³n de habilidad: ${config.skill}

ÃREAS DE CONTENIDO:
- NÃºmeros y operaciones
- Ãlgebra bÃ¡sica
- GeometrÃ­a elemental
- Datos y azar bÃ¡sico

EJEMPLO ESTRUCTURA:
{
  "question": "Si f(x) = 2x + 3, Â¿cuÃ¡l es el valor de f(5)?",
  "hasVisualContent": true,
  "visualType": "formula",
  "options": ["A) 10", "B) 13", "C) 15", "D) 18"],
  "correctAnswer": "B) 13",
  "explanation": "f(5) = 2(5) + 3 = 10 + 3 = 13"
}`,

      'MATEMATICA_2': `
ESTRUCTURA REQUERIDA MATEMÃTICA M2:
- Problema matemÃ¡tico avanzado
- Frecuentemente incluye grÃ¡ficos o funciones
- 4 alternativas precisas
- EvaluaciÃ³n de habilidad: ${config.skill}

ÃREAS DE CONTENIDO:
- Ãlgebra y funciones
- GeometrÃ­a analÃ­tica
- Probabilidad y estadÃ­stica
- CÃ¡lculo diferencial bÃ¡sico

EJEMPLO ESTRUCTURA:
{
  "question": "Dada la funciÃ³n f(x) = xÂ² - 4x + 3, determine el vÃ©rtice de la parÃ¡bola",
  "hasVisualContent": true,
  "visualType": "graph",
  "options": ["A) (2, -1)", "B) (2, 1)", "C) (-2, -1)", "D) (-2, 1)"],
  "correctAnswer": "A) (2, -1)",
  "explanation": "El vÃ©rtice se encuentra en x = -b/2a = 4/2 = 2, y f(2) = 4 - 8 + 3 = -1"
}`,

      'CIENCIAS': `
ESTRUCTURA REQUERIDA CIENCIAS:
- Contexto cientÃ­fico autÃ©ntico
- Puede incluir experimentos, grÃ¡ficos, tablas
- 4 alternativas cientÃ­ficamente vÃ¡lidas
- EvaluaciÃ³n de habilidad: ${config.skill}

ÃREAS DE CONTENIDO:
- BiologÃ­a (cÃ©lulas, ecosistemas, genÃ©tica)
- FÃ­sica (mecÃ¡nica, electricidad, ondas)
- QuÃ­mica (reacciones, estructura atÃ³mica)

EJEMPLO ESTRUCTURA:
{
  "text": "En un experimento se observÃ³ que...",
  "question": "Â¿QuÃ© conclusiÃ³n se puede extraer del experimento?",
  "hasVisualContent": true,
  "visualType": "table",
  "options": ["A) Primera conclusiÃ³n", "B) Segunda conclusiÃ³n", "C) Tercera conclusiÃ³n", "D) Cuarta conclusiÃ³n"],
  "correctAnswer": "A) Primera conclusiÃ³n",
  "explanation": "La evidencia experimental demuestra que..."
}`,

      'HISTORIA': `
ESTRUCTURA REQUERIDA HISTORIA:
- Contexto histÃ³rico chileno o universal
- Puede incluir fuentes, mapas, imÃ¡genes histÃ³ricas
- 4 alternativas histÃ³ricamente precisas
- EvaluaciÃ³n de habilidad: ${config.skill}

ÃREAS DE CONTENIDO:
- Historia de Chile
- Historia universal
- GeografÃ­a humana
- EducaciÃ³n cÃ­vica

EJEMPLO ESTRUCTURA:
{
  "text": "Durante el gobierno de...",
  "question": "Â¿CuÃ¡l fue la principal consecuencia de este proceso histÃ³rico?",
  "hasVisualContent": false,
  "options": ["A) Primera consecuencia", "B) Segunda consecuencia", "C) Tercera consecuencia", "D) Cuarta consecuencia"],
  "correctAnswer": "A) Primera consecuencia",
  "explanation": "Este proceso histÃ³rico llevÃ³ a..."
}`
    };
    
    return basePrompt + '\n\n' + structurePrompts[config.prueba];
  }
  
  /**
   * Genera el ejercicio base usando OpenRouter
   */
  private static async generateBaseExercise(prompt: string, config: PAESExerciseConfig): Promise<Exercise | null> {
    try {
      logger.info('ExerciseGenerationServicePAES', 'Iniciando generaciÃ³n con OpenRouter', { config });
      
      const response = await openRouterServiceFunction({
        action: 'generate_paes_exercise',
        payload: {
          systemPrompt: `Eres un experto en PAES chileno. Genera ejercicios autÃ©nticos y de alta calidad educativa.`,
          userPrompt: prompt,
          model: 'openai/gpt-4o',
          maxTokens: 1500,
          temperature: 0.7
        }
      });
      
      // ðŸ” VALIDACIÃ“N ROBUSTA: Verificar respuesta de OpenRouter
      if (!response) {
        logger.error('ExerciseGenerationServicePAES', 'OpenRouter retornÃ³ null - verificar API key con: .\\CONFIGURAR-APIKEY-SIMPLE.ps1');
        return null;
      }
      
      // ðŸ” VALIDACIÃ“N DE ESTRUCTURA: Verificar que la respuesta tenga el formato esperado
      let responseData: Record<string, unknown>;
      try {
        // Intentar parsear como JSON si es string
        responseData = typeof response === 'string' ? JSON.parse(response) : response;
      } catch (parseError) {
        logger.error('ExerciseGenerationServicePAES', 'Error parseando respuesta JSON', { response, parseError });
        return null;
      }
      
      if (!responseData || typeof responseData !== 'object') {
        logger.error('ExerciseGenerationServicePAES', 'Respuesta de OpenRouter malformada', { response });
        return null;
      }
      
      // ðŸ” VALIDACIÃ“N DE CONTENIDO: Verificar propiedades esenciales
      if (!responseData.question || !responseData.options || !Array.isArray(responseData.options)) {
        logger.error('ExerciseGenerationServicePAES', 'Respuesta de OpenRouter incompleta', {
          hasQuestion: !!responseData.question,
          hasOptions: !!responseData.options,
          optionsIsArray: Array.isArray(responseData.options),
          responseData
        });
        return null;
      }
      
      logger.info('ExerciseGenerationServicePAES', 'Respuesta de OpenRouter vÃ¡lida', {
        question: typeof responseData.question === 'string' ? responseData.question.substring(0, 100) + '...' : 'N/A',
        optionsCount: Array.isArray(responseData.options) ? responseData.options.length : 0
      });
      
      const exercise: Exercise = {
        id: `paes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        question: String(responseData.question || ''),
        text: String(responseData.text || ''),
        options: Array.isArray(responseData.options) ? responseData.options as string[] : [],
        correctAnswer: String(responseData.correctAnswer || ''),
        explanation: String(responseData.explanation || ''),
        skill: config.skill,
        prueba: config.prueba,
        difficulty: config.difficulty,
        hasVisualContent: Boolean(responseData.hasVisualContent) || false,
        visualType: typeof responseData.visualType === 'string' ? responseData.visualType : undefined,
        estimatedTime: typeof responseData.estimatedTime === 'number' ? responseData.estimatedTime : 120,
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
      logger.error('ExerciseGenerationServicePAES', 'Error en generaciÃ³n base', error);
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
      // Para matemÃ¡ticas y ciencias, generar grÃ¡ficos/diagramas
      if (config.prueba.startsWith('MATEMATICA') || config.prueba === 'CIENCIAS') {
        const visualPrompt = this.buildVisualPrompt(exercise, config.prueba);
        
        const visualResponse = await openRouterServiceFunction({
          action: 'generate_visual_description',
          payload: {
            systemPrompt: 'Describe visual content for PAES exercises in detail.',
            userPrompt: visualPrompt,
            model: 'openai/gpt-4o',
            maxTokens: 500
          }
        });
        
        if (visualResponse && typeof visualResponse === 'object') {
          const visualData = visualResponse as Record<string, unknown>;
          if (visualData.description && typeof visualData.description === 'string') {
            exercise.graphData = {
              description: visualData.description,
              type: exercise.visualType || 'graph',
              elements: Array.isArray(visualData.elements) ? visualData.elements : []
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
   * Construye prompt para generaciÃ³n de contenido visual
   */
  private static buildVisualPrompt(exercise: Exercise, prueba: TPAESPrueba): string {
    const visualPrompts = {
      'MATEMATICA_1': `Describe un grÃ¡fico o diagrama para este problema de MatemÃ¡tica M1: ${exercise.question}`,
      'MATEMATICA_2': `Describe una funciÃ³n, grÃ¡fico o representaciÃ³n visual para este problema de MatemÃ¡tica M2: ${exercise.question}`,
      'CIENCIAS': `Describe un diagrama, tabla o grÃ¡fico cientÃ­fico para este problema de Ciencias: ${exercise.question}`
    };
    
    return visualPrompts[prueba] || `Describe contenido visual para: ${exercise.question}`;
  }
  
  /**
   * Valida la calidad especÃ­fica PAES del ejercicio
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
      logger.warn('ExerciseGenerationServicePAES', 'Ejercicio no pasÃ³ validaciÃ³n de calidad', {
        config,
        validationChecks
      });
      return null;
    }
    
    return exercise;
  }
  
  /**
   * Valida estructura especÃ­fica por materia
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
                 exercise.question.includes('fenÃ³meno') ||
                 exercise.text);
      
      case 'HISTORIA':
        return !!(exercise.text || 
                 exercise.question.includes('perÃ­odo') ||
                 exercise.question.includes('proceso histÃ³rico') ||
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
      
      // PequeÃ±a pausa para no sobrecargar la API
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



