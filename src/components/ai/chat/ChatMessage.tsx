
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 animate-in fade-in",
        message.role === "user" ? "justify-start" : "justify-start"
      )}
    >
      <Avatar className={cn(message.role === "user" ? "bg-primary/20" : "bg-muted")}>
        {message.role === "user" ? (
          <User className="h-5 w-5 text-primary" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </Avatar>
      <div
        className={cn(
          "rounded-lg p-3 max-w-[85%]",
          message.role === "user"
            ? "bg-secondary text-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {/* Show image if present */}
        {message.imageUrl && (
          <div className="mb-2">
            <img 
              src={message.imageUrl} 
              alt="Uploaded" 
              className="max-w-full h-auto rounded-md max-h-64 object-contain"
            />
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        {message.timestamp && (
          <div className="text-xs text-muted-foreground mt-1 text-right">
            {message.timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
