/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Zap } from 'lucide-react';

interface OptimizedLoadingScreenProps {
  onComplete: () => void;
  maxLoadTime?: number;
}

export const OptimizedLoadingScreen: React.FC<OptimizedLoadingScreenProps> = ({ 
  onComplete,
  maxLoadTime = 500 // âœ… REDUCIDO A 500MS MÃXIMO
}) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('Cargando...');

  useEffect(() => {
    // âœ… CARGA INMEDIATA Y SIMPLE
    const steps = [
      { text: 'Inicializando...', duration: 100 },
      { text: 'Preparando dashboard...', duration: 200 },
      { text: 'Listo', duration: 100 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const advanceStep = () => {
      if (currentStep < steps.length) {
        setStep(steps[currentStep].text);
        
        const stepProgress = 100 / steps.length;
        const targetProgress = (currentStep + 1) * stepProgress;
        
        // âœ… PROGRESO RÃPIDO
        const progressInterval = setInterval(() => {
          currentProgress += 10; // MÃ¡s rÃ¡pido
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
          }
        }, 10);

        setTimeout(() => {
          clearInterval(progressInterval);
          currentStep++;
          
          if (currentStep >= steps.length) {
            setProgress(100);
            setTimeout(onComplete, 100); // âœ… COMPLETAR RÃPIDO
          } else {
            advanceStep();
          }
        }, steps[currentStep].duration);
      }
    };

    // âœ… TIMEOUT DE SEGURIDAD MUY CORTO
    const safetyTimeout = setTimeout(() => {
      console.log('âš¡ Carga inmediata activada');
      setProgress(100);
      onComplete();
    }, maxLoadTime);

    advanceStep();

    return () => clearTimeout(safetyTimeout);
  }, [onComplete, maxLoadTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        className="text-center text-white space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* âœ… ANIMACIÃ“N SIMPLE Y RÃPIDA */}
        <div className="relative">
          <motion.div
            className="w-20 h-20 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Brain className="w-6 h-6 text-cyan-400" />
          </motion.div>
        </div>

        {/* âœ… TEXTO SIMPLE */}
        <div className="space-y-3">
          <motion.h1
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            PAES Command
          </motion.h1>
          
          <div className="flex items-center justify-center space-x-2 text-cyan-300">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{step}</span>
          </div>
        </div>

        {/* âœ… BARRA DE PROGRESO SIMPLE */}
        <div className="w-48 mx-auto">
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="text-xs text-cyan-300 mt-2">{Math.round(progress)}%</div>
        </div>

        {/* âœ… INDICADORES MÃNIMOS */}
        <div className="space-y-1 text-xs text-cyan-200">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Sistema activo</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

