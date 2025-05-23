
import { useState, useCallback } from 'react';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { useSubjectDetection } from './subject-detection';
import { ConnectionStatus } from '@/hooks/use-openrouter';
import { ERROR_RATE_LIMIT_MESSAGE } from './types';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircleWarning } from 'lucide-react';
import { openRouterService } from '@/services/openrouter/core';

// Define connection status type to match what's expected from use-openrouter
type LectoGuiaConnectionStatus = ConnectionStatus;

interface ChatState {
  messages: any[];
  isTyping: boolean;
  activeSubject: string;
  serviceStatus: 'available' | 'degraded' | 'unavailable';
  connectionStatus: LectoGuiaConnectionStatus;
}

interface ChatActions {
  processUserMessage: (content: string, imageData?: string) => Promise<string | null>;
  resetConnectionStatus: () => void;
  showConnectionStatus: () => React.ReactNode | null;
  setActiveSubject: (subject: string) => void;
  addAssistantMessage: (content: string) => any;
  changeSubject: (subject: string) => void;
  detectSubjectFromMessage: (message: string) => string | null;
}

export function useLectoGuiaChat(): ChatState & ChatActions {
  const [isTyping, setIsTyping] = useState(false);
  const [activeSubject, setActiveSubject] = useState('general');
  const [serviceStatus, setServiceStatus] = useState<'available' | 'degraded' | 'unavailable'>('available');
  const [connectionStatus, setConnectionStatus] = useState<LectoGuiaConnectionStatus>('connected'); // Cambiar a 'connected' por defecto
  
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  const { handleImageProcessing, processImage } = useImageProcessing();
  const { detectSubject } = useSubjectDetection();
  
  // Estado para mostrar el estado de conexión
  const showConnectionStatus = useCallback(() => {
    if (connectionStatus === 'disconnected') {
      return (
        <Alert variant="destructive">
          <MessageCircleWarning className="h-4 w-4" />
          <AlertDescription>
            No se pudo conectar con el servicio. Por favor, revisa tu conexión a internet e inténtalo de nuevo.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  }, [connectionStatus]);
  
  // Resetear el estado de conexión
  const resetConnectionStatus = useCallback(() => {
    setConnectionStatus('connecting');
    setServiceStatus('available');
    
    // Verificar conexión después de un breve delay
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);
  }, []);
  
  // Function to change the subject
  const changeSubject = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);
  
  // Function to detect subject from message
  const detectSubjectFromMessage = useCallback((message: string): string | null => {
    return detectSubject(message);
  }, [detectSubject]);
  
  // Función principal para procesar los mensajes del usuario usando openRouterService
  const processUserMessage = useCallback(async (content: string, imageData?: string): Promise<string | null> => {
    setIsTyping(true);
    setConnectionStatus('connecting');
    
    try {
      console.log('LectoGuía: Procesando mensaje del usuario:', content.substring(0, 100) + '...');
      
      // Primero, añadir el mensaje del usuario a la conversación
      addUserMessage(content, imageData);
      
      let assistantResponse = '';
      
      // Si hay una imagen, procesarla primero
      if (imageData) {
        console.log('LectoGuía: Procesando imagen adjunta');
        const imageAnalysisResult = await processImage(imageData);
        assistantResponse += imageAnalysisResult.response || '';
      }
      
      // Crear el contexto para LectoGuía
      const systemPrompt = `Eres LectoGuía, un asistente especializado en ayudar a estudiantes chilenos con la preparación para la PAES (Prueba de Acceso a la Educación Superior).

Especialidades:
- Comprensión Lectora: Análisis de textos, interpretación, localización de información
- Matemáticas Básica (7° a 2° medio): Aritmética, geometría, álgebra básica
- Matemáticas Avanzada (3° y 4° medio): Funciones, probabilidades, estadística
- Ciencias: Biología, física, química aplicadas a la PAES
- Historia: Historia de Chile y universal, geografía, educación cívica

Materia activa: ${activeSubject}

Instrucciones:
1. Responde siempre en español chileno
2. Adapta tu nivel al estudiante
3. Usa ejemplos relevantes para Chile
4. Si te piden ejercicios, genera preguntas tipo PAES
5. Mantén un tono amigable y motivador
6. Si la consulta no es educativa, redirige gentilmente al tema de estudios`;

      // Asegurar que el mensaje tenga contenido
      const messageContent = content || "Hola, necesito ayuda con mis estudios";

      console.log('LectoGuía: Enviando solicitud a OpenRouter');
      
      // Enviar la solicitud con un formato consistente
      const response = await openRouterService({
        action: 'provide_feedback',
        payload: {
          message: messageContent,          // Parámetro principal esperado por el backend
          userMessage: messageContent,      // Parámetro alternativo para compatibilidad
          content: messageContent,          // Otra variante para compatibilidad
          systemPrompt: systemPrompt,       // Instrucciones del sistema
          subject: activeSubject,           // Materia activa
          context: `subject:${activeSubject}`, // Contexto formateado
          history: getRecentMessages().slice(-6) // Últimos 6 mensajes para contexto
        }
      });
      
      if (!response) {
        console.error('LectoGuía: No se recibió respuesta del servicio');
        setServiceStatus('unavailable');
        setConnectionStatus('disconnected');
        
        const fallbackMessage = "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor intenta de nuevo en unos momentos.";
        addAssistantMessage(fallbackMessage);
        return fallbackMessage;
      }
      
      console.log('LectoGuía: Respuesta recibida exitosamente');
      
      // Extraer el contenido de la respuesta con type-safe access
      const messageContent = (response as any)?.response || (response as any)?.result || response;
      
      // Añadir la respuesta del asistente al estado
      addAssistantMessage(messageContent);
      setConnectionStatus('connected');
      setServiceStatus('available');
      
      return messageContent;
    } catch (error: any) {
      console.error("LectoGuía: Error procesando mensaje:", error);
      
      setConnectionStatus('disconnected');
      setServiceStatus('unavailable');
      
      // Mensaje de error más amigable
      const errorMessage = "Estoy teniendo dificultades técnicas en este momento. Por favor intenta de nuevo más tarde.";
      addAssistantMessage(errorMessage);
      
      toast({
        title: "Error de conexión",
        description: "No se pudo procesar tu mensaje. Intenta de nuevo.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsTyping(false);
    }
  }, [addAssistantMessage, addUserMessage, getRecentMessages, activeSubject, processImage]);
  
  // Return all values
  return {
    // Chat state
    messages,
    isTyping,
    activeSubject,
    serviceStatus,
    connectionStatus,
    
    // Chat actions
    processUserMessage,
    resetConnectionStatus,
    showConnectionStatus,
    setActiveSubject,
    addAssistantMessage,
    changeSubject,
    detectSubjectFromMessage
  };
}
