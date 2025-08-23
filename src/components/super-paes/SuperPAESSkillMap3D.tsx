
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface CompetencyNodeProps {
  position: [number, number, number];
  skill: string;
  level: number;
  color: string;
  onClick: () => void;
}

const CompetencyNode: React.FC<CompetencyNodeProps> = ({ 
  position, 
  skill, 
  level, 
  color, 
  onClick 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Ensure we have valid geometry and material
  const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 16, 16), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: color || '#3B82F6',
    opacity: Math.max(0.3, level),
    transparent: true
  }), [color, level]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onClick={onClick}
        onPointerOver={(e) => {
          if (e.object instanceof THREE.Mesh) {
            e.object.scale.setScalar(1.2);
          }
        }}
        onPointerOut={(e) => {
          if (e.object instanceof THREE.Mesh) {
            e.object.scale.setScalar(1);
          }
        }}
      />
      <Html>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
          {skill}: {Math.round(level * 100)}%
        </div>
      </Html>
    </group>
  );
};

const SkillConnections: React.FC<{ skills: any[] }> = ({ skills }) => {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    skills.forEach((skill, index) => {
      if (index < skills.length - 1) {
        pts.push(new THREE.Vector3(...skill.position));
        pts.push(new THREE.Vector3(...skills[index + 1].position));
      }
    });
    return pts;
  }, [skills]);

  if (points.length === 0) return null;

  return (
    <line>
      <bufferGeometry ref={lineRef}>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
    </line>
  );
};

interface SuperPAESSkillMap3DProps {
  skills: Array<{
    name: string;
    level: number;
    color: string;
  }>;
  onSkillClick: (skill: string) => void;
}

const SuperPAESSkillMap3D: React.FC<SuperPAESSkillMap3DProps> = ({ 
  skills = [], 
  onSkillClick 
}) => {
  const skillPositions = useMemo(() => {
    return skills.map((skill, index) => {
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 3 + Math.sin(index * 0.5) * 1;
      return {
        ...skill,
        position: [
          Math.cos(angle) * radius,
          Math.sin(index * 0.3) * 2,
          Math.sin(angle) * radius
        ] as [number, number, number]
      };
    });
  }, [skills]);

  // Safety check for empty skills
  if (!skills || skills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg"
      >
        <div className="text-center text-white">
          <div className="text-xl font-bold mb-2">Mapa de Habilidades 3D</div>
          <div className="text-blue-300">Cargando competencias PAES...</div>
        </div>
      </motion.div>
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
        camera={{ position: [0, 0, 8], fov: 60 }}
        className="bg-gradient-to-br from-blue-900 to-purple-900"
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={2}
            minDistance={4}
            maxDistance={12}
          />

          {skillPositions.map((skill, index) => (
            <CompetencyNode
              key={`${skill.name}-${index}`}
              position={skill.position}
              skill={skill.name}
              level={skill.level}
              color={skill.color}
              onClick={() => onSkillClick(skill.name)}
            />
          ))}

          <SkillConnections skills={skillPositions} />

          <Text
            position={[0, 4, 0]}
            fontSize={0.8}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            MAPA DE COMPETENCIAS PAES
          </Text>
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-medium mb-1">Competencias Activas</div>
        <div className="text-2xl font-bold">{skills.length}</div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-xs">Promedio de Dominio</div>
        <div className="text-lg font-bold">
          {Math.round((skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length) * 100)}%
        </div>
      </div>
    </motion.div>
  );
};

export { SuperPAESSkillMap3D };
