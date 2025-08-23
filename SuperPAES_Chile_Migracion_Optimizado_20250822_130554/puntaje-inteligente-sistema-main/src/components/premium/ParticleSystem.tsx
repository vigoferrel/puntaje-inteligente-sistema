/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useEffect, useCallback } from 'react';
import styles from './ParticleSystem.module.css';

interface ParticleSystemProps {
  density?: number;
  color?: string;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  density = 25, // Reducido de 50 para mejor rendimiento
  color = '#ffd700',
  count = 25, // Reducido de 50 para mejor rendimiento
  size = 'medium',
  speed = 'medium',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number>();
  const isActiveRef = useRef(true);

  const resizeCanvas = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isActiveRef.current = true;
    resizeCanvas();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = Math.min(count || density, 30); // Límite máximo de 30 partículas
    const speedMultiplier = speed === 'slow' ? 0.3 : speed === 'fast' ? 1.5 : 0.8; // Reducido para mejor rendimiento
    const sizeMultiplier = size === 'small' ? 0.5 : size === 'large' ? 1.5 : 1; // Reducido tamaño máximo

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedMultiplier,
        vy: (Math.random() - 0.5) * speedMultiplier,
        size: (Math.random() * 2 + 1) * sizeMultiplier, // Reducido tamaño
        opacity: Math.random() * 0.4 + 0.1 // Reducido opacidad
      });
    }

    let lastTime = 0;
    const targetFPS = 30; // Limitado a 30 FPS para mejor rendimiento
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (!isActiveRef.current) return;

      // Throttle animation para mantener FPS estable
      if (currentTime - lastTime < frameInterval) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTime = currentTime;

      // Usar willChange para optimización de GPU
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Batch operations para mejor rendimiento
      ctx.globalCompositeOperation = 'source-over';
      
      particles.forEach(particle => {
        // Actualizar posición
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar en los bordes con margen
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8; // Reducir velocidad en rebote
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8; // Reducir velocidad en rebote
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Dibujar partícula optimizada
        ctx.fillStyle = color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      isActiveRef.current = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, color, count, size, speed, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.particleCanvas} ${className || ''}`}
    />
  );
};


