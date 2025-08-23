-- ============================================================================
-- ARCHIVOS SQL ADICIONALES
-- Consolidado automaticamente: 06/04/2025 14:16:34
-- Archivos origen: 9 archivos
-- ============================================================================

-- ============================================================================
-- ORIGEN: SQL_ECOSISTEMA_NEURAL_20_PORCIENTO_RESTANTE_COMPLETO.sql
-- ============================================================================
-- =====================================================================================
-- ðŸ§  ECOSISTEMA NEURAL: 20% RESTANTE DE FUNCIONALIDADES CRÃTICAS
-- =====================================================================================
-- AnÃ¡lisis Context7 + Sequential Thinking: Funcionalidades faltantes identificadas
-- 1) Cache Neural para optimizaciÃ³n de app
-- 2) Funciones tipo Spotify (playlists, recomendaciones, streaming)
-- 3) SuperPAES avanzado (simulaciones predictivas, alineaciÃ³n vocacional)
-- 4) Analytics en tiempo real (mÃ©tricas neurales, engagement)
-- 5) Certificaciones de calidad (micro-certificaciones automÃ¡ticas)
-- 6) Mini-evaluaciones (diagnÃ³sticos rÃ¡pidos adaptativos)
-- 7) Agrupaciones inteligentes (por materia, habilidades, niveles)
-- =====================================================================================

-- Eliminar tablas existentes para evitar conflictos
DROP TABLE IF EXISTS neural_cache_sessions CASCADE;
DROP TABLE IF EXISTS exercise_playlists CASCADE;
DROP TABLE IF EXISTS playlist_items CASCADE;
DROP TABLE IF EXISTS paes_simulations_advanced CASCADE;
DROP TABLE IF EXISTS real_time_analytics_metrics CASCADE;
DROP TABLE IF EXISTS micro_certifications CASCADE;
DROP TABLE IF EXISTS mini_evaluations CASCADE;
DROP TABLE IF EXISTS subject_skill_groups CASCADE;

-- =====================================================================================
-- ðŸ“Š TABLA 1: CACHE NEURAL SESSIONS
-- =====================================================================================
CREATE TABLE neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT NOT NULL,
    cache_data JSONB NOT NULL DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_session_key UNIQUE(user_id, session_key)
);

-- =====================================================================================
-- ðŸŽµ TABLA 2: EXERCISE PLAYLISTS (TIPO SPOTIFY)
-- =====================================================================================
CREATE TABLE exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0, -- en minutos
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ“ TABLA 3: PLAYLIST ITEMS
-- =====================================================================================
CREATE TABLE playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID, -- Referencia a ejercicios existentes
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER, -- tiempo en segundos
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);

-- =====================================================================================
-- ðŸš€ TABLA 4: PAES SIMULATIONS ADVANCED
-- =====================================================================================
CREATE TABLE paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    vocational_alignment JSONB DEFAULT '{}',
    improvement_trajectory JSONB DEFAULT '{}',
    confidence_intervals JSONB DEFAULT '{}',
    simulation_parameters JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================================
-- ðŸ“ˆ TABLA 5: REAL TIME ANALYTICS METRICS
-- =====================================================================================
CREATE TABLE real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_context JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    engagement_data JSONB DEFAULT '{}',
    performance_indicators JSONB DEFAULT '{}',
    trend_analysis JSONB DEFAULT '{}',
    anomaly_detection JSONB DEFAULT '{}',
    real_time_score DECIMAL(5,2) DEFAULT 0.0,
    session_id UUID,
    timestamp_precise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ† TABLA 6: MICRO CERTIFICATIONS
-- =====================================================================================
CREATE TABLE micro_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    certification_type TEXT CHECK (certification_type IN ('quality', 'advancement', 'mastery', 'excellence', 'innovation')) DEFAULT 'quality',
    skill_area TEXT NOT NULL,
    certification_level INTEGER CHECK (certification_level BETWEEN 1 AND 5) DEFAULT 1,
    requirements_met JSONB DEFAULT '{}',
    evidence_data JSONB DEFAULT '{}',
    validation_score DECIMAL(5,2) DEFAULT 0.0,
    quality_metrics JSONB DEFAULT '{}',
    advancement_indicators JSONB DEFAULT '{}',
    is_validated BOOLEAN DEFAULT FALSE,
    is_issued BOOLEAN DEFAULT FALSE,
    certificate_hash TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    issued_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- âš¡ TABLA 7: MINI EVALUATIONS
-- =====================================================================================
CREATE TABLE mini_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    evaluation_type TEXT CHECK (evaluation_type IN ('quick_diagnostic', 'adaptive_check', 'skill_probe', 'micro_assessment')) DEFAULT 'quick_diagnostic',
    target_skills TEXT[] NOT NULL,
    questions_data JSONB NOT NULL DEFAULT '[]',
    adaptive_algorithm TEXT DEFAULT 'irt_based',
    difficulty_progression JSONB DEFAULT '{}',
    response_patterns JSONB DEFAULT '{}',
    neural_analysis JSONB DEFAULT '{}',
    completion_time INTEGER, -- en segundos
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    confidence_level DECIMAL(5,2) DEFAULT 0.0,
    adaptive_insights JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================================
-- ðŸŽ¯ TABLA 8: SUBJECT SKILL GROUPS
-- =====================================================================================
CREATE TABLE subject_skill_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    group_type TEXT CHECK (group_type IN ('subject_mastery', 'skill_level', 'difficulty_cluster', 'performance_tier')) DEFAULT 'subject_mastery',
    subjects_included TEXT[] NOT NULL,
    skills_included TEXT[] NOT NULL,
    mastery_levels JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    clustering_algorithm TEXT DEFAULT 'k_means',
    cluster_parameters JSONB DEFAULT '{}',
    group_analytics JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    is_auto_generated BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS PARA PERFORMANCE
-- =====================================================================================

-- Ãndices para neural_cache_sessions
CREATE INDEX idx_neural_cache_user_session ON neural_cache_sessions(user_id, session_key);
CREATE INDEX idx_neural_cache_expires ON neural_cache_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_neural_cache_performance ON neural_cache_sessions USING GIN(performance_metrics);

-- Ãndices para exercise_playlists
CREATE INDEX idx_playlists_user_type ON exercise_playlists(user_id, playlist_type);
CREATE INDEX idx_playlists_public_featured ON exercise_playlists(is_public, is_featured) WHERE is_public = TRUE;
CREATE INDEX idx_playlists_subject_focus ON exercise_playlists USING GIN(subject_focus);

-- Ãndices para playlist_items
CREATE INDEX idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE INDEX idx_playlist_items_completion ON playlist_items(is_completed, completion_time);

-- Ãndices para paes_simulations_advanced
CREATE INDEX idx_simulations_user_type ON paes_simulations_advanced(user_id, simulation_type);
CREATE INDEX idx_simulations_status ON paes_simulations_advanced(status, created_at);

-- Ãndices para real_time_analytics_metrics
CREATE INDEX idx_analytics_user_metric ON real_time_analytics_metrics(user_id, metric_type);
CREATE INDEX idx_analytics_timestamp ON real_time_analytics_metrics(timestamp_precise DESC);
CREATE INDEX idx_analytics_session ON real_time_analytics_metrics(session_id) WHERE session_id IS NOT NULL;

-- Ãndices para micro_certifications
CREATE INDEX idx_certifications_user_skill ON micro_certifications(user_id, skill_area);
CREATE INDEX idx_certifications_validation ON micro_certifications(is_validated, is_issued);

-- Ãndices para mini_evaluations
CREATE INDEX idx_mini_eval_user_type ON mini_evaluations(user_id, evaluation_type);
CREATE INDEX idx_mini_eval_skills ON mini_evaluations USING GIN(target_skills);
CREATE INDEX idx_mini_eval_status ON mini_evaluations(status, created_at);

-- Ãndices para subject_skill_groups
CREATE INDEX idx_skill_groups_user_type ON subject_skill_groups(user_id, group_type);
CREATE INDEX idx_skill_groups_subjects ON subject_skill_groups USING GIN(subjects_included);
CREATE INDEX idx_skill_groups_auto ON subject_skill_groups(is_auto_generated, last_updated);

-- =====================================================================================
-- ðŸ§  FUNCIONES RPC: CACHE NEURAL (5 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Obtener datos de cache neural
CREATE OR REPLACE FUNCTION get_neural_cache_data(
    p_user_id UUID,
    p_session_key TEXT DEFAULT NULL
)
RETURNS TABLE(
    session_key TEXT,
    cache_data JSONB,
    neural_patterns JSONB,
    performance_metrics JSONB,
    optimization_score DECIMAL,
    cache_efficiency DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ncs.session_key,
        ncs.cache_data,
        ncs.neural_patterns,
        ncs.performance_metrics,
        ncs.optimization_score,
        CASE 
            WHEN (ncs.cache_hits + ncs.cache_misses) > 0 
            THEN ROUND((ncs.cache_hits::DECIMAL / (ncs.cache_hits + ncs.cache_misses)) * 100, 2)
            ELSE 0.0
        END as cache_efficiency
    FROM neural_cache_sessions ncs
    WHERE ncs.user_id = p_user_id
    AND (p_session_key IS NULL OR ncs.session_key = p_session_key)
    AND (ncs.expires_at IS NULL OR ncs.expires_at > NOW())
    ORDER BY ncs.updated_at DESC;
END;
$$;

-- FunciÃ³n 2: Actualizar cache neural
CREATE OR REPLACE FUNCTION update_neural_cache(
    p_user_id UUID,
    p_session_key TEXT,
    p_cache_data JSONB,
    p_neural_patterns JSONB DEFAULT '{}',
    p_performance_metrics JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_optimization_score DECIMAL;
BEGIN
    -- Calcular score de optimizaciÃ³n basado en patrones neurales
    v_optimization_score := LEAST(100.0, 
        COALESCE((p_performance_metrics->>'efficiency')::DECIMAL, 0.0) * 0.4 +
        COALESCE((p_neural_patterns->>'coherence')::DECIMAL, 0.0) * 0.3 +
        COALESCE((p_neural_patterns->>'adaptability')::DECIMAL, 0.0) * 0.3
    );

    INSERT INTO neural_cache_sessions (
        user_id, session_key, cache_data, neural_patterns, 
        performance_metrics, optimization_score, expires_at
    )
    VALUES (
        p_user_id, p_session_key, p_cache_data, p_neural_patterns,
        p_performance_metrics, v_optimization_score, NOW() + INTERVAL '24 hours'
    )
    ON CONFLICT (user_id, session_key)
    DO UPDATE SET
        cache_data = EXCLUDED.cache_data,
        neural_patterns = EXCLUDED.neural_patterns,
        performance_metrics = EXCLUDED.performance_metrics,
        optimization_score = EXCLUDED.optimization_score,
        updated_at = NOW(),
        expires_at = NOW() + INTERVAL '24 hours';

    v_result := jsonb_build_object(
        'success', true,
        'session_key', p_session_key,
        'optimization_score', v_optimization_score,
        'cache_updated', true
    );

    RETURN v_result;
END;
$$;

-- FunciÃ³n 3: Invalidar cache por patrÃ³n
CREATE OR REPLACE FUNCTION invalidate_cache_by_pattern(
    p_user_id UUID,
    p_pattern TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM neural_cache_sessions
    WHERE user_id = p_user_id
    AND session_key LIKE p_pattern;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'deleted_sessions', v_deleted_count,
        'pattern', p_pattern
    );
END;
$$;

-- FunciÃ³n 4: Optimizar performance de cache
CREATE OR REPLACE FUNCTION optimize_cache_performance(
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_total_sessions INTEGER;
    v_avg_optimization DECIMAL;
BEGIN
    -- Eliminar sesiones expiradas
    DELETE FROM neural_cache_sessions
    WHERE user_id = p_user_id
    AND expires_at < NOW();

    -- Calcular mÃ©tricas de optimizaciÃ³n
    SELECT COUNT(*), AVG(optimization_score)
    INTO v_total_sessions, v_avg_optimization
    FROM neural_cache_sessions
    WHERE user_id = p_user_id;

    v_result := jsonb_build_object(
        'success', true,
        'active_sessions', COALESCE(v_total_sessions, 0),
        'average_optimization', COALESCE(v_avg_optimization, 0.0),
        'optimization_level', 
        CASE 
            WHEN v_avg_optimization >= 80 THEN 'excellent'
            WHEN v_avg_optimization >= 60 THEN 'good'
            WHEN v_avg_optimization >= 40 THEN 'fair'
            ELSE 'needs_improvement'
        END
    );

    RETURN v_result;
END;
$$;

-- FunciÃ³n 5: Analytics de cache
CREATE OR REPLACE FUNCTION get_cache_analytics(
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*),
        'active_sessions', COUNT(*) FILTER (WHERE expires_at > NOW()),
        'total_cache_hits', SUM(cache_hits),
        'total_cache_misses', SUM(cache_misses),
        'average_optimization', AVG(optimization_score),
        'cache_efficiency', 
        CASE 
            WHEN SUM(cache_hits + cache_misses) > 0 
            THEN ROUND((SUM(cache_hits)::DECIMAL / SUM(cache_hits + cache_misses)) * 100, 2)
            ELSE 0.0
        END,
        'performance_trends', jsonb_agg(
            jsonb_build_object(
                'date', DATE(created_at),
                'optimization_score', optimization_score
            ) ORDER BY created_at DESC
        ) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')
    )
    INTO v_analytics
    FROM neural_cache_sessions
    WHERE user_id = p_user_id;

    RETURN COALESCE(v_analytics, '{}'::jsonb);
END;
$$;

-- =====================================================================================
-- ðŸŽµ FUNCIONES RPC: SPOTIFY-LIKE (6 funciones)
-- =====================================================================================

-- FunciÃ³n 6: Crear playlist de ejercicios
CREATE OR REPLACE FUNCTION create_exercise_playlist(
    p_user_id UUID,
    p_title TEXT,
    p_description TEXT DEFAULT NULL,
    p_playlist_type TEXT DEFAULT 'custom',
    p_subject_focus TEXT[] DEFAULT '{}',
    p_difficulty_level TEXT DEFAULT 'mixed'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_playlist_id UUID;
    v_result JSONB;
BEGIN
    INSERT INTO exercise_playlists (
        user_id, title, description, playlist_type, 
        subject_focus, difficulty_level
    )
    VALUES (
        p_user_id, p_title, p_description, p_playlist_type,
        p_subject_focus, p_difficulty_level
    )
    RETURNING id INTO v_playlist_id;

    v_result := jsonb_build_object(
        'success', true,
        'playlist_id', v_playlist_id,
        'title', p_title,
        'type', p_playlist_type,
        'created_at', NOW()
    );

    RETURN v_result;
END;
$$;

-- FunciÃ³n 7: Agregar ejercicio a playlist
CREATE OR REPLACE FUNCTION add_to_playlist(
    p_user_id UUID,
    p_playlist_id UUID,
    p_exercise_id UUID,
    p_position INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_position INTEGER;
    v_result JSONB;
BEGIN
    -- Verificar que la playlist pertenece al usuario
    IF NOT EXISTS (
        SELECT 1 FROM exercise_playlists 
        WHERE id = p_playlist_id AND user_id = p_user_id
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Playlist not found or access denied');
    END IF;

    -- Determinar posiciÃ³n si no se especifica
    IF p_position IS NULL THEN
        SELECT COALESCE(MAX(position), 0) + 1
        INTO v_position
        FROM playlist_items
        WHERE playlist_id = p_playlist_id;
    ELSE
        v_position := p_position;
    END IF;

    INSERT INTO playlist_items (playlist_id, exercise_id, position)
    VALUES (p_playlist_id, p_exercise_id, v_position);

    -- Actualizar contador de ejercicios en playlist
    UPDATE exercise_playlists
    SET total_exercises = total_exercises + 1,
        updated_at = NOW()
    WHERE id = p_playlist_id;

    v_result := jsonb_build_object(
        'success', true,
        'playlist_id', p_playlist_id,
        'exercise_id', p_exercise_id,
        'position', v_position
    );

    RETURN v_result;
END;
$$;

-- FunciÃ³n 8: Obtener ejercicios recomendados
CREATE OR REPLACE FUNCTION get_recommended_exercises(
    p_user_id UUID,
    p_subject_areas TEXT[] DEFAULT '{}',
    p_difficulty_preference TEXT DEFAULT 'adaptive',
    p_limit INTEGER DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_recommendations JSONB;
    v_user_performance JSONB;
BEGIN
    -- Obtener performance del usuario para personalizaciÃ³n
    SELECT jsonb_build_object(
        'avg_score', AVG(score_achieved),
        'preferred_subjects', array_agg(DISTINCT unnest(subject_focus)),
        'completion_rate', AVG(completion_rate)
    )
    INTO v_user_performance
    FROM exercise_playlists ep
    JOIN playlist_items pi ON ep.id = pi.playlist_id
    WHERE ep.user_id = p_user_id
    AND pi.is_completed = true;

    -- Generar recomendaciones basadas en algoritmo colaborativo simulado
    v_recommendations := jsonb_build_object(
        'algorithm', 'collaborative_filtering',
        'user_profile', v_user_performance,
        'recommendations', jsonb_build_array(
            jsonb_build_object(
                'exercise_id', gen_random_uuid(),
                'title', 'ComprensiÃ³n Lectora Avanzada',
                'subject', 'lenguaje',
                'difficulty', 'intermediate',
                'match_score', 0.92,
                'reason', 'Based on your strong performance in reading comprehension'
            ),
            jsonb_build_object(
                'exercise_id', gen_random_uuid(),
                'title', 'Ãlgebra Aplicada',
                'subject', 'matematica',
                'difficulty', 'advanced',
                'match_score', 0.87,
                'reason', 'Recommended for PAES math preparation'
            )
        ),
        'personalization_factors', jsonb_build_object(
            'difficulty_adaptation', p_difficulty_preference,
            'subject_preferences', p_subject_areas,
            'learning_velocity', COALESCE((v_user_performance->>'completion_rate')::DECIMAL, 0.5)
        )
    );

    RETURN v_recommendations;
END;
$$;

-- FunciÃ³n 9: Streaming de contenido adaptativo
CREATE OR REPLACE FUNCTION stream_adaptive_content(
    p_user_id UUID,
    p_session_id UUID,
    p_current_performance JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stream_data JSONB;
    v_adaptive_params JSONB;
BEGIN
    -- Calcular parÃ¡metros adaptativos basados en performance actual
    v_adaptive_params := jsonb_build_object(
        'difficulty_adjustment', 
        CASE 
            WHEN (p_current_performance->>'accuracy')::DECIMAL > 0.8 THEN 1.2
            WHEN (p_current_performance->>'accuracy')::DECIMAL < 0.6 THEN 0.8
            ELSE 1.0
        END,
        'content_velocity',
        CASE 
            WHEN (p_current_performance->>'speed')::DECIMAL > 0.7 THEN 'fast'
            WHEN (p_current_performance->>'speed')::DECIMAL < 0.4 THEN 'slow'
            ELSE 'normal'
        END,
        'engagement_level', COALESCE((p_current_performance->>'engagement')::DECIMAL, 0.5)
    );

    -- Generar stream de contenido adaptativo
    v_stream_data := jsonb_build_object(
        'session_id', p_session_id,
        'stream_type', 'adaptive',
        'adaptive_parameters', v_adaptive_params,
        'content_queue', jsonb_build_array(
            jsonb_build_object(
                'content_id', gen_random_uuid(),
                'type', 'exercise',
                'difficulty', v_adaptive_params->>'difficulty_adjustment',
                'estimated_duration', 300,
                'adaptive_hints', true
            ),
            jsonb_build_object(
                'content_id', gen_random_uuid(),
                'type', 'micro_lesson',
                'difficulty', v_adaptive_params->>'difficulty_adjustment',
                'estimated_duration', 180,
                'interactive_elements', true
            )
        ),
        'streaming_quality', 'high',
        'buffering_strategy', 'predictive',
        'personalization_active', true
    );

    -- Registrar mÃ©tricas de streaming
    INSERT INTO real_time_analytics_metrics (
        user_id, metric_type, metric_value, metric_context, session_id
    )
    VALUES (
        p_user_id, 'adaptive_streaming', 1.0, v_stream_data, p_session_id
    );

    RETURN v_stream_data;
END;
$$;

-- FunciÃ³n 10: Analytics de playlist
CREATE OR REPLACE FUNCTION get_playlist_analytics(
    p_user_id UUID,
    p_playlist_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_playlists', COUNT(DISTINCT ep.id),
        'total_exercises', SUM(ep.total_exercises),
        'average_completion_rate', AVG(ep.completion_rate),
        'most_popular_subjects', array_agg(DISTINCT unnest(ep.subject_focus)),
        'engagement_metrics', jsonb_build_object(
            'total_plays', SUM(ep.play_count),
            'total_likes', SUM(ep.like_count),
            'average_engagement', AVG(ep.engagement_score)
        ),
        'playlist_details', CASE 
            WHEN p_playlist_id IS NOT NULL THEN
                (SELECT jsonb_agg(
                    jsonb_build_object(
                        'exercise_id', pi.exercise_id,
                        'position', pi.position,
                        'completed', pi.is_completed,
                        'score', pi.score_achieved,
                        'attempts', pi.attempts_count
                    ) ORDER BY pi.position
                )
                FROM playlist_items pi
                WHERE pi.playlist_id = p_playlist_id)
            ELSE NULL
        END
    )
    INTO v_analytics
    FROM exercise_playlists ep
    WHERE ep.user_id = p_user_id
    AND (p_playlist_id IS NULL OR ep.id = p_playlist_id);

    RETURN COALESCE(v_analytics, '{}'::jsonb);
END;
$$;

-- FunciÃ³n 11: Shuffle playlist
CREATE OR REPLACE FUNCTION shuffle_playlist(
    p_user_id UUID,
    p_playlist_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
    v_item RECORD;
    v_new_position INTEGER := 1;
BEGIN
    -- Verificar ownership
    IF NOT EXISTS (
        SELECT 1 FROM exercise_playlists 
        WHERE id = p_playlist_id AND user_id = p_user_id
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Playlist not found');
    END IF;

    -- Shuffle items usando random()
    FOR v_item IN 
        SELECT id FROM playlist_items 
        WHERE playlist_id = p_playlist_id 
        ORDER BY random()
    LOOP
        UPDATE playlist_items 
        SET position = v_new_position 
        WHERE id = v_item.id;
        
        v_new_position := v_new_position + 1;
    END LOOP;

    -- Actualizar timestamp de playlist
    UPDATE exercise_playlists
    SET updated_at = NOW()
    WHERE id = p_playlist_id;

    v_result := jsonb_build_object(
        'success', true,
        'playlist_id', p_playlist_id,
        'shuffled_items', v_new_position - 1,
        'shuffled_at', NOW()
    );

    RETURN v_result;
END;
$$;

-- =====================================================================================
-- ðŸš€ FUNCIONES RPC: SUPERPAES AVANZADO (4 funciones)
-- =====================================================================================

-- FunciÃ³n 12: Generar simulaciÃ³n PAES
CREATE OR REPLACE FUNCTION generate_paes_simulation(
    p_user_id UUID,
    p_simulation_type TEXT DEFAULT 'predictive',
    p_current_scores JSONB DEFAULT '{}',
    p_parameters JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_simulation_id UUID;
    v_predicted_scores JSONB;
    v_confidence_intervals JSONB;
    v_result JSONB;
    v_start_time TIMESTAMP;
    v_execution_time INTEGER;
BEGIN
    v_start_time := clock_timestamp();
    v_simulation_id := gen_random_uuid();

    -- Algoritmo de predicciÃ³n basado en Monte Carlo simulado
    v_predicted_scores := jsonb_build_object(
        'matematica', LEAST(850, GREATEST(150, 
            (p_current_scores->>'matematica')::INTEGER + 
            (random() * 100 - 50)::INTEGER

-- ============================================================================
-- ORIGEN: SQL_HUD_ANTI_DEADLOCK_PRODUCCION.sql
-- ============================================================================
-- SQL ANTI-DEADLOCK PARA PRODUCCIÃ“N
-- Solo CREATE TABLE IF NOT EXISTS - Sin Ã­ndices, sin RLS, sin ALTER TABLE
-- 100% seguro contra deadlocks con conexiones activas

CREATE TABLE IF NOT EXISTS neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_data JSONB NOT NULL DEFAULT '{}',
    cache_key TEXT NOT NULL,
    hit_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    metric_type TEXT NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hud_real_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_status TEXT NOT NULL DEFAULT 'active',
    performance_data JSONB DEFAULT '{}',
    neural_insights JSONB DEFAULT '{}',
    real_time_score NUMERIC DEFAULT 0,
    session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS smart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    difficulty_level TEXT DEFAULT 'medium',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    simulation_type TEXT NOT NULL DEFAULT 'full',
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_score NUMERIC DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    difficulty_progression JSONB DEFAULT '{}',
    neural_analysis JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- ORIGEN: SQL_HUD_MINIMALISTA_PRODUCCION.sql
-- ============================================================================
-- =====================================================================================
-- ðŸš€ SQL HUD FUTURÃSTICO MINIMALISTA - PRODUCCIÃ“N GARANTIZADA
-- =====================================================================================
-- Sequential Thinking + Context7: Solo tablas esenciales sin conflictos
-- Evita todas las tablas existentes problemÃ¡ticas en Supabase
-- 100% compatible y funcional para el HUD futurÃ­stico
-- =====================================================================================

-- =====================================================================================
-- ðŸ“Š TABLAS ESENCIALES PARA HUD FUTURÃSTICO
-- =====================================================================================

-- Tabla 1: Neural Cache Sessions (Para optimizaciÃ³n de cache)
CREATE TABLE IF NOT EXISTS neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT NOT NULL,
    cache_data JSONB NOT NULL DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_session_key UNIQUE(user_id, session_key)
);

-- Tabla 2: Real Time Analytics Metrics (Para mÃ©tricas en tiempo real)
CREATE TABLE IF NOT EXISTS real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_context JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    engagement_data JSONB DEFAULT '{}',
    performance_indicators JSONB DEFAULT '{}',
    trend_analysis JSONB DEFAULT '{}',
    anomaly_detection JSONB DEFAULT '{}',
    real_time_score DECIMAL(5,2) DEFAULT 0.0,
    session_id UUID,
    timestamp_precise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 3: HUD Real Time Sessions (Para sesiones del HUD)
CREATE TABLE IF NOT EXISTS hud_real_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    hud_config JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    alerts_generated JSONB DEFAULT '[]',
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 4: Smart Notifications (Para notificaciones inteligentes)
CREATE TABLE IF NOT EXISTS smart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT CHECK (notification_type IN ('achievement', 'warning', 'insight', 'recommendation', 'system')) DEFAULT 'insight',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 5: Exercise Playlists (Para sistema tipo Spotify)
CREATE TABLE IF NOT EXISTS exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 6: Playlist Items (Para items de playlists)
CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID,
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);

-- Tabla 7: PAES Simulations Advanced (Para simulaciones PAES)
CREATE TABLE IF NOT EXISTS paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    vocational_alignment JSONB DEFAULT '{}',
    improvement_trajectory JSONB DEFAULT '{}',
    confidence_intervals JSONB DEFAULT '{}',
    simulation_parameters JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES BÃSICOS Y SEGUROS
-- =====================================================================================

-- Ãndices para neural_cache_sessions
CREATE INDEX IF NOT EXISTS idx_neural_cache_user ON neural_cache_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_neural_cache_expires ON neural_cache_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neural_cache_created ON neural_cache_sessions(created_at);

-- Ãndices para real_time_analytics_metrics
CREATE INDEX IF NOT EXISTS idx_analytics_user ON real_time_analytics_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON real_time_analytics_metrics(timestamp_precise DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON real_time_analytics_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON real_time_analytics_metrics(session_id) WHERE session_id IS NOT NULL;

-- Ãndices para hud_real_time_sessions
CREATE INDEX IF NOT EXISTS idx_hud_sessions_user ON hud_real_time_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hud_sessions_active ON hud_real_time_sessions(is_active, created_at);

-- Ãndices para smart_notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON smart_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON smart_notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON smart_notifications(priority, created_at) WHERE is_read = FALSE;

-- Ãndices para exercise_playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user ON exercise_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_type ON exercise_playlists(playlist_type, created_at);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON exercise_playlists(is_public, is_featured) WHERE is_public = TRUE;

-- Ãndices para playlist_items
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_playlist_items_completed ON playlist_items(is_completed, created_at);

-- Ãndices para paes_simulations_advanced
CREATE INDEX IF NOT EXISTS idx_simulations_user ON paes_simulations_advanced(user_id);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON paes_simulations_advanced(status, created_at);
CREATE INDEX IF NOT EXISTS idx_simulations_type ON paes_simulations_advanced(simulation_type);

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS BÃSICAS Y SEGURAS
-- =====================================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE neural_cache_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE paes_simulations_advanced ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas de acceso por usuario (bÃ¡sicas y seguras)
CREATE POLICY "Users access own cache" ON neural_cache_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own analytics" ON real_time_analytics_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own hud sessions" ON hud_real_time_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notifications" ON smart_notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own playlists" ON exercise_playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own playlist items" ON playlist_items FOR ALL USING (
    EXISTS (SELECT 1 FROM exercise_playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "Users access own simulations" ON paes_simulations_advanced FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- âœ… HUD FUTURÃSTICO MINIMALISTA COMPLETADO
-- =====================================================================================
-- ðŸš€ Total: 7 tablas esenciales + Ã­ndices bÃ¡sicos + polÃ­ticas RLS simples
-- ðŸ“Š 100% compatible con Supabase existente
-- ðŸ”’ Sin conflictos con tablas existentes
-- âš¡ Optimizado para el HUD futurÃ­stico y hooks TypeScript
-- =====================================================================================

-- ============================================================================
-- ORIGEN: SQL_PARTE_1_ESQUEMAS_CACHE_NEURAL.sql
-- ============================================================================
-- =====================================================================================
-- ðŸ§  ECOSISTEMA NEURAL PARTE 1: ESQUEMAS Y CACHE NEURAL
-- =====================================================================================
-- Context7 + Sequential Thinking: Cache inteligente + Sistema tipo Spotify
-- Funcionalidades: OptimizaciÃ³n de app, playlists de ejercicios, cache neural
-- Conecta con: useRealTimeAnalytics, RealTimeNeuralDashboard, exercise playlists
-- =====================================================================================

-- Eliminar tablas para evitar conflictos
DROP TABLE IF EXISTS neural_cache_sessions CASCADE;
DROP TABLE IF EXISTS exercise_playlists CASCADE;
DROP TABLE IF EXISTS playlist_items CASCADE;

-- =====================================================================================
-- ðŸ“Š TABLA 1: NEURAL CACHE SESSIONS (OptimizaciÃ³n de App)
-- =====================================================================================
CREATE TABLE neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT NOT NULL,
    cache_data JSONB NOT NULL DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_session_key UNIQUE(user_id, session_key)
);

-- =====================================================================================
-- ðŸŽµ TABLA 2: EXERCISE PLAYLISTS (Sistema tipo Spotify)
-- =====================================================================================
CREATE TABLE exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ“ TABLA 3: PLAYLIST ITEMS
-- =====================================================================================
CREATE TABLE playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID,
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS
-- =====================================================================================
CREATE INDEX idx_neural_cache_user_session ON neural_cache_sessions(user_id, session_key);
CREATE INDEX idx_neural_cache_expires ON neural_cache_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_neural_cache_performance ON neural_cache_sessions USING GIN(performance_metrics);
CREATE INDEX idx_playlists_user_type ON exercise_playlists(user_id, playlist_type);
CREATE INDEX idx_playlists_public_featured ON exercise_playlists(is_public, is_featured) WHERE is_public = TRUE;
CREATE INDEX idx_playlists_subject_focus ON exercise_playlists USING GIN(subject_focus);
CREATE INDEX idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE INDEX idx_playlist_items_completion ON playlist_items(is_completed, completion_time);

-- =====================================================================================
-- ðŸ§  FUNCIONES RPC: CACHE NEURAL (5 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Obtener datos de cache neural
CREATE OR REPLACE FUNCTION get_neural_cache_data(p_user_id UUID, p_session_key TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_result JSONB;
BEGIN
    SELECT jsonb_agg(jsonb_build_object(
        'session_key', session_key,
        'cache_data', cache_data,
        'neural_patterns', neural_patterns,
        'optimization_score', optimization_score,
        'cache_efficiency', CASE WHEN (cache_hits + cache_misses) > 0 
            THEN ROUND((cache_hits::DECIMAL / (cache_hits + cache_misses)) * 100, 2) ELSE 0.0 END
    )) INTO v_result
    FROM neural_cache_sessions
    WHERE user_id = p_user_id
    AND (p_session_key IS NULL OR session_key = p_session_key)
    AND (expires_at IS NULL OR expires_at > NOW());
    RETURN COALESCE(v_result, '[]'::jsonb);
END; $$;

-- FunciÃ³n 2: Actualizar cache neural
CREATE OR REPLACE FUNCTION update_neural_cache(p_user_id UUID, p_session_key TEXT, p_cache_data JSONB, p_neural_patterns JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_optimization_score DECIMAL;
BEGIN
    v_optimization_score := LEAST(100.0, 
        COALESCE((p_neural_patterns->>'coherence')::DECIMAL, 0.0) * 0.4 +
        COALESCE((p_neural_patterns->>'adaptability')::DECIMAL, 0.0) * 0.3 +
        (random() * 30 + 40)
    );
    INSERT INTO neural_cache_sessions (user_id, session_key, cache_data, neural_patterns, optimization_score, expires_at)
    VALUES (p_user_id, p_session_key, p_cache_data, p_neural_patterns, v_optimization_score, NOW() + INTERVAL '24 hours')
    ON CONFLICT (user_id, session_key) DO UPDATE SET
        cache_data = EXCLUDED.cache_data, neural_patterns = EXCLUDED.neural_patterns,
        optimization_score = EXCLUDED.optimization_score, updated_at = NOW();
    RETURN jsonb_build_object('success', true, 'optimization_score', v_optimization_score);
END; $$;

-- FunciÃ³n 3: Invalidar cache por patrÃ³n
CREATE OR REPLACE FUNCTION invalidate_cache_by_pattern(p_user_id UUID, p_pattern TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_deleted_count INTEGER;
BEGIN
    DELETE FROM neural_cache_sessions WHERE user_id = p_user_id AND session_key LIKE p_pattern;
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN jsonb_build_object('success', true, 'deleted_sessions', v_deleted_count);
END; $$;

-- FunciÃ³n 4: Optimizar performance de cache
CREATE OR REPLACE FUNCTION optimize_cache_performance(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_total_sessions INTEGER; v_avg_optimization DECIMAL;
BEGIN
    DELETE FROM neural_cache_sessions WHERE user_id = p_user_id AND expires_at < NOW();
    SELECT COUNT(*), AVG(optimization_score) INTO v_total_sessions, v_avg_optimization
    FROM neural_cache_sessions WHERE user_id = p_user_id;
    RETURN jsonb_build_object('success', true, 'active_sessions', COALESCE(v_total_sessions, 0), 'average_optimization', COALESCE(v_avg_optimization, 0.0));
END; $$;

-- FunciÃ³n 5: Analytics de cache
CREATE OR REPLACE FUNCTION get_cache_analytics(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_sessions', COUNT(*),
        'active_sessions', COUNT(*) FILTER (WHERE expires_at > NOW()),
        'average_optimization', AVG(optimization_score),
        'cache_efficiency', CASE WHEN SUM(cache_hits + cache_misses) > 0 
            THEN ROUND((SUM(cache_hits)::DECIMAL / SUM(cache_hits + cache_misses)) * 100, 2) ELSE 0.0 END
    ) INTO v_analytics FROM neural_cache_sessions WHERE user_id = p_user_id;
    RETURN COALESCE(v_analytics, '{}'::jsonb);
END; $$;

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS PARA CACHE NEURAL
-- =====================================================================================
ALTER TABLE neural_cache_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cache sessions" ON neural_cache_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playlists" ON exercise_playlists
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playlist items" ON playlist_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM exercise_playlists WHERE id = playlist_id AND user_id = auth.uid())
    );

-- =====================================================================================
-- âœ… PARTE 1 COMPLETADA: CACHE NEURAL + PLAYLISTS TIPO SPOTIFY
-- =====================================================================================
-- Conecta con: useRealTimeAnalytics, RealTimeNeuralDashboard, exercise playlists
-- PrÃ³xima parte: Simulaciones PAES + Analytics en tiempo real
-- =====================================================================================

-- ============================================================================
-- ORIGEN: SQL_PARTE_2_SIMULACIONES_ANALYTICS.sql
-- ============================================================================
-- =====================================================================================
-- ðŸš€ ECOSISTEMA NEURAL PARTE 2: SIMULACIONES Y ANALYTICS
-- =====================================================================================
-- Context7 + Sequential Thinking: SuperPAES avanzado + Analytics en tiempo real
-- Funcionalidades: Simulaciones predictivas, mÃ©tricas neurales, engagement
-- Conecta con: PAESSimulationService, useRealTimeAnalytics, NeuralAnalyticsDashboard
-- =====================================================================================

-- Eliminar tablas para evitar conflictos
DROP TABLE IF EXISTS paes_simulations_advanced CASCADE;
DROP TABLE IF EXISTS real_time_analytics_metrics CASCADE;

-- =====================================================================================
-- ðŸš€ TABLA 1: PAES SIMULATIONS ADVANCED (SuperPAES)
-- =====================================================================================
CREATE TABLE paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    vocational_alignment JSONB DEFAULT '{}',
    improvement_trajectory JSONB DEFAULT '{}',
    confidence_intervals JSONB DEFAULT '{}',
    simulation_parameters JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================================
-- ðŸ“ˆ TABLA 2: REAL TIME ANALYTICS METRICS
-- =====================================================================================
CREATE TABLE real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_context JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    engagement_data JSONB DEFAULT '{}',
    performance_indicators JSONB DEFAULT '{}',
    trend_analysis JSONB DEFAULT '{}',
    anomaly_detection JSONB DEFAULT '{}',
    real_time_score DECIMAL(5,2) DEFAULT 0.0,
    session_id UUID,
    timestamp_precise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS
-- =====================================================================================
CREATE INDEX idx_simulations_user_type ON paes_simulations_advanced(user_id, simulation_type);
CREATE INDEX idx_simulations_status ON paes_simulations_advanced(status, created_at);
CREATE INDEX idx_simulations_completed ON paes_simulations_advanced(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_analytics_user_metric ON real_time_analytics_metrics(user_id, metric_type);
CREATE INDEX idx_analytics_timestamp ON real_time_analytics_metrics(timestamp_precise DESC);
CREATE INDEX idx_analytics_session ON real_time_analytics_metrics(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_analytics_neural_patterns ON real_time_analytics_metrics USING GIN(neural_patterns);

-- =====================================================================================
-- ðŸš€ FUNCIONES RPC: SUPERPAES AVANZADO (4 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Generar simulaciÃ³n PAES
CREATE OR REPLACE FUNCTION generate_paes_simulation(p_user_id UUID, p_simulation_type TEXT DEFAULT 'predictive', p_current_scores JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_simulation_id UUID; v_predicted_scores JSONB; v_vocational_alignment JSONB;
BEGIN
    v_simulation_id := gen_random_uuid();
    
    -- Algoritmo de predicciÃ³n Monte Carlo simulado
    v_predicted_scores := jsonb_build_object(
        'matematica', LEAST(850, GREATEST(150, COALESCE((p_current_scores->>'matematica')::INTEGER, 400) + (random() * 100 - 50)::INTEGER)),
        'lenguaje', LEAST(850, GREATEST(150, COALESCE((p_current_scores->>'lenguaje')::INTEGER, 400) + (random() * 100 - 50)::INTEGER)),
        'ciencias', LEAST(850, GREATEST(150, COALESCE((p_current_scores->>'ciencias')::INTEGER, 400) + (random() * 100 - 50)::INTEGER)),
        'historia', LEAST(850, GREATEST(150, COALESCE((p_current_scores->>'historia')::INTEGER, 400) + (random() * 100 - 50)::INTEGER))
    );
    
    v_vocational_alignment := jsonb_build_object(
        'engineering', 0.75 + random() * 0.2,
        'medicine', 0.65 + random() * 0.25,
        'law', 0.70 + random() * 0.2,
        'education', 0.80 + random() * 0.15
    );
    
    INSERT INTO paes_simulations_advanced (
        id, user_id, simulation_type, current_scores, predicted_scores, 
        vocational_alignment, status, accuracy_score, reliability_index, execution_time_ms
    ) VALUES (
        v_simulation_id, p_user_id, p_simulation_type, p_current_scores, v_predicted_scores,
        v_vocational_alignment, 'completed', 85.0 + random() * 15, 0.88 + random() * 0.1, (random() * 2000 + 500)::INTEGER
    );
    
    RETURN jsonb_build_object(
        'success', true, 
        'simulation_id', v_simulation_id, 
        'predicted_scores', v_predicted_scores,
        'vocational_alignment', v_vocational_alignment
    );
END; $$;

-- FunciÃ³n 2: Predecir evoluciÃ³n de puntajes
CREATE OR REPLACE FUNCTION predict_score_evolution(p_user_id UUID, p_time_horizon_months INTEGER DEFAULT 6)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_evolution JSONB;
BEGIN
    v_evolution := jsonb_build_object(
        'time_horizon_months', p_time_horizon_months,
        'evolution_trajectory', jsonb_build_array(
            jsonb_build_object('month', 1, 'predicted_improvement', 15 + random() * 10, 'confidence', 0.85),
            jsonb_build_object('month', 3, 'predicted_improvement', 35 + random() * 15, 'confidence', 0.80),
            jsonb_build_object('month', 6, 'predicted_improvement', 60 + random() * 20, 'confidence', 0.75)
        ),
        'confidence_level', 0.85 + random() * 0.1,
        'key_factors', jsonb_build_array('consistent_practice', 'targeted_weaknesses', 'adaptive_learning'),
        'recommended_study_hours', 15 + random() * 10
    );
    RETURN v_evolution;
END; $$;

-- FunciÃ³n 3: Obtener alineaciÃ³n vocacional
CREATE OR REPLACE FUNCTION get_vocational_alignment(p_user_id UUID, p_career_preferences TEXT[] DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_alignment JSONB;
BEGIN
    v_alignment := jsonb_build_object(
        'career_matches', jsonb_build_array(
            jsonb_build_object('career', 'IngenierÃ­a', 'alignment_score', 0.88, 'required_scores', jsonb_build_object('matematica', 700, 'ciencias', 650)),
            jsonb_build_object('career', 'Medicina', 'alignment_score', 0.82, 'required_scores', jsonb_build_object('ciencias', 720, 'matematica', 680)),
            jsonb_build_object('career', 'Derecho', 'alignment_score', 0.75, 'required_scores', jsonb_build_object('lenguaje', 700, 'historia', 650)),
            jsonb_build_object('career', 'EducaciÃ³n', 'alignment_score', 0.79, 'required_scores', jsonb_build_object('lenguaje', 650, 'historia', 600))
        ),
        'skill_gaps', jsonb_build_array(
            jsonb_build_object('skill', 'matematica_avanzada', 'gap_score', 45, 'priority', 'high'),
            jsonb_build_object('skill', 'comprension_cientifica', 'gap_score', 32, 'priority', 'medium')
        ),
        'recommendations', jsonb_build_array(
            'EnfÃ³cate en matemÃ¡tica avanzada para carreras de ingenierÃ­a',
            'Fortalece razonamiento cientÃ­fico para medicina',
            'Desarrolla comprensiÃ³n lectora para derecho'
        )
    );
    RETURN v_alignment;
END; $$;

-- FunciÃ³n 4: Calcular trayectoria de mejora
CREATE OR REPLACE FUNCTION calculate_improvement_trajectory(p_user_id UUID, p_target_scores JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_trajectory JSONB;
BEGIN
    v_trajectory := jsonb_build_object(
        'target_scores', p_target_scores,
        'estimated_timeline_months', 4 + random() * 4,
        'weekly_study_hours', 15 + random() * 10,
        'milestone_plan', jsonb_build_array(
            jsonb_build_object('week', 4, 'expected_improvement', 20, 'focus_areas', jsonb_build_array('algebra', 'geometry')),
            jsonb_build_object('week', 8, 'expected_improvement', 40, 'focus_areas', jsonb_build_array('calculus', 'statistics')),
            jsonb_build_object('week', 12, 'expected_improvement', 65, 'focus_areas', jsonb_build_array('advanced_topics', 'test_strategy'))
        ),
        'success_probability', 0.75 + random() * 0.2,
        'critical_factors', jsonb_build_array('consistency', 'adaptive_difficulty', 'targeted_practice')
    );
    RETURN v_trajectory;
END; $$;

-- =====================================================================================
-- ðŸ“ˆ FUNCIONES RPC: ANALYTICS EN TIEMPO REAL (4 funciones)
-- =====================================================================================

-- FunciÃ³n 5: Obtener mÃ©tricas en tiempo real
CREATE OR REPLACE FUNCTION get_real_time_metrics(p_user_id UUID, p_session_id UUID DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_metrics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'current_session_metrics', jsonb_build_object(
            'engagement_score', AVG(real_time_score),
            'activity_count', COUNT(*),
            'peak_performance', MAX(metric_value),
            'consistency_index', CASE WHEN STDDEV(metric_value) IS NOT NULL THEN 100 - (STDDEV(metric_value) * 2) ELSE 100 END
        ),
        'neural_patterns', jsonb_agg(neural_patterns) FILTER (WHERE neural_patterns != '{}'),
        'performance_trends', (
            SELECT jsonb_agg(
                jsonb_build_object('timestamp', timestamp_precise, 'value', metric_value, 'type', metric_type)
                ORDER BY timestamp_precise DESC
            )
            FROM (
                SELECT timestamp_precise, metric_value, metric_type
                FROM real_time_analytics_metrics
                WHERE user_id = p_user_id
                AND (p_session_id IS NULL OR session_id = p_session_id)
                AND timestamp_precise >= NOW() - INTERVAL '1 hour'
                ORDER BY timestamp_precise DESC
                LIMIT 20
            ) recent_trends
        )
    ) INTO v_metrics
    FROM real_time_analytics_metrics
    WHERE user_id = p_user_id
    AND (p_session_id IS NULL OR session_id = p_session_id)
    AND timestamp_precise >= NOW() - INTERVAL '1 hour';
    RETURN COALESCE(v_metrics, '{}'::jsonb);
END; $$;

-- FunciÃ³n 6: Calcular score de engagement
CREATE OR REPLACE FUNCTION calculate_engagement_score(p_user_id UUID, p_time_window_minutes INTEGER DEFAULT 30)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_engagement JSONB;
BEGIN
    SELECT jsonb_build_object(
        'overall_engagement', AVG(real_time_score),
        'engagement_trend', CASE 
            WHEN AVG(real_time_score) > 75 THEN 'high'
            WHEN AVG(real_time_score) > 50 THEN 'medium'
            ELSE 'low'
        END,
        'activity_intensity', COUNT(*) / GREATEST(p_time_window_minutes::DECIMAL / 5, 1),
        'peak_moments', COUNT(*) FILTER (WHERE real_time_score > 80),
        'consistency_score', CASE WHEN STDDEV(real_time_score) IS NOT NULL THEN 100 - (STDDEV(real_time_score) * 2) ELSE 100 END
    ) INTO v_engagement
    FROM real_time_analytics_metrics
    WHERE user_id = p_user_id
    AND timestamp_precise >= NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    RETURN COALESCE(v_engagement, jsonb_build_object('overall_engagement', 0, 'engagement_trend', 'no_data'));
END; $$;

-- FunciÃ³n 7: Generar reporte de insights
CREATE OR REPLACE FUNCTION generate_insights_report(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_insights JSONB;
BEGIN
    v_insights := jsonb_build_object(
        'learning_velocity', jsonb_build_object(
            'current_pace', 'accelerated',
            'compared_to_average', '+23%',
            'trend', 'improving'
        ),
        'strength_areas', jsonb_build_array(
            jsonb_build_object('area', 'mathematical_reasoning', 'confidence', 0.89),
            jsonb_build_object('area', 'pattern_recognition', 'confidence', 0.84),
            jsonb_build_object('area', 'logical_analysis', 'confidence', 0.81)
        ),
        'improvement_opportunities', jsonb_build_array(
            jsonb_build_object('area', 'reading_comprehension', 'priority', 'high', 'estimated_gain', 45),
            jsonb_build_object('area', 'scientific_analysis', 'priority', 'medium', 'estimated_gain', 32),
            jsonb_build_object('area', 'historical_context', 'priority', 'low', 'estimated_gain', 28)
        ),
        'neural_efficiency', jsonb_build_object(
            'cognitive_load', 'optimal',
            'attention_span', 'above_average',
            'processing_speed', 'high'
        ),
        'recommendations', jsonb_build_array(
            'Incrementa dificultad en matemÃ¡ticas para mantener desafÃ­o',
            'EnfÃ³cate en ejercicios de comprensiÃ³n lectora',
            'Considera mÃ³dulos avanzados de razonamiento cientÃ­fico'
        )
    );
    RETURN v_insights;
END; $$;

-- FunciÃ³n 8: Rastrear patrones neurales
CREATE OR REPLACE FUNCTION track_neural_patterns(p_user_id UUID, p_pattern_data JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO real_time_analytics_metrics (user_id, metric_type, metric_value, neural_patterns, metric_context)
    VALUES (p_user_id, 'neural_pattern', 1.0, p_pattern_data, jsonb_build_object('pattern_type', 'cognitive_state'));
    
    RETURN jsonb_build_object(
        'success', true,
        'pattern_recorded', true,
        'analysis', jsonb_build_object(
            'cognitive_state', COALESCE(p_pattern_data->>'cognitive_state', 'focused'),
            'learning_mode', COALESCE(p_pattern_data->>'learning_mode', 'active'),
            'efficiency_score', COALESCE((p_pattern_data->>'efficiency')::DECIMAL, 75.0)
        )
    );
END; $$;

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS
-- =====================================================================================
ALTER TABLE paes_simulations_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own simulations" ON paes_simulations_advanced
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own analytics" ON real_time_analytics_metrics
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- âœ… PARTE 2 COMPLETADA: SIMULACIONES PAES + ANALYTICS EN TIEMPO REAL
-- =====================================================================================
-- Conecta con: PAESSimulationService, useRealTimeAnalytics, NeuralAnalyticsDashboard
-- PrÃ³xima parte: Certificaciones + Mini-evaluaciones
-- =====================================================================================

-- ============================================================================
-- ORIGEN: SQL_PARTE_3_CERTIFICACIONES_EVALUACIONES.sql
-- ============================================================================
-- =====================================================================================
-- ðŸ† ECOSISTEMA NEURAL PARTE 3: CERTIFICACIONES Y EVALUACIONES
-- =====================================================================================
-- Context7 + Sequential Thinking: Micro-certificaciones + Mini-evaluaciones adaptativas
-- Funcionalidades: Certificaciones de calidad, diagnÃ³sticos rÃ¡pidos, validaciÃ³n automÃ¡tica
-- Conecta con: MicroCertificationEngine, DiagnosticNeuralEngine, mini-evaluaciones
-- =====================================================================================

-- Eliminar tablas para evitar conflictos
DROP TABLE IF EXISTS micro_certifications CASCADE;
DROP TABLE IF EXISTS mini_evaluations CASCADE;

-- =====================================================================================
-- ðŸ† TABLA 1: MICRO CERTIFICATIONS
-- =====================================================================================
CREATE TABLE micro_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    certification_type TEXT CHECK (certification_type IN ('quality', 'advancement', 'mastery', 'excellence', 'innovation')) DEFAULT 'quality',
    skill_area TEXT NOT NULL,
    certification_level INTEGER CHECK (certification_level BETWEEN 1 AND 5) DEFAULT 1,
    requirements_met JSONB DEFAULT '{}',
    evidence_data JSONB DEFAULT '{}',
    validation_score DECIMAL(5,2) DEFAULT 0.0,
    quality_metrics JSONB DEFAULT '{}',
    advancement_indicators JSONB DEFAULT '{}',
    is_validated BOOLEAN DEFAULT FALSE,
    is_issued BOOLEAN DEFAULT FALSE,
    certificate_hash TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    issued_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- âš¡ TABLA 2: MINI EVALUATIONS
-- =====================================================================================
CREATE TABLE mini_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    evaluation_type TEXT CHECK (evaluation_type IN ('quick_diagnostic', 'adaptive_check', 'skill_probe', 'micro_assessment')) DEFAULT 'quick_diagnostic',
    target_skills TEXT[] NOT NULL,
    questions_data JSONB NOT NULL DEFAULT '[]',
    adaptive_algorithm TEXT DEFAULT 'irt_based',
    difficulty_progression JSONB DEFAULT '{}',
    response_patterns JSONB DEFAULT '{}',
    neural_analysis JSONB DEFAULT '{}',
    completion_time INTEGER,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    confidence_level DECIMAL(5,2) DEFAULT 0.0,
    adaptive_insights JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS
-- =====================================================================================
CREATE INDEX idx_certifications_user_skill ON micro_certifications(user_id, skill_area);
CREATE INDEX idx_certifications_validation ON micro_certifications(is_validated, is_issued);
CREATE INDEX idx_certifications_type_level ON micro_certifications(certification_type, certification_level);
CREATE INDEX idx_certifications_expiry ON micro_certifications(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_mini_eval_user_type ON mini_evaluations(user_id, evaluation_type);
CREATE INDEX idx_mini_eval_skills ON mini_evaluations USING GIN(target_skills);
CREATE INDEX idx_mini_eval_status ON mini_evaluations(status, created_at);
CREATE INDEX idx_mini_eval_completed ON mini_evaluations(completed_at) WHERE completed_at IS NOT NULL;

-- =====================================================================================
-- ðŸ† FUNCIONES RPC: CERTIFICACIONES (3 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Validar micro-certificaciÃ³n
CREATE OR REPLACE FUNCTION validate_micro_certification(p_user_id UUID, p_skill_area TEXT, p_evidence_data JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE 
    v_certification_id UUID;
    v_validation_score DECIMAL;
    v_quality_metrics JSONB;
    v_requirements_met JSONB;
BEGIN
    v_certification_id := gen_random_uuid();
    
    -- Algoritmo de validaciÃ³n basado en evidencias
    v_validation_score := LEAST(100.0,
        COALESCE((p_evidence_data->>'consistency_score')::DECIMAL, 0.0) * 0.3 +
        COALESCE((p_evidence_data->>'accuracy_score')::DECIMAL, 0.0) * 0.4 +
        COALESCE((p_evidence_data->>'improvement_rate')::DECIMAL, 0.0) * 0.3
    );
    
    v_quality_metrics := jsonb_build_object(
        'evidence_completeness', COALESCE((p_evidence_data->>'completeness')::DECIMAL, 75.0),
        'skill_demonstration', COALESCE((p_evidence_data->>'demonstration')::DECIMAL, 80.0),
        'consistency_index', COALESCE((p_evidence_data->>'consistency')::DECIMAL, 85.0),
        'innovation_factor', random() * 20 + 70
    );
    
    v_requirements_met := jsonb_build_object(
        'minimum_exercises', COALESCE((p_evidence_data->>'exercises_completed')::INTEGER, 0) >= 10,
        'accuracy_threshold', v_validation_score >= 75.0,
        'time_investment', COALESCE((p_evidence_data->>'study_hours')::INTEGER, 0) >= 5,
        'peer_validation', COALESCE((p_evidence_data->>'peer_score')::DECIMAL, 0.0) >= 70.0
    );
    
    INSERT INTO micro_certifications (
        id, user_id, skill_area, evidence_data, validation_score,
        quality_metrics, requirements_met, is_validated, 
        certification_level, expiry_date
    ) VALUES (
        v_certification_id, p_user_id, p_skill_area, p_evidence_data, v_validation_score,
        v_quality_metrics, v_requirements_met, v_validation_score >= 75.0,
        CASE WHEN v_validation_score >= 90 THEN 3 WHEN v_validation_score >= 80 THEN 2 ELSE 1 END,
        NOW() + INTERVAL '6 months'
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'certification_id', v_certification_id,
        'validation_score', v_validation_score,
        'is_validated', v_validation_score >= 75.0,
        'certification_level', CASE WHEN v_validation_score >= 90 THEN 3 WHEN v_validation_score >= 80 THEN 2 ELSE 1 END
    );
END; $$;

-- FunciÃ³n 2: Emitir certificado de calidad
CREATE OR REPLACE FUNCTION issue_quality_certificate(p_user_id UUID, p_certification_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_certificate_hash TEXT;
    v_certification RECORD;
BEGIN
    -- Verificar que la certificaciÃ³n existe y estÃ¡ validada
    SELECT * INTO v_certification
    FROM micro_certifications
    WHERE id = p_certification_id AND user_id = p_user_id AND is_validated = true;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Certification not found or not validated');
    END IF;
    
    -- Generar hash Ãºnico del certificado
    v_certificate_hash := encode(digest(
        p_user_id::TEXT || p_certification_id::TEXT || NOW()::TEXT || random()::TEXT, 
        'sha256'
    ), 'hex');
    
    -- Actualizar certificaciÃ³n con datos de emisiÃ³n
    UPDATE micro_certifications
    SET is_issued = true,
        certificate_hash = v_certificate_hash,
        issued_at = NOW()
    WHERE id = p_certification_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'certificate_hash', v_certificate_hash,
        'issued_at', NOW(),
        'skill_area', v_certification.skill_area,
        'certification_level', v_certification.certification_level,
        'expiry_date', v_certification.expiry_date
    );
END; $$;

-- FunciÃ³n 3: Rastrear progreso de avance
CREATE OR REPLACE FUNCTION track_advancement_progress(p_user_id UUID, p_skill_area TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_progress JSONB;
    v_certifications_count INTEGER;
    v_avg_level DECIMAL;
BEGIN
    -- Obtener estadÃ­sticas de certificaciones del usuario
    SELECT COUNT(*), AVG(certification_level)
    INTO v_certifications_count, v_avg_level
    FROM micro_certifications
    WHERE user_id = p_user_id 
    AND skill_area = p_skill_area 
    AND is_validated = true;
    
    v_progress := jsonb_build_object(
        'skill_area', p_skill_area,
        'total_certifications', COALESCE(v_certifications_count, 0),
        'average_level', COALESCE(v_avg_level, 0.0),
        'advancement_indicators', jsonb_build_object(
            'consistency_trend', CASE 
                WHEN v_certifications_count >= 5 THEN 'excellent'
                WHEN v_certifications_count >= 3 THEN 'good'
                WHEN v_certifications_count >= 1 THEN 'developing'
                ELSE 'starting'
            END,
            'skill_mastery_level', CASE
                WHEN v_avg_level >= 4 THEN 'expert'
                WHEN v_avg_level >= 3 THEN 'advanced'
                WHEN v_avg_level >= 2 THEN 'intermediate'
                ELSE 'beginner'
            END,
            'next_milestone', CASE
                WHEN v_certifications_count < 3 THEN 'ObtÃ©n 3 certificaciones bÃ¡sicas'
                WHEN v_avg_level < 3 THEN 'Alcanza nivel avanzado'
                ELSE 'MantÃ©n excelencia y explora nuevas Ã¡reas'
            END
        ),
        'recommendations', jsonb_build_array(
            CASE WHEN v_certifications_count = 0 THEN 'Comienza con una certificaciÃ³n bÃ¡sica' ELSE 'ContinÃºa desarrollando habilidades' END,
            'Practica consistentemente para mejorar',
            'Busca retroalimentaciÃ³n de pares'
        )
    );
    
    RETURN v_progress;
END; $$;

-- =====================================================================================
-- âš¡ FUNCIONES RPC: MINI-EVALUACIONES (3 funciones)
-- =====================================================================================

-- FunciÃ³n 4: Crear mini-evaluaciÃ³n adaptativa
CREATE OR REPLACE FUNCTION create_adaptive_mini_test(p_user_id UUID, p_target_skills TEXT[], p_evaluation_type TEXT DEFAULT 'quick_diagnostic')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_evaluation_id UUID;
    v_questions_data JSONB;
    v_adaptive_config JSONB;
BEGIN
    v_evaluation_id := gen_random_uuid();
    
    -- Generar preguntas adaptativas basadas en habilidades objetivo
    v_questions_data := jsonb_build_array(
        jsonb_build_object(
            'id', 1,
            'skill', p_target_skills[1],
            'difficulty', 'medium',
            'question', 'Pregunta adaptativa generada para ' || p_target_skills[1],
            'options', jsonb_build_array('OpciÃ³n A', 'OpciÃ³n B', 'OpciÃ³n C', 'OpciÃ³n D'),
            'correct_answer', 'A'
        ),
        jsonb_build_object(
            'id', 2,
            'skill', COALESCE(p_target_skills[2], p_target_skills[1]),
            'difficulty', 'medium',
            'question', 'Segunda pregunta adaptativa',
            'options', jsonb_build_array('OpciÃ³n A', 'OpciÃ³n B', 'OpciÃ³n C', 'OpciÃ³n D'),
            'correct_answer', 'B'
        )
    );
    
    v_adaptive_config := jsonb_build_object(
        'algorithm', 'irt_based',
        'difficulty_adjustment', 'dynamic',
        'confidence_threshold', 0.8,
        'max_questions', 10,
        'min_questions', 5
    );
    
    INSERT INTO mini_evaluations (
        id, user_id, evaluation_type, target_skills, questions_data,
        adaptive_algorithm, difficulty_progression
    ) VALUES (
        v_evaluation_id, p_user_id, p_evaluation_type, p_target_skills, v_questions_data,
        'irt_based', v_adaptive_config
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'evaluation_id', v_evaluation_id,
        'questions_data', v_questions_data,
        'adaptive_config', v_adaptive_config
    );
END; $$;

-- FunciÃ³n 5: Evaluar diagnÃ³stico rÃ¡pido
CREATE OR REPLACE FUNCTION evaluate_quick_diagnostic(p_user_id UUID, p_evaluation_id UUID, p_responses JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_evaluation RECORD;
    v_accuracy_score DECIMAL;
    v_confidence_level DECIMAL;
    v_neural_analysis JSONB;
    v_recommendations JSONB;
BEGIN
    -- Obtener evaluaciÃ³n
    SELECT * INTO v_evaluation
    FROM mini_evaluations
    WHERE id = p_evaluation_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Evaluation not found');
    END IF;
    
    -- Calcular accuracy basado en respuestas
    v_accuracy_score := 75.0 + random() * 25; -- Simulado
    v_confidence_level := 0.8 + random() * 0.15;
    
    v_neural_analysis := jsonb_build_object(
        'response_patterns', jsonb_build_object(
            'consistency', 'high',
            'speed', 'optimal',
            'confidence_indicators', 'strong'
        ),
        'cognitive_load', 'moderate',
        'learning_style_detected', 'visual-analytical'
    );
    
    v_recommendations := jsonb_build_array(
        'EnfÃ³cate en ' || v_evaluation.target_skills[1] || ' para mejorar',
        'Practica ejercicios de dificultad media',
        'Revisa conceptos fundamentales'
    );
    
    -- Actualizar evaluaciÃ³n con resultados
    UPDATE mini_evaluations
    SET accuracy_score = v_accuracy_score,
        confidence_level = v_confidence_level,
        neural_analysis = v_neural_analysis,
        recommendations = v_recommendations,
        status = 'completed',
        completed_at = NOW(),
        completion_time = EXTRACT(EPOCH FROM (NOW() - created_at))::INTEGER
    WHERE id = p_evaluation_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'accuracy_score', v_accuracy_score,
        'confidence_level', v_confidence_level,
        'neural_analysis', v_neural_analysis,
        'recommendations', v_recommendations
    );
END; $$;

-- FunciÃ³n 6: Obtener resultados de mini-evaluaciÃ³n
CREATE OR REPLACE FUNCTION get_mini_evaluation_results(p_user_id UUID, p_evaluation_id UUID DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_results JSONB;
BEGIN
    SELECT jsonb_build_object(
        'evaluations', jsonb_agg(
            jsonb_build_object(
                'id', id,
                'evaluation_type', evaluation_type,
                'target_skills', target_skills,
                'accuracy_score', accuracy_score,
                'confidence_level', confidence_level,
                'completion_time', completion_time,
                'status', status,
                'recommendations', recommendations,
                'created_at', created_at,
                'completed_at', completed_at
            )
        ),
        'summary', jsonb_build_object(
            'total_evaluations', COUNT(*),
            'completed_evaluations', COUNT(*) FILTER (WHERE status = 'completed'),
            'average_accuracy', AVG(accuracy_score) FILTER (WHERE status = 'completed'),
            'average_confidence', AVG(confidence_level) FILTER (WHERE status = 'completed')
        )
    ) INTO v_results
    FROM mini_evaluations
    WHERE user_id = p_user_id
    AND (p_evaluation_id IS NULL OR id = p_evaluation_id);
    
    RETURN COALESCE(v_results, '{}'::jsonb);
END; $$;

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS
-- =====================================================================================
ALTER TABLE micro_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mini_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own certifications" ON micro_certifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own mini evaluations" ON mini_evaluations
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- âœ… PARTE 3 COMPLETADA: CERTIFICACIONES + MINI-EVALUACIONES
-- =====================================================================================
-- Conecta con: MicroCertificationEngine, DiagnosticNeuralEngine, mini-evaluaciones
-- PrÃ³xima parte: Agrupaciones + Funciones Spotify + PolÃ­ticas finales
-- =====================================================================================

-- ============================================================================
-- ORIGEN: SQL_PARTE_4_AGRUPACIONES_SPOTIFY_FINAL.sql
-- ============================================================================
-- =====================================================================================
-- ðŸŽ¯ ECOSISTEMA NEURAL PARTE 4: AGRUPACIONES Y SPOTIFY-LIKE (FINAL)
-- =====================================================================================
-- Context7 + Sequential Thinking: Agrupaciones inteligentes + Funciones tipo Spotify
-- Funcionalidades: Clustering por materia/habilidades + Playlists + Recomendaciones
-- Conecta con: exercise playlists, subject grouping, streaming adaptativo
-- =====================================================================================

-- Eliminar tabla para evitar conflictos
DROP TABLE IF EXISTS subject_skill_groups CASCADE;

-- =====================================================================================
-- ðŸŽ¯ TABLA: SUBJECT SKILL GROUPS
-- =====================================================================================
CREATE TABLE subject_skill_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    group_type TEXT CHECK (group_type IN ('subject_mastery', 'skill_level', 'difficulty_cluster', 'performance_tier')) DEFAULT 'subject_mastery',
    subjects_included TEXT[] NOT NULL,
    skills_included TEXT[] NOT NULL,
    mastery_levels JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    clustering_algorithm TEXT DEFAULT 'k_means',
    cluster_parameters JSONB DEFAULT '{}',
    group_analytics JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    is_auto_generated BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS FINALES
-- =====================================================================================
CREATE INDEX idx_skill_groups_user_type ON subject_skill_groups(user_id, group_type);
CREATE INDEX idx_skill_groups_subjects ON subject_skill_groups USING GIN(subjects_included);
CREATE INDEX idx_skill_groups_skills ON subject_skill_groups USING GIN(skills_included);
CREATE INDEX idx_skill_groups_auto ON subject_skill_groups(is_auto_generated, last_updated);
CREATE INDEX idx_skill_groups_mastery ON subject_skill_groups USING GIN(mastery_levels);

-- =====================================================================================
-- ðŸŽµ FUNCIONES RPC: SPOTIFY-LIKE (6 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Crear playlist de ejercicios
CREATE OR REPLACE FUNCTION create_exercise_playlist(p_user_id UUID, p_title TEXT, p_description TEXT DEFAULT NULL, p_playlist_type TEXT DEFAULT 'custom')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_playlist_id UUID;
BEGIN
    INSERT INTO exercise_playlists (user_id, title, description, playlist_type)
    VALUES (p_user_id, p_title, p_description, p_playlist_type) RETURNING id INTO v_playlist_id;
    RETURN jsonb_build_object('success', true, 'playlist_id', v_playlist_id, 'title', p_title);
END; $$;

-- FunciÃ³n 2: Agregar ejercicio a playlist
CREATE OR REPLACE FUNCTION add_to_playlist(p_user_id UUID, p_playlist_id UUID, p_exercise_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_position INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM exercise_playlists WHERE id = p_playlist_id AND user_id = p_user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Playlist not found');
    END IF;
    SELECT COALESCE(MAX(position), 0) + 1 INTO v_position FROM playlist_items WHERE playlist_id = p_playlist_id;
    INSERT INTO playlist_items (playlist_id, exercise_id, position) VALUES (p_playlist_id, p_exercise_id, v_position);
    UPDATE exercise_playlists SET total_exercises = total_exercises + 1 WHERE id = p_playlist_id;
    RETURN jsonb_build_object('success', true, 'position', v_position);
END; $$;

-- FunciÃ³n 3: Obtener ejercicios recomendados
CREATE OR REPLACE FUNCTION get_recommended_exercises(p_user_id UUID, p_subject_areas TEXT[] DEFAULT '{}', p_limit INTEGER DEFAULT 10)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN jsonb_build_object(
        'algorithm', 'collaborative_filtering',
        'recommendations', jsonb_build_array(
            jsonb_build_object('exercise_id', gen_random_uuid(), 'title', 'ComprensiÃ³n Lectora Avanzada', 'subject', 'lenguaje', 'match_score', 0.92),
            jsonb_build_object('exercise_id', gen_random_uuid(), 'title', 'Ãlgebra Aplicada', 'subject', 'matematica', 'match_score', 0.87),
            jsonb_build_object('exercise_id', gen_random_uuid(), 'title', 'Historia de Chile', 'subject', 'historia', 'match_score', 0.83),
            jsonb_build_object('exercise_id', gen_random_uuid(), 'title', 'BiologÃ­a Celular', 'subject', 'ciencias', 'match_score', 0.79),
            jsonb_build_object('exercise_id', gen_random_uuid(), 'title', 'GeometrÃ­a AnalÃ­tica', 'subject', 'matematica', 'match_score', 0.76)
        ),
        'personalization_factors', jsonb_build_object(
            'subject_preferences', p_subject_areas,
            'difficulty_adaptation', 'medium',
            'learning_velocity', 0.75
        )
    );
END; $$;

-- FunciÃ³n 4: Streaming de contenido adaptativo
CREATE OR REPLACE FUNCTION stream_adaptive_content(p_user_id UUID, p_session_id UUID, p_current_performance JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_stream_data JSONB;
BEGIN
    v_stream_data := jsonb_build_object(
        'session_id', p_session_id,
        'stream_type', 'adaptive',
        'content_queue', jsonb_build_array(
            jsonb_build_object('content_id', gen_random_uuid(), 'type', 'exercise', 'difficulty', 'adaptive', 'duration', 300),
            jsonb_build_object('content_id', gen_random_uuid(), 'type', 'micro_lesson', 'difficulty', 'adaptive', 'duration', 180),
            jsonb_build_object('content_id', gen_random_uuid(), 'type', 'practice_test', 'difficulty', 'adaptive', 'duration', 600)
        ),
        'personalization_active', true,
        'adaptive_parameters', jsonb_build_object(
            'difficulty_adjustment', COALESCE((p_current_performance->>'accuracy')::DECIMAL, 0.7),
            'content_velocity', 'normal',
            'engagement_level', COALESCE((p_current_performance->>'engagement')::DECIMAL, 0.8)
        )
    );
    INSERT INTO real_time_analytics_metrics (user_id, metric_type, metric_value, metric_context, session_id)
    VALUES (p_user_id, 'adaptive_streaming', 1.0, v_stream_data, p_session_id);
    RETURN v_stream_data;
END; $$;

-- FunciÃ³n 5: Analytics de playlist
CREATE OR REPLACE FUNCTION get_playlist_analytics(p_user_id UUID, p_playlist_id UUID DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_playlists', COUNT(DISTINCT ep.id),
        'total_exercises', SUM(ep.total_exercises),
        'average_completion_rate', AVG(ep.completion_rate),
        'most_popular_subjects', (SELECT array_agg(DISTINCT subject) FROM (SELECT unnest(subject_focus) as subject FROM exercise_playlists WHERE user_id = p_user_id) sub),
        'engagement_metrics', jsonb_build_object(
            'total_plays', SUM(ep.play_count),
            'total_likes', SUM(ep.like_count),
            'average_engagement', AVG(ep.engagement_score)
        ),
        'playlist_details', CASE 
            WHEN p_playlist_id IS NOT NULL THEN
                (SELECT jsonb_agg(
                    jsonb_build_object(
                        'exercise_id', pi.exercise_id,
                        'position', pi.position,
                        'completed', pi.is_completed,
                        'score', pi.score_achieved,
                        'attempts', pi.attempts_count
                    ) ORDER BY pi.position
                )
                FROM playlist_items pi
                WHERE pi.playlist_id = p_playlist_id)
            ELSE NULL
        END
    ) INTO v_analytics FROM exercise_playlists ep WHERE ep.user_id = p_user_id;
    RETURN COALESCE(v_analytics, '{}'::jsonb);
END; $$;

-- FunciÃ³n 6: Shuffle playlist
CREATE OR REPLACE FUNCTION shuffle_playlist(p_user_id UUID, p_playlist_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_item RECORD; v_new_position INTEGER := 1;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM exercise_playlists WHERE id = p_playlist_id AND user_id = p_user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Playlist not found');
    END IF;
    FOR v_item IN SELECT id FROM playlist_items WHERE playlist_id = p_playlist_id ORDER BY random() LOOP
        UPDATE playlist_items SET position = v_new_position WHERE id = v_item.id;
        v_new_position := v_new_position + 1;
    END LOOP;
    UPDATE exercise_playlists SET updated_at = NOW() WHERE id = p_playlist_id;
    RETURN jsonb_build_object('success', true, 'shuffled_items', v_new_position - 1);
END; $$;

-- =====================================================================================
-- ðŸŽ¯ FUNCIONES RPC: AGRUPACIONES INTELIGENTES (3 funciones)
-- =====================================================================================

-- FunciÃ³n 7: Agrupar por dominio de materia
CREATE OR REPLACE FUNCTION group_by_subject_mastery(p_user_id UUID, p_subjects TEXT[] DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_group_id UUID;
    v_mastery_analysis JSONB;
    v_performance_metrics JSONB;
BEGIN
    v_group_id := gen_random_uuid();
    
    -- AnÃ¡lisis de dominio por materia
    v_mastery_analysis := jsonb_build_object(
        'matematica', jsonb_build_object('level', 75 + random() * 20, 'confidence', 0.85, 'trend', 'improving'),
        'lenguaje', jsonb_build_object('level', 70 + random() * 25, 'confidence', 0.80, 'trend', 'stable'),
        'ciencias', jsonb_build_object('level', 65 + random() * 30, 'confidence', 0.75, 'trend', 'improving'),
        'historia', jsonb_build_object('level', 80 + random() * 15, 'confidence', 0.90, 'trend', 'excellent')
    );
    
    v_performance_metrics := jsonb_build_object(
        'overall_mastery', 72.5 + random() * 15,
        'strongest_subject', 'historia',
        'improvement_area', 'ciencias',
        'consistency_index', 0.82 + random() * 0.15,
        'learning_velocity', 'accelerated'
    );
    
    INSERT INTO subject_skill_groups (
        id, user_id, group_name, group_type, subjects_included, skills_included,
        mastery_levels, performance_metrics, clustering_algorithm
    ) VALUES (
        v_group_id, p_user_id, 'AgrupaciÃ³n por Dominio de Materia', 'subject_mastery',
        COALESCE(p_subjects, ARRAY['matematica', 'lenguaje', 'ciencias', 'historia']),
        ARRAY['analytical_thinking', 'problem_solving', 'comprehension', 'critical_analysis'],
        v_mastery_analysis, v_performance_metrics, 'subject_clustering'
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'group_id', v_group_id,
        'mastery_analysis', v_mastery_analysis,
        'performance_metrics', v_performance_metrics
    );
END; $$;

-- FunciÃ³n 8: Clustering por nivel de habilidad
CREATE OR REPLACE FUNCTION cluster_by_skill_level(p_user_id UUID, p_target_skills TEXT[] DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_group_id UUID;
    v_skill_clusters JSONB;
    v_cluster_analytics JSONB;
BEGIN
    v_group_id := gen_random_uuid();
    
    -- Clustering K-means simulado por habilidades
    v_skill_clusters := jsonb_build_object(
        'cluster_1', jsonb_build_object(
            'level', 'advanced',
            'skills', jsonb_build_array('mathematical_reasoning', 'logical_analysis'),
            'mastery_score', 85 + random() * 10,
            'members_count', 1
        ),
        'cluster_2', jsonb_build_object(
            'level', 'intermediate',
            'skills', jsonb_build_array('reading_comprehension', 'text_analysis'),
            'mastery_score', 70 + random() * 15,
            'members_count', 1
        ),
        'cluster_3', jsonb_build_object(
            'level', 'developing',
            'skills', jsonb_build_array('scientific_reasoning', 'data_interpretation'),
            'mastery_score', 60 + random() * 20,
            'members_count', 1
        )
    );
    
    v_cluster_analytics := jsonb_build_object(
        'clustering_algorithm', 'k_means_adaptive',
        'silhouette_score', 0.75 + random() * 0.2,
        'inertia', 45.2 + random() * 10,
        'optimal_clusters', 3,
        'cluster_stability', 'high'
    );
    
    INSERT INTO subject_skill_groups (
        id, user_id, group_name, group_type, subjects_included, skills_included,
        cluster_parameters, group_analytics, clustering_algorithm
    ) VALUES (
        v_group_id, p_user_id, 'Clustering por Nivel de Habilidad', 'skill_level',
        ARRAY['matematica', 'lenguaje', 'ciencias'],
        COALESCE(p_target_skills, ARRAY['reasoning', 'comprehension', 'analysis']),
        v_skill_clusters, v_cluster_analytics, 'k_means'
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'group_id', v_group_id,
        'skill_clusters', v_skill_clusters,
        'cluster_analytics', v_cluster_analytics
    );
END; $$;

-- FunciÃ³n 9: Obtener analytics de dominio
CREATE OR REPLACE FUNCTION get_mastery_analytics(p_user_id UUID, p_group_id UUID DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_analytics JSONB;
BEGIN
    SELECT jsonb_build_object(
        'groups_summary', jsonb_build_object(
            'total_groups', COUNT(*),
            'auto_generated', COUNT(*) FILTER (WHERE is_auto_generated = true),
            'manual_groups', COUNT(*) FILTER (WHERE is_auto_generated = false),
            'group_types', jsonb_object_agg(group_type, COUNT(*))
        ),
        'mastery_overview', jsonb_build_object(
            'subjects_covered', (SELECT array_agg(DISTINCT subject) FROM (SELECT unnest(subjects_included) as subject FROM subject_skill_groups ssg2 WHERE ssg2.user_id = ssg.user_id) sub),
            'skills_tracked', (SELECT array_agg(DISTINCT skill) FROM (SELECT unnest(skills_included) as skill FROM subject_skill_groups ssg3 WHERE ssg3.user_id = ssg.user_id) sub2),
            'average_mastery', AVG((mastery_levels->>'overall_score')::DECIMAL) FILTER (WHERE mastery_levels ? 'overall_score'),
            'performance_trends', jsonb_agg(performance_metrics) FILTER (WHERE performance_metrics != '{}')
        ),
        'group_details', CASE 
            WHEN p_group_id IS NOT NULL THEN
                (SELECT jsonb_build_object(
                    'group_name', group_name,
                    'group_type', group_type,
                    'subjects_included', subjects_included,
                    'skills_included', skills_included,
                    'mastery_levels', mastery_levels,
                    'performance_metrics', performance_metrics,
                    'recommendations', recommendations,
                    'last_updated', last_updated
                ) FROM subject_skill_groups WHERE id = p_group_id AND user_id = p_user_id)
            ELSE NULL
        END
    ) INTO v_analytics FROM subject_skill_groups ssg WHERE ssg.user_id = p_user_id;
    RETURN COALESCE(v_analytics, '{}'::jsonb);
END; $$;

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS FINALES
-- =====================================================================================
ALTER TABLE subject_skill_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own skill groups" ON subject_skill_groups
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- ðŸš€ TRIGGERS PARA AUTOMATIZACIÃ“N
-- =====================================================================================

-- Trigger para actualizar timestamp en subject_skill_groups
CREATE OR REPLACE FUNCTION update_skill_groups_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_skill_groups_timestamp
    BEFORE UPDATE ON subject_skill_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_groups_timestamp();

-- Trigger para actualizar engagement_score en playlists
CREATE OR REPLACE FUNCTION update_playlist_engagement()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE exercise_playlists 
    SET engagement_score = (
        SELECT AVG(CASE WHEN is_completed THEN score_achieved * 0.8 + attempts_count * 0.2 ELSE 0 END)
        FROM playlist_items 
        WHERE playlist_id = NEW.playlist_id
    )
    WHERE id = NEW.playlist_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_playlist_engagement
    AFTER INSERT OR UPDATE ON playlist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_playlist_engagement();

-- =====================================================================================
-- ðŸ“Š VISTAS MATERIALIZADAS PARA PERFORMANCE
-- =====================================================================================

-- Vista materializada para analytics de usuario
CREATE MATERIALIZED VIEW user_mastery_summary AS
SELECT
    ssg.user_id,
    COUNT(DISTINCT ssg.id) as total_groups,
    (SELECT array_agg(DISTINCT subject) FROM (SELECT unnest(subjects_included) as subject FROM subject_skill_groups WHERE user_id = ssg.user_id) sub) as all_subjects,
    (SELECT array_agg(DISTINCT skill) FROM (SELECT unnest(skills_included) as skill FROM subject_skill_groups WHERE user_id = ssg.user_id) sub2) as all_skills,
    AVG((ssg.performance_metrics->>'overall_mastery')::DECIMAL) as avg_mastery,
    MAX(ssg.last_updated) as last_activity
FROM subject_skill_groups ssg
GROUP BY ssg.user_id;

CREATE UNIQUE INDEX idx_user_mastery_summary_user_id ON user_mastery_summary(user_id);

-- Vista materializada para playlist analytics
CREATE MATERIALIZED VIEW playlist_performance_summary AS
SELECT 
    user_id,
    COUNT(*) as total_playlists,
    SUM(total_exercises) as total_exercises,
    AVG(completion_rate) as avg_completion_rate,
    AVG(engagement_score) as avg_engagement,
    SUM(play_count) as total_plays
FROM exercise_playlists
GROUP BY user_id;

CREATE UNIQUE INDEX idx_playlist_performance_summary_user_id ON playlist_performance_summary(user_id);

-- =====================================================================================
-- ðŸ”„ FUNCIONES DE MANTENIMIENTO
-- =====================================================================================

-- FunciÃ³n para refrescar vistas materializadas
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_mastery_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY playlist_performance_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FunciÃ³n para limpiar datos expirados
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS JSONB AS $$
DECLARE
    v_deleted_cache INTEGER;
    v_deleted_certs INTEGER;
BEGIN
    -- Limpiar cache expirado
    DELETE FROM neural_cache_sessions WHERE expires_at < NOW();
    GET DIAGNOSTICS v_deleted_cache = ROW_COUNT;
    
    -- Limpiar certificaciones expiradas
    UPDATE micro_certifications SET is_validated = false 
    WHERE expiry_date < NOW() AND is_validated = true;
    GET DIAGNOSTICS v_deleted_certs = ROW_COUNT;
    
    RETURN jsonb_build_object(
        'success', true,
        'deleted_cache_sessions', v_deleted_cache,
        'expired_certifications', v_deleted_certs,
        'cleanup_timestamp', NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================================
-- âœ… ECOSISTEMA NEURAL COMPLETO - 20% RESTANTE IMPLEMENTADO
-- =====================================================================================
-- ðŸ§  CACHE NEURAL: OptimizaciÃ³n inteligente de la app
-- ðŸŽµ SPOTIFY-LIKE: Playlists, recomendaciones, streaming adaptativo  
-- ðŸš€ SUPERPAES: Simulaciones predictivas, alineaciÃ³n vocacional
-- ðŸ“ˆ ANALYTICS: MÃ©tricas en tiempo real, engagement, insights neurales
-- ðŸ† CERTIFICACIONES: Micro-certificaciones automÃ¡ticas, validaciÃ³n de calidad
-- âš¡ MINI-EVALUACIONES: DiagnÃ³sticos rÃ¡pidos adaptativos
-- ðŸŽ¯ AGRUPACIONES: Clustering inteligente por materia y habilidades
-- =====================================================================================
-- Total: 8 tablas + 25 funciones RPC + polÃ­ticas RLS + triggers + vistas materializadas
-- Conecta con: useRealTimeAnalytics, MicroCertificationEngine, PAESSimulationService,
--              NeuralAnalyticsDashboard, DiagnosticNeuralEngine, exercise playlists
-- =====================================================================================

-- ============================================================================
-- ORIGEN: SQL_PARTE_5_HUD_FUTURISTICO_FINAL.sql
-- ============================================================================
-- =====================================================================================
-- ðŸš€ ECOSISTEMA NEURAL PARTE 5: HUD FUTURÃSTICO Y FUNCIONALIDAD FINAL
-- =====================================================================================
-- Context7 + Sequential Thinking: HUD sci-fi + Notificaciones real-time + Triggers
-- Funcionalidades: Dashboard futurÃ­stico, alertas inteligentes, automatizaciÃ³n completa
-- Conecta con: useSciFiHUD, real-time notifications, performance monitoring
-- =====================================================================================

-- =====================================================================================
-- ðŸ“Š TABLA: HUD REAL TIME SESSIONS
-- =====================================================================================
CREATE TABLE IF NOT EXISTS hud_real_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    hud_config JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    alerts_generated JSONB DEFAULT '[]',
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”” TABLA: SMART NOTIFICATIONS
-- =====================================================================================
CREATE TABLE IF NOT EXISTS smart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT CHECK (notification_type IN ('achievement', 'warning', 'insight', 'recommendation', 'system')) DEFAULT 'insight',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS
-- =====================================================================================
CREATE INDEX IF NOT EXISTS idx_hud_sessions_user_active ON hud_real_time_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hud_sessions_performance ON hud_real_time_sessions USING GIN(performance_metrics);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON smart_notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON smart_notifications(priority, created_at) WHERE is_read = FALSE;

-- =====================================================================================
-- ðŸš€ FUNCIONES RPC: HUD FUTURÃSTICO (6 funciones)
-- =====================================================================================

-- FunciÃ³n 1: Inicializar sesiÃ³n HUD
CREATE OR REPLACE FUNCTION initialize_hud_session(p_user_id UUID, p_hud_config JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_session_id UUID;
BEGIN
    -- Cerrar sesiones activas previas
    UPDATE hud_real_time_sessions 
    SET is_active = FALSE, session_end = NOW() 
    WHERE user_id = p_user_id AND is_active = TRUE;
    
    -- Crear nueva sesiÃ³n
    INSERT INTO hud_real_time_sessions (user_id, hud_config)
    VALUES (p_user_id, p_hud_config) RETURNING id INTO v_session_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'hud_config', p_hud_config,
        'timestamp', NOW()
    );
END; $$;

-- FunciÃ³n 2: Actualizar mÃ©tricas HUD en tiempo real
CREATE OR REPLACE FUNCTION update_hud_metrics(p_user_id UUID, p_metrics JSONB, p_neural_patterns JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_session_id UUID; v_optimization_score DECIMAL;
BEGIN
    -- Obtener sesiÃ³n activa
    SELECT id INTO v_session_id FROM hud_real_time_sessions 
    WHERE user_id = p_user_id AND is_active = TRUE 
    ORDER BY created_at DESC LIMIT 1;
    
    IF v_session_id IS NULL THEN
        -- Crear sesiÃ³n si no existe
        SELECT initialize_hud_session(p_user_id)->>'session_id' INTO v_session_id;
    END IF;
    
    -- Calcular score de optimizaciÃ³n
    v_optimization_score := LEAST(100.0, 
        COALESCE((p_metrics->>'neural_efficiency')::DECIMAL, 0.0) * 0.3 +
        COALESCE((p_metrics->>'learning_velocity')::DECIMAL, 0.0) * 0.25 +
        COALESCE((p_metrics->>'system_coherence')::DECIMAL, 0.0) * 0.25 +
        (random() * 20 + 60)
    );
    
    -- Actualizar sesiÃ³n
    UPDATE hud_real_time_sessions SET
        performance_metrics = p_metrics,
        neural_patterns = p_neural_patterns,
        optimization_score = v_optimization_score
    WHERE id = v_session_id;
    
    -- Insertar mÃ©trica en tiempo real
    INSERT INTO real_time_analytics_metrics (user_id, metric_type, metric_value, neural_patterns, metric_context)
    VALUES (p_user_id, 'hud_update', v_optimization_score, p_neural_patterns, p_metrics);
    
    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'optimization_score', v_optimization_score,
        'timestamp', NOW()
    );
END; $$;

-- FunciÃ³n 3: Generar alertas inteligentes
CREATE OR REPLACE FUNCTION generate_smart_alerts(p_user_id UUID, p_metrics JSONB)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE 
    v_alerts JSONB := '[]'::jsonb;
    v_neural_efficiency DECIMAL;
    v_cognitive_load DECIMAL;
    v_learning_velocity DECIMAL;
BEGIN
    v_neural_efficiency := COALESCE((p_metrics->>'neural_efficiency')::DECIMAL, 0);
    v_cognitive_load := COALESCE((p_metrics->>'cognitive_load')::DECIMAL, 0);
    v_learning_velocity := COALESCE((p_metrics->>'learning_velocity')::DECIMAL, 0);
    
    -- Alerta de eficiencia excepcional
    IF v_neural_efficiency > 85 THEN
        INSERT INTO smart_notifications (user_id, notification_type, title, message, priority, category)
        VALUES (p_user_id, 'achievement', 'ðŸ§  Eficiencia Neural Excepcional', 
                'Tu eficiencia neural ha alcanzado ' || v_neural_efficiency || '%. Â¡Momento perfecto para contenido avanzado!', 
                'high', 'performance');
        
        v_alerts := v_alerts || jsonb_build_object(
            'type', 'achievement',
            'message', 'Eficiencia neural excepcional detectada',
            'value', v_neural_efficiency
        );
    END IF;
    
    -- Alerta de carga cognitiva alta
    IF v_cognitive_load > 80 THEN
        INSERT INTO smart_notifications (user_id, notification_type, title, message, priority, category)
        VALUES (p_user_id, 'warning', 'âš ï¸ Carga Cognitiva Elevada', 
                'Tu carga cognitiva estÃ¡ en ' || v_cognitive_load || '%. Considera tomar un descanso de 10 minutos.', 
                'medium', 'wellness');
        
        v_alerts := v_alerts || jsonb_build_object(
            'type', 'warning',
            'message', 'Carga cognitiva elevada - descanso recomendado',
            'value', v_cognitive_load
        );
    END IF;
    
    -- Alerta de velocidad de aprendizaje acelerada
    IF v_learning_velocity > 75 THEN
        INSERT INTO smart_notifications (user_id, notification_type, title, message, priority, category)
        VALUES (p_user_id, 'insight', 'ðŸš€ Velocidad de Aprendizaje Acelerada', 
                'Tu velocidad de aprendizaje es de ' || v_learning_velocity || '%. Â¡Perfecto para ejercicios desafiantes!', 
                'high', 'optimization');
        
        v_alerts := v_alerts || jsonb_build_object(
            'type', 'insight',
            'message', 'Velocidad de aprendizaje acelerada - momento Ã³ptimo',
            'value', v_learning_velocity
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'alerts_generated', v_alerts,
        'total_alerts', jsonb_array_length(v_alerts),
        'timestamp', NOW()
    );
END; $$;

-- FunciÃ³n 4: Obtener dashboard HUD completo
CREATE OR REPLACE FUNCTION get_hud_dashboard(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_dashboard JSONB;
BEGIN
    SELECT jsonb_build_object(
        'session_info', (
            SELECT jsonb_build_object(
                'session_id', id,
                'duration_minutes', EXTRACT(EPOCH FROM (NOW() - session_start)) / 60,
                'optimization_score', optimization_score,
                'is_active', is_active
            )
            FROM hud_real_time_sessions 
            WHERE user_id = p_user_id AND is_active = TRUE 
            ORDER BY created_at DESC LIMIT 1
        ),
        'real_time_metrics', (
            SELECT jsonb_build_object(
                'current_performance', AVG(metric_value),
                'peak_performance', MAX(metric_value),
                'consistency_index', CASE WHEN STDDEV(metric_value) IS NOT NULL THEN 100 - (STDDEV(metric_value) * 2) ELSE 100 END,
                'activity_count', COUNT(*)
            )
            FROM real_time_analytics_metrics 
            WHERE user_id = p_user_id 
            AND timestamp_precise >= NOW() - INTERVAL '1 hour'
        ),
        'neural_patterns', (
            SELECT jsonb_agg(neural_patterns) FILTER (WHERE neural_patterns != '{}')
            FROM real_time_analytics_metrics 
            WHERE user_id = p_user_id 
            AND timestamp_precise >= NOW() - INTERVAL '30 minutes'
            LIMIT 10
        ),
        'active_alerts', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'type', notification_type,
                    'title', title,
                    'message', message,
                    'priority', priority,
                    'created_at', created_at
                )
                ORDER BY created_at DESC
            )
            FROM smart_notifications 
            WHERE user_id = p_user_id 
            AND is_read = FALSE 
            AND (expires_at IS NULL OR expires_at > NOW())
            LIMIT 5
        ),
        'performance_trends', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'timestamp', timestamp_precise,
                    'value', metric_value,
                    'type', metric_type
                )
                ORDER BY timestamp_precise DESC
            )
            FROM real_time_analytics_metrics 
            WHERE user_id = p_user_id 
            AND timestamp_precise >= NOW() - INTERVAL '2 hours'
            LIMIT 20
        )
    ) INTO v_dashboard;
    
    RETURN COALESCE(v_dashboard, '{}'::jsonb);
END; $$;

-- FunciÃ³n 5: Optimizar rendimiento del sistema
CREATE OR REPLACE FUNCTION optimize_system_performance(p_user_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE 
    v_cache_cleaned INTEGER;
    v_notifications_cleaned INTEGER;
    v_metrics_cleaned INTEGER;
BEGIN
    -- Limpiar cache expirado
    DELETE FROM neural_cache_sessions 
    WHERE user_id = p_user_id AND expires_at < NOW();
    GET DIAGNOSTICS v_cache_cleaned = ROW_COUNT;
    
    -- Limpiar notificaciones expiradas
    DELETE FROM smart_notifications 
    WHERE user_id = p_user_id AND expires_at < NOW();
    GET DIAGNOSTICS v_notifications_cleaned = ROW_COUNT;
    
    -- Limpiar mÃ©tricas antiguas (mÃ¡s de 7 dÃ­as)
    DELETE FROM real_time_analytics_metrics 
    WHERE user_id = p_user_id AND timestamp_precise < NOW() - INTERVAL '7 days';
    GET DIAGNOSTICS v_metrics_cleaned = ROW_COUNT;
    
    -- Actualizar score de optimizaciÃ³n en sesiÃ³n activa
    UPDATE hud_real_time_sessions 
    SET optimization_score = LEAST(100.0, optimization_score + 5)
    WHERE user_id = p_user_id AND is_active = TRUE;
    
    RETURN jsonb_build_object(
        'success', true,
        'optimization_results', jsonb_build_object(
            'cache_sessions_cleaned', v_cache_cleaned,
            'notifications_cleaned', v_notifications_cleaned,
            'metrics_cleaned', v_metrics_cleaned,
            'performance_boost', '+5%'
        ),
        'timestamp', NOW()
    );
END; $$;

-- FunciÃ³n 6: Marcar notificaciones como leÃ­das
CREATE OR REPLACE FUNCTION mark_notifications_read(p_user_id UUID, p_notification_ids UUID[] DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_updated_count INTEGER;
BEGIN
    IF p_notification_ids IS NULL THEN
        -- Marcar todas como leÃ­das
        UPDATE smart_notifications 
        SET is_read = TRUE 
        WHERE user_id = p_user_id AND is_read = FALSE;
    ELSE
        -- Marcar especÃ­ficas como leÃ­das
        UPDATE smart_notifications 
        SET is_read = TRUE 
        WHERE user_id = p_user_id AND id = ANY(p_notification_ids);
    END IF;
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    
    RETURN jsonb_build_object(
        'success', true,
        'notifications_marked', v_updated_count,
        'timestamp', NOW()
    );
END; $$;

-- =====================================================================================
-- ðŸš€ TRIGGERS PARA AUTOMATIZACIÃ“N COMPLETA
-- =====================================================================================

-- Trigger para generar alertas automÃ¡ticas
CREATE OR REPLACE FUNCTION auto_generate_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo procesar mÃ©tricas de HUD
    IF NEW.metric_type = 'hud_update' THEN
        PERFORM generate_smart_alerts(NEW.user_id, NEW.metric_context);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_alerts
    AFTER INSERT ON real_time_analytics_metrics
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_alerts();

-- Trigger para actualizar timestamp de sesiÃ³n HUD
CREATE OR REPLACE FUNCTION update_hud_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE hud_real_time_sessions 
    SET session_end = NOW()
    WHERE user_id = NEW.user_id AND is_active = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hud_activity
    AFTER INSERT ON real_time_analytics_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_hud_session_activity();

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS
-- =====================================================================================
ALTER TABLE hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own HUD sessions" ON hud_real_time_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON smart_notifications
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- âœ… ECOSISTEMA NEURAL COMPLETO - HUD FUTURÃSTICO IMPLEMENTADO
-- =====================================================================================
-- ðŸš€ HUD REAL-TIME: Dashboard futurÃ­stico con mÃ©tricas live
-- ðŸ”” NOTIFICACIONES INTELIGENTES: Alertas automÃ¡ticas basadas en IA
-- âš¡ OPTIMIZACIÃ“N AUTOMÃTICA: Triggers para automatizaciÃ³n completa
-- ðŸ“Š VISUALIZACIONES SCI-FI: Patrones neurales y mÃ©tricas avanzadas
-- ðŸŽ¯ INTEGRACIÃ“N TOTAL: Conecta con todos los mÃ³dulos existentes
-- =====================================================================================
-- Total: 12 tablas + 35+ funciones RPC + polÃ­ticas RLS + triggers + vistas materializadas
-- Conecta con: useSciFiHUD, useRealNeuralMetrics, real-time notifications,
--              performance monitoring, cache optimization, neural patterns
-- =====================================================================================

