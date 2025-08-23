/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface UniverseNode {
  id: string;
  name: string;
  position: [number, number, number];
  progress: number;
  type: 'critical' | 'important' | 'complementary';
  connections: string[];
  subject: string;
  difficulty: number;
  mastery: number;
}

interface Subject {
  code: string;
  name: string;
  totalNodes: number;
  completedNodes: number;
  progress: number;
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
  priority: 'high' | 'medium' | 'low';
}

interface Recommendation {
  id: string;
  type: 'critical' | 'opportunity' | 'next_step';
  title: string;
  description: string;
  subject: string;
  estimatedTime: number;
  impact: 'high' | 'medium' | 'low';
}

interface TierData {
  tier: string;
  name: string;
  total: number;
  completed: number;
  inProgress: number;
  progress: number;
  estimatedTimeRemaining: number;
}

interface SuperPAESUniverseInterfaceProps {
  subjects: Subject[];
  recommendations: Recommendation[];
  tierData: TierData[];
  globalProgress: number;
  projectedScore: number;
}

// Componente 3D para nodos del universo
const UniverseNode3D: React.FC<{ node: UniverseNode; onClick: (node: UniverseNode) => void }> = ({ node, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const getNodeColor = () => {
    switch (node.type) {
      case 'critical': return '#ef4444';
      case 'important': return '#f59e0b';
      case 'complementary': return '#06b6d4';
      default: return '#8b5cf6';
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={node.position}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <MeshDistortMaterial
          color={getNodeColor()}
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {hovered && (
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.2}
          height={0.02}
          position={[0, 1, 0]}
        >
          {node.name}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>
      )}
    </Float>
  );
};

// Componente principal de la interfaz revolucionaria
export const SuperPAESUniverseInterface: React.FC<SuperPAESUniverseInterfaceProps> = ({
  subjects,
  recommendations,
  tierData,
  globalProgress,
  projectedScore
}) => {
  type UniverseType = 'dashboard' | 'neural' | 'quantum';
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseType>('dashboard');
  const [selectedNode, setSelectedNode] = useState<UniverseNode | null>(null);
  const [isHologramMode, setIsHologramMode] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(75);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  // Generar nodos del universo basados en los datos reales
  const generateUniverseNodes = (): UniverseNode[] => {
    const nodes: UniverseNode[] = [];
    let nodeId = 0;

    subjects.forEach((subject, subjectIndex) => {
      const radius = 5 + subjectIndex * 2;
      const nodeCount = subject.totalNodes;
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4;
        
        nodes.push({
          id: `node-${nodeId++}`,
          name: `${subject.name} - Nodo ${i + 1}`,
          position: [
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          ],
          progress: i < subject.completedNodes ? 100 : Math.random() * 50,
          type: i < subject.completedNodes / 3 ? 'critical' : 
                i < subject.completedNodes * 2 / 3 ? 'important' : 'complementary',
          connections: [],
          subject: subject.code,
          difficulty: Math.random() * 10,
          mastery: i < subject.completedNodes ? Math.random() * 100 : 0
        });
      }
    });

    return nodes;
  };

  const universeNodes = generateUniverseNodes();

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  const universeVariants = {
    dashboard: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      transition: { duration: 2 }
    },
    neural: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a0033 50%, #2d1b69 100%)',
      transition: { duration: 2 }
    },
    quantum: {
      background: 'linear-gradient(135deg, #001122 0%, #003366 50%, #004488 100%)',
      transition: { duration: 2 }
    }
  };

  return (
    <div 
      className="revolutionary-interface min-h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Fondo dinÃ¡mico del universo */}
      <motion.div
        className="absolute inset-0 dynamic-style"
        variants={universeVariants}
        animate={selectedUniverse}
        data-rotate-x={rotateX}
        data-rotate-y={rotateY}
        data-transform-style="preserve-3d"
      />

      {/* PartÃ­culas cuÃ¡nticas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full dynamic-particle"
            data-left={`${Math.random() * 100}%`}
            data-top={`${Math.random() * 100}%`}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Selector de Universos */}
      <motion.div
        className="absolute top-8 left-8 z-50"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-white text-xl font-bold mb-4">ðŸŒŒ Selecciona tu Universo</h2>
          <div className="space-y-3">
            {[
              { id: 'dashboard', name: 'ðŸ“Š Dashboard Universe', desc: 'Centro de control principal' },
              { id: 'neural', name: 'ðŸ§  Neural Hub Universe', desc: 'Inteligencia artificial y analytics' },
              { id: 'quantum', name: 'âš›ï¸ Quantum Learning', desc: 'Aprendizaje cuÃ¡ntico avanzado' }
            ].map((universe) => (
              <motion.button
                key={universe.id}
                onClick={() => setSelectedUniverse(universe.id as UniverseType)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  selectedUniverse === universe.id
                    ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-400/50'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-white font-semibold">{universe.name}</div>
                <div className="text-gray-300 text-sm">{universe.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Panel de mÃ©tricas hologrÃ¡ficas */}
      <motion.div
        className="absolute top-8 right-8 z-50"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-w-[300px]">
          <h3 className="text-white text-lg font-bold mb-4">ðŸŽ¯ MÃ©tricas CuÃ¡nticas</h3>
          
          {/* Progreso Global */}
          <div className="mb-6">
            <div className="flex justify-between text-white mb-2">
              <span>Progreso Global</span>
              <span>{globalProgress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${globalProgress}%` }}
                transition={{ duration: 2, delay: 1 }}
              />
            </div>
          </div>

          {/* Puntaje Proyectado */}
          <div className="mb-6">
            <div className="text-center">
              <div className="text-gray-300 text-sm">Puntaje Proyectado PAES</div>
              <motion.div
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                {projectedScore}
              </motion.div>
            </div>
          </div>

          {/* Actividad Neural */}
          <div className="mb-4">
            <div className="flex justify-between text-white mb-2">
              <span>Actividad Neural</span>
              <span>{neuralActivity}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                animate={{ width: `${neuralActivity}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Universo 3D Principal */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          {/* Renderizar nodos del universo */}
          {universeNodes.slice(0, 50).map((node) => (
            <UniverseNode3D
              key={node.id}
              node={node}
              onClick={setSelectedNode}
            />
          ))}
          
          {/* Esfera central del universo */}
          <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere args={[2, 64, 64]} position={[0, 0, 0]}>
              <MeshDistortMaterial
                color="#8b5cf6"
                distort={0.5}
                speed={3}
                roughness={0}
                metalness={1}
                transparent
                opacity={0.3}
              />
            </Sphere>
          </Float>
          
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
        </Canvas>
      </div>

      {/* Panel de informaciÃ³n del nodo seleccionado */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md">
              <h3 className="text-white text-lg font-bold mb-2">{selectedNode.name}</h3>
              <div className="text-gray-300 mb-4">
                <p>Materia: {selectedNode.subject}</p>
                <p>Progreso: {selectedNode.progress.toFixed(1)}%</p>
                <p>Dificultad: {selectedNode.difficulty.toFixed(1)}/10</p>
                <p>MaestrÃ­a: {selectedNode.mastery.toFixed(1)}%</p>
              </div>
              <div className="flex space-x-3">
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNode(null)}
                >
                  Estudiar Nodo
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-white/10 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedNode(null)}
                >
                  Cerrar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles de modo hologrÃ¡fico */}
      <motion.button
        className="absolute bottom-8 right-8 z-50 bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-4 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsHologramMode(!isHologramMode)}
      >
        {isHologramMode ? 'ðŸŒŒ' : 'ðŸ”®'}
      </motion.button>

      {/* Efectos de partÃ­culas adicionales para modo hologrÃ¡fico */}
      {isHologramMode && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full dynamic-particle"
              data-left={`${Math.random() * 100}%`}
              data-top={`${Math.random() * 100}%`}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Estilos CSS personalizados */}
      <style>
        {`
          .revolutionary-interface {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
          }
          
          .revolutionary-interface::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
              radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};


