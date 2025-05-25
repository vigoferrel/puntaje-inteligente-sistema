import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Star, Award, Target, Zap, Crown,
  Medal, Gem, Shield, Rocket, Flame
} from 'lucide-react';
import { StudentProfile, SkillNode } from '@/core/unified-education-system/EducationDataHub';

interface SystemicGamificationProps {
  studentProfile: StudentProfile;
  skillNodes: SkillNode[];
  systemMetrics: any;
}

export const SystemicGamification: React.FC<SystemicGamificationProps> = ({
  studentProfile,
  skillNodes,
  systemMetrics
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'challenges' | 'leaderboard' | 'rewards'>('achievements');

  // Sistema de logros dinámicos
  const achievements = React.useMemo(() => {
    const baseAchievements = [
      {
        id: 'first_steps',
        title: 'Primeros Pasos',
        description: 'Completar el primer nodo de aprendizaje',
        icon: Target,
        progress: Math.min(100, (systemMetrics.nodesCompleted / 1) * 100),
        completed: systemMetrics.nodesCompleted >= 1,
        rarity: 'common',
        xp: 50,
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'knowledge_seeker',
        title: 'Buscador de Conocimiento',
        description: 'Alcanzar 70% de dominio en 5 habilidades',
        icon: Star,
        progress: Math.min(100, (skillNodes.filter(n => n.masteryLevel >= 70).length / 5) * 100),
        completed: skillNodes.filter(n => n.masteryLevel >= 70).length >= 5,
        rarity: 'rare',
        xp: 150,
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: 'master_student',
        title: 'Estudiante Maestro',
        description: 'Completar 10 nodos con excelencia',
        icon: Crown,
        progress: Math.min(100, (systemMetrics.nodesCompleted / 10) * 100),
        completed: systemMetrics.nodesCompleted >= 10,
        rarity: 'epic',
        xp: 300,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        id: 'speed_learner',
        title: 'Aprendiz Veloz',
        description: 'Mantener velocidad de aprendizaje > 80%',
        icon: Zap,
        progress: Math.min(100, systemMetrics.learningVelocity * 100),
        completed: systemMetrics.learningVelocity >= 0.8,
        rarity: 'legendary',
        xp: 500,
        color: 'from-green-500 to-emerald-500'
      },
      {
        id: 'paes_warrior',
        title: 'Guerrero PAES',
        description: 'Alcanzar preparación óptima para PAES',
        icon: Shield,
        progress: Math.min(100, systemMetrics.averagePerformance),
        completed: systemMetrics.averagePerformance >= 85,
        rarity: 'mythic',
        xp: 1000,
        color: 'from-red-500 to-pink-500'
      }
    ];

    return baseAchievements;
  }, [skillNodes, systemMetrics]);

  // Desafíos colaborativos
  const challenges = [
    {
      id: 'weekly_marathon',
      title: 'Maratón Semanal',
      description: 'Completar 20 ejercicios esta semana',
      progress: Math.min(100, (systemMetrics.totalExercises % 20 / 20) * 100),
      timeLeft: '3 días',
      reward: 'Badge Especial + 200 XP',
      participants: 1247,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 'skill_master',
      title: 'Maestro de Habilidades',
      description: 'Dominar una nueva habilidad al 90%',
      progress: Math.max(...skillNodes.map(n => n.masteryLevel)),
      timeLeft: 'Sin límite',
      reward: 'Título Especial + 350 XP',
      participants: 892,
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'precision_expert',
      title: 'Experto en Precisión',
      description: 'Mantener 95% de precisión en 10 ejercicios consecutivos',
      progress: Math.min(100, systemMetrics.predictionAccuracy),
      timeLeft: '1 semana',
      reward: 'Corona Dorada + 500 XP',
      participants: 456,
      color: 'from-yellow-600 to-orange-600'
    }
  ];

  // Sistema de recompensas
  const rewards = [
    {
      id: 'energy_boost',
      title: 'Impulso de Energía',
      description: '+50% velocidad de aprendizaje por 1 hora',
      cost: 100,
      icon: Zap,
      available: true,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'hint_master',
      title: 'Maestro de Pistas',
      description: '3 pistas gratuitas en ejercicios difíciles',
      cost: 150,
      icon: Target,
      available: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'time_control',
      title: 'Control del Tiempo',
      description: 'Tiempo extra en evaluaciones',
      cost: 200,
      icon: Shield,
      available: false,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'knowledge_crystal',
      title: 'Cristal de Conocimiento',
      description: 'Explicación detallada de cualquier concepto',
      cost: 300,
      icon: Gem,
      available: true,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const totalXP = achievements.filter(a => a.completed).reduce((sum, a) => sum + a.xp, 0);
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const xpToNext = ((currentLevel * 500) - totalXP);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-purple-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'mythic': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del jugador */}
      <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-xl border-orange-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs">
                  Lvl {currentLevel}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-white">{studentProfile.name}</h3>
                <p className="text-orange-200">Estudiante {studentProfile.currentLevel}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">{totalXP} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400">{achievements.filter(a => a.completed).length} Logros</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-orange-200 mb-1">Próximo Nivel</div>
              <div className="w-32">
                <Progress value={((totalXP % 500) / 500) * 100} className="h-2" />
              </div>
              <div className="text-xs text-orange-300 mt-1">{xpToNext} XP restantes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navegación de gamificación */}
      <div className="flex gap-2">
        {(['achievements', 'challenges', 'leaderboard', 'rewards'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 
              "bg-gradient-to-r from-orange-600 to-red-600" : 
              "border-orange-500/50 text-white hover:bg-orange-500/20"
            }
          >
            {tab === 'achievements' && <Trophy className="w-4 h-4 mr-2" />}
            {tab === 'challenges' && <Target className="w-4 h-4 mr-2" />}
            {tab === 'leaderboard' && <Crown className="w-4 h-4 mr-2" />}
            {tab === 'rewards' && <Gem className="w-4 h-4 mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Logros */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  achievement.completed ? 'border-yellow-500/50' : 'border-white/10'
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} opacity-10`}></div>
                  <CardContent className="p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${achievement.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium">{achievement.title}</h4>
                          <Badge className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white text-xs`}>
                            {achievement.rarity}
                          </Badge>
                          {achievement.completed && <Star className="w-4 h-4 text-yellow-400" />}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Progreso</span>
                            <span className="text-orange-400">{Math.round(achievement.progress)}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">Recompensa: {achievement.xp} XP</span>
                          {achievement.completed && (
                            <Badge className="bg-green-600 text-white">Completado</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Desafíos */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-r from-black/40 to-slate-900/40 backdrop-blur-xl border-orange-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-medium">{challenge.title}</h4>
                      <p className="text-gray-400 text-sm">{challenge.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-orange-400 font-medium">{challenge.reward}</div>
                      <div className="text-xs text-gray-400">{challenge.participants} participantes</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-orange-400">{Math.round(challenge.progress)}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-3" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">Tiempo restante: {challenge.timeLeft}</span>
                    <Button size="sm" className="bg-gradient-to-r from-orange-600 to-red-600">
                      <Rocket className="w-3 h-3 mr-1" />
                      Participar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabla de clasificación */}
      {activeTab === 'leaderboard' && (
        <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              Clasificación Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'María González', xp: 2450, level: 12, trend: 'up' },
                { name: 'Carlos Ruiz', xp: 2380, level: 11, trend: 'up' },
                { name: studentProfile.name, xp: totalXP, level: currentLevel, trend: 'stable' },
                { name: 'Ana López', xp: 2100, level: 10, trend: 'down' },
                { name: 'Diego Pérez', xp: 1950, level: 9, trend: 'up' }
              ].map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === studentProfile.name ? 
                    'bg-orange-600/20 border border-orange-500/50' : 
                    'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-500 text-black' :
                      'bg-gray-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-xs text-gray-400">Nivel {player.level}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-orange-400 font-medium">{player.xp} XP</div>
                    <div className="text-xs text-gray-400">
                      {player.trend === 'up' ? '↗️' : player.trend === 'down' ? '↘️' : '➡️'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tienda de recompensas */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward, index) => {
            const Icon = reward.icon;
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${
                  reward.available ? 'border-orange-500/50' : 'border-gray-500/30 opacity-50'
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${reward.color} opacity-10`}></div>
                  <CardContent className="p-4 relative">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${reward.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{reward.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{reward.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">{reward.cost} XP</span>
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={!reward.available || totalXP < reward.cost}
                            className="bg-gradient-to-r from-orange-600 to-red-600 disabled:opacity-50"
                          >
                            {totalXP >= reward.cost ? 'Canjear' : 'Sin XP'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
