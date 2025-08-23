/* eslint-disable react-refresh/only-export-components */
import { ComponentProps, FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

/**
 * COMPONENTE BASE BUTTON v2.0
 * BotÃ³n base reutilizable con efectos cinematogrÃ¡ficos
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { BaseEducationalComponentProps } from '../../types/ui-components';

interface BaseButtonProps extends BaseEducationalComponentProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'destructive' | 'neural';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const BaseButton: FC<BaseButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  cinematicProps,
  ...props
}) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Variantes
      'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary': variant === 'primary',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary': variant === 'secondary',
      'bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-accent': variant === 'ghost',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive': variant === 'destructive',
      'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/25': variant === 'neural',
      
      // TamaÃ±os
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-sm': size === 'md',
      'h-12 px-6 text-base': size === 'lg',
      'h-14 px-8 text-lg': size === 'xl',
      
      // Ancho completo
      'w-full': fullWidth,
      
      // Efectos cinematogrÃ¡ficos
      'shadow-xl shadow-primary/30': cinematicProps?.enableGlow && variant === 'primary',
      'transform hover:scale-105 active:scale-95': cinematicProps?.enableTransitions !== false
    },
    className
  );

  const buttonContent = (
    <>
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </>
  );

  const ButtonElement = (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      {...props}
    >
      {buttonContent}
    </button>
  );

  if (cinematicProps?.enableTransitions !== false) {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {ButtonElement}
      </motion.div>
    );
  }

  return ButtonElement;
};

