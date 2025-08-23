// 🤖💫 ASISTENTE PERSONAL DEL ESTUDIANTE 💫🤖
// Creado por ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuralOrchestrator } from '../../hooks/useNeuralOrchestrator';
import { useBloom } from '../../hooks/useBloom';
import { useDynamicStyles } from '../../hooks/useDynamicStyles';
import styles from '../../styles/StudentAssistant.module.css';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface AssistantMessage {
  id: string;
  type: 'assistant' | 'student';
  content: string;
  timestamp: Date;
  emotion: 'happy' | 'encouraging' | 'thoughtful' | 'excited' | 'supportive';
  suggestions?: string[];
}

interface AssistantPersonality {
  name: string;
  avatar: string;
  greeting: string;
  supportiveMessages: string[];
  celebrationMessages: string[];
  helpMessages: string[];
}

const StudentAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'encouraging' | 'thoughtful' | 'excited' | 'supportive'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { studentProfile, getAgentInsights, orchestrateLearning } = useNeuralOrchestrator();
  const { dashboard, stats } = useBloom();

  // Generar posiciones para las partículas de fondo
  const particlePositions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      'dynamic-x': `${i * 20}%`,
      'dynamic-y': `${i * 15}%`
    }));
  }, []);

  const particleRefs = [
    useDynamicStyles(particlePositions[0]),
    useDynamicStyles(particlePositions[1]),
    useDynamicStyles(particlePositions[2]),
    useDynamicStyles(particlePositions[3]),
    useDynamicStyles(particlePositions[4])
  ];

  const assistant: AssistantPersonality = {
    name: 'Luna',
    avatar: '🌟',
    greeting: `¡Hola amigo! Soy Luna, tu asistente personal de aprendizaje. Estoy aquí para apoyarte en cada paso de tu viaje educativo. ¿En qué puedo ayudarte hoy?`,
    supportiveMessages: [
      "¡Estás haciendo un trabajo increíble! 🌟",
      "Recuerda: cada error es una oportunidad de aprender 💡",
      "Tu progreso es impresionante, sigue así 🚀",
      "¡Creo en ti! Tienes todo lo necesario para triunfar 💪"
    ],
    celebrationMessages: [
      "¡WOW! ¡Eso fue fantástico! 🎉",
      "¡Increíble logro! Estoy muy orgullosa de ti 🏆",
      "¡Eres imparable! ¡Sigue brillando! ✨",
      "¡Ese es el espíritu! ¡Excelente trabajo! 🎯"
    ],
    helpMessages: [
      "¿Te gustaría que te explique algo específico? 🤔",
      "Puedo ayudarte a encontrar la mejor manera de estudiar este tema 📚",
      "¿Qué tal si probamos un enfoque diferente? 🔄",
      "Estoy aquí para apoyarte. ¿Cómo te sientes? 💭"
    ]
  };

  // Función memoizada para agregar mensajes del asistente
  const addAssistantMessage = useCallback((
    content: string,
    emotion: AssistantMessage['emotion'] = 'happy',
    suggestions?: string[]
  ) => {
    setIsTyping(true);
    setCurrentEmotion(emotion);
    
    setTimeout(() => {
      const newMessage: AssistantMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        emotion,
        suggestions
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Simular tiempo de escritura
  }, []);

  // Inicializar conversación
  useEffect(() => {
    if (messages.length === 0) {
      addAssistantMessage(assistant.greeting, 'excited', [
        "Ver mi progreso",
        "Obtener recomendaciones",
        "Comenzar una actividad",
        "Hablar con mis agentes IA"
      ]);
    }
  }, [messages.length, assistant.greeting, addAssistantMessage]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Monitorear progreso del estudiante
  useEffect(() => {
    if (dashboard && messages.length > 1) {
      if (stats && stats.total_activities_completed > 0) {
        // Enviar mensaje de celebración ocasionalmente
        if (Math.random() > 0.8) {
          setTimeout(() => {
            const celebrationMsg = assistant.celebrationMessages[
              Math.floor(Math.random() * assistant.celebrationMessages.length)
            ];
            addAssistantMessage(celebrationMsg, 'excited');
          }, 2000);
        }
      }
    }
  }, [dashboard, messages.length, stats, assistant.celebrationMessages, addAssistantMessage]);


  const addStudentMessage = (content: string) => {
    const newMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'student',
      content,
      timestamp: new Date(),
      emotion: 'happy'
    };
    
    setMessages(prev => [...prev, newMessage]);
    handleStudentInput(content);
  };

  const handleStudentInput = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    // Respuestas inteligentes basadas en el input
    if (lowerInput.includes('progreso') || lowerInput.includes('como voy')) {
      if (stats) {
        addAssistantMessage(
          `¡Tu progreso es fantástico! 📊 Tienes ${stats.total_points} puntos, has completado ${stats.total_activities_completed} actividades y tienes ${stats.total_achievements} logros. ¡Sigue así!`,
          'excited',
          ["Ver detalles", "Siguiente actividad", "Mis logros"]
        );
      }
    } else if (lowerInput.includes('ayuda') || lowerInput.includes('no entiendo')) {
      addAssistantMessage(
        "¡Por supuesto que te ayudo! 🤗 Recuerda que tienes un equipo completo de 5 agentes IA trabajando para ti. ¿Te gustaría que te explique algo específico o prefieres que ajustemos tu plan de estudio?",
        'supportive',
        ["Explicar tema", "Ajustar dificultad", "Cambiar estrategia", "Hablar con agentes"]
      );
    } else if (lowerInput.includes('motivacion') || lowerInput.includes('animo')) {
      const motivationalMsg = assistant.supportiveMessages[
        Math.floor(Math.random() * assistant.supportiveMessages.length)
      ];
      addAssistantMessage(
        `${motivationalMsg} Recuerda que cada experto fue una vez un principiante. Tu dedicación y esfuerzo son lo que realmente importa. ¡Estoy aquí para apoyarte siempre! 💖`,
        'encouraging',
        ["Comenzar actividad fácil", "Ver mis fortalezas", "Consejos de estudio"]
      );
    } else if (lowerInput.includes('agentes') || lowerInput.includes('ia')) {
      const insights = getAgentInsights();
      if (insights) {
        addAssistantMessage(
          `¡Tus agentes IA están trabajando increíblemente! 🤖 Han tomado ${insights.totalDecisions} decisiones para personalizar tu aprendizaje con una confianza promedio del ${Math.round(insights.averageConfidence * 100)}%. ¡Están súper enfocados en tu éxito!`,
          'excited',
          ["Ver decisiones", "Orquestar nuevo aprendizaje", "Configurar agentes"]
        );
      }
    } else if (lowerInput.includes('recomendacion') || lowerInput.includes('que estudiar')) {
      addAssistantMessage(
        "¡Excelente pregunta! 🎯 Basándome en tu perfil y progreso, creo que sería perfecto que trabajemos en algo que se adapte a tu estilo de aprendizaje. ¿Te gustaría que tus agentes IA generen una ruta personalizada?",
        'thoughtful',
        ["Generar ruta personalizada", "Ver temas disponibles", "Continuar donde dejé"]
      );
    } else {
      // Respuesta general amigable
      addAssistantMessage(
        "¡Me encanta que me escribas! 😊 Estoy aquí para hacer tu aprendizaje más fácil y divertido. ¿Hay algo específico en lo que pueda ayudarte hoy?",
        'happy',
        ["Ver mi progreso", "Obtener ayuda", "Comenzar actividad", "Hablar de motivación"]
      );
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    addStudentMessage(suggestion);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addStudentMessage(inputValue);
      setInputValue('');
    }
  };

  const getEmotionEmoji = (emotion: AssistantMessage['emotion']) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'encouraging': return '🤗';
      case 'thoughtful': return '🤔';
      case 'excited': return '🤩';
      case 'supportive': return '💖';
      default: return '😊';
    }
  };


  return (
    <>
      {/* Assistant Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.assistantToggle}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={styles.toggleIcon}
        >
          {isOpen ? '✕' : assistant.avatar}
        </motion.div>
        
        {/* Notification Dot */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={styles.notificationDot}
          >
            💬
          </motion.div>
        )}
      </motion.button>

      {/* Assistant Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div
              className={`${styles.chatHeader} ${styles[`chatHeader${currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}`]}`}
            >
              <div className={styles.headerContent}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={styles.assistantAvatar}
                >
                  {assistant.avatar}
                </motion.div>
                <div className={styles.assistantInfo}>
                  <h3>{assistant.name}</h3>
                  <p>Tu asistente personal</p>
                </div>
                <div className={styles.emotionIndicator}>
                  {getEmotionEmoji(currentEmotion)}
                </div>
              </div>
              
              {/* Animated Background */}
              <div className={styles.headerBackground}>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    ref={particleRefs[i] as React.RefObject<HTMLDivElement>}
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 10 + i * 2,
                      repeat: Infinity,
                      delay: i * 2
                    }}
                    className={`${styles.backgroundParticle} dynamic-position`}
                  />
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              <div className={styles.messagesSpace}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.messageWrapper} ${
                      message.type === 'student' ? styles.messageWrapperStudent : styles.messageWrapperAssistant
                    }`}
                  >
                    <div
                      className={`${styles.messageBubble} ${
                        message.type === 'student'
                          ? styles.messageBubbleStudent
                          : styles.messageBubbleAssistant
                      }`}
                    >
                      <p className={styles.messageText}>{message.content}</p>
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className={styles.suggestions}>
                          {message.suggestions.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={styles.suggestionButton}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.typingIndicator}
                  >
                    <div className={styles.typingBubble}>
                      <div className={styles.typingDots}>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            className={styles.typingDot}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje..."
                  className={styles.messageInput}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={styles.sendButton}
                >
                  📤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentAssistant;

