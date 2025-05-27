
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CinematicParticleSystemProps {
  intensity: number;
  isActive: boolean;
  variant?: 'neural' | 'cosmic' | 'energy';
}

export const CinematicParticleSystem: React.FC<CinematicParticleSystemProps> = ({
  intensity,
  isActive,
  variant = 'neural'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Partículas neurales
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      connections: Array<{ x: number; y: number; strength: number }>;
    }> = [];

    const colors = {
      neural: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'],
      cosmic: ['#e11d48', '#7c3aed', '#0ea5e9', '#f97316'],
      energy: ['#eab308', '#22c55e', '#3b82f6', '#ec4899']
    };

    const particleColors = colors[variant];

    // Crear partículas
    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        maxLife: Math.random() * 300 + 200,
        size: Math.random() * 3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        connections: []
      };
    };

    // Inicializar partículas
    const particleCount = Math.floor((intensity / 100) * 80) + 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particles.forEach((particle, index) => {
        // Actualizar posición
        particle.x += particle.vx * (intensity / 100);
        particle.y += particle.vy * (intensity / 100);
        particle.life -= 1;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Renovar partícula si muere
        if (particle.life <= 0) {
          particles[index] = createParticle();
          return;
        }

        // Buscar conexiones neurales
        particle.connections = [];
        particles.forEach((other, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120 && particle.connections.length < 3) {
              const strength = 1 - (distance / 120);
              particle.connections.push({
                x: other.x,
                y: other.y,
                strength
              });
            }
          }
        });

        // Dibujar conexiones neurales
        particle.connections.forEach(connection => {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(connection.x, connection.y);
          ctx.strokeStyle = `${particle.color}${Math.floor(connection.strength * 50).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = connection.strength * 2;
          ctx.stroke();
        });

        // Dibujar partícula
        const alpha = particle.life / particle.maxLife;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Efecto de resplandor neural
        if (particle.connections.length > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${particle.color}${Math.floor(alpha * 30).toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, isActive, variant]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
