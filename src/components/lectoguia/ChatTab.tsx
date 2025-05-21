
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";

interface ChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  messages, 
  onSendMessage, 
  isTyping 
}) => {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="h-[calc(100vh-280px)] min-h-[500px]">
          <ChatInterface
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            placeholder="Pregunta cualquier cosa sobre comprensión lectora..."
          />
        </div>
      </CardContent>
    </Card>
  );
};
