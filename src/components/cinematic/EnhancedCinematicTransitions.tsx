
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface EnhancedCinematicTransitionsProps {
  children: React.ReactNode;
  variant?: 'neural' | 'cosmic' | 'energy' | 'universe';
  duration?: number;
  className?: string;
}

const transitionVariants: Record<string, Variants> = {
  neural: {
    initial: {
      opacity: 0,
      scale: 0.9,
      rotateY: -15,
      filter: 'blur(10px) hue-rotate(0deg)',
      background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))'
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: 'blur(0px) hue-rotate(0deg)',
      background: 'linear-gradient(45deg, rgba(6, 182, 212, 0), rgba(139, 92, 246, 0))',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        filter: { duration: 0.8 },
        background: { duration: 1.5 }
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      rotateY: 15,
      filter: 'blur(10px) hue-rotate(180deg)',
      background: 'linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
      transition: {
        duration: 0.8,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  },
  
  cosmic: {
    initial: {
      opacity: 0,
      scale: 0.8,
      rotateZ: -10,
      y: 30,
      filter: 'brightness(0.5) saturate(2)',
      background: 'radial-gradient(circle, rgba(225, 29, 72, 0.1), rgba(124, 58, 237, 0.1))'
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateZ: 0,
      y: 0,
      filter: 'brightness(1) saturate(1)',
      background: 'radial-gradient(circle, rgba(225, 29, 72, 0), rgba(124, 58, 237, 0))',
      transition: {
        duration: 1.5,
        ease: [0.165, 0.84, 0.44, 1],
        scale: { type: 'spring', stiffness: 120, damping: 10 }
      }
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      rotateZ: 10,
      y: -30,
      filter: 'brightness(1.5) saturate(0)',
      background: 'radial-gradient(circle, rgba(225, 29, 72, 0.3), rgba(124, 58, 237, 0.3))',
      transition: {
        duration: 1,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  },
  
  energy: {
    initial: {
      opacity: 0,
      x: -100,
      skewX: 15,
      filter: 'brightness(2) contrast(1.5)',
      background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.2), rgba(34, 197, 94, 0.2))'
    },
    animate: {
      opacity: 1,
      x: 0,
      skewX: 0,
      filter: 'brightness(1) contrast(1)',
      background: 'linear-gradient(90deg, rgba(234, 179, 8, 0), rgba(34, 197, 94, 0))',
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        x: { type: 'spring', stiffness: 100, damping: 15 }
      }
    },
    exit: {
      opacity: 0,
      x: 100,
      skewX: -15,
      filter: 'brightness(0.5) contrast(0.5)',
      background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.1), rgba(34, 197, 94, 0.1))',
      transition: {
        duration: 0.6,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  },
  
  universe: {
    initial: {
      opacity: 0,
      scale: 0.3,
      rotateX: 90,
      rotateY: 45,
      z: -1000,
      filter: 'blur(20px) sepia(1)',
      background: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.2), rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.2))'
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      filter: 'blur(0px) sepia(0)',
      background: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0), rgba(59, 130, 246, 0), rgba(16, 185, 129, 0))',
      transition: {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { type: 'spring', stiffness: 60, damping: 12 },
        rotateX: { duration: 1.5 },
        rotateY: { duration: 1.8 }
      }
    },
    exit: {
      opacity: 0,
      scale: 2,
      rotateX: -90,
      rotateY: -45,
      z: 1000,
      filter: 'blur(20px) sepia(0.5)',
      background: 'conic-gradient(from 180deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))',
      transition: {
        duration: 1.2,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  }
};

export const EnhancedCinematicTransitions: React.FC<EnhancedCinematicTransitionsProps> = ({
  children,
  variant = 'neural',
  duration = 1,
  className = ''
}) => {
  const variants = transitionVariants[variant];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`${className} transform-gpu will-change-transform`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
      
      {/* Efectos de partículas durante la transición */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: duration * 0.5, repeat: 1 }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              variant === 'neural' ? 'bg-cyan-400' :
              variant === 'cosmic' ? 'bg-pink-400' :
              variant === 'energy' ? 'bg-yellow-400' :
              'bg-purple-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [0, -50, -100]
            }}
            transition={{
              duration: duration,
              delay: i * 0.1,
              ease: 'easeOut'
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Hook para usar transiciones cinematográficas
export const useCinematicTransition = (variant: 'neural' | 'cosmic' | 'energy' | 'universe' = 'neural') => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const triggerTransition = (callback?: () => void) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      callback?.();
      setIsTransitioning(false);
    }, 1200);
  };

  return {
    isTransitioning,
    triggerTransition,
    TransitionWrapper: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <AnimatePresence mode="wait">
        <EnhancedCinematicTransitions 
          variant={variant} 
          className={className}
          key={isTransitioning ? 'transitioning' : 'stable'}
        >
          {children}
        </EnhancedCinematicTransitions>
      </AnimatePresence>
    )
  };
};
