/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useRef } from 'react';
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/card';

interface FinancialHologramProps {
  metrics: unknown;
  active: boolean;
}

export const FinancialHologram: React.FC<FinancialHologramProps> = ({
  metrics,
  active
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // CÃ­rculos concÃ©ntricos hologrÃ¡ficos
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 5; i++) {
        const radius = 50 + i * 30 + Math.sin(time + i) * 10;
        const opacity = 0.3 - i * 0.05;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // PartÃ­culas flotantes
      for (let i = 0; i < 20; i++) {
        const x = centerX + Math.cos(time + i * 0.5) * (100 + i * 10);
        const y = centerY + Math.sin(time + i * 0.3) * (80 + i * 8);
        const size = 2 + Math.sin(time * 2 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, 0.6)`;
        ctx.fill();
      }

      // LÃ­neas de conexiÃ³n
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 0.5;
        const startX = centerX + Math.cos(angle) * 60;
        const startY = centerY + Math.sin(angle) * 60;
        const endX = centerX + Math.cos(angle) * 120;
        const endY = centerY + Math.sin(angle) * 120;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Texto hologrÃ¡fico central
      ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `$${(metrics.potentialSavings / 1000000).toFixed(1)}M`,
        centerX,
        centerY - 10
      );
      
      ctx.font = '14px monospace';
      ctx.fillText('Ahorro Potencial', centerX, centerY + 15);

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [metrics, active]);

  return (
    <motion.div
      className="relative h-80 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        className="hologram-glow-cyan"
      />
      
      {/* Efectos de overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-cyan-500/5 to-transparent" />
      
      {/* MÃ©tricas flotantes */}
      <motion.div
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-cyan-400 text-sm font-bold">{metrics.eligibleScholarships}</div>
        <div className="text-cyan-200 text-xs">Becas Elegibles</div>
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <div className="text-cyan-400 text-sm font-bold">{metrics.optimizationLevel}%</div>
        <div className="text-cyan-200 text-xs">OptimizaciÃ³n</div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="text-cyan-400 text-sm font-bold">{metrics.daysToDeadline} dÃ­as</div>
        <div className="text-cyan-200 text-xs">Hasta FUAS</div>
      </motion.div>
    </motion.div>
  );
};


