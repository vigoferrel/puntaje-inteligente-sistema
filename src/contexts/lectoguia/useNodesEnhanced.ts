
import { useState, useEffect, useCallback, useMemo } from 'react';
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { NodeStatus } from '@/types/node-progress';
import { useNodeProgress } from '@/hooks/lectoguia/use-node-progress';
import { toast } from '@/components/ui/use-toast';
import { filterNodesWithValidation } from '@/utils/node-validation';
import { NodeDataService } from './services/nodeDataService';
import { NodeValidationService } from './services/nodeValidationService';
import { PruebaMappingUtil } from './utils/pruebaMapping';

export function useNodesEnhanced(userId?: string) {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(1);
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidationTime, setLastValidationTime] = useState<number>(0);

  // Optimized validation status with memoization
  const validationStatus = useMemo(() => {
    // Only validate if nodes changed and enough time passed
    const now = Date.now();
    if (nodes.length === 0 || (now - lastValidationTime) < 5000) {
      return {
        isValid: true,
        issuesCount: 0,
        lastValidation: new Date()
      };
    }

    const { validation } = NodeValidationService.validateNodeIntegrity(nodes);
    
    // Use Set to avoid duplicate issue counting
    const uniqueIssueNodes = new Set(validation.issues.map(issue => issue.nodeId));
    
    setLastValidationTime(now);
    
    return {
      isValid: validation.isValid,
      issuesCount: uniqueIssueNodes.size, // Count unique nodes with issues, not total issues
      lastValidation: new Date()
    };
  }, [nodes, lastValidationTime]);

  const { 
    nodeProgress, 
    updateNodeProgress: originalUpdateNodeProgress, 
    loading: progressLoading 
  } = useNodeProgress(userId);

  // Memoized update function
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

  // Optimized prueba change handler
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    if (prueba === selectedPrueba) return; // Avoid unnecessary changes
    
    console.log(`🔄 useNodesEnhanced: Cambiando prueba seleccionada: ${selectedPrueba} → ${prueba}`);
    
    setSelectedPrueba(prueba);
    const newTestId = PruebaMappingUtil.getTestIdFromPrueba(prueba);
    setSelectedTestId(newTestId);
    
    // Debounced validation
    setTimeout(() => {
      const filteredNodes = filterNodesWithValidation(nodes, prueba, false); // Disable excessive logging
      
      if (filteredNodes.length === 0 && nodes.length > 0) {
        toast({
          title: "Atención",
          description: `No se encontraron nodos para ${prueba}. Los datos han sido corregidos automáticamente.`,
          variant: "destructive"
        });
      }
      
      console.log(`📋 useNodesEnhanced: Nueva prueba ${prueba} con ${filteredNodes.length} nodos válidos`);
    }, 100);
  }, [selectedPrueba, nodes]);

  // Optimized test ID change handler
  const handleTestIdChange = useCallback((testId: number) => {
    if (testId === selectedTestId) return; // Avoid unnecessary changes
    
    console.log(`🔄 useNodesEnhanced: Cambiando testId: ${selectedTestId} → ${testId}`);
    
    setSelectedTestId(testId);
    const newPrueba = PruebaMappingUtil.getPruebaFromTestId(testId);
    if (newPrueba && newPrueba !== selectedPrueba) {
      setSelectedPrueba(newPrueba);
      console.log(`📋 useNodesEnhanced: Nuevo testId ${testId} con prueba ${newPrueba}`);
    }
  }, [selectedTestId, selectedPrueba]);

  // Optimized node loading with caching
  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = 'paes_nodes_v1';
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      // Use cache if less than 10 minutes old
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 600000) {
        const cachedNodes = JSON.parse(cached);
        setNodes(cachedNodes);
        console.log(`📦 Usando nodos del caché: ${cachedNodes.length} nodos`);
        setLoading(false);
        return;
      }

      const transformedNodes = await NodeDataService.loadNodes();
      
      // Cache the results
      localStorage.setItem(cacheKey, JSON.stringify(transformedNodes));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
      // Only log stats once per load
      PruebaMappingUtil.logCoherenceStats(transformedNodes);

      setNodes(transformedNodes);
      console.log(`✅ Nodos cargados y almacenados en caché: ${transformedNodes.length} total`);
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

  // Memoized filtered nodes
  const getFilteredNodes = useCallback(() => {
    return filterNodesWithValidation(nodes, selectedPrueba, false); // Reduce logging noise
  }, [nodes, selectedPrueba]);

  // Load nodes only once on mount
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

  // Memoized validation function
  const validateNodeIntegrity = useCallback(() => {
    const { validation, validationStatus: newValidationStatus } = NodeValidationService.validateNodeIntegrity(nodes);
    return validation;
  }, [nodes]);

  return {
    // Base state
    nodes,
    nodeProgress,
    loading: loading || progressLoading,
    error,
    validationStatus,
    
    // Selection state
    selectedTestId,
    selectedPrueba,
    setSelectedTestId: handleTestIdChange,
    
    // Functions
    handlePruebaChange,
    updateNodeProgress,
    refreshNodes: loadNodes,
    getFilteredNodes,
    validateNodeIntegrity,
    
    // Mappings for compatibility
    pruebaToTestIdMap: PruebaMappingUtil.pruebaToTestIdMap,
    testIdToPruebaMap: PruebaMappingUtil.testIdToPruebaMap
  };
}
