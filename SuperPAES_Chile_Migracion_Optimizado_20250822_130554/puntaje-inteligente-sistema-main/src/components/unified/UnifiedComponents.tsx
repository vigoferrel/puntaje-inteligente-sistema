/* eslint-disable react-refresh/only-export-components */
// UNIFIED COMPONENTS - Componentes Base Unificados
// Context7 + Pensamiento Secuencial - Sistema de Componentes Consistentes

import React, { ReactNode } from 'react';
import './UnifiedComponents.module.css';

// ðŸŽ¯ UNIFIED CARD - Tarjeta Base Unificada
interface UnifiedCardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'neural' | 'spotify';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  hover = true,
  glow = false,
  className = ''
}) => {
  const classes = [
    'unified-card',
    `card-${variant}`,
    `card-${size}`,
    hover ? 'card-hover' : '',
    glow ? 'card-glow' : '',
    'spotify-glass-card',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// âš¡ UNIFIED BUTTON - BotÃ³n Base Unificado
interface UnifiedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'neural';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  const classes = [
    'unified-button',
    `button-${variant}`,
    `button-${size}`,
    loading ? 'button-loading' : '',
    disabled ? 'button-disabled' : '',
    'synergy-button-available',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="button-spinner">ðŸ”„</span>}
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};

// ðŸ“Š UNIFIED METRIC - MÃ©trica Base Unificada
interface UnifiedMetricProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  color?: 'primary' | 'success' | 'warning' | 'error';
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const UnifiedMetric: React.FC<UnifiedMetricProps> = ({
  icon,
  value,
  label,
  trend,
  color = 'primary',
  animated = true,
  size = 'md'
}) => {
  const classes = [
    'unified-metric',
    `metric-${color}`,
    `metric-${size}`,
    animated ? 'metric-animated' : '',
    'spotify-glass-card'
  ].filter(Boolean).join(' ');

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'ðŸ“ˆ';
      case 'down': return 'ðŸ“‰';
      case 'stable': return 'âž¡ï¸';
      default: return '';
    }
  };

  return (
    <div className={classes}>
      <div className="metric-icon synergy-icon">{icon}</div>
      <div className="metric-value synergy-metric-value">{value}</div>
      <div className="metric-label synergy-metric-label">
        {label}
        {trend && <span className="metric-trend">{getTrendIcon()}</span>}
      </div>
    </div>
  );
};

// ðŸŽµ UNIFIED PROGRESS - Barra de Progreso Unificada
interface UnifiedProgressProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showValue?: boolean;
}

export const UnifiedProgress: React.FC<UnifiedProgressProps> = ({
  value,
  max = 100,
  label,
  color = 'primary',
  size = 'md',
  animated = true,
  showValue = true
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const progressClass = `progress-${Math.round(percentage / 5) * 5}`;

  const classes = [
    'unified-progress',
    `progress-${color}`,
    `progress-${size}`,
    animated ? 'progress-animated' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {label && (
        <div className="progress-header">
          <span className="progress-label">{label}</span>
          {showValue && (
            <span className="progress-value">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="progress-track synergy-progress">
        <div className={`progress-fill synergy-progress-fill ${progressClass}`}>
          <div className="progress-glow"></div>
        </div>
      </div>
    </div>
  );
};

// ðŸ”” UNIFIED NOTIFICATION - NotificaciÃ³n Base Unificada
interface UnifiedNotificationProps {
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  icon?: string;
  duration?: number;
  onClose?: () => void;
}

export const UnifiedNotification: React.FC<UnifiedNotificationProps> = ({
  type,
  title,
  message,
  icon,
  duration = 5000,
  onClose
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case 'success': return 'âœ…';
      case 'info': return 'â„¹ï¸';
      case 'warning': return 'âš ï¸';
      case 'error': return 'âŒ';
      default: return 'ðŸ“¢';
    }
  };

  const classes = [
    'unified-notification',
    `notification-${type}`,
    'spotify-glass-card'
  ].filter(Boolean).join(' ');

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={classes}>
      <div className="notification-icon synergy-icon">
        {icon || getDefaultIcon()}
      </div>
      <div className="notification-content">
        {title && <div className="notification-title">{title}</div>}
        <div className="notification-message">{message}</div>
      </div>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          âœ•
        </button>
      )}
    </div>
  );
};

// ðŸŽ¯ UNIFIED BADGE - Insignia Base Unificada
interface UnifiedBadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  glow?: boolean;
}

export const UnifiedBadge: React.FC<UnifiedBadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  pulse = false,
  glow = false
}) => {
  const classes = [
    'unified-badge',
    `badge-${variant}`,
    `badge-${size}`,
    pulse ? 'badge-pulse' : '',
    glow ? 'badge-glow' : ''
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

// ðŸŒŸ UNIFIED CONTAINER - Contenedor Base Unificado
interface UnifiedContainerProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'neural' | 'spotify';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  className?: string;
}

export const UnifiedContainer: React.FC<UnifiedContainerProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  maxWidth = 'full',
  center = false,
  className = ''
}) => {
  const classes = [
    'unified-container',
    `container-${variant}`,
    `container-padding-${padding}`,
    `container-max-${maxWidth}`,
    center ? 'container-center' : '',
    variant === 'glass' ? 'spotify-glass-panel' : '',
    variant === 'neural' ? 'spotify-neural-container' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// ðŸŽ® UNIFIED GRID - Grid Base Unificado
interface UnifiedGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  className?: string;
}

export const UnifiedGrid: React.FC<UnifiedGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  responsive = true,
  className = ''
}) => {
  const classes = [
    'unified-grid',
    `grid-cols-${columns}`,
    `grid-gap-${gap}`,
    responsive ? 'grid-responsive' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
