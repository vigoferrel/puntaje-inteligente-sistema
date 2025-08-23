/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Heart, Zap, Brain, Target } from 'lucide-react';
import './EmotionalFeedbackSystem.css';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

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
  const [feedbackLevel, setFeedbackLevel] = useState(0);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    // Calcular nivel de feedback basado en actividad neural
    const level = Math.min(100, neuralActivity + Math.random() * 20);
    setFeedbackLevel(level);
    setPulseIntensity(level / 100);
  }, [neuralActivity, emotionalState]);

  const getEmotionalIcon = () => {
    switch (emotionalState) {
      case 'focused': return Target;
      case 'excited': return Zap;
      case 'calm': return Heart;
      case 'motivated': return Brain;
      default: return Brain;
    }
  };

  const EmotionalIcon = getEmotionalIcon();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="emotional-feedback-container"
    >
      {/* Indicador emocional principal */}
      <motion.div
        className="emotional-indicator"
        animate={{
          scale: [1, 1 + pulseIntensity * 0.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="emotional-icon-container"
          data-state={emotionalState}
        >
          <EmotionalIcon 
            className="emotional-icon" 
            data-state={emotionalState}
          />
        </div>

        {/* Anillos de pulso */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="pulse-ring"
            data-state={emotionalState}
            animate={{
              scale: [1, 2, 3],
              opacity: [0.6, 0.3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Barra de intensidad emocional */}
      <motion.div
        className="intensity-bar"
        initial={{ height: 0 }}
        animate={{ height: 96 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="intensity-fill"
          data-state={emotionalState}
          animate={{
            height: `${feedbackLevel}%`
          }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>

      {/* Etiqueta de estado */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="state-label"
      >
        <div className="state-text">
          {emotionalState.toUpperCase()}
        </div>
        <div className="percentage-text" data-state={emotionalState}>
          {feedbackLevel.toFixed(0)}%
        </div>
      </motion.div>

      {/* PartÃ­culas emocionales */}
      <div className="particles-container">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            data-state={emotionalState}
            animate={{
              x: [0, Math.cos((i * 45) * Math.PI / 180) * 40],
              y: [0, Math.sin((i * 45) * Math.PI / 180) * 40],
              opacity: [0.8, 0.2, 0.8],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Feedback contextual */}
      <motion.div
        className="contextual-feedback"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="feedback-title">
          Estado Emocional Ã“ptimo
        </div>
        <div className="feedback-description">
          Tu estado "{emotionalState}" es ideal para el mÃ³dulo {currentModule}. 
          MantÃ©n este nivel de concentraciÃ³n.
        </div>
        <div className="neural-sync-container">
          <div className="neural-sync-indicator" data-state={emotionalState}></div>
          <span className="neural-sync-text" data-state={emotionalState}>
            SincronizaciÃ³n Neural: {neuralActivity.toFixed(1)}%
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};


