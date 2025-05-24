import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { NodeStatus } from '@/types/node-progress';
import { useNodeProgress } from '@/hooks/lectoguia/use-node-progress';
import { toast } from '@/components/ui/use-toast';
import { 
  filterNodesWithValidation, 
  validateNodesIntegrity 
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
    updateNodeProgress: originalUpdateNodeProgress, 
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

  // Wrapper para updateNodeProgress con validación de tipos mejorada
  const updateNodeProgress = useCallback((nodeId: string, status: NodeStatus, progress: number) => {
    if (typeof nodeId !== 'string' || !nodeId.trim()) {
      console.error('❌ updateNodeProgress: nodeId debe ser string válido, recibido:', typeof nodeId, nodeId);
      return;
    }
    
    const progressNumber = typeof progress === 'string' ? parseFloat(progress) : progress;
    
    if (typeof progressNumber !== 'number' || progressNumber < 0 || progressNumber > 100 || isNaN(progressNumber)) {
      console.error('❌ updateNodeProgress: progress debe ser número 0-100, recibido:', typeof progress, progress);
      return;
    }
    
    const validStatuses: NodeStatus[] = ['not_started', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      console.error('❌ updateNodeProgress: status inválido, recibido:', status);
      return;
    }
    
    console.log(`✅ Actualizando progreso: nodeId=${nodeId}, status=${status}, progress=${progressNumber}`);
    
    const normalizedProgress = progressNumber / 100;
    originalUpdateNodeProgress(nodeId, normalizedProgress, status);
  }, [originalUpdateNodeProgress]);

  // Función para cambiar la prueba seleccionada con validación mejorada
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    console.log(`🔄 useNodesEnhanced: Cambiando prueba seleccionada: ${selectedPrueba} → ${prueba}`);
    
    setSelectedPrueba(prueba);
    const newTestId = pruebaToTestIdMap[prueba];
    setSelectedTestId(newTestId);
    
    const filteredNodes = filterNodesWithValidation(nodes, prueba, true);
    
    if (filteredNodes.length === 0 && nodes.length > 0) {
      toast({
        title: "Atención",
        description: `No se encontraron nodos para ${prueba}. Los datos han sido corregidos automáticamente.`,
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

  // Función mejorada para validar integridad con manejo de correcciones automáticas
  const validateNodeIntegrity = useCallback((loadedNodes: TLearningNode[]) => {
    console.log('🔍 Iniciando validación integral de nodos...');
    
    const validation = validateNodesIntegrity(loadedNodes);
    
    setValidationStatus({
      isValid: validation.isValid,
      issuesCount: validation.issues.length,
      lastValidation: new Date()
    });

    // Log detallado de resultados
    console.group('📊 Resultados de Validación Integral');
    console.log(`Total de nodos: ${validation.summary.totalNodes}`);
    console.log(`Nodos válidos: ${validation.summary.validNodes}`);
    console.log(`Problemas encontrados: ${validation.summary.issuesCount}`);
    
    if (validation.summary.issuesCount > 0) {
      console.log('📋 Distribución de problemas por tipo:');
      Object.entries(validation.summary.issuesByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
      
      console.log('🚨 Problemas detectados:');
      validation.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.type}] ${issue.description}`);
        if (issue.suggestion) {
          console.log(`     💡 Sugerencia: ${issue.suggestion}`);
        }
      });
    }
    console.groupEnd();

    if (!validation.isValid) {
      console.log('🔧 Sistema aplicó correcciones automáticas donde fue posible');
      
      toast({
        title: validation.summary.issuesCount === 0 ? "Validación Exitosa" : "Problemas Detectados",
        description: validation.summary.issuesCount === 0 
          ? `Sistema completamente coherente: ${validation.summary.totalNodes} nodos validados correctamente.`
          : `Se detectaron ${validation.summary.issuesCount} problemas en ${validation.summary.totalNodes - validation.summary.validNodes} nodos. Revisa la consola para detalles.`,
        variant: validation.summary.issuesCount === 0 ? "default" : "destructive"
      });
    } else {
      console.log('✅ Sistema validado: Todos los nodos son coherentes');
      toast({
        title: "Validación Exitosa",
        description: `Sistema completamente coherente: ${validation.summary.totalNodes} nodos validados correctamente.`,
      });
    }

    return validation;
  }, []);

  // Función mejorada para cargar nodos con mapeo corregido y auto-corrección
  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Cargando nodos con sistema de validación mejorado...');
      
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

      // Transformar datos con mapeo mejorado y auto-corrección
      const transformedNodes: TLearningNode[] = data?.map(node => {
        const mappedNode: TLearningNode = {
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
          // Propiedades ahora requeridas con valores por defecto seguros
          cognitive_level: node.cognitive_level || 'COMPRENDER',
          subject_area: node.subject_area || node.paes_tests?.code || 'COMPETENCIA_LECTORA'
        };

        // Aplicar auto-corrección
        return autoCorrectNodeIssues(mappedNode);
      }) || [];

      console.log(`✅ Nodos cargados y auto-corregidos: ${transformedNodes.length} total`);
      
      // Validar integridad de datos corregidos
      const validation = validateNodeIntegrity(transformedNodes);
      
      // Log de distribución corregida por prueba
      const nodesByPrueba = transformedNodes.reduce((acc, node) => {
        const key = `${node.prueba} (${node.subject_area})`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('📈 Distribución final de nodos por prueba:', nodesByPrueba);

      // Log de coherencia por test_id
      const coherenceByTest = transformedNodes.reduce((acc, node) => {
        const key = `Test ${node.testId}`;
        if (!acc[key]) acc[key] = { total: 0, coherent: 0 };
        acc[key].total++;
        
        const expectedSubjectArea = {
          1: 'COMPETENCIA_LECTORA',
          2: 'MATEMATICA_1', 
          3: 'MATEMATICA_2',
          4: 'CIENCIAS',
          5: 'HISTORIA'
        }[node.testId];
        
        if (node.subject_area === expectedSubjectArea && node.prueba === expectedSubjectArea) {
          acc[key].coherent++;
        }
        
        return acc;
      }, {} as Record<string, { total: number; coherent: number }>);

      console.log('🎯 Coherencia por test_id:', coherenceByTest);

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
    setSelectedTestId: useCallback((testId: number) => {
      setSelectedTestId(testId);
      const newPrueba = testIdToPruebaMap[testId];
      if (newPrueba) {
        setSelectedPrueba(newPrueba);
      }
    }, [testIdToPruebaMap]),
    
    // Funciones
    handlePruebaChange,
    updateNodeProgress,
    refreshNodes: loadNodes,
    getFilteredNodes: useCallback(() => {
      return filterNodesWithValidation(nodes, selectedPrueba, true);
    }, [nodes, selectedPrueba]),
    validateNodeIntegrity: () => validateNodeIntegrity(nodes),
    
    // Mapeos para compatibilidad
    pruebaToTestIdMap,
    testIdToPruebaMap
  };
}
