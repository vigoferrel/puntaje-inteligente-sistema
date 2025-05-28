
import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import * as THREE from 'three';

interface Real3DNodeProps {
  node: any;
  onClick: (nodeId: string) => void;
}

const Real3DNode: React.FC<Real3DNodeProps> = ({ node, onClick }) => {
  const color = useMemo(() => {
    if (node.masteryLevel > 0.8) return '#00FF00'; // Verde - Dominado
    if (node.masteryLevel > 0.5) return '#FFFF00'; // Amarillo - En progreso
    if (node.masteryLevel > 0.2) return '#FF8800'; // Naranja - Iniciado
    return '#FF0000'; // Rojo - Sin iniciar
  }, [node.masteryLevel]);

  const size = useMemo(() => {
    const baseSize = node.tierPriority === 'tier1_critico' ? 0.3 : 
                     node.tierPriority === 'tier2_importante' ? 0.2 : 0.15;
    return baseSize * (1 + node.masteryLevel);
  }, [node.tierPriority, node.masteryLevel]);

  return (
    <group position={node.position3D}>
      <mesh
        onClick={() => onClick(node.id)}
        onPointerOver={(e) => {
          document.body.style.cursor = 'pointer';
          e.object.scale.setScalar(1.2);
        }}
        onPointerOut={(e) => {
          document.body.style.cursor = 'default';
          e.object.scale.setScalar(1);
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          opacity={0.8 + node.masteryLevel * 0.2}
          transparent
          emissive={color}
          emissiveIntensity={node.isActive ? 0.2 : 0}
        />
      </mesh>
      
      <Html>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none">
          <div className="font-bold">{node.code}</div>
          <div>{Math.round(node.masteryLevel * 100)}%</div>
        </div>
      </Html>
    </group>
  );
};

const NeuralConnections: React.FC<{ nodes: any[] }> = ({ nodes }) => {
  const connectionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    nodes.forEach((node, index) => {
      // Conectar nodos del mismo test
      const relatedNodes = nodes.filter(n => 
        n.testId === node.testId && n.id !== node.id
      );
      
      relatedNodes.slice(0, 2).forEach(related => {
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
          <lineBasicMaterial color="#00FFFF" opacity={0.3} transparent />
        </line>
      ))}
    </>
  );
};

interface Real3DEducationalUniverseProps {
  onNodeClick: (nodeId: string) => void;
}

export const Real3DEducationalUniverse: React.FC<Real3DEducationalUniverseProps> = ({
  onNodeClick
}) => {
  const { realNodes, neuralMetrics, isLoading } = useRealNeuralData();

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <div>Cargando Universo Neural...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-96 relative overflow-hidden rounded-lg"
    >
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        className="bg-gradient-to-br from-blue-900 via-purple-900 to-black"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF00FF" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={1}
            minDistance={5}
            maxDistance={20}
          />

          {realNodes.map((node) => (
            <Real3DNode
              key={node.id}
              node={node}
              onClick={onNodeClick}
            />
          ))}

          <NeuralConnections nodes={realNodes} />
        </Suspense>
      </Canvas>

      {/* Métricas neurales en overlay */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-medium mb-2">Métricas Neurales</div>
        <div className="space-y-1 text-xs">
          <div>Coherencia: {neuralMetrics.neuralCoherence}%</div>
          <div>Velocidad: {neuralMetrics.learningVelocity}%</div>
          <div>Engagement: {neuralMetrics.engagementScore}%</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-xs">Nodos Activos</div>
        <div className="text-lg font-bold">
          {realNodes.filter(n => n.isActive).length}/{realNodes.length}
        </div>
      </div>
    </motion.div>
  );
};
