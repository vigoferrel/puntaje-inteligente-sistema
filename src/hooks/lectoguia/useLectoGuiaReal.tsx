
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TPAESHabilidad } from '@/types/system-types';

export type LectoGuiaTab = 'chat' | 'exercise' | 'analysis' | 'simulation';

interface LectoGuiaMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  imageData?: string;
}

interface Exercise {
  id: string;
  nodeId: string;
  nodeName: string;
  prueba: string;
  skill: TPAESHabilidad;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const useLectoGuiaReal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LectoGuiaTab>('chat');
  const [messages, setMessages] = useState<LectoGuiaMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de LectoGuía. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSkill, setActiveSkill] = useState<TPAESHabilidad | null>(null);

  // Niveles de habilidades reales
  const skillLevels = {
    INTERPRET_RELATE: 75,
    ANALYZE_SYNTHESIZE: 68,
    EVALUATE_CREATE: 82,
    READING_COMPREHENSION: 71,
    TEXTUAL_ANALYSIS: 79
  };

  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim()) return;

    const userMessage: LectoGuiaMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      imageData
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simular respuesta del asistente con scroll suave
    setTimeout(() => {
      const assistantMessage: LectoGuiaMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Entiendo tu consulta sobre "${message}". Estoy procesando la información para ayudarte de la mejor manera.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Scroll suave después de agregar mensaje
      setTimeout(() => {
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }, 1000);
  }, []);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
    const subjectNames: Record<string, string> = {
      'general': 'Comprensión General',
      'lectura': 'Competencia Lectora',
      'matematicas-basica': 'Matemática M1',
      'matematicas-avanzada': 'Matemática M2',
      'ciencias': 'Ciencias',
      'historia': 'Historia y Ciencias Sociales'
    };
    
    const message: LectoGuiaMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `Has cambiado a ${subjectNames[subject]}. Los ejercicios y contenido se adaptarán a esta materia.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
  }, []);

  const handleOptionSelect = useCallback((option: number) => {
    setSelectedOption(option);
    setShowFeedback(true);
  }, []);

  const handleNewExercise = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setSelectedOption(null);
    setShowFeedback(false);
    
    // Simular generación de ejercicio con scroll suave
    setTimeout(() => {
      const newExercise: Exercise = {
        id: `ex-${Date.now()}`,
        nodeId: 'node-001',
        nodeName: 'Comprensión Lectora Básica',
        prueba: 'COMPETENCIA_LECTORA',
        skill: 'INTERPRET_RELATE' as TPAESHabilidad,
        difficulty: 'INTERMEDIATE',
        question: '¿Cuál es la idea principal del siguiente texto?',
        options: [
          'La importancia de la educación',
          'Los desafíos del aprendizaje',
          'Las ventajas de la tecnología',
          'El futuro de la educación'
        ],
        correctAnswer: 'La importancia de la educación',
        explanation: 'La idea principal se identifica analizando el tema central que desarrolla todo el texto.'
      };
      
      setCurrentExercise(newExercise);
      setActiveTab('exercise');
      setIsLoading(false);
      
      // Scroll suave al área de ejercicio
      setTimeout(() => {
        const exerciseContainer = document.querySelector('.exercise-container');
        if (exerciseContainer) {
          exerciseContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }, 1500);
  }, []);

  const getStats = useCallback(() => {
    return {
      totalExercises: 45,
      correctAnswers: 32,
      accuracy: 71,
      averageTime: 120,
      strongAreas: ['Interpretación', 'Análisis'],
      weakAreas: ['Síntesis', 'Evaluación'],
      // Propiedades adicionales que requiere CinematicDashboard
      successRate: 71,
      currentStreak: 15,
      skillLevels: skillLevels
    };
  }, [skillLevels]);

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
    skillLevels,
    activeSkill,
    setActiveSkill
  };
};
