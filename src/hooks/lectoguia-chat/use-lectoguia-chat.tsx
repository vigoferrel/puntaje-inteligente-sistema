
import React, { useState, useCallback, useEffect } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { subjectNames, detectSubjectFromMessage } from './subject-detection';
import { handleMessageError, extractResponseContent } from './message-handling';
import { ChatState, ChatActions, ERROR_RATE_LIMIT_MESSAGE } from './types';
import { provideChatFeedback } from '@/services/openrouter/feedback';
import { ToastAction } from '@/components/ui/toast';

export function useLectoGuiaChat(): ChatState & ChatActions {
  // Chat state management
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  
  // Image processing
  const { isProcessing, handleImageProcessing } = useImageProcessing();
  
  // API communication
  const { callOpenRouter, lastError, retryLastOperation } = useOpenRouter();
  
  // Local state
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [serviceStatus, setServiceStatus] = useState<'available'|'degraded'|'unavailable'>('available');
  
  // Efecto para mostrar un mensaje de error persistente si hay demasiados errores consecutivos
  useEffect(() => {
    if (consecutiveErrors >= 3) {
      setServiceStatus('degraded');
      toast({
        title: "Problemas de conexión persistentes",
        description: "Estamos experimentando dificultades técnicas. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
        duration: 10000
      });
      // Resetear contador después de mostrar el mensaje
      setConsecutiveErrors(0);
    }
  }, [consecutiveErrors]);
  
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
   * Process user message and generate a response
   */
  const processUserMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return null;
    
    // Add user message to chat
    addUserMessage(message, imageData);
    setIsTyping(true);
    
    try {
      // Handle image processing if there's an image
      if (imageData) {
        const response = await handleImageProcessing(imageData, message);
        addAssistantMessage(response);
        setConsecutiveErrors(0); // Resetear contador de errores si hay éxito
        return response;
      } 
      
      // Check for subject change
      const detectedSubject = detectSubjectFromMessage(message);
      if (detectedSubject && detectedSubject !== activeSubject) {
        changeSubject(detectedSubject);
      }
      
      // Request response directly from feedback service con mejor manejo de errores
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
        const errorResponse = "Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo en unos momentos.";
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
      const errorContent = error instanceof Error 
        ? error.message.includes('rate limit') 
          ? ERROR_RATE_LIMIT_MESSAGE
          : "Lo siento, ocurrió un error. Por favor intenta de nuevo."
        : "Hubo un problema al procesar tu mensaje.";
      
      addAssistantMessage(errorContent);
      
      // Incrementar contador de errores
      setConsecutiveErrors(prev => prev + 1);
      
      // Notificar al usuario sobre el problema
      toast({
        title: "Error de comunicación",
        description: "Hubo un problema al conectar con el asistente. Verifica tu conexión a internet.",
        variant: "destructive"
      });
      
      return errorContent;
    } finally {
      setIsTyping(false);
    }
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
    detectSubjectFromMessage
  };
}
