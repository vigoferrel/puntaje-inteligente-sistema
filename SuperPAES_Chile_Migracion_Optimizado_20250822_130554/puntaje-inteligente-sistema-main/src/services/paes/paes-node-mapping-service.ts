/* eslint-disable react-refresh/only-export-components */
// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

interface NodeData {
  id: string;
  title?: string;
  description?: string;
  code?: string;
  subject_area?: string;
  domain_category?: string;
  difficulty?: string;
  estimated_time_minutes?: number;
  skill_id?: number;
}

export interface NodeEducationalInfo {
  id: string;
  technicalCode: string;
  displayName: string;
  description: string;
  subject: string;
  skillType: string;
  difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
  prerequisites: string[];
  learningObjectives: string[];
  estimatedTimeMinutes: number;
  contentArea: string;
}

/**
 * Servicio para mapear cÃ³digos tÃ©cnicos de nodos a informaciÃ³n educativa comprensible
 */
export class PAESNodeMappingService {
  
  /**
   * Cache de mapeos para mejorar performance
   */
  private static nodeCache = new Map<string, NodeEducationalInfo>();
  
  /**
   * Obtiene informaciÃ³n educativa completa de un nodo
   */
  static async getNodeEducationalInfo(nodeId: string): Promise<NodeEducationalInfo | null> {
    try {
      // Revisar cache primero
      if (this.nodeCache.has(nodeId)) {
        return this.nodeCache.get(nodeId)!;
      }
      
      // Obtener informaciÃ³n base del nodo
      const { data: nodeData, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('id', nodeId)
        .single();
      
      if (error || !nodeData) {
        console.warn(`No se encontrÃ³ informaciÃ³n para el nodo: ${nodeId}`);
        return null;
      }
      
      // Crear informaciÃ³n educativa mejorada
      const educationalInfo: NodeEducationalInfo = {
        id: nodeData.id,
        technicalCode: nodeData.code,
        displayName: this.generateDisplayName(nodeData),
        description: this.generateDescription(nodeData),
        subject: this.getSubjectDisplayName(nodeData.subject_area),
        skillType: nodeData.skill_id ? await this.getSkillDisplayName(nodeData.skill_id) : 'General',
        difficulty: this.mapDifficultyLevel(nodeData.difficulty),
        prerequisites: await this.getPrerequisiteNames(nodeData.depends_on || []),
        learningObjectives: this.generateLearningObjectives(nodeData),
        estimatedTimeMinutes: nodeData.estimated_time_minutes || 45,
        contentArea: this.getContentAreaDisplayName(nodeData.domain_category)
      };
      
      // Guardar en cache
      this.nodeCache.set(nodeId, educationalInfo);
      
      return educationalInfo;
      
    } catch (error) {
      console.error('Error obteniendo informaciÃ³n educativa del nodo:', error);
      return null;
    }
  }
  
  /**
   * Genera nombre descriptivo basado en el contenido del nodo
   */
  private static generateDisplayName(nodeData: NodeData): string {
    const baseTitle = nodeData.title || 'Nodo de Aprendizaje';
    const subject = nodeData.subject_area;
    const domain = nodeData.domain_category;
    
    // Mapeos especÃ­ficos por materia
    const subjectMappings: Record<string, Record<string, string>> = {
      'matematicas': {
        'algebra': 'Ãlgebra',
        'geometria': 'GeometrÃ­a',
        'funciones': 'Funciones',
        'estadistica': 'EstadÃ­stica',
        'calculo': 'CÃ¡lculo'
      },
      'lectura': {
        'comprension': 'ComprensiÃ³n',
        'analisis': 'AnÃ¡lisis',
        'interpretacion': 'InterpretaciÃ³n',
        'evaluacion': 'EvaluaciÃ³n'
      },
      'historia': {
        'tiempo': 'Pensamiento Temporal',
        'fuentes': 'AnÃ¡lisis de Fuentes',
        'multicausal': 'AnÃ¡lisis Multicausal',
        'critico': 'Pensamiento CrÃ­tico'
      },
      'ciencias': {
        'biologia': 'BiologÃ­a',
        'fisica': 'FÃ­sica',
        'quimica': 'QuÃ­mica',
        'metodologia': 'MetodologÃ­a CientÃ­fica'
      }
    };
    
    // Intentar generar nombre mÃ¡s descriptivo
    let displayName = baseTitle;
    
    if (subject && domain) {
      const subjectMap = subjectMappings[subject.toLowerCase()];
      if (subjectMap && subjectMap[domain.toLowerCase()]) {
        displayName = `${subjectMap[domain.toLowerCase()]}: ${baseTitle}`;
      }
    }
    
    return this.cleanDisplayName(displayName);
  }
  
  /**
   * Limpia y mejora el nombre para mostrar
   */
  private static cleanDisplayName(name: string): string {
    return name
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Genera descripciÃ³n educativa del nodo
   */
  private static generateDescription(nodeData: NodeData): string {
    let description = nodeData.description || '';
    
    // Si no hay descripciÃ³n, generar una bÃ¡sica
    if (!description || description.length < 20) {
      const subject = this.getSubjectDisplayName(nodeData.subject_area);
      const difficulty = this.mapDifficultyLevel(nodeData.difficulty);
      const time = nodeData.estimated_time_minutes || 45;
      
      description = `Nodo de aprendizaje de ${subject} de nivel ${difficulty.toLowerCase()}. ` +
                   `Tiempo estimado de estudio: ${time} minutos. ` +
                   `Desarrolla competencias especÃ­ficas en ${nodeData.domain_category || 'el Ã¡rea correspondiente'}.`;
    }
    
    return description;
  }
  
  /**
   * Obtiene nombre descriptivo de la materia
   */
  private static getSubjectDisplayName(subjectArea: string): string {
    const subjectMap: Record<string, string> = {
      'matematicas': 'MatemÃ¡ticas',
      'matematicas-basica': 'MatemÃ¡ticas BÃ¡sicas',
      'matematicas-avanzada': 'MatemÃ¡ticas Avanzadas',
      'lectura': 'ComprensiÃ³n Lectora',
      'competencia-lectora': 'Competencia Lectora',
      'historia': 'Historia y Ciencias Sociales',
      'ciencias': 'Ciencias Naturales',
      'fisica': 'FÃ­sica',
      'quimica': 'QuÃ­mica',
      'biologia': 'BiologÃ­a'
    };
    
    return subjectMap[subjectArea?.toLowerCase()] || 'Ãrea General';
  }
  
  /**
   * Obtiene nombre descriptivo del Ã¡rea de contenido
   */
  private static getContentAreaDisplayName(domainCategory: string): string {
    const domainMap: Record<string, string> = {
      'algebra': 'Ãlgebra y Funciones',
      'geometria': 'GeometrÃ­a',
      'estadistica': 'EstadÃ­stica y Probabilidad',
      'calculo': 'CÃ¡lculo Diferencial',
      'comprension': 'ComprensiÃ³n de Textos',
      'analisis': 'AnÃ¡lisis Textual',
      'interpretacion': 'InterpretaciÃ³n',
      'evaluacion': 'EvaluaciÃ³n CrÃ­tica',
      'tiempo': 'Pensamiento Temporal',
      'fuentes': 'AnÃ¡lisis de Fuentes HistÃ³ricas',
      'multicausal': 'AnÃ¡lisis Multicausal',
      'critico': 'Pensamiento CrÃ­tico',
      'biologia': 'Procesos BiolÃ³gicos',
      'fisica': 'Principios FÃ­sicos',
      'quimica': 'Procesos QuÃ­micos',
      'metodologia': 'MetodologÃ­a CientÃ­fica'
    };
    
    return domainMap[domainCategory?.toLowerCase()] || 'Ãrea EspecÃ­fica';
  }
  
  /**
   * Mapea dificultad tÃ©cnica a descriptiva
   */
  private static mapDifficultyLevel(difficulty: unknown): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (!difficulty) return 'INTERMEDIO';
    
    const difficultyStr = String(difficulty).toLowerCase();
    
    if (difficultyStr === 'basic' || difficultyStr === 'basico' || difficultyStr === 'easy') {
      return 'BASICO';
    }
    
    if (difficultyStr === 'advanced' || difficultyStr === 'avanzado' || difficultyStr === 'hard') {
      return 'AVANZADO';
    }
    
    return 'INTERMEDIO';
  }
  
  /**
   * Mapea dificultad de interfaz a base de datos
   */
  private static mapDifficultyToDatabase(difficulty: string): 'basic' | 'intermediate' | 'advanced' {
    const difficultyStr = difficulty.toLowerCase();
    
    if (difficultyStr === 'basico' || difficultyStr === 'bÃ¡sico' || difficultyStr === 'basic') {
      return 'basic';
    }
    
    if (difficultyStr === 'avanzado' || difficultyStr === 'advanced') {
      return 'advanced';
    }
    
    return 'intermediate';
  }
  
  /**
   * Obtiene nombre descriptivo de la habilidad
   */
  private static async getSkillDisplayName(skillId: number): Promise<string> {
    try {
      const { data: skillData, error } = await supabase
        .from('paes_skills')
        .select('name, description')
        .eq('id', skillId)
        .single();
      
      if (error || !skillData) {
        return 'Habilidad General';
      }
      
      return skillData.description || skillData.name || 'Habilidad EspecÃ­fica';
    } catch (error) {
      console.error('Error obteniendo informaciÃ³n de habilidad:', error);
      return 'Habilidad General';
    }
  }
  
  /**
   * Obtiene nombres de prerequisitos
   */
  private static async getPrerequisiteNames(prerequisiteIds: string[]): Promise<string[]> {
    if (!prerequisiteIds || prerequisiteIds.length === 0) {
      return [];
    }
    
    try {
      const { data: prerequisiteData, error } = await supabase
        .from('learning_nodes')
        .select('title, code')
        .in('id', prerequisiteIds);
      
      if (error || !prerequisiteData) {
        return [];
      }
      
      return prerequisiteData.map(node => this.cleanDisplayName(node.title || node.code));
    } catch (error) {
      console.error('Error obteniendo prerequisitos:', error);
      return [];
    }
  }
  
  /**
   * Genera objetivos de aprendizaje basados en el nodo
   */
  private static generateLearningObjectives(nodeData: NodeData): string[] {
    const objectives: string[] = [];
    
    const subject = nodeData.subject_area?.toLowerCase();
    const domain = nodeData.domain_category?.toLowerCase();
    const difficulty = nodeData.difficulty?.toLowerCase();
    
    // Objetivos especÃ­ficos por materia y dominio
    if (subject === 'matematicas') {
      if (domain === 'algebra') {
        objectives.push('Resolver ecuaciones y sistemas algebraicos');
        objectives.push('Manipular expresiones algebraicas');
        if (difficulty === 'advanced') {
          objectives.push('Aplicar conceptos algebraicos en problemas complejos');
        }
      } else if (domain === 'geometria') {
        objectives.push('Analizar propiedades geomÃ©tricas');
        objectives.push('Calcular Ã¡reas y volÃºmenes');
      }
    } else if (subject === 'lectura') {
      objectives.push('Comprender textos de diferentes tipos');
      objectives.push('Interpretar informaciÃ³n implÃ­cita y explÃ­cita');
      if (difficulty === 'advanced') {
        objectives.push('Evaluar crÃ­ticamente argumentos y perspectivas');
      }
    } else if (subject === 'historia') {
      objectives.push('Analizar procesos histÃ³ricos');
      objectives.push('Interpretar fuentes histÃ³ricas');
      objectives.push('Establecer relaciones causales');
    } else if (subject === 'ciencias') {
      objectives.push('Aplicar el mÃ©todo cientÃ­fico');
      objectives.push('Interpretar datos y evidencias');
      objectives.push('Explicar fenÃ³menos naturales');
    }
    
    // Objetivo general si no hay especÃ­ficos
    if (objectives.length === 0) {
      objectives.push(`Desarrollar competencias en ${this.getSubjectDisplayName(nodeData.subject_area)}`);
    }
    
    return objectives;
  }
  
  /**
   * Obtiene mÃºltiples nodos con informaciÃ³n educativa
   */
  static async getMultipleNodesInfo(nodeIds: string[]): Promise<NodeEducationalInfo[]> {
    const results: NodeEducationalInfo[] = [];
    
    for (const nodeId of nodeIds) {
      const nodeInfo = await this.getNodeEducationalInfo(nodeId);
      if (nodeInfo) {
        results.push(nodeInfo);
      }
    }
    
    return results;
  }
  
  /**
   * Busca nodos por criterios educativos
   */
  static async searchNodesByEducationalCriteria(criteria: {
    subject?: string;
    difficulty?: string;
    contentArea?: string;
    skillType?: string;
  }): Promise<NodeEducationalInfo[]> {
    try {
      let query = supabase.from('learning_nodes').select('*');
      
      if (criteria.subject) {
        query = query.eq('subject_area', criteria.subject);
      }
      
      if (criteria.difficulty) {
        // Convert UI difficulty to database difficulty
        const dbDifficulty = this.mapDifficultyToDatabase(criteria.difficulty);
        query = query.eq('difficulty', dbDifficulty);
      }
      
      if (criteria.contentArea) {
        query = query.eq('domain_category', criteria.contentArea);
      }
      
      const { data: nodesData, error } = await query.limit(20);
      
      if (error || !nodesData) {
        return [];
      }
      
      const results: NodeEducationalInfo[] = [];
      for (const nodeData of nodesData) {
        const nodeInfo = await this.getNodeEducationalInfo(nodeData.id);
        if (nodeInfo) {
          results.push(nodeInfo);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error buscando nodos por criterios educativos:', error);
      return [];
    }
  }
}





