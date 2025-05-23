
import { useState } from 'react';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook for managing chat messages
 */
export function useChatMessages() {
  // Initialize with welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "¡Hola! Soy LectoGuía, tu asistente de aprendizaje personalizado.",
      timestamp: new Date().toISOString()
    }
  ]);
  
  /**
   * Add a message from the user
   */
  const addUserMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    return message;
  };
  
  /**
   * Add a message from the assistant
   */
  const addAssistantMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    return message;
  };
  
  /**
   * Get a subset of recent messages for context
   */
  const getRecentMessages = (count: number = 6) => {
    return messages.slice(-count);
  };
  
  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    getRecentMessages
  };
}
