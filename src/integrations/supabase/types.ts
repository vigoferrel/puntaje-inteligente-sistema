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
      diagnostic_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions_per_skill: number | null
          target_tier: Database["public"]["Enums"]["tier_priority"] | null
          test_id: number
          title: string
          total_questions: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions_per_skill?: number | null
          target_tier?: Database["public"]["Enums"]["tier_priority"] | null
          test_id: number
          title: string
          total_questions?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions_per_skill?: number | null
          target_tier?: Database["public"]["Enums"]["tier_priority"] | null
          test_id?: number
          title?: string
          total_questions?: number | null
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
          bloom_level: Database["public"]["Enums"]["bloom_level"]
          correct_answer: string
          created_at: string | null
          diagnostic_id: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          node_id: string | null
          options: Json | null
          paes_frequency_weight: number | null
          question: string
          skill_id: number | null
          test_id: number | null
          updated_at: string | null
        }
        Insert: {
          bloom_level?: Database["public"]["Enums"]["bloom_level"]
          correct_answer: string
          created_at?: string | null
          diagnostic_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id?: string | null
          options?: Json | null
          paes_frequency_weight?: number | null
          question: string
          skill_id?: number | null
          test_id?: number | null
          updated_at?: string | null
        }
        Update: {
          bloom_level?: Database["public"]["Enums"]["bloom_level"]
          correct_answer?: string
          created_at?: string | null
          diagnostic_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id?: string | null
          options?: Json | null
          paes_frequency_weight?: number | null
          question?: string
          skill_id?: number | null
          test_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "paes_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "paes_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_study_plans: {
        Row: {
          created_at: string
          description: string | null
          estimated_duration_weeks: number
          estimated_hours: number
          goal_id: string | null
          id: string
          is_active: boolean
          metrics: Json | null
          plan_type: string
          schedule: Json | null
          target_tests: string[]
          title: string
          total_nodes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_duration_weeks: number
          estimated_hours?: number
          goal_id?: string | null
          id?: string
          is_active?: boolean
          metrics?: Json | null
          plan_type: string
          schedule?: Json | null
          target_tests?: string[]
          title: string
          total_nodes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_duration_weeks?: number
          estimated_hours?: number
          goal_id?: string | null
          id?: string
          is_active?: boolean
          metrics?: Json | null
          plan_type?: string
          schedule?: Json | null
          target_tests?: string[]
          title?: string
          total_nodes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_study_plans_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "user_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_nodes: {
        Row: {
          adaptive_adjustment: number | null
          base_weight: number | null
          bloom_complexity_score: number | null
          code: string
          cognitive_level: Database["public"]["Enums"]["bloom_level"]
          created_at: string | null
          depends_on: string[] | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          difficulty_multiplier: number | null
          domain_category: string
          estimated_time_minutes: number | null
          frequency_bonus: number | null
          id: string
          paes_frequency: number | null
          position: number
          prerequisite_weight: number | null
          skill_id: number | null
          subject_area: string
          test_id: number | null
          tier_priority: Database["public"]["Enums"]["tier_priority"]
          title: string
          updated_at: string | null
        }
        Insert: {
          adaptive_adjustment?: number | null
          base_weight?: number | null
          bloom_complexity_score?: number | null
          code: string
          cognitive_level?: Database["public"]["Enums"]["bloom_level"]
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          difficulty_multiplier?: number | null
          domain_category: string
          estimated_time_minutes?: number | null
          frequency_bonus?: number | null
          id?: string
          paes_frequency?: number | null
          position: number
          prerequisite_weight?: number | null
          skill_id?: number | null
          subject_area: string
          test_id?: number | null
          tier_priority?: Database["public"]["Enums"]["tier_priority"]
          title: string
          updated_at?: string | null
        }
        Update: {
          adaptive_adjustment?: number | null
          base_weight?: number | null
          bloom_complexity_score?: number | null
          code?: string
          cognitive_level?: Database["public"]["Enums"]["bloom_level"]
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          difficulty_multiplier?: number | null
          domain_category?: string
          estimated_time_minutes?: number | null
          frequency_bonus?: number | null
          id?: string
          paes_frequency?: number | null
          position?: number
          prerequisite_weight?: number | null
          skill_id?: number | null
          subject_area?: string
          test_id?: number | null
          tier_priority?: Database["public"]["Enums"]["tier_priority"]
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
      node_weights: {
        Row: {
          calculated_weight: number
          career_relevance: number | null
          id: string
          last_calculated: string | null
          node_id: string
          performance_adjustment: number | null
          user_id: string
        }
        Insert: {
          calculated_weight?: number
          career_relevance?: number | null
          id?: string
          last_calculated?: string | null
          node_id: string
          performance_adjustment?: number | null
          user_id: string
        }
        Update: {
          calculated_weight?: number
          career_relevance?: number | null
          id?: string
          last_calculated?: string | null
          node_id?: string
          performance_adjustment?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "node_weights_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      paes_skills: {
        Row: {
          applicable_tests: string[] | null
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          impact_weight: number
          name: string
          node_count: number | null
          skill_type: Database["public"]["Enums"]["tpaes_habilidad"] | null
          test_id: number | null
          updated_at: string | null
        }
        Insert: {
          applicable_tests?: string[] | null
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          impact_weight?: number
          name: string
          node_count?: number | null
          skill_type?: Database["public"]["Enums"]["tpaes_habilidad"] | null
          test_id?: number | null
          updated_at?: string | null
        }
        Update: {
          applicable_tests?: string[] | null
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          impact_weight?: number
          name?: string
          node_count?: number | null
          skill_type?: Database["public"]["Enums"]["tpaes_habilidad"] | null
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
          complexity_level: string
          created_at: string | null
          description: string | null
          id: number
          is_required: boolean | null
          name: string
          questions_count: number
          relative_weight: number
          time_minutes: number
          updated_at: string | null
        }
        Insert: {
          code: string
          complexity_level: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_required?: boolean | null
          name: string
          questions_count: number
          relative_weight: number
          time_minutes: number
          updated_at?: string | null
        }
        Update: {
          code?: string
          complexity_level?: string
          created_at?: string | null
          description?: string | null
          id?: number
          is_required?: boolean | null
          name?: string
          questions_count?: number
          relative_weight?: number
          time_minutes?: number
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
          learning_phase: string | null
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
          learning_phase?: string | null
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
          learning_phase?: string | null
          name?: string | null
          preferred_study_time?: string | null
          study_start_date?: string | null
          target_career?: string | null
          target_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      study_plan_nodes: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_hours: number
          id: string
          is_completed: boolean
          node_id: string
          plan_id: string
          position: number
          week_number: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_hours?: number
          id?: string
          is_completed?: boolean
          node_id: string
          plan_id: string
          position: number
          week_number: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_hours?: number
          id?: string
          is_completed?: boolean
          node_id?: string
          plan_id?: string
          position?: number
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "study_plan_nodes_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plan_nodes_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "generated_study_plans"
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
          skill_analysis: Json | null
          tier_performance: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          diagnostic_id: string
          id?: string
          results: Json
          skill_analysis?: Json | null
          tier_performance?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          diagnostic_id?: string
          id?: string
          results?: Json
          skill_analysis?: Json | null
          tier_performance?: Json | null
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
        ]
      }
      user_exercise_attempts: {
        Row: {
          answer: string
          bloom_level_achieved:
            | Database["public"]["Enums"]["bloom_level"]
            | null
          confidence_level: number | null
          created_at: string | null
          exercise_id: string
          id: string
          is_correct: boolean
          node_id: string | null
          skill_demonstrated:
            | Database["public"]["Enums"]["tpaes_habilidad"]
            | null
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answer: string
          bloom_level_achieved?:
            | Database["public"]["Enums"]["bloom_level"]
            | null
          confidence_level?: number | null
          created_at?: string | null
          exercise_id: string
          id?: string
          is_correct: boolean
          node_id?: string | null
          skill_demonstrated?:
            | Database["public"]["Enums"]["tpaes_habilidad"]
            | null
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answer?: string
          bloom_level_achieved?:
            | Database["public"]["Enums"]["bloom_level"]
            | null
          confidence_level?: number | null
          created_at?: string | null
          exercise_id?: string
          id?: string
          is_correct?: boolean
          node_id?: string | null
          skill_demonstrated?:
            | Database["public"]["Enums"]["tpaes_habilidad"]
            | null
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
            foreignKeyName: "user_exercise_attempts_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          goal_type: string
          id: string
          is_active: boolean
          priority_areas: string[] | null
          target_date: string | null
          target_score_cl: number | null
          target_score_cs: number | null
          target_score_hcs: number | null
          target_score_m1: number | null
          target_score_m2: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_type: string
          id?: string
          is_active?: boolean
          priority_areas?: string[] | null
          target_date?: string | null
          target_score_cl?: number | null
          target_score_cs?: number | null
          target_score_hcs?: number | null
          target_score_m1?: number | null
          target_score_m2?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_type?: string
          id?: string
          is_active?: boolean
          priority_areas?: string[] | null
          target_date?: string | null
          target_score_cl?: number | null
          target_score_cs?: number | null
          target_score_hcs?: number | null
          target_score_m1?: number | null
          target_score_m2?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_node_progress: {
        Row: {
          attempts_count: number | null
          completed_at: string | null
          id: string
          last_activity_at: string | null
          last_performance_score: number | null
          mastery_level: number | null
          node_id: string
          progress: number | null
          status: string
          success_rate: number | null
          time_spent_minutes: number | null
          user_id: string
        }
        Insert: {
          attempts_count?: number | null
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_performance_score?: number | null
          mastery_level?: number | null
          node_id: string
          progress?: number | null
          status?: string
          success_rate?: number | null
          time_spent_minutes?: number | null
          user_id: string
        }
        Update: {
          attempts_count?: number | null
          completed_at?: string | null
          id?: string
          last_activity_at?: string | null
          last_performance_score?: number | null
          mastery_level?: number | null
          node_id?: string
          progress?: number | null
          status?: string
          success_rate?: number | null
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
        ]
      }
      user_study_schedules: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          session_duration_minutes: number
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean
          session_duration_minutes?: number
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          session_duration_minutes?: number
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: { sql: string }
        Returns: undefined
      }
      get_policies_for_table: {
        Args: { table_name: string }
        Returns: {
          policy_name: string
          policy_roles: string[]
          policy_cmd: string
          policy_qual: string
          policy_with_check: string
        }[]
      }
      obtener_estadisticas_respuestas_examen: {
        Args: { codigo_examen: string }
        Returns: Json
      }
      obtener_examen_completo: {
        Args: { codigo_examen: string }
        Returns: Json
      }
      obtener_examen_completo_f153: {
        Args: { codigo_examen_param: string }
        Returns: Json
      }
      obtener_respuestas_correctas_examen: {
        Args: { codigo_examen: string }
        Returns: {
          numero_pregunta: number
          respuesta_correcta: string
        }[]
      }
      obtener_respuestas_correctas_examen_f153: {
        Args: { codigo_examen_param: string }
        Returns: {
          numero_pregunta: number
          respuesta_correcta: string
        }[]
      }
    }
    Enums: {
      bloom_level:
        | "recordar"
        | "comprender"
        | "aplicar"
        | "analizar"
        | "evaluar"
        | "crear"
      bloom_taxonomy_level:
        | "remember"
        | "understand"
        | "apply"
        | "analyze"
        | "evaluate"
        | "create"
      difficulty_level: "basic" | "intermediate" | "advanced"
      paes_skill_type:
        | "SOLVE_PROBLEMS"
        | "REPRESENT"
        | "MODEL"
        | "INTERPRET_RELATE"
        | "EVALUATE_REFLECT"
        | "TRACK_LOCATE"
      tier_priority:
        | "tier1_critico"
        | "tier2_importante"
        | "tier3_complementario"
      tpaes_habilidad:
        | "TRACK_LOCATE"
        | "INTERPRET_RELATE"
        | "EVALUATE_REFLECT"
        | "SOLVE_PROBLEMS"
        | "REPRESENT"
        | "MODEL"
        | "ARGUE_COMMUNICATE"
        | "IDENTIFY_THEORIES"
        | "PROCESS_ANALYZE"
        | "APPLY_PRINCIPLES"
        | "SCIENTIFIC_ARGUMENT"
        | "TEMPORAL_THINKING"
        | "SOURCE_ANALYSIS"
        | "MULTICAUSAL_ANALYSIS"
        | "CRITICAL_THINKING"
        | "REFLECTION"
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
      bloom_level: [
        "recordar",
        "comprender",
        "aplicar",
        "analizar",
        "evaluar",
        "crear",
      ],
      bloom_taxonomy_level: [
        "remember",
        "understand",
        "apply",
        "analyze",
        "evaluate",
        "create",
      ],
      difficulty_level: ["basic", "intermediate", "advanced"],
      paes_skill_type: [
        "SOLVE_PROBLEMS",
        "REPRESENT",
        "MODEL",
        "INTERPRET_RELATE",
        "EVALUATE_REFLECT",
        "TRACK_LOCATE",
      ],
      tier_priority: [
        "tier1_critico",
        "tier2_importante",
        "tier3_complementario",
      ],
      tpaes_habilidad: [
        "TRACK_LOCATE",
        "INTERPRET_RELATE",
        "EVALUATE_REFLECT",
        "SOLVE_PROBLEMS",
        "REPRESENT",
        "MODEL",
        "ARGUE_COMMUNICATE",
        "IDENTIFY_THEORIES",
        "PROCESS_ANALYZE",
        "APPLY_PRINCIPLES",
        "SCIENTIFIC_ARGUMENT",
        "TEMPORAL_THINKING",
        "SOURCE_ANALYSIS",
        "MULTICAUSAL_ANALYSIS",
        "CRITICAL_THINKING",
        "REFLECTION",
      ],
    },
  },
} as const
