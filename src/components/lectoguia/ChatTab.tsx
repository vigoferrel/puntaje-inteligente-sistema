
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SubjectSelector } from "@/components/lectoguia/SubjectSelector";
import { ChatSettingsButton } from "@/components/lectoguia/chat-settings/ChatSettingsButton";

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, imageData?: string) => void;
  isTyping: boolean;
  activeSubject?: string;
  onSubjectChange?: (subject: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping,
  activeSubject = "general",
  onSubjectChange
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="p-2 border-b border-border flex justify-between items-center">
          {onSubjectChange && (
            <SubjectSelector 
              activeSubject={activeSubject} 
              onSelectSubject={onSubjectChange}
            />
          )}
          <ChatSettingsButton />
        </div>
        <div className="h-[calc(100vh-280px)] min-h-[500px]">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            placeholder="Pregunta algo sobre cualquier materia PAES o sube una imagen para analizarla..."
          />
        </div>
      </CardContent>
    </Card>
  );
};
