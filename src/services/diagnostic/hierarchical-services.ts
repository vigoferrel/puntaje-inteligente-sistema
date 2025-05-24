
import { supabase } from "@/integrations/supabase/client";
import { LearningNode, NodeWeight, PAESTest, PAESSkill, TierPriority, BloomLevel } from "@/types/diagnostic";
import { toast } from "@/components/ui/use-toast";

/**
 * Servicios para el sistema jerárquico PAES Pro
 */

// Fetch PAES Tests
export const fetchPAESTests = async (): Promise<PAESTest[]> => {
  try {
    const { data, error } = await supabase
      .from('paes_tests')
      .select('*')
      .order('relative_weight', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching PAES tests:', error);
    return [];
  }
};

// Fetch PAES Skills
export const fetchPAESSkills = async (testId?: number): Promise<PAESSkill[]> => {
  try {
    let query = supabase
      .from('paes_skills')
      .select('*')
      .order('impact_weight', { ascending: false });

    if (testId) {
      query = query.eq('test_id', testId);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching PAES skills:', error);
    return [];
  }
};

// Fetch Learning Nodes with hierarchical filtering
export const fetchLearningNodes = async (options: {
  tierPriority?: TierPriority;
  testId?: number;
  skillId?: number;
  limit?: number;
  offset?: number;
} = {}): Promise<{ nodes: LearningNode[], total: number }> => {
  try {
    const { tierPriority, testId, skillId, limit = 50, offset = 0 } = options;

    let query = supabase
      .from('learning_nodes')
      .select('*', { count: 'exact' })
      .order('base_weight', { ascending: false })
      .order('position', { ascending: true })
      .range(offset, offset + limit - 1);

    if (tierPriority) {
      query = query.eq('tier_priority', tierPriority);
    }

    if (testId) {
      query = query.eq('test_id', testId);
    }

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      nodes: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Error fetching learning nodes:', error);
    return { nodes: [], total: 0 };
  }
};

// Fetch Tier 1 Critical Nodes
export const fetchTier1CriticalNodes = async (testId?: number): Promise<LearningNode[]> => {
  const { nodes } = await fetchLearningNodes({
    tierPriority: 'tier1_critico',
    testId,
    limit: 100
  });
  return nodes;
};

// Calculate adaptive weight for a node and user
export const calculateAdaptiveWeight = async (
  userId: string,
  nodeId: string,
  userPerformance?: number,
  careerRelevance?: number
): Promise<number> => {
  try {
    // Get base node data
    const { data: nodeData, error: nodeError } = await supabase
      .from('learning_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();

    if (nodeError || !nodeData) {
      console.error('Error fetching node data:', nodeError);
      return 1.0;
    }

    // Calculate base weight
    let finalWeight = nodeData.base_weight || 1.0;
    finalWeight *= nodeData.difficulty_multiplier || 1.0;
    finalWeight += nodeData.frequency_bonus || 0.0;
    finalWeight += nodeData.prerequisite_weight || 0.0;

    // Apply career relevance multiplier
    if (careerRelevance) {
      finalWeight *= careerRelevance;
    }

    // Apply performance adjustment
    if (userPerformance !== undefined) {
      if (userPerformance < 0.7) {
        finalWeight *= 1.3; // Increase weight for weak nodes
      } else if (userPerformance > 0.9) {
        finalWeight *= 0.8; // Reduce weight for mastered nodes
      }
    }

    // Store calculated weight
    await supabase
      .from('node_weights')
      .upsert({
        user_id: userId,
        node_id: nodeId,
        calculated_weight: Math.round(finalWeight * 100) / 100,
        career_relevance: careerRelevance || 1.0,
        performance_adjustment: userPerformance ? (userPerformance < 0.7 ? 1.3 : userPerformance > 0.9 ? 0.8 : 1.0) : 1.0,
        last_calculated: new Date().toISOString()
      });

    return Math.round(finalWeight * 100) / 100;
  } catch (error) {
    console.error('Error calculating adaptive weight:', error);
    return 1.0;
  }
};

// Get user's adaptive weights
export const fetchUserNodeWeights = async (userId: string): Promise<NodeWeight[]> => {
  try {
    const { data, error } = await supabase
      .from('node_weights')
      .select('*')
      .eq('user_id', userId)
      .order('calculated_weight', { ascending: false });

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user node weights:', error);
    return [];
  }
};

// Get recommended learning path based on hierarchy
export const getRecommendedLearningPath = async (
  userId: string,
  testId?: number,
  maxNodes: number = 10
): Promise<LearningNode[]> => {
  try {
    // First, get Tier 1 critical nodes
    const tier1Nodes = await fetchTier1CriticalNodes(testId);
    
    // Get user's current progress
    const { data: progressData } = await supabase
      .from('user_node_progress')
      .select('node_id, mastery_level, status')
      .eq('user_id', userId);

    const progressMap = new Map(
      (progressData || []).map(p => [p.node_id, p])
    );

    // Filter out completed nodes and sort by priority
    const availableNodes = tier1Nodes.filter(node => {
      const progress = progressMap.get(node.id);
      return !progress || progress.status !== 'completed' || (progress.mastery_level || 0) < 0.8;
    });

    // Sort by adaptive weight (higher weight = higher priority)
    const sortedNodes = availableNodes.sort((a, b) => {
      const weightA = a.baseWeight * a.difficultyMultiplier + a.frequencyBonus;
      const weightB = b.baseWeight * b.difficultyMultiplier + b.frequencyBonus;
      return weightB - weightA;
    });

    return sortedNodes.slice(0, maxNodes);
  } catch (error) {
    console.error('Error getting recommended learning path:', error);
    return [];
  }
};

// Get system metrics for dashboard
export const getSystemMetrics = async (): Promise<{
  totalNodes: number;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  distributionByTest: Record<string, number>;
  avgBloomLevel: number;
}> => {
  try {
    // Get total nodes by tier
    const { data: tierCounts } = await supabase
      .from('learning_nodes')
      .select('tier_priority')
      .then(result => {
        if (result.error) throw result.error;
        
        const counts = { tier1: 0, tier2: 0, tier3: 0 };
        (result.data || []).forEach(node => {
          if (node.tier_priority === 'tier1_critico') counts.tier1++;
          else if (node.tier_priority === 'tier2_importante') counts.tier2++;
          else if (node.tier_priority === 'tier3_complementario') counts.tier3++;
        });
        
        return { data: counts, error: null };
      });

    // Get distribution by test
    const { data: testDistribution } = await supabase
      .from('learning_nodes')
      .select('test_id, paes_tests(code)')
      .then(result => {
        if (result.error) throw result.error;
        
        const distribution: Record<string, number> = {};
        (result.data || []).forEach(node => {
          const testCode = node.paes_tests?.code || 'Unknown';
          distribution[testCode] = (distribution[testCode] || 0) + 1;
        });
        
        return { data: distribution, error: null };
      });

    // Calculate average Bloom level
    const bloomLevelMap: Record<BloomLevel, number> = {
      'recordar': 1,
      'comprender': 2,
      'aplicar': 3,
      'analizar': 4,
      'evaluar': 5,
      'crear': 6
    };

    const { data: bloomData } = await supabase
      .from('learning_nodes')
      .select('cognitive_level')
      .then(result => {
        if (result.error) throw result.error;
        
        const levels = (result.data || []).map(node => bloomLevelMap[node.cognitive_level as BloomLevel] || 3);
        const avgLevel = levels.reduce((sum, level) => sum + level, 0) / levels.length;
        
        return { data: avgLevel, error: null };
      });

    return {
      totalNodes: (tierCounts?.tier1 || 0) + (tierCounts?.tier2 || 0) + (tierCounts?.tier3 || 0),
      tier1Count: tierCounts?.tier1 || 0,
      tier2Count: tierCounts?.tier2 || 0,
      tier3Count: tierCounts?.tier3 || 0,
      distributionByTest: testDistribution || {},
      avgBloomLevel: bloomData || 3.2
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    return {
      totalNodes: 0,
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      distributionByTest: {},
      avgBloomLevel: 3.2
    };
  }
};
