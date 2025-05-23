
import { useState } from 'react';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { ImageProcessingResult } from './types';

/**
 * Hook para manejo de procesamiento de imágenes
 */
export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { processImage } = useOpenRouter();
  
  /**
   * Procesa una imagen y retorna el resultado
   */
  const handleImageProcessing = async (
    imageData: string,
    prompt?: string
  ): Promise<ImageProcessingResult> => {
    try {
      setIsProcessing(true);
      
      // Verificar que los datos de la imagen son válidos
      if (!imageData || imageData.length < 100) {
        throw new Error('Datos de imagen inválidos o incompletos');
      }
      
      // Prompt por defecto si no se proporciona uno específico
      const defaultPrompt = 'Analiza esta imagen y proporciona información detallada sobre su contenido.';
      
      const result = await processImage(
        imageData, 
        prompt || defaultPrompt,
        'Contexto: Imagen enviada por estudiante durante preparación PAES'
      );
      
      if (!result) {
        return {
          response: "No se pudo procesar la imagen. Por favor intenta con una imagen más clara."
        };
      }
      
      return result as ImageProcessingResult;
    } catch (error) {
      console.error('Error en el procesamiento de imagen:', error);
      return {
        response: "Ocurrió un error al procesar tu imagen. Por favor intenta de nuevo con una imagen de mejor calidad."
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  return { isProcessing, handleImageProcessing };
}
