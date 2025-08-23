
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Award, Target, Zap, Crown, 
  Flame, Shield, Sparkles, TrendingUp, Lock,
  CheckCircle, Clock, Gift
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'battle' | 'exploration' | 'mastery' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: any;
  xpReward: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirements: string[];
}

interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  prestige: number;
}

interface AchievementEngineProps {
  onClaimReward: (achievementId: string) => void;
}

export const AchievementEngine: React.FC<AchievementEngineProps> = ({
  onClaimReward
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'rewards'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [userLevel] = useState<UserLevel>({
    currentLevel: 23,
    currentXP: 2847,
    xpToNextLevel: 1153,
    totalXP: 45320,
    prestige: 2
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first_victory',
      title: 'Primera Victoria',
      description: 'Gana tu primera batalla neural',
      category: 'battle',
      rarity: 'common',
      icon: Zap,
      xpReward: 100,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      requirements: ['Ganar 1 batalla']
    },
    {
      id: 'streak_master',
      title: 'Maestro de Rachas',
      description: 'Mantén una racha de 10 días consecutivos',
      category: 'learning',
      rarity: 'rare',
      icon: Flame,
      xpReward: 500,
      progress: 10,
      maxProgress: 10,
      unlocked: true,
      unlockedAt: new Date('2024-01-20'),
      requirements: ['10 días consecutivos de estudio']
    },
    {
      id: 'universe_explorer',
      title: 'Explorador del Universo',
      description: 'Explora el 50% del universo educativo',
      category: 'exploration',
      rarity: 'epic',
      icon: Star,
      xpReward: 1000,
      progress: 47,
      maxProgress: 50,
      unlocked: false,
      requirements: ['Explorar 50% del universo']
    },
    {
      id: 'perfectionist',
      title: 'Perfeccionista',
      description: 'Obtén 100% en 3 materias diferentes',
      category: 'mastery',
      rarity: 'legendary',
      icon: Crown,
      xpReward: 2000,
      progress: 2,
      maxProgress: 3,
      unlocked: false,
      requirements: ['100% en 3 materias']
    },
    {
      id: 'speed_demon',
      title: 'Demonio de la Velocidad',
      description: 'Completa 5 nodos en menos de 1 día',
      category: 'learning',
      rarity: 'rare',
      icon: Target,
      xpReward: 750,
      progress: 5,
      maxProgress: 5,
      unlocked: true,
      unlockedAt: new Date('2024-01-25'),
      requirements: ['5 nodos en 1 día']
    },
    {
      id: 'neural_champion',
      title: 'Campeón Neural',
      description: 'Alcanza el top 100 nacional',
      category: 'battle',
      rarity: 'legendary',
      icon: Trophy,
      xpReward: 5000,
      progress: 156,
      maxProgress: 100,
      unlocked: false,
      requirements: ['Top 100 ranking nacional']
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos', icon: Award, count: achievements.length },
    { id: 'learning', name: 'Aprendizaje', icon: Target, count: achievements.filter(a => a.category === 'learning').length },
    { id: 'battle', name: 'Batalla', icon: Shield, count: achievements.filter(a => a.category === 'battle').length },
    { id: 'exploration', name: 'Exploración', icon: Star, count: achievements.filter(a => a.category === 'exploration').length },
    { id: 'mastery', name: 'Maestría', icon: Crown, count: achievements.filter(a => a.category === 'mastery').length }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-xl border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-white">Nivel {userLevel.currentLevel}</h2>
                <p className="text-purple-200">Prestige {userLevel.prestige} • Neural Master</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{userLevel.currentXP.toLocaleString()}</div>
              <div className="text-purple-200 text-sm">/ {(userLevel.currentXP + userLevel.xpToNextLevel).toLocaleString()} XP</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-white mb-2">
              <span>Progreso al Nivel {userLevel.currentLevel + 1}</span>
              <span>{Math.round((userLevel.currentXP / (userLevel.currentXP + userLevel.xpToNextLevel)) * 100)}%</span>
            </div>
            <Progress 
              value={(userLevel.currentXP / (userLevel.currentXP + userLevel.xpToNextLevel)) * 100} 
              className="h-3 bg-purple-900/50" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <Trophy className="w-6 h-6 mx-auto text-yellow-400 mb-2" />
              <div className="text-xl font-bold text-white">{unlockedCount}</div>
              <div className="text-xs text-white/70">Logros</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <Sparkles className="w-6 h-6 mx-auto text-purple-400 mb-2" />
              <div className="text-xl font-bold text-white">{totalXPEarned.toLocaleString()}</div>
              <div className="text-xs text-white/70">XP Total</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <TrendingUp className="w-6 h-6 mx-auto text-green-400 mb-2" />
              <div className="text-xl font-bold text-white">{userLevel.prestige}</div>
              <div className="text-xs text-white/70">Prestige</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-400" />
            Logros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className={`p-4 rounded-xl bg-gradient-to-r ${getRarityColor(achievement.rarity)} relative overflow-hidden`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <achievement.icon className="w-8 h-8 text-white" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.title}</h4>
                    <p className="text-white/80 text-sm">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/20 text-white mb-2">
                      +{achievement.xpReward} XP
                    </Badge>
                    <div className="text-xs text-white/70">
                      {achievement.unlockedAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.name}
            <Badge className="bg-white/20">{category.count}</Badge>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${
              achievement.unlocked 
                ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} border-none` 
                : 'bg-gray-800/60 border-gray-600'
            } relative overflow-hidden transition-all hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      achievement.unlocked ? 'bg-white/20' : 'bg-gray-600/50'
                    }`}>
                      {achievement.unlocked ? (
                        <achievement.icon className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      <Badge className={`${
                        achievement.unlocked 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-600 text-gray-300'
                      } capitalize`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                      +{achievement.xpReward} XP
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto mt-1" />
                    )}
                  </div>
                </div>

                <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-white/80' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-gray-400">{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2 bg-gray-700" 
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Requisitos:</div>
                  {achievement.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {achievement.unlocked ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-500" />
                      )}
                      <span className={achievement.unlocked ? 'text-green-400' : 'text-gray-500'}>
                        {req}
                      </span>
                    </div>
                  ))}
                </div>

                {achievement.unlocked && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="w-8 h-8 text-yellow-400" />
              </motion.div>
              SISTEMA DE LOGROS NEURAL
              <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600">
                {unlockedCount}/{achievements.length} Desbloqueados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => setActiveTab('overview')}
                className={activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Resumen
              </Button>
              <Button
                onClick={() => setActiveTab('achievements')}
                className={activeTab === 'achievements' 
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Award className="w-4 h-4 mr-2" />
                Logros
              </Button>
              <Button
                onClick={() => setActiveTab('rewards')}
                className={activeTab === 'rewards' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Gift className="w-4 h-4 mr-2" />
                Recompensas
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'achievements' && renderAchievements()}
          {activeTab === 'rewards' && (
            <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Gift className="w-16 h-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Sistema de Recompensas</h3>
                <p className="text-white/70 mb-4">Próximamente: Tienda de recompensas con items exclusivos</p>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  Notificarme cuando esté listo
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
