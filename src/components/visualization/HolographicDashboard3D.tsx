import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../../hooks/use-auth';
import { supabase } from '../../lib/supabase';
import { 
  Cpu, Zap, Eye, Target, TrendingUp, Brain, 
  Play, Pause, RotateCcw, Maximize, Settings,
  Layers, Grid3X3, Sparkles, Activity
} from 'lucide-react';

interface Node3D {
  id: string;
  name: string;
  subject: string;
  difficulty: string;
  masteryLevel: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  prerequisites: string[];
  accuracy: number;
  speed: number;
  confidence: number;
  studyTimeRecommended: number;
}

interface UniverseNode {
  id: string;
  name: string;
  type: string;
  subject: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  progress: number;
  isUnlocked: boolean;
  connections: string[];
  tierPriority: string;
  visualStyle: any;
}

interface HolographicMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  color: string;
  trend: string;
  trendValue: number;
}

// Componente de nodo 3D interactivo
const Node3DComponent = ({ node, onClick }: { node: Node3D; onClick: (node: Node3D) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const color = node.masteryLevel > 0.8 ? '#10b981' : 
                node.masteryLevel > 0.6 ? '#f59e0b' :
                node.masteryLevel > 0.3 ? '#ef4444' : '#6b7280';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={[node.positionX, node.positionY, node.positionZ]}>
      <Sphere
        ref={meshRef}
        args={[0.5, 16, 16]}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </Sphere>
      
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
      )}
    </group>
  );
};

// Componente de métrica holográfica flotante
const HolographicMetricDisplay = ({ metric, position }: { 
  metric: HolographicMetric; 
  position: [number, number, number] 
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Plane args={[2, 1]} position={[0, 0, 0]}>
        <meshBasicMaterial color={metric.color} transparent opacity={0.2} />
      </Plane>
      
      <Text
        position={[0, 0.2, 0.01]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {metric.title}
      </Text>
      
      <Text
        position={[0, -0.1, 0.01]}
        fontSize={0.3}
        color={metric.color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {metric.value}{metric.unit}
      </Text>
      
      <Text
        position={[0, -0.3, 0.01]}
        fontSize={0.15}
        color={metric.trend === 'up' ? '#10b981' : metric.trend === 'down' ? '#ef4444' : '#6b7280'}
        anchorX="center"
        anchorY="middle"
      >
        {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'} {metric.trendValue}%
      </Text>
    </group>
  );
};

// Componente de partículas ambientales
const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1000;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#4ade80" size={0.05} transparent opacity={0.6} />
    </points>
  );
};

// Componente principal del dashboard 3D
const HolographicDashboard3D = () => {
  const { user } = useAuth();
  const [skillNodes, setSkillNodes] = useState<Node3D[]>([]);
  const [universeNodes, setUniverseNodes] = useState<UniverseNode[]>([]);
  const [holographicMetrics, setHolographicMetrics] = useState<HolographicMetric[]>([]);
  const [hudData, setHudData] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Controles de visualización
  const [viewMode, setViewMode] = useState<'skills' | 'universe' | 'metrics'>('skills');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showParticles, setShowParticles] = useState(true);

  // Cargar datos 3D
  useEffect(() => {
    const loadHolographicData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        // Cargar nodos de habilidades 3D
        const { data: skillData, error: skillError } = await supabase.rpc('get_skill_nodes_3d', {
          p_user_id: user.id
        });
        
        if (skillError) throw skillError;
        setSkillNodes(skillData || []);

        // Cargar nodos del universo 3D
        const { data: universeData, error: universeError } = await supabase.rpc('get_universe_nodes_3d', {
          p_user_id: user.id
        });
        
        if (universeError) throw universeError;
        setUniverseNodes(universeData || []);

        // Cargar métricas holográficas
        const { data: metricsData, error: metricsError } = await supabase.rpc('get_holographic_metrics', {
          p_user_id: user.id
        });
        
        if (metricsError) throw metricsError;
        setHolographicMetrics(metricsData || []);

        // Cargar datos del HUD
        const { data: hudResponse, error: hudError } = await supabase.rpc('get_hud_dashboard', {
          p_user_id: user.id
        });
        
        if (hudError) throw hudError;
        setHudData(hudResponse);

      } catch (err) {
        console.error('Error loading holographic data:', err);
        setError('Error al cargar visualización 3D');
      } finally {
        setIsLoading(false);
      }
    };

    loadHolographicData();
  }, [user?.id]);

  const handleNodeClick = (node: Node3D) => {
    setSelectedNode(node);
  };

  const resetView = () => {
    setSelectedNode(null);
    setViewMode('skills');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="p-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        >
          <Cpu className="h-12 w-12 text-white" />
        </motion.div>
        <div className="ml-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Inicializando Realidad Holográfica...
          </h3>
          <p className="text-blue-300">
            Preparando visualización 3D de tu progreso de aprendizaje
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-xl">
          <h3 className="text-xl font-bold text-red-300 mb-4">
            Error en Sistema Holográfico
          </h3>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reinicializar Sistema
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} color="#4ade80" intensity={0.5} />
        
        {/* Controles de órbita */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={isPlaying}
          autoRotateSpeed={0.5}
        />

        {/* Grid de fondo */}
        {showGrid && (
          <gridHelper args={[20, 20, '#4ade80', '#1a1a2e']} />
        )}

        {/* Campo de partículas */}
        {showParticles && <ParticleField />}

        {/* Renderizar nodos según el modo */}
        {viewMode === 'skills' && skillNodes.map((node) => (
          <Node3DComponent
            key={node.id}
            node={node}
            onClick={handleNodeClick}
          />
        ))}

        {viewMode === 'universe' && universeNodes.map((node, index) => (
          <group key={node.id} position={[node.positionX, node.positionY, node.positionZ]}>
            <Box
              args={[1, 1, 1]}
              onClick={() => console.log('Universe node clicked:', node)}
            >
              <meshStandardMaterial 
                color={node.isUnlocked ? '#10b981' : '#374151'} 
                transparent 
                opacity={node.progress}
              />
            </Box>
          </group>
        ))}

        {/* Métricas holográficas flotantes */}
        {viewMode === 'metrics' && holographicMetrics.map((metric, index) => (
          <HolographicMetricDisplay
            key={metric.id}
            metric={metric}
            position={[
              (index % 3 - 1) * 5,
              Math.floor(index / 3) * 3 - 3,
              0
            ]}
          />
        ))}
      </Canvas>

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header HUD */}
        <div className="absolute top-4 left-4 right-4 pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-cyan-400" />
                  <h1 className="text-xl font-bold text-white">
                    Dashboard Holográfico 3D
                  </h1>
                </div>
                <div className="flex items-center space-x-2 text-sm text-cyan-300">
                  <Activity className="h-4 w-4" />
                  <span>Sistema Neural Activo</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-cyan-600/20 border border-cyan-500/50 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel lateral izquierdo */}
        <div className="absolute left-4 top-24 bottom-4 w-80 pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 h-full">
            {/* Controles de vista */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-cyan-400" />
                Modos de Visualización
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'skills', label: 'Nodos de Habilidades', icon: Brain },
                  { id: 'universe', label: 'Universo de Aprendizaje', icon: Target },
                  { id: 'metrics', label: 'Métricas Holográficas', icon: TrendingUp }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as any)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      viewMode === id
                        ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
                        : 'bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración avanzada */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-cyan-400" />
                Configuración Visual
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Mostrar Grid</span>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Campo de Partículas</span>
                  <input
                    type="checkbox"
                    checked={showParticles}
                    onChange={(e) => setShowParticles(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500"
                  />
                </label>
              </div>
            </div>

            {/* Información del nodo seleccionado */}
            {selectedNode && (
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/50 rounded-lg p-4">
                <h4 className="text-lg font-bold text-white mb-2">{selectedNode.name}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Materia:</span>
                    <span className="text-cyan-300">{selectedNode.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Dominio:</span>
                    <span className="text-green-400">{(selectedNode.masteryLevel * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Precisión:</span>
                    <span className="text-yellow-400">{(selectedNode.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Confianza:</span>
                    <span className="text-purple-400">{(selectedNode.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho con métricas */}
        <div className="absolute right-4 top-24 bottom-4 w-80 pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-cyan-400" />
              Métricas en Tiempo Real
            </h3>
            
            <div className="space-y-4">
              {holographicMetrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{metric.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.trend === 'up' 
                        ? 'bg-green-900/50 text-green-300' 
                        : metric.trend === 'down'
                        ? 'bg-red-900/50 text-red-300'
                        : 'bg-gray-900/50 text-gray-300'
                    }`}>
                      {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: metric.color }}>
                    {metric.value}{metric.unit}
                  </div>
                  {metric.trendValue !== 0 && (
                    <div className={`text-xs mt-1 ${
                      metric.trendValue > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}% vs anterior
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con estadísticas */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-cyan-400 font-bold">{skillNodes.length}</div>
                <div className="text-gray-300">Nodos de Habilidad</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">{universeNodes.length}</div>
                <div className="text-gray-300">Elementos del Universo</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-bold">{holographicMetrics.length}</div>
                <div className="text-gray-300">Métricas Activas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolographicDashboard3D;
