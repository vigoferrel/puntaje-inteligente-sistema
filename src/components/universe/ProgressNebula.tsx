
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ProgressNebulaProps {
  position: [number, number, number];
  progress: number;
  isVisible: boolean;
}

export const ProgressNebula: React.FC<ProgressNebulaProps> = ({
  position,
  progress,
  isVisible
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generar partículas basadas en el progreso
  const particleCount = Math.floor((progress / 100) * 1000) + 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.cos(phi);
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      pointsRef.current.rotation.x += 0.001;
    }
  });

  if (!isVisible) return null;

  return (
    <group position={position}>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          color="#00FFFF"
          size={0.05}
          transparent
          opacity={0.8}
          alphaTest={0.01}
        />
      </Points>
    </group>
  );
};
