/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Sword, Shield, Zap, Trophy, Target, Crown, 
  Flame, Star, Gamepad2, Award, TrendingUp 
} from 'lucide-react';

interface BattleDashboardProps {
  gameStats: {
    level: number;
    experience: number;
    maxExperience: number;
    streak: number;
    nationalRank: number;
    battlePoints: number;
  };
  cinematicMetrics: {
    totalNodes: number;
    completedNodes: number;
    progressPercentage: number;
    projectedScore: number;
    galaxyCompletion: number;
    quantumPower: number;
    cognitiveLevel: number;
  };
  onBattleAction: (action: string) => void;
}

export const BattleDashboard: React.FC<BattleDashboardProps> = ({
  gameStats,
  cinematicMetrics,
  onBattleAction
}) => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [battleAnimation, setBattleAnimation] = useState(false);

  const battleZones = [
    {
      id: 'reading-arena',
      name: 'Arena de Lectura',
      difficulty: 'Elite',
      reward: '250 XP',
      icon: Target,
      color: 'from-blue-500 to-blue-700',
      participants: 1247,
      timeLeft: '2h 15m'
    },
    {
      id: 'math-colosseum',
      name: 'Coliseo MatemÃ¡tico',
      difficulty: 'Legendary',
      reward: '500 XP',
      icon: Sword,
      color: 'from-purple-500 to-purple-700',
      participants: 892,
      timeLeft: '45m'
    },
    {
      id: 'science-laboratory',
      name: 'Laboratorio CientÃ­fico',
      difficulty: 'Master',
      reward: '350 XP',
      icon: Zap,
      color: 'from-green-500 to-green-700',
      participants: 634,
      timeLeft: '1h 30m'
    }
  ];

  const achievements = [
    { name: 'Streak Master', description: '10 dÃ­as consecutivos', icon: Flame, earned: true },
    { name: 'Speed Demon', description: 'Completar 5 nodos en 1 dÃ­a', icon: Zap, earned: true },
    { name: 'Perfectionist', description: '100% en 3 materias', icon: Star, earned: false },
    { name: 'Elite Warrior', description: 'Top 100 nacional', icon: Crown, earned: false }
  ];

  const handleBattleEnter = (zoneId: string) => {
    setActiveChallenge(zoneId);
    setBattleAnimation(true);
    setTimeout(() => setBattleAnimation(false), 2000);
    onBattleAction(`enter-${zoneId}`);
  };

  return (
    <div className="h-full bg-gradient-to-br from-red-900 via-purple-900 to-black p-8 overflow-y-auto">
      {/* Header de batalla */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 mb-4"
          animate={{ 
            textShadow: battleAnimation ? "0 0 20px #ff0000" : "0 0 10px #ff0000"
          }}
        >
          BATTLE ARENA
        </motion.h1>
        <p className="text-white/80 text-xl">Domina las materias PAES en combate Ã©pico</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel de estadÃ­sticas de batalla */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center"
                  animate={{ rotate: battleAnimation ? 360 : 0 }}
                  transition={{ duration: 2 }}
                >
                  <Gamepad2 className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Battle Commander</h3>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg px-4 py-1">
                  LEVEL {gameStats.level}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white mb-2">
                    <span>Battle Power</span>
                    <span className="font-bold">{cinematicMetrics.quantumPower}/120</span>
                  </div>
                  <Progress value={cinematicMetrics.quantumPower} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-red-500/20 rounded-xl">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-white">{gameStats.battlePoints}</div>
                    <div className="text-xs text-white/70">Battle Points</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-xl">
                    <Crown className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-white">#{gameStats.nationalRank}</div>
                    <div className="text-xs text-white/70">Rank Nacional</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logros */}
          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                Achievements
              </h4>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`flex items-center p-3 rounded-xl transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                        : 'bg-gray-500/10 border border-gray-500/20'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <achievement.icon 
                      className={`w-8 h-8 mr-3 ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-500'
                      }`} 
                    />
                    <div>
                      <div className={`font-medium ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.name}
                      </div>
                      <div className="text-xs text-gray-400">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <motion.div
                        className="ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zonas de batalla */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
            <Sword className="w-8 h-8 mr-3 text-red-400" />
            Active Battle Zones
          </h3>

          <div className="grid gap-6">
            {battleZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`bg-gradient-to-r ${zone.color} border-none overflow-hidden relative`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="p-3 bg-white/20 rounded-xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <zone.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="text-2xl font-bold text-white">{zone.name}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {zone.difficulty}
                            </Badge>
                            <span className="text-white/80">{zone.participants} luchadores</span>
                            <span className="text-white/80">â±ï¸ {zone.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white mb-2">{zone.reward}</div>
                        <Button
                          onClick={() => handleBattleEnter(zone.id)}
                          className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                          disabled={activeChallenge === zone.id}
                        >
                          {activeChallenge === zone.id ? 'En Batalla' : 'Entrar al Combate'}
                        </Button>
                      </div>
                    </div>

                    {/* Barra de progreso de batalla */}
                    <div className="mt-4">
                      <div className="flex justify-between text-white/80 text-sm mb-2">
                        <span>Progreso de batalla</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div 
                          className="bg-white h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '67%' }}
                          transition={{ duration: 2, delay: index * 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Efectos visuales */}
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ClasificaciÃ³n en tiempo real */}
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-6">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Live Leaderboard
              </h4>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'DragonSlayer_2024', points: 15420, change: '+120' },
                  { rank: 2, name: 'MathWizard_Pro', points: 14890, change: '+85' },
                  { rank: 3, name: 'ScienceNinja', points: 14203, change: '+45' },
                  { rank: gameStats.nationalRank, name: 'TÃš', points: gameStats.battlePoints, change: '+32', highlight: true }
                ].map((player, index) => (
                  <motion.div
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      player.highlight 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                        : 'bg-white/5'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? 'bg-yellow-500 text-black' :
                        player.rank === 2 ? 'bg-gray-400 text-black' :
                        player.rank === 3 ? 'bg-amber-600 text-black' :
                        'bg-blue-500 text-white'
                      }`}>
                        {player.rank}
                      </div>
                      <span className={`font-medium ${player.highlight ? 'text-blue-400' : 'text-white'}`}>
                        {player.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{player.points.toLocaleString()}</div>
                      <div className="text-green-400 text-sm">{player.change}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay de animaciÃ³n de batalla */}
      <AnimatePresence>
        {battleAnimation && (
          <motion.div
            className="fixed inset-0 bg-red-500/20 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
            >
              <motion.div
                className="text-8xl font-bold text-white mb-4"
                animate={{ 
                  textShadow: [
                    "0 0 20px #ff0000",
                    "0 0 40px #ff0000", 
                    "0 0 20px #ff0000"
                  ]
                }}
                transition={{ duration: 0.5, repeat: 4 }}
              >
                BATTLE!
              </motion.div>
              <div className="text-2xl text-white">Entrando al combate...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

