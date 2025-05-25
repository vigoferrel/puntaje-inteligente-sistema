
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';
import { OptimizedLoadingScreen } from '@/components/loading/OptimizedLoadingScreen';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, Zap, Target, Sparkles, Globe, Play, Rocket, 
  Star, Crown, Trophy, TrendingUp, BarChart3, Calendar,
  Settings, User, BookOpen, Gamepad2, PieChart, Activity
} from 'lucide-react';
import { NeuralBrain } from '../universe/NeuralBrain';
import { SubjectGalaxy } from '../universe/SubjectGalaxy';
import { ProgressNebula } from '../universe/ProgressNebula';
import { CinematicAudioProvider, CinematicControls } from '../cinematic/UniversalCinematicSystem';
import { NeuralDimensionRenderer } from './NeuralDimensionRenderer';
import { UniverseMode, Galaxy, UniverseMetrics } from '@/types/universe-types';

type NeuralDimension = 
  | 'universe_exploration' 
  | 'neural_training' 
  | 'vocational_prediction' 
  | 'progress_analysis' 
  | 'battle_mode'
  | 'financial_center'
  | 'calendar_management'
  | 'settings_control'
  | 'analisis_avanzado'
  | 'entrenamiento_adaptativo';

interface NeuralCommandProps {
  initialDimension?: NeuralDimension;
}

export const NeuralCommandCenter: React.FC<NeuralCommandProps> = ({ 
  initialDimension = 'universe_exploration' 
}) => {
  const { user, profile } = useAuth();
  const intersectional = useSimplifiedIntersectional();
  const [showLoading, setShowLoading] = useState(true);
  const [activeDimension, setActiveDimension] = useState<NeuralDimension>(initialDimension);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [neuralLevel, setNeuralLevel] = useState(42);
  const [cosmicEnergy, setCosmicEnergy] = useState(8947);
  const [battlePoints, setBattlePoints] = useState(2456);

  // ✅ CONTROLAR LA PANTALLA DE CARGA - INMEDIATO
  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
    console.log('⚡ Dashboard cargado inmediatamente');
  }, []);

  // ✅ CARGA INMEDIATA - NO ESPERAR CONTEXTO
  useEffect(() => {
    // Forzar carga inmediata si el sistema tarda
    const forceLoad = setTimeout(() => {
      if (showLoading) {
        console.log('⚡ Forzando carga inmediata del dashboard');
        setShowLoading(false);
      }
    }, 300); // ✅ 300ms máximo

    return () => clearTimeout(forceLoad);
  }, [showLoading]);

  // ✅ MOSTRAR LOADING SOLO POR MÁXIMO 500MS
  if (showLoading) {
    return <OptimizedLoadingScreen onComplete={handleLoadingComplete} maxLoadTime={500} />;
  }

  // ✅ CONFIGURACIÓN DE GALAXIAS
  const galaxies = useMemo<Galaxy[]>(() => [
    {
      id: 'competencia-lectora',
      name: 'Nexus Verbal',
      color: '#00FFFF',
      position: [12, 0, 0] as [number, number, number],
      nodes: 45,
      completed: 32,
      description: 'Dimensión de comprensión neural',
      testCode: 'COMPETENCIA_LECTORA'
    },
    {
      id: 'matematica-1',
      name: 'Matriz Lógica',
      color: '#00FF88', 
      position: [0, 0, 12] as [number, number, number],
      nodes: 38,
      completed: 25,
      description: 'Realidad matemática cuántica',
      testCode: 'MATEMATICA_1'
    },
    {
      id: 'matematica-2',
      name: 'Cosmos Infinito',
      color: '#8833FF',
      position: [-12, 0, 0] as [number, number, number],
      nodes: 42,
      completed: 18,
      description: 'Matemáticas del multiverso',
      testCode: 'MATEMATICA_2'
    },
    {
      id: 'ciencias',
      name: 'Laboratorio Cuántico',
      color: '#FF8800',
      position: [0, 12, 0] as [number, number, number],
      nodes: 55,
      completed: 31,
      description: 'Secretos del universo físico',
      testCode: 'CIENCIAS'
    },
    {
      id: 'historia',
      name: 'Línea Temporal',
      color: '#FF3366',
      position: [0, 0, -12] as [number, number, number],
      nodes: 35,
      completed: 28,
      description: 'Tejido espacio-temporal',
      testCode: 'HISTORIA'
    }
  ], []);

  // ✅ MÉTRICAS NEURALES SIEMPRE DISPONIBLES
  const neuralMetrics = useMemo<UniverseMetrics>(() => {
    const totalNodes = galaxies.reduce((sum, g) => sum + g.nodes, 0);
    const totalCompleted = galaxies.reduce((sum, g) => sum + g.completed, 0);
    const overallProgress = Math.round((totalCompleted / totalNodes) * 100);
    
    return {
      totalNodes,
      totalCompleted,
      overallProgress,
      activeGalaxies: galaxies.filter(g => g.completed > 0).length,
      projectedScore: Math.round(400 + (overallProgress / 100) * 450),
      neuralPower: Math.round(overallProgress * 1.5)
    };
  }, [galaxies]);

  // ✅ DIMENSIONES NEURALES
  const neuralDimensions = useMemo(() => [
    {
      id: 'universe_exploration' as NeuralDimension,
      name: 'Exploración Universal',
      icon: Globe,
      color: '#00FFFF',
      description: 'Navega por las galaxias del conocimiento'
    },
    {
      id: 'neural_training' as NeuralDimension,
      name: 'Entrenamiento Neural',
      icon: Brain,
      color: '#8833FF',
      description: 'Ejercita tu mente con IA adaptativa'
    },
    {
      id: 'analisis_avanzado' as NeuralDimension,
      name: 'Análisis Avanzado',
      icon: PieChart,
      color: '#00FF88',
      description: 'Métricas predictivas y análisis profundo'
    },
    {
      id: 'entrenamiento_adaptativo' as NeuralDimension,
      name: 'Entrenamiento Adaptativo',
      icon: Activity,
      color: '#FF8800',
      description: 'IA que se adapta a tu estilo de aprendizaje'
    },
    {
      id: 'vocational_prediction' as NeuralDimension,
      name: 'Predicción Vocacional',
      icon: Target,
      color: '#FF8800',
      description: 'Descubre tu futuro profesional'
    },
    {
      id: 'progress_analysis' as NeuralDimension,
      name: 'Análisis de Progreso',
      icon: BarChart3,
      color: '#00FF88',
      description: 'Métricas avanzadas de rendimiento'
    },
    {
      id: 'battle_mode' as NeuralDimension,
      name: 'Modo Batalla',
      icon: Gamepad2,
      color: '#FF3366',
      description: 'Desafíos competitivos en tiempo real'
    },
    {
      id: 'calendar_management' as NeuralDimension,
      name: 'Gestión Temporal',
      icon: Calendar,
      color: '#FFAA00',
      description: 'Organiza tu cronograma neural'
    }
  ], []);

  // ✅ FUNCIONES DE NAVEGACIÓN
  const handleDimensionTransition = useCallback((dimension: NeuralDimension) => {
    setIsTransitioning(true);
    setActiveDimension(dimension);
    setTimeout(() => setIsTransitioning(false), 1500);
  }, []);

  const handleGalaxyInteraction = useCallback((galaxyId: string) => {
    setSelectedGalaxy(galaxyId);
    setActiveDimension('neural_training');
    handleDimensionTransition('neural_training');
  }, [handleDimensionTransition]);

  const handleNavigateToAnalysis = useCallback(() => {
    handleDimensionTransition('analisis_avanzado');
  }, [handleDimensionTransition]);

  const handleNavigateToTraining = useCallback(() => {
    handleDimensionTransition('entrenamiento_adaptativo');
  }, [handleDimensionTransition]);

  return (
    <CinematicAudioProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 overflow-hidden relative">
        
        {/* ✅ HUD NEURAL SUPERIOR OPTIMIZADO */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-50 pointer-events-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 p-4">
            <div className="flex items-center justify-between text-white">
              
              {/* ✅ IDENTIDAD NEURAL */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold">{profile?.name || 'Comandante Neural'}</div>
                  <div className="text-sm text-cyan-400">Nivel {neuralLevel} • {cosmicEnergy} Energía Cósmica</div>
                </div>
              </div>

              {/* ✅ MÉTRICAS CENTRALES */}
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{neuralMetrics.projectedScore}</div>
                  <div className="text-xs opacity-80">Proyección PAES</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{neuralMetrics.neuralPower}%</div>
                  <div className="text-xs opacity-80">Poder Neural</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{battlePoints}</div>
                  <div className="text-xs opacity-80">Puntos Batalla</div>
                </div>
              </div>

              {/* ✅ ESTADO DEL SISTEMA */}
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
                  <Rocket className="w-3 h-3 mr-1" />
                  Neural Activo
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Star className="w-3 h-3 mr-1" />
                  IA Adaptativa
                </Badge>
                <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600">
                  <PieChart className="w-3 h-3 mr-1" />
                  Sistema Listo
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ✅ PANEL DE CONTROL DIMENSIONAL */}
        <motion.div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 pointer-events-auto"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 w-80 ml-4">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Control Dimensional</h3>
                <div className="text-sm text-cyan-400">Sistema operativo</div>
              </div>

              <div className="space-y-3">
                {neuralDimensions.map((dimension) => {
                  const Icon = dimension.icon;
                  const isActive = activeDimension === dimension.id;
                  
                  return (
                    <Button
                      key={dimension.id}
                      onClick={() => handleDimensionTransition(dimension.id)}
                      variant={isActive ? "default" : "outline"}
                      className={`w-full justify-start h-auto p-4 ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700' 
                          : 'border-white/30 text-white hover:bg-white/10'
                      }`}
                      disabled={isTransitioning}
                    >
                      <Icon className="w-6 h-6 mr-3 flex-shrink-0" style={{ color: dimension.color }} />
                      <div className="text-left">
                        <div className="font-bold text-sm">{dimension.name}</div>
                        <div className="text-xs opacity-80">{dimension.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ CONTENIDO PRINCIPAL */}
        <div className="flex-1 pt-24">
          <NeuralDimensionRenderer
            activeDimension={activeDimension}
            selectedGalaxy={selectedGalaxy}
            galaxies={galaxies}
            neuralMetrics={neuralMetrics}
            onGalaxyInteraction={handleGalaxyInteraction}
            onNavigateToAnalysis={handleNavigateToAnalysis}
            onNavigateToTraining={handleNavigateToTraining}
            isTransitioning={isTransitioning}
          />
        </div>

        {/* ✅ FOOTER NEURAL */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 z-40 pointer-events-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-black/30 backdrop-blur-xl border-t border-cyan-500/20 p-3">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema Neural Activo</span>
                </div>
                <div>Estado: ✅ Operativo</div>
                <div>Carga: ⚡ Inmediata</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CinematicControls />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </CinematicAudioProvider>
  );
};
