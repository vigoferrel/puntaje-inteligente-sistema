
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
      const systemData = await orchestrator.initializeSystem();
      setData(systemData);
    } catch (error) {
      console.error('Error initializing comprehensive diagnostic system:', error);
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
    return await orchestrator.startQuantumDiagnostic();
  }, [orchestrator]);

  return {
    data,
    isInitializing,
    isSystemReady: data?.systemMetrics.isSystemReady || false,
    startQuantumDiagnostic,
    refreshSystem: initializeSystem,
    
    // Easy access to data
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
