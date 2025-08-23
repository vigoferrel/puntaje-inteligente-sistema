
import { useCallback } from 'react';
import { useLearningNodes } from '@/hooks/use-learning-nodes';
import { useLectoGuiaExercise } from '@/hooks/use-lectoguia-exercise';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { toast } from '@/components/ui/use-toast';
import { fetchNodeById } from '@/services/learning-node-service';

/**
 * Hook para gestionar la interacción con nodos de aprendizaje en LectoGuia
 */
export function useNodeInteraction(
  userId: string | undefined,
  setActiveTab: (tab: string) => void
) {
  const { updateNodeProgress } = useLearningNodes();
  const { addAssistantMessage } = useLectoGuiaChat();
  const { generateExerciseForNode } = useLectoGuiaExercise();

  // Manejar la selección de un nodo
  const handleNodeSelect = useCallback(async (nodeId: string) => {
    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para acceder a este nodo de aprendizaje",
        variant: "destructive"
      });
      return false;
    }

    try {
      // 1. Marcar el nodo como "in_progress"
      const nodeUpdateSuccess = await updateNodeProgress(
        userId,
        nodeId,
        'in_progress',
        0.1, // Iniciamos con un 10% de progreso
        1 // Añadimos un minuto de tiempo invertido inicialmente
      );

      if (!nodeUpdateSuccess) {
        throw new Error("No se pudo actualizar el estado del nodo");
      }

      // 2. Obtener los detalles del nodo
      const nodeDetails = await fetchNodeById(nodeId);
      if (!nodeDetails) {
        throw new Error("No se pudo obtener la información del nodo");
      }

      // 3. Cambiar a la pestaña de chat
      setActiveTab("chat");

      // 4. Generar mensaje del asistente sobre el nodo
      const welcomeMessage = `
Estamos trabajando ahora en el nodo de aprendizaje **${nodeDetails.title}**. 

Este nodo se enfoca en la habilidad **${nodeDetails.skill}** y tiene un nivel de dificultad **${nodeDetails.difficulty}**.

${nodeDetails.description}

Trabajemos en este tema para mejorar tu dominio. ¿Te gustaría comenzar con:
1. Una explicación del concepto principal
2. Ver un ejercicio de ejemplo
3. Practicar con un ejercicio relacionado
`;

      addAssistantMessage(welcomeMessage);

      // 5. Preparar un ejercicio relacionado con la habilidad del nodo
      const exercise = await generateExerciseForNode(nodeDetails);

      if (exercise) {
        // Cambiamos a la pestaña de ejercicios después de generarlo
        setTimeout(() => {
          setActiveTab("exercise");
          
          toast({
            title: "Ejercicio generado",
            description: "Se ha generado un ejercicio relacionado con este nodo de aprendizaje. ¡Resuélvelo para avanzar!",
          });
        }, 800);
      }

      return true;
    } catch (error) {
      console.error("Error al iniciar nodo de aprendizaje:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el nodo de aprendizaje",
        variant: "destructive"
      });
      return false;
    }
  }, [userId, updateNodeProgress, addAssistantMessage, generateExerciseForNode, setActiveTab]);

  return {
    handleNodeSelect
  };
}
