
import React, { useState, useCallback, useEffect } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { subjectNames, detectSubjectFromMessage } from './subject-detection';
import { createUserMessage, createAssistantMessage, extractResponseContent } from './message-handling';
import { ChatState, ChatActions, ERROR_RATE_LIMIT_MESSAGE, WELCOME_MESSAGE } from './types';
import { CircuitBreaker } from '@/utils/circuit-breaker';
import { ToastAction } from '@/components/ui/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, WifiOff } from 'lucide-react';

// Implementar respuestas offline
const OFFLINE_RESPONSES: Record<string, string[]> = {
  general: [
    "Actualmente estoy funcionando en modo offline. Puedo responder preguntas básicas sobre la PAES.",
    "Disculpa, estoy experimentando problemas de conexión. Intenta con una pregunta más simple o vuelve más tarde."
  ],
  lectura: [
    "La comprensión lectora implica entender el significado explícito e implícito de un texto. Trabaja en identificar ideas principales, secundarias y relaciones entre ellas.",
    "Para mejorar en comprensión lectora, practica la lectura activa subrayando ideas clave y haciéndote preguntas mientras lees."
  ],
  matematicas: [
    "Las matemáticas para la PAES cubren álgebra, geometría, probabilidad y estadística. Centra tu estudio en comprender conceptos fundamentales.",
    "Para mejorar en matemáticas, es importante practicar regularmente con diferentes tipos de problemas y revisar conceptos básicos."
  ],
  ciencias: [
    "La prueba de ciencias evalúa conocimientos en biología, física y química. Enfócate en comprender los principios científicos fundamentales.",
    "Para ciencias, es útil relacionar conceptos teóricos con ejemplos prácticos o aplicaciones cotidianas."
  ],
  historia: [
    "Historia y ciencias sociales cubren eventos históricos de Chile y el mundo, geografía y formación ciudadana.",
    "Para estudiar historia efectivamente, crea líneas de tiempo y mapas conceptuales que te ayuden a visualizar relaciones entre eventos."
  ]
};

// Circuit breaker para OpenRouter API
const openRouterCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 60000,
  onOpen: () => {
    console.log('OpenRouter circuit opened - service may be down');
    toast({
      title: "Servicio degradado",
      description: "Funcionando en modo limitado. Intentaremos restablecer la conexión automáticamente.",
      variant: "destructive",
      duration: 5000
    });
  },
  onClose: () => {
    console.log('OpenRouter circuit closed - service restored');
    toast({
      title: "Servicio restablecido",
      description: "Todas las funcionalidades están disponibles nuevamente.",
      duration: 3000
    });
  }
});

// Caché local para respuestas frecuentes
const messageCache: Record<string, { response: string, timestamp: number }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

export function useLectoGuiaChat(): ChatState & ChatActions {
  // Estado principal del chat
  const { messages, addUserMessage: addUserMsg, addAssistantMessage: addAssistantMsg, getRecentMessages } = useChatMessages();
  
  // Procesamiento de imágenes
  const { isProcessing, handleImageProcessing } = useImageProcessing();
  
  // Comunicación con API con mejor manejo de errores
  const { callOpenRouter, lastError, retryLastOperation, connectionStatus, resetConnectionStatus } = useOpenRouter();
  
  // Estado local
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [serviceStatus, setServiceStatus] = useState<'available'|'degraded'|'unavailable'>('available');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  // Wrapper sobre addUserMessage para mantener consistencia de estado
  const addUserMessage = useCallback((content: string, imageData?: string) => {
    setIsTyping(true);
    const msg = addUserMsg(content, imageData);
    return msg;
  }, [addUserMsg]);
  
  // Wrapper sobre addAssistantMessage para mantener consistencia de estado
  const addAssistantMessage = useCallback((content: string) => {
    const msg = addAssistantMsg(content);
    setIsTyping(false);
    return msg;
  }, [addAssistantMsg]);
  
  // Monitor de conexión y reconexión automática
  useEffect(() => {
    if (connectionStatus === 'disconnected' && reconnectAttempts < 5) {
      const timer = setTimeout(() => {
        console.log(`Intento de reconexión ${reconnectAttempts + 1}/5`);
        retryLastOperation();
        setReconnectAttempts(prev => prev + 1);
      }, 5000 * Math.pow(2, reconnectAttempts)); // Backoff exponencial
      
      return () => clearTimeout(timer);
    } else if (connectionStatus === 'connected') {
      setReconnectAttempts(0);
      if (serviceStatus === 'degraded') {
        setServiceStatus('available');
      }
    }
  }, [connectionStatus, reconnectAttempts, retryLastOperation, serviceStatus]);
  
  // Verificación periódica del estado del servicio
  useEffect(() => {
    const checkServiceHealth = async () => {
      try {
        // Intento ligero para verificar si el servicio está activo
        const healthCheck = await callOpenRouter({ 
          action: "health_check", 
          payload: {} 
        }, true);
        
        const status = typeof healthCheck === 'object' && healthCheck && 'status' in healthCheck 
          ? String(healthCheck.status)
          : '';
          
        if (status === 'available' && serviceStatus !== 'available') {
          setServiceStatus('available');
          openRouterCircuitBreaker.reset();
        }
      } catch (error) {
        console.error("Error verificando salud del servicio:", error);
      }
    };
    
    // Verificar al inicio y luego cada 5 minutos
    checkServiceHealth();
    const interval = setInterval(checkServiceHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [callOpenRouter, serviceStatus]);
  
  /**
   * Cambia la materia activa para el chat
   */
  const changeSubject = useCallback((subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      
      // Notificar al usuario del cambio de materia
      addAssistantMessage(`Ahora estamos en ${subjectNames[subject]}. ¿En qué puedo ayudarte con esta materia?`);
    }
  }, [activeSubject, addAssistantMessage]);
  
  /**
   * Detecta la materia desde un mensaje y la actualiza si es necesario
   */
  const detectSubjectFromMsg = useCallback((message: string) => {
    const detectedSubject = detectSubjectFromMessage(message);
    if (detectedSubject && detectedSubject !== activeSubject) {
      changeSubject(detectedSubject);
      return detectedSubject;
    }
    return null;
  }, [activeSubject, changeSubject]);
  
  /**
   * Obtiene una respuesta offline basada en la materia y consulta
   */
  const getOfflineResponse = (message: string, subject: string): string => {
    // Seleccionar respuestas para el tema actual o general si no hay específicas
    const responses = OFFLINE_RESPONSES[subject] || OFFLINE_RESPONSES.general;
    
    // Selección semi-determinística basada en el mensaje para consistencia
    const messageHash = message.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = messageHash % responses.length;
    
    return responses[index];
  };
  
  /**
   * Busca en caché una respuesta previa similar
   */
  const getCachedResponse = (message: string, subject: string): string | null => {
    const normalizedMsg = message.toLowerCase().trim();
    const cacheKey = `${subject}:${normalizedMsg}`;
    
    const cachedItem = messageCache[cacheKey];
    if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_TTL) {
      console.log('Usando respuesta en caché');
      return cachedItem.response;
    }
    
    // Buscar respuestas similares para consultas muy cortas
    if (normalizedMsg.length < 10) {
      for (const [key, item] of Object.entries(messageCache)) {
        if (key.startsWith(`${subject}:`) && 
            key.includes(normalizedMsg) && 
            (Date.now() - item.timestamp) < CACHE_TTL) {
          console.log('Usando respuesta en caché similar');
          return item.response + "\n\n(Respuesta basada en una consulta similar)";
        }
      }
    }
    
    return null;
  };
  
  /**
   * Guardar respuesta en caché para futuras consultas
   */
  const cacheResponse = (message: string, subject: string, response: string) => {
    const normalizedMsg = message.toLowerCase().trim();
    const cacheKey = `${subject}:${normalizedMsg}`;
    
    messageCache[cacheKey] = {
      response,
      timestamp: Date.now()
    };
    
    // Limpiar caché si crece demasiado
    if (Object.keys(messageCache).length > 100) {
      const oldEntries = Object.entries(messageCache)
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(0, 20);
      
      oldEntries.forEach(([key]) => delete messageCache[key]);
    }
  };
  
  /**
   * Procesa mensaje de usuario y genera una respuesta con mejor manejo de errores
   * y soporte offline
   */
  const processUserMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return null;
    
    // Agregar mensaje del usuario al chat
    addUserMessage(message, imageData);
    setIsTyping(true);
    
    try {
      // Manejar procesamiento de imagen si hay una imagen
      if (imageData) {
        try {
          const response = await handleImageProcessing(imageData, message);
          const formattedResponse = response.response || "No pude analizar la imagen correctamente.";
          addAssistantMessage(formattedResponse);
          openRouterCircuitBreaker.success(); // Registro exitoso para circuit breaker
          return formattedResponse;
        } catch (imageError) {
          console.error("Error procesando imagen:", imageError);
          const fallbackResponse = "Lo siento, no pude procesar la imagen correctamente. ¿Podrías intentar con una imagen más clara o describir lo que ves?";
          addAssistantMessage(fallbackResponse);
          openRouterCircuitBreaker.failure(); // Registro de fallo para circuit breaker
          return fallbackResponse;
        }
      }
      
      // Verificar cambio de materia
      detectSubjectFromMsg(message);
      
      // Comprobar si el circuit breaker está abierto o el servicio degradado
      if (openRouterCircuitBreaker.isOpen() || serviceStatus !== 'available') {
        console.log('Servicio no disponible, usando respuesta offline');
        
        // Primero intentar caché
        const cachedResponse = getCachedResponse(message, activeSubject);
        if (cachedResponse) {
          addAssistantMessage(cachedResponse);
          setIsTyping(false);
          return cachedResponse;
        }
        
        // Si no hay caché, usar respuesta offline
        const offlineResponse = getOfflineResponse(message, activeSubject);
        addAssistantMessage(offlineResponse);
        setIsTyping(false);
        return offlineResponse;
      }
      
      // Intentar obtener respuesta en caché primero para mejorar rendimiento
      const cachedResponse = getCachedResponse(message, activeSubject);
      if (cachedResponse) {
        addAssistantMessage(cachedResponse);
        setIsTyping(false);
        return cachedResponse;
      }
      
      // Solicitar respuesta al API
      console.log('Enviando mensaje al servicio:', message);
      
      try {
        const responseData = await callOpenRouter({
          action: "provide_feedback",
          payload: {
            userMessage: message,
            context: `PAES preparation, subject: ${activeSubject}`,
            previousMessages: getRecentMessages(4)
          }
        });
        
        // Si no hay respuesta, usar respuesta de respaldo
        if (!responseData) {
          const fallbackContent = "Lo siento, en este momento no puedo acceder a toda mi información. ¿Puedo ayudarte con algo más básico sobre el tema?";
          addAssistantMessage(fallbackContent);
          setIsTyping(false);
          openRouterCircuitBreaker.failure(); // Registro de fallo para circuit breaker
          return fallbackContent;
        }
        
        // Extraer el contenido de la respuesta
        const finalResponse = extractResponseContent(responseData);
        
        // Agregar la respuesta al chat
        addAssistantMessage(finalResponse);
        
        // Guardar en caché para futuras consultas similares
        cacheResponse(message, activeSubject, finalResponse);
        
        // Registrar éxito en circuit breaker
        openRouterCircuitBreaker.success();
        
        return finalResponse;
      } catch (serviceError) {
        console.error("Error al comunicarse con el servicio:", serviceError);
        
        // Registrar fallo en circuit breaker
        openRouterCircuitBreaker.failure();
        
        // Usar respuesta offline como fallback
        const fallbackResponse = getOfflineResponse(message, activeSubject);
        addAssistantMessage(fallbackResponse);
        setIsTyping(false);
        
        return fallbackResponse;
      }
    } catch (error) {
      // Error general en el procesamiento
      console.error("Error general procesando mensaje:", error);
      const errorResponse = "Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.";
      addAssistantMessage(errorResponse);
      setIsTyping(false);
      return errorResponse;
    } finally {
      setIsTyping(false);
    }
  }, [
    activeSubject,
    addUserMessage,
    addAssistantMessage,
    callOpenRouter,
    detectSubjectFromMsg,
    getRecentMessages,
    handleImageProcessing
  ]);
  
  /**
   * Componente para mostrar estado de conexión
   */
  const showConnectionStatus = useCallback(() => {
    if (serviceStatus === 'degraded' || connectionStatus === 'disconnected') {
      return (
        <Alert variant="destructive" className="mb-4 bg-destructive/20">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Modo limitado</AlertTitle>
          <AlertDescription>
            Funcionando con capacidades reducidas debido a problemas de conexión.
            <ToastAction altText="Reintentar" onClick={() => resetConnectionStatus()}>
              Reintentar
            </ToastAction>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [serviceStatus, connectionStatus, resetConnectionStatus]);
  
  // Unificar manejo de cambio de materia (desde UI)
  const handleSubjectChange = useCallback((subject: string) => {
    changeSubject(subject);
  }, [changeSubject]);
  
  return {
    messages,
    isTyping,
    activeSubject,
    serviceStatus,
    connectionStatus,
    processUserMessage,
    addAssistantMessage,
    changeSubject,
    detectSubjectFromMessage: detectSubjectFromMsg,
    showConnectionStatus,
    resetConnectionStatus,
    handleSubjectChange
  };
}
