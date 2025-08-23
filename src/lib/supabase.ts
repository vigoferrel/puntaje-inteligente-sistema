import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas principales
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LearningNode {
  id: string;
  code: string;
  title: string;
  subject_area: string;
  tier_priority: number;
  position: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  node_id: string;
  progress_percentage: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
}

export interface Diagnostic {
  id: string;
  user_id: string;
  subject: string;
  score: number;
  total_questions: number;
  completed_at: string;
  created_at: string;
}

export interface AIRecommendation {
  id: string;
  user_id: string;
  node_id: string;
  recommendation_type: string;
  priority: number;
  created_at: string;
}

// Funciones de utilidad para Supabase
export const supabaseUtils = {
  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Obtener nodos de aprendizaje
  async getLearningNodes(subject?: string) {
    let query = supabase
      .from('learning_nodes')
      .select('*')
      .order('position');
    
    if (subject) {
      query = query.eq('subject_area', subject);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as LearningNode[];
  },

  // Obtener progreso del usuario
  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as UserProgress[];
  },

  // Actualizar progreso del usuario
  async updateUserProgress(progress: Partial<UserProgress>) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(progress)
      .select();
    
    if (error) throw error;
    return data[0] as UserProgress;
  },

  // Crear diagnóstico
  async createDiagnostic(diagnostic: Omit<Diagnostic, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('diagnostics')
      .insert(diagnostic)
      .select();
    
    if (error) throw error;
    return data[0] as Diagnostic;
  },

  // Obtener recomendaciones AI
  async getAIRecommendations(userId: string) {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data as AIRecommendation[];
  }
};

export default supabase;
