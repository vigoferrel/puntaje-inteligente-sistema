
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sword, Shield, Zap, Trophy, Target, Crown, 
  Flame, Star, Gamepad2, Award, TrendingUp, Users
} from 'lucide-react';

interface BattleStats {
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  rank: number;
  points: number;
  level: number;
}

interface BattleArena {
  id: string;
  name: string;
  subject: string;
  difficulty: 'Elite' | 'Legendary' | 'Master' | 'Champion';
  participants: number;
  timeLeft: string;
  reward: string;
  icon: any;
  color: string;
}

interface BattleModeInterfaceProps {
  onEnterBattle: (arenaId: string) => void;
  onSpectate: (arenaId: string) => void;
}

export const BattleModeInterface: React.FC<BattleModeInterfaceProps> = ({
  onEnterBattle,
  onSpectate
}) => {
  const [activeTab, setActiveTab] = useState<'arenas' | 'leaderboard' | 'tournaments'>('arenas');
  const [battleStats, setBattleStats] = useState<BattleStats>({
    wins: 127,
    losses: 34,
    winRate: 78.9,
    currentStreak: 12,
    rank: 156,
    points: 2847,
    level: 23
  });

  const [battleArenas] = useState<BattleArena[]>([
    {
      id: 'reading-colosseum',
      name: 'Coliseo de Lectura',
      subject: 'Competencia Lectora',
      difficulty: 'Elite',
      participants: 1247,
      timeLeft: '2h 15m',
      reward: '500 XP',
      icon: Target,
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'math-arena',
      name: 'Arena Matemática',
      subject: 'Matemática M1',
      difficulty: 'Legendary',
      participants: 892,
      timeLeft: '45m',
      reward: '750 XP',
      icon: Sword,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'science-laboratory',
      name: 'Laboratorio Científico',
      subject: 'Ciencias',
      difficulty: 'Master',
      participants: 634,
      timeLeft: '1h 30m',
      reward: '650 XP',
      icon: Zap,
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'ultimate-championship',
      name: 'Campeonato Supremo',
      subject: 'Todas las Materias',
      difficulty: 'Champion',
      participants: 2156,
      timeLeft: '6h 20m',
      reward: '2000 XP',
      icon: Crown,
      color: 'from-red-500 to-orange-600'
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: 'NeuralMaster_2024', points: 15420, wins: 342, streak: 28 },
    { rank: 2, name: 'QuantumLearner', points: 14890, wins: 298, streak: 15 },
    { rank: 3, name: 'PAESWarrior', points: 14203, wins: 276, streak: 23 },
    { rank: 4, name: 'EduGladiator', points: 13985, wins: 312, streak: 8 },
    { rank: battleStats.rank, name: 'TU', points: battleStats.points, wins: battleStats.wins, streak: battleStats.currentStreak, highlight: true }
  ]);

  const handleEnterArena = useCallback((arenaId: string) => {
    onEnterBattle(arenaId);
  }, [onEnterBattle]);

  const renderArenas = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {battleArenas.map((arena, index) => (
          <motion.div
            key={arena.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-r ${arena.color} border-none overflow-hidden relative group cursor-pointer`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="p-3 bg-white/20 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <arena.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{arena.name}</h3>
                      <p className="text-white/80">{arena.subject}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {arena.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-white/90 text-sm mb-4">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {arena.participants.toLocaleString()} guerreros
                  </span>
                  <span>⏱️ {arena.timeLeft}</span>
                  <span className="font-bold">{arena.reward}</span>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleEnterArena(arena.id)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  >
                    <Sword className="w-4 h-4 mr-2" />
                    Entrar al Combate
                  </Button>
                  <Button
                    onClick={() => onSpectate(arena.id)}
                    variant="outline"
                    className="bg-black/20 text-white border-white/30 hover:bg-white/10"
                  >
                    👁️ Observar
                  </Button>
                </div>

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
    </div>
  );

  const renderLeaderboard = () => (
    <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Clasificación Global
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <motion.div
              key={player.rank}
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                player.highlight 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  player.rank === 1 ? 'bg-yellow-500 text-black' :
                  player.rank === 2 ? 'bg-gray-400 text-black' :
                  player.rank === 3 ? 'bg-amber-600 text-black' :
                  player.highlight ? 'bg-blue-500 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {player.rank}
                </div>
                <div>
                  <div className={`font-bold ${player.highlight ? 'text-blue-400' : 'text-white'}`}>
                    {player.name}
                  </div>
                  <div className="text-gray-400 text-sm">{player.wins} victorias</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{player.points.toLocaleString()}</div>
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {player.streak} racha
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-black p-6">
      {/* Battle Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-red-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Gamepad2 className="w-8 h-8 text-red-400" />
              </motion.div>
              BATTLE ARENA NEURAL
              <Badge className="bg-gradient-to-r from-red-600 to-orange-600">
                ACTIVO
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-red-500/20 rounded-xl">
                <div className="text-2xl font-bold text-white">{battleStats.wins}</div>
                <div className="text-xs text-white/70">Victorias</div>
              </div>
              <div className="text-center p-3 bg-blue-500/20 rounded-xl">
                <div className="text-2xl font-bold text-white">{battleStats.winRate}%</div>
                <div className="text-xs text-white/70">Tasa Éxito</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/20 rounded-xl">
                <div className="text-2xl font-bold text-white">#{battleStats.rank}</div>
                <div className="text-xs text-white/70">Ranking</div>
              </div>
              <div className="text-center p-3 bg-green-500/20 rounded-xl">
                <div className="text-2xl font-bold text-white">{battleStats.currentStreak}</div>
                <div className="text-xs text-white/70">Racha</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setActiveTab('arenas')}
                className={activeTab === 'arenas' 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Sword className="w-4 h-4 mr-2" />
                Arenas de Batalla
              </Button>
              <Button
                onClick={() => setActiveTab('leaderboard')}
                className={activeTab === 'leaderboard' 
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Trophy className="w-4 h-4 mr-2" />
                Clasificación
              </Button>
              <Button
                onClick={() => setActiveTab('tournaments')}
                className={activeTab === 'tournaments' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Crown className="w-4 h-4 mr-2" />
                Torneos
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'arenas' && renderArenas()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
          {activeTab === 'tournaments' && (
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="p-8 text-center">
                <Crown className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Torneos Épicos</h3>
                <p className="text-white/70 mb-4">Próximamente: Campeonatos por niveles con premios épicos</p>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
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
