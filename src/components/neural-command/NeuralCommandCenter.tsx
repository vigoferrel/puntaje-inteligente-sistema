import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
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
  const { isIntersectionalReady, adaptToUser } = useIntersectional();
  
  const [activeDimension, setActiveDimension] = useState<NeuralDimension>(initialDimension);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [neuralLevel, setNeuralLevel] = useState(42);
  const [cosmicEnergy, setCosmicEnergy] = useState(8947);
  const [battlePoints, setBattlePoints] = useState(2456);

  // Configuración de galaxias unificada
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

  // Métricas neurales en tiempo real
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

  // Dimensiones neurales de la plataforma
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

  // Activación neural al inicializar
  useEffect(() => {
    if (user?.id && isIntersectionalReady) {
      adaptToUser({
        neural_command_center_active: true,
        active_dimension: activeDimension,
        selected_galaxy: selectedGalaxy,
        neural_level: neuralLevel,
        cosmic_energy: cosmicEnergy,
        user_action: 'entering_neural_command_center'
      });
    }
  }, [user?.id, isIntersectionalReady, activeDimension, selectedGalaxy, neuralLevel, cosmicEnergy, adaptToUser]);

  const handleDimensionTransition = useCallback((dimension: NeuralDimension) => {
    setIsTransitioning(true);
    setActiveDimension(dimension);
    
    // Efectos sonoros y visuales de transición
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

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-32 h-32 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-4xl font-bold">Centro de Comando Neural Optimizado</div>
          <div className="text-cyan-300">Todas las funcionalidades integradas...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <CinematicAudioProvider>
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 overflow-hidden relative">
        
        {/* HUD Neural Superior */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-50 pointer-events-auto"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <div className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 p-4">
            <div className="flex items-center justify-between text-white">
              
              {/* Identidad Neural */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold">{profile?.name || 'Comandante Neural'}</div>
                  <div className="text-sm text-cyan-400">Nivel {neuralLevel} • {cosmicEnergy} Energía Cósmica</div>
                </div>
              </div>

              {/* Métricas Centrales */}
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

              {/* Estado del Sistema */}
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
                  Sistema Unificado
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel de Control Dimensional Lateral */}
        <motion.div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 pointer-events-auto"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 w-80 ml-4">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">Control Dimensional</h3>
                <div className="text-sm text-cyan-400">Todas las funcionalidades unificadas</div>
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
                      <Icon className="w-5 h-5 mr-3" style={{ color: dimension.color }} />
                      <div className="text-left">
                        <div className="font-medium">{dimension.name}</div>
                        <div className="text-xs opacity-80">{dimension.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Estado de Galaxias */}
              <div className="pt-4 border-t border-white/20">
                <h4 className="text-sm font-medium text-white/80 mb-3">Estado Galáctico</h4>
                {galaxies.map((galaxy) => {
                  const progress = (galaxy.completed / galaxy.nodes) * 100;
                  const isSelected = selectedGalaxy === galaxy.id;
                  
                  return (
                    <div
                      key={galaxy.id}
                      className={`p-3 rounded border mb-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-500/20' 
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => handleGalaxyInteraction(galaxy.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">
                          {galaxy.name}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: galaxy.color, color: galaxy.color }}
                        >
                          {Math.round(progress)}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: galaxy.color 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Canvas 3D - El Universo Neural Principal */}
        <div className="absolute inset-0 pt-20">
          <Canvas
            camera={{ position: [0, 5, 30], fov: 60 }}
            className="absolute inset-0"
          >
            <Environment preset="night" />
            <Stars 
              radius={150} 
              depth={80} 
              count={8000} 
              factor={6} 
              saturation={0} 
              fade 
              speed={1.5} 
            />
            
            <ambientLight intensity={0.3} />
            <pointLight position={[15, 15, 15]} intensity={2} color="#00FFFF" />
            <pointLight position={[-15, -15, -15]} intensity={1.5} color="#FF00FF" />
            <spotLight 
              position={[0, 25, 0]} 
              angle={0.4} 
              intensity={3} 
              color="#FFFFFF"
              castShadow
            />

            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minDistance={15}
              maxDistance={120}
              autoRotate={activeDimension === 'universe_exploration'}
              autoRotateSpeed={0.4}
            />

            {/* Cerebro Neural Central - Comando Supremo */}
            <NeuralBrain 
              position={[0, 0, 0]}
              scale={activeDimension === 'neural_training' ? 2.5 : 1.5}
              isActive={activeDimension === 'neural_training'}
              onClick={() => handleDimensionTransition('neural_training')}
              userLevel={neuralLevel}
              cosmicEnergy={cosmicEnergy}
            />

            {/* Galaxias de Conocimiento */}
            <AnimatePresence>
              {galaxies.map((galaxy) => (
                <SubjectGalaxy
                  key={galaxy.id}
                  galaxy={galaxy}
                  isSelected={selectedGalaxy === galaxy.id}
                  isVisible={activeDimension === 'universe_exploration' || selectedGalaxy === galaxy.id}
                  onClick={() => handleGalaxyInteraction(galaxy.id)}
                  scale={selectedGalaxy === galaxy.id ? 2 : 1.2}
                />
              ))}
            </AnimatePresence>

            {/* Nebulosa de Progreso */}
            <ProgressNebula 
              position={[0, -8, 0]}
              progress={neuralMetrics.overallProgress}
              isVisible={activeDimension === 'progress_analysis'}
            />

            {/* Texto del Universo */}
            {activeDimension === 'universe_exploration' && (
              <Text
                position={[0, 15, 0]}
                fontSize={4}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                font="/fonts/orbitron-bold.woff"
              >
                CENTRO DE COMANDO NEURAL UNIFICADO
              </Text>
            )}
          </Canvas>
        </div>

        {/* RENDERER DE DIMENSIONES EXPANDIDO */}
        <NeuralDimensionRenderer
          activeDimension={activeDimension}
          selectedGalaxy={selectedGalaxy}
          neuralMetrics={neuralMetrics}
          onStartTraining={() => handleDimensionTransition('neural_training')}
          onViewAnalysis={handleNavigateToAnalysis}
          onEnterBattle={() => handleDimensionTransition('battle_mode')}
          onNavigateToAnalysis={handleNavigateToAnalysis}
          onNavigateToTraining={handleNavigateToTraining}
        />

        {/* Controles Cinematográficos */}
        <CinematicControls />

        {/* Efectos de Transición Dimensional */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-lg z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center h-full">
                <motion.div
                  className="text-center text-white"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotateY: [0, 360, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-24 h-24 mx-auto mb-4" />
                  <div className="text-3xl font-bold">Transitando Dimensiones</div>
                  <div className="text-lg text-cyan-300">Reconfigurando realidad neural...</div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Asistente Neural Omnipresente */}
        <motion.div
          className="absolute bottom-4 right-4 z-40 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
        >
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 w-80">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-medium">Asistente Neural</div>
                  <div className="text-xs text-cyan-400">Sistema Completamente Unificado</div>
                </div>
              </div>
              <div className="text-white text-sm">
                Todas las funcionalidades han sido quirúrgicamente integradas en una experiencia 
                neural unificada. Análisis, entrenamiento y más, todo centralizado.
              </div>
              <Button className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                <Play className="w-4 h-4 mr-2" />
                Explorar Sistema Unificado
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CinematicAudioProvider>
  );
};
