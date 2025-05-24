
import { supabase } from '@/integrations/supabase/client';

// Simplified type definitions to match actual database schema
export interface PAESTest {
  id: number;
  name: string;
  code: string;
  description?: string;
  time_minutes: number;
  questions_count: number;
  complexity_level: string;
  is_required: boolean;
  relative_weight: number;
}

export interface PAESSkill {
  id: number;
  name: string;
  code: string;
  description?: string;
  test_id?: number;
  impact_weight: number;
  node_count: number;
  display_order: number;
}

export interface LearningNode {
  id: string;
  title: string;
  description?: string;
  code: string;
  difficulty: string;
  skill_id?: number;
  test_id?: number;
}

/**
 * Fetch PAES tests from database
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

  return data as PAESTest[];
};

/**
 * Fetch PAES skills from database
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

  return data as PAESSkill[];
};

/**
 * Fetch learning nodes from database
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

  return data as LearningNode[];
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

  return data as LearningNode[];
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
 * Fetch user-specific node weights
 */
export const fetchUserNodeWeights = async (userId: string): Promise<Record<string, number>> => {
  const { data, error } = await supabase
    .from('node_weights')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user node weights:', error);
    return {};
  }

  return data.reduce((acc, weight) => {
    acc[weight.node_id] = weight.calculated_weight;
    return acc;
  }, {} as Record<string, number>);
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

  return data as LearningNode[];
};

/**
 * Get system metrics for dashboard
 */
export const getSystemMetrics = async () => {
  const [tests, skills, nodes] = await Promise.all([
    fetchPAESTests(),
    fetchPAESSkills(),
    fetchLearningNodes()
  ]);

  return {
    totalTests: tests.length,
    totalSkills: skills.length,
    totalNodes: nodes.length,
    tier1Nodes: nodes.filter(n => (n as any).tier_priority === 'tier1_critico').length,
    lastUpdated: new Date().toISOString()
  };
};
