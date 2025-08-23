/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'gold' | 'platinum' | 'diamond';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  onClick,
  variant = 'gold',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'platinum':
        return 'bg-gradient-to-r from-gray-300 to-gray-100 text-black border-gray-400';
      case 'diamond':
        return 'bg-gradient-to-r from-blue-200 to-cyan-100 text-black border-cyan-400';
      default:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black border-yellow-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      className={`premium-button ${getVariantStyles()} ${getSizeStyles()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
