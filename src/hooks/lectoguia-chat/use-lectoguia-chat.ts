
import { useState, useCallback } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { subjectNames, detectSubjectFromMessage } from './subject-detection';
import { handleMessageError, extractResponseContent } from './message-handling';
import { ChatState, ChatActions, ERROR_RATE_LIMIT_MESSAGE } from './types';
import { provideChatFeedback } from '@/services/openrouter/feedback';

export function useLectoGuiaChat(): ChatState & ChatActions {
  // Chat state management
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  
  // Image processing
  const { isProcessing, handleImageProcessing } = useImageProcessing();
  
  // API communication
  const { callOpenRouter } = useOpenRouter();
  
  // Local state
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  
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
        return response;
      } 
      
      // Check for subject change
      const detectedSubject = detectSubjectFromMessage(message);
      if (detectedSubject && detectedSubject !== activeSubject) {
        changeSubject(detectedSubject);
      }
      
      // Request response directly from feedback service with mejor manejo de errores
      console.log('Enviando mensaje al servicio de feedback con contexto:', activeSubject);
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
        return fallbackContent;
      }
      
      console.log('Respuesta procesada:', responseData);
      
      // Añadir la respuesta al chat
      addAssistantMessage(responseData);
      return responseData;
      
    } catch (error) {
      // Handle errors with improved error reporting
      console.error('Error procesando mensaje:', error);
      const errorContent = error instanceof Error 
        ? error.message.includes('rate limit') 
          ? ERROR_RATE_LIMIT_MESSAGE
          : "Lo siento, ocurrió un error. Por favor intenta de nuevo."
        : "Hubo un problema al procesar tu mensaje.";
      
      addAssistantMessage(errorContent);
      
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
