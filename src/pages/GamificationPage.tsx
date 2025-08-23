
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  Award, 
  Crown, 
  Star,
  TrendingUp,
  Users,
  Medal
} from 'lucide-react';

const GamificationPage: React.FC = () => {
  const achievements = [
    {
      id: 1,
      title: "Primer Paso",
      description: "Completa tu primer ejercicio",
      icon: Target,
      progress: 100,
      unlocked: true,
      rarity: "common"
    },
    {
      id: 2,
      title: "Racha de Fuego",
      description: "Mantén una racha de 7 días",
      icon: Zap,
      progress: 85,
      unlocked: false,
      rarity: "rare"
    },
    {
      id: 3,
      title: "Maestro PAES",
      description: "Alcanza 700 puntos en simulacro",
      icon: Crown,
      progress: 45,
      unlocked: false,
      rarity: "legendary"
    }
  ];

  const leaderboard = [
    { name: "Estudiante A", score: 2450, rank: 1 },
    { name: "Estudiante B", score: 2380, rank: 2 },
    { name: "Estudiante C", score: 2320, rank: 3 },
    { name: "Tú", score: 2180, rank: 4 },
    { name: "Estudiante E", score: 2150, rank: 5 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              <div>
                <CardTitle className="text-white text-4xl">Sistema de Logros</CardTitle>
                <p className="text-cyan-300 text-lg">Desbloquea recompensas y compite con otros estudiantes</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2,180</div>
              <div className="text-white/70 text-sm">Puntos Totales</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <Medal className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-white/70 text-sm">Logros Desbloqueados</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#4</div>
              <div className="text-white/70 text-sm">Ranking Global</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-white/70 text-sm">Racha de Días</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-yellow-500/20' 
                          : 'bg-gray-500/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          achievement.unlocked 
                            ? 'text-yellow-400' 
                            : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${
                            achievement.unlocked 
                              ? 'text-white' 
                              : 'text-white/70'
                          }`}>
                            {achievement.title}
                          </h4>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-sm mb-2">
                          {achievement.description}
                        </p>
                        <Progress 
                          value={achievement.progress} 
                          className="h-2"
                        />
                        <div className="text-right text-xs text-white/50 mt-1">
                          {achievement.progress}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Tabla de Posiciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.name === 'Tú' 
                      ? 'bg-cyan-500/20 border border-cyan-500/30' 
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-black' :
                      player.rank === 2 ? 'bg-gray-400 text-black' :
                      player.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <span className={`font-medium ${
                      player.name === 'Tú' ? 'text-cyan-300' : 'text-white'
                    }`}>
                      {player.name}
                    </span>
                  </div>
                  <div className="text-white font-bold">
                    {player.score.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default GamificationPage;
