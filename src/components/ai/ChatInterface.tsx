
import React, { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  imageUrl?: string; // Added for image support
}

interface ChatInterfaceProps {
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
  const [input, setInput] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (input.trim() || imageData) {
      onSendMessage(input, imageData || undefined);
      setInput("");
      setImageData(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "El archivo seleccionado no es una imagen",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelectedImage = () => {
    setImageData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
        ))}
        {isTyping && (
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
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border p-4">
        {/* Image preview */}
        {imageData && (
          <div className="mb-2 relative">
            <div className="relative inline-block">
              <img 
                src={imageData} 
                alt="Preview" 
                className="max-h-36 rounded-md object-contain"
              />
              <button 
                onClick={clearSelectedImage}
                className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2 bg-secondary/30 rounded-lg p-2">
          <textarea
            className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 text-sm text-foreground placeholder:text-muted-foreground"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{ height: "2.5rem", maxHeight: "8rem" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "2.5rem";
              target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
            }}
          />
          
          {/* Hidden file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Image upload button */}
          <Button
            type="button"
            onClick={handleImageUploadClick}
            className="bg-secondary hover:bg-secondary/90 text-foreground rounded-full h-8 w-8 p-0 flex items-center justify-center"
          >
            <ImagePlus className="h-4 w-4" />
          </Button>

          {/* Send message button */}
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() && !imageData}
            className="bg-primary hover:bg-primary/90 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { toast } from "@/components/ui/use-toast";
