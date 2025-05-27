
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'button' | 'card' | 'input' | 'navigation';
  intensity?: 'subtle' | 'moderate' | 'dramatic';
  className?: string;
}

export const IntelligentMicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'button',
  intensity = 'moderate',
  className = ''
}) => {
  const { realTimeMetrics, actions } = useAdvancedNeuralSystem('micro-interaction');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Configuración adaptativa basada en métricas neurales
  const getAdaptiveConfig = () => {
    const engagement = realTimeMetrics.real_time_engagement;
    const cognitiveLoad = realTimeMetrics.neural_coherence;
    
    // Reducir intensidad si hay alta carga cognitiva
    const adaptiveIntensity = cognitiveLoad < 50 ? 'subtle' : intensity;
    
    const configs = {
      subtle: {
        scale: 1.02,
        duration: 0.15,
        shadowBlur: 8,
        glowIntensity: 0.3
      },
      moderate: {
        scale: 1.05,
        duration: 0.2,
        shadowBlur: 12,
        glowIntensity: 0.5
      },
      dramatic: {
        scale: 1.08,
        duration: 0.3,
        shadowBlur: 20,
        glowIntensity: 0.8
      }
    };

    return configs[adaptiveIntensity];
  };

  const config = getAdaptiveConfig();

  const handleInteraction = (action: string) => {
    actions.captureEvent('interaction', {
      type: 'micro_interaction',
      element_type: type,
      action,
      engagement_boost: true
    });
  };

  const getInteractionVariants = () => {
    switch (type) {
      case 'button':
        return {
          initial: { scale: 1, filter: 'brightness(1)' },
          hover: { 
            scale: config.scale,
            filter: `brightness(1.1) drop-shadow(0 0 ${config.shadowBlur}px rgba(99, 102, 241, ${config.glowIntensity}))`,
            transition: { duration: config.duration, ease: 'easeOut' }
          },
          tap: { 
            scale: 0.95,
            filter: 'brightness(1.2)',
            transition: { duration: 0.1 }
          }
        };
      
      case 'card':
        return {
          initial: { 
            scale: 1, 
            rotateY: 0,
            filter: 'brightness(1)'
          },
          hover: { 
            scale: config.scale,
            rotateY: 2,
            filter: `brightness(1.05) drop-shadow(0 8px ${config.shadowBlur * 2}px rgba(99, 102, 241, ${config.glowIntensity * 0.5}))`,
            transition: { duration: config.duration * 1.5, ease: 'easeOut' }
          }
        };
      
      case 'navigation':
        return {
          initial: { 
            x: 0,
            filter: 'brightness(1)'
          },
          hover: { 
            x: 4,
            filter: `brightness(1.1) drop-shadow(0 0 ${config.shadowBlur}px rgba(34, 197, 94, ${config.glowIntensity}))`,
            transition: { duration: config.duration, ease: 'easeOut' }
          }
        };
      
      default:
        return {
          initial: { scale: 1 },
          hover: { scale: config.scale },
          tap: { scale: 0.98 }
        };
    }
  };

  return (
    <motion.div
      variants={getInteractionVariants()}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => {
        setIsHovered(true);
        handleInteraction('hover_start');
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        handleInteraction('hover_end');
      }}
      onTapStart={() => {
        setIsPressed(true);
        handleInteraction('tap_start');
      }}
      onTapEnd={() => {
        setIsPressed(false);
        handleInteraction('tap_end');
      }}
      className={`transform-gpu will-change-transform ${className}`}
      style={{ perspective: '1000px' }}
    >
      {children}
      
      {/* Efecto de onda al hacer clic */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-lg pointer-events-none"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
    </motion.div>
  );
};

// Hook para micro-interacciones globales
export const useMicroInteractions = () => {
  const { realTimeMetrics } = useAdvancedNeuralSystem();
  
  const getOptimalIntensity = () => {
    const cognitiveLoad = realTimeMetrics.neural_coherence;
    const engagement = realTimeMetrics.real_time_engagement;
    
    if (cognitiveLoad < 40) return 'subtle';
    if (engagement > 80) return 'dramatic';
    return 'moderate';
  };

  return {
    optimalIntensity: getOptimalIntensity(),
    shouldReduceMotion: realTimeMetrics.neural_coherence < 30,
    enhanceForEngagement: realTimeMetrics.real_time_engagement < 50
  };
};
