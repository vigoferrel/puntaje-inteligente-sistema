
import { useState, useEffect, useCallback } from 'react';
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

// Default metrics para cuando no hay datos
const DEFAULT_METRICS: RealNeuralMetrics = {
  neural_efficiency: 65,
  cognitive_load: 45,
  learning_velocity: 70,
  pattern_recognition: 58,
  adaptive_intelligence: 62,
  creative_synthesis: 55,
  strategic_thinking: 60,
  emotional_intelligence: 68,
  leadership_potential: 52,
  innovation_index: 48,
  universe_exploration_depth: 72,
  paes_simulation_accuracy: 75,
  gamification_engagement: 80,
  achievement_momentum: 85,
  battle_readiness: 66,
  vocational_alignment: 58,
  user_satisfaction: 65,
  adaptive_learning_rate: 70,
  system_coherence: 62,
  prediction_accuracy: 75
};

export const useRealNeuralMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealNeuralMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateMetrics = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Calculating neural metrics for user:', user.id);
      setIsLoading(true);
      setError(null);
      
      // Usar Promise.allSettled para evitar que un error bloquee todo
      const [progressResult, achievementsResult, battlesResult] = await Promise.allSettled([
        supabase.from('user_node_progress').select('*').eq('user_id', user.id),
        supabase.from('user_achievements').select('*').eq('user_id', user.id),
        supabase.from('battle_sessions').select('*').or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`)
      ]);

      const progressData = progressResult.status === 'fulfilled' ? progressResult.value.data || [] : [];
      const achievementsData = achievementsResult.status === 'fulfilled' ? achievementsResult.value.data || [] : [];
      const battlesData = battlesResult.status === 'fulfilled' ? battlesResult.value.data || [] : [];

      console.log('Data loaded:', { 
        progress: progressData.length, 
        achievements: achievementsData.length, 
        battles: battlesData.length 
      });

      // Calcular métricas con datos reales o usar valores por defecto
      const calculatedMetrics: RealNeuralMetrics = {
        neural_efficiency: calculateNeuralEfficiency(progressData, achievementsData),
        cognitive_load: calculateCognitiveLoad(progressData),
        learning_velocity: calculateLearningVelocity(progressData),
        pattern_recognition: calculatePatternRecognition(progressData, battlesData),
        adaptive_intelligence: calculateAdaptiveIntelligence(progressData),
        creative_synthesis: calculateCreativeSynthesis(achievementsData, progressData),
        strategic_thinking: calculateStrategicThinking(battlesData, progressData),
        emotional_intelligence: calculateEmotionalIntelligence(achievementsData),
        leadership_potential: calculateLeadershipPotential(battlesData, achievementsData),
        innovation_index: calculateInnovationIndex(progressData, achievementsData),
        universe_exploration_depth: calculateUniverseExploration(progressData),
        paes_simulation_accuracy: calculatePAESAccuracy(progressData),
        gamification_engagement: calculateGamificationEngagement(achievementsData, battlesData),
        achievement_momentum: calculateAchievementMomentum(achievementsData),
        battle_readiness: calculateBattleReadiness(battlesData),
        vocational_alignment: calculateVocationalAlignment(progressData, achievementsData),
        
        // Legacy compatibility
        user_satisfaction: calculateNeuralEfficiency(progressData, achievementsData),
        adaptive_learning_rate: calculateLearningVelocity(progressData),
        system_coherence: calculateAdaptiveIntelligence(progressData),
        prediction_accuracy: calculatePAESAccuracy(progressData)
      };

      console.log('Metrics calculated successfully:', calculatedMetrics);
      setMetrics(calculatedMetrics);
      setError(null);
    } catch (err) {
      console.error('Error calculating neural metrics:', err);
      setError(err instanceof Error ? err.message : 'Error calculating metrics');
      // En caso de error, usar métricas por defecto
      setMetrics(DEFAULT_METRICS);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getMetricForDimension = useCallback((dimensionId: string): number => {
    if (!metrics) return DEFAULT_METRICS[dimensionId as keyof RealNeuralMetrics] || 0;
    return metrics[dimensionId as keyof RealNeuralMetrics] || 0;
  }, [metrics]);

  useEffect(() => {
    if (user) {
      calculateMetrics();
    } else {
      setIsLoading(false);
      setMetrics(null);
    }
  }, [user, calculateMetrics]);

  return {
    metrics: metrics || DEFAULT_METRICS,
    isLoading,
    error,
    refetch: calculateMetrics,
    getMetricForDimension
  };
};

// Funciones de cálculo optimizadas con fallbacks
function calculateNeuralEfficiency(progressData: any[], achievementsData: any[]): number {
  if (!progressData.length && !achievementsData.length) return DEFAULT_METRICS.neural_efficiency;
  
  const completedNodes = progressData.filter(p => p.status === 'completed').length;
  const totalProgress = progressData.reduce((sum, p) => sum + (p.progress || 0), 0);
  const achievementBonus = achievementsData.length * 2;
  const efficiency = Math.min(100, (totalProgress / Math.max(progressData.length, 1)) + achievementBonus);
  
  return Math.max(30, Math.min(100, efficiency));
}

function calculateCognitiveLoad(progressData: any[]): number {
  if (!progressData.length) return DEFAULT_METRICS.cognitive_load;
  
  const activeNodes = progressData.filter(p => p.status === 'in_progress').length;
  const avgMastery = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / Math.max(progressData.length, 1);
  const load = Math.max(0, Math.min(100, (activeNodes * 10) + (100 - avgMastery * 100)));
  
  return Math.max(0, Math.min(100, load));
}

function calculateLearningVelocity(progressData: any[]): number {
  if (!progressData.length) return DEFAULT_METRICS.learning_velocity;
  
  const recentProgress = progressData.filter(p => {
    const lastActivity = new Date(p.last_activity_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastActivity > weekAgo;
  });
  const velocity = Math.min(100, recentProgress.length * 8);
  
  return Math.max(20, Math.min(100, velocity));
}

function calculatePatternRecognition(progressData: any[], battlesData: any[]): number {
  if (!progressData.length) return DEFAULT_METRICS.pattern_recognition;
  
  const successRate = progressData.reduce((sum, p) => sum + (p.success_rate || 0), 0) / Math.max(progressData.length, 1);
  const battleWins = battlesData.filter(b => b.winner_id).length;
  const recognition = Math.min(100, (successRate * 70) + (battleWins * 5));
  
  return Math.max(30, Math.min(100, recognition));
}

function calculateAdaptiveIntelligence(progressData: any[]): number {
  if (!progressData.length) return DEFAULT_METRICS.adaptive_intelligence;
  
  const adaptiveNodes = progressData.filter(p => (p.mastery_level || 0) > 0.7).length;
  const diversityScore = new Set(progressData.map(p => p.node_id)).size * 5;
  const intelligence = Math.min(100, adaptiveNodes * 3 + diversityScore);
  
  return Math.max(25, Math.min(100, intelligence));
}

function calculateCreativeSynthesis(achievementsData: any[], progressData: any[]): number {
  const creativeAchievements = achievementsData.filter(a => 
    a.category === 'creative' || a.achievement_type === 'innovation'
  ).length;
  const crossDisciplinaryProgress = progressData.filter(p => (p.progress || 0) > 0.5).length;
  const synthesis = Math.min(100, creativeAchievements * 15 + crossDisciplinaryProgress * 2);
  
  return Math.max(20, Math.min(100, synthesis));
}

function calculateStrategicThinking(battlesData: any[], progressData: any[]): number {
  const strategicWins = battlesData.filter(b => 
    b.winner_id && b.battle_type === 'strategic'
  ).length;
  const planningScore = progressData.filter(p => p.status === 'completed').length * 2;
  const thinking = Math.min(100, strategicWins * 20 + planningScore);
  
  return Math.max(25, Math.min(100, thinking));
}

function calculateEmotionalIntelligence(achievementsData: any[]): number {
  const socialAchievements = achievementsData.filter(a => 
    a.category === 'social' || a.achievement_type === 'collaboration'
  ).length;
  const consistencyBonus = achievementsData.length > 10 ? 20 : 0;
  const emotional = Math.min(100, socialAchievements * 12 + consistencyBonus);
  
  return Math.max(30, Math.min(100, emotional));
}

function calculateLeadershipPotential(battlesData: any[], achievementsData: any[]): number {
  const leadershipBattles = battlesData.filter(b => b.creator_id).length;
  const leadershipAchievements = achievementsData.filter(a => 
    a.category === 'leadership' || a.rarity === 'legendary'
  ).length;
  const leadership = Math.min(100, leadershipBattles * 8 + leadershipAchievements * 15);
  
  return Math.max(20, Math.min(100, leadership));
}

function calculateInnovationIndex(progressData: any[], achievementsData: any[]): number {
  const innovativeProgress = progressData.filter(p => 
    p.node_id && (p.mastery_level || 0) > 0.9
  ).length;
  const rareAchievements = achievementsData.filter(a => 
    a.rarity === 'epic' || a.rarity === 'legendary'
  ).length;
  const innovation = Math.min(100, innovativeProgress * 10 + rareAchievements * 20);
  
  return Math.max(15, Math.min(100, innovation));
}

function calculateUniverseExploration(progressData: any[]): number {
  const explorationDepth = progressData.reduce((sum, p) => sum + (p.progress || 0), 0);
  const exploration = Math.min(100, explorationDepth * 2);
  
  return Math.max(40, Math.min(100, exploration));
}

function calculatePAESAccuracy(progressData: any[]): number {
  const avgAccuracy = progressData.reduce((sum, p) => sum + (p.success_rate || 0), 0) / Math.max(progressData.length, 1);
  const accuracy = Math.min(100, avgAccuracy * 100);
  
  return Math.max(50, Math.min(100, accuracy));
}

function calculateGamificationEngagement(achievementsData: any[], battlesData: any[]): number {
  const gamificationScore = achievementsData.length * 3 + battlesData.length * 5;
  const recentActivity = achievementsData.filter(a => {
    const unlocked = new Date(a.unlocked_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return unlocked > weekAgo;
  }).length * 10;
  const engagement = Math.min(100, gamificationScore + recentActivity);
  
  return Math.max(50, Math.min(100, engagement));
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
  
  const total = Math.min(100, momentum + rarityBonus);
  return Math.max(60, Math.min(100, total));
}

function calculateBattleReadiness(battlesData: any[]): number {
  const totalBattles = battlesData.length;
  const winRate = battlesData.filter(b => b.winner_id).length / Math.max(totalBattles, 1);
  const recentBattles = battlesData.filter(b => {
    const battleDate = new Date(b.created_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return battleDate > weekAgo;
  }).length;
  
  const readiness = Math.min(100, (winRate * 60) + (recentBattles * 10) + (totalBattles * 2));
  return Math.max(40, Math.min(100, readiness));
}

function calculateVocationalAlignment(progressData: any[], achievementsData: any[]): number {
  const vocationalProgress = progressData.reduce((sum, p) => sum + (p.progress || 0), 0);
  const guidanceAchievements = achievementsData.filter(a => 
    a.category === 'vocational' || a.achievement_type === 'career_guidance'
  ).length;
  
  const alignment = Math.min(100, vocationalProgress * 5 + guidanceAchievements * 15);
  return Math.max(30, Math.min(100, alignment));
}
