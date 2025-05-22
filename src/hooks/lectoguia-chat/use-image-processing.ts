
import { useState } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { ImageAnalysisResult } from '@/types/ai-types';
import { formatImageAnalysisResult } from './message-handling';

/**
 * Hook for handling image processing functionality
 */
export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { processImage } = useOpenRouter();
  
  /**
   * Process an uploaded image
   */
  const handleImageProcessing = async (imageData: string, message: string): Promise<string> => {
    try {
      setIsProcessing(true);
      toast({
        title: "Procesando imagen",
        description: "Estamos analizando el contenido de la imagen..."
      });
      
      // Use default prompt if no message is provided
      const prompt = message.trim() || "Analiza esta imagen y extrae todo el texto visible";
      
      // Process the image
      const result = await processImage(imageData, prompt);
      
      // Show success notification
      toast({
        title: "Imagen analizada",
        description: "La imagen ha sido analizada correctamente"
      });
      
      // Format the result
      return formatImageAnalysisResult(result);
    } catch (error) {
      console.error("Error processing image:", error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "No se pudo analizar la imagen. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      
      return "Lo siento, tuve problemas analizando la imagen. Intenta con otra imagen o describe tu consulta.";
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    handleImageProcessing
  };
}
