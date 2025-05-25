
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface Galaxy {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  nodes: number;
  completed: number;
  description: string;
}

interface SubjectGalaxyProps {
  galaxy: Galaxy;
  isSelected: boolean;
  isVisible: boolean;
  onClick: () => void;
  scale: number;
}

export const SubjectGalaxy: React.FC<SubjectGalaxyProps> = ({
  galaxy,
  isSelected,
  isVisible,
  onClick,
  scale
}) => {
  const galaxyRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.005;
    }
    
    if (coreRef.current) {
      const intensity = isSelected ? 1.5 : 1;
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1 * intensity);
    }
  });

  const completionRate = (galaxy.completed / galaxy.nodes) * 100;

  if (!isVisible) return null;

  return (
    <group 
      ref={galaxyRef}
      position={galaxy.position} 
      scale={scale}
      onClick={onClick}
    >
      {/* Núcleo de la Galaxia */}
      <Sphere ref={coreRef} args={[1, 16, 16]}>
        <meshStandardMaterial 
          color={galaxy.color}
          emissive={galaxy.color}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
        />
      </Sphere>

      {/* Anillos Orbitales */}
      <Ring args={[1.5, 1.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color={galaxy.color}
          transparent
          opacity={0.4}
        />
      </Ring>
      
      <Ring args={[2.2, 2.5, 32]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial 
          color={galaxy.color}
          transparent
          opacity={0.2}
        />
      </Ring>

      {/* Nodos de Conocimiento */}
      {Array.from({ length: Math.min(12, galaxy.nodes) }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.8;
        const height = Math.sin(i * 0.5) * 0.8;
        const isCompleted = i < (galaxy.completed / galaxy.nodes) * 12;
        
        return (
          <Sphere 
            key={i}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius
            ]}
            args={[0.08, 6, 6]}
          >
            <meshStandardMaterial 
              color={isCompleted ? "#00FF00" : "#666666"}
              emissive={isCompleted ? "#002200" : "#000000"}
            />
          </Sphere>
        );
      })}

      {/* Información de la Galaxia */}
      <Html
        position={[0, 2, 0]}
        center
        distanceFactor={15}
        occlude
      >
        <motion.div 
          className="bg-black/60 backdrop-blur-lg rounded-lg p-4 text-white text-center border border-white/20 min-w-48"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          style={{ borderColor: galaxy.color }}
        >
          <div className="text-lg font-bold mb-2" style={{ color: galaxy.color }}>
            {galaxy.name}
          </div>
          <div className="text-sm text-gray-300 mb-3">
            {galaxy.description}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Progreso:</span>
              <span className="font-bold">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="h-2 rounded-full"
                style={{ backgroundColor: galaxy.color }}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span>Nodos:</span>
              <span>{galaxy.completed}/{galaxy.nodes}</span>
            </div>
          </div>
          {isSelected && (
            <motion.div
              className="mt-3 text-xs text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ● Galaxia Seleccionada
            </motion.div>
          )}
        </motion.div>
      </Html>
    </group>
  );
};
