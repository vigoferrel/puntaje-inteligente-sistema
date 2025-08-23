/* eslint-disable react-refresh/only-export-components */
import React, { useState, useMemo, useCallback } from 'react';
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html, Stars, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  Target, 
  Brain, 
  Trophy
} from 'lucide-react';
import { usePAESData } from '../../hooks/use-paes-data';
import { useLearningNodes } from '../../hooks/use-learning-nodes';
import { useAuth } from '../../hooks/useAuth';
import { useNeuralCinematicLoading } from '../../hooks/useNeuralCinematicLoading';
import { InteractiveNodeGroup } from './InteractiveNodeGroup';
import { UniverseControls } from './UniverseControls';
import { LearningPathway } from './LearningPathway';
import { OptimalPathSidebar } from './OptimalPathSidebar';
import { TPAESPrueba } from '../../types/system-types';
import { Position3D } from '../../types/universe-types';

interface ViewMode {
  mode: 'galaxy' | 'constellation' | 'node' | 'pathway';
  focus?: TPAESPrueba | string;
}

interface ConstellationData {
  test: unknown;
  position: Position3D;
  nodes: unknown[];
  color: string;
  completionRate: number;
}

export const PAESLearningUniverse: React.FC = React.memo(() => {
  const { user } = useAuth();
  const { tests, skills, loading } = usePAESData();
  const { nodes, nodeProgress, fetchLearningNodes } = useLearningNodes();
  
  const [viewMode, setViewMode] = useState<ViewMode>({ mode: 'galaxy' });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showPathways, setShowPathways] = useState(false);
  const [startTime] = useState(Date.now());
  const [filters, setFilters] = useState({
    tier: 'all',
    difficulty: 'all',
    status: 'all'
  });

  // Optimized universe layout calculation
  const universeLayout = useMemo(() => {
    if (!tests.length || !nodes.length) return { constellations: [], totalNodes: 0, completedNodes: 0 };

    const constellations: ConstellationData[] = tests.map((test, testIndex) => {
      const testNodes = nodes.filter(node => 
        node.testId === test.id ||
        (test.code === 'COMPETENCIA_LECTORA' && node.prueba === 'COMPETENCIA_LECTORA') ||
        (test.code === 'MATEMATICA_1' && node.prueba === 'MATEMATICA_1') ||
        (test.code === 'MATEMATICA_2' && node.prueba === 'MATEMATICA_2') ||
        (test.code === 'CIENCIAS' && node.prueba === 'CIENCIAS') ||
        (test.code === 'HISTORIA' && node.prueba === 'HISTORIA')
      );

      // Optimized orbital positioning
      const angle = (testIndex / tests.length) * Math.PI * 2;
      const radius = 15;
      const centerX = Math.cos(angle) * radius;
      const centerZ = Math.sin(angle) * radius;

      const nodesWithPositions = testNodes.map((node, nodeIndex) => {
        const spiralAngle = (nodeIndex / testNodes.length) * Math.PI * 4;
        const spiralRadius = 2 + (nodeIndex / testNodes.length) * 3;
        
        return {
          ...node,
          position: [
            centerX + Math.cos(spiralAngle) * spiralRadius,
            Math.sin(nodeIndex * 0.5) * 2,
            centerZ + Math.sin(spiralAngle) * spiralRadius
          ] as Position3D,
          progress: nodeProgress[node.id]?.progress || 0,
          status: nodeProgress[node.id]?.status || 'not_started'
        };
      });

      return {
        test,
        position: [centerX, 0, centerZ] as Position3D,
        nodes: nodesWithPositions,
        color: getTestColor(test.code),
        completionRate: nodesWithPositions.length > 0 
          ? nodesWithPositions.filter(n => n.status === 'completed').length / nodesWithPositions.length 
          : 0
      };
    });

    return { 
      constellations, 
      totalNodes: nodes.length,
      completedNodes: Object.values(nodeProgress).filter(p => p.status === 'completed').length
    };
  }, [tests, nodes, nodeProgress]);

  const getTestColor = useCallback((testCode: string): string => {
    const colors = {
      'COMPETENCIA_LECTORA': '#3B82F6',
      'MATEMATICA_1': '#10B981',
      'MATEMATICA_2': '#8B5CF6',
      'CIENCIAS': '#F59E0B',
      'HISTORIA': '#EF4444'
    };
    return colors[testCode as keyof typeof colors] || '#6B7280';
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    setViewMode({ mode: 'node', focus: nodeId });
  }, []);

  const handleConstellationFocus = useCallback((testCode: TPAESPrueba) => {
    setViewMode({ mode: 'constellation', focus: testCode });
  }, []);

  const resetView = useCallback(() => {
    setViewMode({ mode: 'galaxy' });
    setSelectedNode(null);
  }, []);

  const overallProgress = universeLayout.totalNodes > 0 
    ? (universeLayout.completedNodes / universeLayout.totalNodes) * 100 
    : 0;

  if (loading && (!startTime || Date.now() - startTime < 5000)) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-medium">Cargando Universo PAES...</div>
          <div className="text-blue-300 mt-2">Inicializando {universeLayout.totalNodes} nodos de aprendizaje</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Sidebar Izquierdo - Planes Ã“ptimos */}
      <OptimalPathSidebar
        constellations={universeLayout.constellations}
        selectedNode={selectedNode}
        viewMode={viewMode}
        onNodeClick={handleNodeClick}
        onConstellationFocus={handleConstellationFocus}
        onViewModeChange={setViewMode}
      />

      {/* Canvas 3D Principal */}
      <div className="flex-1 relative overflow-hidden">
        {/* Header con MÃ©tricas */}
        <motion.div 
          className="absolute top-4 left-4 right-4 z-10 pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs opacity-80">Progreso Global</div>
                      <div className="text-lg font-bold">{Math.round(overallProgress)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-xs opacity-80">Nodos Completados</div>
                      <div className="text-lg font-bold">{universeLayout.completedNodes}/{universeLayout.totalNodes}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {universeLayout.constellations.map((constellation) => (
                    <Badge
                      key={constellation.test.id}
                      variant="outline"
                      className="text-white border-white/30 text-xs"
                      className="dynamic-border" data-style="{"--dynamic-border": constellation.color }"
                    >
                      {constellation.test.code}: {Math.round(constellation.completionRate * 100)}%
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Canvas
          camera={{ position: [0, 10, 30], fov: 60 }}
          className="absolute inset-0"
        >
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />

          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={100}
            autoRotate={viewMode.mode === 'galaxy'}
            autoRotateSpeed={0.5}
          />

          {universeLayout.constellations.map((constellation, index) => (
            <InteractiveNodeGroup
              key={constellation.test.id}
              constellation={constellation}
              viewMode={viewMode}
              onNodeClick={handleNodeClick}
              onConstellationClick={() => handleConstellationFocus(constellation.test.code as TPAESPrueba)}
              selectedNode={selectedNode}
            />
          ))}

          {showPathways && (
            <LearningPathway
              constellations={universeLayout.constellations}
              viewMode={viewMode}
            />
          )}

          {viewMode.mode === 'galaxy' && (
            <Text
              position={[0, 8, 0]}
              fontSize={2}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto-bold.woff"
            >
              UNIVERSO PAES
            </Text>
          )}
        </Canvas>

        {/* Controles Laterales Compactos */}
        <UniverseControls
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showPathways={showPathways}
          onShowPathwaysChange={setShowPathways}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetView}
        />

        {/* Panel de Nodo Seleccionado */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              className="absolute bottom-4 left-4 right-4 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="bg-black/40 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  {(() => {
                    const node = nodes.find(n => n.id === selectedNode);
                    if (!node) return null;
                    
                    const progress = nodeProgress[selectedNode];
                    
                    return (
                      <div className="text-white">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                            <p className="text-white/80 mb-3">{node.description}</p>
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className="text-white border-white/30">
                                {node.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30">
                                {node.cognitive_level}
                              </Badge>
                              <Badge variant="outline" className="text-white border-white/30">
                                {node.estimatedTimeMinutes}min
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-400 mb-1">
                              {progress?.progress || 0}%
                            </div>
                            <div className="text-sm opacity-80">Progreso</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {/* Navegar al nodo */}}
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            Estudiar Nodo
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={() => {/* Ver ejercicios */}}
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Ver Ejercicios
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-white hover:bg-white/10"
                            onClick={() => setSelectedNode(null)}
                          >
                            âœ•
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

PAESLearningUniverse.displayName = 'PAESLearningUniverse';



