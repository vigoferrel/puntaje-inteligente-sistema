
import { supabase } from '@/integrations/supabase/client';
import { nodeValidationService } from './node-validation-service';

export interface InitializationReport {
  success: boolean;
  totalNodes: number;
  nodesBySubject: Record<string, number>;
  nodesByTier: Record<string, number>;
  validationResult: any;
  errors: string[];
}

class EnhancedInitializationService {
  
  async getSystemStatus(): Promise<InitializationReport> {
    try {
      // Verificar cantidad total de nodos
      const { count: totalNodes, error: countError } = await supabase
        .from('learning_nodes')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Obtener distribución por materia
      const { data: subjectData, error: subjectError } = await supabase
        .from('learning_nodes')
        .select('subject_area')
        .then(result => {
          if (result.error) throw result.error;
          return {
            data: result.data?.reduce((acc, node) => {
              acc[node.subject_area] = (acc[node.subject_area] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            error: null
          };
        });

      // Obtener distribución por tier
      const { data: tierData, error: tierError } = await supabase
        .from('learning_nodes')
        .select('tier_priority')
        .then(result => {
          if (result.error) throw result.error;
          return {
            data: result.data?.reduce((acc, node) => {
              acc[node.tier_priority] = (acc[node.tier_priority] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
            error: null
          };
        });

      // Ejecutar validación completa
      const validationResult = await nodeValidationService.validateAllNodes();

      return {
        success: totalNodes === 277 && validationResult.isValid,
        totalNodes: totalNodes || 0,
        nodesBySubject: subjectData || {},
        nodesByTier: tierData || {},
        validationResult,
        errors: validationResult.issues
      };
    } catch (error) {
      console.error('Error getting system status:', error);
      return {
        success: false,
        totalNodes: 0,
        nodesBySubject: {},
        nodesByTier: {},
        validationResult: null,
        errors: [`Error del sistema: ${error}`]
      };
    }
  }

  async validateAndFixNodes(): Promise<{ fixed: number; issues: string[] }> {
    try {
      const validationResult = await nodeValidationService.validateAllNodes();
      let fixed = 0;
      const remainingIssues: string[] = [];

      // Intentar reparar automáticamente problemas comunes
      for (const issue of validationResult.issues) {
        if (issue.includes('skill_id')) {
          // Intentar corregir mapeos skill_id/test_id incorrectos
          const corrected = await this.autoFixSkillMapping(issue);
          if (corrected) fixed++;
          else remainingIssues.push(issue);
        } else {
          remainingIssues.push(issue);
        }
      }

      return { fixed, issues: remainingIssues };
    } catch (error) {
      console.error('Error in validateAndFixNodes:', error);
      return { fixed: 0, issues: [`Error: ${error}`] };
    }
  }

  private async autoFixSkillMapping(issue: string): Promise<boolean> {
    try {
      // Extraer código del nodo del mensaje de error
      const codeMatch = issue.match(/Nodo ([^:]+):/);
      if (!codeMatch) return false;

      const nodeCode = codeMatch[1];
      
      // Obtener el nodo
      const { data: node, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('code', nodeCode)
        .single();

      if (error || !node) return false;

      // Mapeo correcto skill_id según test_id
      const correctSkillId = this.getCorrectSkillId(node.test_id, node.subject_area);
      if (!correctSkillId) return false;

      // Actualizar el nodo
      const { error: updateError } = await supabase
        .from('learning_nodes')
        .update({ skill_id: correctSkillId })
        .eq('id', node.id);

      return !updateError;
    } catch (error) {
      console.error('Error auto-fixing skill mapping:', error);
      return false;
    }
  }

  private getCorrectSkillId(testId: number, subjectArea: string): number | null {
    const mappings: Record<number, Record<string, number>> = {
      1: { 'COMPETENCIA_LECTORA': 1 }, // Default para CL
      2: { 'MATEMATICA_1': 4 }, // Default para M1
      3: { 'MATEMATICA_2': 4 }, // Default para M2
      4: { 'HISTORIA': 12 }, // Default para Historia
      5: { 'CIENCIAS': 8 } // Default para Ciencias
    };

    return mappings[testId]?.[subjectArea] || null;
  }

  async getExpectedNodeDistribution(): Promise<Record<string, any>> {
    return {
      totalExpected: 277,
      bySubject: {
        'COMPETENCIA_LECTORA': 30,
        'MATEMATICA_1': 25,
        'MATEMATICA_2': 22,
        'HISTORIA': 65,
        'CIENCIAS': 135
      },
      byTier: {
        'tier1_critico': 89,
        'tier2_importante': 108,
        'tier3_complementario': 80
      }
    };
  }
}

export const enhancedInitializationService = new EnhancedInitializationService();
