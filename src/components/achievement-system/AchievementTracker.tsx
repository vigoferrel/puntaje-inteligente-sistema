
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Target, 
  Brain, 
  Zap, 
  BookOpen, 
  Calculator,
  Medal,
  Crown,
  Gem,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'learning' | 'progress' | 'mastery' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  specialReward?: string;
}

interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalXP: number;
  currentLevel: number;
  nextLevelXP: number;
  streakDays: number;
}

export const AchievementTracker: React.FC = () => {
  const neural = useNeuralIntegration('achievements', [
    'achievement_tracking',
    'gamification_engine',
    'progress_analytics',
    'reward_system'
  ], {
    trackingMode: 'comprehensive',
    gamificationLevel: 'advanced'
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_steps',
      title: 'Primeros Pasos',
      description: 'Completa tu primer ejercicio de LectoGuía',
      icon: BookOpen,
      category: 'learning',
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date(),
      xpReward: 100
    },
    {
      id: 'diagnostic_master',
      title: 'Maestro del Diagnóstico',
      description: 'Completa 5 evaluaciones diagnósticas',
      icon: Target,
      category: 'mastery',
      rarity: 'rare',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      xpReward: 500
    },
    {
      id: 'neural_efficiency',
      title: 'Eficiencia Neural',
      description: 'Alcanza 90% de eficiencia neural',
      icon: Brain,
      category: 'special',
      rarity: 'epic',
      progress: Math.round(neural.systemHealth.neural_efficiency || 75),
      maxProgress: 90,
      unlocked: (neural.systemHealth.neural_efficiency || 75) >= 90,
      xpReward: 1000,
      specialReward: 'Modo Neural Avanzado'
    },
    {
      id: 'financial_planner',
      title: 'Planificador Financiero',
      description: 'Crea tu primer plan financiero universitario',
      icon: Calculator,
      category: 'progress',
      rarity: 'rare',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      xpReward: 300
    },
    {
      id: 'streak_warrior',
      title: 'Guerrero Constante',
      description: 'Mantén una racha de 7 días consecutivos',
      icon: Zap,
      category: 'special',
      rarity: 'epic',
      progress: 4,
      maxProgress: 7,
      unlocked: false,
      xpReward: 750,
      specialReward: 'Multiplicador de XP x2'
    },
    {
      id: 'perfect_score',
      title: 'Puntuación Perfecta',
      description: 'Obtén 100% en cualquier evaluación',
      icon: Star,
      category: 'mastery',
      rarity: 'legendary',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      xpReward: 2000,
      specialReward: 'Título: Estudiante Excepcional'
    }
  ]);

  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.unlocked).length,
    totalXP: 1250,
    currentLevel: 5,
    nextLevelXP: 2000,
    streakDays: 4
  });

  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

  // Simular progreso de logros
  useEffect(() => {
    const updateProgress = () => {
      setAchievements(prev => prev.map(achievement => {
        if (!achievement.unlocked && Math.random() > 0.8) {
          const newProgress = Math.min(
            achievement.maxProgress, 
            achievement.progress + (Math.random() > 0.5 ? 1 : 0)
          );
          
          const wasUnlocked = achievement.unlocked;
          const isNowUnlocked = newProgress >= achievement.maxProgress;
          
          if (!wasUnlocked && isNowUnlocked) {
            setNewUnlocks(current => [...current, { ...achievement, unlocked: true }]);
            setTimeout(() => {
              setNewUnlocks(current => current.filter(a => a.id !== achievement.id));
            }, 3000);
          }
          
          return {
            ...achievement,
            progress: newProgress,
            unlocked: isNowUnlocked,
            unlockedAt: isNowUnlocked ? new Date() : achievement.unlockedAt
          };
        }
        return achievement;
      }));
    };

    const interval = setInterval(updateProgress, 8000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar estadísticas
  useEffect(() => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalXP = achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xpReward, 0);
    
    setStats(prev => ({
      ...prev,
      unlockedAchievements: unlockedCount,
      totalXP,
      currentLevel: Math.floor(totalXP / 500) + 1
    }));
  }, [achievements]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400';
      case 'rare': return 'bg-blue-500/20 text-blue-400';
      case 'epic': return 'bg-purple-500/20 text-purple-400';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const categoryIcons = {
    learning: BookOpen,
    progress: TrendingUp,
    mastery: Medal,
    special: Crown
  };

  return (
    <div className="space-y-6">
      {/* Notificaciones de nuevos logros */}
      <AnimatePresence>
        {newUnlocks.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="fixed top-4 right-4 z-50"
            >
              <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 backdrop-blur-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">¡Logro Desbloqueado!</h4>
                      <p className="text-sm text-yellow-300">{achievement.title}</p>
                      <p className="text-xs text-white/70">+{achievement.xpReward} XP</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Panel de estadísticas */}
      <Card className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-white/20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Estadísticas de Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {stats.currentLevel}
              </div>
              <div className="text-sm text-white/70">Nivel Actual</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stats.totalXP}
              </div>
              <div className="text-sm text-white/70">XP Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {stats.unlockedAchievements}/{stats.totalAchievements}
              </div>
              <div className="text-sm text-white/70">Logros</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stats.streakDays}
              </div>
              <div className="text-sm text-white/70">Días Seguidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%
              </div>
              <div className="text-sm text-white/70">Completado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de logros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const CategoryIcon = categoryIcons[achievement.category];
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-white/20 backdrop-blur-lg transition-all hover:scale-105 ${
                achievement.unlocked 
                  ? 'bg-white/15 border-yellow-400/30' 
                  : 'bg-white/5 border-white/10'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} ${
                      achievement.unlocked ? 'opacity-100' : 'opacity-50'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getRarityBadgeColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      {achievement.unlocked && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-yellow-400">Desbloqueado</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${
                    achievement.unlocked ? 'text-white' : 'text-white/60'
                  }`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    achievement.unlocked ? 'text-white/80' : 'text-white/50'
                  }`}>
                    {achievement.description}
                  </p>

                  {!achievement.unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">Progreso</span>
                        <span className="text-white font-medium">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-white/60" />
                      <span className="text-xs text-white/60 capitalize">
                        {achievement.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gem className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">
                        {achievement.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {achievement.specialReward && achievement.unlocked && (
                    <div className="mt-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">
                          {achievement.specialReward}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
