
import React from 'react';
import { motion } from 'framer-motion';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UnifiedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'neural';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  cinematicEffect?: boolean;
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'default',
  className,
  disabled = false,
  loading = false,
  icon,
  cinematicEffect = false,
  ...props
}) => {
  const baseButton = (
    <ShadcnButton
      onClick={onClick}
      variant={variant === 'neural' ? 'default' : variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        variant === 'neural' && 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </ShadcnButton>
  );

  if (cinematicEffect) {
    return (
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {baseButton}
      </motion.div>
    );
  }

  return baseButton;
};
