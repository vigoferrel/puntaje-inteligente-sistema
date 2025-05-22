
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { ActionType } from '@/components/lectoguia/action-buttons/ContextualActionButtons';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

export function useContextualActions(
  setActiveTab: (tab: string) => void,
  handleExerciseRequest: () => Promise<boolean>,
) {
  const { addAssistantMessage } = useLectoGuiaChat();

  const handleAction = useCallback(async (
    action: ActionType, 
    params?: Record<string, any>
  ) => {
    switch (action) {
      case 'practice':
        // Solicitar un ejercicio y cambiar a la pestaña de ejercicios
        await handleExerciseRequest();
        break;
        
      case 'explain':
        // Cambiar a la pestaña de chat y solicitar explicación
        setActiveTab('chat');
        
        // Determinar qué mensaje mostrar según los parámetros
        const concept = params?.concept || '';
        const skill = params?.skill as TPAESHabilidad;
        const prueba = params?.prueba as TPAESPrueba;
        
        let message = "¿Sobre qué concepto específico te gustaría recibir una explicación?";
        
        if (concept) {
          message = `¿Te gustaría recibir una explicación sobre "${concept}"? Puedes preguntarme los detalles que necesites.`;
        } else if (skill) {
          message = `Puedes preguntarme sobre la habilidad "${skill}" o cualquier concepto relacionado que te gustaría entender mejor.`;
        } else if (prueba) {
          message = `Estoy listo para explicarte cualquier tema relacionado con ${prueba}. ¿Qué te gustaría aprender?`;
        }
        
        addAssistantMessage(message);
        break;
        
      case 'progress':
        // Cambiar a la pestaña de progreso
        setActiveTab('progress');
        toast({
          title: "Visualización de progreso",
          description: "Explora tus habilidades y avances en el mapa de aprendizaje."
        });
        break;
        
      case 'example':
        // Cambiar a la pestaña de chat y mostrar ejemplo
        setActiveTab('chat');
        addAssistantMessage("Aquí tienes un ejemplo práctico que te ayudará a entender mejor este concepto. ¿Te gustaría ver más ejemplos o prefieres que te explique algún aspecto específico?");
        break;
        
      case 'related':
        // Mostrar ejercicios relacionados
        toast({
          title: "Ejercicios relacionados",
          description: "Generando ejercicios del mismo tema y habilidad..."
        });
        await handleExerciseRequest();
        break;
        
      default:
        console.warn(`Acción desconocida: ${action}`);
        break;
    }
  }, [setActiveTab, handleExerciseRequest, addAssistantMessage]);

  return { handleAction };
}
