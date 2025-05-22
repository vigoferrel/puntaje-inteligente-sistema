
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/components/ai/ChatInterface';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { toast } from '@/components/ui/use-toast';
import { ImageAnalysisResult } from '@/types/ai-types';

const WELCOME_MESSAGE = `👋 ¡Hola! Soy LectoGuía, tu asistente personalizado para la preparación de la PAES.

Puedo ayudarte con:

• Ejercicios de Comprensión Lectora personalizados
• Explicaciones detalladas de conceptos
• Análisis de tu progreso
• Técnicas específicas para mejorar tus habilidades
• Análisis de imágenes y textos con OCR

¿En qué puedo ayudarte hoy?`;

const ERROR_RATE_LIMIT_MESSAGE = `Lo siento, estoy experimentando alta demanda en este momento. Por favor, intenta de nuevo en unos minutos.`;

export function useLectoGuiaChat() {
  // Mensajes de chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const { callOpenRouter, processImage } = useOpenRouter();
  const [isTyping, setIsTyping] = useState(false);
  
  // Agregar un mensaje del asistente
  const addAssistantMessage = (content: string) => {
    const botMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, botMessage]);
  };
  
  // Procesar y responder a un mensaje del usuario
  const processUserMessage = async (message: string, imageData?: string) => {
    // Create timestamp for current message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!message.trim() && !imageData) return null;
    
    // Agregar mensaje del usuario a la conversación
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp,
      imageUrl: imageData
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // If there's an image, process it with the vision model
      if (imageData) {
        // Prepare prompt based on user message or default to analysis
        const prompt = message.trim() || "Analiza esta imagen y extrae todo el texto visible";
        
        const response = await processImage(imageData, prompt);

        if (response) {
          let botResponse = "";
          
          // Handle different response formats
          const typedResponse = response as ImageAnalysisResult;
          
          if (typeof response === 'string') {
            botResponse = response;
          } else if (typedResponse.response) {
            botResponse = typedResponse.response;
            
            // Add extracted text info if available
            if (typedResponse.extractedText) {
              botResponse = `${botResponse}\n\n**Texto extraído:**\n${typedResponse.extractedText}`;
            }
          } else {
            botResponse = "He analizado la imagen, pero no pude extraer información clara. ¿Puedes proporcionar una imagen con mejor resolución?";
          }
          
          addAssistantMessage(botResponse);
          return botResponse;
        } else {
          const errorMessage = "Lo siento, tuve problemas analizando la imagen. Intenta con otra imagen o describe tu consulta.";
          addAssistantMessage(errorMessage);
          return errorMessage;
        }
      } else {
        // Regular text conversation using OpenRouter
        const response = await callOpenRouter<{ response: string }>("provide_feedback", {
          userMessage: message,
          context: "PAES preparation, reading comprehension"
        });

        let botResponse = "Lo siento, tuve un problema generando una respuesta. Puedo ayudarte con ejercicios de comprensión lectora si lo deseas.";
        
        if (response) {
          // Asegurarnos de que tenemos una respuesta válida
          if (typeof response === 'string') {
            botResponse = response;
          } else if (response && typeof response === 'object' && 'response' in response) {
            botResponse = response.response;
          } else if (typeof response === 'object' && Object.keys(response).length > 0) {
            // Intentar extraer alguna propiedad útil del objeto
            const firstValue = Object.values(response)[0];
            botResponse = typeof firstValue === 'string' ? firstValue : 
              "Para mejorar tu comprensión lectora, es importante enfocarte en las tres habilidades principales que evalúa la PAES: Rastrear-Localizar, Interpretar-Relacionar y Evaluar-Reflexionar.";
          }
        }
        
        addAssistantMessage(botResponse);
        return botResponse;
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      
      // Comprobar si es un error de rate limiting
      const errMsg = error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje";
      const isRateLimitError = errMsg.toLowerCase().includes('rate limit') || 
                             errMsg.toLowerCase().includes('rate-limit') ||
                             errMsg.toLowerCase().includes('límite de tasa');
      
      // Respuesta alternativa en caso de error
      const errorContent = isRateLimitError 
        ? ERROR_RATE_LIMIT_MESSAGE
        : "Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo o pedir un ejercicio de práctica?";
      
      addAssistantMessage(errorContent);
      
      toast({
        title: "Error",
        description: isRateLimitError 
          ? "El servicio está experimentando alta demanda. Por favor, intenta de nuevo más tarde."
          : errMsg,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsTyping(false);
    }
  };
  
  return {
    messages,
    isTyping,
    processUserMessage,
    addAssistantMessage,
  };
}
