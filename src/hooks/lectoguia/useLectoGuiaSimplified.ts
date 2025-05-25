
import { useState, useCallback, useEffect } from 'react';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type: 'user' | 'ai';
}

interface ExerciseStats {
  exercisesCompleted: number;
  averageScore: number;
  streak: number;
  totalMessages: number;
}

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const useLectoGuiaSimplified = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'exercise' | 'overview'>('overview');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const { userProgress, updateUserProgress } = useUnifiedState();

  // Cargar historial de mensajes al inicializar
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user?.user?.id) return;

        const { data, error } = await supabase
          .from('lectoguia_conversations')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error loading chat history:', error);
          return;
        }

        const loadedMessages: ChatMessage[] = (data || []).map(msg => ({
          id: msg.id,
          role: msg.message_type as 'user' | 'assistant',
          type: msg.message_type === 'user' ? 'user' : 'ai',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));

        setMessages(loadedMessages);
      } catch (error) {
        console.error('Error in loadChatHistory:', error);
      }
    };

    loadChatHistory();
  }, [sessionId]);

  // Guardar mensaje en la base de datos
  const saveMessage = useCallback(async (message: ChatMessage) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) return;

      await supabase
        .from('lectoguia_conversations')
        .insert({
          user_id: user.user.id,
          session_id: sessionId,
          message_type: message.role,
          content: message.content,
          subject_context: activeSubject,
          metadata: {
            timestamp: message.timestamp.toISOString(),
            type: message.type
          }
        });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [sessionId, activeSubject]);

  // Enviar mensaje al chat IA
  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    setIsTyping(true);
    
    try {
      // Llamar al servicio de IA (por ahora simulado)
      const response = await fetch('/api/lectoguia-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          subject: activeSubject,
          sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const { reply } = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        type: 'ai',
        content: reply || `He recibido tu consulta sobre ${activeSubject}: "${message}". Te ayudo con ejercicios y explicaciones personalizadas.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Respuesta de fallback
      const fallbackMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        type: 'ai',
        content: `He recibido tu mensaje sobre ${activeSubject}: "${message}". Estoy aquí para ayudarte con ejercicios y explicaciones personalizadas. ¿En qué aspecto específico te gustaría profundizar?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      await saveMessage(fallbackMessage);
    } finally {
      setIsTyping(false);
    }
  }, [activeSubject, sessionId, saveMessage]);

  // Cambiar materia activa
  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);

  // Seleccionar opción en ejercicio
  const handleOptionSelect = useCallback((option: number) => {
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (currentExercise) {
      const isCorrect = currentExercise.options[option] === currentExercise.correctAnswer;
      if (isCorrect) {
        updateUserProgress({
          completedExercises: userProgress.completedExercises + 1,
          experience: userProgress.experience + 10
        });
      }
    }
  }, [currentExercise, userProgress, updateUserProgress]);

  // Generar nuevo ejercicio
  const handleNewExercise = useCallback(async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setShowFeedback(false);
    
    try {
      // Simular generación de ejercicio (después se conectará con IA real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newExercise: Exercise = {
        id: `exercise-${Date.now()}`,
        question: `Ejercicio de ${activeSubject}: Identifica la idea principal del siguiente texto.`,
        options: [
          'La importancia de la educación en Chile',
          'Los desafíos del sistema PAES',
          'Las oportunidades de financiamiento',
          'El rol de la tecnología en el aprendizaje'
        ],
        correctAnswer: 'La importancia de la educación en Chile',
        explanation: 'La respuesta correcta se identifica analizando el tema central que desarrolla el texto de manera consistente.'
      };
      
      setCurrentExercise(newExercise);
      
      // Guardar ejercicio en la base de datos
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('generated_exercises')
          .insert({
            user_id: user.user.id,
            prueba_paes: activeSubject,
            question: newExercise.question,
            options: newExercise.options,
            correct_answer: newExercise.correctAnswer,
            explanation: newExercise.explanation,
            skill_code: 'INTERPRET_RELATE',
            difficulty_level: 'intermediate'
          });
      }
      
    } catch (error) {
      console.error('Error generating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject]);

  // Obtener estadísticas
  const getStats = useCallback((): ExerciseStats => {
    return {
      exercisesCompleted: userProgress.completedExercises,
      averageScore: Math.round((userProgress.overallScore / Math.max(userProgress.completedExercises, 1)) * 100),
      streak: userProgress.streak,
      totalMessages: messages.length
    };
  }, [userProgress, messages.length]);

  return {
    // Estado
    activeTab,
    setActiveTab,
    messages,
    chatHistory: messages, // Alias para compatibilidad
    isTyping,
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading,
    activeSubject,
    connectionStatus,
    
    // Acciones
    handleSendMessage,
    handleSubjectChange,
    handleOptionSelect,
    handleNewExercise,
    generateExercise: handleNewExercise, // Alias para compatibilidad
    getStats
  };
};
