import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './use-auth';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
}

export interface GameStats {
  level: number;
  experience: number;
  maxExperience: number;
  totalPoints: number;
  streakDays: number;
  rankTitle: string;
  totalAchievements: number;
  unlockedAchievements: number;
  nextLevelProgress: number;
}

export interface UserRanking {
  userId: string;
  userName: string;
  totalPoints: number;
  level: number;
  position: number;
  rankTitle: string;
  avatar?: string;
}

export interface BattleSession {
  id: string;
  creatorId: string;
  opponentId: string;
  winnerId?: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  subject: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  totalQuestions: number;
  timeLimit: number;
  createdAt: string;
  endedAt?: string;
  scores?: {
    creator: number;
    opponent: number;
  };
}

export interface MicroCertification {
  id: string;
  name: string;
  description: string;
  skillArea: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  requirements: string[];
  evidenceRequired: string[];
  status: 'available' | 'in_progress' | 'completed' | 'expired';
  completedAt?: string;
  expiresAt?: string;
  badge: string;
  creditsEarned: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [battleSessions, setBattleSessions] = useState<BattleSession[]>([]);
  const [certifications, setCertifications] = useState<MicroCertification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener logros del usuario
  const getUserAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_achievements', {
        p_user_id: user.id
      });

      if (error) throw error;

      const formattedAchievements: Achievement[] = data?.map((achievement: any) => ({
        id: achievement.achievement_id,
        name: achievement.achievement_name,
        description: achievement.achievement_description,
        icon: achievement.achievement_icon,
        points: achievement.points,
        rarity: achievement.rarity,
        progress: achievement.progress,
        maxProgress: achievement.max_progress,
        unlocked: achievement.unlocked,
        unlockedAt: achievement.unlocked_at,
        category: achievement.category || 'general'
      })) || [];

      setAchievements(formattedAchievements);
      return formattedAchievements;
    } catch (err) {
      console.error('Error fetching achievements:', err);
      return [];
    }
  }, [user?.id]);

  // Obtener estadísticas del juego
  const getUserGameStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_game_stats', {
        p_user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const stats = data[0];
        const gameStats: GameStats = {
          level: stats.level,
          experience: stats.experience,
          maxExperience: stats.max_experience,
          totalPoints: stats.total_points,
          streakDays: stats.streak_days,
          rankTitle: stats.rank_title,
          totalAchievements: stats.total_achievements,
          unlockedAchievements: achievements.filter(a => a.unlocked).length,
          nextLevelProgress: stats.max_experience > 0 
            ? (stats.experience / stats.max_experience) * 100 
            : 0
        };

        setGameStats(gameStats);
        return gameStats;
      }
    } catch (err) {
      console.error('Error fetching game stats:', err);
    }
  }, [user?.id, achievements]);

  // Actualizar progreso de logro
  const updateAchievementProgress = useCallback(async (achievementId: string, progressIncrement = 1) => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('update_achievement_progress', {
        p_user_id: user.id,
        p_achievement_id: achievementId,
        p_progress_increment: progressIncrement
      });

      if (error) throw error;

      // Refrescar logros si hubo cambios
      if (data) {
        await getUserAchievements();
        await getUserGameStats();
      }

      return data || false;
    } catch (err) {
      console.error('Error updating achievement progress:', err);
      return false;
    }
  }, [user?.id, getUserAchievements, getUserGameStats]);

  // Verificar logros automáticamente
  const autoCheckAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('auto_check_achievements', {
        p_user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success && result.new_achievements > 0) {
          // Refrescar datos si se desbloquearon nuevos logros
          await getUserAchievements();
          await getUserGameStats();
          
          // Mostrar notificación de nuevos logros
          return {
            newAchievements: result.new_achievements,
            achievementDetails: result.achievement_details || []
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Error auto-checking achievements:', err);
      return null;
    }
  }, [user?.id, getUserAchievements, getUserGameStats]);

  // Actualizar experiencia del usuario
  const updateUserExperience = useCallback(async (experienceGained: number) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('update_user_experience', {
        p_user_id: user.id,
        p_experience_gained: experienceGained
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        await getUserGameStats();
        
        return {
          newLevel: result.new_level,
          newExperience: result.new_experience,
          levelUp: result.level_up
        };
      }
    } catch (err) {
      console.error('Error updating user experience:', err);
    }
  }, [user?.id, getUserGameStats]);

  // Obtener rankings
  const getUserRankings = useCallback(async (rankingType = 'global', season = 'current') => {
    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .select(`
          user_id,
          total_points,
          level,
          position,
          rank_title,
          profiles!inner(
            username,
            avatar_url
          )
        `)
        .eq('ranking_type', rankingType)
        .eq('season', season)
        .order('position', { ascending: true })
        .limit(50);

      if (error) throw error;

      const formattedRankings: UserRanking[] = data?.map((ranking: any) => ({
        userId: ranking.user_id,
        userName: ranking.profiles.username || 'Usuario Anónimo',
        totalPoints: ranking.total_points,
        level: ranking.level,
        position: ranking.position,
        rankTitle: ranking.rank_title,
        avatar: ranking.profiles.avatar_url
      })) || [];

      setRankings(formattedRankings);
      return formattedRankings;
    } catch (err) {
      console.error('Error fetching rankings:', err);
      return [];
    }
  }, []);

  // Validar micro-certificación
  const validateMicroCertification = useCallback(async (skillArea: string, evidenceData: any) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('validate_micro_certification', {
        p_user_id: user.id,
        p_skill_area: skillArea,
        p_evidence_data: evidenceData
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error validating micro-certification:', err);
      return null;
    }
  }, [user?.id]);

  // Emitir certificado de calidad
  const issueQualityCertificate = useCallback(async (certificationId: string) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('issue_quality_certificate', {
        p_user_id: user.id,
        p_certification_id: certificationId
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error issuing quality certificate:', err);
      return null;
    }
  }, [user?.id]);

  // Cargar todos los datos de gamificación
  const loadGamificationData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        getUserAchievements(),
        getUserGameStats(),
        getUserRankings(),
        autoCheckAchievements()
      ]);
    } catch (err) {
      console.error('Error loading gamification data:', err);
      setError('Error al cargar datos de gamificación');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, getUserAchievements, getUserGameStats, getUserRankings, autoCheckAchievements]);

  // Refrescar datos
  const refreshGamificationData = useCallback(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  // Efecto inicial
  useEffect(() => {
    if (user?.id) {
      loadGamificationData();
    }
  }, [user?.id, loadGamificationData]);

  return {
    // Estados
    achievements,
    gameStats,
    rankings,
    battleSessions,
    certifications,
    isLoading,
    error,

    // Acciones
    getUserAchievements,
    updateAchievementProgress,
    autoCheckAchievements,
    updateUserExperience,
    getUserRankings,
    validateMicroCertification,
    issueQualityCertificate,
    refreshGamificationData,

    // Utilidades
    getAchievementsByCategory: (category: string) => 
      achievements.filter(a => a.category === category),
    getUnlockedAchievements: () => 
      achievements.filter(a => a.unlocked),
    getProgressableAchievements: () => 
      achievements.filter(a => !a.unlocked && a.progress < a.maxProgress),
    getUserPosition: () => 
      rankings.findIndex(r => r.userId === user?.id) + 1,
    getNextLevelRequirement: () => 
      gameStats ? gameStats.maxExperience - gameStats.experience : 0
  };
};
