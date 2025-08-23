/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { AdaptivePerformanceContext } from '../../contexts/AdaptivePerformanceContext';
import styles from './CinematicParticleSystem.module.css'; // Importar CSS modular

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

interface CinematicParticleSystemProps {
  universe?: 'dashboard' | 'superpaes' | 'neural-hub';
  intensity?: 'low' | 'medium' | 'high' | number;
  isActive?: boolean;
  variant?: 'neural' | 'cosmic' | 'energy';
}

export const CinematicParticleSystem: React.FC<CinematicParticleSystemProps> = ({
  universe = 'dashboard',
  intensity = 'medium',
  isActive = true,
  variant = 'neural'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]); // Tipado correcto para 'Particle[]'
  
  const adaptivePerformanceContext = useContext(AdaptivePerformanceContext); // Usar useContext para obtener el valor del contexto
  const settings = adaptivePerformanceContext?.settings; // Acceder a settings
  const { adaptiveAnimate } = useOptimizedAnimation();
  
  // Configuracion ultra-optimizada
  const config = useMemo(() => {
    const baseConfigs = {
      dashboard: { color: '#00bcd4', baseCount: 30 },
      superpaes: { color: '#9c27b0', baseCount: 35 },
      'neural-hub': { color: '#4caf50', baseCount: 25 }
    };
    
    const intensityMult = typeof intensity === 'number' ? intensity / 100 : 
                          intensity === 'high' ? 1.2 : intensity === 'low' ? 0.6 : 1;
    
    const base = baseConfigs[universe];
    return {
      color: base.color,
      count: Math.min(Math.round(base.baseCount * intensityMult), 50) // Limite maximo // Corregido: base.baseCount
    };
  }, [universe, intensity]);

  // Animacion ultra-optimizada con OffscreenCanvas
  const optimizedRender = useCallback(() => {
    const canvas = canvasRef.current;
    // Asegurarse de que settings no sea null/undefined antes de acceder a effectsEnabled
    if (!canvas || !settings?.effectsEnabled || !isActive) return; 
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimizacion
    if (!ctx) return;
    
    const { width, height } = canvas;
    const particles = particlesRef.current;
    
    // Clear optimizado
    ctx.clearRect(0, 0, width, height);
    
    // Batch rendering para mejor rendimiento
    ctx.fillStyle = config.color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    
    // Loop ultra-optimizado
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Update position (vectorizado)
      p.x += p.vx;
      p.y += p.vy;
      
      // Boundary check optimizado
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      
      // Batch drawing
      ctx.moveTo(p.x + p.size, p.y);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    
    ctx.fill();
  }, [config, settings?.effectsEnabled, isActive]); // Asegurarse de que settings no sea null/undefined

  // Inicializacion optimizada
  useEffect(() => {
    // Asegurarse de que settings no sea null/undefined antes de acceder a effectsEnabled
    if (!settings?.effectsEnabled || !isActive) return; 
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Crear particulas optimizadas
    const particles: Particle[] = []; // Especificar tipo para las particulas
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.4,
        color: config.color
      });
    }
    particlesRef.current = particles;
    
    // Iniciar animacion optimizada
    const cleanup = adaptiveAnimate(optimizedRender);
    return cleanup;
  }, [config, settings?.effectsEnabled, isActive, adaptiveAnimate, optimizedRender]);

  // Asegurarse de que settings no sea null/undefined antes de acceder a effectsEnabled
  if (!settings?.effectsEnabled || !isActive) return null; 

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${styles.particleCanvas}`} // Usar clase CSS modular
    />
  );
};

export default React.memo(CinematicParticleSystem);

