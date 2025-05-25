
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Sphere, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Badge } from '@/components/ui/badge';
import { TLearningNode, TPAESTest } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';

interface GalacticSubjectMapProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  tests: TPAESTest[];
  onNodeSelect: (nodeId: string) => void;
}

// Componente para una constelación de materia
const SubjectConstellation = ({ 
  subject, 
  position, 
  nodes, 
  nodeProgress, 
  color 
}: {
  subject: TPAESTest;
  position: [number, number, number];
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  color: string;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const subjectNodes = nodes.filter(node => 
    node.prueba === subject.code ||
    (subject.code === 'COMPETENCIA_LECTORA' && node.prueba === 'COMPETENCIA_LECTORA') ||
    (subject.code === 'MATEMATICA_1' && node.prueba === 'MATEMATICA_1') ||
    (subject.code === 'MATEMATICA_2' && node.prueba === 'MATEMATICA_2') ||
    (subject.code === 'CIENCIAS' && node.prueba === 'CIENCIAS') ||
    (subject.code === 'HISTORIA' && node.prueba === 'HISTORIA')
  );

  const completionRate = subjectNodes.length > 0 
    ? subjectNodes.filter(node => nodeProgress[node.id]?.status === 'completed').length / subjectNodes.length 
    : 0;

  return (
    <group ref={groupRef} position={position}>
      {/* Esfera central de la materia */}
      <Sphere args={[1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Anillo de progreso */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2, 0.1, 16, 100, completionRate * Math.PI * 2]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>

      {/* Nodos orbitales */}
      {subjectNodes.slice(0, 12).map((node, index) => {
        const angle = (index / subjectNodes.length) * Math.PI * 2;
        const radius = 3 + Math.sin(index * 0.5) * 0.5;
        const nodePosition: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(index * 0.3) * 0.5,
          Math.sin(angle) * radius
        ];

        const progress = nodeProgress[node.id];
        const nodeColor = progress?.status === 'completed' ? '#00ff00' : 
                         progress?.status === 'in_progress' ? '#ffff00' : '#ffffff';

        return (
          <group key={node.id} position={nodePosition}>
            <Sphere args={[0.2]}>
              <meshStandardMaterial 
                color={nodeColor} 
                emissive={nodeColor} 
                emissiveIntensity={0.3}
              />
            </Sphere>
          </group>
        );
      })}

      {/* Etiqueta de la materia */}
      <Html position={[0, -3, 0]} center>
        <motion.div
          className="bg-black/70 backdrop-blur-sm rounded-xl p-3 text-white text-center"
          whileHover={{ scale: 1.1 }}
        >
          <div className="font-bold text-lg">{subject.name}</div>
          <div className="text-sm opacity-80">{subjectNodes.length} nodos</div>
          <Badge 
            className="mt-2"
            style={{ backgroundColor: color }}
          >
            {Math.round(completionRate * 100)}%
          </Badge>
        </motion.div>
      </Html>
    </group>
  );
};

export const GalacticSubjectMap: React.FC<GalacticSubjectMapProps> = ({
  nodes,
  nodeProgress,
  tests,
  onNodeSelect
}) => {
  const subjectColors = {
    'COMPETENCIA_LECTORA': '#3B82F6',
    'MATEMATICA_1': '#10B981',
    'MATEMATICA_2': '#8B5CF6',
    'CIENCIAS': '#F59E0B',
    'HISTORIA': '#EF4444'
  };

  const galaxyLayout = useMemo(() => {
    return tests.map((test, index) => {
      const angle = (index / tests.length) * Math.PI * 2;
      const radius = 8;
      return {
        test,
        position: [
          Math.cos(angle) * radius,
          Math.sin(index * 0.5) * 2,
          Math.sin(angle) * radius
        ] as [number, number, number],
        color: subjectColors[test.code as keyof typeof subjectColors] || '#6B7280'
      };
    });
  }, [tests]);

  return (
    <Canvas
      camera={{ position: [0, 5, 15], fov: 75 }}
      className="w-full h-full"
    >
      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />

      {/* Estrellas de fondo */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Controles de órbita */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />

      {/* Título central */}
      <Text
        position={[0, 12, 0]}
        fontSize={3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-bold.woff"
      >
        PAES GALAXY
      </Text>

      {/* Constelaciones de materias */}
      {galaxyLayout.map(({ test, position, color }) => (
        <SubjectConstellation
          key={test.id}
          subject={test}
          position={position}
          nodes={nodes}
          nodeProgress={nodeProgress}
          color={color}
        />
      ))}

      {/* Conexiones entre constelaciones */}
      {galaxyLayout.map((item1, i) => 
        galaxyLayout.slice(i + 1).map((item2, j) => {
          const start = new THREE.Vector3(...item1.position);
          const end = new THREE.Vector3(...item2.position);
          const distance = start.distanceTo(end);
          
          return (
            <mesh key={`${i}-${j}`} position={start.clone().lerp(end, 0.5).toArray()}>
              <cylinderGeometry args={[0.02, 0.02, distance]} />
              <meshStandardMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.1}
                emissive="#ffffff"
                emissiveIntensity={0.05}
              />
            </mesh>
          );
        })
      )}
    </Canvas>
  );
};
