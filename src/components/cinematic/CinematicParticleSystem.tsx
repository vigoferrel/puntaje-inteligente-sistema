
import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';

interface ParticleSystemProps {
  intensity?: number;
  isActive?: boolean;
  variant?: 'neural' | 'cosmic' | 'energy';
  className?: string;
}

const AdaptiveParticles: React.FC<{ 
  count: number; 
  variant: 'neural' | 'cosmic' | 'energy';
  intensity: number;
}> = ({ count, variant, intensity }) => {
  const ref = useRef<THREE.Points>(null);
  const { realTimeMetrics } = useAdvancedNeuralSystem('particle-system');
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Posiciones
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      // Colores basados en variante
      switch (variant) {
        case 'neural':
          colors[i * 3] = 0.4 + Math.random() * 0.4; // R (cian-azul)
          colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
          colors[i * 3 + 2] = 1; // B
          break;
        case 'cosmic':
          colors[i * 3] = 0.8 + Math.random() * 0.2; // R (rosa-morado)
          colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G
          colors[i * 3 + 2] = 0.9 + Math.random() * 0.1; // B
          break;
        case 'energy':
          colors[i * 3] = 1; // R (amarillo-verde)
          colors[i * 3 + 1] = 0.8 + Math.random() * 0.2; // G
          colors[i * 3 + 2] = 0.2 + Math.random() * 0.3; // B
          break;
      }
    }
    
    return { positions, colors };
  }, [count, variant]);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.elapsedTime;
    const engagement = realTimeMetrics.real_time_engagement / 100;
    const coherence = realTimeMetrics.neural_coherence / 100;
    
    // Rotación adaptativa basada en métricas neurales
    const rotationSpeed = 0.01 + engagement * 0.02;
    ref.current.rotation.x = Math.sin(time * rotationSpeed) * 0.1;
    ref.current.rotation.y = time * rotationSpeed * 0.5;
    
    // Movimiento de partículas
    const positions = ref.current.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      const originalY = positions[i];
      positions[i] = originalY + Math.sin(time + positions[i * 3]) * intensity * coherence * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Cambio de opacidad basado en engagement
    if (ref.current.material) {
      (ref.current.material as any).opacity = 0.4 + engagement * 0.4;
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
        size={0.002 + intensity * 0.001}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const CinematicParticleSystem: React.FC<ParticleSystemProps> = ({
  intensity = 50,
  isActive = true,
  variant = 'neural',
  className = ''
}) => {
  const { realTimeMetrics, shouldReduceMotion } = useAdvancedNeuralSystem('cinematic-particles');
  
  // Configuración adaptativa de partículas
  const getParticleConfig = useCallback(() => {
    if (shouldReduceMotion) {
      return { count: 200, intensity: 0.3 };
    }
    
    const performance = realTimeMetrics.adaptive_intelligence_score;
    const engagement = realTimeMetrics.real_time_engagement;
    
    // Ajustar cantidad basado en performance del dispositivo
    let count = 1000;
    if (performance < 50) count = 500;
    if (performance < 30) count = 200;
    
    // Ajustar intensidad basado en engagement
    const adaptiveIntensity = (intensity / 100) * (1 + engagement / 200);
    
    return { count, intensity: adaptiveIntensity };
  }, [intensity, realTimeMetrics, shouldReduceMotion]);

  const config = getParticleConfig();

  if (!isActive || shouldReduceMotion) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ 
          antialias: false, // Optimización
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // Limitar DPR para mejor performance
      >
        <ambientLight intensity={0.3} />
        <AdaptiveParticles 
          count={config.count}
          variant={variant}
          intensity={config.intensity}
        />
      </Canvas>
    </div>
  );
};

// Hook para controlar el sistema de partículas
export const useParticleSystem = () => {
  const { realTimeMetrics } = useAdvancedNeuralSystem();
  
  const getOptimalVariant = (): 'neural' | 'cosmic' | 'energy' => {
    const engagement = realTimeMetrics.real_time_engagement;
    const coherence = realTimeMetrics.neural_coherence;
    
    if (engagement > 80) return 'energy';
    if (coherence > 70) return 'neural';
    return 'cosmic';
  };
  
  const getOptimalIntensity = (): number => {
    const engagement = realTimeMetrics.real_time_engagement;
    const satisfaction = realTimeMetrics.user_satisfaction_index;
    
    return Math.min(100, Math.max(20, (engagement + satisfaction) / 2));
  };
  
  return {
    optimalVariant: getOptimalVariant(),
    optimalIntensity: getOptimalIntensity(),
    shouldShow: realTimeMetrics.adaptive_intelligence_score > 30
  };
};
