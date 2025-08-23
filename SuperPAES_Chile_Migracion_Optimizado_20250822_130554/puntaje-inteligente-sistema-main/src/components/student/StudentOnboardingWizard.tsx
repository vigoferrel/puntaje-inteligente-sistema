// ??????? WIZARD DE ONBOARDING CENTRADO EN EL ESTUDIANTE ???????
// Creado por ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuralOrchestrator } from '../../hooks/useNeuralOrchestrator';
import { useBloom } from '../../hooks/useBloom';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  question: string;
  options: OnboardingOption[];
  icon: string;
  color: string;
}

interface OnboardingOption {
  id: string;
  text: string;
  value: string;
  description: string;
  emoji: string;
}

interface StudentProfile {
  name: string;
  learningStyle: 'visual' | 'auditivo' | 'kinestesico' | 'lectura';
  pace: 'lento' | 'normal' | 'rapido';
  motivation: 'alta' | 'media' | 'baja';
  interests: string[];
  goals: string[];
  preferredTime: string;
  confidence: number;
}

const StudentOnboardingWizard: React.FC<{ onComplete: (profile: StudentProfile) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const { createStudentProfile } = useNeuralOrchestrator();
  const { generateAIFeedback } = useBloom();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '¡Hola! ??',
      subtitle: 'Soy tu asistente personal de aprendizaje',
      question: '¿Cómo te gusta que te llamen?',
      options: [],
      icon: '??',
      color: '#FF6B6B'
    },
    {
      id: 'learning_style',
      title: '?? Descubramos tu estilo',
      subtitle: 'Cada persona aprende de manera única',
      question: '¿Cómo prefieres aprender cosas nuevas?',
      options: [
        {
          id: 'visual',
          text: 'Viendo imágenes y diagramas',
          value: 'visual',
          description: 'Me gusta ver gráficos, colores y esquemas',
          emoji: '???'
        },
        {
          id: 'auditivo',
          text: 'Escuchando explicaciones',
          value: 'auditivo',
          description: 'Aprendo mejor cuando me explican hablando',
          emoji: '??'
        },
        {
          id: 'kinestesico',
          text: 'Haciendo y practicando',
          value: 'kinestesico',
          description: 'Necesito tocar y experimentar para entender',
          emoji: '?'
        },
        {
          id: 'lectura',
          text: 'Leyendo y escribiendo',
          value: 'lectura',
          description: 'Me gusta leer textos y tomar notas',
          emoji: '??'
        }
      ],
      icon: '??',
      color: '#4ECDC4'
    },
    {
      id: 'pace',
      title: '? Tu ritmo perfecto',
      subtitle: 'No hay prisa, cada uno tiene su tiempo',
      question: '¿A qué velocidad te gusta aprender?',
      options: [
        {
          id: 'lento',
          text: 'Paso a paso, sin prisa',
          value: 'lento',
          description: 'Prefiero tomarme mi tiempo para entender bien',
          emoji: '??'
        },
        {
          id: 'normal',
          text: 'A ritmo normal',
          value: 'normal',
          description: 'Un ritmo equilibrado me funciona bien',
          emoji: '??'
        },
        {
          id: 'rapido',
          text: 'Me gusta ir rápido',
          value: 'rapido',
          description: 'Aprendo rápido y me gustan los desafíos',
          emoji: '??'
        }
      ],
      icon: '?',
      color: '#45B7D1'
    },
    {
      id: 'motivation',
      title: '?? Tu motivación',
      subtitle: 'Entender qué te impulsa nos ayuda a apoyarte mejor',
      question: '¿Cómo te sientes sobre aprender cosas nuevas?',
      options: [
        {
          id: 'alta',
          text: '¡Me encanta aprender!',
          value: 'alta',
          description: 'Siempre estoy emocionado por aprender algo nuevo',
          emoji: '??'
        },
        {
          id: 'media',
          text: 'Me gusta, pero a veces me cuesta',
          value: 'media',
          description: 'Depende del tema y cómo me sienta ese día',
          emoji: '??'
        },
        {
          id: 'baja',
          text: 'A veces me resulta difícil motivarme',
          value: 'baja',
          description: 'Necesito ayuda extra para mantenerme motivado',
          emoji: '??'
        }
      ],
      icon: '??',
      color: '#96CEB4'
    },
    {
      id: 'interests',
      title: '?? Tus intereses',
      subtitle: 'Conocer lo que te gusta nos ayuda a personalizar tu experiencia',
      question: '¿Qué temas te interesan más?',
      options: [
        { id: 'matematica', text: 'Matemática', value: 'matematica', description: 'Números, problemas, lógica', emoji: '??' },
        { id: 'lectura', text: 'Lectura', value: 'lectura', description: 'Historias, comprensión, escritura', emoji: '??' },
        { id: 'historia', text: 'Historia', value: 'historia', description: 'Pasado, culturas, eventos', emoji: '???' },
        { id: 'ciencias', text: 'Ciencias', value: 'ciencias', description: 'Experimentos, naturaleza, descubrimientos', emoji: '??' }
      ],
      icon: '??',
      color: '#FFEAA7'
    },
    {
      id: 'confidence',
      title: '?? Tu confianza',
      subtitle: 'Todos empezamos desde algún lugar',
      question: '¿Cómo te sientes sobre tus habilidades de estudio?',
      options: [
        {
          id: 'high',
          text: 'Me siento muy seguro',
          value: '90',
          description: 'Confío en mis habilidades para aprender',
          emoji: '??'
        },
        {
          id: 'medium',
          text: 'Tengo confianza moderada',
          value: '70',
          description: 'A veces me siento seguro, a veces no',
          emoji: '??'
        },
        {
          id: 'low',
          text: 'Necesito ganar más confianza',
          value: '50',
          description: 'Me gustaría sentirme más seguro estudiando',
          emoji: '??'
        }
      ],
      icon: '??',
      color: '#DDA0DD'
    }
  ];

  const [nameInput, setNameInput] = useState('');

  const handleOptionSelect = (value: string) => {
    const step = steps[currentStep];
    
    if (step.id === 'interests') {
      // Permitir múltiples selecciones para intereses
      const currentInterests = profile.interests || [];
      const newInterests = currentInterests.includes(value)
        ? currentInterests.filter(i => i !== value)
        : [...currentInterests, value];
      
      setProfile(prev => ({ ...prev, interests: newInterests }));
      return;
    }

    // Para otros pasos, una sola selección
    setProfile(prev => ({ 
      ...prev, 
      [step.id]: step.id === 'confidence' ? parseInt(value) : value 
    }));
    
    // Avanzar automáticamente después de 1 segundo
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        completeOnboarding();
      }
    }, 1000);
  };

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      setProfile(prev => ({ ...prev, name: nameInput.trim() }));
      setCurrentStep(1);
    }
  };

  const completeOnboarding = async () => {
    setIsCompleting(true);
    
    try {
      // Generar feedback motivacional personalizado
      const welcomeMessage = await generateAIFeedback(
        'L1',
        'matematica',
        85,
        15,
        []
      );

      const completeProfile: StudentProfile = {
        name: profile.name || 'Estudiante',
        learningStyle: profile.learningStyle || 'visual',
        pace: profile.pace || 'normal',
        motivation: profile.motivation || 'media',
        interests: profile.interests || ['matematica'],
        goals: ['Mejorar mis habilidades', 'Aprender de manera divertida'],
        preferredTime: 'tarde',
        confidence: profile.confidence || 70
      };

      // Mostrar mensaje de bienvenida personalizado
      setTimeout(() => {
        onComplete(completeProfile);
      }, 2000);

    } catch (error) {
      console.error('Error completando onboarding:', error);
      // Continuar con perfil básico
      onComplete({
        name: profile.name || 'Estudiante',
        learningStyle: profile.learningStyle || 'visual',
        pace: profile.pace || 'normal',
        motivation: profile.motivation || 'media',
        interests: profile.interests || ['matematica'],
        goals: ['Mejorar mis habilidades'],
        preferredTime: 'tarde',
        confidence: profile.confidence || 70
      });
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200 text-sm">Paso {currentStep + 1} de {steps.length}</span>
            <span className="text-purple-200 text-sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-purple-800/30 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isCompleting ? (
            <motion.div
              key="completing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4"
              >
                ??
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Creando tu experiencia personalizada!
              </h2>
              <p className="text-purple-200 text-lg">
                Tus 5 agentes de IA están configurando todo especialmente para ti...
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                {['??', '??', '??', '??', '??'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, delay: index * 0.2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{currentStepData.icon}</div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentStepData.title}
                </h1>
                <p className="text-purple-200 text-lg">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white text-center mb-6">
                  {currentStepData.question}
                </h2>

                {/* Name Input */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Escribe tu nombre aquí..."
                      className="w-full px-6 py-4 bg-white/20 border border-purple-300/30 rounded-xl text-white text-lg placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNameSubmit}
                      disabled={!nameInput.trim()}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      ¡Continuar! ??
                    </motion.button>
                  </div>
                )}

                {/* Options */}
                {currentStep > 0 && (
                  <div className="space-y-4">
                    {currentStepData.options.map((option) => {
                      const isSelected = currentStep === 4 
                        ? profile.interests?.includes(option.value)
                        : profile[currentStepData.id as keyof typeof profile] === option.value;

                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleOptionSelect(option.value)}
                          className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500/30 shadow-lg'
                              : 'border-purple-300/30 bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">{option.emoji}</div>
                            <div className="flex-1">
                              <div className="text-white font-semibold text-lg mb-1">
                                {option.text}
                              </div>
                              <div className="text-purple-200 text-sm">
                                {option.description}
                              </div>
                            </div>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-2xl"
                              >
                                ?
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* Continue button for interests */}
                    {currentStep === 4 && profile.interests && profile.interests.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 mt-6"
                      >
                        ¡Perfecto! Continuar ??
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default StudentOnboardingWizard;
