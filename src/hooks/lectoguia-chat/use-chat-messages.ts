
import { useState } from 'react';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { v4 as uuidv4 } from 'uuid';
import { WELCOME_MESSAGE } from './types';
import { createUserMessage, createAssistantMessage } from './message-handling';

/**
 * Hook for managing chat messages
 */
export function useChatMessages() {
  // Initialize with welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date().toISOString()
    }
  ]);
  
  /**
   * Add a message from the user
   */
  const addUserMessage = (content: string, imageData?: string) => {
    if (!content.trim() && !imageData) return null;
    
    const userMessage = createUserMessage(content, imageData);
    setMessages(prev => [...prev, userMessage]);
    return userMessage;
  };
  
  /**
   * Add a message from the assistant
   */
  const addAssistantMessage = (content: string) => {
    const botMessage = createAssistantMessage(content);
    setMessages(prev => [...prev, botMessage]);
    return botMessage;
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
