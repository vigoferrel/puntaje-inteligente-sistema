import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Medal, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Gift, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Flame, 
  Shield, 
  Sparkles, 
  CheckCircle, 
  User, 
  BarChart3 
} from 'lucide-react';

interface Achievement {
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
}

interface GameStats {
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

const SimpleGamificationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'rankings' | 'progress'>('overview');

  // Datos mock para evitar llamadas a Supabase
  const mockGameStats: GameStats = {
    level: 5,
    experience: 1250,
    maxExperience: 2000,
    totalPoints: 2850,
    streakDays: 7,
    rankTitle: 'Estudiante Avanzado',
    totalAchievements: 25,
    unlockedAchievements: 12,
    nextLevelProgress: 62.5
  };

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Primera Victoria',
      description: 'Completa tu primera sesión de estudio',
      icon: '🎯',
      points: 100,
      rarity: 'common',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      category: 'study'
    },
    {
      id: '2',
      name: 'Racha de 7 Días',
      description: 'Estudia durante 7 días consecutivos',
      icon: '🔥',
      points: 250,
      rarity: 'rare',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      category: 'streak'
    },
    {
      id: '3',
      name: 'Maestro de Matemáticas',
      description: 'Completa 50 ejercicios de matemáticas',
      icon: '📐',
      points: 500,
      rarity: 'epic',
      progress: 35,
      maxProgress: 50,
      unlocked: false,
      category: 'math'
    },
    {
      id: '4',
      name: 'Leyenda PAES',
      description: 'Alcanza el nivel 10',
      icon: '👑',
      points: 1000,
      rarity: 'legendary',
      progress: 5,
      maxProgress: 10,
      unlocked: false,
      category: 'level'
    }
  ];

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const rarityIcons = {
    common: '🥉',
    rare: '🥈',
    epic: '🥇',
    legendary: '👑'
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all duration-300 ${
          achievement.unlocked 
            ? `border-gradient bg-gradient-to-r ${rarityColors[achievement.rarity]} border-transparent` 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
        }`}
      >
        {achievement.unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
          >
            <CheckCircle className="h-4 w-4" />
          </motion.div>
        )}

        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${
            achievement.unlocked 
              ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white` 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}>
            <span className="text-2xl">{achievement.icon}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold ${
                achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {achievement.name}
              </h3>
              <span className="text-xs">{rarityIcons[achievement.rarity]}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                achievement.rarity === 'legendary' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : achievement.rarity === 'epic'
                  ? 'bg-purple-100 text-purple-800'
                  : achievement.rarity === 'rare'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {achievement.rarity.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {achievement.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progreso</span>
                <span className="font-medium">{achievement.progress}/{achievement.maxProgress}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  className={`h-2 rounded-full ${
                    achievement.unlocked 
                      ? `bg-gradient-to-r ${rarityColors[achievement.rarity]}` 
                      : 'bg-blue-500'
                  }`}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Puntos</span>
                <span className="font-bold text-yellow-600">{achievement.points}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Target },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'rankings', label: 'Ranking', icon: TrendingUp },
    { id: 'progress', label: 'Progreso', icon: BarChart3 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏆 Gamificación</h1>
            <p className="text-lg opacity-90">Sistema de logros y recompensas</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{mockGameStats.totalPoints}</div>
            <div className="text-sm opacity-80">Puntos Totales</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nivel</p>
              <p className="text-xl font-bold">{mockGameStats.level}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Racha</p>
              <p className="text-xl font-bold">{mockGameStats.streakDays} días</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Logros</p>
              <p className="text-xl font-bold">{mockGameStats.unlockedAchievements}/{mockGameStats.totalAchievements}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rango</p>
              <p className="text-xl font-bold">{mockGameStats.rankTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {selectedTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Level Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Progreso de Nivel</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nivel {mockGameStats.level}</span>
                  <span className="text-sm font-medium">{mockGameStats.experience}/{mockGameStats.maxExperience} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockGameStats.nextLevelProgress}%` }}
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-500">Siguiente nivel: {mockGameStats.nextLevelProgress}%</p>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Logros Recientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAchievements.filter(a => a.unlocked).slice(0, 4).map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Todos los Logros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'rankings' && (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Ranking Global</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((position) => (
                  <div key={position} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      position === 1 ? 'bg-yellow-500 text-white' :
                      position === 2 ? 'bg-gray-400 text-white' :
                      position === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-300 text-gray-700'
                    }`}>
                      {position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Usuario {position}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nivel {Math.floor(Math.random() * 10) + 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{Math.floor(Math.random() * 5000) + 1000}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">puntos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {selectedTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Estadísticas de Progreso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Actividad Reciente</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Sesiones esta semana</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tiempo total</span>
                      <span className="font-medium">8h 45m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ejercicios completados</span>
                      <span className="font-medium">156</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Metas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Meta diaria</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Meta semanal</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Meta mensual</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleGamificationDashboard;
