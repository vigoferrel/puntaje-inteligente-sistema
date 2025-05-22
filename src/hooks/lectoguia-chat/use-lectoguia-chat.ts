
import { useState } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { subjectNames, detectSubjectFromMessage } from './subject-detection';
import { handleMessageError, extractResponseContent } from './message-handling';
import { ChatState, ChatActions } from './types';

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
      
      // Request response from API
      console.log('Sending message to OpenRouter:', message);
      const responseData = await callOpenRouter<any>("provide_feedback", {
        userMessage: message,
        context: `PAES preparation, subject: ${activeSubject}, full platform assistance`,
        previousMessages: getRecentMessages(6)
      });
      
      console.log('Response received from OpenRouter:', responseData);
      
      if (!responseData) {
        const errorContent = "Lo siento, no pude procesar tu solicitud. Por favor intenta de nuevo.";
        addAssistantMessage(errorContent);
        return errorContent;
      }
      
      // Utilizar la función mejorada de extracción de contenido
      const botResponse = extractResponseContent(responseData);
      console.log('Processed bot response:', botResponse);
      
      // Solo agregar respuesta al chat si es válida
      if (botResponse && typeof botResponse === 'string' && botResponse.length > 0) {
        addAssistantMessage(botResponse);
        return botResponse;
      } else {
        const fallbackResponse = "Recibí una respuesta pero no pude procesarla correctamente. ¿Podrías reformular tu pregunta?";
        addAssistantMessage(fallbackResponse);
        return fallbackResponse;
      }
      
    } catch (error) {
      // Handle errors
      console.error('Error processing message:', error);
      const { errorContent } = handleMessageError(error);
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
