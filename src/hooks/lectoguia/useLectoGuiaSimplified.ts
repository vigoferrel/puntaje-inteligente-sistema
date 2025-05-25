
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  subject: string;
}

interface Stats {
  exercisesCompleted: number;
  averageScore: number;
  streak: number;
  totalMessages: number;
  todayStudyTime: number;
}

export const useLectoGuiaSimplified = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente de LectoGuía. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [activeTab, setActiveTab] = useState<'chat' | 'exercise' | 'progress'>('chat');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messageIdRef = useRef(2);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: messageIdRef.current.toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    messageIdRef.current++;
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simular respuesta de IA
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = generateAIResponse(content, activeSubject);
      const aiMessage: Message = {
        id: messageIdRef.current.toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      messageIdRef.current++;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage: Message = {
        id: messageIdRef.current.toString(),
        type: 'ai',
        content: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      messageIdRef.current++;
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [activeSubject]);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
    
    const changeMessage: Message = {
      id: messageIdRef.current.toString(),
      type: 'ai',
      content: `Perfecto! Ahora estamos enfocados en ${getSubjectName(subject)}. ¿Qué te gustaría practicar?`,
      timestamp: new Date()
    };
    messageIdRef.current++;
    setMessages(prev => [...prev, changeMessage]);
  }, []);

  const generateExercise = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const exercise: Exercise = {
        id: `exercise-${Date.now()}`,
        question: `Ejercicio de ${getSubjectName(activeSubject)} - Pregunta adaptada a tu nivel`,
        options: [
          'Opción A: Respuesta correcta basada en contexto',
          'Opción B: Distractor plausible',
          'Opción C: Distractor común',
          'Opción D: Distractor avanzado'
        ],
        correctAnswer: 'Opción A: Respuesta correcta basada en contexto',
        explanation: 'Esta es la respuesta correcta porque aplica los conceptos fundamentales de la materia.',
        difficulty: 'intermediate',
        subject: activeSubject
      };

      setCurrentExercise(exercise);
      setSelectedOption('');
      setShowFeedback(false);
      setActiveTab('exercise');
      
      return exercise;
    } catch (error) {
      console.error('Error generando ejercicio:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject]);

  const handleNewExercise = useCallback(async () => {
    const exercise = await generateExercise();
    if (exercise) {
      const confirmMessage: Message = {
        id: messageIdRef.current.toString(),
        type: 'ai',
        content: `✅ He generado un nuevo ejercicio de ${getSubjectName(activeSubject)}. Puedes verlo en la pestaña de Ejercicios.`,
        timestamp: new Date()
      };
      messageIdRef.current++;
      setMessages(prev => [...prev, confirmMessage]);
    }
  }, [generateExercise, activeSubject]);

  const handleOptionSelect = useCallback((option: string | number) => {
    const selectedOptionText = typeof option === 'number' && currentExercise
      ? currentExercise.options[option]
      : option.toString();
    
    setSelectedOption(selectedOptionText);
    setShowFeedback(true);

    const isCorrect = selectedOptionText === currentExercise?.correctAnswer;
    const feedbackMessage: Message = {
      id: messageIdRef.current.toString(),
      type: 'ai',
      content: isCorrect 
        ? '¡Excelente! Has seleccionado la respuesta correcta. ¿Te gustaría intentar otro ejercicio?'
        : `No es la respuesta correcta. La respuesta era: ${currentExercise?.correctAnswer}. ¡Sigue practicando!`,
      timestamp: new Date()
    };
    messageIdRef.current++;
    setMessages(prev => [...prev, feedbackMessage]);
  }, [currentExercise]);

  const getStats = useCallback((): Stats => {
    const completedExercises = messages.filter(m => 
      m.type === 'ai' && m.content.includes('correcta')
    ).length;
    
    return {
      exercisesCompleted: completedExercises,
      averageScore: Math.min(85, 60 + completedExercises * 5),
      streak: Math.min(7, Math.floor(completedExercises / 2)),
      totalMessages: messages.length,
      todayStudyTime: Math.min(120, messages.length * 3)
    };
  }, [messages]);

  // Alias para compatibilidad con componentes legacy
  const chatHistory = messages.map(msg => ({
    role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content
  }));

  return {
    // Chat
    messages,
    isTyping,
    handleSendMessage,
    chatHistory,
    
    // Subject management
    activeSubject,
    handleSubjectChange,
    
    // Tab management
    activeTab,
    setActiveTab,
    
    // Exercise management
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    generateExercise,
    isLoading,
    
    // Stats
    getStats
  };
};

function generateAIResponse(userMessage: string, subject: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('ejercicio') || lowerMessage.includes('practicar')) {
    return `¡Excelente! Te voy a generar un ejercicio de ${getSubjectName(subject)}. Revisa la pestaña de Ejercicios para comenzar a practicar.`;
  }
  
  if (lowerMessage.includes('progreso') || lowerMessage.includes('avance')) {
    return `Tu progreso en ${getSubjectName(subject)} va muy bien. Puedes ver métricas detalladas en la pestaña de Progreso.`;
  }
  
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('help')) {
    return `Estoy aquí para ayudarte con ${getSubjectName(subject)}. Puedo generar ejercicios, explicar conceptos, mostrar tu progreso y más. ¿Qué necesitas?`;
  }
  
  if (lowerMessage.includes('plan') || lowerMessage.includes('estudio')) {
    return `Te puedo ayudar a crear un plan de estudio personalizado para ${getSubjectName(subject)}. ¿Cuáles son tus objetivos?`;
  }
  
  // Respuesta genérica contextual
  return `Entiendo que preguntas sobre "${userMessage}" en el contexto de ${getSubjectName(subject)}. Te puedo ayudar con ejercicios, explicaciones conceptuales, seguimiento de progreso y planes de estudio. ¿Qué te gustaría hacer específicamente?`;
}

function getSubjectName(subject: string): string {
  const names: Record<string, string> = {
    'COMPETENCIA_LECTORA': 'Comprensión Lectora',
    'MATEMATICA_1': 'Matemática M1',
    'MATEMATICA_2': 'Matemática M2',
    'CIENCIAS': 'Ciencias',
    'HISTORIA': 'Historia y Geografía'
  };
  return names[subject] || subject;
}
