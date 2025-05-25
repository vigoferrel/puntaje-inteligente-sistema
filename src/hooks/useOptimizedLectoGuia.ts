
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedMessage {
  type: 'user' | 'assistant';
  content: string;
  source?: string;
  timestamp: Date;
}

interface OptimizedExercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  source: string;
  metadata: {
    costSaving?: number;
  };
}

interface OptimizationStats {
  quality: string;
  officialContentUsage?: number;
  aiUsage?: number;
  costSavings?: number;
}

export const useOptimizedLectoGuia = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<OptimizedMessage[]>([
    {
      type: 'assistant',
      content: '¡Hola! Soy tu asistente neural para PAES. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject] = useState('COMPETENCIA_LECTORA');
  const [currentExercise, setCurrentExercise] = useState<OptimizedExercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const optimizationStats: OptimizationStats = useMemo(() => ({
    quality: 'Excelente',
    officialContentUsage: 85.2,
    aiUsage: 14.8,
    costSavings: 12.45
  }), []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: OptimizedMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const assistantMessage: OptimizedMessage = {
        type: 'assistant',
        content: `Entiendo tu consulta sobre "${message}". Te ayudo con información específica para ${activeSubject}.`,
        source: 'Neural IA',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  }, [activeSubject]);

  const handleSubjectChange = useCallback((subject: string) => {
    console.log('Cambio de materia a:', subject);
  }, []);

  const generateOptimizedExercise = useCallback(async () => {
    setIsLoading(true);
    
    // Simular generación de ejercicio
    setTimeout(() => {
      const exercise: OptimizedExercise = {
        id: `exercise-${Date.now()}`,
        question: '¿Cuál es la idea principal del siguiente texto?',
        options: [
          'La importancia de la lectura comprensiva',
          'Las técnicas de estudio efectivas',
          'El desarrollo de habilidades críticas',
          'La aplicación práctica del conocimiento'
        ],
        correctAnswer: 'La importancia de la lectura comprensiva',
        explanation: 'La respuesta correcta se basa en el análisis del contexto y la estructura textual.',
        source: 'DEMRE Oficial',
        metadata: {
          costSaving: 0.034
        }
      };
      
      setCurrentExercise(exercise);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsLoading(false);
    }, 1000);
    
    return currentExercise;
  }, [currentExercise]);

  const handleOptionSelect = useCallback((option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
  }, []);

  const getStats = useCallback(() => ({
    exercisesCompleted: 12,
    averageScore: 87,
    streak: 5,
    todayStudyTime: 45
  }), []);

  return {
    messages,
    isTyping,
    activeSubject,
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading,
    optimizationStats,
    handleSendMessage,
    handleSubjectChange,
    generateOptimizedExercise,
    handleOptionSelect,
    getStats
  };
};
