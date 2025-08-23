/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { ParticleSystem } from './ParticleSystem';

interface CinematicBackgroundProps { 
  children: React.ReactNode; 
  particles?: boolean; 
  className?: string;
  particleCount?: number;
  particleColor?: string;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({ 
  children, 
  particles = true, 
  className = '',
  particleCount = 30,
  particleColor = "#ffd700"
}) => {
  return (
    <div className={`relative min-h-screen particle-field ${className}`}>
      {particles && <ParticleSystem density={particleCount} color={particleColor} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

