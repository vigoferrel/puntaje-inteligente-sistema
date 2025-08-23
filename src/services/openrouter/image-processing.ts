
import { toast } from "@/components/ui/use-toast";
import { ImageAnalysisResult } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Procesa una imagen y devuelve el análisis de la IA
 */
export const processImageWithOpenRouter = async (
  imageData: string, 
  prompt?: string, 
  context?: string
): Promise<ImageAnalysisResult | null> => {
  try {
    // Validate image data
    if (!imageData) {
      console.error('No image data provided for processing');
      toast({
        title: "Error",
        description: "No se proporcionó una imagen para procesar",
        variant: "destructive"
      });
      return null;
    }

    console.log('Processing image with prompt:', prompt || 'default prompt');
    
    // Ensure the image data is either a base64 string or a URL
    if (!imageData.startsWith('data:') && !imageData.startsWith('http')) {
      console.error('Invalid image data format');
      toast({
        title: "Error",
        description: "Formato de imagen inválido",
        variant: "destructive"
      });
      return null;
    }

    const result = await openRouterService<ImageAnalysisResult>({
      action: 'process_image',
      payload: {
        image: imageData,
        prompt: prompt || "Analiza esta imagen y extrae todo el texto que puedas encontrar",
        context: context || "Análisis de imagen para comprensión lectora"
      }
    });

    if (!result) {
      toast({
        title: "Error",
        description: "No se recibió respuesta del servicio de análisis de imagen",
        variant: "destructive"
      });
      return null;
    }

    console.log('Image processing result:', result);
    return result;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : 'Error procesando la imagen';
    
    console.error('Error processing image with OpenRouter:', error);
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
    
    return null;
  }
};
