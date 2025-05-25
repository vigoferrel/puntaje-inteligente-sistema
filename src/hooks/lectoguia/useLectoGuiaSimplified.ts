
import { useState, useCallback } from 'react';
import { useUnifiedState } from '@/hooks/useUnifiedState';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ExerciseStats {
  exercisesCompleted: number;
  averageScore: number;
  streak: number;
}

export const useLectoGuiaSimplified = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'exercise' | 'overview'>('overview');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userProgress, updateUserProgress } = useUnifiedState();

  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simular respuesta del asistente
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `He recibido tu mensaje: "${message}". ¿En qué más puedo ayudarte con LectoGuía?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);

  const handleOptionSelect = useCallback((option: number) => {
    setSelectedOption(option);
    setShowFeedback(true);
    
    // Simular evaluación
    const isCorrect = option === 0; // Primera opción es correcta para demo
    if (isCorrect) {
      updateUserProgress({
        completedExercises: userProgress.completedExercises + 1,
        experience: userProgress.experience + 10
      });
    }
  }, [userProgress, updateUserProgress]);

  const handleNewExercise = useCallback(() => {
    setIsLoading(true);
    setSelectedOption(null);
    setShowFeedback(false);
    
    // Simular generación de ejercicio
    setTimeout(() => {
      const newExercise = {
        id: `exercise-${Date.now()}`,
        question: `Ejercicio de ${activeSubject}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 0,
        explanation: 'Explicación del ejercicio'
      };
      setCurrentExercise(newExercise);
      setIsLoading(false);
    }, 1000);
  }, [activeSubject]);

  const generateExercise = useCallback(async () => {
    return handleNewExercise();
  }, [handleNewExercise]);

  const getStats = useCallback((): ExerciseStats => {
    return {
      exercisesCompleted: userProgress.completedExercises,
      averageScore: Math.round((userProgress.overallScore / Math.max(userProgress.completedExercises, 1)) * 100),
      streak: userProgress.streak
    };
  }, [userProgress]);

  // Alias para chatHistory
  const chatHistory = messages;

  return {
    activeTab,
    setActiveTab,
    messages,
    chatHistory, // Añadir alias para compatibilidad
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    generateExercise, // Añadir método generateExercise
    isLoading,
    getStats
  };
};
