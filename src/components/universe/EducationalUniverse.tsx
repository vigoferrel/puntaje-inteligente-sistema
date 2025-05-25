import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { NeuralBrain } from './NeuralBrain';
import { SubjectGalaxy } from './SubjectGalaxy';
import { UniverseNavigation } from './UniverseNavigation';
import { NeuralAssistant } from './NeuralAssistant';
import { ProgressNebula } from './ProgressNebula';
import { VocationalPredictor } from './VocationalPredictor';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Sparkles, Globe } from 'lucide-react';
import { UniverseMode, Galaxy, UniverseMetrics, UniverseConfig } from '@/types/universe-types';

type UniverseMode = 'overview' | 'subject' | 'neural' | 'prediction' | 'progress';

interface EducationalUniverseProps {
  initialMode?: UniverseMode;
  activeSubject?: string;
}

export const EducationalUniverse: React.FC<EducationalUniverseProps> = ({ 
  initialMode = 'overview',
  activeSubject 
}) => {
  const { user, profile } = useAuth();
  const { isIntersectionalReady, adaptToUser } = useIntersectional();
  
  const [universeMode, setUniverseMode] = useState<UniverseMode>(initialMode);
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(activeSubject || null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [userLevel, setUserLevel] = useState(15);
  const [cosmicEnergy, setCosmicEnergy] = useState(2847);

  // Configuración de galaxias temáticas con tipos unificados
  const galaxies = useMemo<Galaxy[]>(() => [
    {
      id: 'competencia-lectora',
      name: 'Galaxia Verbal',
      color: '#3B82F6',
      position: [8, 0, 0],
      nodes: 45,
      completed: 32,
      description: 'Universo de comprensión y expresión',
      testCode: 'COMPETENCIA_LECTORA'
    },
    {
      id: 'matematica-1',
      name: 'Dimensión Lógica',
      color: '#10B981', 
      position: [0, 0, 8],
      nodes: 38,
      completed: 25,
      description: 'Realidad matemática fundamental',
      testCode: 'MATEMATICA_1'
    },
    {
      id: 'matematica-2',
      name: 'Cosmos Avanzado',
      color: '#8B5CF6',
      position: [-8, 0, 0],
      nodes: 42,
      completed: 18,
      description: 'Matemáticas del infinito',
      testCode: 'MATEMATICA_2'
    },
    {
      id: 'ciencias',
      name: 'Laboratorio Cuántico',
      color: '#F59E0B',
      position: [0, 8, 0],
      nodes: 55,
      completed: 31,
      description: 'Secretos del universo físico',
      testCode: 'CIENCIAS'
    },
    {
      id: 'historia',
      name: 'Línea Temporal',
      color: '#EF4444',
      position: [0, 0, -8],
      nodes: 35,
      completed: 28,
      description: 'Tejido de la humanidad',
      testCode: 'HISTORIA'
    }
  ], []);

  // Activar sistema neural al montar
  useEffect(() => {
    if (user?.id && isIntersectionalReady) {
      adaptToUser({
        educational_universe_active: true,
        neural_mode: universeMode,
        selected_galaxy: selectedGalaxy,
        user_action: 'entering_educational_universe'
      });
    }
  }, [user?.id, isIntersectionalReady, universeMode, selectedGalaxy, adaptToUser]);

  // Métricas del universo en tiempo real
  const universeMetrics = useMemo<UniverseMetrics>(() => {
    const totalNodes = galaxies.reduce((sum, g) => sum + g.nodes, 0);
    const totalCompleted = galaxies.reduce((sum, g) => sum + g.completed, 0);
    const overallProgress = Math.round((totalCompleted / totalNodes) * 100);
    
    return {
      totalNodes,
      totalCompleted,
      overallProgress,
      activeGalaxies: galaxies.filter(g => g.completed > 0).length,
      projectedScore: Math.round(400 + (overallProgress / 100) * 450),
      neuralPower: Math.round(overallProgress * 1.3)
    };
  }, [galaxies]);

  const handleGalaxySelect = (galaxyId: string) => {
    setIsTransitioning(true);
    setSelectedGalaxy(galaxyId);
    setUniverseMode('subject');
    
    setTimeout(() => setIsTransitioning(false), 1200);
  };

  const handleModeChange = (mode: UniverseMode) => {
    setIsTransitioning(true);
    setUniverseMode(mode);
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const returnToOverview = () => {
    setIsTransitioning(true);
    setUniverseMode('overview');
    setSelectedGalaxy(null);
    
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  if (!isIntersectionalReady) {
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
          <div className="text-3xl font-bold">Activando Universo Neural</div>
          <div className="text-cyan-300">Conectando dimensiones educativas...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
      {/* HUD Superior - Métricas del Universo */}
      <motion.div 
        className="absolute top-4 left-4 right-4 z-50 pointer-events-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Card className="bg-black/30 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{universeMetrics.projectedScore}</div>
                  <div className="text-xs opacity-80">Proyección PAES</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{universeMetrics.neuralPower}%</div>
                  <div className="text-xs opacity-80">Poder Neural</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{universeMetrics.totalCompleted}</div>
                  <div className="text-xs opacity-80">Nodos Dominados</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
                  <Globe className="w-3 h-3 mr-1" />
                  Universo Activo
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Brain className="w-3 h-3 mr-1" />
                  IA Neural
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Canvas 3D Principal - El Universo */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 60 }}
          className="absolute inset-0"
        >
          <Environment preset="night" />
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
          
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00FFFF" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#FF00FF" />
          <spotLight 
            position={[0, 20, 0]} 
            angle={0.3} 
            intensity={2} 
            color="#FFFFFF"
            castShadow
          />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
            autoRotate={universeMode === 'overview'}
            autoRotateSpeed={0.3}
          />

          {/* Cerebro Neural Central (SuperPAES) */}
          <NeuralBrain 
            position={[0, 0, 0]}
            scale={universeMode === 'neural' ? 2 : 1}
            isActive={universeMode === 'neural'}
            onClick={() => handleModeChange('neural')}
            userLevel={userLevel}
            cosmicEnergy={cosmicEnergy}
          />

          {/* Galaxias Temáticas */}
          <AnimatePresence>
            {galaxies.map((galaxy) => (
              <SubjectGalaxy
                key={galaxy.id}
                galaxy={galaxy}
                isSelected={selectedGalaxy === galaxy.id}
                isVisible={universeMode === 'overview' || selectedGalaxy === galaxy.id}
                onClick={() => handleGalaxySelect(galaxy.id)}
                scale={selectedGalaxy === galaxy.id ? 1.5 : 1}
              />
            ))}
          </AnimatePresence>

          {/* Nebulosa de Progreso */}
          <ProgressNebula 
            position={[0, -5, 0]}
            progress={universeMetrics.overallProgress}
            isVisible={universeMode === 'progress'}
          />

          {/* Texto del Universo */}
          {universeMode === 'overview' && (
            <Text
              position={[0, 12, 0]}
              fontSize={3}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              font="/fonts/orbitron-bold.woff"
            >
              UNIVERSO NEURAL PAES
            </Text>
          )}
        </Canvas>
      </div>

      {/* Navegación Lateral */}
      <UniverseNavigation
        mode={universeMode}
        onModeChange={handleModeChange}
        onReturnToOverview={returnToOverview}
        galaxies={galaxies}
        selectedGalaxy={selectedGalaxy}
        isTransitioning={isTransitioning}
      />

      {/* Asistente Neural Flotante */}
      <NeuralAssistant 
        mode={universeMode}
        selectedGalaxy={selectedGalaxy}
        userMetrics={universeMetrics}
      />

      {/* Predictor Vocacional */}
      {universeMode === 'prediction' && (
        <VocationalPredictor 
          userProgress={universeMetrics}
          galaxies={galaxies}
          onClose={() => setUniverseMode('overview')}
        />
      )}

      {/* Efectos de Transición */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center h-full">
              <motion.div
                className="text-4xl font-bold text-white"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotateY: [0, 360, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
