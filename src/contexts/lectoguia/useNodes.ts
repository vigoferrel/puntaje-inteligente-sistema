
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';
import { UseNodesState } from './types';
import { testIdToPrueba } from '@/types/paes-types';

export function useNodes(userId: string | null): UseNodesState {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});
  const [selectedTestId, setSelectedTestId] = useState<number>(1); // Default: Competencia lectora
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');

  // Actualizar prueba seleccionada cuando cambia el ID de prueba
  useEffect(() => {
    setSelectedPrueba(testIdToPrueba(selectedTestId));
  }, [selectedTestId]);
  
  // Cargar nodos para la prueba seleccionada
  useEffect(() => {
    const fetchLearningNodes = async () => {
      if (!selectedTestId) return;
      
      try {
        const { data, error } = await supabase
          .from('learning_nodes')
          .select('*, skill:paes_skills(*)')
          .eq('test_id', selectedTestId)
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          // Mapear los nodos desde la base de datos a la interfaz TLearningNode
          const formattedNodes: TLearningNode[] = data.map(node => ({
            id: node.id,
            title: node.title,
            description: node.description || '',
            // Convertir explícitamente a TPAESHabilidad
            skill: (node.skill?.code || 'INTERPRET_RELATE') as any,
            prueba: testIdToPrueba(node.test_id) || 'COMPETENCIA_LECTORA',
            difficulty: node.difficulty || 'basic',
            position: node.position,
            dependsOn: node.depends_on || [],
            estimatedTimeMinutes: node.estimated_time_minutes || 30,
            content: {
              theory: '',
              examples: [],
              exerciseCount: 0
            }
          }));
          
          setNodes(formattedNodes);
        }
      } catch (error) {
        console.error('Error fetching learning nodes:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los nodos de aprendizaje',
          variant: 'destructive'
        });
      }
    };
    
    fetchLearningNodes();
  }, [selectedTestId]);
  
  // Cargar progreso del usuario
  useEffect(() => {
    const fetchUserNodeProgress = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        if (data) {
          const progress: Record<string, NodeProgress> = {};
          data.forEach(item => {
            // Convertir el valor de string a uno de los tipos permitidos
            const validStatus = (item.status as "not_started" | "in_progress" | "completed") || "not_started";
            
            progress[item.node_id] = {
              nodeId: item.node_id,
              status: validStatus,
              progress: item.progress || 0,
              timeSpentMinutes: item.time_spent_minutes || 0
            };
          });
          
          setNodeProgress(progress);
        }
      } catch (error) {
        console.error('Error fetching user node progress:', error);
      }
    };
    
    fetchUserNodeProgress();
  }, [userId]);

  // No implementamos handleNodeSelect aquí porque depende de generateExerciseForNode
  // que está en otro hook. Se implementará en el provider.
  const handleNodeSelect = (nodeId: string) => {
    // Esta función será reemplazada en el provider
    console.log(`Node selected: ${nodeId}`);
  };
  
  return {
    nodes,
    nodeProgress,
    handleNodeSelect,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba
  };
}
