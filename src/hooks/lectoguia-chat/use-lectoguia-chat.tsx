
import React, { useState, useCallback, useEffect } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { subjectNames, detectSubjectFromMessage } from './subject-detection';
import { handleMessageError, extractResponseContent, formatImageAnalysisResult } from './message-handling';
import { ChatState, ChatActions, ERROR_RATE_LIMIT_MESSAGE, WELCOME_MESSAGE } from './types';
import { provideChatFeedback } from '@/services/openrouter/feedback';
import { ToastAction } from '@/components/ui/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

// Respuestas offline para cuando el servicio no está disponible
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

export function useLectoGuiaChat(): ChatState & ChatActions {
  // Chat state management
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  
  // Image processing
  const { isProcessing, handleImageProcessing } = useImageProcessing();
  
  // API communication with improved error handling
  const { callOpenRouter, lastError, retryLastOperation, connectionStatus, resetConnectionStatus } = useOpenRouter();
  
  // Local state
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [serviceStatus, setServiceStatus] = useState<'available'|'degraded'|'unavailable'>('available');
  const [messageQueue, setMessageQueue] = useState<{message: string, timestamp: number}[]>([]);
  
  // Efecto para procesar la cola de mensajes pendientes cuando el servicio se restablece
  useEffect(() => {
    const processQueue = async () => {
      if (connectionStatus === 'connected' && messageQueue.length > 0) {
        toast({
          title: "Conexión restablecida",
          description: "Procesando mensajes pendientes...",
        });
        
        // Procesar solo el mensaje más reciente para evitar spam
        const latestMessage = messageQueue.reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest
        );
        
        try {
          await processUserMessage(latestMessage.message);
          // Limpiar la cola después de procesar exitosamente
          setMessageQueue([]);
        } catch (error) {
          console.error("Error procesando mensaje en cola:", error);
        }
      }
    };
    
    if (connectionStatus === 'connected') {
      processQueue();
    }
  }, [connectionStatus, messageQueue]);
  
  // Efecto para mostrar mensaje y estado cuando hay problemas persistentes
  useEffect(() => {
    if (consecutiveErrors >= 3) {
      setServiceStatus('degraded');
      
      // Mensaje de alerta en el chat
      if (!messages.some(m => m.role === 'system' && m.content.includes('modo offline'))) {
        addAssistantMessage({
          role: 'system',
          content: "⚠️ LectoGuía está funcionando en modo offline con funcionalidad limitada debido a problemas de conexión. Las respuestas serán básicas hasta que se restablezca la conexión.",
          id: 'system-offline-alert',
          timestamp: new Date().toISOString()
        });
      }
      
      // Notificación
      toast({
        title: "Modo offline activado",
        description: "Estamos experimentando dificultades técnicas. Funcionaré con capacidades limitadas.",
        variant: "destructive",
        duration: 10000,
        action: <ToastAction altText="Reintentar conexión" onClick={resetConnectionStatus}>Reintentar</ToastAction>
      });
      
      // Resetear contador después de mostrar el mensaje
      setConsecutiveErrors(0);
    }
  }, [consecutiveErrors, messages]);
  
  /**
   * Change the active subject for the chat
   */
  const changeSubject = (subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      
      // Notify user of subject change
      addAssistantMessage(`Ahora estamos en ${subjectNames[subject]}. ¿En qué puedo ayudarte con esta materia?`);
    }
  };
  
  /**
   * Get offline response based on subject and query
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
   * Process user message and generate a response with improved error handling
   * and offline support
   */
  const processUserMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return null;
    
    // Add user message to chat
    addUserMessage(message, imageData);
    setIsTyping(true);
    
    try {
      // Handle image processing if there's an image
      if (imageData) {
        try {
          const response = await handleImageProcessing(imageData, message);
          const formattedResponse = formatImageAnalysisResult(response);
          addAssistantMessage(formattedResponse);
          setConsecutiveErrors(0); // Resetear contador de errores si hay éxito
          return formattedResponse;
        } catch (imageError) {
          console.error("Error procesando imagen:", imageError);
          const fallbackResponse = "Lo siento, no pude procesar la imagen correctamente. ¿Podrías intentar con una imagen más clara o describir lo que ves?";
          addAssistantMessage(fallbackResponse);
          return fallbackResponse;
        }
      }
      
      // Check for subject change
      const detectedSubject = detectSubjectFromMessage(message);
      if (detectedSubject && detectedSubject !== activeSubject) {
        changeSubject(detectedSubject);
      }
      
      // Si el servicio está degradado, usar respuestas offline
      if (serviceStatus === 'degraded' || connectionStatus === 'disconnected') {
        console.log('Servicio degradado o desconectado, usando respuesta offline');
        const offlineResponse = getOfflineResponse(message, activeSubject);
        addAssistantMessage(offlineResponse);
        
        // Agregar mensaje a la cola para procesamiento futuro si el servicio se restablece
        setMessageQueue(prev => [...prev, { message, timestamp: Date.now() }]);
        
        return offlineResponse;
      }
      
      // Request response from feedback service con mejor manejo de errores
      console.log('Enviando mensaje al servicio de feedback con contexto:', activeSubject);
      try {
        const responseData = await provideChatFeedback(
          message,
          `PAES preparation, subject: ${activeSubject}, full platform assistance`,
          getRecentMessages(6)
        );
        
        // Caso especial: si no hay respuesta pero no es un error crítico
        if (!responseData) {
          console.log('No se recibió respuesta del servicio, utilizando respuesta de respaldo');
          const fallbackContent = "Lo siento, en este momento no puedo acceder a toda mi información. ¿Puedo ayudarte con algo más básico sobre el tema?";
          addAssistantMessage(fallbackContent);
          
          // Incrementar contador de errores
          setConsecutiveErrors(prev => prev + 1);
          
          return fallbackContent;
        }
        
        console.log('Respuesta procesada:', responseData);
        
        // Añadir la respuesta al chat
        addAssistantMessage(responseData);
        setConsecutiveErrors(0); // Resetear contador de errores si hay éxito
        setServiceStatus('available'); // Marcar servicio como disponible nuevamente
        return responseData;
      } catch (serviceError) {
        console.error("Error al comunicarse con el servicio:", serviceError);
        
        // Incrementar contador de errores
        setConsecutiveErrors(prev => prev + 1);
        
        // Intentar reintentar automáticamente si es el primer o segundo error
        if (consecutiveErrors < 2) {
          toast({
            title: "Reintentando conexión",
            description: "Estamos intentando restablecer la comunicación...",
          });
          
          // Añadir un pequeño retraso antes de reintentar
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          try {
            const retryResponse = await provideChatFeedback(
              message,
              `PAES preparation, subject: ${activeSubject}, retry attempt`,
              getRecentMessages(2) // Usar menos contexto en el reintento
            );
            
            if (retryResponse) {
              addAssistantMessage(retryResponse);
              setConsecutiveErrors(0); // Resetear contador si el reintento tiene éxito
              return retryResponse;
            }
          } catch (retryError) {
            console.error("Error en reintento:", retryError);
          }
        }
        
        // Si todo falla, enviar un mensaje de error comprensible para el usuario
        const errorResponse = "Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo en unos momentos o prueba con una pregunta más simple.";
        addAssistantMessage(errorResponse);
        
        toast({
          title: "Error de conexión",
          description: "Hubo un problema al conectar con el servicio. Inténtalo de nuevo.",
          variant: "destructive",
          action: <ToastAction altText="Reintentar" onClick={retryLastOperation}>Reintentar</ToastAction>
        });
        
        return errorResponse;
      }
    } catch (error) {
      // Handle errors with improved error reporting
      console.error('Error procesando mensaje:', error);
      const { errorContent } = handleMessageError(error);
      
      addAssistantMessage(errorContent);
      
      // Incrementar contador de errores
      setConsecutiveErrors(prev => prev + 1);
      
      return errorContent;
    } finally {
      setIsTyping(false);
    }
  };
  
  // Mostrar estado de la conexión para depuración
  const showConnectionStatus = () => {
    return (
      <Alert variant={connectionStatus === 'connected' ? "default" : "destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Estado del servicio</AlertTitle>
        <AlertDescription>
          {connectionStatus === 'connected' ? 'Conectado' : 'Desconectado'} - {serviceStatus}
        </AlertDescription>
      </Alert>
    );
  };
  
  return {
    // State
    messages,
    isTyping: isTyping || isProcessing,
    activeSubject,
    
    // Actions
    processUserMessage,
    addAssistantMessage,
    changeSubject,
    detectSubjectFromMessage,
    
    // System status
    connectionStatus,
    serviceStatus,
    showConnectionStatus
  };
}
