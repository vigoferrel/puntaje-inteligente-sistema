
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise } from '@/types/ai-types';
import { provideChatFeedback } from '@/services/openrouter/feedback';
import { toast } from '@/components/ui/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface LectoGuiaState {
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  
  // Exercise
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  isLoading: boolean;
  
  // Navigation
  activeTab: 'chat' | 'exercise' | 'progress';
  activeSubject: string;
  
  // System
  isConnected: boolean;
  lastSync: Date | null;
}

const INITIAL_STATE: LectoGuiaState = {
  messages: [
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy LectoGuía, tu asistente de preparación PAES. Puedo ayudarte con ejercicios, explicaciones y estrategias de estudio. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date()
    }
  ],
  isTyping: false,
  currentExercise: null,
  selectedOption: null,
  showFeedback: false,
  isLoading: false,
  activeTab: 'chat',
  activeSubject: 'general',
  isConnected: true,
  lastSync: new Date()
};

// Ejercicios de ejemplo para fallback
const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'sample-1',
    nodeId: 'node-comprension',
    nodeName: 'Comprensión Lectora Básica',
    prueba: 'COMPETENCIA_LECTORA',
    skill: 'INTERPRET_RELATE',
    difficulty: 'INTERMEDIATE',
    question: 'Lee el siguiente texto y responde: "El cambio climático es uno de los desafíos más importantes del siglo XXI. Sus efectos incluyen el aumento de las temperaturas globales y fenómenos meteorológicos extremos." ¿Cuál es la idea principal del texto?',
    options: [
      'El siglo XXI tiene muchos desafíos',
      'El cambio climático es un desafío importante con múltiples efectos',
      'Las temperaturas están aumentando globalmente',
      'Los fenómenos meteorológicos son extremos'
    ],
    correctAnswer: 'El cambio climático es un desafío importante con múltiples efectos',
    explanation: 'La idea principal conecta el concepto central (cambio climático como desafío) con sus características (múltiples efectos).'
  },
  {
    id: 'sample-2',
    nodeId: 'node-matematica',
    nodeName: 'Funciones Lineales',
    prueba: 'MATEMATICA_1',
    skill: 'ANALYZE',
    difficulty: 'INTERMEDIATE',
    question: 'Si una función lineal f(x) = 2x + 3, ¿cuál es el valor de f(5)?',
    options: ['8', '10', '13', '15'],
    correctAnswer: '13',
    explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13'
  }
];

export const useLectoGuiaSimplified = () => {
  const { user, profile } = useAuth();
  const [state, setState] = useState<LectoGuiaState>(INITIAL_STATE);

  // Simular conexión estable
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({ ...prev, lastSync: new Date() }));
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Manejo de mensajes del chat
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    try {
      // Intentar obtener respuesta del AI
      const aiResponse = await provideChatFeedback(
        message,
        `Materia actual: ${state.activeSubject}. Usuario: ${profile?.name || user?.email || 'Estudiante'}`
      );

      // Procesar la respuesta
      let finalResponse = aiResponse || generateFallbackResponse(message);

      // Si la respuesta es muy corta, mejorarla
      if (finalResponse.length < 20) {
        finalResponse = `${finalResponse} ¿Hay algo específico sobre ${state.activeSubject} en lo que te pueda ayudar más?`;
      }

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: finalResponse,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false
      }));

    } catch (error) {
      console.error('Error en chat:', error);
      
      // Respuesta de emergencia
      const emergencyResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: generateFallbackResponse(message),
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, emergencyResponse],
        isTyping: false
      }));
    }
  }, [state.activeSubject, profile?.name, user?.email]);

  // Generar respuesta de fallback inteligente
  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ejercicio') || message.includes('practica')) {
      return `Perfecto! Puedo generar ejercicios de ${state.activeSubject}. Ve a la pestaña "Ejercicios" y presiona "Nuevo Ejercicio" para comenzar.`;
    }
    
    if (message.includes('ayuda') || message.includes('como')) {
      return `Estoy aquí para ayudarte con tu preparación PAES. Puedo generar ejercicios, explicar conceptos, y darte estrategias de estudio para ${state.activeSubject}.`;
    }
    
    if (message.includes('matematica')) {
      return 'En matemática puedo ayudarte con álgebra, funciones, geometría y estadística. ¿Qué tema específico te interesa?';
    }
    
    if (message.includes('ciencia')) {
      return 'En ciencias cubrimos biología, química y física. ¿Hay algún tema específico que quieras repasar?';
    }
    
    return `Entiendo tu consulta sobre "${message}". Como tu asistente PAES, puedo ayudarte con ejercicios, explicaciones y estrategias de estudio. ¿Qué te gustaría hacer?`;
  };

  // Generar nuevo ejercicio
  const handleNewExercise = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simular carga y seleccionar ejercicio apropiado
    setTimeout(() => {
      const availableExercises = SAMPLE_EXERCISES.filter(ex => 
        state.activeSubject === 'general' || 
        ex.prueba.includes(state.activeSubject.toUpperCase())
      );
      
      const selectedExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)] || SAMPLE_EXERCISES[0];
      
      setState(prev => ({
        ...prev,
        currentExercise: selectedExercise,
        selectedOption: null,
        showFeedback: false,
        isLoading: false,
        activeTab: 'exercise'
      }));

      toast({
        title: "Ejercicio generado",
        description: `Nuevo ejercicio de ${selectedExercise.nodeName}`,
      });
    }, 1000);
  }, [state.activeSubject]);

  // Seleccionar opción en ejercicio
  const handleOptionSelect = useCallback((option: number) => {
    setState(prev => ({
      ...prev,
      selectedOption: option,
      showFeedback: true
    }));
  }, []);

  // Cambiar materia activa
  const handleSubjectChange = useCallback((subject: string) => {
    setState(prev => ({ ...prev, activeSubject: subject }));
    
    const subjectMessages = {
      'general': 'Ahora estamos en modo general. Puedo ayudarte con cualquier materia PAES.',
      'matematicas': 'Cambiamos a matemática. ¿Qué tema quieres practicar?',
      'ciencias': 'Ahora en ciencias. ¿Biología, química o física?',
      'historia': 'En historia podemos repasar desde la colonia hasta el siglo XX.',
      'lectura': 'En comprensión lectora trabajaremos textos y estrategias de análisis.'
    };

    const message: ChatMessage = {
      id: `system-${Date.now()}`,
      type: 'ai',
      content: subjectMessages[subject as keyof typeof subjectMessages] || subjectMessages.general,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  // Cambiar pestaña activa
  const setActiveTab = useCallback((tab: 'chat' | 'exercise' | 'progress') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  // Stats para el dashboard
  const getStats = useCallback(() => ({
    totalMessages: state.messages.filter(m => m.type === 'user').length,
    exercisesCompleted: state.currentExercise && state.showFeedback ? 1 : 0,
    currentSubject: state.activeSubject,
    isConnected: state.isConnected,
    lastSync: state.lastSync
  }), [state]);

  return {
    // Estado
    ...state,
    
    // Acciones de chat
    handleSendMessage,
    
    // Acciones de ejercicios
    handleNewExercise,
    handleOptionSelect,
    
    // Navegación
    setActiveTab,
    handleSubjectChange,
    
    // Utilidades
    getStats,
    
    // Estado de conexión simplificado
    connectionStatus: state.isConnected ? 'connected' : 'disconnected',
    serviceStatus: 'available'
  };
};
