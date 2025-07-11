
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { useNodeProgress } from '@/hooks/lectoguia/use-node-progress';
import { toast } from '@/components/ui/use-toast';
import { 
  filterNodesWithValidation, 
  validateNodesIntegrity 
} from '@/utils/node-validation';

export function useNodes(userId?: string) {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(1);
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    issuesCount: number;
  }>({
    isValid: true,
    issuesCount: 0
  });

  // Hook para manejar el progreso de nodos
  const { 
    nodeProgress, 
    updateNodeProgress, 
    loading: progressLoading 
  } = useNodeProgress(userId);

  // Mapeo bidireccional entre prueba y testId
  const pruebaToTestIdMap: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };

  const testIdToPruebaMap: Record<number, TPAESPrueba> = {
    1: 'COMPETENCIA_LECTORA',
    2: 'MATEMATICA_1',
    3: 'MATEMATICA_2',
    4: 'CIENCIAS',
    5: 'HISTORIA'
  };

  // Función para cambiar la prueba seleccionada
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    console.log(`🔄 useNodes: Cambiando prueba seleccionada: ${selectedPrueba} → ${prueba}`);
    
    setSelectedPrueba(prueba);
    const newTestId = pruebaToTestIdMap[prueba];
    setSelectedTestId(newTestId);
    
    console.log(`📋 useNodes: Nueva prueba ${prueba} con testId ${newTestId}`);
  }, [selectedPrueba, pruebaToTestIdMap]);

  // Función para cambiar por testId (para compatibilidad)
  const handleTestIdChange = useCallback((testId: number) => {
    console.log(`🔄 useNodes: Cambiando testId: ${selectedTestId} → ${testId}`);
    
    setSelectedTestId(testId);
    const newPrueba = testIdToPruebaMap[testId];
    if (newPrueba) {
      setSelectedPrueba(newPrueba);
      console.log(`📋 useNodes: Nuevo testId ${testId} con prueba ${newPrueba}`);
    }
  }, [selectedTestId, testIdToPruebaMap]);

  // Función para cargar nodos desde la base de datos
  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Cargando nodos de aprendizaje...');
      
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
          cognitive_level,
          subject_area,
          created_at,
          updated_at,
          paes_skills(name, code),
          paes_tests(name, code)
        `)
        .order('test_id', { ascending: true })
        .order('position', { ascending: true });

      if (error) throw error;

      // Transformar datos al formato esperado con todas las propiedades requeridas
      const transformedNodes: TLearningNode[] = data?.map(node => {
        const cognitiveLevel = node.cognitive_level || 'COMPRENDER';
        const subjectArea = node.subject_area || node.paes_tests?.code || 'COMPETENCIA_LECTORA';

        return {
          id: node.id,
          title: node.title,
          description: node.description || '',
          code: node.code || `${node.id.slice(0, 8)}`,
          position: node.position || 0,
          difficulty: node.difficulty as 'basic' | 'intermediate' | 'advanced',
          estimatedTimeMinutes: node.estimated_time_minutes || 30,
          skill: node.paes_skills?.code as any,
          prueba: node.paes_tests?.code as TPAESPrueba,
          skillId: node.skill_id || 1,
          testId: node.test_id || 1,
          dependsOn: node.depends_on || [],
          createdAt: node.created_at,
          updatedAt: node.updated_at,
          // Propiedades duales requeridas
          cognitive_level: cognitiveLevel,
          cognitiveLevel: cognitiveLevel,
          subject_area: subjectArea,
          subjectArea: subjectArea
        };
      }) || [];

      console.log(`✅ Nodos cargados: ${transformedNodes.length} total`);
      
      // Validar integridad
      const validation = validateNodesIntegrity(transformedNodes);
      setValidationStatus({
        isValid: validation.isValid,
        issuesCount: validation.issues.length
      });
      
      if (!validation.isValid) {
        console.warn(`⚠️ ${validation.issues.length} problemas de integridad detectados`);
      }
      
      // Log de distribución por prueba
      const nodesByPrueba = transformedNodes.reduce((acc, node) => {
        acc[node.prueba] = (acc[node.prueba] || 0) + 1;
        return acc;
      }, {} as Record<TPAESPrueba, number>);
      
      console.log('📈 Distribución de nodos por prueba:', nodesByPrueba);

      setNodes(transformedNodes);
    } catch (error) {
      console.error('❌ Error loading nodes:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
      toast({
        title: "Error",
        description: "No se pudieron cargar los nodos de aprendizaje",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener nodos filtrados por la prueba actual
  const getFilteredNodes = useCallback(() => {
    return filterNodesWithValidation(nodes, selectedPrueba, true);
  }, [nodes, selectedPrueba]);

  // Cargar nodos al montar el componente
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  return {
    // Estado base
    nodes,
    nodeProgress,
    loading: loading || progressLoading,
    error,
    validationStatus,
    
    // Estado de selección
    selectedTestId,
    selectedPrueba,
    setSelectedTestId: handleTestIdChange,
    
    // Funciones
    handlePruebaChange,
    updateNodeProgress,
    refreshNodes: loadNodes,
    getFilteredNodes,
    
    // Mapeos para compatibilidad
    pruebaToTestIdMap,
    testIdToPruebaMap
  };
}
