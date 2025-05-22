
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="bg-muted">
        <Bot className="h-5 w-5 text-primary" />
      </Avatar>
      <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce delay-75"></div>
        <div className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce delay-150"></div>
      </div>
    </div>
  );
}
