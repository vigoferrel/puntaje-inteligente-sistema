import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Brain, Trophy, BarChart3 } from 'lucide-react';

interface SimpleOnboardingSystemProps {
  userId: string;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: '¡Bienvenido al Sistema PAES!',
    description: 'Descubre una plataforma revolucionaria que combina IA avanzada con metodologías educativas probadas para maximizar tu preparación para la PAES.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 2,
    title: 'Diagnóstico Inteligente',
    description: 'Nuestro sistema de IA analiza tu progreso en tiempo real y adapta el contenido a tus necesidades específicas.',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: 'Gamificación Avanzada',
    description: 'Convierte tu estudio en una experiencia divertida con logros, rankings y recompensas personalizadas.',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 4,
    title: 'Analytics Predictivos',
    description: 'Visualiza tu progreso con métricas avanzadas y predicciones de rendimiento basadas en IA.',
    icon: BarChart3,
    color: 'from-green-500 to-teal-500'
  }
];

const SimpleOnboardingSystem: React.FC<SimpleOnboardingSystemProps> = ({ userId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(`onboarding-completed-${userId}`);
    
    if (!hasCompleted) {
      // Mostrar onboarding después de un delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
    }
  }, [userId]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem(`onboarding-completed-${userId}`, 'true');
    setIsCompleted(true);
    setIsVisible(false);
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  if (isCompleted || !isVisible) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="modal-content w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative">
              <div className={`h-32 bg-gradient-to-r ${currentStepData.color} flex items-center justify-center`}>
                <div className="p-4 bg-white/20 rounded-full">
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <button
                onClick={skipOnboarding}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    Paso {currentStep + 1} de {onboardingSteps.length}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                    className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <span>
                    {currentStep === onboardingSteps.length - 1 ? 'Comenzar' : 'Siguiente'}
                  </span>
                  {currentStep === onboardingSteps.length - 1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimpleOnboardingSystem;
