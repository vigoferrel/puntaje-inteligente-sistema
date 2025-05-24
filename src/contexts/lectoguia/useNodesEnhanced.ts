
import { useState, useEffect, useCallback } from 'react';
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

  // Enhanced wrapper for updateNodeProgress with improved validation
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

  // Function to change selected prueba with enhanced validation
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    console.log(`🔄 useNodesEnhanced: Cambiando prueba seleccionada: ${selectedPrueba} → ${prueba}`);
    
    setSelectedPrueba(prueba);
    const newTestId = PruebaMappingUtil.getTestIdFromPrueba(prueba);
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
  }, [selectedPrueba, nodes]);

  // Function to change by testId (for compatibility)
  const handleTestIdChange = useCallback((testId: number) => {
    console.log(`🔄 useNodesEnhanced: Cambiando testId: ${selectedTestId} → ${testId}`);
    
    setSelectedTestId(testId);
    const newPrueba = PruebaMappingUtil.getPruebaFromTestId(testId);
    if (newPrueba) {
      setSelectedPrueba(newPrueba);
      console.log(`📋 useNodesEnhanced: Nuevo testId ${testId} con prueba ${newPrueba}`);
    }
  }, [selectedTestId]);

  // Enhanced function to load nodes with validation and auto-correction
  const loadNodes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const transformedNodes = await NodeDataService.loadNodes();
      
      // Validate integrity of corrected data
      const { validation, validationStatus: newValidationStatus } = NodeValidationService.validateNodeIntegrity(transformedNodes);
      
      setValidationStatus(newValidationStatus);
      
      // Log coherence statistics
      PruebaMappingUtil.logCoherenceStats(transformedNodes);

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

  // Function to get filtered nodes for current prueba with validation
  const getFilteredNodes = useCallback(() => {
    return filterNodesWithValidation(nodes, selectedPrueba, true);
  }, [nodes, selectedPrueba]);

  // Load nodes on mount
  useEffect(() => {
    loadNodes();
  }, [loadNodes]);

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
    setSelectedTestId: useCallback((testId: number) => {
      setSelectedTestId(testId);
      const newPrueba = PruebaMappingUtil.getPruebaFromTestId(testId);
      if (newPrueba) {
        setSelectedPrueba(newPrueba);
      }
    }, []),
    
    // Functions
    handlePruebaChange,
    updateNodeProgress,
    refreshNodes: loadNodes,
    getFilteredNodes,
    validateNodeIntegrity: () => {
      const { validation, validationStatus: newValidationStatus } = NodeValidationService.validateNodeIntegrity(nodes);
      setValidationStatus(newValidationStatus);
      return validation;
    },
    
    // Mappings for compatibility
    pruebaToTestIdMap: PruebaMappingUtil.pruebaToTestIdMap,
    testIdToPruebaMap: PruebaMappingUtil.testIdToPruebaMap
  };
}
