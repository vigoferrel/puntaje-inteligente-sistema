
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralCommandCenter } from './NeuralCommandCenter';
import { HolographicDataFlow } from './HolographicDataFlow';
import { ImmersiveNavigationSystem } from './ImmersiveNavigationSystem';
import { ContextualAIAssistant } from './ContextualAIAssistant';
import { EmotionalFeedbackSystem } from './EmotionalFeedbackSystem';

interface CinematicInterfaceMasterProps {
  children: React.ReactNode;
  currentModule: string;
  userProgress: any;
  onModuleChange: (module: string) => void;
}

export const CinematicInterfaceMaster: React.FC<CinematicInterfaceMasterProps> = ({
  children,
  currentModule,
  userProgress,
  onModuleChange
}) => {
  const [cinematicMode, setCinematicMode] = useState(true);
  const [emotionalState, setEmotionalState] = useState('focused');
  const [neuralActivity, setNeuralActivity] = useState(75);

  useEffect(() => {
    // Simular actividad neuronal basada en interacciones
    const interval = setInterval(() => {
      const baseActivity = 60 + Math.sin(Date.now() / 3000) * 20;
      const randomVariation = Math.random() * 10 - 5;
      setNeuralActivity(Math.max(0, Math.min(100, baseActivity + randomVariation)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const cinematicVariants = {
    enter: {
      opacity: 0,
      scale: 0.95,
      rotateX: -5,
      filter: 'blur(10px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    center: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      rotateX: 5,
      filter: 'blur(10px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="cinematic-master-container min-h-screen relative overflow-hidden">
      {/* Cinema Background System */}
      <div className="cinema-background fixed inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)',
              'radial-gradient(ellipse at bottom, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
              'radial-gradient(ellipse at left, #164e63 0%, #0f172a 50%, #020617 100%)',
              'radial-gradient(ellipse at right, #581c87 0%, #0f172a 50%, #020617 100%)',
              'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)'
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Neural Grid */}
        <div className="neural-grid absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-cyan-400/20"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  borderColor: [
                    'rgba(6, 182, 212, 0.1)',
                    'rgba(139, 92, 246, 0.2)',
                    'rgba(6, 182, 212, 0.1)'
                  ]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        </div>

        {/* Atmospheric Particles */}
        <div className="atmospheric-particles absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.5, 0.5],
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
      </div>

      {/* Neural Command Center - Always visible */}
      <NeuralCommandCenter
        neuralActivity={neuralActivity}
        emotionalState={emotionalState}
        currentModule={currentModule}
        onModuleChange={onModuleChange}
      />

      {/* Holographic Data Flow */}
      <HolographicDataFlow
        currentModule={currentModule}
        userProgress={userProgress}
        neuralActivity={neuralActivity}
      />

      {/* Immersive Navigation */}
      <ImmersiveNavigationSystem
        currentModule={currentModule}
        onNavigate={onModuleChange}
        cinematicMode={cinematicMode}
      />

      {/* Main Content Area */}
      <motion.div
        className="cinematic-content-wrapper relative z-20 min-h-screen"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            variants={cinematicVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="cinematic-content-container"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Contextual AI Assistant */}
      <ContextualAIAssistant
        currentModule={currentModule}
        emotionalState={emotionalState}
        onEmotionalStateChange={setEmotionalState}
      />

      {/* Emotional Feedback System */}
      <EmotionalFeedbackSystem
        emotionalState={emotionalState}
        neuralActivity={neuralActivity}
        currentModule={currentModule}
      />

      {/* Cinema Mode Toggle */}
      <motion.button
        onClick={() => setCinematicMode(!cinematicMode)}
        className="fixed top-4 right-4 z-50 bg-black/40 backdrop-blur-md border border-white/20 rounded-full p-3 text-white hover:bg-white/10 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {cinematicMode ? '🎬' : '📱'}
      </motion.button>

      {/* Cinema CSS Styles */}
      <style jsx>{`
        .cinematic-master-container {
          --cinema-primary: #0ea5e9;
          --cinema-secondary: #8b5cf6;
          --cinema-accent: #06b6d4;
          --cinema-bg: #020617;
          --cinema-glass: rgba(255, 255, 255, 0.1);
          --cinema-blur: 16px;
        }

        .cinema-background {
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #020617 0%, #0f172a 100%);
        }

        .cinematic-content-wrapper {
          backdrop-filter: blur(1px);
        }

        .cinematic-content-container {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .neural-grid {
          mask: radial-gradient(ellipse at center, black 30%, transparent 70%);
        }
      `}</style>
    </div>
  );
};
