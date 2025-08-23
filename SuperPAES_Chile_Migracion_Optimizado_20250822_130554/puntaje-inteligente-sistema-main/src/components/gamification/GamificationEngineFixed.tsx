/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Award, Star, Zap, Target } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GameStats {
  level: number;
  experience: number;
  maxExperience: number;
  totalPoints: number;
  streak: number;
  rank: string;
  achievements: number;
}

export const GamificationEngineFixed = () => {
  const [loading, setLoading] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    level: 15,
    experience: 2847,
    maxExperience: 3200,
    totalPoints: 4250,
    streak: 12,
    rank: 'Estudiante Avanzado',
    achievements: 3
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_steps',
      name: 'Primeros Pasos',
      description: 'Completa tu primer ejercicio PAES',
      icon: 'ðŸŽ¯',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      points: 100,
      rarity: 'common'
    },
    {
      id: 'math_master',
      name: 'Maestro Matematico',
      description: 'Resuelve 50 ejercicios de matematica',
      icon: 'ðŸ§®',
      progress: 32,
      maxProgress: 50,
      unlocked: false,
      points: 500,
      rarity: 'rare'
    },
    {
      id: 'reading_champion',
      name: 'Campeon Lector',
      description: 'Obten 90% en comprension lectora',
      icon: 'ðŸ“š',
      progress: 87,
      maxProgress: 90,
      unlocked: false,
      points: 750,
      rarity: 'epic'
    },
    {
      id: 'streak_legend',
      name: 'Leyenda de Racha',
      description: 'Manten una racha de 30 dias',
      icon: 'ðŸ”¥',
      progress: 12,
      maxProgress: 30,
      unlocked: false,
      points: 1000,
      rarity: 'legendary'
    },
    {
      id: 'science_explorer',
      name: 'Explorador Cientifico',
      description: 'Domina los 3 modulos de ciencias',
      icon: 'ðŸ”¬',
      progress: 2,
      maxProgress: 3,
      unlocked: false,
      points: 600,
      rarity: 'epic'
    },
    {
      id: 'history_scholar',
      name: 'Erudito Historico',
      description: 'Completa 25 ejercicios de historia',
      icon: 'ðŸ›ï¸',
      progress: 18,
      maxProgress: 25,
      unlocked: false,
      points: 400,
      rarity: 'rare'
    }
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'epic': return 'border-purple-500/30';
      case 'legendary': return 'border-yellow-500/30';
      default: return 'border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">Nivel {gameStats.level}</span>
          </div>
          <div className="text-green-400 font-bold">{gameStats.totalPoints} pts</div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <div className="text-white font-bold">{gameStats.streak}</div>
            <div className="text-white/60">Dias</div>
          </div>
          <div>
            <div className="text-white font-bold">{gameStats.achievements}</div>
            <div className="text-white/60">Logros</div>
          </div>
          <div>
            <div className="text-white font-bold">{gameStats.rank}</div>
            <div className="text-white/60">Rango</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>EXP</span>
            <span>{gameStats.experience} / {gameStats.maxExperience}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(gameStats.experience / gameStats.maxExperience) * 100}%` }}
              transition={{ duration: 1.5 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-white">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="font-medium">Logros</span>
        </div>

        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 bg-gradient-to-r ${getRarityColor(achievement.rarity)}/10 rounded-xl border ${getRarityBorder(achievement.rarity)} ${
              achievement.unlocked ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{achievement.icon}</span>
                <div>
                  <div className="text-white font-medium text-sm">{achievement.name}</div>
                  <div className="text-white/60 text-xs">{achievement.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {achievement.unlocked && <Award className="w-4 h-4 text-yellow-400" />}
                <span className="text-xs text-white/70">{achievement.points} pts</span>
              </div>
            </div>

            {!achievement.unlocked && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Progreso</span>
                  <span>{achievement.progress} / {achievement.maxProgress}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} h-1.5 rounded-full`}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
