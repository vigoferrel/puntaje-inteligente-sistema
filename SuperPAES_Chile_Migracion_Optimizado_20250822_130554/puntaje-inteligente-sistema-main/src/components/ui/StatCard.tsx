/* eslint-disable react-refresh/only-export-components */
// ============================================================================
// ðŸ“Š STAT CARD COMPONENT - TARJETA DE ESTADÃSTICAS CINEMATOGRÃFICA ðŸ“Š
// Sequential Thinking + Context7 - Componente de MÃ©tricas Premium
// ============================================================================

import React from 'react';
import { PremiumCard } from './PremiumCard';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  size = 'md',
  animated = true
}) => {
  const colorClasses = {
    primary: 'text-primary-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    info: 'text-blue-400'
  };

  const trendClasses = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  const trendIcons = {
    up: 'â†—',
    down: 'â†˜',
    neutral: 'â†’'
  };

  const animationClass = animated ? 'animate-fade-in-up' : '';

  return (
    <PremiumCard 
      variant="glass" 
      size={size}
      hover={true}
      className={`stat-card ${animationClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className={`text-xl ${colorClasses[color]}`}>
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="mb-1">
            <span
              className={`stat-card-gradient-value stat-card-value-${color} ${colorClasses[color]} gradient-text`}
            >
              {value}
            </span>
          </div>

          {subtitle && (
            <p className="text-sm text-slate-300 mb-2">
              {subtitle}
            </p>
          )}

          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <span className={`text-sm ${trendClasses[trend]}`}>
                {trendIcons[trend]} {trendValue}
              </span>
              <span className="text-xs text-slate-500">vs anterior</span>
            </div>
          )}
        </div>
      </div>

      {/* Efecto de brillo sutil */}
      <div
        className={`stat-card-glow-effect stat-card-glow-${color}`}
      />
    </PremiumCard>
  );
};

export default StatCard;
