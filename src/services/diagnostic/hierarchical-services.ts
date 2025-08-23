
import { supabase } from '@/integrations/supabase/client';
import { 
  PAESTest, 
  PAESSkill, 
  LearningNode, 
  NodeWeight,
  SystemMetrics,
  transformPAESTest,
  transformPAESSkill,
  transformLearningNode,
  transformNodeWeight
} from '@/types/unified-diagnostic';

/**
 * Fetch PAES tests from database with unified types
 */
export const fetchPAESTests = async (): Promise<PAESTest[]> => {
  const { data, error } = await supabase
    .from('paes_tests')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching PAES tests:', error);
    return [];
  }

  return data.map(transformPAESTest);
};

/**
 * Fetch PAES skills from database with unified types
 */
export const fetchPAESSkills = async (): Promise<PAESSkill[]> => {
  const { data, error } = await supabase
    .from('paes_skills')
    .select('*')
    .order('display_order');

  if (error) {
    console.error('Error fetching PAES skills:', error);
    return [];
  }

  return data.map(transformPAESSkill);
};

/**
 * Fetch learning nodes from database with unified types
 */
export const fetchLearningNodes = async (limit?: number): Promise<LearningNode[]> => {
  let query = supabase
    .from('learning_nodes')
    .select('*')
    .order('position');

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching learning nodes:', error);
    return [];
  }

  return data.map(transformLearningNode);
};

/**
 * Get tier 1 critical nodes based on priority
 */
export const fetchTier1CriticalNodes = async (): Promise<LearningNode[]> => {
  const { data, error } = await supabase
    .from('learning_nodes')
    .select('*')
    .eq('tier_priority', 'tier1_critico')
    .order('position');

  if (error) {
    console.error('Error fetching tier 1 critical nodes:', error);
    return [];
  }

  return data.map(transformLearningNode);
};

/**
 * Calculate adaptive weight for a node based on user performance
 */
export const calculateAdaptiveWeight = async (userId: string, nodeId: string): Promise<number> => {
  // Get user progress for this node
  const { data: progress } = await supabase
    .from('user_node_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('node_id', nodeId)
    .single();

  if (!progress) {
    return 1.0; // Default weight for new nodes
  }

  // Calculate weight based on performance
  const baseWeight = 1.0;
  const difficultyMultiplier = progress.mastery_level < 0.5 ? 1.5 : 1.0;
  const frequencyBonus = progress.attempts_count > 5 ? 0.2 : 0.0;

  return baseWeight * difficultyMultiplier + frequencyBonus;
};

/**
 * Fetch user-specific node weights with unified types
 */
export const fetchUserNodeWeights = async (userId: string): Promise<NodeWeight[]> => {
  const { data, error } = await supabase
    .from('node_weights')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user node weights:', error);
    return [];
  }

  return data.map(transformNodeWeight);
};

/**
 * Get recommended learning path for user
 */
export const getRecommendedLearningPath = async (userId: string, limit: number = 10): Promise<LearningNode[]> => {
  // For now, return nodes ordered by priority and user progress
  const { data, error } = await supabase
    .from('learning_nodes')
    .select(`
      *,
      user_node_progress!left(progress, status)
    `)
    .order('tier_priority')
    .order('position')
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended learning path:', error);
    return [];
  }

  return data.map(transformLearningNode);
};

/**
 * Get system metrics for dashboard
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const [tests, skills, nodes] = await Promise.all([
    fetchPAESTests(),
    fetchPAESSkills(),
    fetchLearningNodes()
  ]);

  const tier1Count = nodes.filter(n => n.tierPriority === 'tier1_critico').length;
  const tier2Count = nodes.filter(n => n.tierPriority === 'tier2_importante').length;
  const tier3Count = nodes.filter(n => n.tierPriority === 'tier3_complementario').length;

  // Calculate distribution by test
  const distributionByTest: Record<string, number> = {};
  tests.forEach(test => {
    const nodeCount = nodes.filter(n => n.testId === test.id).length;
    distributionByTest[test.code] = nodeCount;
  });

  // Calculate average Bloom level
  const bloomValues = { 'recordar': 1, 'comprender': 2, 'aplicar': 3, 'analizar': 4, 'evaluar': 5, 'crear': 6 };
  const avgBloomLevel = nodes.length > 0 
    ? nodes.reduce((sum, node) => sum + (bloomValues[node.cognitiveLevel] || 3), 0) / nodes.length
    : 3.0;

  return {
    totalNodes: nodes.length,
    tier1Count,
    tier2Count,
    tier3Count,
    distributionByTest,
    avgBloomLevel
  };
};
