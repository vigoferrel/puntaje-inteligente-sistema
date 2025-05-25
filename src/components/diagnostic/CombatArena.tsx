
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Target, 
  Sword, 
  Shield,
  Trophy,
  Flame,
  Star,
  ChevronRight,
  Activity,
  Timer
} from 'lucide-react';

interface CombatArenaProps {
  tests: any[];
  currentScores: any;
  onStartCombat: (prueba: string) => void;
  onViewProgress: () => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  tests,
  currentScores,
  onStartCombat,
  onViewProgress
}) => {
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);
  const [combatReady, setCombatReady] = useState(false);
  const [arenaEnergy, setArenaEnergy] = useState(0);

  // Initialize arena
  useEffect(() => {
    const energySequence = async () => {
      for (let i = 0; i <= 100; i += 3) {
        setArenaEnergy(i);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      setCombatReady(true);
    };

    energySequence();
  }, []);

  const battleModes = [
    {
      id: 'COMPETENCIA_LECTORA',
      name: 'Duelo de Lectura',
      difficulty: 'EXPERT',
      icon: Target,
      color: 'blue',
      description: 'Domina la comprensión y análisis textual'
    },
    {
      id: 'MATEMATICA_1',
      name: 'Arena Matemática I',
      difficulty: 'WARRIOR',
      icon: Sword,
      color: 'green',
      description: 'Combate con álgebra y geometría básica'
    },
    {
      id: 'MATEMATICA_2',
      name: 'Arena Matemática II',
      difficulty: 'LEGEND',
      icon: Flame,
      color: 'red',
      description: 'Desafío de matemática avanzada'
    },
    {
      id: 'CIENCIAS',
      name: 'Laboratorio de Combate',
      difficulty: 'MASTER',
      icon: Star,
      color: 'purple',
      description: 'Batalla científica multidisciplinaria'
    },
    {
      id: 'HISTORIA',
      name: 'Coliseo Histórico',
      difficulty: 'SAGE',
      icon: Shield,
      color: 'yellow',
      description: 'Enfrentamiento de conocimiento histórico'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'WARRIOR': return 'text-green-400 border-green-400/50';
      case 'EXPERT': return 'text-blue-400 border-blue-400/50';
      case 'MASTER': return 'text-purple-400 border-purple-400/50';
      case 'LEGEND': return 'text-red-400 border-red-400/50';
      case 'SAGE': return 'text-yellow-400 border-yellow-400/50';
      default: return 'text-gray-400 border-gray-400/50';
    }
  };

  const getScoreForBattle = (battleId: string) => {
    return currentScores?.[battleId] || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black p-6"
    >
      {/* Arena Effects */}
      <div className="absolute inset-0">
        {/* Combat particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: 360,
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Energy rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute border border-red-400/20 rounded-full"
              style={{
                width: `${ring * 300}px`,
                height: `${ring * 300}px`,
              }}
              animate={{
                rotate: -360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + ring * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Arena Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-8"
      >
        <Card className="bg-black/80 backdrop-blur-lg border-red-500/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: ['0 0 20px #ef4444', '0 0 30px #ef4444', '0 0 20px #ef4444']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-4"
              >
                <h1 className="text-4xl font-bold text-red-400 tracking-wider">
                  ⚔️ ARENA DE COMBATE ACADÉMICO ⚔️
                </h1>
              </motion.div>
              
              <p className="text-red-300 text-lg mb-4">
                Enfrenta desafíos épicos y demuestra tu dominio en cada disciplina
              </p>

              {/* Arena Energy */}
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-300">Energía de Arena</span>
                  <span className="text-red-400 font-mono">{arenaEnergy}%</span>
                </div>
                <Progress value={arenaEnergy} className="h-3 bg-gray-800">
                  <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-300" />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Battle Selection */}
      <AnimatePresence>
        {combatReady && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {battleModes.map((battle, index) => {
              const score = getScoreForBattle(battle.id);
              const isSelected = selectedBattle === battle.id;
              
              return (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`cursor-pointer ${isSelected ? 'ring-2 ring-red-400' : ''}`}
                  onClick={() => setSelectedBattle(battle.id)}
                >
                  <Card className={`bg-black/70 backdrop-blur-sm border-${battle.color}-500/50 h-full transition-all duration-300 ${
                    isSelected ? 'shadow-[0_0_30px_rgba(239,68,68,0.5)]' : ''
                  }`}>
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className={`p-4 rounded-full bg-${battle.color}-600/20 border border-${battle.color}-500/50`}>
                          <battle.icon className={`w-8 h-8 text-${battle.color}-400`} />
                        </div>
                      </div>
                      
                      <CardTitle className={`text-${battle.color}-400 text-xl`}>
                        {battle.name}
                      </CardTitle>
                      
                      <Badge className={getDifficultyColor(battle.difficulty)}>
                        {battle.difficulty}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 text-sm text-center">
                        {battle.description}
                      </p>
                      
                      {/* Current Score */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">
                          {score}
                        </div>
                        <div className="text-xs text-gray-400">Puntaje Actual</div>
                        <Progress 
                          value={score / 8.5} 
                          className="h-2 mt-2"
                        />
                      </div>

                      {/* Combat Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-gray-900/50 rounded">
                          <Activity className="w-4 h-4 mx-auto mb-1 text-green-400" />
                          <div className="text-green-400">
                            {score > 600 ? 'DOMINADO' : score > 400 ? 'EN PROGRESO' : 'DESAFÍO'}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-900/50 rounded">
                          <Timer className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                          <div className="text-blue-400">45min</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combat Actions */}
      <AnimatePresence>
        {selectedBattle && combatReady && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative z-10"
          >
            <Card className="bg-black/80 backdrop-blur-lg border-red-500/50 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Sword className="w-16 h-16 text-red-400 mx-auto mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    ¿Listo para el combate?
                  </h2>
                  <p className="text-gray-300">
                    Has seleccionado: <span className="text-red-400 font-semibold">
                      {battleModes.find(b => b.id === selectedBattle)?.name}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => onStartCombat(selectedBattle)}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    INICIAR COMBATE
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onViewProgress}
                    className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10 px-6 py-3"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Ver Progreso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combat Ready Indicator */}
      {!selectedBattle && combatReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 text-center"
        >
          <Card className="bg-black/60 backdrop-blur-sm border-gray-500/30 max-w-md mx-auto">
            <CardContent className="p-6">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Selecciona tu Arena</h3>
              <p className="text-gray-400">
                Elige una disciplina para comenzar tu entrenamiento de combate
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};
