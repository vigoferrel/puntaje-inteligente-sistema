
import { useCallback } from 'react';
import { openRouterService } from '@/services/openrouter/core';
import { toast } from '@/components/ui/use-toast';

export function useImageProcessing() {
  const processImage = useCallback(async (imageData: string, prompt?: string) => {
    try {
      console.log('Procesando imagen con LectoGuía...');
      
      if (!imageData) {
        throw new Error('No se proporcionó imagen para procesar');
      }
      
      // Usar openRouterService para procesar la imagen
      const result = await openRouterService({
        action: 'process_image',
        payload: {
          image: imageData,
          prompt: prompt || "Analiza esta imagen educativa y extrae el texto. Si contiene ejercicios o preguntas, identifícalos claramente.",
          context: "Análisis educativo para LectoGuía - PAES Chile"
        }
      });
      
      if (!result) {
        throw new Error('No se recibió respuesta del servicio de análisis de imagen');
      }
      
      console.log('Imagen procesada exitosamente');
      
      return {
        response: result.response || result.result || 'Imagen procesada correctamente',
        extractedText: result.extractedText || '',
        confidence: result.confidence || 0.8
      };
    } catch (error) {
      console.error('Error procesando imagen:', error);
      
      toast({
        title: "Error procesando imagen",
        description: "No se pudo analizar la imagen. Intenta de nuevo.",
        variant: "destructive"
      });
      
      return {
        response: "No se pudo procesar la imagen en este momento.",
        extractedText: '',
        confidence: 0
      };
    }
  }, []);
  
  const handleImageProcessing = useCallback(async (imageData: string) => {
    return await processImage(imageData);
  }, [processImage]);
  
  return {
    processImage,
    handleImageProcessing
  };
}
