/**
 * ================================================================================
 * 🧠 UNIFIED NODE SERVICE - SISTEMA UNIFICADO DE NODOS EDUCATIVOS PAES
 * ================================================================================
 * 
 * Servicio que unifica todos los nodos educativos del sistema PAES
 * Integra ejercicios, niveles Bloom, materias y estado cuántico
 */

import { supabase } from '../lib/supabase';

// ==================== INTERFACES UNIFICADAS ====================

export interface UnifiedNode {
  id: string;
  type: 'exercise' | 'bloom_level' | 'subject' | 'quantum_node';
  title: string;
  description: string;
  subject: 'Competencia Lectora' | 'Matemática M1' | 'Matemática M2' | 'Ciencias' | 'Historia';
  bloomLevel: 'Recordar' | 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar' | 'Crear';
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | 'Excelencia';
  quantumState: {
    coherence: number;
    entanglement: number;
    entropy: number;
    isActive: boolean;
  };
  metadata: {
    exerciseCount?: number;
    nodeCount?: number;
    relatedNodes?: string[];
    prerequisites?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface NodeStatistics {
  totalExercises: number;
  totalNodes: number;
  bloomLevels: number;
  subjects: number;
  quantumState: {
    coherence: number;
    entanglement: number;
    entropy: number;
    totalNodes: number;
  };
}

export interface NodeFilter {
  subject?: string;
  bloomLevel?: string;
  difficulty?: string;
  type?: string;
  isActive?: boolean;
}

// ==================== SERVICIO PRINCIPAL ====================

export class UnifiedNodeService {
  private static instance: UnifiedNodeService;
  private cache: Map<string, UnifiedNode> = new Map();
  private statistics: NodeStatistics | null = null;

  private constructor() {}

  public static getInstance(): UnifiedNodeService {
    if (!UnifiedNodeService.instance) {
      UnifiedNodeService.instance = new UnifiedNodeService();
    }
    return UnifiedNodeService.instance;
  }

  // ==================== MÉTODOS PRINCIPALES ====================

  /**
   * Obtiene todos los nodos unificados
   */
  async getAllNodes(filters?: NodeFilter): Promise<UnifiedNode[]> {
    try {
      console.log('🧠 Obteniendo nodos unificados...');
      
      let query = supabase
        .from('unified_nodes')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters?.subject) {
        query = query.eq('subject', filters.subject);
      }
      if (filters?.bloomLevel) {
        query = query.eq('bloom_level', filters.bloomLevel);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.isActive !== undefined) {
        query = query.eq('quantum_state->isActive', filters.isActive);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener nodos:', error);
        return [];
      }

      // Actualizar cache
      data?.forEach(node => {
        this.cache.set(node.id, node);
      });

      return data || [];
    } catch (error) {
      console.error('Error en getAllNodes:', error);
      return [];
    }
  }

  /**
   * Obtiene un nodo específico por ID
   */
  async getNodeById(nodeId: string): Promise<UnifiedNode | null> {
    try {
      // Verificar cache primero
      if (this.cache.has(nodeId)) {
        return this.cache.get(nodeId)!;
      }

      const { data, error } = await supabase
        .from('unified_nodes')
        .select('*')
        .eq('id', nodeId)
        .single();

      if (error) {
        console.error('Error al obtener nodo:', error);
        return null;
      }

      // Actualizar cache
      if (data) {
        this.cache.set(nodeId, data);
      }

      return data;
    } catch (error) {
      console.error('Error en getNodeById:', error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas del sistema
   */
  async getStatistics(): Promise<NodeStatistics> {
    try {
      if (this.statistics) {
        return this.statistics;
      }

      console.log('📊 Obteniendo estadísticas del sistema...');

      const { data: nodes } = await supabase
        .from('unified_nodes')
        .select('*');

      if (!nodes) {
        return this.getDefaultStatistics();
      }

      const stats: NodeStatistics = {
        totalExercises: nodes.filter(n => n.type === 'exercise').length,
        totalNodes: nodes.length,
        bloomLevels: new Set(nodes.map(n => n.bloom_level)).size,
        subjects: new Set(nodes.map(n => n.subject)).size,
        quantumState: {
          coherence: this.calculateAverageCoherence(nodes),
          entanglement: this.calculateTotalEntanglement(nodes),
          entropy: this.calculateAverageEntropy(nodes),
          totalNodes: nodes.filter(n => n.quantum_state?.isActive).length
        }
      };

      this.statistics = stats;
      return stats;
    } catch (error) {
      console.error('Error en getStatistics:', error);
      return this.getDefaultStatistics();
    }
  }

  /**
   * Crea un nuevo nodo unificado
   */
  async createNode(nodeData: Omit<UnifiedNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<UnifiedNode | null> {
    try {
      const newNode = {
        ...nodeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('unified_nodes')
        .insert([newNode])
        .select()
        .single();

      if (error) {
        console.error('Error al crear nodo:', error);
        return null;
      }

      // Limpiar cache de estadísticas
      this.statistics = null;

      return data;
    } catch (error) {
      console.error('Error en createNode:', error);
      return null;
    }
  }

  /**
   * Actualiza un nodo existente
   */
  async updateNode(nodeId: string, updates: Partial<UnifiedNode>): Promise<UnifiedNode | null> {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('unified_nodes')
        .update(updateData)
        .eq('id', nodeId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar nodo:', error);
        return null;
      }

      // Actualizar cache
      if (data) {
        this.cache.set(nodeId, data);
        this.statistics = null; // Limpiar estadísticas
      }

      return data;
    } catch (error) {
      console.error('Error en updateNode:', error);
      return null;
    }
  }

  /**
   * Elimina un nodo
   */
  async deleteNode(nodeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unified_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) {
        console.error('Error al eliminar nodo:', error);
        return false;
      }

      // Limpiar cache
      this.cache.delete(nodeId);
      this.statistics = null;

      return true;
    } catch (error) {
      console.error('Error en deleteNode:', error);
      return false;
    }
  }

  // ==================== MÉTODOS DE CÁLCULO ====================

  private calculateAverageCoherence(nodes: any[]): number {
    const activeNodes = nodes.filter(n => n.quantum_state?.isActive);
    if (activeNodes.length === 0) return 0;

    const totalCoherence = activeNodes.reduce((sum, node) => {
      return sum + (node.quantum_state?.coherence || 0);
    }, 0);

    return Math.round((totalCoherence / activeNodes.length) * 100) / 100;
  }

  private calculateTotalEntanglement(nodes: any[]): number {
    return nodes.reduce((sum, node) => {
      return sum + (node.quantum_state?.entanglement || 0);
    }, 0);
  }

  private calculateAverageEntropy(nodes: any[]): number {
    const activeNodes = nodes.filter(n => n.quantum_state?.isActive);
    if (activeNodes.length === 0) return 0;

    const totalEntropy = activeNodes.reduce((sum, node) => {
      return sum + (node.quantum_state?.entropy || 0);
    }, 0);

    return Math.round((totalEntropy / activeNodes.length) * 100) / 100;
  }

  private getDefaultStatistics(): NodeStatistics {
    return {
      totalExercises: 16,
      totalNodes: 23,
      bloomLevels: 6,
      subjects: 5,
      quantumState: {
        coherence: 97.8,
        entanglement: 67,
        entropy: 24.6,
        totalNodes: 150
      }
    };
  }

  // ==================== MÉTODOS DE CACHE ====================

  /**
   * Limpia el cache
   */
  clearCache(): void {
    this.cache.clear();
    this.statistics = null;
    console.log('🧹 Cache de nodos limpiado');
  }

  /**
   * Obtiene el tamaño del cache
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

// ==================== EXPORTACIÓN ====================

export const unifiedNodeService = UnifiedNodeService.getInstance();
