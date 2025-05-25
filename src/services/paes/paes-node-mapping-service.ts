import { supabase } from '@/integrations/supabase/client';

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
 * Servicio para mapear códigos técnicos de nodos a información educativa comprensible
 */
export class PAESNodeMappingService {
  
  /**
   * Cache de mapeos para mejorar performance
   */
  private static nodeCache = new Map<string, NodeEducationalInfo>();
  
  /**
   * Obtiene información educativa completa de un nodo
   */
  static async getNodeEducationalInfo(nodeId: string): Promise<NodeEducationalInfo | null> {
    try {
      // Revisar cache primero
      if (this.nodeCache.has(nodeId)) {
        return this.nodeCache.get(nodeId)!;
      }
      
      // Obtener información base del nodo
      const { data: nodeData, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('id', nodeId)
        .single();
      
      if (error || !nodeData) {
        console.warn(`No se encontró información para el nodo: ${nodeId}`);
        return null;
      }
      
      // Crear información educativa mejorada
      const educationalInfo: NodeEducationalInfo = {
        id: nodeData.id,
        technicalCode: nodeData.code,
        displayName: this.generateDisplayName(nodeData),
        description: this.generateDescription(nodeData),
        subject: this.getSubjectDisplayName(nodeData.subject_area),
        skillType: nodeData.skill_id ? await this.getSkillDisplayName(nodeData.skill_id) : 'General',
        difficulty: this.mapDifficulty(nodeData.difficulty),
        prerequisites: await this.getPrerequisiteNames(nodeData.depends_on || []),
        learningObjectives: this.generateLearningObjectives(nodeData),
        estimatedTimeMinutes: nodeData.estimated_time_minutes || 45,
        contentArea: this.getContentAreaDisplayName(nodeData.domain_category)
      };
      
      // Guardar en cache
      this.nodeCache.set(nodeId, educationalInfo);
      
      return educationalInfo;
      
    } catch (error) {
      console.error('Error obteniendo información educativa del nodo:', error);
      return null;
    }
  }
  
  /**
   * Genera nombre descriptivo basado en el contenido del nodo
   */
  private static generateDisplayName(nodeData: any): string {
    const baseTitle = nodeData.title || 'Nodo de Aprendizaje';
    const subject = nodeData.subject_area;
    const domain = nodeData.domain_category;
    
    // Mapeos específicos por materia
    const subjectMappings: Record<string, Record<string, string>> = {
      'matematicas': {
        'algebra': 'Álgebra',
        'geometria': 'Geometría',
        'funciones': 'Funciones',
        'estadistica': 'Estadística',
        'calculo': 'Cálculo'
      },
      'lectura': {
        'comprension': 'Comprensión',
        'analisis': 'Análisis',
        'interpretacion': 'Interpretación',
        'evaluacion': 'Evaluación'
      },
      'historia': {
        'tiempo': 'Pensamiento Temporal',
        'fuentes': 'Análisis de Fuentes',
        'multicausal': 'Análisis Multicausal',
        'critico': 'Pensamiento Crítico'
      },
      'ciencias': {
        'biologia': 'Biología',
        'fisica': 'Física',
        'quimica': 'Química',
        'metodologia': 'Metodología Científica'
      }
    };
    
    // Intentar generar nombre más descriptivo
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
   * Genera descripción educativa del nodo
   */
  private static generateDescription(nodeData: any): string {
    let description = nodeData.description || '';
    
    // Si no hay descripción, generar una básica
    if (!description || description.length < 20) {
      const subject = this.getSubjectDisplayName(nodeData.subject_area);
      const difficulty = this.mapDifficulty(nodeData.difficulty);
      const time = nodeData.estimated_time_minutes || 45;
      
      description = `Nodo de aprendizaje de ${subject} de nivel ${difficulty.toLowerCase()}. ` +
                   `Tiempo estimado de estudio: ${time} minutos. ` +
                   `Desarrolla competencias específicas en ${nodeData.domain_category || 'el área correspondiente'}.`;
    }
    
    return description;
  }
  
  /**
   * Obtiene nombre descriptivo de la materia
   */
  private static getSubjectDisplayName(subjectArea: string): string {
    const subjectMap: Record<string, string> = {
      'matematicas': 'Matemáticas',
      'matematicas-basica': 'Matemáticas Básicas',
      'matematicas-avanzada': 'Matemáticas Avanzadas',
      'lectura': 'Comprensión Lectora',
      'competencia-lectora': 'Competencia Lectora',
      'historia': 'Historia y Ciencias Sociales',
      'ciencias': 'Ciencias Naturales',
      'fisica': 'Física',
      'quimica': 'Química',
      'biologia': 'Biología'
    };
    
    return subjectMap[subjectArea?.toLowerCase()] || 'Área General';
  }
  
  /**
   * Obtiene nombre descriptivo del área de contenido
   */
  private static getContentAreaDisplayName(domainCategory: string): string {
    const domainMap: Record<string, string> = {
      'algebra': 'Álgebra y Funciones',
      'geometria': 'Geometría',
      'estadistica': 'Estadística y Probabilidad',
      'calculo': 'Cálculo Diferencial',
      'comprension': 'Comprensión de Textos',
      'analisis': 'Análisis Textual',
      'interpretacion': 'Interpretación',
      'evaluacion': 'Evaluación Crítica',
      'tiempo': 'Pensamiento Temporal',
      'fuentes': 'Análisis de Fuentes Históricas',
      'multicausal': 'Análisis Multicausal',
      'critico': 'Pensamiento Crítico',
      'biologia': 'Procesos Biológicos',
      'fisica': 'Principios Físicos',
      'quimica': 'Procesos Químicos',
      'metodologia': 'Metodología Científica'
    };
    
    return domainMap[domainCategory?.toLowerCase()] || 'Área Específica';
  }
  
  /**
   * Mapea dificultad técnica a descriptiva
   */
  private static mapDifficulty(difficulty: string): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (!difficulty) return 'INTERMEDIO';
    
    const difficultyLower = difficulty.toLowerCase();
    
    if (difficultyLower === 'basic' || difficultyLower === 'basico' || difficultyLower === 'easy') {
      return 'BASICO';
    }
    
    if (difficultyLower === 'advanced' || difficultyLower === 'avanzado' || difficultyLower === 'hard') {
      return 'AVANZADO';
    }
    
    return 'INTERMEDIO';
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
      
      return skillData.description || skillData.name || 'Habilidad Específica';
    } catch (error) {
      console.error('Error obteniendo información de habilidad:', error);
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
  private static generateLearningObjectives(nodeData: any): string[] {
    const objectives: string[] = [];
    
    const subject = nodeData.subject_area?.toLowerCase();
    const domain = nodeData.domain_category?.toLowerCase();
    const difficulty = nodeData.difficulty?.toLowerCase();
    
    // Objetivos específicos por materia y dominio
    if (subject === 'matematicas') {
      if (domain === 'algebra') {
        objectives.push('Resolver ecuaciones y sistemas algebraicos');
        objectives.push('Manipular expresiones algebraicas');
        if (difficulty === 'advanced') {
          objectives.push('Aplicar conceptos algebraicos en problemas complejos');
        }
      } else if (domain === 'geometria') {
        objectives.push('Analizar propiedades geométricas');
        objectives.push('Calcular áreas y volúmenes');
      }
    } else if (subject === 'lectura') {
      objectives.push('Comprender textos de diferentes tipos');
      objectives.push('Interpretar información implícita y explícita');
      if (difficulty === 'advanced') {
        objectives.push('Evaluar críticamente argumentos y perspectivas');
      }
    } else if (subject === 'historia') {
      objectives.push('Analizar procesos históricos');
      objectives.push('Interpretar fuentes históricas');
      objectives.push('Establecer relaciones causales');
    } else if (subject === 'ciencias') {
      objectives.push('Aplicar el método científico');
      objectives.push('Interpretar datos y evidencias');
      objectives.push('Explicar fenómenos naturales');
    }
    
    // Objetivo general si no hay específicos
    if (objectives.length === 0) {
      objectives.push(`Desarrollar competencias en ${this.getSubjectDisplayName(nodeData.subject_area)}`);
    }
    
    return objectives;
  }
  
  /**
   * Obtiene múltiples nodos con información educativa
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
        query = query.eq('difficulty', criteria.difficulty);
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
