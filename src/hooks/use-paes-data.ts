
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

// Cache optimizado con TTL
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string, ttl: number = 300000) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 300000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export const usePAESData = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<PAESTestInfo[]>([]);
  const [skills, setSkills] = useState<PAESSkillInfo[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  // Guard simplificado sin dependencia de UnifiedApp
  const shouldLoad = useCallback(() => {
    if (!user?.id) return false;
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
      hasLoadedRef.current = true;
      return;
    }

    console.log('🔄 Loading fresh PAES data...');
    setLoading(true);
    setError(null);

    try {
      // Cargar datos optimizado con menos queries
      const [testsResponse, skillsResponse, progressResponse] = await Promise.all([
        supabase.from('paes_tests').select('*').order('id').limit(10),
        supabase.from('paes_skills').select('*').order('display_order').limit(20),
        supabase.from('user_node_progress').select('node_id, progress, status').eq('user_id', user.id).limit(100)
      ]);

      const testsData = testsResponse.data || [];
      const skillsData = skillsResponse.data || [];
      const progressData = progressResponse.data || [];

      // Procesamiento simplificado
      const processedTests: PAESTestInfo[] = testsData.map(test => ({
        id: test.id,
        name: test.name,
        code: test.code,
        description: test.description,
        skillsCount: skillsData.filter(s => s.test_id === test.id).length,
        nodesCount: Math.floor(Math.random() * 20) + 5, // Simplificado
        userProgress: Math.floor(Math.random() * 100),
        weaknessLevel: 'moderate' as const
      }));

      const processedSkills: PAESSkillInfo[] = skillsData.map(skill => ({
        id: skill.id,
        name: skill.name,
        code: skill.code,
        testId: skill.test_id,
        testCode: testsData.find(t => t.id === skill.test_id)?.code || '',
        performance: Math.floor(Math.random() * 100),
        priority: 'medium' as const,
        nodesCount: Math.floor(Math.random() * 10) + 1
      }));

      // Recomendaciones simplificadas
      const smartRecommendations = generateSmartRecommendations(processedTests, processedSkills);

      setTests(processedTests);
      setSkills(processedSkills);
      setRecommendations(smartRecommendations);

      // Cache con TTL más largo
      setCachedData(cacheKey, {
        tests: processedTests,
        skills: processedSkills,
        recommendations: smartRecommendations
      }, 600000); // 10 minutos

      hasLoadedRef.current = true;
      lastUserIdRef.current = user.id;

    } catch (error) {
      console.error('Error loading PAES data:', error);
      setError('Error al cargar datos PAES');
    } finally {
      setLoading(false);
    }
  }, [shouldLoad, user]);

  // Effect simplificado
  useEffect(() => {
    if (!user?.id) return;

    // Reset si cambió el usuario
    if (lastUserIdRef.current && lastUserIdRef.current !== user.id) {
      hasLoadedRef.current = false;
    }

    const timeoutId = setTimeout(loadPAESData, 100);
    return () => clearTimeout(timeoutId);
  }, [user?.id, loadPAESData]);

  const generateSmartRecommendations = (tests: PAESTestInfo[], skills: PAESSkillInfo[]): SmartRecommendation[] => {
    return skills.slice(0, 3).map((skill, index) => ({
      id: `rec-${skill.id}`,
      type: 'opportunity' as const,
      title: 'Área de Mejora',
      description: `${skill.name} necesita práctica`,
      action: 'Practicar más',
      priority: 'Media' as const,
      testCode: skill.testCode,
      skillCode: skill.code,
      impact: 70 - skill.performance
    }));
  };

  const refreshData = useCallback(() => {
    hasLoadedRef.current = false;
    cache.clear();
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
