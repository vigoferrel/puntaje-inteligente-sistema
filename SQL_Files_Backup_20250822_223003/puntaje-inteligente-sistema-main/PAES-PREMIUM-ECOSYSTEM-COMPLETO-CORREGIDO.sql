-- =====================================================
-- PAES PREMIUM ECOSYSTEM - SPOTIFY STYLE COMPLETO
-- Sistema Educativo Premium con IA Avanzada
-- DEFINICIÓN COMPLETA DE TODAS LAS TABLAS DESDE CERO
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- SECCIÓN 1: TABLAS CORE FUNDAMENTALES
-- =====================================================

-- Tabla de instituciones educativas
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50), -- 'colegio', 'universidad', 'instituto'
    region VARCHAR(100),
    city VARCHAR(100),
    contact_email VARCHAR(255),
    premium_plan BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla principal de nodos neurales (COMPLETA desde cero)
CREATE TABLE IF NOT EXISTS neural_nodes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    content JSONB,
    
    -- Clasificación PAES
    tier INTEGER CHECK (tier IN (1, 2, 3)) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    paes_value DECIMAL(5,2) NOT NULL,
    paes_type VARCHAR(50), -- 'competencia_lectora', 'matematica_m1', etc.
    
    -- Configuración de aprendizaje
    target_mastery INTEGER DEFAULT 85,
    prerequisites TEXT[], -- Array de IDs de nodos prerequisito
    depends_on TEXT[],
    learning_objectives TEXT[],
    learning_resources TEXT[], -- Array de recursos de aprendizaje
    tags TEXT[],
    resources TEXT[],
    
    -- Metadatos educativos
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')),
    bloom_level VARCHAR(20) CHECK (bloom_level IN ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE')),
    bloom_level_alt VARCHAR(20),
    estimated_time INTEGER,
    estimated_time_minutes INTEGER DEFAULT 0,
    official_exercises INTEGER DEFAULT 0,
    position INTEGER,
    
    -- Propiedades unificadas
    cognitive_level VARCHAR(50),
    cognitive_level_alt VARCHAR(50),
    subject_area VARCHAR(100),
    subject_area_alt VARCHAR(100),
    code VARCHAR(50),
    skill_id INTEGER,
    test_id INTEGER,
    
    -- Propiedades para sistema diagnóstico
    tier_priority VARCHAR(50) CHECK (tier_priority IN ('tier1_critico', 'tier2_importante', 'tier3_complementario')),
    domain_category VARCHAR(100),
    base_weight DECIMAL(5,2) DEFAULT 1.0,
    difficulty_multiplier DECIMAL(5,2) DEFAULT 1.0,
    frequency_bonus DECIMAL(5,2) DEFAULT 0.0,
    prerequisite_weight DECIMAL(5,2) DEFAULT 1.0,
    adaptive_adjustment DECIMAL(5,2) DEFAULT 0.0,
    bloom_complexity_score DECIMAL(5,2) DEFAULT 1.0,
    paes_frequency DECIMAL(5,2) DEFAULT 1.0,
    
    -- Metadatos estilo Spotify
    spotify_metadata JSONB DEFAULT '{}',
    popularity_score DECIMAL(5,2) DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    difficulty_rating DECIMAL(3,1) DEFAULT 0,
    user_rating DECIMAL(3,1) DEFAULT 0,
    content_vector vector(1536), -- Para embeddings de IA
    
    -- Estado y calidad
    is_active BOOLEAN DEFAULT true,
    validation_status VARCHAR(20) DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'needs_review')),
    premium_content BOOLEAN DEFAULT false,
    content_quality_score DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_content TIMESTAMP DEFAULT NOW()
);

-- Tabla de progreso de usuarios en nodos
CREATE TABLE IF NOT EXISTS user_node_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) REFERENCES neural_nodes(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    evidences TEXT[], -- Array de evidencias de maestria
    time_spent INTEGER DEFAULT 0, -- Tiempo en minutos
    exercises_completed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, node_id)
);

-- Tabla de datos historicos PAES
CREATE TABLE IF NOT EXISTS historical_paes_data (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    paes_score INTEGER NOT NULL,
    node_mastery_data JSONB NOT NULL, -- JSON con maestria por nodo
    exam_date DATE NOT NULL,
    preparation_days INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de factores de rendimiento personalizados
CREATE TABLE IF NOT EXISTS user_performance_factors (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    personal_factor DECIMAL(3,2) DEFAULT 1.0,
    learning_velocity DECIMAL(3,2) DEFAULT 1.0,
    consistency_factor DECIMAL(3,2) DEFAULT 1.0,
    stress_factor DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    institution_id UUID REFERENCES institutions(id),
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
    premium_tier VARCHAR(20) DEFAULT 'free' CHECK (premium_tier IN ('free', 'basic', 'premium', 'family', 'student', 'institutional')),
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
    node_id VARCHAR(100) REFERENCES neural_nodes(id) ON DELETE CASCADE,
    
    -- Datos de la sesión
    session_start TIMESTAMP NOT NULL,
    session_end TIMESTAMP,
    duration_minutes DECIMAL(5,1),
    completion_percentage DECIMAL(5,2),
    
    -- Contexto de la sesión
    device_type VARCHAR(50),
    study_mode VARCHAR(50) CHECK (study_mode IN ('focus', 'discovery', 'review', 'exam_prep', 'radio', 'playlist')),
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
    playlist_type VARCHAR(50) CHECK (playlist_type IN ('daily_mix', 'discover_weekly', 'custom', 'radio', 'exam_prep', 'skill_focus')),
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
    play_count INTEGER DEFAULT 0,
    
    -- Configuración premium
    premium_only BOOLEAN DEFAULT false,
    offline_available BOOLEAN DEFAULT false,
    collaborative BOOLEAN DEFAULT false,
    
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
    node_id VARCHAR(100) REFERENCES neural_nodes(id) ON DELETE CASCADE,
    
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
    recommendation_type VARCHAR(50) CHECK (recommendation_type IN ('discover_weekly', 'daily_mix', 'radio', 'similar', 'trending', 'for_you')),
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
    node_id VARCHAR(100) REFERENCES neural_nodes(id) ON DELETE CASCADE,
    
    -- Metadatos del ejercicio
    title VARCHAR(300) NOT NULL,
    content JSONB NOT NULL,
    exercise_type VARCHAR(50) CHECK (exercise_type IN ('multiple_choice', 'open_ended', 'simulation', 'interactive', 'drag_drop', 'matching')),
    
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
    paes_type VARCHAR(50) CHECK (paes_type IN ('competencia_lectora', 'matematica_m1', 'matematica_m2', 'historia', 'ciencias')),
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

-- Resultados de simulaciones
CREATE TABLE IF NOT EXISTS simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    simulation_id UUID REFERENCES premium_paes_simulations(id) ON DELETE CASCADE,
    
    -- Resultados
    score INTEGER NOT NULL,
    percentage DECIMAL(5,2),
    time_taken_minutes INTEGER,
    questions_correct INTEGER,
    questions_total INTEGER,
    
    -- Análisis detallado
    performance_by_node JSONB,
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations JSONB,
    
    -- Predicción
    predicted_paes_score INTEGER,
    confidence_level DECIMAL(5,2),
    
    completed_at TIMESTAMP DEFAULT NOW()
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
-- SECCIÓN 7: SISTEMA DE ENGAGEMENT PREMIUM
-- =====================================================

-- Achievements premium (logros estilo Spotify)
CREATE TABLE IF NOT EXISTS premium_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Metadatos del achievement
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50) CHECK (category IN ('streak', 'mastery', 'discovery', 'social', 'premium', 'milestone')),
    
    -- Configuración del achievement
    criteria JSONB NOT NULL,
    points_reward INTEGER DEFAULT 0,
    premium_only BOOLEAN DEFAULT false,
    
    -- Rareza y dificultad
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
    
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
    achievement_id UUID REFERENCES premium_achievements(id) ON DELETE CASCADE,
    
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
-- SECCIÓN 8: TABLAS DE SOPORTE PARA SEQUENTIAL THINKING
-- =====================================================

-- Tabla para sesiones de pensamiento secuencial
CREATE TABLE IF NOT EXISTS sequential_thinking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) REFERENCES neural_nodes(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL,
    thought_count INTEGER DEFAULT 0,
    completion_status VARCHAR(20) DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para registro de limpieza automática
CREATE TABLE IF NOT EXISTS node_cleanup_log (
    id SERIAL PRIMARY KEY,
    cleanup_type VARCHAR(50) NOT NULL,
    affected_nodes TEXT[],
    issues_found JSONB,
    actions_taken JSONB,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para nodos problemáticos identificados
CREATE TABLE IF NOT EXISTS problematic_nodes (
    id SERIAL PRIMARY KEY,
    node_id VARCHAR(100) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    issue_description TEXT,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    auto_fixable BOOLEAN DEFAULT false,
    fix_attempted BOOLEAN DEFAULT false,
    fix_successful BOOLEAN DEFAULT false,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    UNIQUE(node_id, issue_type)
);

-- =====================================================
-- SECCIÓN 9: ÍNDICES OPTIMIZADOS PARA PERFORMANCE
-- =====================================================

-- Índices para neural_nodes
CREATE INDEX IF NOT EXISTS idx_neural_nodes_tier ON neural_nodes(tier);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_subject ON neural_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_difficulty ON neural_nodes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_active ON neural_nodes(is_active);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_premium ON neural_nodes(premium_content);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_popularity ON neural_nodes(popularity_score);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_content_vector ON neural_nodes USING ivfflat (content_vector vector_cosine_ops) WITH (lists = 100);

-- Índices para user_node_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_node_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_node_id ON user_node_progress(node_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery ON user_node_progress(mastery_level);

-- Índices para educational_listening_history
CREATE INDEX IF NOT EXISTS idx_listening_history_user_date ON educational_listening_history(user_id, session_start);
CREATE INDEX IF NOT EXISTS idx_listening_history_node_completion ON educational_listening_history(node_id, completion_percentage);
CREATE INDEX IF NOT EXISTS idx_listening_history_study_mode ON educational_listening_history(study_mode);

-- Índices para user_learning_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_premium ON user_learning_profiles(premium_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_institution ON user_learning_profiles(institution_id);

-- Índices para playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user_type ON educational_playlists(user_id, playlist_type);
CREATE INDEX IF NOT EXISTS idx_playlists_auto_generated ON educational_playlists(auto_generated, created_at);

-- Índices para recomendaciones
CREATE INDEX IF NOT EXISTS idx_recommendations_user_valid ON generated_recommendations(user_id, valid_until);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON generated_recommendations(recommendation_type);

-- Índices para analytics
CREATE INDEX IF NOT EXISTS idx_analytics_user_date ON educational_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON educational_analytics(date);

-- =====================================================
-- SECCIÓN 10: FUNCIONES PREMIUM ESTILO SPOTIFY
-- =====================================================

-- Función: Generar Daily Mix PAES
CREATE OR REPLACE FUNCTION generate_daily_mix_paes(p_user_id VARCHAR(100))
RETURNS UUID AS $$
DECLARE
    playlist_id UUID;
    user_profile RECORD;
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
        COALESCE(user_profile.preferred_session_length, 30),
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
            COALESCE(user_profile.preferred_difficulty, 5) - 1 AND 
            COALESCE(user_profile.preferred_difficulty, 5) + 1
        AND n.is_active = true
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
    
    -- Generar contenido similar
    WITH similar_nodes AS (
        SELECT 
            n.id,
            CASE 
                WHEN n.content_vector IS NOT NULL AND seed_node.content_vector IS NOT NULL 
                THEN n.content_vector <-> seed_node.content_vector
                ELSE RANDOM()
            END as distance
        FROM neural_nodes n
        WHERE n.id != p_seed_node_id
        AND n.subject = seed_node.subject
        AND n.is_active = true
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

-- Función: Actualizar streak del usuario
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id VARCHAR(100))
RETURNS VOID AS $$
DECLARE
    last_study DATE;
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
        COALESCE((SELECT current_streak FROM study_streaks WHERE user_id = p_user_id), 0) as current_streak
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
            user_stats.unique_nodes_studied >= (achievement.criteria->>'value')::INTEGER) OR
           (achievement.criteria->>'type' = 'sessions' AND 
            user_stats.total_sessions >= (achievement.criteria->>'value')::INTEGER) THEN
            
            -- Desbloquear achievement
            INSERT INTO user_achievements (user_id, achievement_id)
            VALUES (p_user_id, achievement.id);
            
            unlocked_count := unlocked_count + 1;
        END IF;
    END LOOP;
    
    RETURN unlocked_count;
END;
$$ LANGUAGE plpgsql;

-- Función maestra: Spotify Premium Orchestrator
CREATE OR REPLACE FUNCTION spotify_premium_orchestrator(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    result JSONB := '{}';
    user_profile RECORD;
    daily_mix_id UUID;
    discover_weekly_id UUID;
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
    
    -- Compilar resultado
    result := jsonb_build_object(
        'status', 'success',
        'user_tier', user_profile.premium_tier,
        'daily_mix_id', daily_mix_id,
        'discover_weekly_id', discover_weekly_id,
        'streak_days', COALESCE((SELECT current_streak FROM study_streaks WHERE user_id = p_user_id), 0),
        'timestamp', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECCIÓN 11: VISTAS PREMIUM OPTIMIZADAS
-- =====================================================

-- Vista: Dashboard premium del estudiante
CREATE OR REPLACE VIEW premium_student_dashboard AS
SELECT 
    ulp.user_id,
    ulp.premium_tier,
    COALESCE(ss.current_streak, 0) as streak_days,
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
    
FROM user_learning_profiles ulp
LEFT JOIN study_streaks ss ON ulp.user_id = ss.user_id;

-- Vista: Analytics premium para instituciones
CREATE OR REPLACE VIEW premium_institutional_analytics AS
SELECT 
    i.id as institution_id,
    i.name as institution_name,
    COUNT(DISTINCT ulp.user_id) as total_students,
    AVG(ulp.target_paes_score) as avg_target_score,
    
    -- Métricas de engagement
    AVG(ulp.total_study_time) as avg_study_time,
    AVG(COALESCE(ss.current_streak, 0)) as avg_streak,
    
    -- Distribución premium
    COUNT(CASE WHEN ulp.premium_tier != 'free' THEN 1 END) as premium_students,
    ROUND(COUNT(CASE WHEN ulp.premium_tier != 'free' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as premium_percentage,
    
    -- Performance institucional
    (SELECT AVG(completion_percentage) 
     FROM educational_listening_history elh 
     INNER JOIN user_learning_profiles ulp2 ON elh.user_id = ulp2.user_id 
     WHERE ulp2.institution_id = i.id 
     AND elh.session_start > NOW() - INTERVAL '30 days') as recent_avg_performance
     
FROM institutions i
LEFT JOIN user_learning_profiles ulp ON i.id = ulp.institution_id
LEFT JOIN study_streaks ss ON ulp.user_id = ss.user_id
GROUP BY i.id, i.name;

-- Vista de nodos saludables (sin problemas)
CREATE OR REPLACE VIEW healthy_nodes AS
SELECT n.*
FROM neural_nodes n
WHERE n.is_active = true
  AND n.validation_status = 'valid'
  AND n.id NOT IN (
      SELECT DISTINCT node_id 
      FROM problematic_nodes 
      WHERE resolved_at IS NULL 
        AND severity IN ('high', 'critical')
  );

-- =====================================================
-- SECCIÓN 12: INICIALIZACIÓN Y DATOS SEMILLA
-- =====================================================

-- Insertar achievements premium básicos
INSERT INTO premium_achievements (name, description, category, criteria, points_reward, rarity) VALUES
('Primer Paso', 'Completa tu primera sesión de estudio', 'discovery', '{"type": "sessions", "value": 1}', 10, 'common'),
('Racha de Fuego', 'Mantén una racha de 7 días consecutivos', 'streak', '{"type": "streak", "value": 7}', 50, 'rare'),
('Maratonista', 'Estudia por más de 100 horas en total', 'mastery', '{"type": "study_time", "value": 6000}', 100, 'epic'),
('Explorador', 'Estudia nodos de 5 materias diferentes', 'discovery', '{"type": "subjects", "value": 5}', 30, 'common'),
('Perfeccionista', 'Logra 95% de completion en 10 nodos', 'mastery', '{"type": "perfect_completion", "value": 10}', 75, 'rare'),
('Leyenda PAES', 'Alcanza tu puntaje objetivo en simulación', 'milestone', '{"type": "target_score", "value": 1}', 200, 'legendary'),
('Social Butterfly', 'Comparte 5 playlists con amigos', 'social', '{"type": "shared_playlists", "value": 5}', 25, 'common'),
('Premium Pioneer', 'Sé uno de los primeros 1000 usuarios premium', 'premium', '{"type": "early_premium", "value": 1000}', 150, 'epic')
ON CONFLICT DO NOTHING;

-- Función: Inicialización completa del ecosistema premium
CREATE OR REPLACE FUNCTION initialize_premium_ecosystem()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    stats RECORD;
BEGIN
    -- Actualizar metadatos de nodos existentes
    UPDATE neural_nodes SET 
        spotify_metadata = jsonb_build_object(
            'genre', subject,
            'mood', difficulty_level,
            'energy', CASE 
                WHEN difficulty_level = 'BASIC' THEN 3
                WHEN difficulty_level = 'INTERMEDIATE' THEN 6
                WHEN difficulty_level = 'ADVANCED' THEN 9
                ELSE 5
            END,
            'danceability', CASE 
                WHEN bloom_level IN ('APPLY', 'CREATE') THEN 8
                ELSE 4
            END
        ),
        popularity_score = RANDOM() * 100,
        engagement_rate = 50 + RANDOM() * 50,
        completion_rate = 60 + RANDOM() * 40,
        difficulty_rating = CASE 
            WHEN difficulty_level = 'BASIC' THEN 2 + RANDOM() * 2
            WHEN difficulty_level = 'INTERMEDIATE' THEN 4 + RANDOM() * 3
            WHEN difficulty_level = 'ADVANCED' THEN 7 + RANDOM() * 3
            ELSE 5
        END,
        content_quality_score = 70 + RANDOM() * 30,
        validation_status = 'valid',
        is_active = true
    WHERE spotify_metadata IS NULL OR spotify_metadata = '{}';
    
    -- Crear triggers para mantenimiento automático
    CREATE OR REPLACE FUNCTION update_user_analytics_trigger()
    RETURNS TRIGGER AS $trigger$
    BEGIN
        -- Actualizar analytics en tiempo real
        INSERT INTO educational_analytics (user_id, date, total_study_minutes, unique_nodes_studied)
        VALUES (NEW.user_id, NEW.session_start::date, COALESCE(NEW.duration_minutes, 0), 1)
        ON CONFLICT (user_id, date) DO UPDATE SET
            total_study_minutes = educational_analytics.total_study_minutes + COALESCE(NEW.duration_minutes, 0),
            unique_nodes_studied = (
                SELECT COUNT(DISTINCT node_id) 
                FROM educational_listening_history 
                WHERE user_id = NEW.user_id 
                AND session_start::date = NEW.session_start::date
            );
        
        RETURN NEW;
    END;
    $trigger$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS trigger_update_analytics ON educational_listening_history;
    CREATE TRIGGER trigger_update_analytics
        AFTER INSERT ON educational_listening_history
        FOR EACH ROW EXECUTE FUNCTION update_user_analytics_trigger();
    
    -- Obtener estadísticas del sistema
    SELECT 
        (SELECT COUNT(*) FROM neural_nodes) as total_nodes,
        (SELECT COUNT(*) FROM user_learning_profiles) as total_users,
        (SELECT COUNT(*) FROM educational_playlists) as total_playlists,
        (SELECT COUNT(*) FROM premium_achievements) as total_achievements
    INTO stats;
    
    result := jsonb_build_object(
        'status', 'success',
        'ecosystem', 'PAES Premium Spotify-Style',
        'version', '1.0.0',
        'statistics', jsonb_build_object(
            'total_nodes', stats.total_nodes,
            'total_users', stats.total_users,
            'total_playlists', stats.total_playlists,
            'total_achievements', stats.total_achievements
        ),
        'features_enabled', jsonb_build_array(
            'daily_mix_paes',
            'discover_weekly_skills',
            'paes_radio',
            'premium_analytics',
            'educational_wrapped',
            'achievement_system',
            'collaborative_filtering',
            'content_based_recommendations',
            'real_time_personalization',
            'spotify_style_experience'
        ),
        'initialized_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SECCIÓN 13: EJECUCIÓN INICIAL
-- =====================================================

-- Ejecutar la inicialización completa del ecosistema premium
SELECT initialize_premium_ecosystem();

-- Mostrar resumen del estado del sistema
SELECT 
    'PAES PREMIUM ECOSYSTEM INICIALIZADO' as status,
    (SELECT COUNT(*) FROM neural_nodes) as total_nodes,
    (SELECT COUNT(*) FROM healthy_nodes) as healthy_nodes,
    (SELECT COUNT(*) FROM user_learning_profiles) as total_users,
    (SELECT COUNT(*) FROM educational_playlists) as total_playlists,
    (SELECT COUNT(*) FROM premium_achievements) as total_achievements,
    NOW() as timestamp;

-- =====================================================
-- COMANDOS DE MANTENIMIENTO Y USO
-- =====================================================

/*
-- COMANDOS PRINCIPALES PARA USAR EL SISTEMA:

-- 1. Crear perfil de usuario premium:
INSERT INTO user_learning_profiles (user_id, premium_tier, target_paes_score, exam_date)
VALUES ('usuario123', 'premium', 750, '2024-12-01');

-- 2. Registrar sesión de estudio:
INSERT INTO educational_listening_history (user_id, node_id, session_start, session_end, duration_minutes, completion_percentage, study_mode)
VALUES ('usuario123', 'nodo_algebra_1', NOW() - INTERVAL '1 hour', NOW(), 60, 85.5, 'focus');

-- 3. Generar Daily Mix personalizado:
SELECT generate_daily_mix_paes('usuario123');

-- 4. Generar Discover Weekly:
SELECT generate_discover_weekly_skills('usuario123');

-- 5. Crear Radio basado en un nodo:
SELECT generate_paes_radio('usuario123', 'nodo_algebra_1');

-- 6. Ejecutar orquestador premium completo:
SELECT spotify_premium_orchestrator('usuario123');

-- 7. Ver dashboard del estudiante:
SELECT * FROM premium_student_dashboard WHERE user_id = 'usuario123';

-- 8. Ver analytics institucionales:
SELECT * FROM premium_institutional_analytics;

-- 9. Verificar achievements desbloqueados:
SELECT pa.name, pa.description, ua.unlocked_at 
FROM user_achievements ua
JOIN premium_achievements pa ON ua.achievement_id = pa.id
WHERE ua.user_id = 'usuario123'
ORDER BY ua.unlocked_at DESC;

-- 10. Ver nodos saludables disponibles:
SELECT * FROM healthy_nodes LIMIT 10;
*/