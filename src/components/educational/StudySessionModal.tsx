import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Brain,
  Target,
  Zap
} from 'lucide-react';

interface StudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  bloomLevel: string;
  onStartSession: () => void;
  onEndSession: () => void;
  isSessionActive: boolean;
}

const StudySessionModal: React.FC<StudySessionModalProps> = ({
  isOpen,
  onClose,
  subject,
  bloomLevel,
  onStartSession,
  onEndSession,
  isSessionActive
}) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      'remember': 'bg-blue-500',
      'understand': 'bg-green-500',
      'apply': 'bg-purple-500',
      'analyze': 'bg-orange-500',
      'evaluate': 'bg-red-500',
      'create': 'bg-indigo-500'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500';
  };

  const handleStartSession = () => {
    onStartSession();
    setSessionTime(0);
    setIsPaused(false);
  };

  const handleEndSession = () => {
    onEndSession();
    setSessionTime(0);
    setIsPaused(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${getBloomLevelColor(bloomLevel)} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sesión de Estudio</h2>
                  <p className="text-sm text-gray-600">{subject}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Nivel Bloom */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Nivel de Aprendizaje</span>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getBloomLevelColor(bloomLevel)}`}>
                {getBloomLevelName(bloomLevel)}
              </div>
            </div>

            {/* Timer */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Tiempo de Sesión</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 font-mono">
                  {formatTime(sessionTime)}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-3">
              {!isSessionActive ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartSession}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-md"
                >
                  <Play className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </motion.button>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-md"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEndSession}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 shadow-md"
                  >
                    <Square className="w-5 h-5" />
                    <span>Finalizar Sesión</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Consejos */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Consejo de Estudio</h4>
                  <p className="text-xs text-blue-700">
                    {bloomLevel === 'remember' && 'Enfócate en memorizar conceptos clave y definiciones importantes.'}
                    {bloomLevel === 'understand' && 'Asegúrate de comprender el significado y las relaciones entre conceptos.'}
                    {bloomLevel === 'apply' && 'Practica aplicando el conocimiento en situaciones nuevas y diferentes.'}
                    {bloomLevel === 'analyze' && 'Descompón la información en partes y analiza las relaciones entre ellas.'}
                    {bloomLevel === 'evaluate' && 'Evalúa la información y toma decisiones basadas en criterios establecidos.'}
                    {bloomLevel === 'create' && 'Genera nuevas ideas y crea contenido original basado en tu comprensión.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudySessionModal;
