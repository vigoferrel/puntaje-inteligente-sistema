/* eslint-disable react-refresh/only-export-components */

import React, { useRef, useMemo, useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRealNeuralData } from '../../hooks/useRealNeuralData';

interface RealAdaptiveParticlesProps {
  count: number;
  variant: 'neural' | 'cosmic' | 'energy';
  intensity: number;
  neuralMetrics: unknown;
}

const RealAdaptiveParticles: React.FC<RealAdaptiveParticlesProps> = ({ 
  count, 
  variant, 
  intensity, 
  neuralMetrics 
}) => {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Posiciones basadas en coherencia neural
      const coherenceRadius = 30 * (neuralMetrics.neuralCoherence / 100);
      positions[i * 3] = (Math.random() - 0.5) * coherenceRadius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * coherenceRadius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * coherenceRadius;
      
      // Colores adaptativos basados en engagement
      const engagementFactor = neuralMetrics.engagementScore / 100;
      switch (variant) {
        case 'neural':
          colors[i * 3] = 0.4 + engagementFactor * 0.4;
          colors[i * 3 + 1] = 0.8 + engagementFactor * 0.2;
          colors[i * 3 + 2] = 1;
          break;
        case 'cosmic':
          colors[i * 3] = 0.8 + engagementFactor * 0.2;
          colors[i * 3 + 1] = 0.2 + engagementFactor * 0.3;
          colors[i * 3 + 2] = 0.9 + engagementFactor * 0.1;
          break;
        case 'energy':
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.8 + engagementFactor * 0.2;
          colors[i * 3 + 2] = 0.2 + engagementFactor * 0.3;
          break;
      }
    }
    
    return { positions, colors };
  }, [count, variant, neuralMetrics]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.elapsedTime;
    const engagement = neuralMetrics.engagementScore / 100;
    const velocity = neuralMetrics.learningVelocity / 100;
    
    // RotaciÃ³n adaptativa basada en velocidad de aprendizaje
    const rotationSpeed = 0.01 + velocity * 0.02;
    ref.current.rotation.x = Math.sin(time * rotationSpeed) * 0.1;
    ref.current.rotation.y = time * rotationSpeed * 0.5;
    
    // Movimiento de partÃ­culas basado en coherencia
    const positions = ref.current.geometry.attributes.position.array;
    const coherenceFactor = neuralMetrics.neuralCoherence / 100;
    
    for (let i = 1; i < positions.length; i += 3) {
      const originalY = positions[i];
      positions[i] = originalY + Math.sin(time + positions[i * 3]) * intensity * coherenceFactor * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Opacidad basada en engagement real
    if (ref.current.material) {
      (ref.current.material as unknown).opacity = 0.3 + engagement * 0.5;
    }
  });

  return (
    <Points 
      ref={ref} 
      positions={particlesPosition.positions} 
      colors={particlesPosition.colors}
      stride={3} 
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.001 + intensity * 0.002}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

interface RealCinematicParticleSystemProps {
  intensity?: number;
  isActive?: boolean;
  variant?: 'neural' | 'cosmic' | 'energy';
  className?: string;
}

export const RealCinematicParticleSystem: React.FC<RealCinematicParticleSystemProps> = ({
  intensity = 50,
  isActive = true,
  variant = 'neural',
  className = ''
}) => {
  const { neuralMetrics, isLoading } = useRealNeuralData();
  
  // ConfiguraciÃ³n adaptativa basada en mÃ©tricas reales
  const getParticleConfig = useCallback(() => {
    if (isLoading) {
      return { count: 100, intensity: 0.2 };
    }
    
    // Ajustar cantidad basado en engagement real
    const engagement = neuralMetrics.engagementScore;
    const coherence = neuralMetrics.neuralCoherence;
    
    let count = Math.floor((engagement + coherence) / 2 * 10) + 200;
    count = Math.min(count, 1500); // LÃ­mite para performance
    
    const adaptiveIntensity = (intensity / 100) * (1 + engagement / 200);
    
    return { count, intensity: adaptiveIntensity };
  }, [intensity, neuralMetrics, isLoading]);

  const config = getParticleConfig();

  if (!isActive || isLoading) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <RealAdaptiveParticles 
          count={config.count}
          variant={variant}
          intensity={config.intensity}
          neuralMetrics={neuralMetrics}
        />
      </Canvas>
    </div>
  );
};

// Hook para controlar el sistema de partÃ­culas con datos reales
export const useRealParticleSystem = () => {
  const { neuralMetrics } = useRealNeuralData();
  
  const getOptimalVariant = (): 'neural' | 'cosmic' | 'energy' => {
    const engagement = neuralMetrics.engagementScore;
    const coherence = neuralMetrics.neuralCoherence;
    
    if (engagement > 80) return 'energy';
    if (coherence > 70) return 'neural';
    return 'cosmic';
  };
  
  const getOptimalIntensity = (): number => {
    const engagement = neuralMetrics.engagementScore;
    const velocity = neuralMetrics.learningVelocity;
    
    return Math.min(100, Math.max(20, (engagement + velocity) / 2));
  };
  
  return {
    optimalVariant: getOptimalVariant(),
    optimalIntensity: getOptimalIntensity(),
    shouldShow: neuralMetrics.neuralCoherence > 20
  };
};

