import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
  category: string;
  unlockedAt?: string;
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
  currentRank: number;
  seasonPoints: number;
}

export interface UserRanking {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalPoints: number;
  level: number;
  position: number;
  rankTitle: string;
}

export const useRealGamification = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener logros del usuario
  const fetchUserAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_achievements', {
        user_id_param: user.id
      });

      if (error) throw error;

      // Transformar datos de Supabase a formato esperado
      const transformedAchievements: Achievement[] = (data || []).map((item: any) => ({
        id: item.achievement_id || item.id,
        name: item.achievement_name || item.name,
        description: item.description || '',
        icon: item.icon || '🏆',
        points: item.points || 0,
        rarity: item.rarity || 'common',
        progress: item.progress || 0,
        maxProgress: item.max_progress || item.target_value || 1,
        unlocked: item.unlocked || item.is_unlocked || false,
        category: item.category || 'general',
        unlockedAt: item.unlocked_at
      }));

      setAchievements(transformedAchievements);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Error al cargar logros');
    }
  }, [user?.id]);

  // Obtener estadísticas del juego
  const fetchGameStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_game_stats', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const stats = data[0];
        const transformedStats: GameStats = {
          level: stats.level || 1,
          experience: stats.experience || 0,
          maxExperience: stats.max_experience || stats.level * 1000,
          totalPoints: stats.total_points || 0,
          streakDays: stats.streak_days || 0,
          rankTitle: stats.rank_title || 'Estudiante Novato',
          totalAchievements: stats.total_achievements || 0,
          unlockedAchievements: stats.unlocked_achievements || 0,
          nextLevelProgress: stats.next_level_progress || 0,
          currentRank: stats.current_rank || 999,
          seasonPoints: stats.season_points || 0
        };

        setGameStats(transformedStats);
      }
    } catch (err) {
      console.error('Error fetching game stats:', err);
      setError('Error al cargar estadísticas');
    }
  }, [user?.id]);

  // Obtener rankings globales
  const fetchRankings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_rankings')
        .select(`
          user_id,
          total_points,
          level,
          position,
          rank_title,
          profiles!inner (
            username,
            avatar_url
          )
        `)
        .eq('ranking_type', 'global')
        .eq('season', 'current')
        .order('position', { ascending: true })
        .limit(50);

      if (error) throw error;

      const transformedRankings: UserRanking[] = (data || []).map((item: any) => ({
        userId: item.user_id,
        username: item.profiles?.username || 'Usuario Anónimo',
        avatarUrl: item.profiles?.avatar_url,
        totalPoints: item.total_points || 0,
        level: item.level || 1,
        position: item.position || 999,
        rankTitle: item.rank_title || 'Sin rango'
      }));

      setRankings(transformedRankings);
    } catch (err) {
      console.error('Error fetching rankings:', err);
      setError('Error al cargar rankings');
    }
  }, []);

  // Verificar logros automáticamente
  const autoCheckAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      await supabase.rpc('auto_check_achievements', {
        user_id_param: user.id
      });
      
      // Refrescar logros después de la verificación
      await fetchUserAchievements();
    } catch (err) {
      console.error('Error checking achievements:', err);
    }
  }, [user?.id, fetchUserAchievements]);

  // Actualizar progreso de logro
  const updateAchievementProgress = useCallback(async (
    achievementId: string, 
    progress: number
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase.rpc('update_achievement_progress', {
        user_id_param: user.id,
        achievement_id_param: achievementId,
        progress_param: progress
      });

      if (error) throw error;

      // Refrescar datos
      await Promise.all([
        fetchUserAchievements(),
        fetchGameStats()
      ]);
    } catch (err) {
      console.error('Error updating achievement progress:', err);
      setError('Error al actualizar progreso');
    }
  }, [user?.id, fetchUserAchievements, fetchGameStats]);

  // Añadir experiencia al usuario
  const updateUserExperience = useCallback(async (experienceGained: number) => {
    if (!user?.id) return;

    try {
      // Actualizamos las estadísticas del juego
      const { error } = await supabase
        .from('user_game_stats')
        .upsert({
          user_id: user.id,
          experience: (gameStats?.experience || 0) + experienceGained,
          total_points: (gameStats?.totalPoints || 0) + Math.floor(experienceGained * 0.1)
        });

      if (error) throw error;

      // Verificar logros después de ganar experiencia
      await autoCheckAchievements();
      
      // Refrescar estadísticas
      await fetchGameStats();
    } catch (err) {
      console.error('Error updating experience:', err);
      setError('Error al actualizar experiencia');
    }
  }, [user?.id, gameStats, autoCheckAchievements, fetchGameStats]);

  // Refrescar todos los datos de gamificación
  const refreshGamificationData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchUserAchievements(),
        fetchGameStats(),
        fetchRankings()
      ]);
    } catch (err) {
      console.error('Error refreshing gamification data:', err);
      setError('Error al actualizar datos de gamificación');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserAchievements, fetchGameStats, fetchRankings]);

  // Obtener logros por categoría
  const getAchievementsByCategory = useCallback((category: string) => {
    return achievements.filter(achievement => 
      category === 'all' || achievement.category === category
    );
  }, [achievements]);

  // Obtener logros desbloqueados
  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(achievement => achievement.unlocked);
  }, [achievements]);

  // Obtener logros con progreso
  const getProgressableAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      !achievement.unlocked && achievement.progress > 0
    );
  }, [achievements]);

  // Obtener posición del usuario
  const getUserPosition = useCallback(() => {
    const userRanking = rankings.find(ranking => ranking.userId === user?.id);
    return userRanking?.position || null;
  }, [rankings, user?.id]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    if (user?.id) {
      refreshGamificationData();
    }
  }, [user?.id, refreshGamificationData]);

  return {
    // Datos
    achievements,
    gameStats,
    rankings,
    isLoading,
    error,
    
    // Funciones
    updateAchievementProgress,
    updateUserExperience,
    refreshGamificationData,
    autoCheckAchievements,
    
    // Utilidades
    getAchievementsByCategory,
    getUnlockedAchievements,
    getProgressableAchievements,
    getUserPosition
  };
};
