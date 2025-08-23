
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

type NodeStatus = 'not_started' | 'in_progress' | 'completed';

interface UseNodeProgressHandlerProps {
  updateNodeProgress: (nodeId: string, status: NodeStatus, progress: number) => void;
}

export function useNodeProgressHandler({ updateNodeProgress }: UseNodeProgressHandlerProps) {
  
  const handleUpdateNodeProgress = useCallback((nodeId: string, status: NodeStatus, progress: number) => {
    // Validación estricta de tipos
    if (typeof nodeId !== 'string' || !nodeId.trim()) {
      console.error('❌ Error: nodeId debe ser un string válido');
      toast({
        title: "Error",
        description: "ID de nodo inválido",
        variant: "destructive"
      });
      return false;
    }
    
    if (typeof progress !== 'number' || progress < 0 || progress > 100 || isNaN(progress)) {
      console.error('❌ Error: progress debe ser un número entre 0 y 100');
      toast({
        title: "Error", 
        description: "Progreso inválido",
        variant: "destructive"
      });
      return false;
    }
    
    const validStatuses: NodeStatus[] = ['not_started', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      console.error('❌ Error: status debe ser uno de:', validStatuses);
      toast({
        title: "Error",
        description: "Estado de nodo inválido", 
        variant: "destructive"
      });
      return false;
    }
    
    try {
      console.log(`📈 Actualizando progreso del nodo: ${nodeId}, estado: ${status}, progreso: ${progress}`);
      updateNodeProgress(nodeId, status, progress);
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar progreso del nodo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del nodo",
        variant: "destructive"
      });
      return false;
    }
  }, [updateNodeProgress]);
  
  return {
    handleUpdateNodeProgress
  };
}
