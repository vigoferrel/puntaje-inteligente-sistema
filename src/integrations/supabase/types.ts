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
      calendar_events: {
        Row: {
          all_day: boolean
          color: string
          created_at: string
          description: string | null
          end_date: string | null
          event_type: string
          id: string
          is_recurring: boolean
          location: string | null
          metadata: Json | null
          priority: string
          recurrence_pattern: Json | null
          related_node_id: string | null
          related_plan_id: string | null
          start_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          all_day?: boolean
          color?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          metadata?: Json | null
          priority?: string
          recurrence_pattern?: Json | null
          related_node_id?: string | null
          related_plan_id?: string | null
          start_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          all_day?: boolean
          color?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          id?: string
          is_recurring?: boolean
          location?: string | null
          metadata?: Json | null
          priority?: string
          recurrence_pattern?: Json | null
          related_node_id?: string | null
          related_plan_id?: string | null
          start_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      examenes: {
        Row: {
          año: number
          codigo: string
          created_at: string
          duracion_minutos: number
          id: string
          instrucciones: string | null
          nombre: string
          preguntas_validas: number
          tipo: string
          total_preguntas: number
          updated_at: string
        }
        Insert: {
          año: number
          codigo: string
          created_at?: string
          duracion_minutos: number
          id?: string
          instrucciones?: string | null
          nombre: string
          preguntas_validas: number
          tipo: string
          total_preguntas: number
          updated_at?: string
        }
        Update: {
          año?: number
          codigo?: string
          created_at?: string
          duracion_minutos?: number
          id?: string
          instrucciones?: string | null
          nombre?: string
          preguntas_validas?: number
          tipo?: string
          total_preguntas?: number
          updated_at?: string
        }
        Relationships: []
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
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
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
      learning_sequences_biologia: {
        Row: {
          created_at: string | null
          id: string
          mastery_threshold: number | null
          node_id: string
          prerequisite_nodes: string[] | null
          sequence_name: string
          sequence_order: number
          time_estimate_minutes: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mastery_threshold?: number | null
          node_id: string
          prerequisite_nodes?: string[] | null
          sequence_name: string
          sequence_order: number
          time_estimate_minutes?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mastery_threshold?: number | null
          node_id?: string
          prerequisite_nodes?: string[] | null
          sequence_name?: string
          sequence_order?: number
          time_estimate_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_sequences_biologia_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "learning_sequences_biologia_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
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
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "node_weights_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean
          email_timing: Json
          event_type: string
          id: string
          push_enabled: boolean
          push_timing: Json
          quiet_hours: Json
          sms_enabled: boolean
          sms_timing: Json
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          email_timing?: Json
          event_type: string
          id?: string
          push_enabled?: boolean
          push_timing?: Json
          quiet_hours?: Json
          sms_enabled?: boolean
          sms_timing?: Json
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          email_timing?: Json
          event_type?: string
          id?: string
          push_enabled?: boolean
          push_timing?: Json
          quiet_hours?: Json
          sms_enabled?: boolean
          sms_timing?: Json
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opciones_respuesta: {
        Row: {
          contenido: string
          created_at: string
          es_correcta: boolean
          id: string
          letra: string
          pregunta_id: string
          updated_at: string
        }
        Insert: {
          contenido: string
          created_at?: string
          es_correcta?: boolean
          id?: string
          letra: string
          pregunta_id: string
          updated_at?: string
        }
        Update: {
          contenido?: string
          created_at?: string
          es_correcta?: boolean
          id?: string
          letra?: string
          pregunta_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opciones_respuesta_pregunta_id_fkey"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "preguntas"
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
      preguntas: {
        Row: {
          contexto: string | null
          created_at: string
          enunciado: string
          examen_id: string
          id: string
          imagen_url: string | null
          numero: number
          updated_at: string
        }
        Insert: {
          contexto?: string | null
          created_at?: string
          enunciado: string
          examen_id: string
          id?: string
          imagen_url?: string | null
          numero: number
          updated_at?: string
        }
        Update: {
          contexto?: string | null
          created_at?: string
          enunciado?: string
          examen_id?: string
          id?: string
          imagen_url?: string | null
          numero?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "preguntas_examen_id_fkey"
            columns: ["examen_id"]
            isOneToOne: false
            referencedRelation: "examenes"
            referencedColumns: ["id"]
          },
        ]
      }
      preguntas_metadata: {
        Row: {
          created_at: string | null
          excluida_de_puntaje: boolean | null
          id: string
          pregunta_id: string
          razon_exclusion: string | null
        }
        Insert: {
          created_at?: string | null
          excluida_de_puntaje?: boolean | null
          id?: string
          pregunta_id: string
          razon_exclusion?: string | null
        }
        Update: {
          created_at?: string | null
          excluida_de_puntaje?: boolean | null
          id?: string
          pregunta_id?: string
          razon_exclusion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preguntas_metadata_pregunta_id_fkey"
            columns: ["pregunta_id"]
            isOneToOne: true
            referencedRelation: "preguntas"
            referencedColumns: ["id"]
          },
        ]
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
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          is_active: boolean
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          is_active?: boolean
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          is_active?: boolean
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      question_node_mapping: {
        Row: {
          cognitive_demand: string
          content_area: string
          created_at: string | null
          difficulty_weight: number | null
          exam_code: string
          id: string
          node_id: string
          question_number: number
          skill_type: string
        }
        Insert: {
          cognitive_demand: string
          content_area: string
          created_at?: string | null
          difficulty_weight?: number | null
          exam_code: string
          id?: string
          node_id: string
          question_number: number
          skill_type: string
        }
        Update: {
          cognitive_demand?: string
          content_area?: string
          created_at?: string | null
          difficulty_weight?: number | null
          exam_code?: string
          id?: string
          node_id?: string
          question_number?: number
          skill_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_node_mapping_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "question_node_mapping_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_notifications: {
        Row: {
          content: Json
          created_at: string
          event_id: string
          id: string
          notification_type: string
          send_at: string
          sent_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          event_id: string
          id?: string
          notification_type: string
          send_at: string
          sent_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          event_id?: string
          id?: string
          notification_type?: string
          send_at?: string
          sent_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
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
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
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
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
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
      cognitive_distribution_m2_2024: {
        Row: {
          cognitive_demand: string | null
          dificultad_promedio: number | null
          porcentaje: number | null
          preguntas_por_habilidad: number | null
          skill_type: string | null
          total_preguntas: number | null
        }
        Relationships: []
      }
      content_distribution_m2_2024: {
        Row: {
          dificultad_promedio: number | null
          eje_tematico: string | null
          habilidades_principales: string | null
          niveles_cognitivos: string | null
          porcentaje: number | null
          total_preguntas: number | null
        }
        Relationships: []
      }
      critical_nodes_analysis_ciencias_2024: {
        Row: {
          cognitive_level: Database["public"]["Enums"]["bloom_level"] | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          dificultad_promedio: number | null
          node_id: string | null
          node_name: string | null
          preguntas: number[] | null
          total_preguntas: number | null
        }
        Relationships: []
      }
      nodes_summary_by_subject: {
        Row: {
          avg_time_minutes: number | null
          avg_weight: number | null
          bloom_levels: string | null
          node_count: number | null
          subject_area: string | null
          tier_priority: Database["public"]["Enums"]["tier_priority"] | null
        }
        Relationships: []
      }
      skill_distribution_ciencias_2024: {
        Row: {
          content_area: string | null
          count_por_area: number | null
          dificultad_promedio: number | null
          porcentaje: number | null
          skill_type: string | null
          total_preguntas: number | null
        }
        Relationships: []
      }
      skill_distribution_ciencias_tp_2024: {
        Row: {
          area_cientifica: string | null
          modulo: string | null
          porcentaje: number | null
          preguntas_validas: number | null
          total_preguntas: number | null
        }
        Relationships: []
      }
      skill_distribution_matematica_m2_2024: {
        Row: {
          areas_contenido: string | null
          dificultad_promedio: number | null
          porcentaje_total: number | null
          porcentaje_valido: number | null
          preguntas: number[] | null
          skill_type: string | null
          total_preguntas: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calcular_puntaje_paes_historia: {
        Args: { codigo_examen_param: string; respuestas_usuario: Json }
        Returns: {
          puntaje_total: number
          respuestas_correctas: number
          respuestas_incorrectas: number
          preguntas_validas: number
          porcentaje_logro: number
        }[]
      }
      calculate_weighted_score_ciencias: {
        Args: { exam_code_param: string; user_responses: Json }
        Returns: {
          total_score: number
          skill_breakdown: Json
          node_performance: Json
          difficulty_analysis: Json
        }[]
      }
      calculate_weighted_score_matematica_m2: {
        Args: { exam_code_param: string; user_responses: Json }
        Returns: {
          total_score: number
          skill_breakdown: Json
          node_performance: Json
          eje_performance: Json
        }[]
      }
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
      obtener_examen_ciencias_completo: {
        Args: { codigo_examen_param: string }
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
      obtener_examen_historia_completo: {
        Args: { codigo_examen_param: string }
        Returns: Json
      }
      obtener_examen_matematica2_completo: {
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
      simular_examen_historia: {
        Args: { codigo_examen_param?: string; numero_preguntas?: number }
        Returns: {
          numero_pregunta: number
          enunciado: string
          contexto: string
          opciones: Json
        }[]
      }
      validate_nodes_coherence: {
        Args: Record<PropertyKey, never>
        Returns: {
          issue_type: string
          description: string
          node_count: number
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
