
import { supabase } from '@/integrations/supabase/client';
import { useGlobalStore } from '@/store/globalStore';

class UnifiedAPIService {
  private static instance: UnifiedAPIService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): UnifiedAPIService {
    if (!UnifiedAPIService.instance) {
      UnifiedAPIService.instance = new UnifiedAPIService();
    }
    return UnifiedAPIService.instance;
  }

  // Cache management
  private setCacheItem(key: string, data: any, ttlMinutes: number = 5) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }

  private getCacheItem(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Unified error handling
  private handleError(error: any, operation: string) {
    console.error(`❌ Error in ${operation}:`, error);
    
    const store = useGlobalStore.getState();
    store.actions.setError(`Error en ${operation}: ${error.message}`);
    
    return { data: null, error };
  }

  // Learning Nodes API
  async fetchLearningNodes(forceRefresh = false): Promise<{ data: any[] | null; error: any }> {
    const cacheKey = 'learning_nodes';
    
    if (!forceRefresh) {
      const cached = this.getCacheItem(cacheKey);
      if (cached) {
        console.log('📋 Using cached learning nodes');
        return { data: cached, error: null };
      }
    }

    try {
      const { data, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .order('position');

      if (error) throw error;

      this.setCacheItem(cacheKey, data, 10); // Cache for 10 minutes
      console.log(`✅ Fetched ${data?.length || 0} learning nodes`);
      
      return { data, error: null };
    } catch (error) {
      return this.handleError(error, 'fetchLearningNodes');
    }
  }

  // User Progress API
  async fetchUserProgress(userId: string, forceRefresh = false): Promise<{ data: any[] | null; error: any }> {
    const cacheKey = `user_progress_${userId}`;
    
    if (!forceRefresh) {
      const cached = this.getCacheItem(cacheKey);
      if (cached) {
        console.log('📊 Using cached user progress');
        return { data: cached, error: null };
      }
    }

    try {
      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      this.setCacheItem(cacheKey, data, 5); // Cache for 5 minutes
      console.log(`✅ Fetched progress for ${data?.length || 0} nodes`);
      
      return { data, error: null };
    } catch (error) {
      return this.handleError(error, 'fetchUserProgress');
    }
  }

  // Learning Plans API
  async fetchLearningPlans(userId: string, forceRefresh = false): Promise<{ data: any[] | null; error: any }> {
    const cacheKey = `learning_plans_${userId}`;
    
    if (!forceRefresh) {
      const cached = this.getCacheItem(cacheKey);
      if (cached) {
        console.log('📚 Using cached learning plans');
        return { data: cached, error: null };
      }
    }

    try {
      const { data, error } = await supabase
        .from('generated_study_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.setCacheItem(cacheKey, data, 15); // Cache for 15 minutes
      console.log(`✅ Fetched ${data?.length || 0} learning plans`);
      
      return { data, error: null };
    } catch (error) {
      return this.handleError(error, 'fetchLearningPlans');
    }
  }

  // Diagnostics API
  async fetchDiagnostics(forceRefresh = false): Promise<{ data: any[] | null; error: any }> {
    const cacheKey = 'diagnostics';
    
    if (!forceRefresh) {
      const cached = this.getCacheItem(cacheKey);
      if (cached) {
        console.log('🔬 Using cached diagnostics');
        return { data: cached, error: null };
      }
    }

    try {
      const { data, error } = await supabase
        .from('diagnostic_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.setCacheItem(cacheKey, data, 30); // Cache for 30 minutes
      console.log(`✅ Fetched ${data?.length || 0} diagnostic tests`);
      
      return { data, error: null };
    } catch (error) {
      return this.handleError(error, 'fetchDiagnostics');
    }
  }

  // PAES Data API
  async fetchPAESData(forceRefresh = false): Promise<{ data: any | null; error: any }> {
    const cacheKey = 'paes_data';
    
    if (!forceRefresh) {
      const cached = this.getCacheItem(cacheKey);
      if (cached) {
        console.log('🎯 Using cached PAES data');
        return { data: cached, error: null };
      }
    }

    try {
      const [testsResult, skillsResult] = await Promise.all([
        supabase.from('paes_tests').select('*'),
        supabase.from('paes_skills').select('*')
      ]);

      if (testsResult.error) throw testsResult.error;
      if (skillsResult.error) throw skillsResult.error;

      const data = {
        tests: testsResult.data,
        skills: skillsResult.data,
        lastUpdated: new Date().toISOString(),
      };

      this.setCacheItem(cacheKey, data, 60); // Cache for 1 hour
      console.log('✅ Fetched PAES data successfully');
      
      return { data, error: null };
    } catch (error) {
      return this.handleError(error, 'fetchPAESData');
    }
  }

  // Batch sync all user data
  async syncAllUserData(userId: string, forceRefresh = false): Promise<{
    learningNodes: any[];
    userProgress: any[];
    plans: any[];
    diagnostics: any[];
    paesData: any;
  } | null> {
    console.log('🔄 Starting unified data sync...');

    try {
      const [
        nodesResult,
        progressResult,
        plansResult,
        diagnosticsResult,
        paesResult
      ] = await Promise.all([
        this.fetchLearningNodes(forceRefresh),
        this.fetchUserProgress(userId, forceRefresh),
        this.fetchLearningPlans(userId, forceRefresh),
        this.fetchDiagnostics(forceRefresh),
        this.fetchPAESData(forceRefresh)
      ]);

      // Check for errors
      const errors = [
        nodesResult.error,
        progressResult.error,
        plansResult.error,
        diagnosticsResult.error,
        paesResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        console.warn('⚠️ Some sync operations failed:', errors);
      }

      const syncedData = {
        learningNodes: nodesResult.data || [],
        userProgress: progressResult.data || [],
        plans: plansResult.data || [],
        diagnostics: diagnosticsResult.data || [],
        paesData: paesResult.data || null,
      };

      // Update global store
      const store = useGlobalStore.getState();
      store.actions.setLearningNodes(syncedData.learningNodes);
      store.actions.setPlans(syncedData.plans);
      store.actions.setDiagnostics(syncedData.diagnostics);
      store.actions.setPaesData(syncedData.paesData);

      // Update progress
      syncedData.userProgress.forEach(progress => {
        store.actions.updateNodeProgress(progress.node_id, progress);
      });

      console.log('✅ Unified data sync completed');
      return syncedData;

    } catch (error) {
      console.error('❌ Critical error in data sync:', error);
      return null;
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ API cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const unifiedAPI = UnifiedAPIService.getInstance();
