-- ==================== PAES PRO ADVANCED - NEXT GENERATION DATABASE ====================
-- Esquema de base de datos completo y optimizado para máximo rendimiento

-- ==================== 1. EXTENSIONES Y CONFIGURACIÓN ====================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "ltree";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== 2. ENUMS Y TIPOS AVANZADOS ====================

-- Tipos de prueba PAES expandidos
CREATE TYPE paes_test_type AS ENUM (
    'COMPETENCIA_LECTORA',
    'MATEMATICA_M1', 
    'MATEMATICA_M2',
    'CIENCIAS',
    'HISTORIA',
    'SIMULACRO_COMPLETO'
);

-- Estados de progreso del usuario
CREATE TYPE user_progress_status AS ENUM (
    'not_started',
    'in_progress', 
    'mastered',
    'needs_review',
    'struggling'
);

-- Niveles de dificultad
CREATE TYPE difficulty_level AS ENUM ('principiante', 'intermedio', 'avanzado', 'experto');

-- Tipos de contenido educativo
CREATE TYPE content_type AS ENUM (
    'lesson',
    'exercise', 
    'quiz',
    'video',
    'article',
    'simulation',
    'interactive'
);

-- Estados de sesión de estudio
CREATE TYPE study_session_status AS ENUM ('active', 'paused', 'completed', 'abandoned');

-- Tipos de notificación
CREATE TYPE notification_type AS ENUM (
    'reminder',
    'achievement', 
    'progress_update',
    'recommendation',
    'challenge'
);

-- ==================== 3. TABLAS PRINCIPALES EXPANDIDAS ====================

-- Perfiles de usuario mejorados
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    birth_date DATE,
    region VARCHAR(100),
    school_name VARCHAR(255),
    graduation_year INTEGER,
    
    -- Objetivos académicos
    target_university VARCHAR(255),
    target_career VARCHAR(255),
    target_scores JSONB DEFAULT '{
        "competencia_lectora": 700,
        "matematica_m1": 700,
        "matematica_m2": 700,
        "historia": 700,
        "ciencias": 700
    }'::jsonb,
    
    -- Puntajes actuales
    current_scores JSONB DEFAULT '{
        "competencia_lectora": 500,
        "matematica_m1": 500,
        "matematica_m2": 500,
        "historia": 500,
        "ciencias": 500
    }'::jsonb,
    
    -- Preferencias de aprendizaje
    learning_preferences JSONB DEFAULT '{
        "study_hours_per_day": 2,
        "preferred_times": ["morning", "afternoon"],
        "learning_style": "visual",
        "difficulty_preference": "adaptive",
        "content_types": ["interactive", "video", "exercise"],
        "notification_frequency": "daily",
        "auto_plan_generation": true
    }'::jsonb,
    
    -- Configuración de la aplicación
    app_settings JSONB DEFAULT '{
        "theme": "dark",
        "language": "es-CL",
        "timezone": "America/Santiago",
        "sound_enabled": true,
        "push_notifications": true
    }'::jsonb,
    
    -- Métricas de engagement
    total_study_time_minutes INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    
    -- Timestamps
    onboarding_completed_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Nodos de aprendizaje avanzados
CREATE TABLE learning_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type paes_test_type NOT NULL,
    skill VARCHAR(100) NOT NULL,
    sub_skill VARCHAR(100),
    difficulty difficulty_level DEFAULT 'intermedio',
    
    -- Jerarquía y prerrequisitos
    parent_id UUID REFERENCES learning_nodes(id),
    prerequisites UUID[] DEFAULT '{}',
    position INTEGER DEFAULT 0,
    depth_level INTEGER DEFAULT 0,
    
    -- Contenido del nodo
    learning_objectives TEXT[],
    content_blocks JSONB DEFAULT '[]'::jsonb,
    estimated_time_minutes INTEGER DEFAULT 30,
    
    -- Métricas de desempeño
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    difficulty_rating DECIMAL(3,2) DEFAULT 0.0,
    student_feedback_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Configuración adaptativa
    adaptive_parameters JSONB DEFAULT '{
        "min_score_to_pass": 70,
        "max_attempts": 3,
        "time_multiplier": 1.0,
        "difficulty_adjustment": true
    }'::jsonb,
    
    -- Estados
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progreso del usuario expandido
CREATE TABLE user_node_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES learning_nodes(id) ON DELETE CASCADE,
    
    -- Estado del progreso
    status user_progress_status DEFAULT 'not_started',
    progress_percentage DECIMAL(5,2) DEFAULT 0.0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    mastery_level DECIMAL(5,2) DEFAULT 0.0,
    confidence_level DECIMAL(5,2) DEFAULT 0.0,
    
    -- Métricas de rendimiento
    best_score DECIMAL(5,2) DEFAULT 0.0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    attempts_count INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    
    -- Tiempo y esfuerzo
    time_spent_minutes INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    last_session_duration INTEGER DEFAULT 0,
    
    -- Análisis de errores
    common_mistakes JSONB DEFAULT '[]'::jsonb,
    error_patterns JSONB DEFAULT '[]'::jsonb,
    improvement_areas TEXT[],
    
    -- Fechas importantes
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_practiced_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ,
    
    -- Metadata
    study_notes TEXT,
    bookmarked BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, node_id)
);

-- Contenido educativo generado por IA
CREATE TABLE ai_generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id UUID REFERENCES learning_nodes(id) ON DELETE CASCADE,
    
    -- Tipo y configuración
    content_type content_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty difficulty_level DEFAULT 'intermedio',
    
    -- Personalización
    personalization_factors JSONB DEFAULT '{}'::jsonb,
    user_context JSONB DEFAULT '{}'::jsonb,
    generation_prompt TEXT,
    
    -- Metadata de IA
    ai_model VARCHAR(100) DEFAULT 'gpt-4o-mini',
    generation_parameters JSONB,
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Calidad y feedback
    quality_score DECIMAL(3,2) DEFAULT 0.0,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_feedback TEXT,
    effectiveness_score DECIMAL(3,2),
    
    -- Uso y estadísticas
    view_count INTEGER DEFAULT 0,
    interaction_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    
    -- Estados
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sesiones de estudio avanzadas
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES study_plans(id) ON DELETE SET NULL,
    
    -- Configuración de la sesión
    title VARCHAR(255),
    planned_duration_minutes INTEGER DEFAULT 60,
    actual_duration_minutes INTEGER DEFAULT 0,
    status study_session_status DEFAULT 'active',
    
    -- Contenido de la sesión
    nodes_covered UUID[],
    activities_completed JSONB DEFAULT '[]'::jsonb,
    exercises_attempted INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    
    -- Métricas de rendimiento
    average_score DECIMAL(5,2) DEFAULT 0.0,
    focus_score DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    efficiency_score DECIMAL(5,2) DEFAULT 0.0,
    
    -- Análisis comportamental
    interaction_data JSONB DEFAULT '{}'::jsonb,
    break_times INTEGER[] DEFAULT '{}',
    distraction_events INTEGER DEFAULT 0,
    
    -- Feedback y reflexión
    session_notes TEXT,
    difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    
    -- Timestamps
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    paused_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Planes de estudio adaptativos
CREATE TABLE study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Configuración del plan
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objectives TEXT[],
    target_date DATE,
    estimated_weeks INTEGER,
    
    -- Estructura del plan
    learning_path JSONB NOT NULL,
    milestones JSONB DEFAULT '[]'::jsonb,
    checkpoints JSONB DEFAULT '[]'::jsonb,
    
    -- Progreso y estado
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    completed_sessions INTEGER DEFAULT 0,
    skipped_sessions INTEGER DEFAULT 0,
    current_week INTEGER DEFAULT 1,
    
    -- Adaptaciones realizadas
    adaptations_log JSONB DEFAULT '[]'::jsonb,
    difficulty_adjustments INTEGER DEFAULT 0,
    schedule_modifications INTEGER DEFAULT 0,
    
    -- Métricas de efectividad
    adherence_rate DECIMAL(5,2) DEFAULT 0.0,
    effectiveness_score DECIMAL(5,2) DEFAULT 0.0,
    user_satisfaction DECIMAL(5,2) DEFAULT 0.0,
    
    -- Estados
    status VARCHAR(20) DEFAULT 'active',
    is_auto_generated BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sistema de evaluaciones y simulacros
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Configuración de la evaluación
    title VARCHAR(255) NOT NULL,
    test_type paes_test_type NOT NULL,
    assessment_type VARCHAR(50) DEFAULT 'practice',
    difficulty difficulty_level DEFAULT 'intermedio',
    
    -- Estructura
    total_questions INTEGER NOT NULL,
    time_limit_minutes INTEGER NOT NULL,
    passing_score DECIMAL(5,2) DEFAULT 70.0,
    
    -- Contenido
    questions JSONB NOT NULL,
    answer_key JSONB NOT NULL,
    explanations JSONB DEFAULT '{}'::jsonb,
    
    -- Configuraciones avanzadas
    is_adaptive BOOLEAN DEFAULT FALSE,
    randomize_questions BOOLEAN DEFAULT TRUE,
    allow_review BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    
    -- Métricas
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    difficulty_rating DECIMAL(3,2) DEFAULT 0.0,
    
    -- Estados
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resultados de evaluaciones detallados
CREATE TABLE assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Puntajes por área
    scores_by_subject JSONB NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    percentile_rank DECIMAL(5,2) DEFAULT 0.0,
    
    -- Estadísticas de respuesta
    correct_answers INTEGER NOT NULL,
    incorrect_answers INTEGER NOT NULL,
    unanswered INTEGER DEFAULT 0,
    flagged_questions INTEGER DEFAULT 0,
    
    -- Análisis temporal
    time_used_minutes INTEGER NOT NULL,
    time_per_question DECIMAL(5,2),
    time_distribution JSONB DEFAULT '{}'::jsonb,
    
    -- Análisis de desempeño
    skill_analysis JSONB DEFAULT '{}'::jsonb,
    difficulty_analysis JSONB DEFAULT '{}'::jsonb,
    question_analysis JSONB DEFAULT '[]'::jsonb,
    
    -- Patrones de error
    error_categories JSONB DEFAULT '{}'::jsonb,
    common_mistakes TEXT[],
    improvement_suggestions TEXT[],
    
    -- Recomendaciones personalizadas
    next_steps JSONB DEFAULT '[]'::jsonb,
    focus_areas TEXT[],
    recommended_study_time INTEGER,
    
    -- Metadata
    completion_method VARCHAR(50) DEFAULT 'normal',
    device_info JSONB DEFAULT '{}'::jsonb,
    session_quality_score DECIMAL(3,2) DEFAULT 0.0,
    
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sistema de logros y gamificación
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    
    -- Configuración del logro
    difficulty difficulty_level DEFAULT 'intermedio',
    points_reward INTEGER DEFAULT 0,
    badge_icon VARCHAR(255),
    badge_color VARCHAR(50),
    
    -- Criterios de desbloqueo
    unlock_criteria JSONB NOT NULL,
    prerequisite_achievements UUID[],
    
    -- Metadata
    rarity_level VARCHAR(50) DEFAULT 'common',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logros del usuario
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    
    -- Detalles del desbloqueo
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    points_earned INTEGER DEFAULT 0,
    unlock_context JSONB DEFAULT '{}'::jsonb,
    
    -- Estados
    is_showcased BOOLEAN DEFAULT FALSE,
    notification_sent BOOLEAN DEFAULT FALSE,
    
    UNIQUE(user_id, achievement_id)
);

-- Sistema de notificaciones inteligentes
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Configuración de la notificación
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    
    -- Contenido y acciones
    data JSONB DEFAULT '{}'::jsonb,
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Estados de entrega
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    delivery_method VARCHAR(50) DEFAULT 'in_app',
    
    -- Programación
    scheduled_for TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    -- Metadata
    campaign_id VARCHAR(100),
    source VARCHAR(100) DEFAULT 'system',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ
);

-- Analytics y métricas de usuario
CREATE TABLE user_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Período de análisis
    date DATE NOT NULL,
    week_start DATE,
    month_start DATE,
    
    -- Métricas de actividad
    sessions_count INTEGER DEFAULT 0,
    total_study_time_minutes INTEGER DEFAULT 0,
    content_items_consumed INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    
    -- Métricas de rendimiento
    average_session_score DECIMAL(5,2) DEFAULT 0.0,
    improvement_rate DECIMAL(5,2) DEFAULT 0.0,
    consistency_score DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    
    -- Distribución de tiempo por materia
    time_by_subject JSONB DEFAULT '{}'::jsonb,
    performance_by_subject JSONB DEFAULT '{}'::jsonb,
    
    -- Patrones de uso
    peak_hours INTEGER[] DEFAULT '{}',
    preferred_content_types TEXT[],
    learning_velocity DECIMAL(5,2) DEFAULT 0.0,
    
    -- Métricas sociales y motivacionales
    streak_days INTEGER DEFAULT 0,
    goals_completed INTEGER DEFAULT 0,
    milestones_reached INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- Conversaciones y chats con IA
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID DEFAULT uuid_generate_v4(),
    
    -- Mensaje
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    conversation_context JSONB DEFAULT '{}'::jsonb,
    
    -- Análisis del mensaje
    intent VARCHAR(100),
    sentiment VARCHAR(50),
    confidence_score DECIMAL(3,2) DEFAULT 0.0,
    
    -- Metadata de generación
    ai_model VARCHAR(100) DEFAULT 'gpt-4o-mini',
    response_time_ms INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    
    -- Feedback y calidad
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    was_helpful BOOLEAN,
    feedback_text TEXT,
    
    -- Seguimiento
    led_to_action BOOLEAN DEFAULT FALSE,
    follow_up_needed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== 4. ÍNDICES AVANZADOS ====================

-- Índices de rendimiento para consultas frecuentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_active ON user_profiles(last_active_at DESC) WHERE last_active_at > NOW() - INTERVAL '30 days';

-- Índices para nodos de aprendizaje
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_test_type_skill ON learning_nodes(test_type, skill);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_active ON learning_nodes(is_active) WHERE is_active = true;

-- Índices para progreso del usuario
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_progress_user_status ON user_node_progress(user_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_progress_node_id ON user_node_progress(node_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_progress_updated ON user_node_progress(last_updated DESC);

-- Índices para contenido de IA
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_user_type ON ai_generated_content(user_id, content_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_node_id ON ai_generated_content(node_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_quality ON ai_generated_content(quality_score DESC) WHERE is_active = true;

-- Índices para sesiones de estudio
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, started_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_study_sessions_status ON study_sessions(status);

-- Índices para evaluaciones
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_type_difficulty ON assessments(test_type, difficulty);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessment_results_user_date ON assessment_results(user_id, completed_at DESC);

-- Índices para analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_analytics_date ON user_analytics(user_id, date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_analytics_week ON user_analytics(week_start, user_id);

-- Índices GIN para campos JSONB
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_preferences_gin ON user_profiles USING GIN (learning_preferences);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_scores_gin ON user_profiles USING GIN (current_scores);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_content_gin ON learning_nodes USING GIN (content_blocks);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_factors_gin ON ai_generated_content USING GIN (personalization_factors);

-- ==================== 5. FUNCIONES Y TRIGGERS AVANZADOS ====================

-- Función para actualizar timestamps automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para calcular el nivel del usuario basado en XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(xp / 100)) + 1;
END;
$$ language 'plpgsql';

-- Función para actualizar estadísticas del usuario
CREATE OR REPLACE FUNCTION update_user_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar tiempo total de estudio
    UPDATE user_profiles 
    SET total_study_time_minutes = total_study_time_minutes + COALESCE(NEW.time_spent_minutes - COALESCE(OLD.time_spent_minutes, 0), NEW.time_spent_minutes),
        sessions_completed = sessions_completed + CASE WHEN NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN 1 ELSE 0 END,
        last_active_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para generar recomendaciones automáticas
CREATE OR REPLACE FUNCTION generate_automatic_recommendations(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    user_profile RECORD;
    weak_areas TEXT[];
    recommendations JSONB;
BEGIN
    -- Obtener perfil del usuario
    SELECT * INTO user_profile FROM user_profiles WHERE user_id = p_user_id;
    
    -- Identificar áreas débiles
    SELECT ARRAY_AGG(skill) INTO weak_areas
    FROM user_node_progress unp
    JOIN learning_nodes ln ON unp.node_id = ln.id
    WHERE unp.user_id = p_user_id 
    AND unp.average_score < 70
    GROUP BY ln.skill
    HAVING AVG(unp.average_score) < 70;
    
    -- Generar recomendaciones
    recommendations := jsonb_build_object(
        'focus_areas', weak_areas,
        'recommended_study_time', CASE 
            WHEN array_length(weak_areas, 1) > 3 THEN 180
            WHEN array_length(weak_areas, 1) > 1 THEN 120
            ELSE 60
        END,
        'next_assessment_date', CURRENT_DATE + INTERVAL '1 week',
        'generated_at', NOW()
    );
    
    RETURN recommendations;
END;
$$ language 'plpgsql';

-- ==================== 6. TRIGGERS ====================

-- Triggers para actualizar timestamps
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_nodes_updated_at 
    BEFORE UPDATE ON learning_nodes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_node_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar estadísticas automáticamente
CREATE TRIGGER update_user_stats_on_progress
    AFTER INSERT OR UPDATE ON user_node_progress
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_trigger();

-- ==================== 7. ROW LEVEL SECURITY (RLS) ====================

-- Habilitar RLS en todas las tablas sensibles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuarios autenticados
CREATE POLICY "Users can manage their own data" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON user_node_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own AI content" ON ai_generated_content
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own study sessions" ON study_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own study plans" ON study_plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessment results" ON assessment_results
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics" ON user_analytics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversations" ON ai_conversations
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para contenido público
ALTER TABLE learning_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learning nodes are publicly readable" ON learning_nodes
    FOR SELECT USING (is_active = true);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active assessments are publicly readable" ON assessments
    FOR SELECT USING (is_active = true);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active achievements are publicly readable" ON achievements
    FOR SELECT USING (is_active = true);

-- ==================== 8. VISTAS ÚTILES ====================

-- Vista de dashboard del usuario
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    up.user_id,
    up.full_name,
    up.current_scores,
    up.target_scores,
    up.total_study_time_minutes,
    up.current_streak_days,
    up.level,
    up.experience_points,
    
    -- Estadísticas de progreso
    COUNT(DISTINCT unp.node_id) as nodes_started,
    COUNT(DISTINCT CASE WHEN unp.status = 'mastered' THEN unp.node_id END) as nodes_mastered,
    AVG(unp.average_score) as overall_average_score,
    
    -- Actividad reciente
    MAX(unp.last_practiced_at) as last_study_session,
    COUNT(DISTINCT ss.id) as sessions_this_week
    
FROM user_profiles up
LEFT JOIN user_node_progress unp ON up.user_id = unp.user_id
LEFT JOIN study_sessions ss ON up.user_id = ss.user_id 
    AND ss.started_at >= date_trunc('week', CURRENT_DATE)
GROUP BY up.user_id, up.full_name, up.current_scores, up.target_scores, 
         up.total_study_time_minutes, up.current_streak_days, up.level, up.experience_points;

-- Vista de recomendaciones personalizadas
CREATE OR REPLACE VIEW user_recommendations AS
SELECT 
    up.user_id,
    generate_automatic_recommendations(up.user_id) as recommendations,
    NOW() as generated_at
FROM user_profiles up
WHERE up.last_active_at >= NOW() - INTERVAL '7 days';

-- ==================== 9. DATOS INICIALES EXPANDIDOS ====================

-- Insertar nodos de aprendizaje completos
INSERT INTO learning_nodes (name, description, test_type, skill, sub_skill, difficulty, learning_objectives, estimated_time_minutes, position) VALUES
-- Competencia Lectora
('Localizar información explícita', 'Identificación directa de datos en el texto', 'COMPETENCIA_LECTORA', 'Localizar', 'Información explícita', 'principiante', ARRAY['Identificar datos específicos', 'Localizar fechas y nombres', 'Encontrar definiciones'], 25, 1),
('Localizar información implícita', 'Inferir información no directamente expresada', 'COMPETENCIA_LECTORA', 'Localizar', 'Información implícita', 'intermedio', ARRAY['Hacer inferencias básicas', 'Deducir relaciones causa-efecto', 'Identificar intenciones'], 35, 2),
('Interpretar sentido global', 'Comprensión del mensaje principal del texto', 'COMPETENCIA_LECTORA', 'Interpretar', 'Sentido global', 'intermedio', ARRAY['Identificar tema central', 'Determinar propósito del autor', 'Sintetizar información'], 40, 3),
('Interpretar sentido local', 'Análisis de fragmentos específicos', 'COMPETENCIA_LECTORA', 'Interpretar', 'Sentido local', 'avanzado', ARRAY['Analizar párrafos específicos', 'Interpretar figuras retóricas', 'Comprender contexto local'], 30, 4),
('Evaluar contenido', 'Análisis crítico del contenido textual', 'COMPETENCIA_LECTORA', 'Evaluar', 'Contenido', 'avanzado', ARRAY['Evaluar veracidad', 'Analizar argumentos', 'Detectar sesgos'], 45, 5),
('Evaluar forma', 'Análisis de estructura y estilo textual', 'COMPETENCIA_LECTORA', 'Evaluar', 'Forma', 'experto', ARRAY['Analizar estructura', 'Evaluar registro lingüístico', 'Critericar recursos estilísticos'], 50, 6),

-- Matemática M1  
('Números enteros', 'Operaciones básicas con números enteros', 'MATEMATICA_M1', 'Números', 'Enteros', 'principiante', ARRAY['Sumar y restar enteros', 'Multiplicar y dividir enteros', 'Resolver problemas contextualizados'], 30, 1),
('Números racionales', 'Fracciones y decimales', 'MATEMATICA_M1', 'Números', 'Racionales', 'intermedio', ARRAY['Operar con fracciones', 'Convertir entre representaciones', 'Resolver ecuaciones con racionales'], 40, 2),
('Álgebra básica', 'Expresiones algebraicas fundamentales', 'MATEMATICA_M1', 'Álgebra', 'Básica', 'intermedio', ARRAY['Operar con expresiones', 'Factorizar expresiones simples', 'Resolver ecuaciones lineales'], 35, 3),
('Funciones lineales', 'Funciones de primer grado', 'MATEMATICA_M1', 'Funciones', 'Lineales', 'avanzado', ARRAY['Graficar funciones lineales', 'Encontrar pendiente y intercepto', 'Resolver sistemas de ecuaciones'], 45, 4),
('Geometría plana', 'Figuras geométricas bidimensionales', 'MATEMATICA_M1', 'Geometría', 'Plana', 'intermedio', ARRAY['Calcular perímetros y áreas', 'Aplicar teorema de Pitágoras', 'Resolver problemas geométricos'], 40, 5)

ON CONFLICT (name) DO NOTHING;

-- Insertar logros básicos
INSERT INTO achievements (name, description, category, difficulty, points_reward, unlock_criteria) VALUES
('Primer Paso', 'Completa tu primera lección', 'inicio', 'principiante', 50, '{"lessons_completed": 1}'),
('Racha de 3', 'Estudia 3 días consecutivos', 'consistencia', 'intermedio', 100, '{"streak_days": 3}'),
('Racha de 7', 'Estudia 7 días consecutivos', 'consistencia', 'intermedio', 200, '{"streak_days": 7}'),
('Matemático', 'Completa 10 ejercicios de matemática', 'materia', 'intermedio', 150, '{"math_exercises": 10}'),
('Lector Experto', 'Domina 5 nodos de comprensión lectora', 'materia', 'avanzado', 300, '{"reading_nodes_mastered": 5}'),
('Perfeccionista', 'Obtén 100% en una evaluación', 'rendimiento', 'avanzado', 250, '{"perfect_score": 1}'),
('Maratonista', 'Estudia por 5 horas en un día', 'dedicacion', 'experto', 400, '{"daily_study_hours": 5}')
ON CONFLICT (name) DO NOTHING;

-- ==================== 10. FINALIZACIÓN ====================

-- Crear índices estadísticos para optimización
ANALYZE user_profiles;
ANALYZE learning_nodes;
ANALYZE user_node_progress;
ANALYZE ai_generated_content;

-- Mensaje de finalización
SELECT 'PAES PRO Advanced Database Setup Completed Successfully! 🚀' as status,
       COUNT(*) as learning_nodes_created 
FROM learning_nodes 
WHERE created_at >= NOW() - INTERVAL '1 minute';
