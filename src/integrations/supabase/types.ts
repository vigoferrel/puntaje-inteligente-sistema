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
      admin_cost_alerts: {
        Row: {
          alert_type: string
          current_value: number | null
          id: string
          is_active: boolean | null
          message: string | null
          module_source: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          threshold_value: number | null
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          module_source?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          threshold_value?: number | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          current_value?: number | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          module_source?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          threshold_value?: number | null
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_conversation_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          model_used: string | null
          neural_context: Json | null
          processing_time_ms: number | null
          role: string
          session_id: string | null
          tokens_used: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          model_used?: string | null
          neural_context?: Json | null
          processing_time_ms?: number | null
          role: string
          session_id?: string | null
          tokens_used?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          model_used?: string | null
          neural_context?: Json | null
          processing_time_ms?: number | null
          role?: string
          session_id?: string | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_conversation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ai_conversation_messages_session_id"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversation_sessions: {
        Row: {
          context_data: Json | null
          ended_at: string | null
          id: string
          session_quality: number | null
          session_type: string
          started_at: string | null
          total_messages: number | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          ended_at?: string | null
          id?: string
          session_quality?: number | null
          session_type: string
          started_at?: string | null
          total_messages?: number | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          ended_at?: string | null
          id?: string
          session_quality?: number | null
          session_type?: string
          started_at?: string | null
          total_messages?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_cost_analytics: {
        Row: {
          avg_quality: number | null
          avg_response_time: number | null
          cost_trends: Json | null
          created_at: string | null
          id: string
          module_breakdown: Json | null
          period_date: string
          period_type: string
          success_rate: number | null
          top_users: Json | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          updated_at: string | null
        }
        Insert: {
          avg_quality?: number | null
          avg_response_time?: number | null
          cost_trends?: Json | null
          created_at?: string | null
          id?: string
          module_breakdown?: Json | null
          period_date: string
          period_type: string
          success_rate?: number | null
          top_users?: Json | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_quality?: number | null
          avg_response_time?: number | null
          cost_trends?: Json | null
          created_at?: string | null
          id?: string
          module_breakdown?: Json | null
          period_date?: string
          period_type?: string
          success_rate?: number | null
          top_users?: Json | null
          total_cost?: number | null
          total_requests?: number | null
          total_tokens?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_generated_plans: {
        Row: {
          adaptation_rules: Json | null
          created_at: string | null
          duration_weeks: number
          id: string
          plan_name: string
          schedule: Json
          status: string | null
          target_tests: string[]
          total_hours: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          adaptation_rules?: Json | null
          created_at?: string | null
          duration_weeks: number
          id?: string
          plan_name: string
          schedule: Json
          status?: string | null
          target_tests: string[]
          total_hours: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          adaptation_rules?: Json | null
          created_at?: string | null
          duration_weeks?: number
          id?: string
          plan_name?: string
          schedule?: Json
          status?: string | null
          target_tests?: string[]
          total_hours?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_model_usage: {
        Row: {
          action_type: string
          created_at: string | null
          estimated_cost: number | null
          id: string
          metadata: Json | null
          model_name: string
          module_source: string
          quality_score: number | null
          response_time_ms: number | null
          success: boolean | null
          token_count: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          metadata?: Json | null
          model_name: string
          module_source: string
          quality_score?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          token_count?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          estimated_cost?: number | null
          id?: string
          metadata?: Json | null
          model_name?: string
          module_source?: string
          quality_score?: number | null
          response_time_ms?: number | null
          success?: boolean | null
          token_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          content: Json
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          neural_basis: Json | null
          priority: number | null
          recommendation_type: string
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          neural_basis?: Json | null
          priority?: number | null
          recommendation_type: string
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          neural_basis?: Json | null
          priority?: number | null
          recommendation_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      alternativas_respuesta: {
        Row: {
          concepto_erroneo_asociado: string | null
          contenido: string
          contenido_html: string | null
          created_at: string | null
          efectividad_pedagogica: number | null
          es_correcta: boolean | null
          explicacion_por_que_incorrecta: string | null
          id: string
          imagen_url: string | null
          letra: string
          orden: number
          plausibilidad_distractor: number | null
          porcentaje_seleccion: number | null
          pregunta_id: string | null
          puntaje_asignado: number | null
          seleccionada_por_nivel: Json | null
          tipo_distractor: string | null
          updated_at: string | null
          veces_seleccionada: number | null
        }
        Insert: {
          concepto_erroneo_asociado?: string | null
          contenido: string
          contenido_html?: string | null
          created_at?: string | null
          efectividad_pedagogica?: number | null
          es_correcta?: boolean | null
          explicacion_por_que_incorrecta?: string | null
          id?: string
          imagen_url?: string | null
          letra: string
          orden: number
          plausibilidad_distractor?: number | null
          porcentaje_seleccion?: number | null
          pregunta_id?: string | null
          puntaje_asignado?: number | null
          seleccionada_por_nivel?: Json | null
          tipo_distractor?: string | null
          updated_at?: string | null
          veces_seleccionada?: number | null
        }
        Update: {
          concepto_erroneo_asociado?: string | null
          contenido?: string
          contenido_html?: string | null
          created_at?: string | null
          efectividad_pedagogica?: number | null
          es_correcta?: boolean | null
          explicacion_por_que_incorrecta?: string | null
          id?: string
          imagen_url?: string | null
          letra?: string
          orden?: number
          plausibilidad_distractor?: number | null
          porcentaje_seleccion?: number | null
          pregunta_id?: string | null
          puntaje_asignado?: number | null
          seleccionada_por_nivel?: Json | null
          tipo_distractor?: string | null
          updated_at?: string | null
          veces_seleccionada?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alternativas_respuesta_pregunta_id_fkey"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "banco_preguntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_alternativas_respuesta_pregunta_id"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "preguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      analisis_evaluacion: {
        Row: {
          alertas_academicas: string[] | null
          algoritmo_utilizado: string | null
          brechas_identificadas: Json | null
          comparacion_con_pares: Json | null
          competencias_debiles: string[] | null
          competencias_fuertes: string[] | null
          confiabilidad_estimacion: number | null
          confianza_analisis: number | null
          created_at: string | null
          datos_entrenamiento_modelo: string | null
          debilidades_identificadas: Json | null
          distribucion_tiempo_recomendada: Json | null
          error_estandar_medicion: number | null
          errores_sistematicos: string[] | null
          estilo_aprendizaje_predominante: string | null
          evaluacion_id: string | null
          evolucion_historica: Json | null
          factores_riesgo: string[] | null
          fecha_analisis: string | null
          fortalezas_identificadas: Json | null
          frecuencia_evaluacion_recomendada: string | null
          habilidades_cognitivas: Json | null
          hitos_seguimiento: Json | null
          horas_estudio_recomendadas_semanal: number | null
          id: string
          intervalo_confianza_inferior: number | null
          intervalo_confianza_superior: number | null
          intervalo_prediccion_inferior: number | null
          intervalo_prediccion_superior: number | null
          logros_desbloqueados: string[] | null
          misconceptos_identificados: string[] | null
          modalidades_practica: string[] | null
          nivel_clasificado: string | null
          nivel_distraccion_estimado: number | null
          nivel_gamificacion: number | null
          nivel_habilidad_estimado: number | null
          nivel_paes_estimado: string | null
          nodos_deficitarios: string[] | null
          nodos_dominados: string[] | null
          nodos_en_desarrollo: string[] | null
          objetivos_corto_plazo: Json | null
          objetivos_largo_plazo: Json | null
          objetivos_mediano_plazo: Json | null
          oportunidades_mejora: string[] | null
          parametros_algoritmo: Json | null
          patron_resolucion_problemas: string | null
          percentil_poblacional: number | null
          persistencia_ante_dificultad: string | null
          probabilidad_ingreso_carrera: Json | null
          puntaje_paes_predicho: number | null
          puntos_experiencia: number | null
          racha_estudio_actual: number | null
          recursos_estudio_prioritarios: Json | null
          secuencia_estudio_sugerida: string[] | null
          sesion_id: string | null
          stanine: number | null
          tecnicas_estudio_sugeridas: string[] | null
          tiempo_procesamiento_ms: number | null
          tipos_errores_frecuentes: Json | null
          updated_at: string | null
          user_id: string
          velocidad_procesamiento: string | null
          version_modelo: string | null
        }
        Insert: {
          alertas_academicas?: string[] | null
          algoritmo_utilizado?: string | null
          brechas_identificadas?: Json | null
          comparacion_con_pares?: Json | null
          competencias_debiles?: string[] | null
          competencias_fuertes?: string[] | null
          confiabilidad_estimacion?: number | null
          confianza_analisis?: number | null
          created_at?: string | null
          datos_entrenamiento_modelo?: string | null
          debilidades_identificadas?: Json | null
          distribucion_tiempo_recomendada?: Json | null
          error_estandar_medicion?: number | null
          errores_sistematicos?: string[] | null
          estilo_aprendizaje_predominante?: string | null
          evaluacion_id?: string | null
          evolucion_historica?: Json | null
          factores_riesgo?: string[] | null
          fecha_analisis?: string | null
          fortalezas_identificadas?: Json | null
          frecuencia_evaluacion_recomendada?: string | null
          habilidades_cognitivas?: Json | null
          hitos_seguimiento?: Json | null
          horas_estudio_recomendadas_semanal?: number | null
          id?: string
          intervalo_confianza_inferior?: number | null
          intervalo_confianza_superior?: number | null
          intervalo_prediccion_inferior?: number | null
          intervalo_prediccion_superior?: number | null
          logros_desbloqueados?: string[] | null
          misconceptos_identificados?: string[] | null
          modalidades_practica?: string[] | null
          nivel_clasificado?: string | null
          nivel_distraccion_estimado?: number | null
          nivel_gamificacion?: number | null
          nivel_habilidad_estimado?: number | null
          nivel_paes_estimado?: string | null
          nodos_deficitarios?: string[] | null
          nodos_dominados?: string[] | null
          nodos_en_desarrollo?: string[] | null
          objetivos_corto_plazo?: Json | null
          objetivos_largo_plazo?: Json | null
          objetivos_mediano_plazo?: Json | null
          oportunidades_mejora?: string[] | null
          parametros_algoritmo?: Json | null
          patron_resolucion_problemas?: string | null
          percentil_poblacional?: number | null
          persistencia_ante_dificultad?: string | null
          probabilidad_ingreso_carrera?: Json | null
          puntaje_paes_predicho?: number | null
          puntos_experiencia?: number | null
          racha_estudio_actual?: number | null
          recursos_estudio_prioritarios?: Json | null
          secuencia_estudio_sugerida?: string[] | null
          sesion_id?: string | null
          stanine?: number | null
          tecnicas_estudio_sugeridas?: string[] | null
          tiempo_procesamiento_ms?: number | null
          tipos_errores_frecuentes?: Json | null
          updated_at?: string | null
          user_id: string
          velocidad_procesamiento?: string | null
          version_modelo?: string | null
        }
        Update: {
          alertas_academicas?: string[] | null
          algoritmo_utilizado?: string | null
          brechas_identificadas?: Json | null
          comparacion_con_pares?: Json | null
          competencias_debiles?: string[] | null
          competencias_fuertes?: string[] | null
          confiabilidad_estimacion?: number | null
          confianza_analisis?: number | null
          created_at?: string | null
          datos_entrenamiento_modelo?: string | null
          debilidades_identificadas?: Json | null
          distribucion_tiempo_recomendada?: Json | null
          error_estandar_medicion?: number | null
          errores_sistematicos?: string[] | null
          estilo_aprendizaje_predominante?: string | null
          evaluacion_id?: string | null
          evolucion_historica?: Json | null
          factores_riesgo?: string[] | null
          fecha_analisis?: string | null
          fortalezas_identificadas?: Json | null
          frecuencia_evaluacion_recomendada?: string | null
          habilidades_cognitivas?: Json | null
          hitos_seguimiento?: Json | null
          horas_estudio_recomendadas_semanal?: number | null
          id?: string
          intervalo_confianza_inferior?: number | null
          intervalo_confianza_superior?: number | null
          intervalo_prediccion_inferior?: number | null
          intervalo_prediccion_superior?: number | null
          logros_desbloqueados?: string[] | null
          misconceptos_identificados?: string[] | null
          modalidades_practica?: string[] | null
          nivel_clasificado?: string | null
          nivel_distraccion_estimado?: number | null
          nivel_gamificacion?: number | null
          nivel_habilidad_estimado?: number | null
          nivel_paes_estimado?: string | null
          nodos_deficitarios?: string[] | null
          nodos_dominados?: string[] | null
          nodos_en_desarrollo?: string[] | null
          objetivos_corto_plazo?: Json | null
          objetivos_largo_plazo?: Json | null
          objetivos_mediano_plazo?: Json | null
          oportunidades_mejora?: string[] | null
          parametros_algoritmo?: Json | null
          patron_resolucion_problemas?: string | null
          percentil_poblacional?: number | null
          persistencia_ante_dificultad?: string | null
          probabilidad_ingreso_carrera?: Json | null
          puntaje_paes_predicho?: number | null
          puntos_experiencia?: number | null
          racha_estudio_actual?: number | null
          recursos_estudio_prioritarios?: Json | null
          secuencia_estudio_sugerida?: string[] | null
          sesion_id?: string | null
          stanine?: number | null
          tecnicas_estudio_sugeridas?: string[] | null
          tiempo_procesamiento_ms?: number | null
          tipos_errores_frecuentes?: Json | null
          updated_at?: string | null
          user_id?: string
          velocidad_procesamiento?: string | null
          version_modelo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analisis_evaluacion_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analisis_evaluacion_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones_evaluacion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_analisis_evaluacion_evaluacion_id"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      banco_preguntas: {
        Row: {
          ano_publicacion: number | null
          audio_url: string | null
          autor_texto: string | null
          codigo_pregunta: string
          comentarios_revision: string | null
          competencia_especifica: string | null
          competencias_evaluadas: string[] | null
          constantes_fisicas: Json | null
          contenido_dinamico: Json | null
          contexto_historico: string | null
          contexto_situacional: string | null
          created_at: string | null
          created_by: string | null
          cronologia: Json | null
          datos_tabla: Json | null
          disponible_evaluaciones: string[] | null
          distribucion_respuestas: Json | null
          documento_fuente: string | null
          efectividad_distractores: Json | null
          enunciado: string
          error_estandar_parametros: number | null
          escala_grafico: Json | null
          extension_palabras: number | null
          fecha_validacion: string | null
          formato_respuesta_numerica: string | null
          formulas_relevantes: string[] | null
          frecuencia_uso_recomendada: string | null
          fuente_texto: string | null
          genero_textual: string | null
          id: string
          imagen_principal_url: string | null
          imagen_secundaria_url: string | null
          indice_dificultad: number | null
          indice_discriminacion: number | null
          instrucciones_especificas: string | null
          lugares_geograficos: string[] | null
          mapa_imagen_url: string | null
          motivo_rechazo: string | null
          nivel_bloom: string | null
          nivel_complejidad_lexica: string | null
          nivel_dificultad: string
          nodo_code: string
          nodo_id: string | null
          num_alternativas: number | null
          palabras_clave: string[] | null
          parametro_adivinanza: number | null
          parametro_descuido: number | null
          parametro_dificultad: number | null
          parametro_discriminacion: number | null
          periodo_historico: string | null
          permite_respuesta_parcial: boolean | null
          personajes_involucrados: string[] | null
          porcentaje_acierto: number | null
          pregunta_original_id: string | null
          prerrequisitos_conceptuales: string[] | null
          prueba_paes: string
          recursos_interactivos: Json | null
          requiere_supervision: boolean | null
          revisor_id: string | null
          tags_cognitivos: string[] | null
          tags_contenido: string[] | null
          tags_curriculares: string[] | null
          texto_base: string | null
          tiempo_estimado_segundos: number | null
          tiempo_lectura_adicional: number | null
          tiempo_promedio_respuesta: number | null
          tipo_documento: string | null
          tipo_grafico: string | null
          tipo_pregunta: string | null
          tipo_texto: string | null
          tolerancia_numerica: number | null
          unidades_trabajo: string | null
          updated_at: string | null
          validada: boolean | null
          variables_involucradas: string[] | null
          veces_respondida_correctamente: number | null
          veces_utilizada: number | null
          version_pregunta: number | null
          video_url: string | null
        }
        Insert: {
          ano_publicacion?: number | null
          audio_url?: string | null
          autor_texto?: string | null
          codigo_pregunta: string
          comentarios_revision?: string | null
          competencia_especifica?: string | null
          competencias_evaluadas?: string[] | null
          constantes_fisicas?: Json | null
          contenido_dinamico?: Json | null
          contexto_historico?: string | null
          contexto_situacional?: string | null
          created_at?: string | null
          created_by?: string | null
          cronologia?: Json | null
          datos_tabla?: Json | null
          disponible_evaluaciones?: string[] | null
          distribucion_respuestas?: Json | null
          documento_fuente?: string | null
          efectividad_distractores?: Json | null
          enunciado: string
          error_estandar_parametros?: number | null
          escala_grafico?: Json | null
          extension_palabras?: number | null
          fecha_validacion?: string | null
          formato_respuesta_numerica?: string | null
          formulas_relevantes?: string[] | null
          frecuencia_uso_recomendada?: string | null
          fuente_texto?: string | null
          genero_textual?: string | null
          id?: string
          imagen_principal_url?: string | null
          imagen_secundaria_url?: string | null
          indice_dificultad?: number | null
          indice_discriminacion?: number | null
          instrucciones_especificas?: string | null
          lugares_geograficos?: string[] | null
          mapa_imagen_url?: string | null
          motivo_rechazo?: string | null
          nivel_bloom?: string | null
          nivel_complejidad_lexica?: string | null
          nivel_dificultad: string
          nodo_code: string
          nodo_id?: string | null
          num_alternativas?: number | null
          palabras_clave?: string[] | null
          parametro_adivinanza?: number | null
          parametro_descuido?: number | null
          parametro_dificultad?: number | null
          parametro_discriminacion?: number | null
          periodo_historico?: string | null
          permite_respuesta_parcial?: boolean | null
          personajes_involucrados?: string[] | null
          porcentaje_acierto?: number | null
          pregunta_original_id?: string | null
          prerrequisitos_conceptuales?: string[] | null
          prueba_paes: string
          recursos_interactivos?: Json | null
          requiere_supervision?: boolean | null
          revisor_id?: string | null
          tags_cognitivos?: string[] | null
          tags_contenido?: string[] | null
          tags_curriculares?: string[] | null
          texto_base?: string | null
          tiempo_estimado_segundos?: number | null
          tiempo_lectura_adicional?: number | null
          tiempo_promedio_respuesta?: number | null
          tipo_documento?: string | null
          tipo_grafico?: string | null
          tipo_pregunta?: string | null
          tipo_texto?: string | null
          tolerancia_numerica?: number | null
          unidades_trabajo?: string | null
          updated_at?: string | null
          validada?: boolean | null
          variables_involucradas?: string[] | null
          veces_respondida_correctamente?: number | null
          veces_utilizada?: number | null
          version_pregunta?: number | null
          video_url?: string | null
        }
        Update: {
          ano_publicacion?: number | null
          audio_url?: string | null
          autor_texto?: string | null
          codigo_pregunta?: string
          comentarios_revision?: string | null
          competencia_especifica?: string | null
          competencias_evaluadas?: string[] | null
          constantes_fisicas?: Json | null
          contenido_dinamico?: Json | null
          contexto_historico?: string | null
          contexto_situacional?: string | null
          created_at?: string | null
          created_by?: string | null
          cronologia?: Json | null
          datos_tabla?: Json | null
          disponible_evaluaciones?: string[] | null
          distribucion_respuestas?: Json | null
          documento_fuente?: string | null
          efectividad_distractores?: Json | null
          enunciado?: string
          error_estandar_parametros?: number | null
          escala_grafico?: Json | null
          extension_palabras?: number | null
          fecha_validacion?: string | null
          formato_respuesta_numerica?: string | null
          formulas_relevantes?: string[] | null
          frecuencia_uso_recomendada?: string | null
          fuente_texto?: string | null
          genero_textual?: string | null
          id?: string
          imagen_principal_url?: string | null
          imagen_secundaria_url?: string | null
          indice_dificultad?: number | null
          indice_discriminacion?: number | null
          instrucciones_especificas?: string | null
          lugares_geograficos?: string[] | null
          mapa_imagen_url?: string | null
          motivo_rechazo?: string | null
          nivel_bloom?: string | null
          nivel_complejidad_lexica?: string | null
          nivel_dificultad?: string
          nodo_code?: string
          nodo_id?: string | null
          num_alternativas?: number | null
          palabras_clave?: string[] | null
          parametro_adivinanza?: number | null
          parametro_descuido?: number | null
          parametro_dificultad?: number | null
          parametro_discriminacion?: number | null
          periodo_historico?: string | null
          permite_respuesta_parcial?: boolean | null
          personajes_involucrados?: string[] | null
          porcentaje_acierto?: number | null
          pregunta_original_id?: string | null
          prerrequisitos_conceptuales?: string[] | null
          prueba_paes?: string
          recursos_interactivos?: Json | null
          requiere_supervision?: boolean | null
          revisor_id?: string | null
          tags_cognitivos?: string[] | null
          tags_contenido?: string[] | null
          tags_curriculares?: string[] | null
          texto_base?: string | null
          tiempo_estimado_segundos?: number | null
          tiempo_lectura_adicional?: number | null
          tiempo_promedio_respuesta?: number | null
          tipo_documento?: string | null
          tipo_grafico?: string | null
          tipo_pregunta?: string | null
          tipo_texto?: string | null
          tolerancia_numerica?: number | null
          unidades_trabajo?: string | null
          updated_at?: string | null
          validada?: boolean | null
          variables_involucradas?: string[] | null
          veces_respondida_correctamente?: number | null
          veces_utilizada?: number | null
          version_pregunta?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banco_preguntas_nodo_id_fkey"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "banco_preguntas_nodo_id_fkey"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_banco_preguntas_nodo_id"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "fk_banco_preguntas_nodo_id"
            columns: ["nodo_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_sessions: {
        Row: {
          battle_data: Json | null
          battle_type: string
          created_at: string
          creator_id: string
          creator_score: number | null
          difficulty_level: string
          ended_at: string | null
          id: string
          max_questions: number
          opponent_id: string | null
          opponent_score: number | null
          started_at: string | null
          status: string
          subject_focus: string
          time_limit_minutes: number
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          battle_data?: Json | null
          battle_type?: string
          created_at?: string
          creator_id: string
          creator_score?: number | null
          difficulty_level?: string
          ended_at?: string | null
          id?: string
          max_questions?: number
          opponent_id?: string | null
          opponent_score?: number | null
          started_at?: string | null
          status?: string
          subject_focus: string
          time_limit_minutes?: number
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          battle_data?: Json | null
          battle_type?: string
          created_at?: string
          creator_id?: string
          creator_score?: number | null
          difficulty_level?: string
          ended_at?: string | null
          id?: string
          max_questions?: number
          opponent_id?: string | null
          opponent_score?: number | null
          started_at?: string | null
          status?: string
          subject_focus?: string
          time_limit_minutes?: number
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      becas_financiamiento: {
        Row: {
          carreras_elegibles: string[] | null
          contacto: Json | null
          created_at: string | null
          documentos_requeridos: string[] | null
          estado: string | null
          fechas_postulacion: Json | null
          id: string
          institucion: string
          monto_maximo: number | null
          nombre: string
          porcentaje_cobertura: number | null
          puntaje_minimo_competencia_lectora: number | null
          puntaje_minimo_matematica: number | null
          puntaje_minimo_nem: number | null
          puntaje_minimo_ranking: number | null
          renta_maxima_familiar: number | null
          requisitos: Json | null
          tipo_beca: string
          updated_at: string | null
          url_postulacion: string | null
        }
        Insert: {
          carreras_elegibles?: string[] | null
          contacto?: Json | null
          created_at?: string | null
          documentos_requeridos?: string[] | null
          estado?: string | null
          fechas_postulacion?: Json | null
          id?: string
          institucion: string
          monto_maximo?: number | null
          nombre: string
          porcentaje_cobertura?: number | null
          puntaje_minimo_competencia_lectora?: number | null
          puntaje_minimo_matematica?: number | null
          puntaje_minimo_nem?: number | null
          puntaje_minimo_ranking?: number | null
          renta_maxima_familiar?: number | null
          requisitos?: Json | null
          tipo_beca: string
          updated_at?: string | null
          url_postulacion?: string | null
        }
        Update: {
          carreras_elegibles?: string[] | null
          contacto?: Json | null
          created_at?: string | null
          documentos_requeridos?: string[] | null
          estado?: string | null
          fechas_postulacion?: Json | null
          id?: string
          institucion?: string
          monto_maximo?: number | null
          nombre?: string
          porcentaje_cobertura?: number | null
          puntaje_minimo_competencia_lectora?: number | null
          puntaje_minimo_matematica?: number | null
          puntaje_minimo_nem?: number | null
          puntaje_minimo_ranking?: number | null
          renta_maxima_familiar?: number | null
          requisitos?: Json | null
          tipo_beca?: string
          updated_at?: string | null
          url_postulacion?: string | null
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "fk_calendar_events_related_node_id"
            columns: ["related_node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "fk_calendar_events_related_node_id"
            columns: ["related_node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_calendar_events_related_plan_id"
            columns: ["related_plan_id"]
            isOneToOne: false
            referencedRelation: "generated_study_plans"
            referencedColumns: ["id"]
          },
        ]
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
      evaluaciones: {
        Row: {
          acceso_publico: boolean | null
          codigo: string
          created_at: string | null
          created_by: string | null
          criterio_finalizacion: string | null
          descripcion: string | null
          distribucion_dificultad: Json | null
          duracion_minutos: number
          es_oficial: boolean | null
          esta_activo: boolean | null
          feedback_inmediato: boolean | null
          id: string
          instrucciones_especiales: string | null
          instrucciones_iniciales: string | null
          logros_desbloqueables: string[] | null
          modalidad: string | null
          mostrar_explicaciones: boolean | null
          mostrar_puntaje_parcial: boolean | null
          mostrar_respuestas_correctas: boolean | null
          nivel_dificultad: string | null
          nodos_incluidos: string[] | null
          nombre: string
          parametros_irt: Json | null
          permite_navegacion_libre: boolean | null
          permite_pausa: boolean | null
          permite_retroceder: boolean | null
          preguntas_por_nodo: number | null
          prueba_paes: string | null
          requiere_autenticacion: boolean | null
          requiere_validacion: boolean | null
          roles_permitidos: string[] | null
          seleccion_preguntas: string | null
          sistema_puntos: Json | null
          subtipo: string | null
          tiempo_minimo_pregunta: number | null
          tiempo_por_pregunta: number | null
          tipo_evaluacion: string
          total_preguntas: number
          updated_at: string | null
          usa_gamificacion: boolean | null
          usa_irt: boolean | null
          version: string | null
        }
        Insert: {
          acceso_publico?: boolean | null
          codigo: string
          created_at?: string | null
          created_by?: string | null
          criterio_finalizacion?: string | null
          descripcion?: string | null
          distribucion_dificultad?: Json | null
          duracion_minutos: number
          es_oficial?: boolean | null
          esta_activo?: boolean | null
          feedback_inmediato?: boolean | null
          id?: string
          instrucciones_especiales?: string | null
          instrucciones_iniciales?: string | null
          logros_desbloqueables?: string[] | null
          modalidad?: string | null
          mostrar_explicaciones?: boolean | null
          mostrar_puntaje_parcial?: boolean | null
          mostrar_respuestas_correctas?: boolean | null
          nivel_dificultad?: string | null
          nodos_incluidos?: string[] | null
          nombre: string
          parametros_irt?: Json | null
          permite_navegacion_libre?: boolean | null
          permite_pausa?: boolean | null
          permite_retroceder?: boolean | null
          preguntas_por_nodo?: number | null
          prueba_paes?: string | null
          requiere_autenticacion?: boolean | null
          requiere_validacion?: boolean | null
          roles_permitidos?: string[] | null
          seleccion_preguntas?: string | null
          sistema_puntos?: Json | null
          subtipo?: string | null
          tiempo_minimo_pregunta?: number | null
          tiempo_por_pregunta?: number | null
          tipo_evaluacion: string
          total_preguntas: number
          updated_at?: string | null
          usa_gamificacion?: boolean | null
          usa_irt?: boolean | null
          version?: string | null
        }
        Update: {
          acceso_publico?: boolean | null
          codigo?: string
          created_at?: string | null
          created_by?: string | null
          criterio_finalizacion?: string | null
          descripcion?: string | null
          distribucion_dificultad?: Json | null
          duracion_minutos?: number
          es_oficial?: boolean | null
          esta_activo?: boolean | null
          feedback_inmediato?: boolean | null
          id?: string
          instrucciones_especiales?: string | null
          instrucciones_iniciales?: string | null
          logros_desbloqueables?: string[] | null
          modalidad?: string | null
          mostrar_explicaciones?: boolean | null
          mostrar_puntaje_parcial?: boolean | null
          mostrar_respuestas_correctas?: boolean | null
          nivel_dificultad?: string | null
          nodos_incluidos?: string[] | null
          nombre?: string
          parametros_irt?: Json | null
          permite_navegacion_libre?: boolean | null
          permite_pausa?: boolean | null
          permite_retroceder?: boolean | null
          preguntas_por_nodo?: number | null
          prueba_paes?: string | null
          requiere_autenticacion?: boolean | null
          requiere_validacion?: boolean | null
          roles_permitidos?: string[] | null
          seleccion_preguntas?: string | null
          sistema_puntos?: Json | null
          subtipo?: string | null
          tiempo_minimo_pregunta?: number | null
          tiempo_por_pregunta?: number | null
          tipo_evaluacion?: string
          total_preguntas?: number
          updated_at?: string | null
          usa_gamificacion?: boolean | null
          usa_irt?: boolean | null
          version?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "fk_exercises_diagnostic_id"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exercises_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "fk_exercises_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      explicaciones_pregunta: {
        Row: {
          analisis_distractores: Json | null
          competencias_desarrolladas: string[] | null
          conceptos_clave_involucrados: string[] | null
          consejos_resolucion: string[] | null
          created_at: string | null
          ejercicios_similares_ids: string[] | null
          enlaces_estudio: string[] | null
          errores_comunes_identificados: string[] | null
          estrategias_mejora: string[] | null
          explicacion_respuesta_correcta: string
          feedback_estudiante_avanzado: string | null
          feedback_estudiante_basico: string | null
          feedback_estudiante_intermedio: string | null
          feedback_respuesta_correcta: string | null
          feedback_respuesta_incorrecta: string | null
          feedback_respuesta_parcial: string | null
          feedback_sin_respuesta: string | null
          habilidades_reforzar: string[] | null
          id: string
          logro_desbloqueado: string | null
          mensaje_motivacional: string | null
          nodos_repasar: string[] | null
          objetivos_aprendizaje_relacionados: string[] | null
          pregunta_id: string | null
          puntos_bonus_explicacion: number | null
          razonamiento_paso_a_paso: string[] | null
          tips_examen: string[] | null
          updated_at: string | null
          videos_explicativos: string[] | null
        }
        Insert: {
          analisis_distractores?: Json | null
          competencias_desarrolladas?: string[] | null
          conceptos_clave_involucrados?: string[] | null
          consejos_resolucion?: string[] | null
          created_at?: string | null
          ejercicios_similares_ids?: string[] | null
          enlaces_estudio?: string[] | null
          errores_comunes_identificados?: string[] | null
          estrategias_mejora?: string[] | null
          explicacion_respuesta_correcta: string
          feedback_estudiante_avanzado?: string | null
          feedback_estudiante_basico?: string | null
          feedback_estudiante_intermedio?: string | null
          feedback_respuesta_correcta?: string | null
          feedback_respuesta_incorrecta?: string | null
          feedback_respuesta_parcial?: string | null
          feedback_sin_respuesta?: string | null
          habilidades_reforzar?: string[] | null
          id?: string
          logro_desbloqueado?: string | null
          mensaje_motivacional?: string | null
          nodos_repasar?: string[] | null
          objetivos_aprendizaje_relacionados?: string[] | null
          pregunta_id?: string | null
          puntos_bonus_explicacion?: number | null
          razonamiento_paso_a_paso?: string[] | null
          tips_examen?: string[] | null
          updated_at?: string | null
          videos_explicativos?: string[] | null
        }
        Update: {
          analisis_distractores?: Json | null
          competencias_desarrolladas?: string[] | null
          conceptos_clave_involucrados?: string[] | null
          consejos_resolucion?: string[] | null
          created_at?: string | null
          ejercicios_similares_ids?: string[] | null
          enlaces_estudio?: string[] | null
          errores_comunes_identificados?: string[] | null
          estrategias_mejora?: string[] | null
          explicacion_respuesta_correcta?: string
          feedback_estudiante_avanzado?: string | null
          feedback_estudiante_basico?: string | null
          feedback_estudiante_intermedio?: string | null
          feedback_respuesta_correcta?: string | null
          feedback_respuesta_incorrecta?: string | null
          feedback_respuesta_parcial?: string | null
          feedback_sin_respuesta?: string | null
          habilidades_reforzar?: string[] | null
          id?: string
          logro_desbloqueado?: string | null
          mensaje_motivacional?: string | null
          nodos_repasar?: string[] | null
          objetivos_aprendizaje_relacionados?: string[] | null
          pregunta_id?: string | null
          puntos_bonus_explicacion?: number | null
          razonamiento_paso_a_paso?: string[] | null
          tips_examen?: string[] | null
          updated_at?: string | null
          videos_explicativos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "explicaciones_pregunta_pregunta_id_fkey"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "banco_preguntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_explicaciones_pregunta_pregunta_id"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "preguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_simulations: {
        Row: {
          available_funding: number | null
          created_at: string | null
          estimated_cost: number | null
          funding_sources: Json | null
          id: string
          projected_income: number | null
          risk_assessment: Json | null
          roi_analysis: Json | null
          simulation_name: string | null
          target_career: string | null
          user_id: string | null
        }
        Insert: {
          available_funding?: number | null
          created_at?: string | null
          estimated_cost?: number | null
          funding_sources?: Json | null
          id?: string
          projected_income?: number | null
          risk_assessment?: Json | null
          roi_analysis?: Json | null
          simulation_name?: string | null
          target_career?: string | null
          user_id?: string | null
        }
        Update: {
          available_funding?: number | null
          created_at?: string | null
          estimated_cost?: number | null
          funding_sources?: Json | null
          id?: string
          projected_income?: number | null
          risk_assessment?: Json | null
          roi_analysis?: Json | null
          simulation_name?: string | null
          target_career?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      generated_exercises: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty_level: string | null
          explanation: string | null
          id: string
          metadata: Json | null
          options: Json
          prueba_paes: string
          question: string
          skill_code: string | null
          source: string | null
          success_rate: number | null
          times_used: number | null
          user_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json | null
          options: Json
          prueba_paes: string
          question: string
          skill_code?: string | null
          source?: string | null
          success_rate?: number | null
          times_used?: number | null
          user_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json | null
          options?: Json
          prueba_paes?: string
          question?: string
          skill_code?: string | null
          source?: string | null
          success_rate?: number | null
          times_used?: number | null
          user_id?: string | null
        }
        Relationships: []
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
      index_usage_telemetry: {
        Row: {
          created_at: string | null
          id: string
          index_name: string
          is_critical: boolean | null
          last_used: string | null
          scans_count: number | null
          schema_name: string
          table_name: string
          tuples_fetched: number | null
          tuples_read: number | null
          updated_at: string | null
          usage_efficiency: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          index_name: string
          is_critical?: boolean | null
          last_used?: string | null
          scans_count?: number | null
          schema_name?: string
          table_name: string
          tuples_fetched?: number | null
          tuples_read?: number | null
          updated_at?: string | null
          usage_efficiency?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          index_name?: string
          is_critical?: boolean | null
          last_used?: string | null
          scans_count?: number | null
          schema_name?: string
          table_name?: string
          tuples_fetched?: number | null
          tuples_read?: number | null
          updated_at?: string | null
          usage_efficiency?: number | null
        }
        Relationships: []
      }
      institution_students: {
        Row: {
          created_at: string
          enrollment_date: string | null
          grade_level: string | null
          id: string
          institution_id: string
          metadata: Json | null
          status: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          enrollment_date?: string | null
          grade_level?: string | null
          id?: string
          institution_id: string
          metadata?: Json | null
          status?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          enrollment_date?: string | null
          grade_level?: string | null
          id?: string
          institution_id?: string
          metadata?: Json | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_institution_students_institution_id"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "institution_students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      institutions: {
        Row: {
          code: string
          contact_info: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          settings: Json | null
          type: string
          updated_at: string
        }
        Insert: {
          code: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          settings?: Json | null
          type?: string
          updated_at?: string
        }
        Update: {
          code?: string
          contact_info?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          settings?: Json | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      intelligent_achievements: {
        Row: {
          category: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          neural_requirements: Json | null
          points_reward: number | null
          rarity: string | null
          title: string
          unlock_conditions: Json
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          neural_requirements?: Json | null
          points_reward?: number | null
          rarity?: string | null
          title: string
          unlock_conditions: Json
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          neural_requirements?: Json | null
          points_reward?: number | null
          rarity?: string | null
          title?: string
          unlock_conditions?: Json
        }
        Relationships: []
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
            foreignKeyName: "fk_learning_sequences_biologia_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "fk_learning_sequences_biologia_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
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
      lectoguia_conversations: {
        Row: {
          content: string
          created_at: string | null
          id: string
          message_type: string
          metadata: Json | null
          session_id: string
          subject_context: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          session_id: string
          subject_context?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          session_id?: string
          subject_context?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      neural_events: {
        Row: {
          component_source: string | null
          event_data: Json
          event_type: string
          id: string
          neural_metrics: Json | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          component_source?: string | null
          event_data: Json
          event_type: string
          id?: string
          neural_metrics?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          component_source?: string | null
          event_data?: Json
          event_type?: string
          id?: string
          neural_metrics?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_neural_events_session_id"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "neural_telemetry_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "neural_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "neural_telemetry_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      neural_metrics: {
        Row: {
          change_rate: number | null
          current_value: number
          dimension_id: string
          id: string
          last_calculated_at: string
          metadata: Json | null
          metric_type: string
          previous_value: number | null
          trend: string
          user_id: string
        }
        Insert: {
          change_rate?: number | null
          current_value?: number
          dimension_id: string
          id?: string
          last_calculated_at?: string
          metadata?: Json | null
          metric_type: string
          previous_value?: number | null
          trend?: string
          user_id: string
        }
        Update: {
          change_rate?: number | null
          current_value?: number
          dimension_id?: string
          id?: string
          last_calculated_at?: string
          metadata?: Json | null
          metric_type?: string
          previous_value?: number | null
          trend?: string
          user_id?: string
        }
        Relationships: []
      }
      neural_telemetry_sessions: {
        Row: {
          avg_coherence: number | null
          avg_engagement: number | null
          created_at: string | null
          id: string
          metadata: Json | null
          session_end: string | null
          session_quality: number | null
          session_start: string | null
          total_events: number | null
          user_id: string | null
        }
        Insert: {
          avg_coherence?: number | null
          avg_engagement?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          session_end?: string | null
          session_quality?: number | null
          session_start?: string | null
          total_events?: number | null
          user_id?: string | null
        }
        Update: {
          avg_coherence?: number | null
          avg_engagement?: number | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          session_end?: string | null
          session_quality?: number | null
          session_start?: string | null
          total_events?: number | null
          user_id?: string | null
        }
        Relationships: []
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
            foreignKeyName: "fk_node_weights_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "critical_nodes_analysis_ciencias_2024"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "fk_node_weights_node_id"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "learning_nodes"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "fk_opciones_respuesta_pregunta_id"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "preguntas"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "fk_preguntas_examen_id"
            columns: ["examen_id"]
            isOneToOne: false
            referencedRelation: "examenes"
            referencedColumns: ["id"]
          },
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
      respuestas_evaluacion: {
        Row: {
          algoritmo_puntuacion: string | null
          alternativa_id: string | null
          created_at: string | null
          error_estandar_anterior: number | null
          error_estandar_posterior: number | null
          es_correcta: boolean | null
          es_parcialmente_correcta: boolean | null
          flags_comportamiento: string[] | null
          habilidad_estimada_antes: number | null
          habilidad_estimada_despues: number | null
          id: string
          indicadores_adivinanza: boolean | null
          indicadores_conocimiento: boolean | null
          informacion_aportada: number | null
          momento_respuesta: string | null
          nivel_confianza_estimado: number | null
          notas_automaticas: string | null
          numero_cambios_respuesta: number | null
          numero_clics_alternativas: number | null
          numero_clics_pregunta: number | null
          numero_relecturas: number | null
          orden_respuesta: number | null
          patron_movimiento_mouse: Json | null
          patron_scroll: Json | null
          porcentaje_texto_leido: number | null
          pregunta_id: string | null
          puntaje_maximo: number | null
          puntaje_obtenido: number | null
          respuesta_seleccionada: string | null
          secuencia_alternativas_visitadas: string[] | null
          sesion_id: string | null
          tiempo_decision_final: number | null
          tiempo_en_texto_base: number | null
          tiempo_entre_cambios: number[] | null
          tiempo_lectura_segundos: number | null
          tiempo_por_alternativa: Json | null
          tiempo_primera_seleccion: number | null
          tiempo_reflexion_segundos: number | null
          tiempo_respuesta_segundos: number | null
          user_id: string
          va_a_pregunta: number | null
          viene_de_pregunta: number | null
        }
        Insert: {
          algoritmo_puntuacion?: string | null
          alternativa_id?: string | null
          created_at?: string | null
          error_estandar_anterior?: number | null
          error_estandar_posterior?: number | null
          es_correcta?: boolean | null
          es_parcialmente_correcta?: boolean | null
          flags_comportamiento?: string[] | null
          habilidad_estimada_antes?: number | null
          habilidad_estimada_despues?: number | null
          id?: string
          indicadores_adivinanza?: boolean | null
          indicadores_conocimiento?: boolean | null
          informacion_aportada?: number | null
          momento_respuesta?: string | null
          nivel_confianza_estimado?: number | null
          notas_automaticas?: string | null
          numero_cambios_respuesta?: number | null
          numero_clics_alternativas?: number | null
          numero_clics_pregunta?: number | null
          numero_relecturas?: number | null
          orden_respuesta?: number | null
          patron_movimiento_mouse?: Json | null
          patron_scroll?: Json | null
          porcentaje_texto_leido?: number | null
          pregunta_id?: string | null
          puntaje_maximo?: number | null
          puntaje_obtenido?: number | null
          respuesta_seleccionada?: string | null
          secuencia_alternativas_visitadas?: string[] | null
          sesion_id?: string | null
          tiempo_decision_final?: number | null
          tiempo_en_texto_base?: number | null
          tiempo_entre_cambios?: number[] | null
          tiempo_lectura_segundos?: number | null
          tiempo_por_alternativa?: Json | null
          tiempo_primera_seleccion?: number | null
          tiempo_reflexion_segundos?: number | null
          tiempo_respuesta_segundos?: number | null
          user_id: string
          va_a_pregunta?: number | null
          viene_de_pregunta?: number | null
        }
        Update: {
          algoritmo_puntuacion?: string | null
          alternativa_id?: string | null
          created_at?: string | null
          error_estandar_anterior?: number | null
          error_estandar_posterior?: number | null
          es_correcta?: boolean | null
          es_parcialmente_correcta?: boolean | null
          flags_comportamiento?: string[] | null
          habilidad_estimada_antes?: number | null
          habilidad_estimada_despues?: number | null
          id?: string
          indicadores_adivinanza?: boolean | null
          indicadores_conocimiento?: boolean | null
          informacion_aportada?: number | null
          momento_respuesta?: string | null
          nivel_confianza_estimado?: number | null
          notas_automaticas?: string | null
          numero_cambios_respuesta?: number | null
          numero_clics_alternativas?: number | null
          numero_clics_pregunta?: number | null
          numero_relecturas?: number | null
          orden_respuesta?: number | null
          patron_movimiento_mouse?: Json | null
          patron_scroll?: Json | null
          porcentaje_texto_leido?: number | null
          pregunta_id?: string | null
          puntaje_maximo?: number | null
          puntaje_obtenido?: number | null
          respuesta_seleccionada?: string | null
          secuencia_alternativas_visitadas?: string[] | null
          sesion_id?: string | null
          tiempo_decision_final?: number | null
          tiempo_en_texto_base?: number | null
          tiempo_entre_cambios?: number[] | null
          tiempo_lectura_segundos?: number | null
          tiempo_por_alternativa?: Json | null
          tiempo_primera_seleccion?: number | null
          tiempo_reflexion_segundos?: number | null
          tiempo_respuesta_segundos?: number | null
          user_id?: string
          va_a_pregunta?: number | null
          viene_de_pregunta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "respuestas_evaluacion_alternativa_id_fkey"
            columns: ["alternativa_id"]
            isOneToOne: false
            referencedRelation: "alternativas_respuesta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respuestas_evaluacion_pregunta_id_fkey"
            columns: ["pregunta_id"]
            isOneToOne: false
            referencedRelation: "banco_preguntas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respuestas_evaluacion_sesion_id_fkey"
            columns: ["sesion_id"]
            isOneToOne: false
            referencedRelation: "sesiones_evaluacion"
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
      sesiones_evaluacion: {
        Row: {
          codigo_sesion: string
          created_at: string | null
          estado: string | null
          evaluacion_id: string | null
          fecha_expiracion: string | null
          fecha_finalizacion: string | null
          fecha_inicio: string | null
          fecha_primer_respuesta: string | null
          id: string
          navegador: string | null
          nombre_sesion: string | null
          numero_pausas: number | null
          pregunta_actual: number | null
          preguntas_marcadas_revision: number[] | null
          preguntas_omitidas: number[] | null
          preguntas_respondidas: number | null
          preguntas_visitadas: number[] | null
          resolucion_pantalla: string | null
          sistema_operativo: string | null
          tiempo_activo_segundos: number | null
          tiempo_inactividad_segundos: number | null
          tiempo_pausa_segundos: number | null
          tiempo_total_segundos: number | null
          tipo_dispositivo: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          codigo_sesion: string
          created_at?: string | null
          estado?: string | null
          evaluacion_id?: string | null
          fecha_expiracion?: string | null
          fecha_finalizacion?: string | null
          fecha_inicio?: string | null
          fecha_primer_respuesta?: string | null
          id?: string
          navegador?: string | null
          nombre_sesion?: string | null
          numero_pausas?: number | null
          pregunta_actual?: number | null
          preguntas_marcadas_revision?: number[] | null
          preguntas_omitidas?: number[] | null
          preguntas_respondidas?: number | null
          preguntas_visitadas?: number[] | null
          resolucion_pantalla?: string | null
          sistema_operativo?: string | null
          tiempo_activo_segundos?: number | null
          tiempo_inactividad_segundos?: number | null
          tiempo_pausa_segundos?: number | null
          tiempo_total_segundos?: number | null
          tipo_dispositivo?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          codigo_sesion?: string
          created_at?: string | null
          estado?: string | null
          evaluacion_id?: string | null
          fecha_expiracion?: string | null
          fecha_finalizacion?: string | null
          fecha_inicio?: string | null
          fecha_primer_respuesta?: string | null
          id?: string
          navegador?: string | null
          nombre_sesion?: string | null
          numero_pausas?: number | null
          pregunta_actual?: number | null
          preguntas_marcadas_revision?: number[] | null
          preguntas_omitidas?: number[] | null
          preguntas_respondidas?: number | null
          preguntas_visitadas?: number[] | null
          resolucion_pantalla?: string | null
          sistema_operativo?: string | null
          tiempo_activo_segundos?: number | null
          tiempo_inactividad_segundos?: number | null
          tiempo_pausa_segundos?: number | null
          tiempo_total_segundos?: number | null
          tipo_dispositivo?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sesiones_evaluacion_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
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
      system_metrics: {
        Row: {
          context: Json | null
          id: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          id?: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          id?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievement_unlocks: {
        Row: {
          achievement_id: string | null
          id: string
          neural_metrics_at_unlock: Json | null
          unlock_context: Json | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          id?: string
          neural_metrics_at_unlock?: Json | null
          unlock_context?: Json | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          id?: string
          neural_metrics_at_unlock?: Json | null
          unlock_context?: Json | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_unlocks_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "intelligent_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          achievement_type: string
          category: string
          description: string | null
          id: string
          metadata: Json | null
          points_awarded: number
          rarity: string
          title: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          achievement_type: string
          category: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points_awarded?: number
          rarity?: string
          title: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          achievement_type?: string
          category?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points_awarded?: number
          rarity?: string
          title?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_cost_limits: {
        Row: {
          created_at: string | null
          daily_limit: number | null
          id: string
          is_active: boolean | null
          module_limits: Json | null
          monthly_limit: number | null
          updated_at: string | null
          user_id: string | null
          weekly_limit: number | null
        }
        Insert: {
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          module_limits?: Json | null
          monthly_limit?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_limit?: number | null
        }
        Update: {
          created_at?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          module_limits?: Json | null
          monthly_limit?: number | null
          updated_at?: string | null
          user_id?: string | null
          weekly_limit?: number | null
        }
        Relationships: []
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
      user_notifications: {
        Row: {
          action_data: Json | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          notification_type: string
          priority: string
          title: string
          user_id: string
        }
        Insert: {
          action_data?: Json | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          notification_type: string
          priority?: string
          title: string
          user_id: string
        }
        Update: {
          action_data?: Json | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string
          priority?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          best_score: number
          id: string
          last_battle_at: string | null
          position: number | null
          ranking_type: string
          score: number
          season: string
          streak_count: number
          tier: string
          total_battles: number
          updated_at: string
          user_id: string
          victories: number
        }
        Insert: {
          best_score?: number
          id?: string
          last_battle_at?: string | null
          position?: number | null
          ranking_type: string
          score?: number
          season?: string
          streak_count?: number
          tier?: string
          total_battles?: number
          updated_at?: string
          user_id: string
          victories?: number
        }
        Update: {
          best_score?: number
          id?: string
          last_battle_at?: string | null
          position?: number | null
          ranking_type?: string
          score?: number
          season?: string
          streak_count?: number
          tier?: string
          total_battles?: number
          updated_at?: string
          user_id?: string
          victories?: number
        }
        Relationships: []
      }
      user_relationships: {
        Row: {
          child_user_id: string
          created_at: string
          id: string
          institution_id: string | null
          is_active: boolean
          metadata: Json | null
          parent_user_id: string
          relationship_type: string
          updated_at: string
        }
        Insert: {
          child_user_id: string
          created_at?: string
          id?: string
          institution_id?: string | null
          is_active?: boolean
          metadata?: Json | null
          parent_user_id: string
          relationship_type?: string
          updated_at?: string
        }
        Update: {
          child_user_id?: string
          created_at?: string
          id?: string
          institution_id?: string | null
          is_active?: boolean
          metadata?: Json | null
          parent_user_id?: string
          relationship_type?: string
          updated_at?: string
        }
        Relationships: []
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
      admin_dashboard_metrics: {
        Row: {
          avg_quality: number | null
          avg_response_time: number | null
          date: string | null
          module_source: string | null
          success_rate: number | null
          total_cost: number | null
          total_requests: number | null
          total_tokens: number | null
          unique_users: number | null
        }
        Relationships: []
      }
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
      analyze_index_performance: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          index_name: string
          index_size: string
          scans: number
          tuples_read: number
          tuples_fetched: number
          usage_efficiency: number
        }[]
      }
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
      calculate_gemini_cost: {
        Args: { tokens: number }
        Returns: number
      }
      calculate_neural_metrics_summary: {
        Args: { user_id_param: string; days_back?: number }
        Returns: Json
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
      neural_performance_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          avg_response_time: number
          total_events: number
          events_per_hour: number
          top_components: string[]
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
      update_index_usage_telemetry: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      validate_foreign_key_integrity: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          constraint_name: string
          status: string
          invalid_rows: number
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
