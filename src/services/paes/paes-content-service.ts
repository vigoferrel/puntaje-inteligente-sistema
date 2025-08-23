
import { supabase } from '@/integrations/supabase/client';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { fetchPAESHistoriaExam } from './paes-historia-service';
import { fetchPAESMatematica2Exam } from './paes-matematica2-service';
import { fetchPAESCienciasTPExam } from './paes-ciencias-tp-service';

export interface PAESQuestion {
  id: string;
  numero: number;
  enunciado: string;
  contexto?: string;
  imagen_url?: string;
  opciones: PAESOption[];
  skill_type?: TPAESHabilidad;
  content_area?: string;
  difficulty_level?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
}

export interface PAESOption {
  letra: string;
  contenido: string;
  es_correcta: boolean;
}

export interface PAESExerciseConfig {
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  count: number;
  difficulty?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  includeContext?: boolean;
}

/**
 * Servicio principal para gestionar contenido oficial PAES
 */
export class PAESContentService {
  
  /**
   * Obtiene ejercicios oficiales PAES por configuración específica
   */
  static async getOfficialExercises(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    try {
      console.log(`🎯 Obteniendo ejercicios oficiales PAES para ${config.prueba} - ${config.skill}`);
      
      let questions: PAESQuestion[] = [];
      
      switch (config.prueba) {
        case 'HISTORIA':
          questions = await this.getHistoriaQuestions(config);
          break;
        case 'MATEMATICA_2':
          questions = await this.getMatematica2Questions(config);
          break;
        case 'CIENCIAS':
          questions = await this.getCienciasQuestions(config);
          break;
        case 'COMPETENCIA_LECTORA':
          questions = await this.getCompetenciaLectoraQuestions(config);
          break;
        case 'MATEMATICA_1':
          questions = await this.getMatematica1Questions(config);
          break;
        default:
          console.warn(`Prueba no soportada: ${config.prueba}`);
          return [];
      }
      
      // Filtrar por habilidad específica si es necesario
      const filteredQuestions = this.filterBySkill(questions, config.skill);
      
      // Seleccionar cantidad solicitada
      const selectedQuestions = this.selectQuestionsByDifficulty(
        filteredQuestions, 
        config.count, 
        config.difficulty
      );
      
      console.log(`✅ Obtenidos ${selectedQuestions.length} ejercicios oficiales de ${config.prueba}`);
      return selectedQuestions;
      
    } catch (error) {
      console.error('Error obteniendo ejercicios oficiales PAES:', error);
      return [];
    }
  }
  
  /**
   * Obtiene preguntas de Historia con contexto y análisis
   */
  private static async getHistoriaQuestions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    const examData = await fetchPAESHistoriaExam();
    
    if (!examData) {
      console.warn('No se pudo cargar el examen de Historia');
      return [];
    }
    
    return examData.preguntas.map(pregunta => ({
      id: `historia-${pregunta.numero}`,
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto,
      imagen_url: pregunta.imagen_url,
      opciones: pregunta.opciones,
      skill_type: this.mapHistoriaQuestionToSkill(pregunta.numero),
      content_area: this.getHistoriaContentArea(pregunta.numero),
      difficulty_level: this.getHistoriaDifficulty(pregunta.numero)
    }));
  }
  
  /**
   * Obtiene preguntas de Matemática 2 con problemas visuales
   */
  private static async getMatematica2Questions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    const examData = await fetchPAESMatematica2Exam();
    
    if (!examData) {
      console.warn('No se pudo cargar el examen de Matemática 2');
      return [];
    }
    
    return examData.preguntas.map(pregunta => ({
      id: `matematica2-${pregunta.numero}`,
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto,
      imagen_url: pregunta.imagen_url,
      opciones: pregunta.opciones,
      skill_type: this.mapMatematica2QuestionToSkill(pregunta.numero),
      content_area: this.getMatematica2ContentArea(pregunta.numero),
      difficulty_level: this.getMatematica2Difficulty(pregunta.numero)
    }));
  }
  
  /**
   * Obtiene preguntas de Ciencias con experimentos y procesos
   */
  private static async getCienciasQuestions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    const examData = await fetchPAESCienciasTPExam();
    
    if (!examData) {
      console.warn('No se pudo cargar el examen de Ciencias');
      return [];
    }
    
    return examData.preguntas.map(pregunta => ({
      id: `ciencias-${pregunta.numero}`,
      numero: pregunta.numero,
      enunciado: pregunta.enunciado,
      contexto: pregunta.contexto,
      imagen_url: pregunta.imagen_url,
      opciones: pregunta.opciones,
      skill_type: this.mapCienciasQuestionToSkill(pregunta.numero, pregunta.area_cientifica),
      content_area: pregunta.area_cientifica,
      difficulty_level: this.getCienciasDifficulty(pregunta.numero)
    }));
  }
  
  /**
   * Obtiene preguntas de Comprensión Lectora con textos completos
   */
  private static async getCompetenciaLectoraQuestions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    // Por ahora simulamos preguntas de comprensión lectora con textos reales
    // Cuando tengamos el examen oficial de Comprensión Lectora, usar el servicio correspondiente
    return this.generateCompetenciaLectoraMockQuestions(config);
  }
  
  /**
   * Obtiene preguntas de Matemática 1
   */
  private static async getMatematica1Questions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    // Por ahora simulamos preguntas de Matemática 1
    // Cuando tengamos el examen oficial, usar el servicio correspondiente
    return this.generateMatematica1MockQuestions(config);
  }
  
  /**
   * Mapea preguntas de Historia a habilidades PAES
   */
  private static mapHistoriaQuestionToSkill(numero: number): TPAESHabilidad {
    if (numero >= 1 && numero <= 12) return 'CRITICAL_THINKING'; // Formación Ciudadana
    if (numero >= 13 && numero <= 45) return 'TEMPORAL_THINKING'; // Historia
    if (numero >= 46 && numero <= 57) return 'SOURCE_ANALYSIS'; // Historia Cont.
    if (numero >= 58 && numero <= 65) return 'MULTICAUSAL_ANALYSIS'; // Sistema Económico
    return 'TEMPORAL_THINKING';
  }
  
  /**
   * Obtiene área de contenido para Historia
   */
  private static getHistoriaContentArea(numero: number): string {
    if (numero >= 1 && numero <= 12) return 'Formación Ciudadana';
    if (numero >= 13 && numero <= 57) return 'Historia Universal y de Chile';
    if (numero >= 58 && numero <= 65) return 'Sistema Económico';
    return 'Historia';
  }
  
  /**
   * Determina dificultad para Historia
   */
  private static getHistoriaDifficulty(numero: number): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (numero <= 20) return 'BASICO';
    if (numero <= 45) return 'INTERMEDIO';
    return 'AVANZADO';
  }
  
  /**
   * Mapea preguntas de Matemática 2 a habilidades
   */
  private static mapMatematica2QuestionToSkill(numero: number): TPAESHabilidad {
    if (numero >= 1 && numero <= 20) return 'REPRESENT'; // Álgebra y funciones
    if (numero >= 21 && numero <= 35) return 'MODEL'; // Geometría
    if (numero >= 36 && numero <= 45) return 'SOLVE_PROBLEMS'; // Probabilidad
    if (numero >= 46 && numero <= 55) return 'ARGUE_COMMUNICATE'; // Cálculo
    return 'SOLVE_PROBLEMS';
  }
  
  /**
   * Obtiene área de contenido para Matemática 2
   */
  private static getMatematica2ContentArea(numero: number): string {
    if (numero >= 1 && numero <= 20) return 'Álgebra y Funciones';
    if (numero >= 21 && numero <= 35) return 'Geometría';
    if (numero >= 36 && numero <= 45) return 'Probabilidad y Estadística';
    if (numero >= 46 && numero <= 55) return 'Cálculo y Límites';
    return 'Matemática';
  }
  
  /**
   * Determina dificultad para Matemática 2
   */
  private static getMatematica2Difficulty(numero: number): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (numero <= 18) return 'BASICO';
    if (numero <= 40) return 'INTERMEDIO';
    return 'AVANZADO';
  }
  
  /**
   * Mapea preguntas de Ciencias a habilidades
   */
  private static mapCienciasQuestionToSkill(numero: number, area: string): TPAESHabilidad {
    if (area === 'BIOLOGIA') return 'PROCESS_ANALYZE';
    if (area === 'FISICA') return 'APPLY_PRINCIPLES';
    if (area === 'QUIMICA') return 'SCIENTIFIC_ARGUMENT';
    return 'APPLY_PRINCIPLES';
  }
  
  /**
   * Determina dificultad para Ciencias
   */
  private static getCienciasDifficulty(numero: number): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (numero <= 25) return 'BASICO';
    if (numero <= 55) return 'INTERMEDIO';
    return 'AVANZADO';
  }
  
  /**
   * Filtra preguntas por habilidad específica
   */
  private static filterBySkill(questions: PAESQuestion[], skill: TPAESHabilidad): PAESQuestion[] {
    return questions.filter(q => q.skill_type === skill || this.isSkillCompatible(q.skill_type, skill));
  }
  
  /**
   * Verifica si una habilidad es compatible con otra
   */
  private static isSkillCompatible(questionSkill?: TPAESHabilidad, targetSkill?: TPAESHabilidad): boolean {
    if (!questionSkill || !targetSkill) return true;
    
    // Definir compatibilidades entre habilidades
    const compatibilityMap: Record<TPAESHabilidad, TPAESHabilidad[]> = {
      'TEMPORAL_THINKING': ['SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS'],
      'SOURCE_ANALYSIS': ['TEMPORAL_THINKING', 'CRITICAL_THINKING'],
      'SOLVE_PROBLEMS': ['REPRESENT', 'MODEL'],
      'REPRESENT': ['SOLVE_PROBLEMS', 'MODEL'],
      'APPLY_PRINCIPLES': ['SCIENTIFIC_ARGUMENT', 'PROCESS_ANALYZE'],
      // ... agregar más compatibilidades
    } as any;
    
    return compatibilityMap[questionSkill]?.includes(targetSkill) || false;
  }
  
  /**
   * Selecciona preguntas por dificultad
   */
  private static selectQuestionsByDifficulty(
    questions: PAESQuestion[], 
    count: number, 
    difficulty?: 'BASICO' | 'INTERMEDIO' | 'AVANZADO'
  ): PAESQuestion[] {
    let filteredQuestions = questions;
    
    if (difficulty) {
      filteredQuestions = questions.filter(q => q.difficulty_level === difficulty);
    }
    
    // Mezclar y seleccionar
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  /**
   * Genera preguntas mock para Comprensión Lectora con textos reales
   */
  private static generateCompetenciaLectoraMockQuestions(config: PAESExerciseConfig): PAESQuestion[] {
    const textos = [
      {
        titulo: "El Cambio Climático y sus Efectos",
        contexto: `El cambio climático es uno de los desafíos más urgentes de nuestro tiempo. Los científicos han documentado un aumento promedio de 1.1°C en la temperatura global desde la era preindustrial. Este incremento, aunque pueda parecer pequeño, tiene consecuencias significativas para los ecosistemas terrestres y marinos.

Los glaciares están retrocediendo a un ritmo acelerado, el nivel del mar ha aumentado aproximadamente 20 centímetros en el último siglo, y se observan cambios en los patrones de precipitación a nivel mundial. Estas transformaciones afectan directamente la agricultura, la disponibilidad de agua dulce y la biodiversidad.

Los fenómenos meteorológicos extremos, como huracanes más intensos, sequías prolongadas y olas de calor récord, se han vuelto más frecuentes. La comunidad científica internacional coincide en que la actividad humana, particularmente las emisiones de gases de efecto invernadero, es la principal causa de estos cambios.`
      }
    ];
    
    return textos.slice(0, config.count).map((texto, index) => ({
      id: `lectura-mock-${index + 1}`,
      numero: index + 1,
      enunciado: "¿Cuál es la idea principal del texto?",
      contexto: texto.contexto,
      opciones: [
        { letra: 'A', contenido: 'El cambio climático es causado principalmente por la actividad humana y tiene múltiples efectos en el planeta.', es_correcta: true },
        { letra: 'B', contenido: 'Los glaciares están desapareciendo debido a ciclos naturales del clima.', es_correcta: false },
        { letra: 'C', contenido: 'El aumento del nivel del mar es el único efecto preocupante del cambio climático.', es_correcta: false },
        { letra: 'D', contenido: 'Los fenómenos meteorológicos extremos han existido siempre en la historia.', es_correcta: false }
      ],
      skill_type: config.skill,
      content_area: 'Comprensión Lectora',
      difficulty_level: 'INTERMEDIO'
    }));
  }
  
  /**
   * Genera preguntas mock para Matemática 1
   */
  private static generateMatematica1MockQuestions(config: PAESExerciseConfig): PAESQuestion[] {
    return Array.from({ length: config.count }, (_, index) => ({
      id: `matematica1-mock-${index + 1}`,
      numero: index + 1,
      enunciado: `Si f(x) = 2x + 3, ¿cuál es el valor de f(5)?`,
      opciones: [
        { letra: 'A', contenido: '8', es_correcta: false },
        { letra: 'B', contenido: '10', es_correcta: false },
        { letra: 'C', contenido: '13', es_correcta: true },
        { letra: 'D', contenido: '15', es_correcta: false }
      ],
      skill_type: config.skill,
      content_area: 'Álgebra Básica',
      difficulty_level: 'BASICO'
    }));
  }
}
