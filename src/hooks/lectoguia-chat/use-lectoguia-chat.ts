
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
      
      // Request response directly from feedback service
      console.log('Enviando mensaje a servicio de feedback:', message);
      const responseData = await provideChatFeedback(
        message,
        `PAES preparation, subject: ${activeSubject}, full platform assistance`,
        getRecentMessages(6)
      );
      
      console.log('Respuesta del servicio de feedback:', responseData);
      
      // Manejar caso de error o respuesta nula
      if (!responseData) {
        console.log('Respuesta nula recibida del servicio');
        const errorContent = "Lo siento, no pude procesar tu solicitud. Por favor intenta de nuevo.";
        addAssistantMessage(errorContent);
        return errorContent;
      }
      
      // La respuesta ya debería estar en formato de texto
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
      return null;
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
