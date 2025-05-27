
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Zap, Target, Sparkles, Globe, Network, 
  Award, BookOpen, TrendingUp, Users, Settings,
  Play, Pause, RotateCcw, Maximize2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { useRealUserMetrics } from '@/hooks/useRealUserMetrics';
import { useBattleSystem } from '@/hooks/useBattleSystem';
import { EcosystemIntegrationEngine } from './EcosystemIntegrationEngine';
import { AchievementTracker } from '../achievement-system/AchievementTracker';

export const OptimizedEducationalUniverse: React.FC = () => {
  const { user } = useAuth();
  const { state, updatePreferences, resetToOptimal } = useGlobalCinematic();
  const { metrics, isLoading } = useRealUserMetrics();
  const { availableBattles, userBattles, activeBattle } = useBattleSystem();
  
  const [battleMode, setBattleMode] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  // Métricas del universo calculadas
  const universeMetrics = useMemo(() => {
    const totalExercises = metrics.exercisesCompleted;
    const avgScore = metrics.averageScore;
    const projectedPAES = Math.round(400 + (avgScore / 100) * 450);
    const neuralPower = Math.round(avgScore * 1.2);
    
    return {
      totalExercises,
      avgScore,
      projectedPAES,
      neuralPower,
      activeBattles: availableBattles.length,
      userLevel: metrics.level
    };
  }, [metrics, availableBattles.length]);

  // Configuración de dimensiones del universo
  const universeDimensions = [
    {
      id: 'neural',
      name: 'Red Neural',
      description: 'Análisis de patrones cognitivos',
      color: 'from-cyan-500 to-blue-600',
      icon: Brain,
      progress: universeMetrics.neuralPower
    },
    {
      id: 'battle',
      name: 'Arena de Combate',
      description: 'Duelos académicos en tiempo real',
      color: 'from-red-500 to-pink-600',
      icon: Target,
      progress: userBattles.length * 10
    },
    {
      id: 'ecosystem',
      name: 'Ecosistema Integrado',
      description: 'Sincronización de módulos educativos',
      color: 'from-green-500 to-emerald-600',
      icon: Network,
      progress: 85
    },
    {
      id: 'achievements',
      name: 'Sistema de Logros',
      description: 'Reconocimientos y milestones',
      color: 'from-yellow-500 to-orange-600',
      icon: Award,
      progress: state.achievements.length * 20
    }
  ];

  // Efectos de optimización automática
  useEffect(() => {
    if (state.preferences.adaptivePerformance && state.performanceMetrics.memoryUsage > 150) {
      updatePreferences({
        particleIntensity: 'low',
        immersionLevel: 'minimal'
      });
    }
  }, [state.performanceMetrics.memoryUsage, state.preferences.adaptivePerformance, updatePreferences]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-3xl font-bold">Inicializando Universo Neural</div>
          <div className="text-cyan-300">Cargando métricas en tiempo real...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: state.preferences.particleIntensity === 'high' ? 50 : 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Panel de Control Principal */}
      <motion.div 
        className="absolute top-4 left-4 right-4 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-black/30 backdrop-blur-xl border-cyan-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-400" />
                Universo Educativo Neural
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
                  v2.0 Optimizado
                </Badge>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBattleMode(!battleMode)}
                  className={`border-red-500/50 ${battleMode ? 'bg-red-600 text-white' : 'text-red-400'}`}
                >
                  <Target className="w-4 h-4 mr-1" />
                  {battleMode ? 'Salir Arena' : 'Modo Batalla'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="border-purple-500/50 text-purple-400"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToOptimal}
                  className="border-green-500/50 text-green-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Métricas Principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{universeMetrics.projectedPAES}</div>
                <div className="text-xs text-gray-400">Proyección PAES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{universeMetrics.neuralPower}%</div>
                <div className="text-xs text-gray-400">Poder Neural</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{universeMetrics.totalExercises}</div>
                <div className="text-xs text-gray-400">Ejercicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{universeMetrics.userLevel}</div>
                <div className="text-xs text-gray-400">Nivel</div>
              </div>
            </div>

            {/* Dimensiones del Universo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {universeDimensions.map((dimension) => {
                const Icon = dimension.icon;
                return (
                  <motion.div
                    key={dimension.id}
                    className={`p-4 rounded-lg bg-gradient-to-r ${dimension.color} bg-opacity-20 border border-white/10 cursor-pointer hover:bg-opacity-30 transition-all`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDimension(dimension.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">{dimension.name}</span>
                      </div>
                      <span className="text-cyan-400 text-sm">{dimension.progress}%</span>
                    </div>
                    <Progress value={dimension.progress} className="h-2 mb-1" />
                    <p className="text-gray-300 text-xs">{dimension.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contenido Principal Expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute top-48 left-4 right-4 bottom-4 z-40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Motor de Integración del Ecosistema */}
              <EcosystemIntegrationEngine />
              
              {/* Sistema de Logros */}
              <AchievementTracker />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicadores de Estado del Sistema */}
      <motion.div 
        className="absolute bottom-4 left-4 right-4 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-black/20 backdrop-blur-lg border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Sistema Activo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span>IA Neural: {state.systemHealth}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Rendimiento: {state.performanceMetrics.fps} FPS</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={`${battleMode ? 'bg-red-600' : 'bg-blue-600'}`}>
                  {battleMode ? 'MODO BATALLA' : 'MODO ESTUDIO'}
                </Badge>
                <Badge className="bg-purple-600">
                  {state.preferences.immersionLevel.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Efectos de Transición Cinematográfica */}
      <AnimatePresence>
        {state.isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-6xl text-white"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
