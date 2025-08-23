/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';

interface PremiumContainerProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
  variant?: 'glass' | 'solid' | 'gradient';
}

export const PremiumContainer: React.FC<PremiumContainerProps> = ({
  children,
  className = '',
  glow = false,
  animate = true,
  variant = 'glass'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return 'bg-black-primary border-gold-accent';
      case 'gradient':
        return 'bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary border-platinum-accent';
      default:
        return 'premium-glass';
    }
  };

  const containerProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  } : {};

  return (
    <motion.div
      className={`premium-container ${getVariantStyles()} ${glow ? 'cinematic-glow' : ''} ${className}`}
      {...containerProps}
    >
      {children}
    </motion.div>
  );
};
