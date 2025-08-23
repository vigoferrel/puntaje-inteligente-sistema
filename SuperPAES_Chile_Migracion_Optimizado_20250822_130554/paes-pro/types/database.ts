export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          birth_date: string | null
          grade_level: string | null
          target_career: string | null
          target_university: string | null
          region: string | null
          city: string | null
          study_preferences: Json | null
          notification_preferences: Json | null
          is_active: boolean
          last_login: string | null
          total_study_minutes: number
          current_streak_days: number
          max_streak_days: number
          paes_target_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birth_date?: string | null
          grade_level?: string | null
          target_career?: string | null
          target_university?: string | null
          region?: string | null
          city?: string | null
          study_preferences?: Json | null
          notification_preferences?: Json | null
          is_active?: boolean
          last_login?: string | null
          total_study_minutes?: number
          current_streak_days?: number
          max_streak_days?: number
          paes_target_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          birth_date?: string | null
          grade_level?: string | null
          target_career?: string | null
          target_university?: string | null
          region?: string | null
          city?: string | null
          study_preferences?: Json | null
          notification_preferences?: Json | null
          is_active?: boolean
          last_login?: string | null
          total_study_minutes?: number
          current_streak_days?: number
          max_streak_days?: number
          paes_target_date?: string | null
        }
      }
      learning_nodes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          content_type: string
          difficulty_level: string
          test_type: string
          skill_primary: string
          skill_secondary: string | null
          bloom_level: string
          estimated_time_minutes: number
          is_active: boolean
          position: number
          prerequisites: string[] | null
          tags: string[] | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          content_type: string
          difficulty_level: string
          test_type: string
          skill_primary: string
          skill_secondary?: string | null
          bloom_level: string
          estimated_time_minutes?: number
          is_active?: boolean
          position?: number
          prerequisites?: string[] | null
          tags?: string[] | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          content_type?: string
          difficulty_level?: string
          test_type?: string
          skill_primary?: string
          skill_secondary?: string | null
          bloom_level?: string
          estimated_time_minutes?: number
          is_active?: boolean
          position?: number
          prerequisites?: string[] | null
          tags?: string[] | null
          metadata?: Json | null
        }
      }
      user_progress: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          node_id: string
          status: string
          progress_percentage: number
          score: number | null
          time_spent_minutes: number
          attempts: number
          last_attempt_at: string | null
          mastery_level: number
          next_review_date: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          node_id: string
          status?: string
          progress_percentage?: number
          score?: number | null
          time_spent_minutes?: number
          attempts?: number
          last_attempt_at?: string | null
          mastery_level?: number
          next_review_date?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          node_id?: string
          status?: string
          progress_percentage?: number
          score?: number | null
          time_spent_minutes?: number
          attempts?: number
          last_attempt_at?: string | null
          mastery_level?: number
          next_review_date?: string | null
          metadata?: Json | null
        }
      }
      diagnostic_assessments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          assessment_type: string
          status: string
          total_questions: number
          correct_answers: number
          competencia_lectora_score: number | null
          matematica_m1_score: number | null
          matematica_m2_score: number | null
          historia_score: number | null
          ciencias_score: number | null
          overall_score: number | null
          time_spent_minutes: number
          completed_at: string | null
          detailed_results: Json | null
          recommendations: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          assessment_type: string
          status?: string
          total_questions?: number
          correct_answers?: number
          competencia_lectora_score?: number | null
          matematica_m1_score?: number | null
          matematica_m2_score?: number | null
          historia_score?: number | null
          ciencias_score?: number | null
          overall_score?: number | null
          time_spent_minutes?: number
          completed_at?: string | null
          detailed_results?: Json | null
          recommendations?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          assessment_type?: string
          status?: string
          total_questions?: number
          correct_answers?: number
          competencia_lectora_score?: number | null
          matematica_m1_score?: number | null
          matematica_m2_score?: number | null
          historia_score?: number | null
          ciencias_score?: number | null
          overall_score?: number | null
          time_spent_minutes?: number
          completed_at?: string | null
          detailed_results?: Json | null
          recommendations?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
