
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Target, Brain } from 'lucide-react';

interface EmotionalFeedbackSystemProps {
  emotionalState: string;
  neuralActivity: number;
  currentModule: string;
}

export const EmotionalFeedbackSystem: React.FC<EmotionalFeedbackSystemProps> = ({
  emotionalState,
  neuralActivity,
  currentModule
}) => {
  const getEmotionalConfig = () => {
    switch (emotionalState) {
      case 'focused':
        return {
          color: '#06b6d4',
          gradient: 'from-cyan-400 to-blue-500',
          particles: 15,
          intensity: 0.8,
          icon: Target,
          label: 'Enfocado'
        };
      case 'excited':
        return {
          color: '#f59e0b',
          gradient: 'from-yellow-400 to-orange-500',
          particles: 25,
          intensity: 1.2,
          icon: Zap,
          label: 'Energizado'
        };
      case 'calm':
        return {
          color: '#10b981',
          gradient: 'from-green-400 to-emerald-500',
          particles: 8,
          intensity: 0.6,
          icon: Heart,
          label: 'Tranquilo'
        };
      case 'stressed':
        return {
          color: '#ef4444',
          gradient: 'from-red-400 to-pink-500',
          particles: 30,
          intensity: 1.5,
          icon: Brain,
          label: 'Estresado'
        };
      default:
        return {
          color: '#8b5cf6',
          gradient: 'from-purple-400 to-indigo-500',
          particles: 12,
          intensity: 1.0,
          icon: Brain,
          label: 'Neutral'
        };
    }
  };

  const config = getEmotionalConfig();

  return (
    <div className="emotional-feedback-system fixed inset-0 pointer-events-none z-5">
      {/* Ambient Emotional Glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse at 30% 30%, ${config.color}15 0%, transparent 50%)`,
            `radial-gradient(ellipse at 70% 70%, ${config.color}20 0%, transparent 50%)`,
            `radial-gradient(ellipse at 50% 50%, ${config.color}15 0%, transparent 50%)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Emotional Particles */}
      <div className="emotional-particles absolute inset-0">
        {Array.from({ length: config.particles }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: config.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: `blur(${Math.random() * 2}px)`
            }}
            animate={{
              opacity: [0, 0.6 * config.intensity, 0],
              scale: [0.5, 1.5 * config.intensity, 0.5],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Emotional State Indicator */}
      <motion.div
        className="emotional-indicator fixed top-1/2 left-4 transform -translate-y-1/2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/20 p-3">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <config.icon className="w-4 h-4 text-white" />
            </motion.div>
            
            <div>
              <div className="text-white font-medium text-sm">{config.label}</div>
              <div className="text-white/60 text-xs">Estado Emocional</div>
            </div>
          </div>

          {/* Emotional Intensity Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/70 text-xs">Intensidad:</span>
              <span className="text-white text-xs font-medium">
                {Math.round(config.intensity * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${config.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${config.intensity * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Emotional Pulse */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2"
          style={{ borderColor: config.color }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Neural-Emotional Synchronization */}
      <div className="neural-emotional-sync absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
          animate={{
            borderColor: config.color,
            boxShadow: `0 0 20px ${config.color}40`
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="text-white/80 text-xs">
              Sincronización Neural-Emocional:
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 rounded-full"
                  style={{ backgroundColor: config.color }}
                  animate={{
                    height: [16, 8 + (neuralActivity / 100) * 16, 16],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
            <div 
              className="text-xs font-medium"
              style={{ color: config.color }}
            >
              {Math.round((neuralActivity + config.intensity * 50) / 1.5)}%
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contextual Emotional Effects */}
      {emotionalState === 'focused' && (
        <div className="focus-rings absolute inset-0">
          {[200, 400, 600].map((size, i) => (
            <motion.div
              key={size}
              className="absolute border border-cyan-400/20 rounded-full"
              style={{
                width: size,
                height: size,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
