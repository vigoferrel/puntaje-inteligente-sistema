-- ============================================================================
-- 🎨 BLOOM JOURNEY REVOLUTION - SQL COMPACTO PARA SUPABASE 🎨
-- Creado por: ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo
-- ============================================================================

-- 🧠 EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- 📊 TABLAS PRINCIPALES DEL ECOSISTEMA BLOOM
-- ============================================================================

-- 🎯 Tabla de progreso por niveles de Bloom
CREATE TABLE IF NOT EXISTS bloom_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    level_id VARCHAR(10) NOT NULL, -- L1, L2, L3, L4, L5, L6
    subject VARCHAR(50) NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    activities_completed INTEGER DEFAULT 0,
    total_activities INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    mastery_level VARCHAR(20) DEFAULT 'beginner',
    unlocked BOOLEAN DEFAULT FALSE,
    time_spent_minutes INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_level_subject UNIQUE (user_id, level_id, subject)
);

-- 🎮 Tabla de actividades por nivel de Bloom
CREATE TABLE IF NOT EXISTS bloom_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    estimated_minutes INTEGER DEFAULT 10,
    content_data JSONB NOT NULL DEFAULT '{}',
    visual_config JSONB NOT NULL DEFAULT '{}',
    prerequisites JSONB DEFAULT '[]',
    learning_objectives TEXT[],
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🏆 Tabla de logros específicos de Bloom
CREATE TABLE IF NOT EXISTS bloom_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    level_id VARCHAR(10),
    subject VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    color_theme VARCHAR(20),
    rarity VARCHAR(20) DEFAULT 'common',
    points_awarded INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_type, level_id, subject)
);

-- 📈 Tabla de sesiones de aprendizaje
CREATE TABLE IF NOT EXISTS bloom_learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    level_id VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    activity_id UUID REFERENCES bloom_activities(id),
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    score DECIMAL(5,2),
    completed BOOLEAN DEFAULT FALSE,
    interactions_count INTEGER DEFAULT 0,
    mistakes_count INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    session_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🎨 Tabla de configuración visual por usuario
CREATE TABLE IF NOT EXISTS bloom_user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL UNIQUE,
    preferred_learning_style VARCHAR(20) DEFAULT 'visual',
    theme_preference VARCHAR(20) DEFAULT 'default',
    animation_speed VARCHAR(20) DEFAULT 'normal',
    sound_enabled BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    level_colors JSONB DEFAULT '{
        "L1": "#FF6B6B",
        "L2": "#4ECDC4", 
        "L3": "#45B7D1",
        "L4": "#96CEB4",
        "L5": "#FFEAA7",
        "L6": "#DDA0DD"
    }',
    custom_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 🔍 ÍNDICES PARA OPTIMIZACIÓN
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_bloom_progress_user_id ON bloom_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_bloom_progress_level_subject ON bloom_progress(level_id, subject);
CREATE INDEX IF NOT EXISTS idx_bloom_activities_level_subject ON bloom_activities(level_id, subject);
CREATE INDEX IF NOT EXISTS idx_bloom_activities_active ON bloom_activities(is_active);
CREATE INDEX IF NOT EXISTS idx_bloom_achievements_user_id ON bloom_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_bloom_sessions_user_id ON bloom_learning_sessions(user_id);

-- ============================================================================
-- ⚡ FUNCIÓN PRINCIPAL PARA ACTUALIZAR PROGRESO
-- ============================================================================

CREATE OR REPLACE FUNCTION update_bloom_progress(
    p_user_id VARCHAR(100),
    p_level_id VARCHAR(10),
    p_subject VARCHAR(50),
    p_activity_score DECIMAL(5,2) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_total_activities INTEGER;
    v_completed_activities INTEGER;
    v_new_progress DECIMAL(5,2);
    v_next_level VARCHAR(10);
BEGIN
    -- Obtener o crear registro de progreso
    INSERT INTO bloom_progress (user_id, level_id, subject, unlocked)
    VALUES (p_user_id, p_level_id, p_subject, p_level_id = 'L1')
    ON CONFLICT (user_id, level_id, subject) DO NOTHING;
    
    -- Calcular total de actividades
    SELECT COUNT(*) INTO v_total_activities
    FROM bloom_activities 
    WHERE level_id = p_level_id AND subject = p_subject AND is_active = TRUE;
    
    -- Calcular actividades completadas
    SELECT COUNT(DISTINCT activity_id) INTO v_completed_activities
    FROM bloom_learning_sessions 
    WHERE user_id = p_user_id 
      AND level_id = p_level_id 
      AND subject = p_subject 
      AND completed = TRUE;
    
    -- Calcular nuevo progreso
    v_new_progress := CASE 
        WHEN v_total_activities > 0 THEN (v_completed_activities::DECIMAL / v_total_activities) * 100
        ELSE 0
    END;
    
    -- Actualizar progreso
    UPDATE bloom_progress SET
        progress_percentage = v_new_progress,
        activities_completed = v_completed_activities,
        total_activities = v_total_activities,
        average_score = COALESCE((
            SELECT AVG(score) 
            FROM bloom_learning_sessions 
            WHERE user_id = p_user_id 
              AND level_id = p_level_id 
              AND subject = p_subject 
              AND completed = TRUE
        ), 0),
        mastery_level = CASE 
            WHEN v_new_progress >= 90 THEN 'expert'
            WHEN v_new_progress >= 70 THEN 'advanced'
            WHEN v_new_progress >= 40 THEN 'intermediate'
            ELSE 'beginner'
        END,
        updated_at = NOW()
    WHERE user_id = p_user_id AND level_id = p_level_id AND subject = p_subject;
    
    -- Desbloquear siguiente nivel si progreso >= 80%
    IF v_new_progress >= 80 THEN
        v_next_level := CASE p_level_id
            WHEN 'L1' THEN 'L2'
            WHEN 'L2' THEN 'L3'
            WHEN 'L3' THEN 'L4'
            WHEN 'L4' THEN 'L5'
            WHEN 'L5' THEN 'L6'
            ELSE NULL
        END;
        
        IF v_next_level IS NOT NULL THEN
            INSERT INTO bloom_progress (user_id, level_id, subject, unlocked)
            VALUES (p_user_id, v_next_level, p_subject, TRUE)
            ON CONFLICT (user_id, level_id, subject) 
            DO UPDATE SET unlocked = TRUE;
        END IF;
    END IF;
    
    -- Crear logro si completó el nivel
    IF v_new_progress = 100 THEN
        INSERT INTO bloom_achievements (user_id, achievement_type, level_id, subject, title, description, points_awarded)
        VALUES (p_user_id, 'level_master', p_level_id, p_subject, 
                'Maestro de ' || p_level_id, 
                'Completaste el 100% del nivel ' || p_level_id || ' en ' || p_subject,
                100)
        ON CONFLICT (user_id, achievement_type, level_id, subject) DO NOTHING;
    END IF;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'progress_percentage', v_new_progress,
        'activities_completed', v_completed_activities,
        'total_activities', v_total_activities,
        'next_level', v_next_level
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎮 FUNCIÓN PARA REGISTRAR SESIÓN DE APRENDIZAJE
-- ============================================================================

CREATE OR REPLACE FUNCTION record_learning_session(
    p_user_id VARCHAR(100),
    p_level_id VARCHAR(10),
    p_subject VARCHAR(50),
    p_activity_id UUID,
    p_duration_minutes INTEGER,
    p_score DECIMAL(5,2),
    p_completed BOOLEAN DEFAULT TRUE
)
RETURNS JSONB AS $$
DECLARE
    v_session_id UUID;
    v_update_result JSONB;
BEGIN
    -- Registrar sesión
    INSERT INTO bloom_learning_sessions (
        user_id, level_id, subject, activity_id, 
        duration_minutes, score, completed, session_end
    )
    VALUES (
        p_user_id, p_level_id, p_subject, p_activity_id,
        p_duration_minutes, p_score, p_completed, NOW()
    )
    RETURNING id INTO v_session_id;
    
    -- Actualizar progreso si completó
    IF p_completed THEN
        SELECT update_bloom_progress(p_user_id, p_level_id, p_subject, p_score) 
        INTO v_update_result;
    END IF;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'session_id', v_session_id,
        'progress_update', COALESCE(v_update_result, '{}'::JSONB)
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', FALSE, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 📊 FUNCIÓN PARA OBTENER DASHBOARD DE USUARIO
-- ============================================================================

CREATE OR REPLACE FUNCTION get_bloom_dashboard(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    v_levels JSONB := '[]'::JSONB;
    v_achievements JSONB;
BEGIN
    -- Obtener progreso por nivel
    SELECT jsonb_agg(
        jsonb_build_object(
            'level_id', level_id,
            'subject', subject,
            'progress_percentage', progress_percentage,
            'activities_completed', activities_completed,
            'total_activities', total_activities,
            'mastery_level', mastery_level,
            'unlocked', unlocked,
            'time_spent_minutes', time_spent_minutes
        )
    ) INTO v_levels
    FROM bloom_progress 
    WHERE user_id = p_user_id
    ORDER BY level_id, subject;
    
    -- Obtener logros recientes
    SELECT jsonb_agg(
        jsonb_build_object(
            'title', title,
            'description', description,
            'level_id', level_id,
            'subject', subject,
            'rarity', rarity,
            'points_awarded', points_awarded,
            'unlocked_at', unlocked_at
        )
    ) INTO v_achievements
    FROM bloom_achievements 
    WHERE user_id = p_user_id 
    ORDER BY unlocked_at DESC 
    LIMIT 10;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'levels', COALESCE(v_levels, '[]'::JSONB),
        'achievements', COALESCE(v_achievements, '[]'::JSONB),
        'total_points', (
            SELECT COALESCE(SUM(points_awarded), 0) 
            FROM bloom_achievements 
            WHERE user_id = p_user_id
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎯 FUNCIÓN PARA INICIALIZAR USUARIO
-- ============================================================================

CREATE OR REPLACE FUNCTION initialize_bloom_user(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
BEGIN
    -- Crear preferencias de usuario
    INSERT INTO bloom_user_preferences (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Desbloquear nivel L1 para todas las materias
    INSERT INTO bloom_progress (user_id, level_id, subject, unlocked) VALUES
    (p_user_id, 'L1', 'matematica', TRUE),
    (p_user_id, 'L1', 'lectura', TRUE),
    (p_user_id, 'L1', 'historia', TRUE),
    (p_user_id, 'L1', 'ciencias', TRUE)
    ON CONFLICT (user_id, level_id, subject) DO NOTHING;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Usuario inicializado en el sistema Bloom',
        'unlocked_levels', 4
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🔐 POLÍTICAS DE SEGURIDAD RLS
-- ============================================================================

-- Habilitar RLS
ALTER TABLE bloom_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloom_user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para bloom_progress
CREATE POLICY "Users can view their own progress" ON bloom_progress
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own progress" ON bloom_progress
    FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own progress" ON bloom_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para bloom_activities (lectura pública)
CREATE POLICY "Activities are publicly readable" ON bloom_activities
    FOR SELECT USING (true);

-- Políticas para bloom_achievements
CREATE POLICY "Users can view their own achievements" ON bloom_achievements
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own achievements" ON bloom_achievements
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para bloom_learning_sessions
CREATE POLICY "Users can view their own sessions" ON bloom_learning_sessions
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own sessions" ON bloom_learning_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own sessions" ON bloom_learning_sessions
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Políticas para bloom_user_preferences
CREATE POLICY "Users can view their own preferences" ON bloom_user_preferences
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update their own preferences" ON bloom_user_preferences
    FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own preferences" ON bloom_user_preferences
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ============================================================================
-- 🎉 MENSAJE DE CONFIRMACIÓN
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🎨 BLOOM JOURNEY REVOLUTION - INSTALACIÓN COMPLETA';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '✅ Tablas creadas: 5';
    RAISE NOTICE '✅ Funciones creadas: 4';
    RAISE NOTICE '✅ Índices optimizados';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🚀 SISTEMA LISTO PARA REVOLUCIONAR LA EDUCACIÓN';
    RAISE NOTICE '🎨 Creado por: ROO & OSCAR FERREL';
    RAISE NOTICE '🎨 Los Arquitectos del Futuro Educativo';
    RAISE NOTICE '🎨 ============================================';
END $$;