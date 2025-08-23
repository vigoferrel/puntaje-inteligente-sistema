/* eslint-disable react-refresh/only-export-components */

// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { fetchPAESHistoriaExam } from './paes-historia-service';
import { fetchPAESMatematica2Exam } from './paes-matematica2-service';
import { fetchPAESCienciasTPExam } from './paes-ciencias-tp-service';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

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
   * Obtiene ejercicios oficiales PAES por configuraciÃ³n especÃ­fica
   */
  static async getOfficialExercises(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    try {
      console.log(`ðŸŽ¯ Obteniendo ejercicios oficiales PAES para ${config.prueba} - ${config.skill}`);
      
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
      
      // Filtrar por habilidad especÃ­fica si es necesario
      const filteredQuestions = this.filterBySkill(questions, config.skill);
      
      // Seleccionar cantidad solicitada
      const selectedQuestions = this.selectQuestionsByDifficulty(
        filteredQuestions, 
        config.count, 
        config.difficulty
      );
      
      console.log(`âœ… Obtenidos ${selectedQuestions.length} ejercicios oficiales de ${config.prueba}`);
      return selectedQuestions;
      
    } catch (error) {
      console.error('Error obteniendo ejercicios oficiales PAES:', error);
      return [];
    }
  }
  
  /**
   * Obtiene preguntas de Historia con contexto y anÃ¡lisis
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
   * Obtiene preguntas de MatemÃ¡tica 2 con problemas visuales
   */
  private static async getMatematica2Questions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    const examData = await fetchPAESMatematica2Exam();
    
    if (!examData) {
      console.warn('No se pudo cargar el examen de MatemÃ¡tica 2');
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
   * Obtiene preguntas de ComprensiÃ³n Lectora con textos completos
   */
  private static async getCompetenciaLectoraQuestions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    // Por ahora simulamos preguntas de comprensiÃ³n lectora con textos reales
    // Cuando tengamos el examen oficial de ComprensiÃ³n Lectora, usar el servicio correspondiente
    return this.generateCompetenciaLectoraMockQuestions(config);
  }
  
  /**
   * Obtiene preguntas de MatemÃ¡tica 1
   */
  private static async getMatematica1Questions(config: PAESExerciseConfig): Promise<PAESQuestion[]> {
    // Por ahora simulamos preguntas de MatemÃ¡tica 1
    // Cuando tengamos el examen oficial, usar el servicio correspondiente
    return this.generateMatematica1MockQuestions(config);
  }
  
  /**
   * Mapea preguntas de Historia a habilidades PAES
   */
  private static mapHistoriaQuestionToSkill(numero: number): TPAESHabilidad {
    if (numero >= 1 && numero <= 12) return 'CRITICAL_THINKING'; // FormaciÃ³n Ciudadana
    if (numero >= 13 && numero <= 45) return 'TEMPORAL_THINKING'; // Historia
    if (numero >= 46 && numero <= 57) return 'SOURCE_ANALYSIS'; // Historia Cont.
    if (numero >= 58 && numero <= 65) return 'MULTICAUSAL_ANALYSIS'; // Sistema EconÃ³mico
    return 'TEMPORAL_THINKING';
  }
  
  /**
   * Obtiene Ã¡rea de contenido para Historia
   */
  private static getHistoriaContentArea(numero: number): string {
    if (numero >= 1 && numero <= 12) return 'FormaciÃ³n Ciudadana';
    if (numero >= 13 && numero <= 57) return 'Historia Universal y de Chile';
    if (numero >= 58 && numero <= 65) return 'Sistema EconÃ³mico';
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
   * Mapea preguntas de MatemÃ¡tica 2 a habilidades
   */
  private static mapMatematica2QuestionToSkill(numero: number): TPAESHabilidad {
    if (numero >= 1 && numero <= 20) return 'REPRESENT'; // Ãlgebra y funciones
    if (numero >= 21 && numero <= 35) return 'MODEL'; // GeometrÃ­a
    if (numero >= 36 && numero <= 45) return 'SOLVE_PROBLEMS'; // Probabilidad
    if (numero >= 46 && numero <= 55) return 'ARGUE_COMMUNICATE'; // CÃ¡lculo
    return 'SOLVE_PROBLEMS';
  }
  
  /**
   * Obtiene Ã¡rea de contenido para MatemÃ¡tica 2
   */
  private static getMatematica2ContentArea(numero: number): string {
    if (numero >= 1 && numero <= 20) return 'Ãlgebra y Funciones';
    if (numero >= 21 && numero <= 35) return 'GeometrÃ­a';
    if (numero >= 36 && numero <= 45) return 'Probabilidad y EstadÃ­stica';
    if (numero >= 46 && numero <= 55) return 'CÃ¡lculo y LÃ­mites';
    return 'MatemÃ¡tica';
  }
  
  /**
   * Determina dificultad para MatemÃ¡tica 2
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
   * Filtra preguntas por habilidad especÃ­fica
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
      // ... agregar mÃ¡s compatibilidades
    } as unknown;
    
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
   * Genera preguntas mock para ComprensiÃ³n Lectora con textos reales
   */
  private static generateCompetenciaLectoraMockQuestions(config: PAESExerciseConfig): PAESQuestion[] {
    const textos = [
      {
        titulo: "El Cambio ClimÃ¡tico y sus Efectos",
        contexto: `El cambio climÃ¡tico es uno de los desafÃ­os mÃ¡s urgentes de nuestro tiempo. Los cientÃ­ficos han documentado un aumento promedio de 1.1Â°C en la temperatura global desde la era preindustrial. Este incremento, aunque pueda parecer pequeÃ±o, tiene consecuencias significativas para los ecosistemas terrestres y marinos.

Los glaciares estÃ¡n retrocediendo a un ritmo acelerado, el nivel del mar ha aumentado aproximadamente 20 centÃ­metros en el Ãºltimo siglo, y se observan cambios en los patrones de precipitaciÃ³n a nivel mundial. Estas transformaciones afectan directamente la agricultura, la disponibilidad de agua dulce y la biodiversidad.

Los fenÃ³menos meteorolÃ³gicos extremos, como huracanes mÃ¡s intensos, sequÃ­as prolongadas y olas de calor rÃ©cord, se han vuelto mÃ¡s frecuentes. La comunidad cientÃ­fica internacional coincide en que la actividad humana, particularmente las emisiones de gases de efecto invernadero, es la principal causa de estos cambios.`
      }
    ];
    
    return textos.slice(0, config.count).map((texto, index) => ({
      id: `lectura-mock-${index + 1}`,
      numero: index + 1,
      enunciado: "Â¿CuÃ¡l es la idea principal del texto?",
      contexto: texto.contexto,
      opciones: [
        { letra: 'A', contenido: 'El cambio climÃ¡tico es causado principalmente por la actividad humana y tiene mÃºltiples efectos en el planeta.', es_correcta: true },
        { letra: 'B', contenido: 'Los glaciares estÃ¡n desapareciendo debido a ciclos naturales del clima.', es_correcta: false },
        { letra: 'C', contenido: 'El aumento del nivel del mar es el Ãºnico efecto preocupante del cambio climÃ¡tico.', es_correcta: false },
        { letra: 'D', contenido: 'Los fenÃ³menos meteorolÃ³gicos extremos han existido siempre en la historia.', es_correcta: false }
      ],
      skill_type: config.skill,
      content_area: 'ComprensiÃ³n Lectora',
      difficulty_level: 'INTERMEDIO'
    }));
  }
  
  /**
   * Genera preguntas mock para MatemÃ¡tica 1
   */
  private static generateMatematica1MockQuestions(config: PAESExerciseConfig): PAESQuestion[] {
    return Array.from({ length: config.count }, (_, index) => ({
      id: `matematica1-mock-${index + 1}`,
      numero: index + 1,
      enunciado: `Si f(x) = 2x + 3, Â¿cuÃ¡l es el valor de f(5)?`,
      opciones: [
        { letra: 'A', contenido: '8', es_correcta: false },
        { letra: 'B', contenido: '10', es_correcta: false },
        { letra: 'C', contenido: '13', es_correcta: true },
        { letra: 'D', contenido: '15', es_correcta: false }
      ],
      skill_type: config.skill,
      content_area: 'Ãlgebra BÃ¡sica',
      difficulty_level: 'BASICO'
    }));
  }
}





