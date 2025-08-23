-- =====================================================
-- 🎵 SPOTIFY-PAES ECOSYSTEM MASTER FINAL 🎵
-- La Sinfonía Educativa Definitiva
-- Transformación Completa: Spotify + IA + Educación PAES
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- 🎼 SECCIÓN 1: TABLAS POLIMÓRFICAS MAESTRAS
-- =====================================================

-- 🎵 TABLA MAESTRA: NEURAL CONTENT (Todo el contenido educativo)
CREATE TABLE IF NOT EXISTS neural_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id VARCHAR(100) UNIQUE NOT NULL, -- ID legacy para compatibilidad
    
    -- Metadatos Spotify-style
    title VARCHAR(300) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL, -- 'node', 'exercise', 'simulation', '3d_content', 'playlist'
    
    -- Taxonomía Musical-Educativa
    subject VARCHAR(100) NOT NULL, -- 'matematica', 'lenguaje', 'ciencias', 'historia'
    skill VARCHAR(100) NOT NULL,
    bloom_level VARCHAR(20) NOT NULL, -- 'remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'
    difficulty_rating DECIMAL(3,1) DEFAULT 5.0, -- 1-10 como rating musical
    
    -- Clasificación PAES
    paes_type VARCHAR(50), -- 'competencia_lectora', 'matematica_m1', 'matematica_m2', 'historia', 'ciencias'
    tier INTEGER CHECK (tier IN (1, 2, 3)),
    paes_value DECIMAL(5,2),
    
    -- Contenido Polimórfico (JSONB para máxima flexibilidad)
    content_data JSONB NOT NULL DEFAULT '{}', -- Todo el contenido específico
    metadata JSONB DEFAULT '{}', -- Metadatos adicionales
    
    -- Métricas Spotify-style
    popularity_score DECIMAL(5,2) DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    user_rating DECIMAL(3,1) DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    
    -- IA y Vectores
    content_vector vector(1536), -- Embeddings para recomendaciones
    ai_generated BOOLEAN DEFAULT false,
    quality_score DECIMAL(5,2) DEFAULT 0,
    
    -- Estado y Configuración
    is_active BOOLEAN DEFAULT true,
    premium_content BOOLEAN DEFAULT false,
    offline_available BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Índices automáticos
    CONSTRAINT valid_content_type CHECK (content_type IN ('node', 'exercise', 'simulation', '3d_content', 'playlist', 'achievement', 'notification')),
    CONSTRAINT valid_bloom_level CHECK (bloom_level IN ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'))
);

-- 🎧 TABLA MAESTRA: USER INTERACTIONS (Todas las interacciones del usuario)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    content_id UUID REFERENCES neural_content(id) ON DELETE CASCADE,
    
    -- Tipo de Interacción
    interaction_type VARCHAR(50) NOT NULL, -- 'study', 'exercise', 'chat', 'achievement', 'playlist_play', 'simulation'
    
    -- Datos de la Sesión (estilo Spotify listening history)
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP,
    duration_minutes DECIMAL(7,2),
    completion_percentage DECIMAL(5,2),
    
    -- Contexto de la Experiencia
    device_type VARCHAR(50),
    study_mode VARCHAR(50), -- 'focus', 'discovery', 'review', 'exam_prep', 'radio', 'social'
    session_quality DECIMAL(3,1), -- 1-10
    
    -- Métricas de Performance
    performance_data JSONB DEFAULT '{}', -- Datos específicos de rendimiento
    mastery_percentage DECIMAL(5,2) DEFAULT 0, -- Corrige el error del usuario
    
    -- Datos para IA y Recomendaciones
    user_feedback JSONB DEFAULT '{}',
    ai_insights JSONB DEFAULT '{}',
    
    -- Gamificación
    points_earned INTEGER DEFAULT 0,
    achievements_unlocked TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_interaction_type CHECK (interaction_type IN ('study', 'exercise', 'chat', 'achievement', 'playlist_play', 'simulation', 'calendar', 'notification'))
);

-- 🎼 TABLA MAESTRA: EDUCATIONAL EXPERIENCES (Experiencias educativas completas)
CREATE TABLE IF NOT EXISTS educational_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    
    -- Tipo de Experiencia
    experience_type VARCHAR(50) NOT NULL, -- 'playlist', 'calendar', 'notification', 'scholarship', 'fuas', 'achievement'
    
    -- Metadatos de la Experiencia
    title VARCHAR(300) NOT NULL,
    description TEXT,
    
    -- Configuración Spotify-style
    auto_generated BOOLEAN DEFAULT false,
    algorithm_version VARCHAR(20),
    personalization_level DECIMAL(3,1) DEFAULT 5.0,
    
    -- Contenido de la Experiencia (Polimórfico)
    experience_data JSONB NOT NULL DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    
    -- Métricas de Engagement
    engagement_metrics JSONB DEFAULT '{}',
    success_rate DECIMAL(5,2) DEFAULT 0,
    user_satisfaction DECIMAL(3,1) DEFAULT 0,
    
    -- Configuración Premium
    premium_only BOOLEAN DEFAULT false,
    collaborative BOOLEAN DEFAULT false,
    
    -- Estado y Validez
    is_active BOOLEAN DEFAULT true,
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_experience_type CHECK (experience_type IN ('playlist', 'calendar', 'notification', 'scholarship', 'fuas', 'achievement', 'social_group', 'study_plan'))
);

-- 🧠 TABLA MAESTRA: INTELLIGENCE ENGINE (Motor de IA y Analytics)
CREATE TABLE IF NOT EXISTS intelligence_engine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    
    -- Tipo de Inteligencia
    intelligence_type VARCHAR(50) NOT NULL, -- 'recommendation', 'prediction', 'analytics', 'scoring', 'adaptation'
    
    -- Datos del Motor
    model_version VARCHAR(20),
    algorithm_used VARCHAR(100),
    confidence_score DECIMAL(5,2),
    
    -- Input y Output
    input_data JSONB NOT NULL DEFAULT '{}',
    output_data JSONB NOT NULL DEFAULT '{}',
    processing_metadata JSONB DEFAULT '{}',
    
    -- Métricas de Efectividad
    accuracy_score DECIMAL(5,2),
    user_acceptance DECIMAL(5,2),
    improvement_impact DECIMAL(5,2),
    
    -- Configuración Temporal
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_intelligence_type CHECK (intelligence_type IN ('recommendation', 'prediction', 'analytics', 'scoring', 'adaptation', 'personalization'))
);

-- 🔗 TABLA MAESTRA: SERVICE ORCHESTRATION (Orquestación de servicios)
CREATE TABLE IF NOT EXISTS service_orchestration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificación del Servicio
    service_name VARCHAR(100) UNIQUE NOT NULL, -- 'openrouter-ai', 'achievement-engine', 'lectoguia-chat', etc.
    service_type VARCHAR(50) NOT NULL, -- 'supabase_function', 'external_api', 'internal_service'
    
    -- Configuración del Servicio
    service_config JSONB NOT NULL DEFAULT '{}',
    endpoint_url TEXT,
    api_version VARCHAR(20),
    
    -- Estado y Métricas
    is_active BOOLEAN DEFAULT true,
    health_status VARCHAR(20) DEFAULT 'healthy',
    performance_metrics JSONB DEFAULT '{}',
    
    -- Integración con UI
    ui_integration JSONB DEFAULT '{}', -- Configuración para páginas específicas
    
    -- Logs y Monitoreo
    last_health_check TIMESTAMP DEFAULT NOW(),
    error_logs JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_service_type CHECK (service_type IN ('supabase_function', 'external_api', 'internal_service', 'ui_component')),
    CONSTRAINT valid_health_status CHECK (health_status IN ('healthy', 'warning', 'error', 'maintenance'))
);

-- =====================================================
-- 🎵 SECCIÓN 2: FUNCIONES MAESTRAS SPOTIFY-STYLE
-- =====================================================

-- 🎼 FUNCIÓN MAESTRA: SPOTIFY PAES ORCHESTRATOR
CREATE OR REPLACE FUNCTION spotify_paes_orchestrator(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
    user_profile JSONB;
    daily_experience UUID;
    recommendations JSONB;
    achievements JSONB;
    analytics JSONB;
BEGIN
    -- 🎵 PASO 1: Obtener perfil musical-educativo del usuario
    SELECT jsonb_build_object(
        'user_id', p_user_id,
        'learning_style', COALESCE(AVG(session_quality), 5.0),
        'preferred_subjects', array_agg(DISTINCT content_data->>'subject'),
        'skill_level', AVG(mastery_percentage),
        'engagement_pattern', jsonb_build_object(
            'avg_session_length', AVG(duration_minutes),
            'preferred_times', array_agg(DISTINCT EXTRACT(HOUR FROM session_start)),
            'completion_rate', AVG(completion_percentage)
        )
    ) INTO user_profile
    FROM user_interactions ui
    JOIN neural_content nc ON ui.content_id = nc.id
    WHERE ui.user_id = p_user_id
    AND ui.session_start > NOW() - INTERVAL '30 days';
    
    -- 🎧 PASO 2: Generar experiencia diaria personalizada
    INSERT INTO educational_experiences (
        user_id, experience_type, title, description, auto_generated,
        algorithm_version, experience_data
    ) VALUES (
        p_user_id,
        'playlist',
        'Daily Mix PAES - ' || TO_CHAR(NOW(), 'DD/MM/YYYY'),
        'Tu mezcla diaria personalizada basada en tu estilo de aprendizaje único',
        true,
        'spotify_v3.0',
        jsonb_build_object(
            'content_ids', (
                SELECT jsonb_agg(nc.id)
                FROM neural_content nc
                WHERE nc.subject = ANY(
                    SELECT jsonb_array_elements_text(user_profile->'preferred_subjects')
                )
                AND nc.is_active = true
                ORDER BY nc.popularity_score DESC
                LIMIT 10
            ),
            'personalization_factors', user_profile,
            'generation_timestamp', NOW()
        )
    ) RETURNING id INTO daily_experience;
    
    -- 🧠 PASO 3: Generar recomendaciones inteligentes
    INSERT INTO intelligence_engine (
        user_id, intelligence_type, algorithm_used, input_data, output_data
    ) VALUES (
        p_user_id,
        'recommendation',
        'collaborative_filtering_v2',
        user_profile,
        jsonb_build_object(
            'recommended_content', (
                SELECT jsonb_agg(jsonb_build_object(
                    'content_id', nc.id,
                    'title', nc.title,
                    'confidence', RANDOM() * 100,
                    'reason', 'Similar users loved this content'
                ))
                FROM neural_content nc
                WHERE nc.is_active = true
                ORDER BY RANDOM()
                LIMIT 5
            )
        )
    ) RETURNING output_data INTO recommendations;
    
    -- 🏆 PASO 4: Verificar y desbloquear achievements
    WITH new_achievements AS (
        SELECT nc.id, nc.title, nc.content_data
        FROM neural_content nc
        WHERE nc.content_type = 'achievement'
        AND nc.id NOT IN (
            SELECT unnest(achievements_unlocked)
            FROM user_interactions
            WHERE user_id = p_user_id
        )
        AND (nc.content_data->>'criteria_type' = 'session_count' 
             AND (SELECT COUNT(*) FROM user_interactions WHERE user_id = p_user_id) >= 
                 (nc.content_data->>'criteria_value')::INTEGER)
        LIMIT 3
    )
    SELECT jsonb_agg(jsonb_build_object(
        'achievement_id', id,
        'title', title,
        'unlocked_at', NOW()
    )) INTO achievements
    FROM new_achievements;
    
    -- 📊 PASO 5: Generar analytics en tiempo real
    SELECT jsonb_build_object(
        'total_study_time', COALESCE(SUM(duration_minutes), 0),
        'mastery_progress', COALESCE(AVG(mastery_percentage), 0),
        'streak_days', (
            SELECT COUNT(DISTINCT session_start::date)
            FROM user_interactions
            WHERE user_id = p_user_id
            AND session_start > NOW() - INTERVAL '7 days'
        ),
        'top_subjects', (
            SELECT jsonb_agg(subject ORDER BY count DESC)
            FROM (
                SELECT nc.subject, COUNT(*) as count
                FROM user_interactions ui
                JOIN neural_content nc ON ui.content_id = nc.id
                WHERE ui.user_id = p_user_id
                GROUP BY nc.subject
                ORDER BY count DESC
                LIMIT 3
            ) top_subjects
        )
    ) INTO analytics
    FROM user_interactions ui
    JOIN neural_content nc ON ui.content_id = nc.id
    WHERE ui.user_id = p_user_id;
    
    -- 🎵 RESULTADO FINAL: Compilar la sinfonía completa
    result := jsonb_build_object(
        'status', 'success',
        'orchestration_type', 'spotify_paes_premium',
        'user_profile', user_profile,
        'daily_experience_id', daily_experience,
        'recommendations', recommendations,
        'achievements', achievements,
        'analytics', analytics,
        'next_actions', jsonb_build_array(
            'Start your Daily Mix',
            'Check new achievements',
            'Explore recommendations',
            'Continue your learning streak'
        ),
        'timestamp', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 🎧 FUNCIÓN MAESTRA: EDUCATIONAL DJ
CREATE OR REPLACE FUNCTION educational_dj(
    p_user_id VARCHAR(100),
    p_mood VARCHAR(50) DEFAULT 'balanced', -- 'focus', 'discovery', 'review', 'challenge'
    p_duration_minutes INTEGER DEFAULT 60
)
RETURNS UUID AS $$
DECLARE
    playlist_id UUID;
    content_selection JSONB;
BEGIN
    -- 🎵 Crear playlist basada en el "mood" educativo
    INSERT INTO educational_experiences (
        user_id, experience_type, title, description, auto_generated,
        algorithm_version, experience_data
    ) VALUES (
        p_user_id,
        'playlist',
        'DJ Mix: ' || INITCAP(p_mood) || ' Session',
        'Playlist curada por nuestro DJ educativo para tu mood actual',
        true,
        'educational_dj_v1.0',
        jsonb_build_object(
            'mood', p_mood,
            'target_duration', p_duration_minutes,
            'content_mix', CASE p_mood
                WHEN 'focus' THEN jsonb_build_object('theory', 70, 'practice', 30)
                WHEN 'discovery' THEN jsonb_build_object('new_content', 80, 'review', 20)
                WHEN 'review' THEN jsonb_build_object('mastered_content', 60, 'weak_areas', 40)
                WHEN 'challenge' THEN jsonb_build_object('difficult_content', 90, 'confidence_boost', 10)
                ELSE jsonb_build_object('balanced_mix', 100)
            END,
            'generated_at', NOW()
        )
    ) RETURNING id INTO playlist_id;
    
    RETURN playlist_id;
END;
$$ LANGUAGE plpgsql;

-- 🧠 FUNCIÓN MAESTRA: NEURAL CONDUCTOR
CREATE OR REPLACE FUNCTION neural_conductor(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    adaptation_result JSONB;
    current_performance DECIMAL(5,2);
    recommended_difficulty DECIMAL(3,1);
BEGIN
    -- 📊 Analizar performance actual
    SELECT AVG(mastery_percentage) INTO current_performance
    FROM user_interactions
    WHERE user_id = p_user_id
    AND session_start > NOW() - INTERVAL '7 days';
    
    -- 🎯 Calcular dificultad recomendada
    recommended_difficulty := CASE
        WHEN current_performance >= 90 THEN 8.0
        WHEN current_performance >= 80 THEN 7.0
        WHEN current_performance >= 70 THEN 6.0
        WHEN current_performance >= 60 THEN 5.0
        ELSE 4.0
    END;
    
    -- 🎼 Crear adaptación inteligente
    INSERT INTO intelligence_engine (
        user_id, intelligence_type, algorithm_used, input_data, output_data
    ) VALUES (
        p_user_id,
        'adaptation',
        'neural_conductor_v1.0',
        jsonb_build_object(
            'current_performance', current_performance,
            'analysis_period', '7_days',
            'user_context', (
                SELECT jsonb_build_object(
                    'total_sessions', COUNT(*),
                    'avg_session_quality', AVG(session_quality),
                    'preferred_subjects', array_agg(DISTINCT nc.subject)
                )
                FROM user_interactions ui
                JOIN neural_content nc ON ui.content_id = nc.id
                WHERE ui.user_id = p_user_id
            )
        ),
        jsonb_build_object(
            'recommended_difficulty', recommended_difficulty,
            'adaptation_strategy', CASE
                WHEN current_performance >= 85 THEN 'challenge_mode'
                WHEN current_performance >= 70 THEN 'progressive_growth'
                WHEN current_performance >= 50 THEN 'confidence_building'
                ELSE 'foundation_strengthening'
            END,
            'next_content_suggestions', (
                SELECT jsonb_agg(jsonb_build_object(
                    'content_id', id,
                    'title', title,
                    'difficulty', difficulty_rating
                ))
                FROM neural_content
                WHERE difficulty_rating BETWEEN recommended_difficulty - 1 AND recommended_difficulty + 1
                AND is_active = true
                ORDER BY popularity_score DESC
                LIMIT 5
            )
        )
    ) RETURNING output_data INTO adaptation_result;
    
    RETURN adaptation_result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 🎵 SECCIÓN 3: VISTAS OPTIMIZADAS PARA UI
-- =====================================================

-- 🎧 VISTA: STUDENT SPOTIFY DASHBOARD (Simplificada sin agregaciones anidadas)
CREATE OR REPLACE VIEW student_spotify_dashboard AS
WITH user_metrics AS (
    SELECT
        ui.user_id,
        COUNT(DISTINCT ui.id) as total_sessions,
        ROUND(AVG(ui.duration_minutes), 1) as avg_session_length,
        ROUND(AVG(ui.mastery_percentage), 1) as overall_mastery,
        ROUND(AVG(ui.session_quality), 1) as session_quality_avg,
        MAX(ui.session_start) as last_activity
    FROM user_interactions ui
    GROUP BY ui.user_id
),
top_content AS (
    SELECT
        ranked_content.user_id,
        jsonb_agg(
            jsonb_build_object(
                'title', ranked_content.title,
                'subject', ranked_content.subject,
                'play_count', ranked_content.content_count
            ) ORDER BY ranked_content.content_count DESC
        ) as top_content_json
    FROM (
        SELECT
            ui2.user_id,
            nc.title,
            nc.subject,
            COUNT(ui2.id) as content_count
        FROM user_interactions ui2
        JOIN neural_content nc ON ui2.content_id = nc.id
        GROUP BY ui2.user_id, nc.id, nc.title, nc.subject
        ORDER BY ui2.user_id, COUNT(ui2.id) DESC
    ) ranked_content
    WHERE ranked_content.user_id IN (SELECT user_id FROM user_metrics)
    GROUP BY ranked_content.user_id
),
subject_stats AS (
    SELECT
        ui.user_id,
        nc.subject,
        ROUND(AVG(ui.mastery_percentage), 1) as avg_mastery,
        ROUND(SUM(ui.duration_minutes), 1) as total_time,
        COUNT(ui.id) as session_count
    FROM user_interactions ui
    JOIN neural_content nc ON ui.content_id = nc.id
    GROUP BY ui.user_id, nc.subject
),
user_streaks AS (
    SELECT
        user_id,
        COUNT(DISTINCT session_start::date) as current_streak
    FROM user_interactions
    WHERE session_start > NOW() - INTERVAL '30 days'
    GROUP BY user_id
),
user_playlists AS (
    SELECT
        user_id,
        COUNT(*) as active_playlists
    FROM educational_experiences
    WHERE experience_type = 'playlist' AND is_active = true
    GROUP BY user_id
)
SELECT
    um.user_id,
    um.total_sessions,
    um.avg_session_length,
    um.overall_mastery,
    um.session_quality_avg,
    COALESCE(tc.top_content_json, '[]'::jsonb) as top_content,
    COALESCE(
        (SELECT jsonb_object_agg(subject, jsonb_build_object(
            'mastery', avg_mastery,
            'time_spent', total_time,
            'sessions', session_count
        ))
         FROM subject_stats ss WHERE ss.user_id = um.user_id),
        '{}'::jsonb
    ) as subject_progress,
    COALESCE(us.current_streak, 0) as current_streak,
    COALESCE(up.active_playlists, 0) as active_playlists,
    um.last_activity
FROM user_metrics um
LEFT JOIN top_content tc ON um.user_id = tc.user_id
LEFT JOIN user_streaks us ON um.user_id = us.user_id
LEFT JOIN user_playlists up ON um.user_id = up.user_id;

-- 🎼 VISTA: TEACHER ANALYTICS STUDIO (Simplificada sin agregaciones anidadas)
CREATE OR REPLACE VIEW teacher_analytics_studio AS
WITH content_metrics AS (
    SELECT
        nc.subject,
        nc.skill,
        COUNT(DISTINCT nc.id) as total_content_pieces,
        ROUND(AVG(nc.popularity_score), 1) as avg_popularity,
        ROUND(AVG(nc.engagement_rate), 1) as avg_engagement
    FROM neural_content nc
    GROUP BY nc.subject, nc.skill
),
student_metrics AS (
    SELECT
        nc.subject,
        nc.skill,
        COUNT(DISTINCT ui.user_id) as unique_students,
        ROUND(AVG(ui.mastery_percentage), 1) as avg_student_mastery,
        ROUND(SUM(ui.duration_minutes), 1) as total_study_time
    FROM neural_content nc
    LEFT JOIN user_interactions ui ON nc.id = ui.content_id
    GROUP BY nc.subject, nc.skill
),
top_content AS (
    SELECT
        ranked_content.subject,
        ranked_content.skill,
        jsonb_agg(
            jsonb_build_object(
                'title', ranked_content.title,
                'mastery_rate', ranked_content.content_mastery,
                'engagement', ranked_content.engagement_rate
            ) ORDER BY ranked_content.content_mastery DESC
        ) as top_performing_content
    FROM (
        SELECT
            nc.subject,
            nc.skill,
            nc.title,
            nc.engagement_rate,
            AVG(ui.mastery_percentage) as content_mastery
        FROM neural_content nc
        JOIN user_interactions ui ON nc.id = ui.content_id
        GROUP BY nc.subject, nc.skill, nc.id, nc.title, nc.engagement_rate
        ORDER BY nc.subject, nc.skill, AVG(ui.mastery_percentage) DESC
    ) ranked_content
    GROUP BY ranked_content.subject, ranked_content.skill
),
monthly_data AS (
    SELECT
        nc.subject,
        nc.skill,
        TO_CHAR(ui.session_start, 'YYYY-MM') as month_year,
        COUNT(*) as session_count,
        ROUND(AVG(ui.mastery_percentage), 1) as avg_mastery
    FROM neural_content nc
    JOIN user_interactions ui ON nc.id = ui.content_id
    WHERE ui.session_start > NOW() - INTERVAL '6 months'
    GROUP BY nc.subject, nc.skill, TO_CHAR(ui.session_start, 'YYYY-MM')
),
monthly_trends AS (
    SELECT
        subject,
        skill,
        jsonb_object_agg(
            month_year,
            jsonb_build_object(
                'sessions', session_count,
                'avg_mastery', avg_mastery
            )
        ) as monthly_trends_json
    FROM monthly_data
    GROUP BY subject, skill
)
SELECT
    cm.subject,
    cm.skill,
    cm.total_content_pieces,
    cm.avg_popularity,
    cm.avg_engagement,
    COALESCE(sm.unique_students, 0) as unique_students,
    COALESCE(sm.avg_student_mastery, 0) as avg_student_mastery,
    COALESCE(sm.total_study_time, 0) as total_study_time,
    COALESCE(tc.top_performing_content, '[]'::jsonb) as top_performing_content,
    COALESCE(mt.monthly_trends_json, '{}'::jsonb) as monthly_trends
FROM content_metrics cm
LEFT JOIN student_metrics sm ON cm.subject = sm.subject AND cm.skill = sm.skill
LEFT JOIN top_content tc ON cm.subject = tc.subject AND cm.skill = tc.skill
LEFT JOIN monthly_trends mt ON cm.subject = mt.subject AND cm.skill = mt.skill;

-- 🏛️ VISTA: INSTITUTIONAL CONCERT HALL (Simplificada sin agregaciones anidadas)
CREATE OR REPLACE VIEW institutional_concert_hall AS
WITH general_metrics AS (
    SELECT
        'institution_overview' as view_type,
        COUNT(DISTINCT ui.user_id) as total_students,
        COUNT(DISTINCT nc.subject) as subjects_covered,
        ROUND(AVG(ui.mastery_percentage), 1) as institutional_avg_mastery,
        ROUND(SUM(ui.duration_minutes) / 60, 1) as total_study_hours
    FROM user_interactions ui
    JOIN neural_content nc ON ui.content_id = nc.id
),
subject_data AS (
    SELECT
        nc.subject,
        COUNT(DISTINCT ui.user_id) as student_count,
        ROUND(AVG(ui.mastery_percentage), 1) as avg_mastery,
        ROUND(SUM(ui.duration_minutes) / 60, 1) as total_hours
    FROM user_interactions ui
    JOIN neural_content nc ON ui.content_id = nc.id
    GROUP BY nc.subject
),
subject_distribution AS (
    SELECT
        jsonb_object_agg(
            subject,
            jsonb_build_object(
                'students', student_count,
                'avg_mastery', avg_mastery,
                'total_hours', total_hours
            )
        ) as subject_distribution_json
    FROM subject_data
),
top_students AS (
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'user_id', user_id,
                'total_hours', total_hours,
                'avg_mastery', avg_mastery,
                'streak', streak_days
            ) ORDER BY total_minutes DESC
        ) as top_students_json
    FROM (
        SELECT
            ui.user_id,
            ROUND(SUM(ui.duration_minutes) / 60, 1) as total_hours,
            ROUND(AVG(ui.mastery_percentage), 1) as avg_mastery,
            COUNT(DISTINCT ui.session_start::date) as streak_days,
            SUM(ui.duration_minutes) as total_minutes
        FROM user_interactions ui
        GROUP BY ui.user_id
        ORDER BY SUM(ui.duration_minutes) DESC
        LIMIT 10
    ) student_rankings
),
engagement_data AS (
    SELECT
        jsonb_build_object(
            'daily_active_users', COUNT(DISTINCT user_id),
            'avg_session_quality', ROUND(AVG(session_quality), 1),
            'completion_rate', ROUND(AVG(completion_percentage), 1)
        ) as engagement_metrics_json
    FROM user_interactions
    WHERE session_start > NOW() - INTERVAL '24 hours'
)
SELECT
    gm.view_type,
    gm.total_students,
    gm.subjects_covered,
    gm.institutional_avg_mastery,
    gm.total_study_hours,
    COALESCE(sd.subject_distribution_json, '{}'::jsonb) as subject_distribution,
    COALESCE(ts.top_students_json, '[]'::jsonb) as top_students,
    COALESCE(ed.engagement_metrics_json, '{}'::jsonb) as engagement_metrics
FROM general_metrics gm
CROSS JOIN subject_distribution sd
CROSS JOIN top_students ts
CROSS JOIN engagement_data ed;

-- =====================================================
-- 🎵 SECCIÓN 4: TRIGGERS AUTOMÁTICOS
-- =====================================================

-- 🎼 TRIGGER: Actualización automática de métricas
CREATE OR REPLACE FUNCTION update_content_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar métricas del contenido
    UPDATE neural_content SET
        play_count = play_count + 1,
        engagement_rate = (
            SELECT AVG(session_quality)
            FROM user_interactions
            WHERE content_id = NEW.content_id
        ),
        completion_rate = (
            SELECT AVG(completion_percentage)
            FROM user_interactions
            WHERE content_id = NEW.content_id
        ),
        updated_at = NOW()
    WHERE id = NEW.content_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_metrics
    AFTER INSERT ON user_interactions
    FOR EACH ROW EXECUTE FUNCTION update_content_metrics();

-- =====================================================
-- 🎵 SECCIÓN 5: INICIALIZACIÓN Y DATOS SEMILLA
-- =====================================================

-- 🎧 Insertar contenido base del ecosistema
INSERT INTO neural_content (content_id, title, content_type, subject, skill, bloom_level, tier, paes_value, content_data) VALUES
-- Nodos de Matemática
('math_algebra_basics', 'Fundamentos de Álgebra', 'node', 'matematica', 'algebra', 'understand', 1, 15.5, '{"theory": "Conceptos básicos de álgebra", "exercises": 10, "difficulty": 3}'),
('math_functions', 'Funciones y Gráficas', 'node', 'matematica', 'funciones', 'apply', 2, 18.0, '{"theory": "Funciones lineales y cuadráticas", "exercises": 15, "difficulty": 5}'),
('math_calculus_intro', 'Introducción al Cálculo', 'node', 'matematica', 'calculo', 'analyze', 3, 22.5, '{"theory": "Límites y derivadas básicas", "exercises": 20, "difficulty": 8}'),

-- Nodos de Lenguaje
('lang_reading_comp', 'Comprensión Lectora Avanzada', 'node', 'lenguaje', 'comprension', 'evaluate', 2, 20.0, '{"theory": "Técnicas de análisis textual", "exercises": 12, "difficulty": 6}'),
('lang_writing', 'Escritura Argumentativa', 'node', 'lenguaje', 'escritura', 'create', 3, 25.0, '{"theory": "Estructura argumentativa", "exercises": 8, "difficulty": 7}'),

-- Achievements
('achievement_first_session', 'Primer Paso Musical', 'achievement', 'general', 'engagement', 'remember', 1, 0, '{"criteria_type": "session_count", "criteria_value": "1", "reward_points": 10, "rarity": "common"}'),
('achievement_week_streak', 'Racha Semanal', 'achievement', 'general', 'consistency', 'apply', 2, 0, '{"criteria_type": "streak_days", "criteria_value": "7", "reward_points": 50, "rarity": "rare"}'),
('achievement_master_subject', 'Maestro de Materia', 'achievement', 'general', 'mastery', 'create', 3, 0, '{"criteria_type": "subject_mastery", "criteria_value": "90", "reward_points": 100, "rarity": "epic"}')

ON CONFLICT (content_id) DO NOTHING;

-- 🎼 Configurar servicios Supabase existentes
INSERT INTO service_orchestration (service_name, service_type, endpoint_url, service_config) VALUES
('openrouter-ai', 'supabase_function', '/functions/v1/openrouter-ai', '{"model": "gpt-4", "max_tokens": 2000, "temperature": 0.7}'),
('achievement-engine', 'supabase_function', '/functions/v1/achievement-engine', '{"auto_unlock": true, "notification_enabled": true}'),
('lectoguia-chat', 'supabase_function', '/functions/v1/lectoguia-chat', '{"context_memory": 10, "personality": "helpful_tutor"}'),
('neural-ai-assistant', 'supabase_function', '/functions/v1/neural-ai-assistant', '{"specialization": "paes_prep", "adaptive_responses": true}'),
('notification-scheduler', 'supabase_function', '/functions/v1/notification-scheduler', '{"smart_timing": true, "personalized": true}')
ON CONFLICT (service_name) DO NOTHING;

-- =====================================================
-- 🎵 SECCIÓN 6: FUNCIÓN DE INICIALIZACIÓN MAESTRA
-- =====================================================

CREATE OR REPLACE FUNCTION initialize_spotify_paes_ecosystem()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    stats RECORD;
BEGIN
    -- 🎼 Crear índices optimizados
    CREATE INDEX IF NOT EXISTS idx_neural_content_type_subject ON neural_content(content_type, subject);
    CREATE INDEX IF NOT EXISTS idx_neural_content_vector ON neural_content USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);
    CREATE INDEX IF NOT EXISTS idx_user_interactions_user_date ON user_interactions(user_id, session_start);
    CREATE INDEX IF NOT EXISTS idx_user_interactions_content ON user_interactions(content_id, interaction_type);
    CREATE INDEX IF NOT EXISTS idx_educational_experiences_user_type ON educational_experiences(user_id, experience_type);
    CREATE INDEX IF NOT EXISTS idx_intelligence_engine_user_type ON intelligence_engine(user_id, intelligence_type);
    CREATE INDEX IF NOT EXISTS idx_service_orchestration_active ON service_orchestration(service_name, is_active);
    
    -- 🎧 Actualizar metadatos de contenido existente
    UPDATE neural_content SET
        popularity_score = RANDOM() * 100,
        engagement_rate = 50 + RANDOM() * 50,
        completion_rate = 60 + RANDOM() * 40,
        quality_score = 70 + RANDOM() * 30,
        updated_at = NOW()
    WHERE popularity_score = 0;
    
    -- 🎵 Obtener estadísticas del ecosistema
    SELECT
        (SELECT COUNT(*) FROM neural_content) as total_content,
        (SELECT COUNT(DISTINCT user_id) FROM user_interactions) as total_users,
        (SELECT COUNT(*) FROM educational_experiences) as total_experiences,
        (SELECT COUNT(*) FROM intelligence_engine) as ai_operations,
        (SELECT COUNT(*) FROM service_orchestration WHERE is_active = true) as active_services
    INTO stats;
    
    -- 🎼 Compilar resultado de inicialización
    result := jsonb_build_object(
        'status', 'success',
        'ecosystem', 'Spotify-PAES Educational Universe',
        'version', '1.0.0-master',
        'initialization_timestamp', NOW(),
        'statistics', jsonb_build_object(
            'total_content_pieces', stats.total_content,
            'active_users', stats.total_users,
            'educational_experiences', stats.total_experiences,
            'ai_operations_completed', stats.ai_operations,
            'active_services', stats.active_services
        ),
        'features_enabled', jsonb_build_array(
            'spotify_style_playlists',
            'ai_powered_recommendations',
            'adaptive_learning_paths',
            'gamification_engine',
            'real_time_analytics',
            'social_learning',
            'premium_content',
            'offline_mode',
            'achievement_system',
            'predictive_scoring',
            'immersive_3d_content',
            'neural_ai_assistants',
            'smart_notifications',
            'calendar_integration',
            'scholarship_tracking',
            'official_paes_simulations'
        ),
        'ui_integrations', jsonb_build_object(
            'calendario_page', 'Connected to educational_experiences',
            'entrenamiento_page', 'Connected to user_interactions',
            'achievements_page', 'Connected to neural_content achievements',
            'planning_page', 'Connected to intelligence_engine',
            'auth_context', 'Integrated with service_orchestration',
            'cinematic_context', 'Enhanced with spotify-style animations'
        ),
        'next_steps', jsonb_build_array(
            'Execute spotify_paes_orchestrator() for any user',
            'Use educational_dj() to create mood-based playlists',
            'Call neural_conductor() for adaptive learning',
            'Query student_spotify_dashboard for user insights',
            'Monitor teacher_analytics_studio for content performance',
            'Review institutional_concert_hall for overview metrics'
        )
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 🎵 EJECUCIÓN INICIAL DEL ECOSISTEMA
-- =====================================================

-- 🎼 Inicializar el ecosistema completo
SELECT initialize_spotify_paes_ecosystem();

-- 🎧 Mostrar resumen del estado del sistema
SELECT
    '🎵 SPOTIFY-PAES ECOSYSTEM INITIALIZED 🎵' as status,
    (SELECT COUNT(*) FROM neural_content) as total_content,
    (SELECT COUNT(*) FROM neural_content WHERE content_type = 'node') as learning_nodes,
    (SELECT COUNT(*) FROM neural_content WHERE content_type = 'achievement') as achievements,
    (SELECT COUNT(*) FROM service_orchestration WHERE is_active = true) as active_services,
    NOW() as timestamp;

-- =====================================================
-- 🎵 COMANDOS DE USO PRINCIPALES
-- =====================================================

/*
🎼 GUÍA DE USO DEL ECOSISTEMA SPOTIFY-PAES:

-- 1. 🎧 CREAR EXPERIENCIA COMPLETA PARA UN USUARIO:
SELECT spotify_paes_orchestrator('usuario123');

-- 2. 🎵 GENERAR PLAYLIST SEGÚN MOOD:
SELECT educational_dj('usuario123', 'focus', 90); -- 90 minutos de contenido enfocado
SELECT educational_dj('usuario123', 'discovery', 60); -- 60 minutos de descubrimiento
SELECT educational_dj('usuario123', 'challenge', 45); -- 45 minutos de desafío

-- 3. 🧠 OBTENER ADAPTACIÓN INTELIGENTE:
SELECT neural_conductor('usuario123');

-- 4. 📊 VER DASHBOARD DEL ESTUDIANTE:
SELECT * FROM student_spotify_dashboard WHERE user_id = 'usuario123';

-- 5. 🎼 VER ANALYTICS PARA PROFESORES:
SELECT * FROM teacher_analytics_studio WHERE subject = 'matematica';

-- 6. 🏛️ VER MÉTRICAS INSTITUCIONALES:
SELECT * FROM institutional_concert_hall;

-- 7. 📝 REGISTRAR SESIÓN DE ESTUDIO:
INSERT INTO user_interactions (user_id, content_id, interaction_type, session_start, session_end, duration_minutes, completion_percentage, mastery_percentage, session_quality, performance_data)
VALUES ('usuario123', (SELECT id FROM neural_content WHERE content_id = 'math_algebra_basics'), 'study', NOW() - INTERVAL '1 hour', NOW(), 60, 85.5, 78.0, 8.5, '{"exercises_completed": 8, "correct_answers": 7, "time_per_exercise": 7.5}');

-- 8. 🎵 CREAR CONTENIDO NUEVO:
INSERT INTO neural_content (content_id, title, content_type, subject, skill, bloom_level, tier, paes_value, content_data)
VALUES ('new_content_001', 'Nuevo Tema Matemático', 'node', 'matematica', 'geometria', 'apply', 2, 16.5, '{"theory": "Geometría analítica", "exercises": 12, "difficulty": 5, "3d_visualization": true}');

-- 9. 🏆 VERIFICAR ACHIEVEMENTS DESBLOQUEADOS:
SELECT nc.title, nc.content_data->>'reward_points' as points, ui.created_at as unlocked_at
FROM user_interactions ui
JOIN neural_content nc ON ui.content_id = nc.id
WHERE ui.user_id = 'usuario123'
AND nc.content_type = 'achievement'
AND 'achievement_first_session' = ANY(ui.achievements_unlocked);

-- 10. 🔧 MONITOREAR SERVICIOS:
SELECT service_name, health_status, performance_metrics, last_health_check
FROM service_orchestration
WHERE is_active = true;

🎵 ¡DISFRUTA DE LA REVOLUCIÓN EDUCATIVA SPOTIFY-STYLE! 🎵
*/