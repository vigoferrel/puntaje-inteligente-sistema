import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Play,
  Square,
  Lightbulb,
  Music,
  Settings,
  AlertCircle,
  RefreshCw,
  Award,
  Zap,
  BookMarked,
  GraduationCap,
  Heart,
  Sparkles
} from 'lucide-react';
import { useEducationalPAES, PAESSubject } from '@/hooks/use-educational-paes';
import { useNotifications } from '@/hooks/use-notifications';
import StudySessionModal from './StudySessionModal';
import NotificationToast from '../ui/NotificationToast';
import ErrorBoundary from '../ui/ErrorBoundary';
import NetworkStatusIndicator from '../ui/NetworkStatusIndicator';

const PAESEducationalDashboardContent: React.FC = () => {
  const {
    subjects,
    currentSession,
    userProgress,
    userPreferences,
    isLoading,
    error,
    startStudySession,
    endStudySession,
    retryProgress,
    retryPreferences,
    BLOOM_LEVELS,
    networkStatus,
    isOffline,
    connectionQuality,
    lastSync,
    isDataStale
  } = useEducationalPAES();

  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [modalSubject, setModalSubject] = useState<PAESSubject | null>(null);
  const [modalBloomLevel, setModalBloomLevel] = useState<string>('');
  
  const { notification, showSuccess, showError, hideNotification } = useNotifications();

  // Ocultar mensaje de bienvenida después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Cargando Sistema Educativo PAES</h2>
          <p className="text-white/70">Preparando tu experiencia de aprendizaje...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-purple-400 rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-indigo-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30"
          >
            <AlertCircle className="w-10 h-10 text-red-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-red-300 mb-3">Error en el Sistema Educativo</h2>
          <p className="text-red-200 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => {
                retryProgress();
                retryPreferences();
              }}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reintentar</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-lg transition-colors backdrop-blur-sm"
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleStartSession = async (subject: PAESSubject, bloomLevel: string) => {
    setModalSubject(subject);
    setModalBloomLevel(bloomLevel);
    setShowSessionModal(true);
  };

  const handleModalStartSession = async () => {
    if (!modalSubject) return;
    
    setIsStartingSession(true);
    setSessionError(null);
    
    try {
      const session = await startStudySession(modalSubject.id, modalBloomLevel as any);
      if (session) {
        showSuccess(
          'Sesión Iniciada',
          `Has comenzado a estudiar ${modalSubject.name} en nivel ${getBloomLevelName(modalBloomLevel)}`
        );
      }
    } catch (err) {
      setSessionError('Error al iniciar sesión de estudio. Por favor, intenta nuevamente.');
      showError('Error', 'No se pudo iniciar la sesión de estudio');
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleEndSession = async () => {
    try {
      await endStudySession();
    } catch (err) {
      setSessionError('Error al finalizar la sesión.');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (progress >= 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    if (progress >= 40) return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getBloomLevelName = (level: string) => {
    const names = {
      'remember': 'Recordar',
      'understand': 'Comprender',
      'apply': 'Aplicar',
      'analyze': 'Analizar',
      'evaluate': 'Evaluar',
      'create': 'Crear'
    };
    return names[level as keyof typeof names] || level;
  };

  const getBloomLevelColor = (level: string) => {
    const colors = {
      'remember': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'understand': 'bg-green-100 text-green-700 hover:bg-green-200',
      'apply': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'analyze': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'evaluate': 'bg-red-100 text-red-700 hover:bg-red-200',
      'create': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const averageProgress = userProgress.length > 0 
    ? Math.round(userProgress.reduce((acc, p) => acc + p.progress, 0) / userProgress.length)
    : 0;

  const totalExercises = userProgress.reduce((acc, p) => acc + p.totalExercises, 0);
  const activeSubjects = userProgress.filter(p => p.progress > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Mensaje de bienvenida */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">¡Bienvenido al Sistema Educativo PAES!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header mejorado */}
      <div className="bg-black/20 backdrop-blur-xl shadow-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white">
                    Sistema Educativo PAES
                  </h1>
                  <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                    <span className="text-emerald-400 text-sm font-medium">Excelente</span>
                  </div>
                  <NetworkStatusIndicator
                    isOnline={networkStatus.isOnline}
                    isSupabaseAvailable={networkStatus.isSupabaseAvailable}
                    connectionQuality={connectionQuality}
                    lastSync={lastSync}
                    isDataStale={isDataStale}
                    compact={true}
                  />
                </div>
                <p className="text-sm text-white/70 mt-1">Preparación integral para la Prueba de Acceso a la Educación Superior</p>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {currentSession && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-4"
                >
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-lg border border-blue-500/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">
                        Sesión activa: {currentSession.subject}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleEndSession}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                  >
                    <Square className="w-4 h-4" />
                    <span>Finalizar</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Error de sesión */}
      <AnimatePresence>
        {sessionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{sessionError}</span>
              <button 
                onClick={() => setSessionError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Indicador de estado de red */}
        <AnimatePresence>
          {(isOffline || connectionQuality === 'poor' || isDataStale) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <NetworkStatusIndicator
                isOnline={networkStatus.isOnline}
                isSupabaseAvailable={networkStatus.isSupabaseAvailable}
                connectionQuality={connectionQuality}
                lastSync={lastSync}
                isDataStale={isDataStale}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Estadísticas principales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-blue-400" />
            Resumen de Progreso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Promedio General</p>
                  <p className="text-2xl font-bold text-white">{averageProgress}%</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Ejercicios Completados</p>
                  <p className="text-2xl font-bold text-white">{totalExercises}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Asignaturas Activas</p>
                  <p className="text-2xl font-bold text-white">{activeSubjects}</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Tiempo de Estudio</p>
                  <p className="text-2xl font-bold text-white">
                    {currentSession ? 'En curso' : '0 min'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Asignaturas PAES */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-blue-400" />
            Asignaturas PAES Oficiales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => {
              const progress = userProgress.find(p => p.subject === subject.id);
              const progressValue = progress?.progress || 0;
              
              return (
                                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">{subject.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getProgressColor(progressValue)}`}>
                        {progressValue}%
                      </div>
                    </div>

                    {/* Barra de progreso mejorada */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-white/60 mb-2">
                        <span>Progreso</span>
                        <span className="font-medium text-white">{progressValue}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressValue}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Niveles Bloom mejorados */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white/80 mb-3">Niveles de Aprendizaje (Bloom)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {BLOOM_LEVELS.map((level) => (
                          <button
                            key={level}
                            onClick={() => handleStartSession(subject, level)}
                            disabled={isStartingSession}
                            className={`text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 bg-white/10 hover:bg-white/20 text-white border border-white/20`}
                          >
                            {getBloomLevelName(level)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botón de inicio rápido mejorado */}
                    <button
                      onClick={() => handleStartSession(subject, 'remember')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      <span>Iniciar Estudio</span>
                    </button>
                  </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recomendaciones mejoradas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 mr-3 text-amber-400" />
            Recomendaciones Personalizadas
          </h2>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                  Áreas de Mejora
                </h3>
                <div className="space-y-3">
                  {userProgress
                    .filter(p => p.progress < 60)
                    .slice(0, 3)
                    .map((progress) => {
                      const subject = subjects.find(s => s.id === progress.subject);
                      return (
                        <motion.div 
                          key={progress.subject}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/30 backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                              <BookMarked className="w-4 h-4 text-red-400" />
                            </div>
                            <span className="font-medium text-red-300">{subject?.name}</span>
                          </div>
                          <span className="text-sm font-bold text-red-400">{progress.progress}%</span>
                        </motion.div>
                      );
                    })}
                  {userProgress.filter(p => p.progress < 60).length === 0 && (
                    <div className="text-center py-6">
                      <Award className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <p className="text-emerald-300 font-medium">¡Excelente! Todas las áreas están bien desarrolladas.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  Próximos Pasos
                </h3>
                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-400">1</span>
                    </div>
                    <span className="text-blue-300 font-medium">Completa ejercicios de nivel "Aplicar"</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald-400">2</span>
                    </div>
                    <span className="text-emerald-300 font-medium">Practica análisis de textos complejos</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30 backdrop-blur-sm"
                  >
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-400">3</span>
                    </div>
                    <span className="text-purple-300 font-medium">Revisa conceptos de ciencias básicas</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Configuración mejorada */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3 text-white/70" />
            Configuración de Estudio
          </h2>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  Preferencias
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-white/80 font-medium">Dificultad</span>
                    <span className="text-white font-bold">
                      {userPreferences?.difficulty === 'auto' ? 'Automática' : userPreferences?.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-white/80 font-medium">Tiempo de sesión</span>
                    <span className="text-white font-bold">
                      {userPreferences?.studyTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/20">
                    <span className="text-white/80 font-medium">Música de estudio</span>
                    <div className="flex items-center space-x-2">
                      <Music className={`w-5 h-5 ${userPreferences?.musicEnabled ? 'text-emerald-400' : 'text-white/40'}`} />
                      <span className="text-white font-bold">
                        {userPreferences?.musicEnabled ? 'Activada' : 'Desactivada'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Objetivos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Completar todas las asignaturas</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Alcanzar 80% en cada área</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Dominar niveles superiores de Bloom</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Continuar última sesión
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Ejercicios recomendados
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md"
                  >
                    Simulacro completo
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Sesión de Estudio */}
      <StudySessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        subject={modalSubject?.name || ''}
        bloomLevel={modalBloomLevel}
        onStartSession={handleModalStartSession}
        onEndSession={handleEndSession}
        isSessionActive={!!currentSession}
      />

      {/* Notificaciones */}
      <NotificationToast
        notification={notification}
        onClose={hideNotification}
      />
    </div>
  );
};

const PAESEducationalDashboard: React.FC = () => {
  return (
    <ErrorBoundary>
      <PAESEducationalDashboardContent />
    </ErrorBoundary>
  );
};

export default PAESEducationalDashboard;
