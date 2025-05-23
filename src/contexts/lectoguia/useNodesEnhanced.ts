
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { useNodeProgress } from '@/hooks/lectoguia/use-node-progress';
import { toast } from '@/components/ui/use-toast';
import { 
  filterNodesWithValidation, 
  validateNodesIntegrity,
  validateNodeThematicCoherence 
} from '@/utils/node-validation';

export function useNodesEnhanced(userId?: string) {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(1);
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    issuesCount: number;
    lastValidation?: Date;
  }>({
    isValid: true,
    issuesCount: 0
  });

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

  // Función para cambiar la prueba seleccionada con validación
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    console.log(`🔄 useNodesEnhanced: Cambiando prueba seleccionada: ${selectedPrueba} → ${prueba}`);
    
    setSelectedPrueba(prueba);
    const newTestId = pruebaToTestIdMap[prueba];
    setSelectedTestId(newTestId);
    
    // Validar que tenemos nodos para esta prueba
    const filteredNodes = filterNodesWithValidation(nodes, prueba, true);
    
    if (filteredNodes.length === 0 && nodes.length > 0) {
      toast({
        title: "Atención",
        description: `No se encontraron nodos para ${prueba}. Verificando integridad de datos...`,
        variant: "destructive"
      });
    }
    
    console.log(`📋 useNodesEnhanced: Nueva prueba ${prueba} con ${filteredNodes.length} nodos válidos`);
  }, [selectedPrueba, pruebaToTestIdMap, nodes]);

  // Función para cambiar por testId (para compatibilidad)
  const handleTestIdChange = useCallback((testId: number) => {
    console.log(`🔄 useNodesEnhanced: Cambiando testId: ${selectedTestId} → ${testId}`);
    
    setSelectedTestId(testId);
    const newPrueba = testIdToPruebaMap[testId];
    if (newPrueba) {
      setSelectedPrueba(newPrueba);
      console.log(`📋 useNodesEnhanced: Nuevo testId ${testId} con prueba ${newPrueba}`);
    }
  }, [selectedTestId, testIdToPruebaMap]);

  // Función para validar integridad de nodos
  const validateNodeIntegrity = useCallback((loadedNodes: TLearningNode[]) => {
    const validation = validateNodesIntegrity(loadedNodes);
    
    setValidationStatus({
      isValid: validation.isValid,
      issuesCount: validation.issues.length,
      lastValidation: new Date()
    });

    if (!validation.isValid) {
      console.warn('🚨 Problemas de integridad detectados:', validation);
      
      // Agrupar issues por tipo
      const thematicIssues = validation.issues.filter(i => i.type === 'thematic_mismatch');
      const skillIssues = validation.issues.filter(i => i.type === 'skill_mismatch');
      
      if (thematicIssues.length > 0) {
        toast({
          title: "Inconsistencias Detectadas",
          description: `${thematicIssues.length} nodos tienen contenido incoherente con su categoría`,
          variant: "destructive"
        });
      }
    }

    return validation;
  }, []);

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
          created_at,
          updated_at,
          paes_skills(name, code),
          paes_tests(name, code)
        `)
        .order('test_id', { ascending: true })
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

      console.log(`✅ Nodos cargados: ${transformedNodes.length} total`);
      
      // Validar integridad
      const validation = validateNodeIntegrity(transformedNodes);
      
      // Log de distribución por prueba
      const nodesByPrueba = transformedNodes.reduce((acc, node) => {
        acc[node.prueba] = (acc[node.prueba] || 0) + 1;
        return acc;
      }, {} as Record<TPAESPrueba, number>);
      
      console.log('📈 Distribución de nodos por prueba:', nodesByPrueba);

      if (validation.issuesFound > 0) {
        console.log(`⚠️ Validación completada: ${validation.summary.validNodes}/${validation.summary.totalNodes} nodos válidos`);
      }

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
  }, [validateNodeIntegrity]);

  // Función para obtener nodos filtrados por la prueba actual con validación
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
    validateNodeIntegrity: () => validateNodeIntegrity(nodes),
    
    // Mapeos para compatibilidad
    pruebaToTestIdMap,
    testIdToPruebaMap
  };
}
