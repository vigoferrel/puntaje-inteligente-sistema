
import { useState, useCallback } from 'react';
import { UseChatState, ChatMessage } from './types';
import { v4 as uuidv4 } from 'uuid';
import { WELCOME_MESSAGE } from '@/hooks/lectoguia-chat/types';

export function useChat(): UseChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  
  const addUserMessage = useCallback((content: string, imageData?: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
      imageData
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const addAssistantMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);
  
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    // Esta función será reemplazada en el provider
    console.log("Message send placeholder:", message, imageData);
    // Solo para testing, no hacer nada real aquí
    addUserMessage(message, imageData);
    setIsTyping(true);
    setTimeout(() => {
      addAssistantMessage("Esta respuesta es temporal. La implementación real está en LectoGuiaProvider.");
      setIsTyping(false);
    }, 500);
  }, [addUserMessage, addAssistantMessage]);
  
  return {
    messages,
    isTyping,
    activeSubject,
    setActiveSubject
  };
}
