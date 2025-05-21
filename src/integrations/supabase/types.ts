export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      careers: {
        Row: {
          area: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          area: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          area?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diagnostic_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          test_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          test_id: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          test_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_tests_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "paes_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          node_id: string
          options: Json | null
          question: string
          updated_at: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id: string
          options?: Json | null
          question: string
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id?: string
          options?: Json | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_careers: {
        Row: {
          career_id: number
          created_at: string | null
          id: number
          institution_id: number
          min_score: number | null
          test_requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          career_id: number
          created_at?: string | null
          id?: number
          institution_id: number
          min_score?: number | null
          test_requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          career_id?: number
          created_at?: string | null
          id?: number
          institution_id?: number
          min_score?: number | null
          test_requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institution_careers_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_careers_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institution_types: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          city: string | null
          created_at: string | null
          description: string | null
          id: number
          name: string
          region: string | null
          type_id: number
          updated_at: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          region?: string | null
          type_id: number
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          region?: string | null
          type_id?: number
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutions_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "institution_types"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_nodes: {
        Row: {
          code: string
          created_at: string | null
          depends_on: string[] | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes: number | null
          id: string
          position: number
          skill_id: number
          test_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes?: number | null
          id?: string
          position: number
          skill_id: number
          test_id: number
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes?: number | null
          id?: string
          position?: number
          skill_id?: number
          test_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_nodes_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "paes_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_nodes_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "paes_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_plan_nodes: {
        Row: {
          created_at: string | null
          id: string
          node_id: string
          plan_id: string
          position: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          node_id: string
          plan_id: string
          position: number
        }
        Update: {
          created_at?: string | null
          id?: string
          node_id?: string
          plan_id?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_plan_nodes_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_plan_nodes_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "learning_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      node_content: {
        Row: {
          content: Json
          content_type: string
          created_at: string | null
          id: string
          node_id: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          content_type: string
          created_at?: string | null
          id?: string
          node_id: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          content_type?: string
          created_at?: string | null
          id?: string
          node_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "node_content_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      paes_skills: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          test_id: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          test_id?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          test_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paes_skills_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "paes_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      paes_tests: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: number
          is_required: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_required?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_required?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          last_active_at: string | null
          name: string | null
          preferred_study_time: string | null
          study_start_date: string | null
          target_career: string | null
          target_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          last_active_at?: string | null
          name?: string | null
          preferred_study_time?: string | null
          study_start_date?: string | null
          target_career?: string | null
          target_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          last_active_at?: string | null
          name?: string | null
          preferred_study_time?: string | null
          study_start_date?: string | null
          target_career?: string | null
          target_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_career_interests: {
        Row: {
          career_id: number
          created_at: string | null
          id: string
          interest_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_id: number
          created_at?: string | null
          id?: string
          interest_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_id?: number
          created_at?: string | null
          id?: string
          interest_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_career_interests_career_id_fkey"
            columns: ["career_id"]
            isOneToOne: false
            referencedRelation: "careers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_career_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_diagnostic_results: {
        Row: {
          completed_at: string | null
          diagnostic_id: string
          id: string
          results: Json
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          diagnostic_id: string
          id?: string
          results: Json
          user_id: string
        }
        Update: {
          completed_at?: string | null
          diagnostic_id?: string
          id?: string
          results?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_diagnostic_results_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_diagnostic_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_exercise_attempts: {
        Row: {
          answer: string
          created_at: string | null
          exercise_id: string
          id: string
          is_correct: boolean
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          exercise_id: string
          id?: string
          is_correct: boolean
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          exercise_id?: string
          id?: string
          is_correct?: boolean
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_exercise_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_exercise_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_progress: {
        Row: {
          completed_at: string | null
          id: string
          last_activity_at: string | null
          node_id: string
          progress: number | null
          status: string
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          node_id: string
          progress?: number | null
          status: string
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          node_id?: string
          progress?: number | null
          status?: string
          time_spent_minutes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_node_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skill_levels: {
        Row: {
          id: string
          level: number
          skill_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          level?: number
          skill_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          level?: number
          skill_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_levels_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "paes_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skill_levels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "basic" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["basic", "intermediate", "advanced"],
    },
  },
} as const
