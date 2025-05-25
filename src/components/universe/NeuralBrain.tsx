
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface NeuralBrainProps {
  position: [number, number, number];
  scale: number;
  isActive: boolean;
  onClick: () => void;
  userLevel: number;
  cosmicEnergy: number;
}

export const NeuralBrain: React.FC<NeuralBrainProps> = ({
  position,
  scale,
  isActive,
  onClick,
  userLevel,
  cosmicEnergy
}) => {
  const brainRef = useRef<THREE.Mesh>(null);
  const pulseCoreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.01;
      brainRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    
    if (pulseCoreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      pulseCoreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Núcleo Pulsante */}
      <Sphere ref={pulseCoreRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial 
          color={isActive ? "#00FFFF" : "#8B5CF6"}
          emissive={isActive ? "#004444" : "#220044"}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Estructura Neural Externa */}
      <Sphere ref={brainRef} args={[2.2, 16, 16]} onClick={onClick}>
        <meshStandardMaterial 
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Partículas Neuronales */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        return (
          <Sphere 
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 0.5) * 0.5,
              Math.sin(angle) * radius
            ]}
            args={[0.1, 8, 8]}
          >
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#443300"
            />
          </Sphere>
        );
      })}

      {/* HUD del Cerebro */}
      <Html
        position={[0, 3.5, 0]}
        center
        distanceFactor={10}
        occlude
      >
        <motion.div 
          className="bg-black/50 backdrop-blur-lg rounded-lg p-3 text-white text-center border border-cyan-400/50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="text-lg font-bold text-cyan-400">SuperPAES Neural</div>
          <div className="text-sm">Coordinador Vocacional</div>
          <div className="flex justify-between text-xs mt-2">
            <span>Nivel: {userLevel}</span>
            <span>Energía: {cosmicEnergy}</span>
          </div>
          {isActive && (
            <div className="text-xs text-green-400 mt-1">
              ● Sistema Activo
            </div>
          )}
        </motion.div>
      </Html>
    </group>
  );
};
