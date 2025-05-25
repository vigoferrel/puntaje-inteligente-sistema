
import { supabase } from '@/integrations/supabase/client';
import { MaterialGenerationConfig, GeneratedMaterial } from '@/types/material-generation';
import { TPAESPrueba } from '@/types/system-types';

interface OfficialQuestion {
  numero: number;
  enunciado: string;
  contexto?: string;
  opciones: Array<{
    letra: string;
    contenido: string;
    es_correcta: boolean;
  }>;
  examCode: string;
}

export class OfficialContentService {
  
  private static getExamCodeForPrueba(prueba: TPAESPrueba): string {
    const examCodes: Record<TPAESPrueba, string> = {
      'COMPETENCIA_LECTORA': 'PAES-2024-FORM-103',
      'MATEMATICA_1': 'MATEMATICA_M1_2024_FORMA_123',
      'MATEMATICA_2': 'MATEMATICA_M2_2024_FORMA_456',
      'CIENCIAS': 'CIENCIAS_2024_FORMA_789',
      'HISTORIA': 'HISTORIA_2024_FORMA_123'
    };
    return examCodes[prueba] || 'PAES-2024-FORM-103';
  }

  static async generateOfficialExercises(config: MaterialGenerationConfig): Promise<GeneratedMaterial[]> {
    try {
      const examCode = this.getExamCodeForPrueba(config.prueba);
      console.log(`🔍 Cargando preguntas oficiales de ${examCode}`);

      const { data, error } = await supabase.rpc('obtener_examen_completo', {
        codigo_examen: examCode
      });

      if (error) throw error;

      const examData = data as any;
      const questions = examData?.preguntas || [];

      if (questions.length === 0) {
        console.warn(`⚠️ No se encontraron preguntas para ${examCode}, usando fallback`);
        return this.createFallbackExercises(config);
      }

      const selectedQuestions = this.selectQuestionsByDifficulty(questions, config);
      
      return selectedQuestions.map((q: any, index: number) => ({
        id: `official-${examCode}-${q.numero}`,
        type: 'exercises' as const,
        title: `Pregunta Oficial ${q.numero} - ${config.subject}`,
        content: {
          question: q.enunciado,
          context: q.contexto,
          options: q.opciones?.map((opt: any) => `${opt.letra}) ${opt.contenido}`) || [],
          correctAnswer: q.opciones?.find((opt: any) => opt.es_correcta)?.letra || 'A',
          explanation: q.contexto || `Pregunta oficial del examen ${examCode}`
        },
        metadata: {
          source: 'official' as const,
          examCode,
          difficulty: config.difficulty,
          skill: config.skill || 'INTERPRET_RELATE',
          prueba: config.prueba,
          estimatedTime: 3
        },
        createdAt: new Date()
      }));

    } catch (error) {
      console.error('❌ Error cargando contenido oficial:', error);
      return this.createFallbackExercises(config);
    }
  }

  private static selectQuestionsByDifficulty(questions: any[], config: MaterialGenerationConfig): any[] {
    const difficultyRanges = {
      'BASICO': { start: 1, end: 20 },
      'INTERMEDIO': { start: 21, end: 45 },
      'AVANZADO': { start: 46, end: questions.length }
    };

    const range = difficultyRanges[config.difficulty];
    const filteredQuestions = questions.filter(q => 
      q.numero >= range.start && q.numero <= range.end
    );

    const selectedCount = Math.min(config.count, filteredQuestions.length);
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, selectedCount);
  }

  private static createFallbackExercises(config: MaterialGenerationConfig): GeneratedMaterial[] {
    console.log('🔄 Creando ejercicios de fallback');
    
    return Array.from({ length: config.count }, (_, i) => ({
      id: `fallback-${config.subject}-${i + 1}`,
      type: 'exercises' as const,
      title: `Ejercicio ${i + 1} - ${config.subject}`,
      content: {
        question: `Pregunta de práctica ${i + 1} para ${config.subject} (nivel ${config.difficulty})`,
        options: [
          'A) Primera opción de respuesta',
          'B) Segunda opción de respuesta', 
          'C) Tercera opción de respuesta',
          'D) Cuarta opción de respuesta'
        ],
        correctAnswer: 'A',
        explanation: `Esta es una pregunta de práctica diseñada para evaluar competencias de ${config.subject} en nivel ${config.difficulty}.`
      },
      metadata: {
        source: 'ai' as const,
        difficulty: config.difficulty,
        skill: config.skill || 'INTERPRET_RELATE',
        prueba: config.prueba,
        estimatedTime: 3
      },
      createdAt: new Date()
    }));
  }

  static async generateStudyContent(config: MaterialGenerationConfig): Promise<GeneratedMaterial[]> {
    const topics = this.getTopicsForSubject(config.subject);
    
    return topics.slice(0, config.count).map((topic, index) => ({
      id: `study-${config.subject}-${index + 1}`,
      type: 'study_content' as const,
      title: `${topic} - Material de Estudio`,
      content: {
        topic,
        summary: `Contenido teórico sobre ${topic} para ${config.subject}`,
        keyPoints: [
          `Concepto fundamental de ${topic}`,
          `Aplicaciones prácticas en PAES`,
          `Estrategias de resolución`,
          `Errores comunes a evitar`
        ],
        examples: [],
        difficulty: config.difficulty
      },
      metadata: {
        source: 'official' as const,
        difficulty: config.difficulty,
        skill: config.skill || 'INTERPRET_RELATE',
        prueba: config.prueba,
        estimatedTime: 15
      },
      createdAt: new Date()
    }));
  }

  private static getTopicsForSubject(subject: string): string[] {
    const topicMaps: Record<string, string[]> = {
      'competencia-lectora': [
        'Comprensión de textos narrativos',
        'Análisis de textos argumentativos',
        'Interpretación de textos expositivos',
        'Estrategias de lectura crítica'
      ],
      'matematica-m1': [
        'Números y operaciones',
        'Álgebra básica',
        'Geometría plana',
        'Estadística descriptiva'
      ],
      'matematica-m2': [
        'Funciones y ecuaciones',
        'Geometría analítica',
        'Probabilidades',
        'Cálculo diferencial'
      ],
      'historia': [
        'Historia de Chile siglo XX',
        'Democracia y ciudadanía',
        'Geografía de Chile',
        'Economía y sociedad'
      ],
      'ciencias': [
        'Biología celular',
        'Física mecánica',
        'Química general',
        'Método científico'
      ]
    };

    return topicMaps[subject] || ['Temas generales'];
  }
}
