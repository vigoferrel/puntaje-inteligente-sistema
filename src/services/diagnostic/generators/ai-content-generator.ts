
import { DiagnosticQuestion } from "@/types/diagnostic";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { mapDifficultyToSpanish } from "@/utils/difficulty-mapper";

interface ContentGenerationConfig {
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  count: number;
  topic?: string;
  nodeId?: string;
}

export class AIContentGenerator {
  private static instance: AIContentGenerator;

  static getInstance(): AIContentGenerator {
    if (!AIContentGenerator.instance) {
      AIContentGenerator.instance = new AIContentGenerator();
    }
    return AIContentGenerator.instance;
  }

  async generateQuestions(config: ContentGenerationConfig): Promise<DiagnosticQuestion[]> {
    console.log(`🤖 Generando ${config.count} preguntas AI para ${config.prueba}`);

    try {
      // In a real implementation, this would call an AI service
      const questions = this.generateMockQuestions(config);
      
      console.log(`✅ ${questions.length} preguntas AI generadas`);
      return questions;
    } catch (error) {
      console.error('❌ Error generando preguntas AI:', error);
      return this.generateFallbackQuestions(config);
    }
  }

  private generateMockQuestions(config: ContentGenerationConfig): DiagnosticQuestion[] {
    const questions: DiagnosticQuestion[] = [];

    for (let i = 0; i < config.count; i++) {
      const question: DiagnosticQuestion = {
        id: `ai-generated-${config.prueba}-${config.skill}-${i + 1}`,
        question: this.generateQuestionText(config, i + 1),
        options: this.generateOptions(config),
        correctAnswer: this.generateCorrectAnswer(config),
        explanation: this.generateExplanation(config, i + 1),
        difficulty: mapDifficultyToSpanish(config.difficulty),
        skill: config.skill,
        prueba: config.prueba,
        metadata: {
          source: 'ai_generated',
          bloomLevel: this.getBloomLevel(config.difficulty),
          nodeId: config.nodeId,
          paesFrequencyWeight: this.calculateFrequencyWeight(config)
        }
      };

      questions.push(question);
    }

    return questions;
  }

  private generateQuestionText(config: ContentGenerationConfig, index: number): string {
    const templates = {
      'COMPETENCIA_LECTORA': [
        `En el siguiente texto, ¿cuál es la idea principal del párrafo ${index}?`,
        `Según la lectura, ¿qué se puede inferir sobre...?`,
        `¿Cuál es la intención comunicativa del autor en este fragmento?`
      ],
      'MATEMATICA_1': [
        `Resuelve la siguiente ecuación: ${this.generateMathExpression(index)}`,
        `Si x = ${index + 2}, ¿cuál es el valor de 2x + 3?`,
        `¿Cuál es la pendiente de la recta que pasa por los puntos (${index}, ${index + 1}) y (${index + 2}, ${index + 3})?`
      ],
      'MATEMATICA_2': [
        `Encuentra la derivada de f(x) = x^${index + 1}`,
        `¿Cuál es el límite de (x^2 - ${index}) / (x - ${index}) cuando x tiende a ${index}?`,
        `Calcula la integral de ${index}x dx`
      ],
      'CIENCIAS': [
        `¿Cuál es la característica principal de ${this.getScienceConcept(index)}?`,
        `En un experimento, si la variable independiente es..., ¿cuál sería la dependiente?`,
        `¿Qué proceso explica mejor el fenómeno observado en...?`
      ],
      'HISTORIA': [
        `¿Cuál fue la principal causa del evento histórico ocurrido en...?`,
        `¿Qué consecuencias tuvo el proceso de... en el siglo ${18 + index}?`,
        `¿Cómo influyó el contexto geográfico en el desarrollo de...?`
      ]
    };

    const pruebaTemplates = templates[config.prueba] || templates['COMPETENCIA_LECTORA'];
    const template = pruebaTemplates[index % pruebaTemplates.length];
    
    return template;
  }

  private generateOptions(config: ContentGenerationConfig): string[] {
    const baseOptions = [
      'Primera alternativa correcta',
      'Segunda alternativa incorrecta',
      'Tercera alternativa incorrecta',
      'Cuarta alternativa incorrecta'
    ];

    return baseOptions.map((opt, i) => 
      `${String.fromCharCode(65 + i)}) ${opt.replace('Primera alternativa correcta', this.getCorrectAnswerText(config))}`
    );
  }

  private generateCorrectAnswer(config: ContentGenerationConfig): string {
    return `A) ${this.getCorrectAnswerText(config)}`;
  }

  private getCorrectAnswerText(config: ContentGenerationConfig): string {
    const answers = {
      'COMPETENCIA_LECTORA': 'La interpretación que mejor refleja el sentido del texto',
      'MATEMATICA_1': 'El resultado matemático correcto aplicando las propiedades',
      'MATEMATICA_2': 'La solución que cumple con las condiciones del problema',
      'CIENCIAS': 'La explicación científica más precisa y completa',
      'HISTORIA': 'El análisis histórico más contextualizado y preciso'
    };

    return answers[config.prueba] || answers['COMPETENCIA_LECTORA'];
  }

  private generateExplanation(config: ContentGenerationConfig, index: number): string {
    return `Esta pregunta evalúa la habilidad ${config.skill} en el contexto de ${config.prueba}. ` +
           `La respuesta correcta se fundamenta en ${this.getSkillExplanation(config.skill)}. ` +
           `Nivel de dificultad: ${config.difficulty}.`;
  }

  private getSkillExplanation(skill: TPAESHabilidad): string {
    const explanations: Record<TPAESHabilidad, string> = {
      'SOLVE_PROBLEMS': 'la aplicación de estrategias de resolución de problemas',
      'REPRESENT': 'la capacidad de representar información de múltiples formas',
      'MODEL': 'la construcción y uso de modelos conceptuales',
      'INTERPRET_RELATE': 'la interpretación y relación de información',
      'EVALUATE_REFLECT': 'la evaluación crítica y reflexión',
      'TRACK_LOCATE': 'la localización y seguimiento de información',
      'ARGUE_COMMUNICATE': 'la argumentación y comunicación efectiva',
      'IDENTIFY_THEORIES': 'la identificación de teorías y conceptos',
      'PROCESS_ANALYZE': 'el procesamiento y análisis de datos',
      'APPLY_PRINCIPLES': 'la aplicación de principios fundamentales',
      'SCIENTIFIC_ARGUMENT': 'la construcción de argumentos científicos',
      'TEMPORAL_THINKING': 'el pensamiento temporal y secuencial',
      'SOURCE_ANALYSIS': 'el análisis crítico de fuentes',
      'MULTICAUSAL_ANALYSIS': 'el análisis multicausal de fenómenos',
      'CRITICAL_THINKING': 'el pensamiento crítico y analítico',
      'REFLECTION': 'la reflexión metacognitiva'
    };

    return explanations[skill] || 'el desarrollo de habilidades cognitivas complejas';
  }

  private generateMathExpression(index: number): string {
    const expressions = [
      `2x + ${index} = ${index * 2 + 5}`,
      `x^2 - ${index}x + ${index} = 0`,
      `${index}x + 3 = ${index * 3 + 3}`
    ];
    return expressions[index % expressions.length];
  }

  private getScienceConcept(index: number): string {
    const concepts = [
      'la fotosíntesis',
      'la mitosis celular',
      'la digestión enzimática',
      'la respiración celular',
      'la síntesis de proteínas'
    ];
    return concepts[index % concepts.length];
  }

  private getBloomLevel(difficulty: string): string {
    const levels = {
      'basic': 'recordar',
      'intermediate': 'comprender',
      'advanced': 'analizar'
    };
    return levels[difficulty as keyof typeof levels] || 'comprender';
  }

  private calculateFrequencyWeight(config: ContentGenerationConfig): number {
    const baseWeight = 1.0;
    const difficultyMultiplier = {
      'basic': 0.8,
      'intermediate': 1.0,
      'advanced': 1.2
    };
    
    return baseWeight * (difficultyMultiplier[config.difficulty] || 1.0);
  }

  private generateFallbackQuestions(config: ContentGenerationConfig): DiagnosticQuestion[] {
    return Array.from({ length: config.count }, (_, i) => ({
      id: `fallback-ai-${config.prueba}-${i + 1}`,
      question: `Pregunta ${i + 1} generada por IA para ${config.prueba}`,
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      correctAnswer: 'Opción A',
      explanation: 'Pregunta de demostración generada por IA.',
      difficulty: mapDifficultyToSpanish(config.difficulty),
      skill: config.skill,
      prueba: config.prueba,
      metadata: {
        source: 'fallback_ai',
        template: true
      }
    }));
  }
}

export const aiContentGenerator = AIContentGenerator.getInstance();
