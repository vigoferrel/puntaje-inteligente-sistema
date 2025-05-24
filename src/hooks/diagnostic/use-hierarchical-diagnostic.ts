
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  LearningNode,
  NodeWeight,
  PAESTest,
  PAESSkill,
  TierPriority,
  DiagnosticTest
} from "@/types/diagnostic";
import {
  fetchPAESTests,
  fetchPAESSkills,
  fetchLearningNodes,
  fetchTier1CriticalNodes,
  fetchUserNodeWeights,
  getRecommendedLearningPath,
  getSystemMetrics,
  fetchDiagnosticTests
} from "@/services/diagnostic";

interface HierarchicalDiagnosticState {
  // PAES System Data
  paesTests: PAESTest[];
  paesSkills: PAESSkill[];
  
  // Learning Nodes
  learningNodes: LearningNode[];
  tier1Nodes: LearningNode[];
  recommendedPath: LearningNode[];
  
  // User-specific Data
  userWeights: NodeWeight[];
  
  // System Metrics
  systemMetrics: {
    totalNodes: number;
    tier1Count: number;
    tier2Count: number;
    tier3Count: number;
    distributionByTest: Record<string, number>;
    avgBloomLevel: number;
  };
  
  // Diagnostic Tests (existing)
  diagnosticTests: DiagnosticTest[];
  
  // Loading States
  loading: boolean;
  error: string | null;
}

export const useHierarchicalDiagnostic = () => {
  const { user } = useAuth();
  
  const [state, setState] = useState<HierarchicalDiagnosticState>({
    paesTests: [],
    paesSkills: [],
    learningNodes: [],
    tier1Nodes: [],
    recommendedPath: [],
    userWeights: [],
    systemMetrics: {
      totalNodes: 0,
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      distributionByTest: {},
      avgBloomLevel: 3.2
    },
    diagnosticTests: [],
    loading: false,
    error: null
  });

  // Load PAES Tests
  const loadPAESTests = useCallback(async () => {
    try {
      const tests = await fetchPAESTests();
      setState(prev => ({ ...prev, paesTests: tests }));
      return tests;
    } catch (error) {
      console.error('Error loading PAES tests:', error);
      return [];
    }
  }, []);

  // Load PAES Skills
  const loadPAESSkills = useCallback(async (testId?: number) => {
    try {
      const skills = await fetchPAESSkills(testId);
      setState(prev => ({ ...prev, paesSkills: skills }));
      return skills;
    } catch (error) {
      console.error('Error loading PAES skills:', error);
      return [];
    }
  }, []);

  // Load Learning Nodes by tier
  const loadLearningNodes = useCallback(async (options: {
    tierPriority?: TierPriority;
    testId?: number;
    skillId?: number;
    limit?: number;
  } = {}) => {
    try {
      const { nodes } = await fetchLearningNodes(options);
      setState(prev => ({ ...prev, learningNodes: nodes }));
      return nodes;
    } catch (error) {
      console.error('Error loading learning nodes:', error);
      return [];
    }
  }, []);

  // Load Tier 1 Critical Nodes
  const loadTier1Nodes = useCallback(async (testId?: number) => {
    try {
      const nodes = await fetchTier1CriticalNodes(testId);
      setState(prev => ({ ...prev, tier1Nodes: nodes }));
      return nodes;
    } catch (error) {
      console.error('Error loading tier 1 nodes:', error);
      return [];
    }
  }, []);

  // Load user's adaptive weights
  const loadUserWeights = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      const weights = await fetchUserNodeWeights(user.id);
      setState(prev => ({ ...prev, userWeights: weights }));
      return weights;
    } catch (error) {
      console.error('Error loading user weights:', error);
      return [];
    }
  }, [user?.id]);

  // Get recommended learning path
  const loadRecommendedPath = useCallback(async (testId?: number, maxNodes: number = 10) => {
    if (!user?.id) return [];
    
    try {
      const path = await getRecommendedLearningPath(user.id, testId, maxNodes);
      setState(prev => ({ ...prev, recommendedPath: path }));
      return path;
    } catch (error) {
      console.error('Error loading recommended path:', error);
      return [];
    }
  }, [user?.id]);

  // Load system metrics
  const loadSystemMetrics = useCallback(async () => {
    try {
      const metrics = await getSystemMetrics();
      setState(prev => ({ ...prev, systemMetrics: metrics }));
      return metrics;
    } catch (error) {
      console.error('Error loading system metrics:', error);
      return state.systemMetrics;
    }
  }, [state.systemMetrics]);

  // Load diagnostic tests (existing functionality)
  const loadDiagnosticTests = useCallback(async () => {
    if (!user?.id) return [];
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const tests = await fetchDiagnosticTests(user.id, 50);
      setState(prev => ({ 
        ...prev, 
        diagnosticTests: tests,
        loading: false
      }));
      
      return tests;
    } catch (error) {
      console.error('Error loading diagnostic tests:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: "Error al cargar los diagnósticos"
      }));
      return [];
    }
  }, [user?.id]);

  // Initialize all data
  const initializeHierarchicalSystem = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Load system data in parallel
      const [tests, skills, tier1Nodes, metrics] = await Promise.all([
        loadPAESTests(),
        loadPAESSkills(),
        loadTier1Nodes(),
        loadSystemMetrics()
      ]);

      // Load user-specific data if authenticated
      if (user?.id) {
        await Promise.all([
          loadUserWeights(),
          loadRecommendedPath(),
          loadDiagnosticTests()
        ]);
      }

      setState(prev => ({ ...prev, loading: false }));
      
      console.log('✅ Hierarchical system initialized:', {
        paesTests: tests.length,
        skills: skills.length,
        tier1Nodes: tier1Nodes.length,
        totalNodes: metrics.totalNodes
      });

    } catch (error) {
      console.error('Error initializing hierarchical system:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: "Error al inicializar el sistema jerárquico"
      }));
      
      toast({
        title: "Error de inicialización",
        description: "No se pudo cargar el sistema jerárquico",
        variant: "destructive"
      });
    }
  }, [user?.id, loadPAESTests, loadPAESSkills, loadTier1Nodes, loadSystemMetrics, loadUserWeights, loadRecommendedPath, loadDiagnosticTests]);

  // Auto-initialize on mount
  useEffect(() => {
    initializeHierarchicalSystem();
  }, [initializeHierarchicalSystem]);

  return {
    // State
    ...state,
    
    // Actions
    loadPAESTests,
    loadPAESSkills,
    loadLearningNodes,
    loadTier1Nodes,
    loadUserWeights,
    loadRecommendedPath,
    loadSystemMetrics,
    loadDiagnosticTests,
    initializeHierarchicalSystem,
    
    // Computed values
    isSystemReady: state.paesTests.length > 0 && state.tier1Nodes.length > 0,
    tier1Coverage: state.tier1Nodes.length > 0 ? (state.tier1Nodes.length / state.systemMetrics.totalNodes) * 100 : 0,
    hasUserData: user?.id && state.userWeights.length > 0
  };
};
