
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Ring } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { Galaxy } from '@/types/universe-types';

interface SubjectGalaxyProps {
  galaxy: Galaxy;
  isSelected?: boolean;
  isVisible?: boolean;
  onClick?: () => void;
  scale?: number;
}

export const SubjectGalaxy: React.FC<SubjectGalaxyProps> = ({
  galaxy,
  isSelected = false,
  isVisible = true,
  onClick,
  scale = 1
}) => {
  const galaxyRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += isSelected ? 0.02 : 0.005;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
    
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  if (!isVisible) return null;

  const completionRate = (galaxy.completed / galaxy.nodes) * 100;
  const coreColor = isSelected ? "#FFFFFF" : galaxy.color;
  const ringColor = galaxy.color;

  return (
    <group
      ref={galaxyRef}
      position={galaxy.position}
      scale={scale}
      onClick={onClick}
    >
      {/* Galaxy Core */}
      <Sphere ref={coreRef} args={[0.8, 16, 16]}>
        <meshPhongMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Galaxy Ring */}
      <Ring ref={ringRef} args={[1.2, 2, 32]}>
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={0.4}
          side={2}
        />
      </Ring>

      {/* Orbital Nodes */}
      {Array.from({ length: Math.min(galaxy.nodes, 8) }).map((_, i) => {
        const angle = (i / Math.min(galaxy.nodes, 8)) * Math.PI * 2;
        const radius = 2.5;
        const isCompleted = i < Math.floor((galaxy.completed / galaxy.nodes) * 8);
        
        return (
          <Sphere
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            args={[0.15, 8, 8]}
          >
            <meshBasicMaterial
              color={isCompleted ? "#00FF00" : "#666666"}
              transparent
              opacity={isCompleted ? 0.9 : 0.4}
            />
          </Sphere>
        );
      })}

      {/* Galaxy Label */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.6}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {galaxy.name}
      </Text>

      {/* Progress Info */}
      <Text
        position={[0, -4.2, 0]}
        fontSize={0.4}
        color={ringColor}
        anchorX="center"
        anchorY="middle"
      >
        {galaxy.completed}/{galaxy.nodes} • {Math.round(completionRate)}%
      </Text>

      {/* Selection Indicator */}
      {isSelected && (
        <Ring args={[3, 3.2, 32]}>
          <meshBasicMaterial
            color="#FFFFFF"
            transparent
            opacity={0.8}
            side={2}
          />
        </Ring>
      )}
    </group>
  );
};
