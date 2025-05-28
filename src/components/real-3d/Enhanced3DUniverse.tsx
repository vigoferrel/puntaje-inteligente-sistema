
import React, { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import * as THREE from 'three';

interface Enhanced3DNodeProps {
  node: any;
  onClick: (nodeId: string) => void;
  isSelected: boolean;
}

const Enhanced3DNode: React.FC<Enhanced3DNodeProps> = ({ node, onClick, isSelected }) => {
  const color = useMemo(() => {
    if (node.masteryLevel > 0.8) return '#00FF00'; // Verde brillante - Dominado
    if (node.masteryLevel > 0.5) return '#FFD700'; // Dorado - En progreso avanzado
    if (node.masteryLevel > 0.2) return '#FF8800'; // Naranja - Iniciado
    return '#FF3366'; // Rosa neón - Sin iniciar
  }, [node.masteryLevel]);

  const size = useMemo(() => {
    const baseSize = node.tierPriority === 'tier1_critico' ? 0.4 : 
                     node.tierPriority === 'tier2_importante' ? 0.3 : 0.2;
    return baseSize * (1 + node.masteryLevel * 0.5);
  }, [node.tierPriority, node.masteryLevel]);

  const intensity = isSelected ? 0.8 : (node.isActive ? 0.4 : 0.2);

  return (
    <group position={node.position3D}>
      <mesh
        onClick={() => onClick(node.id)}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
          e.object.scale.setScalar(1.3);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
          e.object.scale.setScalar(1);
        }}
      >
        <icosahedronGeometry args={[size, 2]} />
        <meshStandardMaterial 
          color={color} 
          opacity={0.9}
          transparent
          emissive={color}
          emissiveIntensity={intensity}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Anillo orbital para nodos críticos */}
      {node.tierPriority === 'tier1_critico' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.8, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      <Html
        position={[0, size + 0.3, 0]}
        center
        distanceFactor={8}
        occlude
      >
        <motion.div 
          className="bg-black/90 backdrop-blur-xl rounded-lg p-3 text-white text-center border border-cyan-400/50 min-w-32"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          style={{ borderColor: isSelected ? '#00FFFF' : color }}
        >
          <div className="text-sm font-bold text-cyan-300">{node.code}</div>
          <div className="text-xs text-white/80">{node.title}</div>
          <div className="text-xs mt-1">
            <span style={{ color: color }}>{Math.round(node.masteryLevel * 100)}%</span>
          </div>
          {isSelected && (
            <div className="text-xs text-green-400 mt-1 animate-pulse">
              ● Seleccionado
            </div>
          )}
        </motion.div>
      </Html>
    </group>
  );
};

const NeuralConnections: React.FC<{ nodes: any[] }> = ({ nodes }) => {
  const connectionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    nodes.forEach((node) => {
      // Conectar nodos relacionados por skill_id y test_id
      const relatedNodes = nodes.filter(n => 
        (n.testId === node.testId || Math.abs(n.skill_id - node.skill_id) <= 1) && 
        n.id !== node.id
      );
      
      relatedNodes.slice(0, 3).forEach(related => {
        lines.push([
          new THREE.Vector3(...node.position3D),
          new THREE.Vector3(...related.position3D)
        ]);
      });
    });
    
    return lines;
  }, [nodes]);

  return (
    <>
      {connectionLines.map((line, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line[0].x, line[0].y, line[0].z,
                line[1].x, line[1].y, line[1].z
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00FFFF" opacity={0.4} transparent />
        </line>
      ))}
    </>
  );
};

interface Enhanced3DUniverseProps {
  onNodeClick: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const Enhanced3DUniverse: React.FC<Enhanced3DUniverseProps> = ({
  onNodeClick,
  selectedNodeId
}) => {
  const { realNodes, neuralMetrics, isLoading } = useRealNeuralData();
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 8, 15]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold">Inicializando Universo Neural...</div>
          <div className="text-cyan-300">Conectando con {realNodes.length} nodos reales</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-[600px] relative overflow-hidden rounded-xl border border-cyan-500/30"
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 70 }}
        className="bg-gradient-to-br from-slate-900 via-purple-900 to-black"
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00FFFF" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#FF00FF" />
          <spotLight position={[0, 20, 0]} intensity={1.5} color="#FFD700" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            minDistance={8}
            maxDistance={30}
            maxPolarAngle={Math.PI * 0.8}
          />

          {realNodes.map((node) => (
            <Enhanced3DNode
              key={node.id}
              node={node}
              onClick={onNodeClick}
              isSelected={selectedNodeId === node.id}
            />
          ))}

          <NeuralConnections nodes={realNodes} />
        </Suspense>
      </Canvas>

      {/* Panel de control 3D */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
        <div className="text-lg font-bold text-cyan-400 mb-3">Control Neural</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Coherencia:</span>
            <span className="text-cyan-400">{neuralMetrics.neuralCoherence}%</span>
          </div>
          <div className="flex justify-between">
            <span>Velocidad:</span>
            <span className="text-green-400">{neuralMetrics.learningVelocity}%</span>
          </div>
          <div className="flex justify-between">
            <span>Engagement:</span>
            <span className="text-purple-400">{neuralMetrics.engagementScore}%</span>
          </div>
        </div>
      </div>

      {/* Estadísticas de nodos */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {realNodes.filter(n => n.isActive).length}
          </div>
          <div className="text-xs text-white/70">Nodos Activos</div>
          <div className="text-sm text-white/50 mt-1">
            de {realNodes.length} totales
          </div>
        </div>
      </div>

      {/* Controles de cámara */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setCameraPosition([0, 15, 25])}
          className="bg-cyan-600/80 hover:bg-cyan-500 text-white px-3 py-1 rounded text-xs"
        >
          Vista General
        </button>
        <button
          onClick={() => setCameraPosition([0, 5, 10])}
          className="bg-purple-600/80 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs"
        >
          Vista Cercana
        </button>
      </div>
    </motion.div>
  );
};
