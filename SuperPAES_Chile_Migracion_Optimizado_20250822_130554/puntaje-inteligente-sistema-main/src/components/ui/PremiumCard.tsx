/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// ðŸŽ¨ PREMIUM CARD COMPONENT - DISEÃ‘O CINEMATOGRÃFICO AVANZADO ðŸŽ¨
// Sequential Thinking + Context7 - Componente Reutilizable de Nivel Profesional
// ============================================================================

import React from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className = '',
  variant = 'glass',
  size = 'md',
  hover = true,
  glow = false,
  onClick
}) => {
  const baseClasses = 'premium-card';
  
  const variantClasses = {
    glass: 'premium-card-glass',
    solid: 'premium-card-solid',
    gradient: 'premium-card-gradient'
  };

  const sizeClasses = {
    sm: 'premium-card-sm',
    md: 'premium-card-md',
    lg: 'premium-card-lg',
    xl: 'premium-card-xl'
  };

  const hoverClasses = hover ? 'premium-card-hover' : '';
  const glowClasses = glow ? 'premium-card-glow' : '';

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    hoverClasses,
    glowClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default PremiumCard;
