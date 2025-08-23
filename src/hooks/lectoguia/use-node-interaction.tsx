
import { useState, useCallback } from 'react';
import { useNodeProgress } from './use-node-progress';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useLectoGuiaExercise } from '@/hooks/use-lectoguia-exercise';
import { TLearningNode } from '@/types/system-types';

/**
 * Hook para manejar interacciones con nodos de aprendizaje
 */
export function useNodeInteraction(
  userId?: string,
  setActiveTab?: (tab: string) => void
) {
  const [selectedNode, setSelectedNode] = useState<TLearningNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();
  
  // Hooks relacionados
  const { updateNodeProgress } = useNodeProgress(userId || profile?.id);
  const { generateExerciseForNode } = useLectoGuiaExercise();

  /**
   * Maneja la selección de un nodo
   * @param nodeId ID del nodo seleccionado
   * @returns Promise<boolean> True si se pudo seleccionar y cargar el nodo
   */
  const handleNodeSelect = useCallback(async (nodeId: string): Promise<boolean> => {
    if (!nodeId) return false;
    setIsLoading(true);
    
    try {
      // Marcar el nodo como en progreso
      if (userId || profile?.id) {
        await updateNodeProgress(
          nodeId,
          0.1, // Iniciar con un 10% de progreso
          'in_progress'
        );
      }
      
      // Generar un ejercicio para este nodo
      const success = await generateExerciseForNode(nodeId);
      
      // Cambiar a la pestaña de ejercicios si se generó exitosamente
      if (success && setActiveTab) {
        setActiveTab('exercise');
        toast({
          title: "Nodo de aprendizaje activado",
          description: "Se ha generado un ejercicio relacionado con este nodo.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error al seleccionar nodo:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el contenido del nodo",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, profile?.id, updateNodeProgress, generateExerciseForNode, setActiveTab]);

  return {
    selectedNode,
    setSelectedNode,
    isLoading,
    handleNodeSelect
  };
}
