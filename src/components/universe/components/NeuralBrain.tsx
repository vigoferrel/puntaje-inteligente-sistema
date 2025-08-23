
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import { Mesh } from 'three';

interface NeuralBrainProps {
  position: [number, number, number];
  scale?: number;
  isActive?: boolean;
  onClick?: () => void;
  userLevel: number;
  cosmicEnergy: number;
}

export const NeuralBrain: React.FC<NeuralBrainProps> = ({
  position,
  scale = 1,
  isActive = false,
  onClick,
  userLevel,
  cosmicEnergy
}) => {
  const brainRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.01;
      brainRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (coreRef.current) {
      coreRef.current.rotation.x += 0.02;
      coreRef.current.rotation.z += 0.015;
    }
  });

  return (
    <group position={position} scale={scale} onClick={onClick}>
      {/* Core Neural Sphere */}
      <Sphere ref={coreRef} args={[1, 32, 32]}>
        <meshStandardMaterial
          color={isActive ? "#00FFFF" : "#4A90E2"}
          wireframe={true}
          transparent
          opacity={0.6}
          emissive={isActive ? "#001122" : "#000011"}
        />
      </Sphere>

      {/* Outer Brain Shell */}
      <Sphere ref={brainRef} args={[1.5, 16, 16]}>
        <meshPhongMaterial
          color={isActive ? "#FF00FF" : "#8A2BE2"}
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Neural Particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.5;
        return (
          <Sphere
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle + Date.now() * 0.001) * 0.5,
              Math.sin(angle) * radius
            ]}
            args={[0.1, 8, 8]}
          >
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={0.8}
            />
          </Sphere>
        );
      })}

      {/* Neural Status Text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        SuperPAES Neural Core
      </Text>

      <Text
        position={[0, -3.8, 0]}
        fontSize={0.3}
        color="#00FFFF"
        anchorX="center"
        anchorY="middle"
      >
        Nivel {userLevel} • {cosmicEnergy} Energía
      </Text>
    </group>
  );
};
