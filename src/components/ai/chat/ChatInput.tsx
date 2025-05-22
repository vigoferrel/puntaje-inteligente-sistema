
import React, { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useChatSettings } from "@/components/lectoguia/chat-settings/ChatSettingsContext";

interface ChatInputProps {
  onSendMessage: (message: string, imageData?: string) => void;
  placeholder?: string;
}

export function ChatInput({ onSendMessage, placeholder = "Escribe un mensaje..." }: ChatInputProps) {
  const { settings } = useChatSettings();
  const [input, setInput] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (input.trim() || imageData) {
      onSendMessage(input, imageData || undefined);
      setInput("");
      setImageData(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Only handle Enter key press according to settings
    if (e.key === "Enter" && !e.shiftKey && settings.enterToSend) {
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

    setIsProcessingImage(true);
    
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
      setIsProcessingImage(false);
      toast({
        title: "Imagen cargada",
        description: "La imagen se ha cargado correctamente",
      });
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      toast({
        title: "Error",
        description: "No se pudo cargar la imagen",
        variant: "destructive"
      });
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
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada",
    });
  };
  
  return (
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
          disabled={isProcessingImage}
          className="bg-secondary hover:bg-secondary/90 text-foreground rounded-full h-8 w-8 p-0 flex items-center justify-center"
        >
          <ImagePlus className="h-4 w-4" />
        </Button>

        {/* Send message button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!input.trim() && !imageData) || isProcessingImage}
          className="bg-primary hover:bg-primary/90 text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Enter to send hint */}
      {settings.enterToSend && (
        <div className="text-xs text-muted-foreground mt-1 text-right mr-1">
          Presiona Enter para enviar, Shift+Enter para nueva línea
        </div>
      )}
    </div>
  );
};
