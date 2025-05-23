
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { useNodeProgress } from '@/hooks/lectoguia/use-node-progress';
import { toast } from '@/components/ui/use-toast';

export function useNodes(userId?: string) {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook para manejar el progreso de nodos
  const { 
    nodeProgress, 
    updateNodeProgress, 
    loading: progressLoading 
  } = useNodeProgress(userId);

  // Función para cargar nodos desde la base de datos
  const loadNodes = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('learning_nodes')
        .select(`
          id,
          title,
          description,
          code,
          position,
          difficulty,
          estimated_time_minutes,
          skill_id,
          test_id,
          depends_on,
          created_at,
          updated_at,
          paes_skills(name, code),
          paes_tests(name, code)
        `)
        .order('position', { ascending: true });

      if (error) throw error;

      // Transformar datos al formato esperado
      const transformedNodes: TLearningNode[] = data?.map(node => ({
        id: node.id,
        title: node.title,
        description: node.description,
        code: node.code,
        position: node.position,
        difficulty: node.difficulty as 'basic' | 'intermediate' | 'advanced',
        estimatedTimeMinutes: node.estimated_time_minutes,
        skill: node.paes_skills?.code as any,
        prueba: node.paes_tests?.code as TPAESPrueba,
        skillId: node.skill_id,
        testId: node.test_id,
        dependsOn: node.depends_on,
        createdAt: node.created_at,
        updatedAt: node.updated_at
      })) || [];

      setNodes(transformedNodes);
    } catch (error) {
      console.error('Error loading nodes:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      toast({
        title: "Error",
        description: "No se pudieron cargar los nodos de aprendizaje",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar nodos al montar el componente
  useEffect(() => {
    loadNodes();
  }, []);

  // Obtener la prueba seleccionada basada en el test ID
  const selectedPrueba: TPAESPrueba | undefined = (() => {
    if (!selectedTestId) return undefined;
    
    const testMap: Record<number, TPAESPrueba> = {
      1: 'COMPETENCIA_LECTORA',
      2: 'MATEMATICA_1', 
      3: 'MATEMATICA_2',
      4: 'CIENCIAS',
      5: 'HISTORIA'
    };
    
    return testMap[selectedTestId];
  })();

  return {
    nodes,
    nodeProgress,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba,
    loading: loading || progressLoading,
    error,
    updateNodeProgress,
    refreshNodes: loadNodes
  };
}
