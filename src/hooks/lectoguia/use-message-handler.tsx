
import { useCallback } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook para manejar mensajes en LectoGuia de forma resiliente
 * con mejor manejo de errores y experiencia offline
 */
export function useMessageHandler(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  // Obtener funcionalidades del chat
  const { 
    processUserMessage,
    addAssistantMessage,
    connectionStatus,
    serviceStatus
  } = useLectoGuiaChat();
  
  /**
   * Maneja el envío de mensajes del usuario con detección de intención
   */
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    // Detectar si el mensaje contiene una solicitud de ejercicio
    const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                              message.toLowerCase().includes("practica") || 
                              message.toLowerCase().includes("ejemplo") ||
                              message.toLowerCase().includes("problema");
    
    // Detectar si el mensaje contiene una solicitud de diagnóstico
    const isDiagnosticRequest = message.toLowerCase().includes("diagnóstico") || 
                               message.toLowerCase().includes("diagnostico") ||
                               message.toLowerCase().includes("evalúa") ||
                               message.toLowerCase().includes("evalua") ||
                               message.toLowerCase().includes("nivel");
    
    // Analizar primero el contenido del mensaje para determinar la acción apropiada
    if (isExerciseRequest && !imageData) {
      // Si es una solicitud de ejercicio y no hay imagen
      addAssistantMessage("Generando un ejercicio para practicar...");
      
      // Verificar si el sistema está online
      if (connectionStatus === 'connected' && serviceStatus === 'available') {
        setActiveTab('exercise');
      } else {
        // Si está offline, explicar la limitación
        addAssistantMessage(
          "Lo siento, la generación de ejercicios requiere una conexión estable. " +
          "Por favor intenta más tarde o verifica tu conexión a internet."
        );
      }
    } else if (isDiagnosticRequest && !imageData) {
      // Si es una solicitud de diagnóstico y no hay imagen
      addAssistantMessage("Preparando una evaluación diagnóstica...");
      
      // Verificar si el sistema está online
      if (connectionStatus === 'connected' && serviceStatus === 'available') {
        setActiveTab('progress');
      } else {
        // Si está offline, explicar la limitación
        addAssistantMessage(
          "Lo siento, la generación de diagnósticos requiere una conexión estable. " +
          "Por favor intenta más tarde o verifica tu conexión a internet."
        );
      }
    } else {
      // Procesar como un mensaje normal
      try {
        await processUserMessage(message, imageData);
      } catch (error) {
        console.error("Error al procesar mensaje:", error);
        
        toast({
          title: "Error",
          description: "Ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.",
          variant: "destructive"
        });
        
        addAssistantMessage(
          "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo."
        );
      }
    }
  }, [processUserMessage, addAssistantMessage, connectionStatus, serviceStatus, setActiveTab]);
  
  /**
   * Inicia una simulación con el asistente
   */
  const handleStartSimulation = useCallback(async (subject: string = 'general') => {
    try {
      // Cambiar a la pestaña de chat
      setActiveTab('chat');
      
      // Mensaje de bienvenida a la simulación
      addAssistantMessage(
        `¡Vamos a comenzar una simulación en ${subject}! ` +
        `Te haré preguntas para evaluar tu nivel de conocimiento. ` +
        `Responde lo mejor que puedas, y yo te daré retroalimentación.`
      );
      
      // Verificar conexión antes de continuar
      if (connectionStatus !== 'connected' || serviceStatus !== 'available') {
        addAssistantMessage(
          "Sin embargo, noto que hay problemas de conexión en este momento. " +
          "Las simulaciones requieren conexión estable. " +
          "Por favor verifica tu conexión e intenta nuevamente."
        );
        return;
      }
      
      // Primera pregunta de la simulación
      setTimeout(() => {
        processUserMessage(`Inicia simulación de ${subject}`, undefined);
      }, 1500);
    } catch (error) {
      console.error("Error al iniciar simulación:", error);
      
      toast({
        title: "Error",
        description: "No se pudo iniciar la simulación. Por favor intenta más tarde.",
        variant: "destructive"
      });
    }
  }, [setActiveTab, addAssistantMessage, processUserMessage, connectionStatus, serviceStatus]);
  
  return {
    handleSendMessage,
    handleStartSimulation
  };
}
