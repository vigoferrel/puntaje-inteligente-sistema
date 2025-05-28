
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award,
  Crown,
  Flame,
  TrendingUp
} from 'lucide-react';

interface RealAchievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  points: number;
  iconType: string;
}

export const RealAchievementSystem: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<RealAchievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateRealAchievements = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Obtener progreso real del usuario
        const { data: progressData } = await supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', user.id);

        // Obtener eventos neurales
        const { data: neuralEvents } = await supabase
          .from('neural_events')
          .select('*')
          .eq('user_id', user.id);

        // Obtener logros almacenados
        const { data: storedAchievements } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', user.id);

        const unlockedIds = new Set(storedAchievements?.map(a => a.achievement_id) || []);
        
        const realAchievements: RealAchievement[] = [];
        let points = 0;

        // Logro: Primeros Pasos
        const completedNodes = progressData?.filter(p => p.mastery_level > 0) || [];
        const firstStepsProgress = Math.min(completedNodes.length, 5);
        const firstStepsUnlocked = firstStepsProgress >= 5;
        if (firstStepsUnlocked && !unlockedIds.has('first_steps')) {
          await unlockAchievement('first_steps');
          setNewlyUnlocked(prev => [...prev, 'first_steps']);
        }
        realAchievements.push({
          id: 'first_steps',
          title: 'Primeros Pasos',
          description: 'Completa tus primeros 5 nodos de aprendizaje',
          category: 'Progreso',
          rarity: 'common',
          unlockedAt: firstStepsUnlocked ? new Date() : undefined,
          progress: firstStepsProgress,
          maxProgress: 5,
          points: 100,
          iconType: 'target'
        });
        if (firstStepsUnlocked) points += 100;

        // Logro: Maestría Inicial
        const masteredNodes = progressData?.filter(p => p.mastery_level >= 0.8) || [];
        const masteryProgress = Math.min(masteredNodes.length, 10);
        const masteryUnlocked = masteryProgress >= 10;
        if (masteryUnlocked && !unlockedIds.has('initial_mastery')) {
          await unlockAchievement('initial_mastery');
          setNewlyUnlocked(prev => [...prev, 'initial_mastery']);
        }
        realAchievements.push({
          id: 'initial_mastery',
          title: 'Maestría Inicial',
          description: 'Alcanza 80% de dominio en 10 nodos',
          category: 'Excelencia',
          rarity: 'rare',
          unlockedAt: masteryUnlocked ? new Date() : undefined,
          progress: masteryProgress,
          maxProgress: 10,
          points: 250,
          iconType: 'star'
        });
        if (masteryUnlocked) points += 250;

        // Logro: Estudiante Consistente
        const recentEvents = neuralEvents?.filter(e => 
          new Date(e.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ) || [];
        const consistencyProgress = Math.min(recentEvents.length, 20);
        const consistencyUnlocked = consistencyProgress >= 20;
        if (consistencyUnlocked && !unlockedIds.has('consistency')) {
          await unlockAchievement('consistency');
          setNewlyUnlocked(prev => [...prev, 'consistency']);
        }
        realAchievements.push({
          id: 'consistency',
          title: 'Estudiante Consistente',
          description: 'Mantén actividad por 7 días consecutivos',
          category: 'Dedicación',
          rarity: 'epic',
          unlockedAt: consistencyUnlocked ? new Date() : undefined,
          progress: Math.min(consistencyProgress / 3, 7),
          maxProgress: 7,
          points: 500,
          iconType: 'flame'
        });
        if (consistencyUnlocked) points += 500;

        // Logro: Explorador Neural
        const diverseSkills = new Set(progressData?.map(p => p.learning_nodes?.skill_id).filter(Boolean));
        const explorerProgress = Math.min(diverseSkills.size, 15);
        const explorerUnlocked = explorerProgress >= 15;
        if (explorerUnlocked && !unlockedIds.has('neural_explorer')) {
          await unlockAchievement('neural_explorer');
          setNewlyUnlocked(prev => [...prev, 'neural_explorer']);
        }
        realAchievements.push({
          id: 'neural_explorer',
          title: 'Explorador Neural',
          description: 'Domina habilidades en 15 áreas diferentes',
          category: 'Diversidad',
          rarity: 'epic',
          unlockedAt: explorerUnlocked ? new Date() : undefined,
          progress: explorerProgress,
          maxProgress: 15,
          points: 750,
          iconType: 'trending'
        });
        if (explorerUnlocked) points += 750;

        // Logro: Leyenda PAES
        const totalMastery = progressData?.reduce((sum, p) => sum + p.mastery_level, 0) || 0;
        const avgMastery = progressData?.length ? totalMastery / progressData.length : 0;
        const legendProgress = Math.min(Math.round(avgMastery * 100), 90);
        const legendUnlocked = avgMastery >= 0.9;
        if (legendUnlocked && !unlockedIds.has('paes_legend')) {
          await unlockAchievement('paes_legend');
          setNewlyUnlocked(prev => [...prev, 'paes_legend']);
        }
        realAchievements.push({
          id: 'paes_legend',
          title: 'Leyenda PAES',
          description: 'Alcanza 90% de dominio promedio global',
          category: 'Élite',
          rarity: 'legendary',
          unlockedAt: legendUnlocked ? new Date() : undefined,
          progress: legendProgress,
          maxProgress: 90,
          points: 1500,
          iconType: 'crown'
        });
        if (legendUnlocked) points += 1500;

        setAchievements(realAchievements);
        setTotalPoints(points);

      } catch (error) {
        console.error('Error calculating achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const unlockAchievement = async (achievementId: string) => {
      try {
        await supabase.from('user_achievements').insert({
          user_id: user?.id,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        });

        // Registrar evento neural
        await supabase.from('neural_events').insert({
          user_id: user?.id,
          event_type: 'achievement_unlocked',
          component_source: 'RealAchievementSystem',
          event_data: {
            achievementId,
            engagement: 1.0
          }
        });
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      }
    };

    calculateRealAchievements();
  }, [user?.id]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'target': return Target;
      case 'star': return Star;
      case 'flame': return Flame;
      case 'trending': return TrendingUp;
      case 'crown': return Crown;
      default: return Trophy;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mr-3"></div>
            <span className="text-white">Calculando logros...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Sistema de Logros
          </CardTitle>
          <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
            {totalPoints} Puntos
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {achievements.map((achievement, index) => {
            const Icon = getIcon(achievement.iconType);
            const isUnlocked = achievement.unlockedAt !== undefined;
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  isUnlocked 
                    ? 'border-yellow-400/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20' 
                    : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} ${
                      !isUnlocked ? 'opacity-50 grayscale' : ''
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${isUnlocked ? 'text-yellow-300' : 'text-white/60'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-white/70">{achievement.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {achievement.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Progreso</span>
                    <span className={isUnlocked ? 'text-green-400' : 'text-white'}>
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        isUnlocked ? 'from-green-400 to-emerald-500' : 'from-blue-400 to-cyan-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {isUnlocked && newlyUnlocked.includes(achievement.id) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 text-center"
                  >
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white animate-pulse">
                      <Award className="w-4 h-4 mr-1" />
                      ¡Recién Desbloqueado!
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
