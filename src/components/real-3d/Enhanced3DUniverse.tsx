
import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { SafeThreeCanvas } from '@/core/3d/SafeThreeCanvas';
import * as THREE from 'three';

interface Enhanced3DNeuralNodeProps {
  node: {
    id: string;
    code: string;
    masteryLevel: number;
    isActive: boolean;
    position3D: [number, number, number];
    tierPriority: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const Enhanced3DNeuralNode: React.FC<Enhanced3DNeuralNodeProps> = ({ node, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier1_critico': return '#FF4444';
      case 'tier2_importante': return '#4ECDC4';
      case 'tier3_complementario': return '#FFD700';
      default: return '#FFFFFF';
    }
  };

  const nodeSize = 0.3 + node.masteryLevel * 0.4;
  const nodeColor = getTierColor(node.tierPriority);
  const emissiveIntensity = isSelected ? 0.8 : (node.isActive ? 0.4 : 0.1);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.y = time * 0.5;
      
      if (node.isActive) {
        const pulse = 1 + Math.sin(time * 3) * 0.1;
        meshRef.current.scale.setScalar(pulse);
      }
    }
  });

  return (
    <group position={node.position3D}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
          e.object.scale.setScalar(1.2);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
          e.object.scale.setScalar(1);
        }}
      >
        <sphereGeometry args={[nodeSize, 16, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          transparent
          opacity={0.8}
          emissive={nodeColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      <Html
        position={[0, nodeSize + 0.5, 0]}
        center
        distanceFactor={6}
        occlude
      >
        <div className={`bg-black/80 backdrop-blur-lg rounded-lg p-2 text-white text-center border min-w-24 ${
          isSelected ? 'border-cyan-400' : 'border-gray-600'
        }`}>
          <div className="text-xs font-bold" style={{ color: nodeColor }}>
            {node.code}
          </div>
          <div className="text-xs text-white/80">
            {Math.round(node.masteryLevel * 100)}%
          </div>
          {isSelected && (
            <div className="text-xs text-cyan-400 animate-pulse">
              ● Seleccionado
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

const SafeNeuralConnections: React.FC<{ nodes: any[] }> = ({ nodes }) => {
  const connectionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Crear conexiones entre nodos cercanos
    nodes.forEach((node, index) => {
      const nextNode = nodes[index + 1];
      if (nextNode) {
        const distance = new THREE.Vector3(...node.position3D)
          .distanceTo(new THREE.Vector3(...nextNode.position3D));
        
        // Solo conectar nodos que están relativamente cerca
        if (distance < 8) {
          lines.push([
            new THREE.Vector3(...node.position3D),
            new THREE.Vector3(...nextNode.position3D)
          ]);
        }
      }
    });
    
    return lines;
  }, [nodes]);

  return (
    <>
      {connectionLines.map((line, index) => (
        <Line
          key={`connection-${index}`}
          points={line}
          color="#4ECDC4"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </>
  );
};

interface Enhanced3DUniverseProps {
  onNodeClick?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const Enhanced3DUniverse: React.FC<Enhanced3DUniverseProps> = ({
  onNodeClick,
  selectedNodeId
}) => {
  const { realNodes, neuralMetrics, isLoading } = useRealNeuralData();

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold">Inicializando Universo Neural 3D...</div>
          <div className="text-cyan-300">Conectando {realNodes.length} nodos</div>
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
      <SafeThreeCanvas
        componentId="enhanced-3d-universe"
        camera={{ position: [0, 5, 15], fov: 60 }}
        className="w-full h-full bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900"
      >
        <Environment preset="night" />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ECDC4" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#FF4444" />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minDistance={8}
          maxDistance={30}
        />

        {realNodes.map((node) => (
          <Enhanced3DNeuralNode
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onNodeClick?.(node.id)}
          />
        ))}

        <SafeNeuralConnections nodes={realNodes} />
      </SafeThreeCanvas>

      {/* Panel de métricas 3D */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
        <div className="text-lg font-bold text-cyan-400 mb-3">Neural 3D Universe</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Nodos:</span>
            <span className="text-cyan-400">{realNodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Coherencia:</span>
            <span className="text-green-400">{neuralMetrics.neuralCoherence}%</span>
          </div>
          <div className="flex justify-between">
            <span>Velocidad:</span>
            <span className="text-purple-400">{neuralMetrics.learningVelocity}%</span>
          </div>
        </div>
      </div>

      {/* Información del nodo seleccionado */}
      {selectedNodeId && (
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
          <div className="text-cyan-400 font-bold mb-2">Nodo Seleccionado</div>
          <div className="text-sm">
            {realNodes.find(n => n.id === selectedNodeId)?.code || 'N/A'}
          </div>
        </div>
      )}
    </motion.div>
  );
};
