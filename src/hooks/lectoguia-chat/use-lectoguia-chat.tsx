
import { useState, useCallback } from 'react';
import { useChatMessages } from './use-chat-messages';
import { useImageProcessing } from './use-image-processing';
import { useSubjectDetection } from './subject-detection';
import { ConnectionStatus } from '@/hooks/use-openrouter';
import { ERROR_RATE_LIMIT_MESSAGE } from '@/contexts/lectoguia/types';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircleWarning } from 'lucide-react';

// Define connection status type to match what's expected from use-openrouter
type LectoGuiaConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

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
  const [activeSubject, setActiveSubject] = useState('general'); // Valor por defecto
  const [serviceStatus, setServiceStatus] = useState<'available' | 'degraded' | 'unavailable'>('available');
  const [connectionStatus, setConnectionStatus] = useState<LectoGuiaConnectionStatus>('idle');
  
  const { messages, addUserMessage, addAssistantMessage, getRecentMessages } = useChatMessages();
  const { processImage } = useImageProcessing();
  const { detectSubject } = useSubjectDetection();
  
  // Estado para mostrar el estado de conexión
  const showConnectionStatus = useCallback(() => {
    if (connectionStatus === 'error') {
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
    setConnectionStatus('idle');
  }, []);
  
  // Function to change the subject
  const changeSubject = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);
  
  // Function to detect subject from message
  const detectSubjectFromMessage = useCallback((message: string): string | null => {
    return detectSubject(message);
  }, [detectSubject]);
  
  // Función principal para procesar los mensajes del usuario
  const processUserMessage = useCallback(async (content: string, imageData?: string): Promise<string | null> => {
    setIsTyping(true);
    setConnectionStatus('connecting');
    
    try {
      // Primero, añadir el mensaje del usuario a la conversación
      addUserMessage(content, imageData);
      
      let assistantResponse = '';
      
      // Si hay una imagen, procesarla primero
      if (imageData) {
        const imageAnalysisResult = await processImage(imageData);
        assistantResponse += imageAnalysisResult;
      }
      
      // Enviar el mensaje al servicio de inferencia
      const inferenceResponse = await fetch('/api/lectoguia/inference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          subject: activeSubject,
          history: getRecentMessages(),
        }),
      });
      
      if (!inferenceResponse.ok) {
        if (inferenceResponse.status === 429) {
          // Manejar el error de límite de tasa
          addAssistantMessage(ERROR_RATE_LIMIT_MESSAGE);
          setServiceStatus('degraded');
          throw new Error(ERROR_RATE_LIMIT_MESSAGE);
        } else {
          setServiceStatus('unavailable');
          throw new Error(`Error en la respuesta del servicio: ${inferenceResponse.statusText}`);
        }
      }
      
      const responseData = await inferenceResponse.json();
      
      // Extraer el contenido de la respuesta
      const messageContent = responseData.response;
      
      // Añadir la respuesta del asistente al estado
      addAssistantMessage(messageContent);
      setConnectionStatus('connected');
      
      return messageContent;
    } catch (error: any) {
      // Manejar los errores
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive"
      });
      console.error("Error procesando mensaje:", error);
      setConnectionStatus('error');
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
