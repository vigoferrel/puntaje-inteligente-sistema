
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { autoCorrectNodeIssues } from '@/utils/node-validation';

/**
 * Service for loading and transforming node data from Supabase
 */
export class NodeDataService {
  /**
   * Load nodes from Supabase with auto-correction
   */
  static async loadNodes(): Promise<TLearningNode[]> {
    console.log('📊 Cargando nodos con sistema de validación mejorado...');
    
    const { data, error } = await supabase
      .from('learning_nodes')
      .select(`
        id,
        title,
        description,
        code,
        position,
        difficulty,
        estimated_time_minutes,
        skill_id,
        test_id,
        depends_on,
        cognitive_level,
        subject_area,
        created_at,
        updated_at,
        paes_skills(name, code),
        paes_tests(name, code)
      `)
      .order('test_id', { ascending: true })
      .order('position', { ascending: true });

    if (error) throw error;

    // Transform data with improved mapping and auto-correction
    const transformedNodes: TLearningNode[] = data?.map(node => {
      const mappedNode: TLearningNode = {
        id: node.id,
        title: node.title,
        description: node.description || '',
        code: node.code || `${node.id.slice(0, 8)}`,
        position: node.position || 0,
        difficulty: node.difficulty as 'basic' | 'intermediate' | 'advanced',
        estimatedTimeMinutes: node.estimated_time_minutes || 30,
        skill: node.paes_skills?.code as any,
        prueba: node.paes_tests?.code as TPAESPrueba,
        skillId: node.skill_id || 1,
        testId: node.test_id || 1,
        dependsOn: node.depends_on || [],
        createdAt: node.created_at,
        updatedAt: node.updated_at,
        // Required properties with safe defaults
        cognitive_level: node.cognitive_level || 'COMPRENDER',
        subject_area: node.subject_area || node.paes_tests?.code || 'COMPETENCIA_LECTORA'
      };

      // Apply auto-correction
      return autoCorrectNodeIssues(mappedNode);
    }) || [];

    console.log(`✅ Nodos cargados y auto-corregidos: ${transformedNodes.length} total`);
    
    return transformedNodes;
  }
}
