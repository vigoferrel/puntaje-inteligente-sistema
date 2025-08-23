
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';

export interface NodeValidationResult {
  isValid: boolean;
  issues: string[];
  stats: {
    totalNodes: number;
    byTier: Record<string, number>;
    bySubject: Record<string, number>;
    coherenceScore: number;
  };
}

export interface NodeCoherenceCheck {
  skillTestMapping: boolean;
  codeUniqueness: boolean;
  tierDistribution: boolean;
  bloomDistribution: boolean;
}

type TierPriority = 'tier1_critico' | 'tier2_importante' | 'tier3_complementario';

class NodeValidationService {
  
  async validateAllNodes(): Promise<NodeValidationResult> {
    try {
      const { data: nodes, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .order('position');

      if (error) throw error;

      const issues: string[] = [];
      const stats = {
        totalNodes: nodes?.length || 0,
        byTier: this.calculateTierDistribution(nodes || []),
        bySubject: this.calculateSubjectDistribution(nodes || []),
        coherenceScore: 0
      };

      // Validar coherencia skill_id/test_id
      const skillTestIssues = this.validateSkillTestMapping(nodes || []);
      issues.push(...skillTestIssues);

      // Validar códigos únicos
      const codeIssues = this.validateCodeUniqueness(nodes || []);
      issues.push(...codeIssues);

      // Validar distribución por tiers
      const tierIssues = this.validateTierDistribution(stats.byTier);
      issues.push(...tierIssues);

      // Validar distribución Bloom
      const bloomIssues = this.validateBloomDistribution(nodes || []);
      issues.push(...bloomIssues);

      // Calcular score de coherencia
      stats.coherenceScore = this.calculateCoherenceScore(issues.length, stats.totalNodes);

      return {
        isValid: issues.length === 0,
        issues,
        stats
      };
    } catch (error) {
      console.error('Error validating nodes:', error);
      throw error;
    }
  }

  private validateSkillTestMapping(nodes: any[]): string[] {
    const issues: string[] = [];
    const mappingRules = {
      1: [1, 2, 3], // Competencia Lectora
      2: [4, 5, 6, 7], // Matemática M1
      3: [4, 5, 6, 7], // Matemática M2
      4: [12, 13, 14, 15, 16], // Historia
      5: [8, 9, 10, 11] // Ciencias
    };

    nodes.forEach(node => {
      const validSkills = mappingRules[node.test_id as keyof typeof mappingRules];
      if (validSkills && !validSkills.includes(node.skill_id)) {
        issues.push(`Nodo ${node.code}: skill_id ${node.skill_id} no es válido para test_id ${node.test_id}`);
      }
    });

    return issues;
  }

  private validateCodeUniqueness(nodes: any[]): string[] {
    const issues: string[] = [];
    const codeMap = new Map<string, number>();
    
    nodes.forEach(node => {
      const count = codeMap.get(node.code) || 0;
      codeMap.set(node.code, count + 1);
    });

    codeMap.forEach((count, code) => {
      if (count > 1) {
        issues.push(`Código duplicado encontrado: ${code} (${count} veces)`);
      }
    });

    return issues;
  }

  private validateTierDistribution(byTier: Record<string, number>): string[] {
    const issues: string[] = [];
    const expectedDistribution = {
      tier1_critico: { min: 80, max: 95 },
      tier2_importante: { min: 100, max: 115 },
      tier3_complementario: { min: 75, max: 85 }
    };

    Object.entries(expectedDistribution).forEach(([tier, range]) => {
      const count = byTier[tier] || 0;
      if (count < range.min || count > range.max) {
        issues.push(`Tier ${tier}: ${count} nodos (esperado: ${range.min}-${range.max})`);
      }
    });

    return issues;
  }

  private validateBloomDistribution(nodes: any[]): string[] {
    const issues: string[] = [];
    const bloomCount = nodes.reduce((acc, node) => {
      acc[node.cognitive_level] = (acc[node.cognitive_level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Validar que tenemos distribución equilibrada de Bloom
    const minBloomCount = Math.floor(nodes.length * 0.05); // Al menos 5% por nivel
    Object.entries(bloomCount).forEach(([level, count]) => {
      if (typeof count === 'number' && count < minBloomCount) {
        issues.push(`Nivel Bloom ${level}: solo ${count} nodos (mínimo: ${minBloomCount})`);
      }
    });

    return issues;
  }

  private calculateTierDistribution(nodes: any[]): Record<string, number> {
    return nodes.reduce((acc, node) => {
      acc[node.tier_priority] = (acc[node.tier_priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateSubjectDistribution(nodes: any[]): Record<string, number> {
    return nodes.reduce((acc, node) => {
      acc[node.subject_area] = (acc[node.subject_area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateCoherenceScore(issueCount: number, totalNodes: number): number {
    if (totalNodes === 0) return 0;
    const errorRate = issueCount / totalNodes;
    return Math.max(0, Math.round((1 - errorRate) * 100));
  }

  async getNodesBySubjectAndTier(subject: string, tier?: string): Promise<any[]> {
    let query = supabase
      .from('learning_nodes')
      .select('*')
      .eq('subject_area', subject);

    if (tier && this.isValidTier(tier)) {
      query = query.eq('tier_priority', tier);
    }

    const { data, error } = await query.order('position');
    
    if (error) throw error;
    return data || [];
  }

  private isValidTier(tier: string): tier is TierPriority {
    return ['tier1_critico', 'tier2_importante', 'tier3_complementario'].includes(tier);
  }

  async validateNodeDependencies(nodeId: string): Promise<string[]> {
    const issues: string[] = [];
    
    try {
      const { data: node, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('id', nodeId)
        .single();

      if (error || !node) {
        issues.push('Nodo no encontrado');
        return issues;
      }

      // Validar prerequisites si existen
      if (node.depends_on && node.depends_on.length > 0) {
        const { data: prerequisites } = await supabase
          .from('learning_nodes')
          .select('id, code')
          .in('id', node.depends_on);

        const foundIds = prerequisites?.map(p => p.id) || [];
        const missingDeps = node.depends_on.filter((id: string) => !foundIds.includes(id));
        
        missingDeps.forEach((id: string) => {
          issues.push(`Prerequisito faltante: ${id}`);
        });
      }

      return issues;
    } catch (error) {
      issues.push(`Error validando dependencias: ${error}`);
      return issues;
    }
  }
}

export const nodeValidationService = new NodeValidationService();
