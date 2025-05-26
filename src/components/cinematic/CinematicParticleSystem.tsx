
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CinematicParticleSystemProps {
  intensity: number;
  isActive: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'neural' | 'data' | 'energy';
}

export const CinematicParticleSystem: React.FC<CinematicParticleSystemProps> = ({
  intensity,
  isActive
}) => {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isActive) return;

    // Generar partículas iniciales
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)],
      type: ['neural', 'data', 'energy'][Math.floor(Math.random() * 3)] as 'neural' | 'data' | 'energy'
    }));

    setParticles(initialParticles);

    // Animación de partículas
    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx * (intensity / 50);
        let newY = particle.y + particle.vy * (intensity / 50);

        // Rebote en bordes
        if (newX <= 0 || newX >= window.innerWidth) {
          particle.vx *= -1;
          newX = Math.max(0, Math.min(window.innerWidth, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          particle.vy *= -1;
          newY = Math.max(0, Math.min(window.innerHeight, newY));
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          opacity: Math.sin(Date.now() / 1000 + particle.id) * 0.3 + 0.5
        };
      }));

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [intensity, isActive]);

  const getParticleIcon = (type: string) => {
    switch (type) {
      case 'neural': return '🧠';
      case 'data': return '📊';
      case 'energy': return '⚡';
      default: return '✨';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            color: particle.color,
            opacity: particle.opacity
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              fontSize: `${particle.size}px`
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
