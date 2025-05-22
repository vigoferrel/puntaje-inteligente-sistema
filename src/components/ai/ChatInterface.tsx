
import React from "react";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { ChatMessageType } from "./chat/types";

export type ChatMessage = ChatMessageType;

export interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, imageData?: string) => void;
  isTyping?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isTyping = false,
  placeholder = "Escribe un mensaje...",
  className,
}: ChatInterfaceProps) {
  return (
    <div className={`flex flex-col h-full ${className || ''}`}>
      <MessageList messages={messages} isTyping={isTyping} />
      <ChatInput onSendMessage={onSendMessage} placeholder={placeholder} />
    </div>
  );
}

export { toast } from "@/components/ui/use-toast";
