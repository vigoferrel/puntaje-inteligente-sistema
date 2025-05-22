
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useExerciseFlow } from './use-exercise-flow';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook para gestionar el manejo de mensajes en LectoGuia
 */
export function useMessageHandler(
  activeSubject: string,
  setActiveTab: (tab: string) => void
) {
  const { 
    processUserMessage, 
    detectSubjectFromMessage, 
    changeSubject 
  } = useLectoGuiaChat();
  
  const { 
    handleExerciseRequest, 
    skillMap 
  } = useExerciseFlow(activeSubject, setActiveTab);
  
  // Manejar el envío de mensajes
  const handleSendMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    // If there's an image, process it
    if (imageData) {
      await processUserMessage(message, imageData);
      return;
    }
    
    // Detectar la materia del mensaje y cambiar si es necesario
    const detectedSubject = detectSubjectFromMessage(message);
    if (detectedSubject && detectedSubject !== activeSubject) {
      changeSubject(detectedSubject);
    }
    
    // Detectar si el usuario está pidiendo información sobre alguna sección del sitio
    const isAboutDiagnostic = message.toLowerCase().includes("diagnóstico") || 
                              message.toLowerCase().includes("diagnostic");
    const isAboutPlan = message.toLowerCase().includes("plan") || 
                         message.toLowerCase().includes("aprendizaje");
    
    // Detectar si el usuario está pidiendo un ejercicio
    const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                              message.toLowerCase().includes("practica") || 
                              message.toLowerCase().includes("ejemplo");
    
    if (isExerciseRequest) {
      await handleExerciseRequest();
    } else if (isAboutDiagnostic || isAboutPlan) {
      // Procesamiento normal de mensajes con contexto específico
      await processUserMessage(message);
    } else {
      // Procesamiento normal de mensajes
      await processUserMessage(message);
    }
  };
  
  // Manejar inicio de simulación
  const handleStartSimulation = () => {
    toast({
      title: "Simulación",
      description: "Función en desarrollo. Estará disponible próximamente."
    });
  };
  
  return {
    handleSendMessage,
    handleStartSimulation
  };
}
