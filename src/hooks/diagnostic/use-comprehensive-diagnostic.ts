
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ComprehensiveDiagnosticOrchestrator, ComprehensiveSystemData } from "@/services/diagnostic/comprehensive-orchestrator";

export const useComprehensiveDiagnostic = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ComprehensiveSystemData | null>(null);
  const [orchestrator, setOrchestrator] = useState<ComprehensiveDiagnosticOrchestrator | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize orchestrator
  useEffect(() => {
    if (user?.id) {
      const newOrchestrator = new ComprehensiveDiagnosticOrchestrator(user.id);
      setOrchestrator(newOrchestrator);
    }
  }, [user?.id]);

  // Initialize system data
  const initializeSystem = useCallback(async () => {
    if (!orchestrator) return;

    setIsInitializing(true);
    try {
      console.log('🔄 Inicializando sistema diagnóstico integral...');
      const systemData = await orchestrator.initializeSystem();
      setData(systemData);
      console.log('✅ Sistema inicializado exitosamente:', {
        diagnostics: systemData.diagnosticTests.length,
        exercises: systemData.officialExercises.length,
        nodes: systemData.systemMetrics.totalNodes
      });
    } catch (error) {
      console.error('❌ Error inicializando sistema diagnóstico:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [orchestrator]);

  // Auto-initialize when orchestrator is ready
  useEffect(() => {
    if (orchestrator) {
      initializeSystem();
    }
  }, [orchestrator, initializeSystem]);

  // Start quantum diagnostic
  const startQuantumDiagnostic = useCallback(async () => {
    if (!orchestrator) return false;
    
    try {
      const result = await orchestrator.startQuantumDiagnostic();
      console.log('🔬 Diagnóstico cuántico iniciado:', result);
      return result;
    } catch (error) {
      console.error('❌ Error iniciando diagnóstico cuántico:', error);
      return false;
    }
  }, [orchestrator]);

  return {
    data,
    isInitializing,
    isSystemReady: (data?.systemMetrics.isSystemReady && data?.diagnosticTests.length > 0) || false,
    startQuantumDiagnostic,
    refreshSystem: initializeSystem,
    
    // Easy access to data with safe defaults
    diagnosticTests: data?.diagnosticTests || [],
    officialExercises: data?.officialExercises || [],
    paesSkills: data?.paesSkills || [],
    systemMetrics: data?.systemMetrics || {
      totalNodes: 0,
      completedNodes: 0,
      availableTests: 0,
      isSystemReady: false
    }
  };
};
