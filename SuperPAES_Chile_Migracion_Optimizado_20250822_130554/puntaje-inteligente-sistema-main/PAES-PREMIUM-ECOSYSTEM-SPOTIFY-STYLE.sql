-- =====================================================
-- PAES PREMIUM ECOSYSTEM - SPOTIFY STYLE
-- Sistema Educativo Premium con IA Avanzada
-- Inspirado en Spotify Premium + Arsenal Educativo Completo
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- SECCIÓN 1: CORE NEURAL SYSTEM (MEJORADO)
-- =====================================================

-- Tabla principal de nodos neurales (expandida estilo Spotify)
ALTER TABLE neural_nodes 
ADD COLUMN IF NOT EXISTS spotify_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty_rating DECIMAL(3,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_rating DECIMAL(3,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS content_vector vector(1536), -- Para embeddings de IA
ADD COLUMN IF NOT EXISTS last_updated_content TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS premium_content BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS content_quality_score DECIMAL(5,2) DEFAULT 0;

-- =====================================================
-- SECCIÓN 2: PERFILES DE USUARIO ESTILO SPOTIFY
-- =====================================================

-- Perfiles de aprendizaje premium
CREATE TABLE IF NOT EXISTS user_learning_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) UNIQUE NOT NULL,
    
    -- Datos demográficos y contexto
    age_range VARCHAR(20),
    education_level VARCHAR(50),
    institution_id UUID,
    target_paes_score INTEGER,
    exam_date DATE,
    
    -- Perfil de "gusto" educativo (estilo Spotify)
    learning_style_vector vector(512),
    preferred_difficulty DECIMAL(3,1) DEFAULT 5.0,
    preferred_session_length INTEGER DEFAULT 30, -- minutos
    optimal_study_times INTEGER[] DEFAULT '{9,14,19}', -- horas del día
    
    -- Métricas de engagement
    total_study_time INTEGER DEFAULT 0, -- minutos
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    avg_session_length DECIMAL(5,1) DEFAULT 0,
    
    -- Preferencias premium
    premium_tier VARCHAR(20) DEFAULT 'free',
    premium_features JSONB DEFAULT '{}',
    subscription_start DATE,
    subscription_end DATE,
    
    -- Analytics avanzados
    learning_velocity DECIMAL(5,2) DEFAULT 1.0,
    retention_rate DECIMAL(5,2) DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Historial de "escucha" educativa (listening history)
CREATE TABLE IF NOT EXISTS educational_listening_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) REFERENCES neural_nodes(id),
    
    -- Datos de la sesión
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP,
    duration_minutes DECIMAL(5,1),
    completion_percentage DECIMAL(5,2),
    
    -- Contexto de la sesión
    device_type VARCHAR(50),
    study_mode VARCHAR(50), -- 'focus', 'discovery', 'review', 'exam_prep'
    session_quality DECIMAL(3,1), -- 1-10
    
    -- Métricas de performance
    exercises_attempted INTEGER DEFAULT 0,
    exercises_correct INTEGER DEFAULT 0,
    time_per_exercise DECIMAL(5,1),
    difficulty_progression DECIMAL(3,1),
    
    -- Datos para recomendaciones
    user_rating DECIMAL(3,1),
    skip_reason VARCHAR(100),
    replay_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECCIÓN 3: PLAYLISTS EDUCATIVAS PREMIUM
-- =====================================================

-- Playlists educativas (como Spotify playlists)
CREATE TABLE IF NOT EXISTS educational_playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100),
    
    -- Metadatos de playlist
    name VARCHAR(200) NOT NULL,
    description TEXT,
    playlist_type VARCHAR(50), -- 'daily_mix', 'discover_weekly', 'custom', 'radio'
    cover_image_url TEXT,
    
    -- Configuración de playlist
    auto_generated BOOLEAN DEFAULT false,
    algorithm_version VARCHAR(20),
    target_duration_minutes INTEGER,
    difficulty_range DECIMAL(3,1)[] DEFAULT '{1,10}',
    
    -- Métricas de playlist
    total_nodes INTEGER DEFAULT 0,
    avg_completion_rate DECIMAL(5,2) DEFAULT 0,
    popularity_score DECIMAL(5,2) DEFAULT 0,
    
    -- Configuración premium
    premium_only BOOLEAN DEFAULT false,
    offline_available BOOLEAN DEFAULT false,
    
    -- Metadatos de IA
    generation_prompt TEXT,
    ai_confidence_score DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contenido de playlists
CREATE TABLE IF NOT EXISTS playlist_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID REFERENCES educational_playlists(id) ON DELETE CASCADE,
    node_id VARCHAR(100) REFERENCES neural_nodes(id),
    
    -- Orden y configuración
    position INTEGER NOT NULL,
    auto_added BOOLEAN DEFAULT false,
    reason_added TEXT,
    
    -- Métricas específicas del nodo en la playlist
    play_count INTEGER DEFAULT 0,
    skip_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    added_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECCIÓN 4: ALGORITMOS DE RECOMENDACIÓN AVANZADOS
-- =====================================================

-- Motor de recomendaciones (estilo Spotify Discover)
CREATE TABLE IF NOT EXISTS recommendation_engine_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    
    -- Vectores de preferencias
    content_preference_vector vector(512),
    difficulty_preference_vector vector(128),
    timing_preference_vector vector(64),
    
    -- Métricas de similitud
    similar_users UUID[] DEFAULT '{}',
    similarity_scores DECIMAL(5,4)[] DEFAULT '{}',
    
    -- Datos de clustering
    user_cluster_id INTEGER,
    cluster_confidence DECIMAL(5,2),
    
    -- Configuración del algoritmo
    algorithm_weights JSONB DEFAULT '{}',
    last_model_update TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Recomendaciones generadas
CREATE TABLE IF NOT EXISTS generated_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    
    -- Tipo de recomendación
    recommendation_type VARCHAR(50), -- 'discover_weekly', 'daily_mix', 'radio', 'similar'
    algorithm_used VARCHAR(50),
    confidence_score DECIMAL(5,2),
    
    -- Contenido recomendado
    recommended_nodes JSONB NOT NULL,
    reasoning JSONB,
    
    -- Métricas de efectividad
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    user_feedback DECIMAL(3,1),
    
    -- Validez temporal
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP DEFAULT NOW() + INTERVAL '7 days',
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECCIÓN 5: SISTEMA DE CALIDAD PREMIUM
-- =====================================================

-- Banco de ejercicios premium
CREATE TABLE IF NOT EXISTS premium_exercise_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id VARCHAR(100) REFERENCES neural_nodes(id),
    
    -- Metadatos del ejercicio
    title VARCHAR(300) NOT NULL,
    content JSONB NOT NULL,
    exercise_type VARCHAR(50), -- 'multiple_choice', 'open_ended', 'simulation', 'interactive'
    
    -- Calidad premium
    quality_score DECIMAL(5,2) DEFAULT 0,
    difficulty_precision DECIMAL(5,2),
    explanation_quality DECIMAL(5,2),
    visual_quality DECIMAL(5,2),
    
    -- Datos de IA
    generated_by_ai BOOLEAN DEFAULT false,
    ai_model_used VARCHAR(100),
    human_reviewed BOOLEAN DEFAULT false,
    reviewer_id VARCHAR(100),
    
    -- Métricas de uso
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    avg_time_seconds DECIMAL(7,2),
    
    -- Configuración premium
    premium_only BOOLEAN DEFAULT false,
    offline_available BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Simulaciones oficiales PAES premium
CREATE TABLE IF NOT EXISTS premium_paes_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metadatos de simulación
    name VARCHAR(200) NOT NULL,
    paes_type VARCHAR(50), -- 'competencia_lectora', 'matematica_m1', etc.
    year INTEGER,
    difficulty_level VARCHAR(20),
    
    -- Configuración de simulación
    total_questions INTEGER NOT NULL,
    time_limit_minutes INTEGER NOT NULL,
    question_distribution JSONB, -- distribución por nodos
    
    -- Calidad premium
    realism_score DECIMAL(5,2) DEFAULT 0,
    predictive_accuracy DECIMAL(5,2) DEFAULT 0,
    
    -- Datos de performance
    avg_score DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    user_rating DECIMAL(3,1),
    
    -- Configuración premium
    premium_only BOOLEAN DEFAULT true,
    early_access BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECCIÓN 6: ANALYTICS PREMIUM ESTILO SPOTIFY
-- =====================================================

-- Analytics de "escucha" educativa
CREATE TABLE IF NOT EXISTS educational_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    
    -- Métricas diarias estilo Spotify
    total_study_minutes DECIMAL(7,2) DEFAULT 0,
    unique_nodes_studied INTEGER DEFAULT 0,
    avg_session_length DECIMAL(5,1) DEFAULT 0,
    peak_study_hour INTEGER,
    
    -- Métricas de calidad
    focus_score DECIMAL(5,2) DEFAULT 0, -- basado en tiempo por ejercicio
    consistency_score DECIMAL(5,2) DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Distribución por materias (como géneros musicales)
    subject_distribution JSONB DEFAULT '{}',
    difficulty_distribution JSONB DEFAULT '{}',
    
    -- Métricas de engagement
    streak_maintained BOOLEAN DEFAULT false,
    goals_achieved INTEGER DEFAULT 0,
    achievements_unlocked INTEGER DEFAULT 0,
    
    -- Datos para Wrapped anual
    top_subjects TEXT[] DEFAULT '{}',
    top_nodes TEXT[] DEFAULT '{}',
    total_exercises_solved INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Wrapped educativo anual (como Spotify Wrapped)
CREATE TABLE IF NOT EXISTS educational_wrapped (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    
    -- Estadísticas principales
    total_study_hours DECIMAL(8,2),
    total_exercises_solved INTEGER,
    total_nodes_mastered INTEGER,
    longest_streak_days INTEGER,
    
    -- Top contenido
    top_subject VARCHAR(100),
    top_node_id VARCHAR(100),
    top_study_month INTEGER,
    top_study_day_of_week INTEGER,
    
    -- Métricas de crecimiento
    paes_score_improvement INTEGER,
    skills_developed TEXT[],
    achievements_earned TEXT[],
    
    -- Datos únicos y divertidos
    study_personality VARCHAR(100), -- 'Night Owl', 'Early Bird', 'Consistent Learner'
    learning_style VARCHAR(100),
    fun_facts JSONB,
    
    -- Comparaciones sociales
    percentile_study_time DECIMAL(5,2),
    percentile_improvement DECIMAL(5,2),
    
    generated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, year)
);

-- =====================================================
-- SECCIÓN 7: FUNCIONES PREMIUM ESTILO SPOTIFY
-- =====================================================

-- Función: Generar Daily Mix PAES
CREATE OR REPLACE FUNCTION generate_daily_mix_paes(p_user_id VARCHAR(100))
RETURNS UUID AS $$
DECLARE
    playlist_id UUID;
    user_profile RECORD;
    recommended_nodes JSONB;
BEGIN
    -- Obtener perfil del usuario
    SELECT * INTO user_profile 
    FROM user_learning_profiles 
    WHERE user_id = p_user_id;
    
    -- Crear playlist Daily Mix
    INSERT INTO educational_playlists (
        user_id, name, description, playlist_type, auto_generated,
        target_duration_minutes, algorithm_version
    ) VALUES (
        p_user_id,
        'Daily Mix PAES - ' || TO_CHAR(NOW(), 'DD/MM'),
        'Tu mezcla diaria personalizada basada en tu progreso y preferencias',
        'daily_mix',
        true,
        user_profile.preferred_session_length,
        'v2.1'
    ) RETURNING id INTO playlist_id;
    
    -- Generar contenido basado en algoritmo
    WITH user_weak_areas AS (
        SELECT node_id, AVG(completion_percentage) as avg_completion
        FROM educational_listening_history
        WHERE user_id = p_user_id
        AND session_start > NOW() - INTERVAL '30 days'
        GROUP BY node_id
        HAVING AVG(completion_percentage) < 70
        ORDER BY avg_completion ASC
        LIMIT 5
    ),
    user_strong_areas AS (
        SELECT node_id, AVG(completion_percentage) as avg_completion
        FROM educational_listening_history
        WHERE user_id = p_user_id
        AND session_start > NOW() - INTERVAL '30 days'
        GROUP BY node_id
        HAVING AVG(completion_percentage) > 85
        ORDER BY avg_completion DESC
        LIMIT 3
    ),
    discovery_nodes AS (
        SELECT n.id as node_id
        FROM neural_nodes n
        WHERE n.id NOT IN (
            SELECT DISTINCT node_id 
            FROM educational_listening_history 
            WHERE user_id = p_user_id
        )
        AND n.difficulty_rating BETWEEN 
            user_profile.preferred_difficulty - 1 AND 
            user_profile.preferred_difficulty + 1
        ORDER BY n.popularity_score DESC
        LIMIT 2
    )
    INSERT INTO playlist_nodes (playlist_id, node_id, position, auto_added, reason_added)
    SELECT playlist_id, node_id, ROW_NUMBER() OVER (), true, 'weak_area_focus'
    FROM user_weak_areas
    UNION ALL
    SELECT playlist_id, node_id, ROW_NUMBER() OVER () + 5, true, 'strength_reinforcement'
    FROM user_strong_areas
    UNION ALL
    SELECT playlist_id, node_id, ROW_NUMBER() OVER () + 8, true, 'discovery'
    FROM discovery_nodes;
    
    RETURN playlist_id;
END;
$$ LANGUAGE plpgsql;

-- Función: Discover Weekly Skills
CREATE OR REPLACE FUNCTION generate_discover_weekly_skills(p_user_id VARCHAR(100))
RETURNS UUID AS $$
DECLARE
    playlist_id UUID;
    similar_users VARCHAR(100)[];
BEGIN
    -- Encontrar usuarios similares
    SELECT ARRAY_AGG(user_id) INTO similar_users
    FROM (
        SELECT DISTINCT elh.user_id
        FROM educational_listening_history elh
        INNER JOIN educational_listening_history user_history 
            ON elh.node_id = user_history.node_id
        WHERE user_history.user_id = p_user_id
        AND elh.user_id != p_user_id
        AND elh.completion_percentage > 80
        GROUP BY elh.user_id
        HAVING COUNT(DISTINCT elh.node_id) >= 5
        ORDER BY COUNT(DISTINCT elh.node_id) DESC
        LIMIT 10
    ) similar;
    
    -- Crear playlist Discover Weekly
    INSERT INTO educational_playlists (
        user_id, name, description, playlist_type, auto_generated,
        algorithm_version
    ) VALUES (
        p_user_id,
        'Discover Weekly Skills',
        'Nuevas habilidades descubiertas basadas en estudiantes similares a ti',
        'discover_weekly',
        true,
        'collaborative_v1.5'
    ) RETURNING id INTO playlist_id;
    
    -- Agregar nodos basados en filtrado colaborativo
    WITH collaborative_recommendations AS (
        SELECT 
            elh.node_id,
            COUNT(*) as recommendation_strength,
            AVG(elh.completion_percentage) as avg_success
        FROM educational_listening_history elh
        WHERE elh.user_id = ANY(similar_users)
        AND elh.node_id NOT IN (
            SELECT DISTINCT node_id 
            FROM educational_listening_history 
            WHERE user_id = p_user_id
        )
        AND elh.completion_percentage > 75
        GROUP BY elh.node_id
        ORDER BY recommendation_strength DESC, avg_success DESC
        LIMIT 15
    )
    INSERT INTO playlist_nodes (playlist_id, node_id, position, auto_added, reason_added)
    SELECT 
        playlist_id, 
        node_id, 
        ROW_NUMBER() OVER (), 
        true, 
        'collaborative_filtering'
    FROM collaborative_recommendations;
    
    RETURN playlist_id;
END;
$$ LANGUAGE plpgsql;

-- Función: PAES Radio (modo infinito)
CREATE OR REPLACE FUNCTION generate_paes_radio(
    p_user_id VARCHAR(100),
    p_seed_node_id VARCHAR(100)
)
RETURNS UUID AS $$
DECLARE
    playlist_id UUID;
    seed_node RECORD;
BEGIN
    -- Obtener información del nodo semilla
    SELECT * INTO seed_node 
    FROM neural_nodes 
    WHERE id = p_seed_node_id;
    
    -- Crear playlist Radio
    INSERT INTO educational_playlists (
        user_id, name, description, playlist_type, auto_generated,
        algorithm_version
    ) VALUES (
        p_user_id,
        'Radio: ' || seed_node.name,
        'Estación infinita basada en ' || seed_node.name,
        'radio',
        true,
        'content_based_v2.0'
    ) RETURNING id INTO playlist_id;
    
    -- Generar contenido similar usando vectores de contenido
    WITH similar_nodes AS (
        SELECT 
            n.id,
            n.content_vector <-> seed_node.content_vector as distance
        FROM neural_nodes n
        WHERE n.id != p_seed_node_id
        AND n.subject = seed_node.subject
        AND n.content_vector IS NOT NULL
        ORDER BY distance ASC
        LIMIT 50
    )
    INSERT INTO playlist_nodes (playlist_id, node_id, position, auto_added, reason_added)
    SELECT 
        playlist_id, 
        id, 
        ROW_NUMBER() OVER (), 
        true, 
        'content_similarity'
    FROM similar_nodes;
    
    RETURN playlist_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECCIÓN 8: SISTEMA DE ENGAGEMENT PREMIUM
-- =====================================================

-- Achievements premium (logros estilo Spotify)
CREATE TABLE IF NOT EXISTS premium_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metadatos del achievement
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50), -- 'streak', 'mastery', 'discovery', 'social', 'premium'
    
    -- Configuración del achievement
    criteria JSONB NOT NULL,
    points_reward INTEGER DEFAULT 0,
    premium_only BOOLEAN DEFAULT false,
    
    -- Rareza y dificultad
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    difficulty_level INTEGER DEFAULT 1, -- 1-10
    
    -- Métricas
    total_earned INTEGER DEFAULT 0,
    percentage_of_users DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Logros desbloqueados por usuarios
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    achievement_id UUID REFERENCES premium_achievements(id),
    
    -- Datos del desbloqueo
    unlocked_at TIMESTAMP DEFAULT NOW(),
    progress_data JSONB,
    
    -- Configuración social
    shared_publicly BOOLEAN DEFAULT false,
    celebration_shown BOOLEAN DEFAULT false,
    
    UNIQUE(user_id, achievement_id)
);

-- Sistema de streaks premium
CREATE TABLE IF NOT EXISTS study_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) UNIQUE NOT NULL,
    
    -- Streak actual
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_study_date DATE,
    
    -- Configuración de streak
    min_study_minutes INTEGER DEFAULT 15,
    streak_freeze_available INTEGER DEFAULT 0, -- premium feature
    
    -- Métricas premium
    streak_quality_score DECIMAL(5,2) DEFAULT 0,
    consistency_bonus DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- SECCIÓN 9: ORQUESTADOR MAESTRO PREMIUM
-- =====================================================

-- Función maestra: Spotify Premium Orchestrator
CREATE OR REPLACE FUNCTION spotify_premium_orchestrator(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
    user_profile RECORD;
    daily_mix_id UUID;
    discover_weekly_id UUID;
    recommendations JSONB;
BEGIN
    -- Obtener perfil del usuario
    SELECT * INTO user_profile 
    FROM user_learning_profiles 
    WHERE user_id = p_user_id;
    
    -- Si no existe perfil, crear uno básico
    IF user_profile IS NULL THEN
        INSERT INTO user_learning_profiles (user_id, premium_tier)
        VALUES (p_user_id, 'free')
        RETURNING * INTO user_profile;
    END IF;
    
    -- Generar Daily Mix si no existe hoy
    IF NOT EXISTS (
        SELECT 1 FROM educational_playlists 
        WHERE user_id = p_user_id 
        AND playlist_type = 'daily_mix'
        AND created_at::date = CURRENT_DATE
    ) THEN
        daily_mix_id := generate_daily_mix_paes(p_user_id);
    END IF;
    
    -- Generar Discover Weekly si es lunes y no existe esta semana
    IF EXTRACT(DOW FROM NOW()) = 1 AND NOT EXISTS (
        SELECT 1 FROM educational_playlists 
        WHERE user_id = p_user_id 
        AND playlist_type = 'discover_weekly'
        AND created_at > NOW() - INTERVAL '7 days'
    ) THEN
        discover_weekly_id := generate_discover_weekly_skills(p_user_id);
    END IF;
    
    -- Actualizar analytics diarios
    INSERT INTO educational_analytics (user_id, date)
    VALUES (p_user_id, CURRENT_DATE)
    ON CONFLICT (user_id, date) DO NOTHING;
    
    -- Verificar y actualizar streaks
    PERFORM update_user_streak(p_user_id);
    
    -- Verificar achievements
    PERFORM check_and_unlock_achievements(p_user_id);
    
    -- Generar recomendaciones en tiempo real
    recommendations := generate_realtime_recommendations(p_user_id);
    
    -- Compilar resultado
    result := jsonb_build_object(
        'status', 'success',
        'user_tier', user_profile.premium_tier,
        'daily_mix_id', daily_mix_id,
        'discover_weekly_id', discover_weekly_id,
        'recommendations', recommendations,
        'streak_days', (SELECT current_streak FROM study_streaks WHERE user_id = p_user_id),
        'timestamp', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función: Actualizar streak del usuario
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id VARCHAR(100))
RETURNS VOID AS $$
DECLARE
    last_study DATE;
    current_streak_val INTEGER;
BEGIN
    -- Obtener última fecha de estudio
    SELECT MAX(session_start::date) INTO last_study
    FROM educational_listening_history
    WHERE user_id = p_user_id
    AND duration_minutes >= 15; -- mínimo 15 minutos
    
    -- Actualizar o crear streak
    INSERT INTO study_streaks (user_id, current_streak, last_study_date)
    VALUES (p_user_id, 
        CASE 
            WHEN last_study = CURRENT_DATE THEN 1
            WHEN last_study = CURRENT_DATE - 1 THEN 1
            ELSE 0
        END,
        last_study
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_streak = CASE
            WHEN last_study = CURRENT_DATE AND study_streaks.last_study_date = CURRENT_DATE - 1 THEN
                study_streaks.current_streak + 1
            WHEN last_study = CURRENT_DATE THEN
                GREATEST(study_streaks.current_streak, 1)
            WHEN last_study < CURRENT_DATE - 1 THEN
                0
            ELSE study_streaks.current_streak
        END,
        longest_streak = GREATEST(
            study_streaks.longest_streak,
            CASE
                WHEN last_study = CURRENT_DATE AND study_streaks.last_study_date = CURRENT_DATE - 1 THEN
                    study_streaks.current_streak + 1
                ELSE study_streaks.current_streak
            END
        ),
        last_study_date = last_study,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Función: Verificar y desbloquear achievements
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id VARCHAR(100))
RETURNS INTEGER AS $$
DECLARE
    achievement RECORD;
    unlocked_count INTEGER := 0;
    user_stats RECORD;
BEGIN
    -- Obtener estadísticas del usuario
    SELECT 
        COALESCE(SUM(duration_minutes), 0) as total_study_minutes,
        COUNT(DISTINCT node_id) as unique_nodes_studied,
        COUNT(*) as total_sessions,
        COALESCE(AVG(completion_percentage), 0) as avg_completion,
        (SELECT current_streak FROM study_streaks WHERE user_id = p_user_id) as current_streak
    INTO user_stats
    FROM educational_listening_history
    WHERE user_id = p_user_id;
    
    -- Verificar cada achievement no desbloqueado
    FOR achievement IN 
        SELECT * FROM premium_achievements pa
        WHERE NOT EXISTS (
            SELECT 1 FROM user_achievements ua 
            WHERE ua.user_id = p_user_id AND ua.achievement_id = pa.id
        )
    LOOP
        -- Lógica de verificación basada en criterios
        IF (achievement.criteria->>'type' = 'streak' AND 
            user_stats.current_streak >= (achievement.criteria->>'value')::INTEGER) OR
           (achievement.criteria->>'type' = 'study_time' AND 
            user_stats.total_study_minutes >= (achievement.criteria->>'value')::INTEGER) OR
           (achievement.criteria->>'type' = 'nodes_mastered' AND 
            user_stats.unique_nodes_studied >= (achievement.criteria->>'value')::INTEGER) THEN
            
            -- Desbloquear achievement
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (p_user_id, achievement.id);
            
            unlocked_count := unlocked_count + 1;
        END IF;
    END LOOP;
    
    RETURN unlocked_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECCIÓN 10: VISTAS PREMIUM OPTIMIZADAS
-- =====================================================

-- Vista: Dashboard premium del estudiante
CREATE OR REPLACE VIEW premium_student_dashboard AS
SELECT 
    ulp.user_id,
    ulp.premium_tier,
    ulp.streak_days,
    ulp.total_study_time,
    ulp.target_paes_score,
    
    -- Playlists activas
    (SELECT COUNT(*) FROM educational_playlists WHERE user_id = ulp.user_id AND created_at > NOW() - INTERVAL '7 days') as active_playlists,
    
    -- Progreso reciente
    (SELECT AVG(completion_percentage) FROM educational_listening_history WHERE user_id = ulp.user_id AND session_start > NOW() - INTERVAL '7 days') as recent_avg_completion,
    
    -- Recomendaciones pendientes
    (SELECT COUNT(*) FROM generated_recommendations WHERE user_id = ulp.user_id AND valid_until > NOW()) as pending_recommendations,
    
    -- Achievements recientes
    (SELECT COUNT(*) FROM user_achievements WHERE user_id = ulp.user_id AND unlocked_at > NOW() - INTERVAL '30 days') as recent_achievements,
    
    -- Próximo objetivo
    CASE 
        WHEN ulp.exam_date IS NOT NULL THEN ulp.exam_date - CURRENT_DATE
        ELSE NULL
    END as days_to_exam
    
FROM user