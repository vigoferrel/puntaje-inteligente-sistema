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
      ai_content_cache: {
        Row: {
          content: Json
          content_key: string
          content_type: string
          created_at: string | null
          expires_at: string | null
          hit_count: number
          id: string
        }
        Insert: {
          content: Json
          content_key: string
          content_type: string
          created_at?: string | null
          expires_at?: string | null
          hit_count?: number
          id?: string
        }
        Update: {
          content?: Json
          content_key?: string
          content_type?: string
          created_at?: string | null
          expires_at?: string | null
          hit_count?: number
          id?: string
        }
        Relationships: []
      }
      ai_generation_metrics: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          creativity_score: number | null
          feedback: string | null
          generation_id: string | null
          id: string
          relevance_score: number | null
          user_rating: number | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          creativity_score?: number | null
          feedback?: string | null
          generation_id?: string | null
          id?: string
          relevance_score?: number | null
          user_rating?: number | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          creativity_score?: number | null
          feedback?: string | null
          generation_id?: string | null
          id?: string
          relevance_score?: number | null
          user_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_generation_metrics_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "ai_model_usage"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_usage: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          model_name: string
          response_time_ms: number | null
          success: boolean
          token_count: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model_name: string
          response_time_ms?: number | null
          success?: boolean
          token_count?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model_name?: string
          response_time_ms?: number | null
          success?: boolean
          token_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_prompts: {
        Row: {
          created_at: string | null
          description: string | null
          effectiveness_score: number | null
          id: string
          is_active: boolean
          model_name: string
          name: string
          parameters: Json | null
          prompt_text: string
          prompt_type: string
          updated_at: string | null
          version: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean
          model_name: string
          name: string
          parameters?: Json | null
          prompt_text: string
          prompt_type: string
          updated_at?: string | null
          version?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean
          model_name?: string
          name?: string
          parameters?: Json | null
          prompt_text?: string
          prompt_type?: string
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
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
      examenes: {
        Row: {
          año: number | null
          codigo: string
          created_at: string | null
          duracion_minutos: number | null
          id: number
          instrucciones: string | null
          nombre: string
          preguntas_validas: number | null
          tipo: string | null
          total_preguntas: number | null
          updated_at: string | null
        }
        Insert: {
          año?: number | null
          codigo: string
          created_at?: string | null
          duracion_minutos?: number | null
          id?: number
          instrucciones?: string | null
          nombre: string
          preguntas_validas?: number | null
          tipo?: string | null
          total_preguntas?: number | null
          updated_at?: string | null
        }
        Update: {
          año?: number | null
          codigo?: string
          created_at?: string | null
          duracion_minutos?: number | null
          id?: number
          instrucciones?: string | null
          nombre?: string
          preguntas_validas?: number | null
          tipo?: string | null
          total_preguntas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          correct_answer: string
          created_at: string | null
          diagnostic_id: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          node_id: string
          options: Json | null
          question: string
          skill_id: number | null
          test_id: number | null
          updated_at: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          diagnostic_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id: string
          options?: Json | null
          question: string
          skill_id?: number | null
          test_id?: number | null
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          diagnostic_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          node_id?: string
          options?: Json | null
          question?: string
          skill_id?: number | null
          test_id?: number | null
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
      learning_curve: {
        Row: {
          created_at: string | null
          days: number
          description: string | null
          expected_progress: number
          id: string
          level: number
          name: string
          node_number: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          days?: number
          description?: string | null
          expected_progress?: number
          id?: string
          level?: number
          name: string
          node_number: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          days?: number
          description?: string | null
          expected_progress?: number
          id?: string
          level?: number
          name?: string
          node_number?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      learning_nodes: {
        Row: {
          code: string
          cognitive_level: string | null
          created_at: string | null
          depends_on: string[] | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes: number | null
          id: string
          position: number
          skill_id: number | null
          subject_area: string | null
          test_id: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          code: string
          cognitive_level?: string | null
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes?: number | null
          id?: string
          position: number
          skill_id?: number | null
          subject_area?: string | null
          test_id?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          cognitive_level?: string | null
          created_at?: string | null
          depends_on?: string[] | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          estimated_time_minutes?: number | null
          id?: string
          position?: number
          skill_id?: number | null
          subject_area?: string | null
          test_id?: number | null
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
      lectoguia_exercise_attempts: {
        Row: {
          completed_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          prueba: string
          selected_option: number
          skill_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          exercise_id: string
          id?: string
          is_correct: boolean
          prueba: string
          selected_option: number
          skill_type: string
          user_id: string
        }
        Update: {
          completed_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          prueba?: string
          selected_option?: number
          skill_type?: string
          user_id?: string
        }
        Relationships: []
      }
      lectoguia_user_preferences: {
        Row: {
          created_at: string | null
          id: string
          key: string
          updated_at: string | null
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          key: string
          updated_at?: string | null
          user_id: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          user_id?: string
          value?: string
        }
        Relationships: []
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
      opciones_respuesta: {
        Row: {
          contenido: string
          created_at: string | null
          es_correcta: boolean | null
          id: number
          letra: string
          pregunta_id: number | null
        }
        Insert: {
          contenido: string
          created_at?: string | null
          es_correcta?: boolean | null
          id?: number
          letra: string
          pregunta_id?: number | null
        }
        Update: {
          contenido?: string
          created_at?: string | null
          es_correcta?: boolean | null
          id?: number
          letra?: string
          pregunta_id?: number | null
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
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          name: string
          skill_type: Database["public"]["Enums"]["paes_skill_type"] | null
          test_id: number | null
          total_nodes: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          name: string
          skill_type?: Database["public"]["Enums"]["paes_skill_type"] | null
          test_id?: number | null
          total_nodes?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          name?: string
          skill_type?: Database["public"]["Enums"]["paes_skill_type"] | null
          test_id?: number | null
          total_nodes?: number | null
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
      preguntas: {
        Row: {
          contexto: string | null
          created_at: string | null
          enunciado: string
          examen_id: number | null
          id: number
          imagen_url: string | null
          numero: number
          tipo_pregunta: string | null
        }
        Insert: {
          contexto?: string | null
          created_at?: string | null
          enunciado: string
          examen_id?: number | null
          id?: number
          imagen_url?: string | null
          numero: number
          tipo_pregunta?: string | null
        }
        Update: {
          contexto?: string | null
          created_at?: string | null
          enunciado?: string
          examen_id?: number | null
          id?: number
          imagen_url?: string | null
          numero?: number
          tipo_pregunta?: string | null
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
      simulation_answers: {
        Row: {
          answer_index: number
          answered_at: string
          id: string
          question_id: string
          simulation_id: string
          user_id: string
        }
        Insert: {
          answer_index: number
          answered_at?: string
          id?: string
          question_id: string
          simulation_id: string
          user_id: string
        }
        Update: {
          answer_index?: number
          answered_at?: string
          id?: string
          question_id?: string
          simulation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_answers_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "user_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_taxonomy: {
        Row: {
          bloom_level: Database["public"]["Enums"]["bloom_taxonomy_level"]
          color: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: number
          skill_id: number | null
          updated_at: string | null
        }
        Insert: {
          bloom_level: Database["public"]["Enums"]["bloom_taxonomy_level"]
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          skill_id?: number | null
          updated_at?: string | null
        }
        Update: {
          bloom_level?: Database["public"]["Enums"]["bloom_taxonomy_level"]
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: number
          skill_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_taxonomy_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "paes_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      test_skills_mapping: {
        Row: {
          id: number
          skill_id: number
          test_id: number
          weight: number
        }
        Insert: {
          id?: number
          skill_id: number
          test_id: number
          weight?: number
        }
        Update: {
          id?: number
          skill_id?: number
          test_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_skills_mapping_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "paes_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_skills_mapping_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "paes_tests"
            referencedColumns: ["id"]
          },
        ]
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
      user_paes_progress: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          is_correct: boolean
          phase: string | null
          question_id: number
          skill: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          is_correct: boolean
          phase?: string | null
          question_id: number
          skill: string
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          phase?: string | null
          question_id?: number
          skill?: string
          user_id?: string
        }
        Relationships: []
      }
      user_simulations: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          estimated_score: number | null
          id: string
          percentage_correct: number | null
          prueba_type: string
          question_count: number
          skill_results: Json | null
          started_at: string
          status: string
          time_spent_minutes: number | null
          unanswered_count: number | null
          user_id: string
          wrong_answers: number | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          estimated_score?: number | null
          id?: string
          percentage_correct?: number | null
          prueba_type: string
          question_count: number
          skill_results?: Json | null
          started_at?: string
          status: string
          time_spent_minutes?: number | null
          unanswered_count?: number | null
          user_id: string
          wrong_answers?: number | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          estimated_score?: number | null
          id?: string
          percentage_correct?: number | null
          prueba_type?: string
          question_count?: number
          skill_results?: Json | null
          started_at?: string
          status?: string
          time_spent_minutes?: number | null
          unanswered_count?: number | null
          user_id?: string
          wrong_answers?: number | null
        }
        Relationships: []
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
    }
    Enums: {
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
    },
  },
} as const
