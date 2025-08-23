import React, { Suspense, useMemo, useState } from 'react';
import { OrbitControls, Html, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRealNeuralData } from '@/hooks/useRealNeuralData';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { SafeThreeCanvas } from '@/core/3d/SafeThreeCanvas';
import { Critical3DErrorBoundary } from '@/core/error-handling/Critical3DErrorBoundary';
import * as THREE from 'three';

interface RealGalaxyProps {
  galaxy: {
    id: string;
    name: string;
    color: string;
    position: [number, number, number];
    nodes: number;
    completed: number;
    testCode: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const RealGalaxy: React.FC<RealGalaxyProps> = ({ galaxy, isSelected, onClick }) => {
  const completionRatio = galaxy.nodes > 0 ? galaxy.completed / galaxy.nodes : 0;
  const size = 1 + completionRatio * 0.8;
  const intensity = isSelected ? 0.8 : (completionRatio * 0.6 + 0.2);

  return (
    <group position={galaxy.position}>
      <mesh
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
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={galaxy.color}
          transparent
          opacity={0.8}
          emissive={galaxy.color}
          emissiveIntensity={intensity}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Anillo orbital */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.3, size * 1.5, 32]} />
        <meshBasicMaterial 
          color={galaxy.color} 
          transparent 
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <Html
        position={[0, size + 0.8, 0]}
        center
        distanceFactor={8}
        occlude
      >
        <motion.div 
          className="bg-black/90 backdrop-blur-xl rounded-lg p-3 text-white text-center border min-w-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          style={{ borderColor: isSelected ? '#00FFFF' : galaxy.color }}
        >
          <div className="text-sm font-bold" style={{ color: galaxy.color }}>
            {galaxy.name}
          </div>
          <div className="text-xs text-white/80">
            {galaxy.completed}/{galaxy.nodes} nodos
          </div>
          <div className="text-xs mt-1">
            <span style={{ color: galaxy.color }}>
              {Math.round(completionRatio * 100)}%
            </span>
          </div>
          {isSelected && (
            <div className="text-xs text-cyan-400 mt-1 animate-pulse">
              ● Activa
            </div>
          )}
        </motion.div>
      </Html>
    </group>
  );
};

const InterGalacticConnections: React.FC<{ galaxies: any[] }> = ({ galaxies }) => {
  const connectionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    galaxies.forEach((galaxy, index) => {
      const nextGalaxy = galaxies[index + 1];
      if (nextGalaxy) {
        lines.push([
          new THREE.Vector3(...galaxy.position),
          new THREE.Vector3(...nextGalaxy.position)
        ]);
      }
    });
    
    return lines;
  }, [galaxies]);

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
          <lineBasicMaterial color="#4ECDC4" opacity={0.3} transparent />
        </line>
      ))}
    </>
  );
};

const Educational2DFallback = ({ galaxies, onGalaxyClick }: { galaxies: any[], onGalaxyClick?: (code: string) => void }) => (
  <div className="w-full h-[600px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-6 flex flex-wrap gap-4 items-center justify-center overflow-auto">
    {galaxies.map((galaxy, index) => (
      <motion.div
        key={galaxy.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20 cursor-pointer hover:bg-black/60 transition-all"
        onClick={() => onGalaxyClick?.(galaxy.testCode)}
        style={{ borderColor: galaxy.color }}
      >
        <div className="text-center">
          <div className="text-lg font-bold mb-2" style={{ color: galaxy.color }}>
            {galaxy.name}
          </div>
          <div className="text-sm text-white/80 mb-2">
            {galaxy.completed}/{galaxy.nodes} nodos
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all"
              style={{ 
                backgroundColor: galaxy.color,
                width: `${(galaxy.completed / galaxy.nodes) * 100}%`
              }}
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

interface RealEducationalUniverseProps {
  onGalaxyClick?: (testCode: string) => void;
  selectedGalaxy?: string | null;
}

export const RealEducationalUniverse: React.FC<RealEducationalUniverseProps> = ({
  onGalaxyClick,
  selectedGalaxy
}) => {
  const { realNodes, neuralMetrics, isLoading } = useRealNeuralData();
  const { metrics } = useRealDashboardData();
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 5, 12]);

  // Generar galaxias basadas en datos reales
  const galaxies = useMemo(() => {
    const testMap = new Map();
    
    realNodes.forEach(node => {
      const testKey = `test_${node.testId}`;
      if (!testMap.has(testKey)) {
        testMap.set(testKey, {
          id: testKey,
          testId: node.testId,
          nodes: [],
          completed: 0
        });
      }
      
      const test = testMap.get(testKey);
      test.nodes.push(node);
      if (node.masteryLevel > 0.7) {
        test.completed++;
      }
    });

    const testNames = {
      'test_1': 'Competencia Lectora',
      'test_2': 'Matemática M1', 
      'test_3': 'Matemática M2',
      'test_4': 'Historia',
      'test_5': 'Ciencias'
    };

    const colors = {
      'test_1': '#FF6B6B',
      'test_2': '#4ECDC4',
      'test_3': '#45B7D1', 
      'test_4': '#96CEB4',
      'test_5': '#FFEAA7'
    };

    return Array.from(testMap.entries()).map(([testKey, data], index) => {
      const angle = (index / testMap.size) * Math.PI * 2;
      const radius = 6;
      
      return {
        id: testKey,
        name: testNames[testKey] || `Test ${data.testId}`,
        color: colors[testKey] || '#ffffff',
        position: [
          Math.cos(angle) * radius,
          Math.sin(index * 0.5) * 2,
          Math.sin(angle) * radius
        ] as [number, number, number],
        nodes: data.nodes.length,
        completed: data.completed,
        testCode: testKey
      };
    });
  }, [realNodes]);

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl font-bold">Inicializando Universo Educativo...</div>
          <div className="text-cyan-300">Conectando galaxias PAES reales</div>
        </div>
      </div>
    );
  }

  return (
    <Critical3DErrorBoundary 
      componentName="RealEducationalUniverse"
      fallback2D={<Educational2DFallback galaxies={galaxies} onGalaxyClick={onGalaxyClick} />}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[600px] relative overflow-hidden rounded-xl border border-purple-500/30"
      >
        <SafeThreeCanvas
          componentId="real-educational-universe"
          camera={{ position: cameraPosition, fov: 70 }}
          className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        >
          <Environment preset="night" />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ECDC4" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#FF6B6B" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.3}
            minDistance={8}
            maxDistance={25}
          />

          {galaxies.map((galaxy) => (
            <RealGalaxy
              key={galaxy.id}
              galaxy={galaxy}
              isSelected={selectedGalaxy === galaxy.testCode}
              onClick={() => onGalaxyClick?.(galaxy.testCode)}
            />
          ))}

          <InterGalacticConnections galaxies={galaxies} />
        </SafeThreeCanvas>

        {/* Panel de métricas universales */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
          <div className="text-lg font-bold text-purple-400 mb-3">Universo PAES</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Galaxias:</span>
              <span className="text-purple-400">{galaxies.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Nodos:</span>
              <span className="text-cyan-400">{realNodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Coherencia:</span>
              <span className="text-green-400">{neuralMetrics.neuralCoherence}%</span>
            </div>
          </div>
        </div>

        {/* Progreso global */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round((metrics.completedNodes / realNodes.length) * 100)}%
            </div>
            <div className="text-xs text-white/70">Progreso Global</div>
            <div className="text-sm text-white/50 mt-1">
              {metrics.completedNodes} / {realNodes.length}
            </div>
          </div>
        </div>

        {/* Controles de vista */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={() => setCameraPosition([0, 8, 15])}
            className="bg-purple-600/80 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs"
          >
            Vista Panorámica
          </button>
          <button
            onClick={() => setCameraPosition([0, 3, 8])}
            className="bg-blue-600/80 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs"
          >
            Vista Inmersiva
          </button>
        </div>
      </motion.div>
    </Critical3DErrorBoundary>
  );
};
