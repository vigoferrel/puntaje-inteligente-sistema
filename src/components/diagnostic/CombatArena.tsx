
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  Sword, 
  Target, 
  Trophy, 
  Flame,
  Star,
  Crown,
  Skull
} from 'lucide-react';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { PAESTest } from '@/types/unified-diagnostic';

interface CombatArenaProps {
  tests: PAESTest[];
  currentScores: Record<TPAESPrueba, number> | null;
  onStartCombat: (prueba: TPAESPrueba) => void;
  onViewProgress: () => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  tests,
  currentScores,
  onStartCombat,
  onViewProgress
}) => {
  const [selectedBoss, setSelectedBoss] = useState<TPAESPrueba | null>(null);
  const [combatMode, setCombatMode] = useState<'selection' | 'preparation' | 'battle'>('selection');
  const [playerStats, setPlayerStats] = useState({
    level: 15,
    xp: 2450,
    streak: 7,
    totalVictories: 23
  });

  // Configuración de "jefes" por materia
  const bossConfig = {
    'COMPETENCIA_LECTORA': {
      name: 'Hydra de Comprensión',
      difficulty: 'Legendario',
      hp: 850,
      abilities: ['Textos Complejos', 'Inferencias Ocultas', 'Análisis Crítico'],
      rewards: ['XP x200', 'Título: Maestro Lector', 'Nuevo Avatar'],
      color: 'from-blue-600 to-cyan-600',
      icon: '📚',
      threat: 'EXTREMO'
    },
    'MATEMATICA_1': {
      name: 'Golem Algebraico',
      difficulty: 'Épico',
      hp: 750,
      abilities: ['Ecuaciones Mortales', 'Funciones Caóticas', 'Geometría Letal'],
      rewards: ['XP x150', 'Calculadora Mágica', 'Skin Matemático'],
      color: 'from-green-600 to-emerald-600',
      icon: '🔢',
      threat: 'ALTO'
    },
    'MATEMATICA_2': {
      name: 'Dragón del Cálculo',
      difficulty: 'Mítico',
      hp: 900,
      abilities: ['Derivadas Infernales', 'Integrales Supremas', 'Límites Infinitos'],
      rewards: ['XP x250', 'Corona de Números', 'Poder Matemático'],
      color: 'from-purple-600 to-pink-600',
      icon: '∫',
      threat: 'APOCALÍPTICO'
    },
    'CIENCIAS': {
      name: 'Kraken Científico',
      difficulty: 'Legendario',
      hp: 800,
      abilities: ['Reacciones Explosivas', 'Leyes Físicas', 'Evolución Mortal'],
      rewards: ['XP x180', 'Laboratorio Personal', 'Bata de Científico'],
      color: 'from-orange-600 to-red-600',
      icon: '⚗️',
      threat: 'EXTREMO'
    },
    'HISTORIA': {
      name: 'Espectro del Tiempo',
      difficulty: 'Épico',
      hp: 700,
      abilities: ['Líneas Temporales', 'Causas Ocultas', 'Análisis Histórico'],
      rewards: ['XP x160', 'Máquina del Tiempo', 'Capa Histórica'],
      color: 'from-yellow-600 to-orange-600',
      icon: '🏛️',
      threat: 'ALTO'
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'APOCALÍPTICO': return 'text-red-500 animate-pulse';
      case 'EXTREMO': return 'text-red-400';
      case 'ALTO': return 'text-orange-400';
      default: return 'text-yellow-400';
    }
  };

  const startBossFight = (prueba: TPAESPrueba) => {
    setSelectedBoss(prueba);
    setCombatMode('preparation');
  };

  const launchCombat = () => {
    if (selectedBoss) {
      setCombatMode('battle');
      onStartCombat(selectedBoss);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 p-6"
    >
      {/* Header épico */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-red-900/80 to-orange-900/80 backdrop-blur-lg border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-red-400 flex items-center mb-2">
                  <Sword className="w-10 h-10 mr-3 animate-pulse" />
                  ARENA DE COMBATE ACADÉMICO
                </h1>
                <p className="text-red-300">
                  🔥 Enfrenta a los jefes más poderosos del conocimiento
                </p>
              </div>
              
              {/* Stats del jugador */}
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-purple-600/20 text-purple-300 border-purple-400">
                    <Crown className="w-3 h-3 mr-1" />
                    Nivel {playerStats.level}
                  </Badge>
                  <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-400">
                    <Star className="w-3 h-3 mr-1" />
                    {playerStats.xp} XP
                  </Badge>
                  <Badge className="bg-green-600/20 text-green-300 border-green-400">
                    <Flame className="w-3 h-3 mr-1" />
                    Racha x{playerStats.streak}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {combatMode === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {tests.map((test) => {
              const prueba = test.code as TPAESPrueba;
              const boss = bossConfig[prueba];
              const currentScore = currentScores?.[prueba] || 0;
              const powerLevel = Math.round((currentScore / 850) * 100);
              
              return (
                <motion.div
                  key={test.id}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                  onClick={() => startBossFight(prueba)}
                >
                  <Card className={`bg-gradient-to-br ${boss.color} bg-opacity-20 backdrop-blur-lg border-2 hover:border-red-400 transition-all duration-300 shadow-2xl hover:shadow-red-500/20`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{boss.icon}</div>
                        <Badge className={`${getThreatColor(boss.threat)} border-current`}>
                          {boss.threat}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-xl">
                        {boss.name}
                      </CardTitle>
                      <p className="text-gray-300 text-sm">
                        {getPruebaDisplayName(prueba)}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Estadísticas del jefe */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-black/30 rounded">
                          <div className="text-red-400 font-bold">{boss.hp}</div>
                          <div className="text-xs text-gray-400">HP</div>
                        </div>
                        <div className="text-center p-2 bg-black/30 rounded">
                          <div className="text-purple-400 font-bold">{boss.difficulty}</div>
                          <div className="text-xs text-gray-400">Rango</div>
                        </div>
                      </div>

                      {/* Habilidades del jefe */}
                      <div>
                        <div className="text-sm text-gray-300 mb-2">Habilidades:</div>
                        <div className="space-y-1">
                          {boss.abilities.map((ability, i) => (
                            <div key={i} className="text-xs text-red-300 flex items-center">
                              <Skull className="w-3 h-3 mr-1" />
                              {ability}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Poder del jugador */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Tu Poder:</span>
                          <span className="text-blue-400">{powerLevel}%</span>
                        </div>
                        <Progress value={powerLevel} className="h-2" />
                      </div>

                      {/* Recompensas */}
                      <div>
                        <div className="text-sm text-gray-300 mb-2">Recompensas:</div>
                        <div className="space-y-1">
                          {boss.rewards.slice(0, 2).map((reward, i) => (
                            <div key={i} className="text-xs text-yellow-300 flex items-center">
                              <Trophy className="w-3 h-3 mr-1" />
                              {reward}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          startBossFight(prueba);
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        ¡DESAFIAR!
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {combatMode === 'preparation' && selectedBoss && (
          <motion.div
            key="preparation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-purple-500/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white mb-4">
                  🛡️ PREPARACIÓN PARA EL COMBATE
                </CardTitle>
                <p className="text-purple-300">
                  Estás a punto de enfrentar al {bossConfig[selectedBoss].name}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Información del jefe */}
                <div className="text-center p-6 bg-black/30 rounded-lg">
                  <div className="text-6xl mb-4">{bossConfig[selectedBoss].icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {bossConfig[selectedBoss].name}
                  </h2>
                  <Badge className="text-red-400 border-red-400 mb-4">
                    {bossConfig[selectedBoss].difficulty}
                  </Badge>
                  
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-red-400 text-2xl font-bold">{bossConfig[selectedBoss].hp}</div>
                      <div className="text-gray-400 text-sm">Puntos de Vida</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-2xl font-bold">{bossConfig[selectedBoss].abilities.length}</div>
                      <div className="text-gray-400 text-sm">Habilidades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 text-2xl font-bold">{bossConfig[selectedBoss].rewards.length}</div>
                      <div className="text-gray-400 text-sm">Recompensas</div>
                    </div>
                  </div>
                </div>

                {/* Estrategia de combate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/40 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-green-400 text-lg flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Tu Arsenal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Conocimiento Base:</span>
                          <span className="text-green-400">{currentScores?.[selectedBoss] || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Ejercicios IA:</span>
                          <span className="text-blue-400">Ilimitados</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">LectoGuía:</span>
                          <span className="text-purple-400">Activo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Nivel Actual:</span>
                          <span className="text-yellow-400">{playerStats.level}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-red-500/30">
                    <CardHeader>
                      <CardTitle className="text-red-400 text-lg flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Estrategia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-300">
                          • Enfócate en conceptos fundamentales
                        </p>
                        <p className="text-gray-300">
                          • Usa ejercicios progresivos
                        </p>
                        <p className="text-gray-300">
                          • Consulta a LectoGuía para hints
                        </p>
                        <p className="text-gray-300">
                          • Mantén tu racha de victorias
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCombatMode('selection')}
                    className="flex-1 border-gray-500 text-gray-300 hover:bg-gray-700"
                  >
                    Volver a Selección
                  </Button>
                  <Button
                    onClick={launchCombat}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-lg py-3"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    ¡INICIAR COMBATE!
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
