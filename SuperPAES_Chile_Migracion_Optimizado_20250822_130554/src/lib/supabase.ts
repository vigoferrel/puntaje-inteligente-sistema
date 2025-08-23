// ========================================
// SUPERPAES CHILE - CONFIGURACIÓN SUPABASE INTEGRADA
// ========================================
// Integra las mejores características de:
// - PAES-MASTER: Motor cuántico y métricas avanzadas
// - PAES-AGENTE: Sistema de IA y autenticación
// - PUNTAJE-INTELIGENTE: Arsenal educativo y gamificación
// - PAES-MVP: Sistema de cache y optimización

import { createClient } from '@supabase/supabase-js';

// ========================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ========================================

const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] || 'https://settifboilityelprvjd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env['VITE_SUPABASE_ANON_KEY'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ';


// ========================================
// TIPOS DE BASE DE DATOS INTEGRADOS
// ========================================

export interface Database {
  public: {
    Tables: {
      // ========================================
      // PAES-MASTER: Motor Cuántico
      // ========================================
      quantum_nodes: {
        Row: {
          id: string;
          node_id: string;
          subject: string;
          bloom_level: number;
          coherence: number;
          entropy: number;
          entanglement_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          node_id: string;
          subject: string;
          bloom_level: number;
          coherence?: number;
          entropy?: number;
          entanglement_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          node_id?: string;
          subject?: string;
          bloom_level?: number;
          coherence?: number;
          entropy?: number;
          entanglement_count?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      // ========================================
      // PAES-AGENTE: Sistema de IA
      // ========================================
      ai_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: string;
          request_count: number;
          average_response_time: number;
          model_accuracy: number;
          token_usage: number;
          memory_context: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: string;
          request_count?: number;
          average_response_time?: number;
          model_accuracy?: number;
          token_usage?: number;
          memory_context?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: string;
          request_count?: number;
          average_response_time?: number;
          model_accuracy?: number;
          token_usage?: number;
          memory_context?: number;
          created_at?: string;
        };
      };

      // ========================================
      // PUNTAJE-INTELIGENTE: Arsenal Educativo
      // ========================================
      bloom_progress: {
        Row: {
          id: string;
          user_id: string;
          level_id: string;
          subject: string;
          progress_percentage: number;
          activities_completed: number;
          total_activities: number;
          average_score: number;
          mastery_level: string;
          unlocked: boolean;
          time_spent_minutes: number;
          last_activity_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level_id: string;
          subject: string;
          progress_percentage?: number;
          activities_completed?: number;
          total_activities?: number;
          average_score?: number;
          mastery_level?: string;
          unlocked?: boolean;
          time_spent_minutes?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level_id?: string;
          subject?: string;
          progress_percentage?: number;
          activities_completed?: number;
          total_activities?: number;
          average_score?: number;
          mastery_level?: string;
          unlocked?: boolean;
          time_spent_minutes?: number;
          last_activity_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      bloom_activities: {
        Row: {
          id: string;
          level_id: string;
          subject: string;
          title: string;
          description: string | null;
          activity_type: string;
          difficulty: number;
          estimated_minutes: number;
          content_data: Record<string, unknown>;
          visual_config: Record<string, unknown>;
          prerequisites: string[];
          learning_objectives: string[] | null;
          tags: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          level_id: string;
          subject: string;
          title: string;
          description?: string | null;
          activity_type: string;
          difficulty?: number;
          estimated_minutes?: number;
          content_data?: Record<string, unknown>;
          visual_config?: Record<string, unknown>;
          prerequisites?: string[];
          learning_objectives?: string[] | null;
          tags?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          level_id?: string;
          subject?: string;
          title?: string;
          description?: string | null;
          activity_type?: string;
          difficulty?: number;
          estimated_minutes?: number;
          content_data?: Record<string, unknown>;
          visual_config?: Record<string, unknown>;
          prerequisites?: string[];
          learning_objectives?: string[] | null;
          tags?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // PAES-MVP: Sistema de Cache
      // ========================================
      cache_metrics: {
        Row: {
          id: string;
          cache_level: string;
          hit_rate: number;
          miss_rate: number;
          size_mb: number;
          compression_ratio: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cache_level: string;
          hit_rate?: number;
          miss_rate?: number;
          size_mb?: number;
          compression_ratio?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cache_level?: string;
          hit_rate?: number;
          miss_rate?: number;
          size_mb?: number;
          compression_ratio?: number;
          created_at?: string;
        };
      };

      // ========================================
      // SISTEMA DE USUARIOS Y GAMIFICACIÓN
      // ========================================
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          avatar: string;
          level: string;
          points: number;
          rank: string;
          streak_daily: number;
          streak_weekly: number;
          badges_obtained: number;
          current_node: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          avatar?: string;
          level?: string;
          points?: number;
          rank?: string;
          streak_daily?: number;
          streak_weekly?: number;
          badges_obtained?: number;
          current_node?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          avatar?: string;
          level?: string;
          points?: number;
          rank?: string;
          streak_daily?: number;
          streak_weekly?: number;
          badges_obtained?: number;
          current_node?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // ========================================
      // SPOTIFY NEURAL SYNC
      // ========================================
      spotify_playlists: {
        Row: {
          id: string;
          playlist_id: string;
          name: string;
          subject: string;
          neural_frequency: number;
          adaptation_rate: number;
          pattern_count: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          name: string;
          subject: string;
          neural_frequency?: number;
          adaptation_rate?: number;
          pattern_count?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          name?: string;
          subject?: string;
          neural_frequency?: number;
          adaptation_rate?: number;
          pattern_count?: number;
          status?: string;
          created_at?: string;
        };
      };

      // ========================================
      // SISTEMA DE SEGURIDAD
      // ========================================
      security_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          ip_address: string;
          user_agent: string;
          success: boolean;
          details: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          ip_address: string;
          user_agent: string;
          success?: boolean;
          details?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          ip_address?: string;
          user_agent?: string;
          success?: boolean;
          details?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // ========================================
      // FUNCIONES RPC INTEGRADAS
      // ========================================
      get_superpaes_dashboard: {
        Args: {
          p_user_id: string;
        };
        Returns: Record<string, unknown>;
      };
      
      record_quantum_session: {
        Args: {
          p_user_id: string;
          p_node_id: string;
          p_coherence: number;
          p_entropy: number;
        };
        Returns: Record<string, unknown>;
      };
      
      update_ai_metrics: {
        Args: {
          p_user_id: string;
          p_session_type: string;
          p_response_time: number;
          p_accuracy: number;
          p_tokens: number;
        };
        Returns: Record<string, unknown>;
      };
      
      get_recommended_activities: {
        Args: {
          p_user_id: string;
          p_limit?: number;
        };
        Returns: Record<string, unknown>[];
      };
      
      initialize_superpaes_user: {
        Args: {
          p_user_id: string;
        };
        Returns: Record<string, unknown>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// ========================================
// CLIENTE SUPABASE INTEGRADO
// ========================================

// ========================================
// CLIENTE SUPABASE ÚNICO - SIN MÚLTIPLES INSTANCIAS
// ========================================

// Configuración única para el cliente principal
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    storageKey: 'superpaes-unified-auth'
  },
  global: {
    headers: {
      'X-Client-Info': 'superpaes-chile-v1.0'
    }
  },
  db: {
    schema: 'public' as const
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

// ÚNICA INSTANCIA DE SUPABASE
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, supabaseConfig);

// Función para obtener auth
export const getAuth = () => supabase.auth;

// Función para limpiar instancias (útil para testing)
export const clearSupabaseInstances = () => {
  console.log('🧹 Instancia única de Supabase - no requiere limpieza');
};

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================

export const auth = supabase.auth;

export const getUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) throw error;
  return data;
};

// ========================================
// FUNCIONES DE UTILIDAD INTEGRADAS
// ========================================

// Obtener perfil de usuario
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Actualizar progreso Bloom
export const updateBloomProgress = async (
  userId: string,
  levelId: string,
  subject: string,
  progress: number
) => {
  const { data, error } = await supabase
    .from('bloom_progress')
    .upsert({
      user_id: userId,
      level_id: levelId,
      subject,
      progress_percentage: progress,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

// Registrar sesión cuántica
export const recordQuantumSession = async (
  userId: string,
  nodeId: string,
  coherence: number,
  entropy: number
) => {
  const { data, error } = await supabase
    .from('quantum_nodes')
    .upsert({
      user_id: userId,
      node_id: nodeId,
      coherence,
      entropy,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

// Registrar métricas de IA
export const recordAIMetrics = async (
  userId: string,
  sessionType: string,
  responseTime: number,
  accuracy: number,
  tokens: number
) => {
  const { data, error } = await supabase
    .from('ai_sessions')
    .insert({
      user_id: userId,
      session_type: sessionType,
      average_response_time: responseTime,
      model_accuracy: accuracy,
      token_usage: tokens,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
  return data;
};

// Obtener actividades recomendadas
export const getRecommendedActivities = async (limit = 10) => {
  const { data, error } = await supabase
    .from('bloom_activities')
    .select('*')
    .eq('is_active', true)
    .limit(limit);
  
  if (error) throw error;
  return data;
};

// ========================================
// LISTENERS Y CONFIGURACIÓN
// ========================================

// Configurar listeners de autenticación
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 SuperPAES Auth State:', event, session?.user?.email || 'No user');
  
  if (event === 'SIGNED_IN' && session?.user) {
    // Inicializar usuario en el sistema
    initializeSuperPAESUser(session.user.id);
  }
});

// Función para inicializar usuario
const initializeSuperPAESUser = async (userId: string) => {
  try {
    // Crear perfil de usuario si no existe
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        name: 'Estudiante PAES',
        avatar: '👨‍🎓',
        level: 'Nivel 1',
        points: 0,
        rank: 'Novato',
        streak_daily: 0,
        streak_weekly: 0,
        badges_obtained: 0,
        current_node: 'CL-RL-01',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('Error creando perfil:', profileError);
    }
    
    console.log('✅ Usuario SuperPAES inicializado:', userId);
  } catch (error) {
    console.error('Error inicializando usuario:', error);
  }
};

// ========================================
// EXPORTACIONES
// ========================================

export default supabase;
export type SupabaseClient = typeof supabase;
