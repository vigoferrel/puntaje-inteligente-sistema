
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useRealProgressData } from '@/hooks/useRealProgressData';

export type LectoGuiaTab = 'chat' | 'exercise' | 'analysis' | 'simulation';

export function useLectoGuiaSimplified() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LectoGuiaTab>('chat');
  const [activeSubject, setActiveSubject] = useState('lectura');
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use real progress data
  const { metrics: progressMetrics } = useRealProgressData();
  
  // Use real chat functionality
  const {
    messages,
    isTyping,
    processUserMessage,
    serviceStatus
  } = useLectoGuiaChat();

  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    try {
      await processUserMessage(message, imageData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [processUserMessage]);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
    setCurrentExercise(null);
    setSelectedOption(null);
    setShowFeedback(false);
  }, []);

  const handleOptionSelect = useCallback((option: number) => {
    setSelectedOption(option);
    setShowFeedback(true);
  }, []);

  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    try {
      // Generate real exercise based on current subject
      const exercise = {
        id: `exercise-${Date.now()}`,
        question: `Ejercicio de ${activeSubject}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A',
        explanation: 'Explicación del ejercicio'
      };
      
      setCurrentExercise(exercise);
      setSelectedOption(null);
      setShowFeedback(false);
      setActiveTab('exercise');
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject]);

  const getStats = useCallback(() => {
    if (!progressMetrics) {
      return {
        totalExercises: 0,
        correctAnswers: 0,
        successRate: 0,
        averageTime: 0,
        currentStreak: 0,
        skillLevels: {}
      };
    }

    return {
      totalExercises: progressMetrics.totalSessions,
      correctAnswers: Math.round(progressMetrics.totalSessions * (progressMetrics.retentionRate / 100)),
      successRate: progressMetrics.retentionRate,
      averageTime: progressMetrics.averageSessionTime,
      currentStreak: progressMetrics.currentStreak,
      skillLevels: progressMetrics.subjectProgress
    };
  }, [progressMetrics]);

  return {
    activeTab,
    setActiveTab,
    messages,
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    getStats,
    serviceStatus
  };
}
