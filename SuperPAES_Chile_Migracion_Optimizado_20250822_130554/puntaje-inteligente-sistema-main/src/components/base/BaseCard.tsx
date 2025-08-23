/* eslint-disable react-refresh/only-export-components */
import { ComponentProps, FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

/**
 * COMPONENTE BASE CARD v2.0
 * Tarjeta base reutilizable con propiedades cinematogrÃ¡ficas
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { BaseEducationalComponentProps } from '../../types/ui-components';

interface BaseCardProps extends BaseEducationalComponentProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export const BaseCard: FC<BaseCardProps> = ({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  variant = 'default',
  size = 'md',
  interactive = false,
  cinematicProps,
  ...props
}) => {
  const baseClasses = cn(
    'rounded-lg border transition-all duration-300',
    {
      // Variantes
      'bg-white/10 backdrop-blur-sm border-white/20': variant === 'glass',
      'bg-card border-border': variant === 'default',
      'bg-card border-border shadow-lg': variant === 'elevated',
      'bg-transparent border-2 border-border': variant === 'outlined',
      
      // TamaÃ±os
      'p-3': size === 'sm',
      'p-4': size === 'md',
      'p-6': size === 'lg',
      'p-8': size === 'xl',
      
      // Interactividad
      'hover:scale-105 hover:shadow-xl cursor-pointer': interactive,
      
      // Efectos cinematogrÃ¡ficos
      'shadow-2xl shadow-primary/20': cinematicProps?.enableGlow
    },
    className
  );

  const CardContent = (
    <div className={baseClasses} {...props}>
      {(title || subtitle || icon || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-primary">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );

  if (cinematicProps?.enableTransitions !== false) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={interactive ? { scale: 1.02 } : undefined}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
};

