
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface RealNeuralMetrics {
  neural_efficiency: number;
  cognitive_load: number;
  learning_velocity: number;
  pattern_recognition: number;
  adaptive_intelligence: number;
  creative_synthesis: number;
  strategic_thinking: number;
  emotional_intelligence: number;
  leadership_potential: number;
  innovation_index: number;
  universe_exploration_depth: number;
  paes_simulation_accuracy: number;
  gamification_engagement: number;
  achievement_momentum: number;
  battle_readiness: number;
  vocational_alignment: number;
  // Legacy compatibility properties
  user_satisfaction: number;
  adaptive_learning_rate: number;
  system_coherence: number;
  prediction_accuracy: number;
}

export const useRealNeuralMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealNeuralMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateMetrics = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Obtener progreso de nodos
      const { data: progressData, error: progressError } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Obtener logros
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) throw achievementsError;

      // Obtener batallas
      const { data: battlesData, error: battlesError } = await supabase
        .from('battle_sessions')
        .select('*')
        .or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`);

      if (battlesError) throw battlesError;

      // Calcular métricas basadas en datos reales
      const calculatedMetrics: RealNeuralMetrics = {
        neural_efficiency: calculateNeuralEfficiency(progressData || [], achievementsData || []),
        cognitive_load: calculateCognitiveLoad(progressData || []),
        learning_velocity: calculateLearningVelocity(progressData || []),
        pattern_recognition: calculatePatternRecognition(progressData || [], battlesData || []),
        adaptive_intelligence: calculateAdaptiveIntelligence(progressData || []),
        creative_synthesis: calculateCreativeSynthesis(achievementsData || [], progressData || []),
        strategic_thinking: calculateStrategicThinking(battlesData || [], progressData || []),
        emotional_intelligence: calculateEmotionalIntelligence(achievementsData || []),
        leadership_potential: calculateLeadershipPotential(battlesData || [], achievementsData || []),
        innovation_index: calculateInnovationIndex(progressData || [], achievementsData || []),
        universe_exploration_depth: calculateUniverseExploration(progressData || []),
        paes_simulation_accuracy: calculatePAESAccuracy(progressData || []),
        gamification_engagement: calculateGamificationEngagement(achievementsData || [], battlesData || []),
        achievement_momentum: calculateAchievementMomentum(achievementsData || []),
        battle_readiness: calculateBattleReadiness(battlesData || []),
        vocational_alignment: calculateVocationalAlignment(progressData || [], achievementsData || []),
        
        // Legacy compatibility
        user_satisfaction: calculateNeuralEfficiency(progressData || [], achievementsData || []),
        adaptive_learning_rate: calculateLearningVelocity(progressData || []),
        system_coherence: calculateAdaptiveIntelligence(progressData || []),
        prediction_accuracy: calculatePAESAccuracy(progressData || [])
      };

      setMetrics(calculatedMetrics);
      setError(null);
    } catch (err) {
      console.error('Error calculating neural metrics:', err);
      setError(err instanceof Error ? err.message : 'Error calculating metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const getMetricForDimension = (dimensionId: string): number => {
    if (!metrics) return 0;
    return metrics[dimensionId as keyof RealNeuralMetrics] || 0;
  };

  useEffect(() => {
    if (user) {
      calculateMetrics();
      
      // Actualizar métricas cada 5 minutos
      const interval = setInterval(calculateMetrics, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    metrics,
    isLoading,
    error,
    refetch: calculateMetrics,
    getMetricForDimension
  };
};

// Funciones de cálculo simplificadas
function calculateNeuralEfficiency(progressData: any[], achievementsData: any[]): number {
  const completedNodes = progressData.filter(p => p.status === 'completed').length;
  const totalProgress = progressData.reduce((sum, p) => sum + (p.progress || 0), 0);
  const achievementBonus = achievementsData.length * 2;
  return Math.min(100, (totalProgress / Math.max(progressData.length, 1)) + achievementBonus);
}

function calculateCognitiveLoad(progressData: any[]): number {
  const activeNodes = progressData.filter(p => p.status === 'in_progress').length;
  const avgMastery = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / Math.max(progressData.length, 1);
  return Math.max(0, Math.min(100, (activeNodes * 10) + (100 - avgMastery * 100)));
}

function calculateLearningVelocity(progressData: any[]): number {
  const recentProgress = progressData.filter(p => {
    const lastActivity = new Date(p.last_activity_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastActivity > weekAgo;
  });
  return Math.min(100, recentProgress.length * 8);
}

function calculatePatternRecognition(progressData: any[], battlesData: any[]): number {
  const successRate = progressData.reduce((sum, p) => sum + (p.success_rate || 0), 0) / Math.max(progressData.length, 1);
  const battleWins = battlesData.filter(b => b.winner_id).length;
  return Math.min(100, (successRate * 70) + (battleWins * 5));
}

function calculateAdaptiveIntelligence(progressData: any[]): number {
  const adaptiveNodes = progressData.filter(p => (p.mastery_level || 0) > 0.7).length;
  const diversityScore = new Set(progressData.map(p => p.node_id)).size * 5;
  return Math.min(100, adaptiveNodes * 3 + diversityScore);
}

function calculateCreativeSynthesis(achievementsData: any[], progressData: any[]): number {
  const creativeAchievements = achievementsData.filter(a => 
    a.category === 'creative' || a.achievement_type === 'innovation'
  ).length;
  const crossDisciplinaryProgress = progressData.filter(p => (p.progress || 0) > 0.5).length;
  return Math.min(100, creativeAchievements * 15 + crossDisciplinaryProgress * 2);
}

function calculateStrategicThinking(battlesData: any[], progressData: any[]): number {
  const strategicWins = battlesData.filter(b => 
    b.winner_id && b.battle_type === 'strategic'
  ).length;
  const planningScore = progressData.filter(p => p.status === 'completed').length * 2;
  return Math.min(100, strategicWins * 20 + planningScore);
}

function calculateEmotionalIntelligence(achievementsData: any[]): number {
  const socialAchievements = achievementsData.filter(a => 
    a.category === 'social' || a.achievement_type === 'collaboration'
  ).length;
  const consistencyBonus = achievementsData.length > 10 ? 20 : 0;
  return Math.min(100, socialAchievements * 12 + consistencyBonus);
}

function calculateLeadershipPotential(battlesData: any[], achievementsData: any[]): number {
  const leadershipBattles = battlesData.filter(b => b.creator_id).length;
  const leadershipAchievements = achievementsData.filter(a => 
    a.category === 'leadership' || a.rarity === 'legendary'
  ).length;
  return Math.min(100, leadershipBattles * 8 + leadershipAchievements * 15);
}

function calculateInnovationIndex(progressData: any[], achievementsData: any[]): number {
  const innovativeProgress = progressData.filter(p => 
    p.node_id && (p.node_id.includes('innovation') || (p.mastery_level || 0) > 0.9)
  ).length;
  const rareAchievements = achievementsData.filter(a => 
    a.rarity === 'epic' || a.rarity === 'legendary'
  ).length;
  return Math.min(100, innovativeProgress * 10 + rareAchievements * 20);
}

function calculateUniverseExploration(progressData: any[]): number {
  const universeNodes = progressData.filter(p => 
    p.node_id && (p.node_id.includes('universe') || p.node_id.includes('3d'))
  );
  const explorationDepth = universeNodes.reduce((sum, p) => sum + (p.progress || 0), 0);
  return Math.min(100, explorationDepth * 5);
}

function calculatePAESAccuracy(progressData: any[]): number {
  const paesNodes = progressData.filter(p => 
    p.node_id && (p.node_id.includes('paes') || p.node_id.includes('simulation'))
  );
  const avgAccuracy = paesNodes.reduce((sum, p) => sum + (p.success_rate || 0), 0) / Math.max(paesNodes.length, 1);
  return Math.min(100, avgAccuracy * 100);
}

function calculateGamificationEngagement(achievementsData: any[], battlesData: any[]): number {
  const gamificationScore = achievementsData.length * 3 + battlesData.length * 5;
  const recentActivity = achievementsData.filter(a => {
    const unlocked = new Date(a.unlocked_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return unlocked > weekAgo;
  }).length * 10;
  return Math.min(100, gamificationScore + recentActivity);
}

function calculateAchievementMomentum(achievementsData: any[]): number {
  const recentAchievements = achievementsData.filter(a => {
    const unlocked = new Date(a.unlocked_at);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return unlocked > monthAgo;
  });
  
  const momentum = recentAchievements.length * 8;
  const rarityBonus = recentAchievements.reduce((sum, a) => {
    switch (a.rarity) {
      case 'legendary': return sum + 30;
      case 'epic': return sum + 20;
      case 'rare': return sum + 10;
      default: return sum + 5;
    }
  }, 0);
  
  return Math.min(100, momentum + rarityBonus);
}

function calculateBattleReadiness(battlesData: any[]): number {
  const totalBattles = battlesData.length;
  const winRate = battlesData.filter(b => b.winner_id).length / Math.max(totalBattles, 1);
  const recentBattles = battlesData.filter(b => {
    const battleDate = new Date(b.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return battleDate > weekAgo;
  }).length;
  
  return Math.min(100, (winRate * 60) + (recentBattles * 10) + (totalBattles * 2));
}

function calculateVocationalAlignment(progressData: any[], achievementsData: any[]): number {
  const vocationalNodes = progressData.filter(p => 
    p.node_id && (p.node_id.includes('vocational') || p.node_id.includes('career'))
  );
  const vocationalProgress = vocationalNodes.reduce((sum, p) => sum + (p.progress || 0), 0);
  const guidanceAchievements = achievementsData.filter(a => 
    a.category === 'vocational' || a.achievement_type === 'career_guidance'
  ).length;
  
  return Math.min(100, vocationalProgress * 10 + guidanceAchievements * 15);
}
