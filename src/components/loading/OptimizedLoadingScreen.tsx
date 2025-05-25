
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, Zap } from 'lucide-react';

interface OptimizedLoadingScreenProps {
  onComplete: () => void;
  maxLoadTime?: number;
}

export const OptimizedLoadingScreen: React.FC<OptimizedLoadingScreenProps> = ({ 
  onComplete,
  maxLoadTime = 2000 
}) => {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('Inicializando...');

  useEffect(() => {
    const steps = [
      { text: 'Inicializando sistemas...', duration: 200 },
      { text: 'Cargando contexto neural...', duration: 300 },
      { text: 'Activando interfaz...', duration: 500 },
      { text: 'Sistema listo', duration: 200 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const advanceStep = () => {
      if (currentStep < steps.length) {
        setStep(steps[currentStep].text);
        
        const stepProgress = 100 / steps.length;
        const targetProgress = (currentStep + 1) * stepProgress;
        
        // Animar progreso
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
          }
        }, 20);

        setTimeout(() => {
          clearInterval(progressInterval);
          currentStep++;
          
          if (currentStep >= steps.length) {
            setProgress(100);
            setTimeout(onComplete, 300);
          } else {
            advanceStep();
          }
        }, steps[currentStep].duration);
      }
    };

    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      console.log('⚠️ Timeout de seguridad activado, forzando carga');
      setProgress(100);
      onComplete();
    }, maxLoadTime);

    advanceStep();

    return () => clearTimeout(safetyTimeout);
  }, [onComplete, maxLoadTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        className="text-center text-white space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Neural Loading Animation */}
        <div className="relative">
          <motion.div
            className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Brain className="w-8 h-8 text-cyan-400" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Centro de Comando Neural
          </motion.h1>
          
          <div className="flex items-center justify-center space-x-2 text-cyan-300">
            <Zap className="w-4 h-4" />
            <span className="text-sm">{step}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-xs text-cyan-300 mt-2">{Math.round(progress)}%</div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2 text-xs text-cyan-200">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Sistema cardiovascular activado</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Anti-tracking configurado</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span>Conexión establecida</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
