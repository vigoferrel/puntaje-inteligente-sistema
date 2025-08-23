/* eslint-disable react-refresh/only-export-components */

import React, { Suspense, useMemo, useRef } from 'react';
import '../../styles/CinematicAnimations.css'; // Corregido
import '../../styles/Enhanced3DUniverse.css'; // Corregido
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Environment, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealNeuralData } from '../../hooks/useRealNeuralData';
import { SafeThreeCanvas } from '../../core/3d/SafeThreeCanvas';
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
          e.stopPropagation();
          e.object.scale.setScalar(1.2);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
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
        <div className={`node-info-container ${isSelected ? 'node-selected' : ''}`}>
          <div className={`node-info-title dynamic-node-color node-${node.tierPriority}`}>
            {node.code}
          </div>
          <div className="node-info-progress">
            {Math.round(node.masteryLevel * 100)}%
          </div>
          {isSelected && (
            <div className="node-info-selected">
              ● Seleccionado
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

interface NodeType {
  id: string;
  position3D: [number, number, number];
}

const SafeNeuralConnections: React.FC<{ nodes: NodeType[] }> = ({ nodes }) => {
  const connectionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Crear conexiones entre nodos cercanos
    nodes.forEach((node, index) => {
      const nextNode = nodes[index + 1];
      if (nextNode && node.position3D && nextNode.position3D) {
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
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-title">Inicializando Universo Neural 3D...</div>
          <div className="loading-subtitle">Conectando {realNodes.length} nodos</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="universe-3d-container"
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
      <div className="metrics-panel">
        <div className="metrics-title">Neural 3D Universe</div>
        <div className="space-y-2 text-sm">
          <div className="metrics-item">
            <span>Nodos:</span>
            <span className="metrics-value-cyan">{realNodes.length}</span>
          </div>
          <div className="metrics-item">
            <span>Coherencia:</span>
            <span className="metrics-value-green">{neuralMetrics.neuralCoherence}%</span>
          </div>
          <div className="metrics-item">
            <span>Velocidad:</span>
            <span className="metrics-value-purple">{neuralMetrics.learningVelocity}%</span>
          </div>
        </div>
      </div>

      {/* Información del nodo seleccionado */}
      {selectedNodeId && (
        <div className="selected-node-panel">
          <div className="selected-node-title">Nodo Seleccionado</div>
          <div className="selected-node-info">
            {realNodes.find(n => n.id === selectedNodeId)?.code || 'N/A'}
          </div>
        </div>
      )}
    </motion.div>
  );
};
