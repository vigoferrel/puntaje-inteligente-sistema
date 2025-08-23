/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';

interface PremiumCardProps { 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean; 
  glow?: boolean;
  glowColor?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  glowColor = 'blue'
}) => {
  const getGlowStyle = () => {
    if (!glow) return {};
    
    const colorMap: Record<string, string> = {
      blue: '59, 130, 246',
      purple: '147, 51, 234',
      green: '34, 197, 94',
      red: '239, 68, 68',
      yellow: '234, 179, 8',
      pink: '236, 72, 153',
      cyan: '6, 182, 212',
      orange: '249, 115, 22',
      emerald: '16, 185, 129',
      teal: '20, 184, 166'
    };
    
    const rgb = colorMap[glowColor] || '59, 130, 246';
    return {
      boxShadow: `0 0 20px rgba(${rgb}, 0.3)`
    };
  };

  return (
    <motion.div
      className={`premium-glass rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      style={getGlowStyle()}
    >
      {children}
    </motion.div>
  );
};

