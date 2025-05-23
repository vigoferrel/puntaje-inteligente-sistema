
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatMessageType } from "./types";
import { useChatSettings } from "@/components/lectoguia/chat-settings/ChatSettingsContext";

interface MessageListProps {
  messages: ChatMessageType[];
  isTyping?: boolean;
}

export function MessageList({ messages, isTyping = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings } = useChatSettings();
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const previousMessagesCount = useRef<number>(messages.length);

  // Inicializar el sonido de notificación con un sonido válido
  useEffect(() => {
    if (typeof window !== "undefined" && settings.notificationSound) {
      // Usar un data URL simple para un beep corto
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Crear un sonido simple programáticamente
      const createBeepSound = () => {
        try {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
          console.warn("No se pudo reproducir sonido de notificación:", error);
        }
      };
      
      notificationSound.current = {
        play: () => Promise.resolve(createBeepSound())
      } as any;
    }
    
    return () => {
      if (notificationSound.current) {
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
