
import React, { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html, Stars, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Target, 
  Brain, 
  Zap, 
  Trophy, 
  Filter,
  RotateCcw,
  Maximize2,
  Eye
} from 'lucide-react';
import { usePAESData } from '@/hooks/use-paes-data';
import { useLearningNodes } from '@/hooks/use-learning-nodes';
import { useAuth } from '@/contexts/AuthContext';
import { InteractiveNodeGroup } from './InteractiveNodeGroup';
import { UniverseControls } from './UniverseControls';
import { LearningPathway } from './LearningPathway';
import { TPAESPrueba } from '@/types/system-types';

interface ViewMode {
  mode: 'galaxy' | 'constellation' | 'node' | 'pathway';
  focus?: TPAESPrueba | string;
}

export const PAESLearningUniverse: React.FC = () => {
  const { user } = useAuth();
  const { tests, skills, loading } = usePAESData();
  const { nodes, nodeProgress, fetchLearningNodes } = useLearningNodes();
  
  const [viewMode, setViewMode] = useState<ViewMode>({ mode: 'galaxy' });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showPathways, setShowPathways] = useState(false);
  const [filters, setFilters] = useState({
    tier: 'all',
    difficulty: 'all',
    status: 'all'
  });

  // Calcular distribución de nodos en el universo 3D
  const universeLayout = useMemo(() => {
    if (!tests.length || !nodes.length) return { constellations: [], totalNodes: 0 };

    const constellations = tests.map((test, testIndex) => {
      const testNodes = nodes.filter(node => 
        node.testId === test.id ||
        (test.code === 'COMPETENCIA_LECTORA' && node.prueba === 'COMPETENCIA_LECTORA') ||
        (test.code === 'MATEMATICA_1' && node.prueba === 'MATEMATICA_1') ||
        (test.code === 'MATEMATICA_2' && node.prueba === 'MATEMATICA_2') ||
        (test.code === 'CIENCIAS' && node.prueba === 'CIENCIAS') ||
        (test.code === 'HISTORIA' && node.prueba === 'HISTORIA')
      );

      // Posición orbital de la constelación
      const angle = (testIndex / tests.length) * Math.PI * 2;
      const radius = 15;
      const centerX = Math.cos(angle) * radius;
      const centerZ = Math.sin(angle) * radius;

      // Distribuir nodos en espiral dentro de la constelación
      const nodesWithPositions = testNodes.map((node, nodeIndex) => {
        const spiralAngle = (nodeIndex / testNodes.length) * Math.PI * 4;
        const spiralRadius = 2 + (nodeIndex / testNodes.length) * 3;
        
        return {
          ...node,
          position: [
            centerX + Math.cos(spiralAngle) * spiralRadius,
            Math.sin(nodeIndex * 0.5) * 2,
            centerZ + Math.sin(spiralAngle) * spiralRadius
          ] as [number, number, number],
          progress: nodeProgress[node.id]?.progress || 0,
          status: nodeProgress[node.id]?.status || 'not_started'
        };
      });

      return {
        test,
        position: [centerX, 0, centerZ] as [number, number, number],
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

  const getTestColor = (testCode: string): string => {
    const colors = {
      'COMPETENCIA_LECTORA': '#3B82F6',
      'MATEMATICA_1': '#10B981',
      'MATEMATICA_2': '#8B5CF6',
      'CIENCIAS': '#F59E0B',
      'HISTORIA': '#EF4444'
    };
    return colors[testCode as keyof typeof colors] || '#6B7280';
  };

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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-medium">Cargando Universo PAES...</div>
          <div className="text-blue-300 mt-2">Inicializando {universeLayout.totalNodes} nodos de aprendizaje</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Canvas 3D Principal */}
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

        {/* Renderizar Constelaciones */}
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

        {/* Pathways de Aprendizaje */}
        {showPathways && (
          <LearningPathway
            constellations={universeLayout.constellations}
            viewMode={viewMode}
          />
        )}

        {/* Texto Central del Universo */}
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

      {/* HUD - Head Up Display */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Panel Superior - Métricas */}
        <motion.div 
          className="absolute top-4 left-4 right-4 pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-black/40 backdrop-blur-lg border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm opacity-80">Progreso Global</div>
                      <div className="text-xl font-bold">{Math.round(overallProgress)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-sm opacity-80">Nodos Completados</div>
                      <div className="text-xl font-bold">{universeLayout.completedNodes}/{universeLayout.totalNodes}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-sm opacity-80">Modo Vista</div>
                      <div className="text-lg font-semibold capitalize">{viewMode.mode}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {universeLayout.constellations.map((constellation) => (
                    <Badge
                      key={constellation.test.id}
                      variant="outline"
                      className="text-white border-white/30"
                      style={{ borderColor: constellation.color }}
                    >
                      {constellation.test.code}: {Math.round(constellation.completionRate * 100)}%
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controles Laterales */}
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
                            ✕
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
};
