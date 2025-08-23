
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NodeProgress } from '@/types/node-progress';
import { toast } from '@/components/ui/use-toast';

export function useNodeProgress(userId?: string) {
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar el progreso de los nodos
  const loadNodeProgress = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Convertir a formato de mapa
      const progressMap: Record<string, NodeProgress> = {};
      data?.forEach(progress => {
        progressMap[progress.node_id] = {
          nodeId: progress.node_id,
          status: progress.status as 'not_started' | 'in_progress' | 'completed',
          progress: progress.progress || 0,
          timeSpentMinutes: progress.time_spent_minutes || 0,
          // Removemos learning_phase ya que no existe en la base de datos
        };
      });

      setNodeProgress(progressMap);
    } catch (error) {
      console.error('Error loading node progress:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      toast({
        title: "Error",
        description: "No se pudo cargar el progreso de los nodos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Función para actualizar el progreso de un nodo
  const updateNodeProgress = useCallback(async (
    nodeId: string, 
    progress: number, 
    status?: 'not_started' | 'in_progress' | 'completed'
  ) => {
    if (!userId) return false;

    try {
      // Determinar el estado basado en el progreso si no se especifica
      let finalStatus = status;
      if (!finalStatus) {
        if (progress === 0) finalStatus = 'not_started';
        else if (progress >= 1) finalStatus = 'completed';
        else finalStatus = 'in_progress';
      }

      const { error } = await supabase
        .from('user_node_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          progress: Math.min(1, Math.max(0, progress)),
          status: finalStatus,
          last_activity_at: new Date().toISOString()
        });

      if (error) throw error;

      // Actualizar el estado local
      setNodeProgress(prev => ({
        ...prev,
        [nodeId]: {
          nodeId,
          status: finalStatus!,
          progress: Math.min(1, Math.max(0, progress)),
          timeSpentMinutes: prev[nodeId]?.timeSpentMinutes || 0,
        }
      }));

      return true;
    } catch (error) {
      console.error('Error updating node progress:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del nodo",
        variant: "destructive"
      });
      return false;
    }
  }, [userId]);

  // Cargar progreso al montar o cambiar usuario
  useEffect(() => {
    loadNodeProgress();
  }, [loadNodeProgress]);

  return {
    nodeProgress,
    loading,
    error,
    updateNodeProgress,
    refreshNodeProgress: loadNodeProgress
  };
}
