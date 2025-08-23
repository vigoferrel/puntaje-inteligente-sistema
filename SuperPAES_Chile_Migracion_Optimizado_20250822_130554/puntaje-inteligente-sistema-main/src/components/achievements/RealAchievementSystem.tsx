/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useAuth } from '../../hooks/useAuth';
// DISABLED: // DISABLED: import { supabase } from '../../integrations/supabase/unified-client';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  Zap, 
  BookOpen, 
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points_reward: number;
  unlocked_at?: string;
  progress?: number;
  total_required?: number;
  is_unlocked: boolean;
}

interface UserProgress {
  total_nodes: number;
  completed_nodes: number;
  total_study_time: number;
  current_streak: number;
  avg_performance: number;
}

export const RealAchievementSystem: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    total_nodes: 0,
    completed_nodes: 0,
    total_study_time: 0,
    current_streak: 0,
    avg_performance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const loadAchievementsAndProgress = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Cargar progreso del usuario con JOIN correcto
        const { data: progressData } = await supabase
          .from('user_node_progress')
          .select(`
            *,
            learning_nodes!inner(
              id,
              title,
              code,
              skill_id,
              test_id
            )
          `)
          .eq('user_id', user.id);

        // Calcular mÃ©tricas de progreso
        const totalNodes = progressData?.length || 0;
        const completedNodes = progressData?.filter(p => p.mastery_level >= 0.8).length || 0;
        const totalStudyTime = progressData?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0;
        const avgPerformance = totalNodes > 0 
          ? progressData?.reduce((sum, p) => sum + (p.mastery_level || 0), 0)! / totalNodes 
          : 0;

        // Calcular racha actual
        const recentActivity = progressData?.filter(p => 
          p.last_activity_at && 
          new Date(p.last_activity_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0;

        setUserProgress({
          total_nodes: totalNodes,
          completed_nodes: completedNodes,
          total_study_time: Math.round(totalStudyTime / 60), // horas
          current_streak: recentActivity,
          avg_performance: Math.round(avgPerformance * 100)
        });

        // Cargar logros disponibles
        const { data: availableAchievements } = await supabase
          .from('intelligent_achievements')
          .select('*')
          .eq('is_active', true);

        // Cargar logros desbloqueados por el usuario
        const { data: unlockedAchievements } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        // Procesar logros con estado y progreso
        const processedAchievements: Achievement[] = (availableAchievements || []).map(achievement => {
          const userAchievement = unlockedAchievements?.find(ua => ua.achievement_id === achievement.id);
          const isUnlocked = !!userAchievement;
          
          // Calcular progreso basado en condiciones
          let progress = 0;
          let totalRequired = 1;
          
          if (achievement.unlock_conditions) {
            const conditions = achievement.unlock_conditions as unknown;
            
            if (conditions.completed_nodes) {
              totalRequired = conditions.completed_nodes;
              progress = Math.min(completedNodes, totalRequired);
            } else if (conditions.study_streak) {
              totalRequired = conditions.study_streak;
              progress = Math.min(recentActivity, totalRequired);
            } else if (conditions.study_hours) {
              totalRequired = conditions.study_hours;
              progress = Math.min(Math.round(totalStudyTime / 60), totalRequired);
            } else if (conditions.avg_performance) {
              totalRequired = conditions.avg_performance;
              progress = Math.min(avgPerformance * 100, totalRequired);
            }
          }

          return {
            id: achievement.id,
            title: achievement.title,
            description: achievement.description || '',
            category: achievement.category,
            rarity: achievement.rarity as unknown,
            points_reward: achievement.points_reward || 0,
            unlocked_at: userAchievement?.unlocked_at,
            progress: isUnlocked ? totalRequired : progress,
            total_required: totalRequired,
            is_unlocked: isUnlocked
          };
        });

        // Verificar y desbloquear nuevos logros
        await checkAndUnlockAchievements(processedAchievements, userProgress);

        setAchievements(processedAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievementsAndProgress();
  }, [user?.id]);

  const checkAndUnlockAchievements = async (achievements: Achievement[], progress: UserProgress) => {
    if (!user?.id) return;

    for (const achievement of achievements) {
      if (achievement.is_unlocked) continue;

      let shouldUnlock = false;
      const conditions = await getAchievementConditions(achievement.id);

      if (conditions) {
        if (conditions.completed_nodes && progress.completed_nodes >= conditions.completed_nodes) {
          shouldUnlock = true;
        } else if (conditions.study_streak && progress.current_streak >= conditions.study_streak) {
          shouldUnlock = true;
        } else if (conditions.study_hours && progress.total_study_time >= conditions.study_hours) {
          shouldUnlock = true;
        } else if (conditions.avg_performance && progress.avg_performance >= conditions.avg_performance) {
          shouldUnlock = true;
        }
      }

      if (shouldUnlock) {
        await unlockAchievement(achievement);
      }
    }
  };

  const getAchievementConditions = async (achievementId: string) => {
    const { data } = await supabase
      .from('intelligent_achievements')
      .select('unlock_conditions')
      .eq('id', achievementId)
      .single();
    
    return data?.unlock_conditions as unknown;
  };

  const unlockAchievement = async (achievement: Achievement) => {
    if (!user?.id) return;

    try {
      // Insertar con todos los campos requeridos
      await supabase.from('user_achievements').insert({
        user_id: user.id,
        achievement_id: achievement.id,
        achievement_type: 'progress', // valor por defecto
        category: achievement.category,
        title: achievement.title,
        description: achievement.description,
        points_awarded: achievement.points_reward,
        rarity: achievement.rarity,
        unlocked_at: new Date().toISOString()
      });

      // Mostrar notificaciÃ³n (opcional)
      console.log(`Â¡Logro desbloqueado: ${achievement.title}!`);
    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Trophy;
      case 'epic': return Star;
      case 'rare': return Award;
      default: return Target;
    }
  };

  const categories = ['all', 'progress', 'skill', 'engagement', 'mastery'];
  const filteredAchievements = achievements.filter(a => 
    selectedCategory === 'all' || a.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.is_unlocked).length;
  const totalPoints = achievements
    .filter(a => a.is_unlocked)
    .reduce((sum, a) => sum + a.points_reward, 0);

  if (isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mr-3"></div>
            <span className="text-white">Cargando sistema de logros...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadÃ­sticas */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Sistema de Logros Inteligente
            <Badge className="bg-green-600 text-white ml-2">
              {unlockedCount} Desbloqueados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{unlockedCount}</div>
              <div className="text-white/70 text-sm">Logros Desbloqueados</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{totalPoints}</div>
              <div className="text-white/70 text-sm">Puntos Totales</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{userProgress.completed_nodes}</div>
              <div className="text-white/70 text-sm">Nodos Completados</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{userProgress.total_study_time}h</div>
              <div className="text-white/70 text-sm">Tiempo de Estudio</div>
            </div>
          </div>

          {/* Filtros por categorÃ­a */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className={selectedCategory === category 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                  : 'border-white/30 text-white hover:bg-white/10'
                }
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid de logros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => {
            const Icon = getRarityIcon(achievement.rarity);
            const progressPercentage = achievement.total_required 
              ? (achievement.progress! / achievement.total_required) * 100 
              : 0;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden border ${
                  achievement.is_unlocked 
                    ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-600/10 to-orange-600/10' 
                    : 'border-white/20 bg-black/40'
                } backdrop-blur-xl hover:border-white/40 transition-all duration-300`}>
                  
                  {achievement.is_unlocked && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} ${
                        achievement.is_unlocked ? 'opacity-100' : 'opacity-50'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${achievement.is_unlocked ? 'text-white' : 'text-white/60'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${achievement.is_unlocked ? 'text-white/80' : 'text-white/50'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    
                    {!achievement.is_unlocked && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-white/70 mb-1">
                          <span>Progreso</span>
                          <span>{achievement.progress}/{achievement.total_required}</span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className="h-2 bg-white/10"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`capitalize ${
                        achievement.is_unlocked ? 'border-yellow-400/50 text-yellow-400' : 'border-white/30 text-white/50'
                      }`}>
                        {achievement.rarity}
                      </Badge>
                      <div className={`flex items-center gap-1 ${
                        achievement.is_unlocked ? 'text-yellow-400' : 'text-white/50'
                      }`}>
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-medium">{achievement.points_reward} pts</span>
                      </div>
                    </div>
                    
                    {achievement.unlocked_at && (
                      <div className="text-xs text-green-400 mt-2">
                        Desbloqueado: {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <div className="text-white font-medium">No hay logros en esta categorÃ­a</div>
            <div className="text-white/70 text-sm">Prueba con otra categorÃ­a o sigue estudiando para desbloquear mÃ¡s logros</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};




