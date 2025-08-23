// ??????? ECOSISTEMA CENTRADO EN EL ESTUDIANTE ???????
// Creado por ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentOnboardingWizard from './StudentOnboardingWizard';
import MotivationalSystem from './MotivationalSystem';
import StudentAssistant from './StudentAssistant';
import NeuralOrchestrationDashboard from '../neural/NeuralOrchestrationDashboard';
import BloomDashboard from '../bloom/BloomDashboard';
import { useNeuralOrchestrator } from '../../hooks/useNeuralOrchestrator';
import { useBloom } from '../../hooks/useBloom';

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

interface EcosystemView {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  component: React.ComponentType;
}

const StudentCenteredEcosystem: React.FC = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('bloom');
  const [showWelcome, setShowWelcome] = useState(false);
  
  const { updateProfile } = useNeuralOrchestrator();
  const { dashboard } = useBloom();

  // Verificar si el estudiante ya completó el onboarding
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setStudentProfile(profile);
        setIsOnboarded(true);
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  const views: EcosystemView[] = [
    {
      id: 'bloom',
      name: 'Mi Viaje Bloom',
      description: 'Explora los 6 universos cognitivos personalizados para ti',
      icon: '??',
      color: '#FF6B6B',
      component: BloomDashboard
    },
    {
      id: 'neural',
      name: 'Mis Agentes IA',
      description: 'Ve cómo tus 5 agentes personales trabajan para tu éxito',
      icon: '??',
      color: '#4ECDC4',
      component: NeuralOrchestrationDashboard
    }
  ];

  const handleOnboardingComplete = (profile: StudentProfile) => {
    setStudentProfile(profile);
    setIsOnboarded(true);
    setShowWelcome(true);
    
    // Guardar perfil en localStorage
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    
    // Actualizar perfil en el sistema neural
    updateProfile(profile);
    
    // Ocultar mensaje de bienvenida después de 5 segundos
    setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
  };

  const getPersonalizedGreeting = () => {
    if (!studentProfile) return '¡Bienvenido!';
    
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Buenos días';
    else if (hour < 18) timeGreeting = 'Buenas tardes';
    else timeGreeting = 'Buenas noches';
    
    return `${timeGreeting}, ${studentProfile.name}!`;
  };

  const getMotivationalMessage = () => {
    if (!studentProfile) return 'Tu viaje de aprendizaje está a punto de comenzar';
    
    const messages = {
      alta: '¡Tu energía para aprender es contagiosa! Hoy será un día increíble.',
      media: 'Cada paso que das te acerca más a tus metas. ¡Sigue adelante!',
      baja: 'Recuerda: los grandes logros empiezan con pequeños pasos. ¡Tú puedes!'
    };
    
    return messages[studentProfile.motivation];
  };

  const getCurrentViewComponent = () => {
    const view = views.find(v => v.id === currentView);
    if (!view) return null;
    
    const Component = view.component;
    return <Component />;
  };

  // Si no está onboarded, mostrar wizard
  if (!isOnboarded) {
    return <StudentOnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && studentProfile && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-200 max-w-md">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: 3 }}
                  className="text-4xl mb-3"
                >
                  ??
                </motion.div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  ¡Bienvenido, {studentProfile.name}!
                </h2>
                <p className="text-gray-600 text-sm">
                  Tu ecosistema de aprendizaje personalizado está listo. 
                  Tus 5 agentes IA ya están trabajando para optimizar tu experiencia.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative z-10 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {getPersonalizedGreeting()}
            </h1>
            <p className="text-xl text-purple-200 mb-6">
              {getMotivationalMessage()}
            </p>
            
            {/* Student Stats */}
            {dashboard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center space-x-6 text-white"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">{dashboard.total_points}</div>
                  <div className="text-sm text-purple-200">Puntos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{dashboard.achievements.length}</div>
                  <div className="text-sm text-purple-200">Logros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {dashboard.levels.filter(l => l.unlocked).length}
                  </div>
                  <div className="text-sm text-purple-200">Niveles</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 mb-6">
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 flex space-x-2">
            {views.map((view) => (
              <motion.button
                key={view.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(view.id)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  currentView === view.id
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{view.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{view.name}</div>
                    <div className="text-xs opacity-75">{view.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getCurrentViewComponent()}
        </motion.div>
      </AnimatePresence>

      {/* Student Profile Card */}
      {studentProfile && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-4 left-4 z-30"
        >
          <div className="bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-lg max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {studentProfile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{studentProfile.name}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {studentProfile.learningStyle} • {studentProfile.pace}
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-1">
              {studentProfile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Floating Action Button for Profile Reset */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          localStorage.removeItem('studentProfile');
          setIsOnboarded(false);
          setStudentProfile(null);
        }}
        className="fixed top-4 right-20 z-30 w-12 h-12 bg-gray-600/80 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center text-white hover:bg-gray-700/80 transition-colors"
        title="Reconfigurar perfil"
      >
        ??
      </motion.button>

      {/* Integrated Components */}
      <MotivationalSystem />
      <StudentAssistant />
    </div>
  );
};

export default StudentCenteredEcosystem;
