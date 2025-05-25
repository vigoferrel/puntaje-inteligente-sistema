import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { supabase } from '@/integrations/supabase/client';

export interface PAESTestInfo {
  id: number;
  name: string;
  code: string;
  description?: string;
  skillsCount: number;
  nodesCount: number;
  userProgress: number;
  weaknessLevel: 'critical' | 'moderate' | 'low' | 'good';
}

export interface PAESSkillInfo {
  id: number;
  name: string;
  code: string;
  testId: number;
  testCode: string;
  performance: number;
  priority: 'high' | 'medium' | 'low';
  nodesCount: number;
}

export interface SmartRecommendation {
  id: string;
  type: 'weakness' | 'opportunity' | 'strength';
  title: string;
  description: string;
  action: string;
  priority: 'Alta' | 'Media' | 'Baja';
  testCode: string;
  skillCode: string;
  impact: number;
}

// Cache mejorado con TTL
const enhancedCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string, ttl: number = 300000) => { // 5 min default TTL
  const cached = enhancedCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  enhancedCache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 300000) => {
  enhancedCache.set(key, { data, timestamp: Date.now(), ttl });
};

export const usePAESData = () => {
  const { user } = useAuth();
  const { setInitializationFlag, hasInitialized } = useUnifiedApp();
  const [tests, setTests] = useState<PAESTestInfo[]>([]);
  const [skills, setSkills] = useState<PAESSkillInfo[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isLoadingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Guard para evitar cargas duplicadas
  const shouldLoad = useCallback(() => {
    if (!user?.id) return false;
    if (isLoadingRef.current) return false;
    if (hasLoadedRef.current && lastUserIdRef.current === user.id) return false;
    return true;
  }, [user?.id]);

  const loadPAESData = useCallback(async () => {
    if (!shouldLoad()) {
      console.log('🛑 PAES data load blocked by guard');
      return;
    }

    const cacheKey = `paes_data_${user!.id}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      console.log('📦 Using cached PAES data');
      setTests(cached.tests);
      setSkills(cached.skills);
      setRecommendations(cached.recommendations);
      setInitializationFlag('paesData', true);
      hasLoadedRef.current = true;
      return;
    }

    console.log('🔄 Loading fresh PAES data...');
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Cargar datos básicos de forma optimizada
      const [testsResponse, skillsResponse, nodesResponse, progressResponse] = await Promise.all([
        supabase.from('paes_tests').select('*').order('id'),
        supabase.from('paes_skills').select('*').order('display_order'),
        supabase.from('learning_nodes').select('test_id, skill_id, id'),
        supabase.from('user_node_progress').select('node_id, progress, status').eq('user_id', user.id)
      ]);

      if (!isLoadingRef.current) return;

      const testsData = testsResponse.data || [];
      const skillsData = skillsResponse.data || [];
      const nodesData = nodesResponse.data || [];
      const progressData = progressResponse.data || [];

      // Procesar datos de tests
      const processedTests: PAESTestInfo[] = testsData.map(test => {
        const testNodes = nodesData.filter(node => node.test_id === test.id);
        const testSkills = skillsData.filter(skill => skill.test_id === test.id);
        
        const completedNodes = testNodes.filter(node => {
          const progress = progressData.find(p => p.node_id === node.id);
          return progress?.status === 'completed';
        }).length;
        
        const userProgress = testNodes.length > 0 ? (completedNodes / testNodes.length) * 100 : 0;
        const weaknessLevel = userProgress >= 75 ? 'good' : 
                           userProgress >= 50 ? 'low' :
                           userProgress >= 25 ? 'moderate' : 'critical';

        return {
          id: test.id,
          name: test.name,
          code: test.code,
          description: test.description,
          skillsCount: testSkills.length,
          nodesCount: testNodes.length,
          userProgress: Math.round(userProgress),
          weaknessLevel
        };
      });

      // Procesar datos de skills
      const processedSkills: PAESSkillInfo[] = skillsData.map(skill => {
        const skillNodes = nodesData.filter(node => node.skill_id === skill.id);
        const test = testsData.find(t => t.id === skill.test_id);
        
        const completedNodes = skillNodes.filter(node => {
          const progress = progressData.find(p => p.node_id === node.id);
          return progress?.status === 'completed';
        }).length;
        
        const performance = skillNodes.length > 0 ? (completedNodes / skillNodes.length) * 100 : 0;
        const priority = performance < 30 ? 'high' : performance < 60 ? 'medium' : 'low';

        return {
          id: skill.id,
          name: skill.name,
          code: skill.code,
          testId: skill.test_id,
          testCode: test?.code || '',
          performance: Math.round(performance),
          priority,
          nodesCount: skillNodes.length
        };
      });

      // Generar recomendaciones simplificadas
      const smartRecommendations = generateSmartRecommendations(processedTests, processedSkills);

      if (isLoadingRef.current) {
        setTests(processedTests);
        setSkills(processedSkills);
        setRecommendations(smartRecommendations);

        // Guardar en cache
        setCachedData(cacheKey, {
          tests: processedTests,
          skills: processedSkills,
          recommendations: smartRecommendations
        });
      }

    } catch (error) {
      console.error('Error loading PAES data:', error);
      if (isLoadingRef.current) {
        setError('Error al cargar datos PAES');
      }
    } finally {
      if (isLoadingRef.current) {
        isLoadingRef.current = false;
        setLoading(false);
      }
    }
  }, [shouldLoad, user, setInitializationFlag]);

  // Effect con guard adicional
  useEffect(() => {
    if (!user?.id || !hasInitialized) return;

    // Reset si cambió el usuario
    if (lastUserIdRef.current && lastUserIdRef.current !== user.id) {
      hasLoadedRef.current = false;
      isLoadingRef.current = false;
    }

    const timeoutId = setTimeout(loadPAESData, 50); // Debounce
    return () => clearTimeout(timeoutId);
  }, [user?.id, hasInitialized, loadPAESData]);

  const generateSmartRecommendations = (tests: PAESTestInfo[], skills: PAESSkillInfo[]): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];

    // Recomendaciones críticas (máximo 2)
    const criticalSkills = skills.filter(s => s.priority === 'high').slice(0, 2);
    criticalSkills.forEach(skill => {
      recommendations.push({
        id: `weakness-${skill.id}`,
        type: 'weakness',
        title: 'Área Crítica',
        description: `${skill.name} necesita atención (${skill.performance}%)`,
        action: 'Dedicar 50% del tiempo',
        priority: 'Alta',
        testCode: skill.testCode,
        skillCode: skill.code,
        impact: 100 - skill.performance
      });
    });

    // Oportunidades (máximo 2)
    const opportunitySkills = skills.filter(s => s.priority === 'medium').slice(0, 2);
    opportunitySkills.forEach(skill => {
      recommendations.push({
        id: `opportunity-${skill.id}`,
        type: 'opportunity',
        title: 'Oportunidad',
        description: `${skill.name} puede mejorar (${skill.performance}%)`,
        action: 'Incrementar práctica',
        priority: 'Media',
        testCode: skill.testCode,
        skillCode: skill.code,
        impact: 80 - skill.performance
      });
    });

    return recommendations.sort((a, b) => b.impact - a.impact);
  };

  const refreshData = useCallback(() => {
    hasLoadedRef.current = false;
    enhancedCache.clear();
    loadPAESData();
  }, [loadPAESData]);

  return {
    tests,
    skills,
    recommendations,
    loading,
    error,
    refreshData
  };
};
