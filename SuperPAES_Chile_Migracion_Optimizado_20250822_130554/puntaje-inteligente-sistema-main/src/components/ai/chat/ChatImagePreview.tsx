/* eslint-disable react-refresh/only-export-components */

import React, { useState } from "react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { cn } from "../../../lib/utils";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ChatImagePreviewProps {
  imageUrl: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const ChatImagePreview = ({ imageUrl, isExpanded, onToggleExpand }: ChatImagePreviewProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    // Crear un enlace temporal para descargar la imagen
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagen-chat-${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="PrevisualizaciÃ³n completa" 
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block mb-2 group">
      <img
        src={imageUrl}
        alt="Imagen adjunta"
        className={cn(
          "rounded-md border border-border object-contain cursor-pointer transition-all",
          isExpanded ? "max-h-80 w-auto" : "h-20 w-auto"
        )}
        onClick={onToggleExpand}
      />
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button 
          variant="outline" 
          size="icon"
          className="h-6 w-6 bg-black/30 border-none text-white hover:bg-black/50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreen(true);
          }}
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="h-6 w-6 bg-black/30 border-none text-white hover:bg-black/50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
        >
          <Download className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

