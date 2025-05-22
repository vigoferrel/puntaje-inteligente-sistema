
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatMessageType } from "./types";
import { useChatSettings } from "@/components/lectoguia/chat-settings/ChatSettingsContext";

interface MessageListProps {
  messages: ChatMessageType[];
  isTyping?: boolean;
}

// Sonido de notificación
const NOTIFICATION_SOUND_URL = "https://cdn.jsdelivr.net/gh/mozilla/kitsune@main/kitsune/sumo/static/sumo/sounds/message.ogg";

export function MessageList({ messages, isTyping = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings } = useChatSettings();
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const previousMessagesCount = useRef<number>(messages.length);

  // Inicializar el sonido de notificación
  useEffect(() => {
    if (typeof window !== "undefined" && settings.notificationSound) {
      notificationSound.current = new Audio(NOTIFICATION_SOUND_URL);
    }
    
    return () => {
      if (notificationSound.current) {
        notificationSound.current.pause();
        notificationSound.current = null;
      }
    };
  }, [settings.notificationSound]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Reproducir sonido cuando llega un nuevo mensaje del asistente
    const hasNewAssistantMessage = messages.length > previousMessagesCount.current && 
                                  messages.length > 0 && 
                                  messages[messages.length - 1].role === "assistant";

    if (settings.notificationSound && hasNewAssistantMessage && notificationSound.current) {
      notificationSound.current.play().catch(err => {
        // Silenciamos errores de reproducción (comunes en navegadores móviles)
        console.warn("Error al reproducir notificación:", err);
      });
    }
    
    previousMessagesCount.current = messages.length;
  }, [messages, settings.notificationSound]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          {...message} // Spread the message properties directly instead of passing as a prop
        />
      ))}
      
      {isTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
