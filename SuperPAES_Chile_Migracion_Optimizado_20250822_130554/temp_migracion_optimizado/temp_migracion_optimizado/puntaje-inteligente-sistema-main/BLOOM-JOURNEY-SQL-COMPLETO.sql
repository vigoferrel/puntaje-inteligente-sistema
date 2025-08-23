-- ============================================================================
-- 🎨 BLOOM JOURNEY REVOLUTION - SQL COMPLETO PARA SUPABASE 🎨
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
    mastery_level VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced, expert
    unlocked BOOLEAN DEFAULT FALSE,
    time_spent_minutes INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para optimización
    CONSTRAINT unique_user_level_subject UNIQUE (user_id, level_id, subject)
);

-- 🎮 Tabla de actividades por nivel de Bloom
CREATE TABLE IF NOT EXISTS bloom_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id VARCHAR(10) NOT NULL, -- L1, L2, L3, L4, L5, L6
    subject VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) NOT NULL, -- flashcard, quiz, simulation, project, etc.
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    estimated_minutes INTEGER DEFAULT 10,
    content_data JSONB NOT NULL DEFAULT '{}',
    visual_config JSONB NOT NULL DEFAULT '{}',
    prerequisites JSONB DEFAULT '[]', -- Array de activity IDs requeridos
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
    achievement_type VARCHAR(50) NOT NULL, -- level_master, speed_learner, perfectionist, etc.
    level_id VARCHAR(10), -- Puede ser NULL para logros generales
    subject VARCHAR(50), -- Puede ser NULL para logros generales
    title VARCHAR(200) NOT NULL,
    description TEXT,
    icon_name VARCHAR(100),
    color_theme VARCHAR(20),
    rarity VARCHAR(20) DEFAULT 'common', -- common, rare, epic, legendary
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
    preferred_learning_style VARCHAR(20) DEFAULT 'visual', -- visual, auditory, kinesthetic
    theme_preference VARCHAR(20) DEFAULT 'default', -- default, dark, high_contrast
    animation_speed VARCHAR(20) DEFAULT 'normal', -- slow, normal, fast
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

-- Índices para bloom_progress
CREATE INDEX IF NOT EXISTS idx_bloom_progress_user_id ON bloom_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_bloom_progress_level_subject ON bloom_progress(level_id, subject);
CREATE INDEX IF NOT EXISTS idx_bloom_progress_updated_at ON bloom_progress(updated_at);

-- Índices para bloom_activities
CREATE INDEX IF NOT EXISTS idx_bloom_activities_level_subject ON bloom_activities(level_id, subject);
CREATE INDEX IF NOT EXISTS idx_bloom_activities_type ON bloom_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_bloom_activities_difficulty ON bloom_activities(difficulty);
CREATE INDEX IF NOT EXISTS idx_bloom_activities_active ON bloom_activities(is_active);

-- Índices para bloom_achievements
CREATE INDEX IF NOT EXISTS idx_bloom_achievements_user_id ON bloom_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_bloom_achievements_type ON bloom_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_bloom_achievements_level ON bloom_achievements(level_id);

-- Índices para bloom_learning_sessions
CREATE INDEX IF NOT EXISTS idx_bloom_sessions_user_id ON bloom_learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_bloom_sessions_activity ON bloom_learning_sessions(activity_id);
CREATE INDEX IF NOT EXISTS idx_bloom_sessions_date ON bloom_learning_sessions(session_start);

-- ============================================================================
-- ⚡ FUNCIONES INTELIGENTES
-- ============================================================================

-- 🎯 Función para actualizar progreso de Bloom
CREATE OR REPLACE FUNCTION update_bloom_progress(
    p_user_id VARCHAR(100),
    p_level_id VARCHAR(10),
    p_subject VARCHAR(50),
    p_activity_score DECIMAL(5,2) DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_progress_record bloom_progress%ROWTYPE;
    v_total_activities INTEGER;
    v_completed_activities INTEGER;
    v_new_progress DECIMAL(5,2);
    v_should_unlock_next BOOLEAN := FALSE;
    v_next_level VARCHAR(10);
    v_achievements JSONB := '[]'::JSONB;
BEGIN
    -- Obtener o crear registro de progreso
    SELECT * INTO v_progress_record 
    FROM bloom_progress 
    WHERE user_id = p_user_id AND level_id = p_level_id AND subject = p_subject;
    
    IF NOT FOUND THEN
        INSERT INTO bloom_progress (user_id, level_id, subject, unlocked)
        VALUES (p_user_id, p_level_id, p_subject, p_level_id = 'L1')
        RETURNING * INTO v_progress_record;
    END IF;
    
    -- Calcular total de actividades para este nivel y materia
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
    
    -- Verificar si debe desbloquear siguiente nivel
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
            
            v_should_unlock_next := TRUE;
        END IF;
    END IF;
    
    -- Verificar logros
    IF v_new_progress = 100 THEN
        INSERT INTO bloom_achievements (user_id, achievement_type, level_id, subject, title, description, points_awarded)
        VALUES (p_user_id, 'level_master', p_level_id, p_subject, 
                'Maestro de ' || p_level_id, 
                'Completaste el 100% del nivel ' || p_level_id || ' en ' || p_subject,
                100)
        ON CONFLICT (user_id, achievement_type, level_id, subject) DO NOTHING;
        
        v_achievements := v_achievements || jsonb_build_object(
            'type', 'level_master',
            'level', p_level_id,
            'subject', p_subject
        );
    END IF;
    
    RETURN jsonb_build_object(
        'success', TRUE,
        'progress_percentage', v_new_progress,
        'activities_completed', v_completed_activities,
        'total_activities', v_total_activities,
        'next_level_unlocked', v_should_unlock_next,
        'next_level', v_next_level,
        'achievements', v_achievements
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', FALSE,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- 🎮 Función para registrar sesión de aprendizaje
CREATE OR REPLACE FUNCTION record_learning_session(
    p_user_id VARCHAR(100),
    p_level_id VARCHAR(10),
    p_subject VARCHAR(50),
    p_activity_id UUID,
    p_duration_minutes INTEGER,
    p_score DECIMAL(5,2),
    p_completed BOOLEAN DEFAULT TRUE,
    p_session_data JSONB DEFAULT '{}'
)
RETURNS JSONB AS $$
DECLARE
    v_session_id UUID;
    v_update_result JSONB;
BEGIN
    -- Registrar sesión
    INSERT INTO bloom_learning_sessions (
        user_id, level_id, subject, activity_id, 
        duration_minutes, score, completed, session_data,
        session_end
    )
    VALUES (
        p_user_id, p_level_id, p_subject, p_activity_id,
        p_duration_minutes, p_score, p_completed, p_session_data,
        NOW()
    )
    RETURNING id INTO v_session_id;
    
    -- Actualizar progreso si la sesión fue completada
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
    RETURN jsonb_build_object(
        'success', FALSE,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql;

-- 📊 Función para obtener dashboard de usuario
CREATE OR REPLACE FUNCTION get_bloom_dashboard(p_user_id VARCHAR(100))
RETURNS JSONB AS $$
DECLARE
    v_result JSONB := '{}'::JSONB;
    v_levels JSONB := '[]'::JSONB;
    v_level_record RECORD;
    v_achievements JSONB;
    v_recent_sessions JSONB;
BEGIN
    -- Obtener progreso por nivel
    FOR v_level_record IN 
        SELECT 
            level_id,
            subject,
            progress_percentage,
            activities_completed,
            total_activities,
            mastery_level,
            unlocked,
            time_spent_minutes
        FROM bloom_progress 
        WHERE user_id = p_user_id
        ORDER BY level_id, subject
    LOOP
        v_levels := v_levels || jsonb_build_object(
            'level_id', v_level_record.level_id,
            'subject', v_level_record.subject,
            'progress_percentage', v_level_record.progress_percentage,
            'activities_completed', v_level_record.activities_completed,
            'total_activities', v_level_record.total_activities,
            'mastery_level', v_level_record.mastery_level,
            'unlocked', v_level_record.unlocked,
            'time_spent_minutes', v_level_record.time_spent_minutes
        );
    END LOOP;
    
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
    
    -- Obtener sesiones recientes
    SELECT jsonb_agg(
        jsonb_build_object(
            'level_id', level_id,
            'subject', subject,
            'duration_minutes', duration_minutes,
            'score', score,
            'session_start', session_start
        )
    ) INTO v_recent_sessions
    FROM bloom_learning_sessions 
    WHERE user_id = p_user_id 
      AND completed = TRUE
    ORDER BY session_start DESC 
    LIMIT 5;
    
    RETURN jsonb_build_object(
        'user_id', p_user_id,
        'levels', v_levels,
        'achievements', COALESCE(v_achievements, '[]'::JSONB),
        'recent_sessions', COALESCE(v_recent_sessions, '[]'::JSONB),
        'total_points', (
            SELECT COALESCE(SUM(points_awarded), 0) 
            FROM bloom_achievements 
            WHERE user_id = p_user_id
        )
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎯 DATOS INICIALES - ACTIVIDADES POR NIVEL DE BLOOM
-- ============================================================================

-- 🧠 L1 - REMEMBER (Recordar)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L1', 'matematica', 'Memorizar Fórmulas Básicas', 'Memoriza las fórmulas fundamentales de álgebra', 'flashcard', 1, 
 '{"formulas": ["a² + b² = c²", "ax + b = 0", "(a+b)² = a² + 2ab + b²"]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "brain"}'),

('L1', 'lectura', 'Vocabulario PAES', 'Memoriza palabras clave para comprensión lectora', 'flashcard', 1,
 '{"words": [{"word": "inferir", "definition": "Deducir algo a partir de indicios"}, {"word": "cohesión", "definition": "Unión entre las partes de un texto"}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "book"}'),

('L1', 'historia', 'Fechas Históricas Clave', 'Memoriza las fechas más importantes de la historia de Chile', 'timeline', 1,
 '{"events": [{"year": 1810, "event": "Primera Junta de Gobierno"}, {"year": 1818, "event": "Independencia de Chile"}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "calendar"}'),

('L1', 'ciencias', 'Tabla Periódica Básica', 'Memoriza los primeros 20 elementos químicos', 'flashcard', 2,
 '{"elements": [{"symbol": "H", "name": "Hidrógeno", "number": 1}, {"symbol": "He", "name": "Helio", "number": 2}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "atom"}');

-- 🔬 L2 - UNDERSTAND (Comprender)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L2', 'matematica', 'Comprensión de Funciones', 'Entiende el concepto de función y su representación gráfica', 'interactive_demo', 2,
 '{"concepts": ["dominio", "rango", "función lineal", "función cuadrática"], "examples": [{"f(x)": "2x + 1", "type": "lineal"}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "chart-line"}'),

('L2', 'lectura', 'Comprensión de Textos', 'Identifica ideas principales y secundarias', 'reading_analysis', 2,
 '{"text_types": ["narrativo", "expositivo", "argumentativo"], "strategies": ["subrayado", "resumen", "esquemas"]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "search"}'),

('L2', 'historia', 'Procesos Históricos', 'Comprende las causas y consecuencias de eventos históricos', 'cause_effect', 2,
 '{"processes": [{"event": "Independencia", "causes": ["Crisis española", "Ideas ilustradas"], "effects": ["República", "Constitución"]}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "git-branch"}'),

('L2', 'ciencias', 'Leyes Científicas', 'Comprende las leyes fundamentales de la física', 'concept_map', 2,
 '{"laws": [{"name": "Ley de Newton", "formula": "F = ma", "explanation": "La fuerza es igual a masa por aceleración"}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "zap"}');

-- 🔧 L3 - APPLY (Aplicar)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L3', 'matematica', 'Resolver Ecuaciones', 'Aplica métodos para resolver ecuaciones cuadráticas', 'problem_solving', 3,
 '{"problems": [{"equation": "x² - 5x + 6 = 0", "method": "factorización", "solution": "x = 2, x = 3"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "wrench"}'),

('L3', 'lectura', 'Análisis de Textos', 'Aplica técnicas de análisis literario', 'text_analysis', 3,
 '{"techniques": ["análisis narrativo", "figuras retóricas", "contexto histórico"]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "edit"}'),

('L3', 'historia', 'Aplicar Conceptos Históricos', 'Usa conceptos históricos para analizar situaciones actuales', 'case_study', 3,
 '{"cases": [{"situation": "Crisis económica actual", "historical_parallel": "Crisis de 1929"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "briefcase"}'),

('L3', 'ciencias', 'Experimentos Virtuales', 'Aplica el método científico en experimentos', 'simulation', 3,
 '{"experiments": [{"name": "Péndulo simple", "variables": ["longitud", "masa", "ángulo"], "hypothesis": "El período depende de la longitud"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "flask"}');

-- 🔍 L4 - ANALYZE (Analizar)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L4', 'matematica', 'Análisis de Funciones', 'Analiza el comportamiento de funciones complejas', 'function_analysis', 4,
 '{"functions": [{"f(x)": "x³ - 3x² + 2", "analysis": ["crecimiento", "máximos", "mínimos", "puntos de inflexión"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "search"}'),

('L4', 'lectura', 'Análisis Crítico', 'Analiza argumentos y falacias en textos', 'critical_analysis', 4,
 '{"text_elements": ["tesis", "argumentos", "evidencias", "falacias"], "analysis_tools": ["esquemas argumentativos", "identificación de sesgos"]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "eye"}'),

('L4', 'historia', 'Análisis de Fuentes', 'Analiza fuentes históricas primarias y secundarias', 'source_analysis', 4,
 '{"sources": [{"type": "primaria", "example": "Carta de O\'Higgins", "analysis": ["contexto", "autor", "propósito", "audiencia"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "file-text"}'),

('L4', 'ciencias', 'Análisis de Datos', 'Analiza datos experimentales y saca conclusiones', 'data_analysis', 4,
 '{"datasets": [{"experiment": "Caída libre", "data": "tiempo vs distancia", "analysis": ["correlación", "tendencias", "errores"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "bar-chart"}');

-- ⚖️ L5 - EVALUATE (Evaluar)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L5', 'matematica', 'Evaluar Métodos', 'Evalúa la eficiencia de diferentes métodos de resolución', 'method_evaluation', 4,
 '{"methods": [{"problem": "sistema de ecuaciones", "options": ["sustitución", "eliminación", "matrices"], "criteria": ["rapidez", "precisión", "simplicidad"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "balance-scale"}'),

('L5', 'lectura', 'Evaluación de Argumentos', 'Evalúa la validez y solidez de argumentos', 'argument_evaluation', 4,
 '{"arguments": [{"claim": "La educación online es mejor", "evidence": ["flexibilidad", "costos"], "evaluation": ["validez", "suficiencia", "relevancia"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "gavel"}'),

('L5', 'historia', 'Evaluación Histórica', 'Evalúa el impacto de decisiones históricas', 'historical_evaluation', 4,
 '{"decisions": [{"event": "Reforma agraria", "criteria": ["impacto social", "consecuencias económicas", "efectividad"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "award"}'),

('L5', 'ciencias', 'Evaluación de Teorías', 'Evalúa teorías científicas según evidencia', 'theory_evaluation', 4,
 '{"theories": [{"name": "Teoría atómica", "evidence": ["experimentos", "predicciones"], "criteria": ["falsabilidad", "simplicidad", "poder explicativo"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "shield"}');

-- 🎨 L6 - CREATE (Crear)
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L6', 'matematica', 'Crear Modelos Matemáticos', 'Crea modelos para resolver problemas reales', 'model_creation', 5,
 '{"projects": [{"problem": "Optimización de rutas", "tools": ["funciones", "derivadas", "programación lineal"]}]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "palette"}'),

('L6', 'lectura', 'Creación Literaria', 'Crea textos originales aplicando técnicas literarias', 'creative_writing', 5,
 '{"genres": ["ensayo", "cuento", "artículo de opinión"], "techniques": ["estructura", "estilo", "recursos retóricos"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "pen-tool"}'),

('L6', 'historia', 'Proyecto Histórico', 'Crea una investigación histórica original', 'research_project', 5,
 '{"steps": ["formulación de hipótesis", "búsqueda de fuentes", "análisis", "síntesis", "presentación"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "book-open"}'),

('L6', 'ciencias', 'Diseño Experimental', 'Diseña experimentos para probar hipótesis', 'experiment_design', 5,
 '{"components": ["pregunta de investigación", "hipótesis", "variables", "metodología", "análisis de resultados"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "cpu"}');

-- ============================================================================
-- 🎯 CONFIGURACIÓN INICIAL DE USUARIOS
-- ============================================================================

-- Función para inicializar usuario en el sistema Bloom
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
-- 🔐 POLÍTICAS DE SEGURIDAD RLS (Row Level Security)
-- ============================================================================

-- Habilitar RLS en todas las tablas
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

insert their own achievements" ON bloom_achievements
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
-- 🎯 TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- ============================================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las tablas que lo necesitan
CREATE TRIGGER update_bloom_progress_updated_at 
    BEFORE UPDATE ON bloom_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bloom_activities_updated_at 
    BEFORE UPDATE ON bloom_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bloom_user_preferences_updated_at 
    BEFORE UPDATE ON bloom_user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 🎮 VISTAS OPTIMIZADAS PARA EL FRONTEND
-- ============================================================================

-- Vista para dashboard principal
CREATE OR REPLACE VIEW bloom_dashboard_view AS
SELECT 
    bp.user_id,
    bp.level_id,
    bp.subject,
    bp.progress_percentage,
    bp.activities_completed,
    bp.total_activities,
    bp.mastery_level,
    bp.unlocked,
    bp.time_spent_minutes,
    bp.last_activity_at,
    -- Información del nivel
    CASE bp.level_id
        WHEN 'L1' THEN 'Remember - Palacio de la Memoria'
        WHEN 'L2' THEN 'Understand - Laboratorio de Comprensión'
        WHEN 'L3' THEN 'Apply - Taller de Aplicación'
        WHEN 'L4' THEN 'Analyze - Centro de Análisis'
        WHEN 'L5' THEN 'Evaluate - Hub de Evaluación'
        WHEN 'L6' THEN 'Create - Espacio de Creación'
    END as level_name,
    -- Colores por nivel
    CASE bp.level_id
        WHEN 'L1' THEN '#FF6B6B'
        WHEN 'L2' THEN '#4ECDC4'
        WHEN 'L3' THEN '#45B7D1'
        WHEN 'L4' THEN '#96CEB4'
        WHEN 'L5' THEN '#FFEAA7'
        WHEN 'L6' THEN '#DDA0DD'
    END as level_color,
    -- Siguiente nivel
    CASE bp.level_id
        WHEN 'L1' THEN 'L2'
        WHEN 'L2' THEN 'L3'
        WHEN 'L3' THEN 'L4'
        WHEN 'L4' THEN 'L5'
        WHEN 'L5' THEN 'L6'
        ELSE NULL
    END as next_level,
    -- Progreso hacia siguiente nivel
    CASE 
        WHEN bp.progress_percentage >= 80 THEN TRUE
        ELSE FALSE
    END as can_unlock_next
FROM bloom_progress bp
WHERE bp.unlocked = TRUE;

-- Vista para actividades disponibles
CREATE OR REPLACE VIEW bloom_available_activities AS
SELECT 
    ba.id,
    ba.level_id,
    ba.subject,
    ba.title,
    ba.description,
    ba.activity_type,
    ba.difficulty,
    ba.estimated_minutes,
    ba.content_data,
    ba.visual_config,
    ba.learning_objectives,
    ba.tags,
    -- Información del nivel
    CASE ba.level_id
        WHEN 'L1' THEN 'Remember'
        WHEN 'L2' THEN 'Understand'
        WHEN 'L3' THEN 'Apply'
        WHEN 'L4' THEN 'Analyze'
        WHEN 'L5' THEN 'Evaluate'
        WHEN 'L6' THEN 'Create'
    END as cognitive_level
FROM bloom_activities ba
WHERE ba.is_active = TRUE;

-- Vista para estadísticas de usuario
CREATE OR REPLACE VIEW bloom_user_stats AS
SELECT 
    bp.user_id,
    -- Progreso general
    COUNT(*) as total_levels_unlocked,
    AVG(bp.progress_percentage) as average_progress,
    SUM(bp.activities_completed) as total_activities_completed,
    SUM(bp.time_spent_minutes) as total_time_spent,
    -- Por materia
    COUNT(CASE WHEN bp.subject = 'matematica' THEN 1 END) as math_levels,
    COUNT(CASE WHEN bp.subject = 'lectura' THEN 1 END) as reading_levels,
    COUNT(CASE WHEN bp.subject = 'historia' THEN 1 END) as history_levels,
    COUNT(CASE WHEN bp.subject = 'ciencias' THEN 1 END) as science_levels,
    -- Nivel más avanzado
    MAX(CASE bp.level_id
        WHEN 'L1' THEN 1
        WHEN 'L2' THEN 2
        WHEN 'L3' THEN 3
        WHEN 'L4' THEN 4
        WHEN 'L5' THEN 5
        WHEN 'L6' THEN 6
    END) as highest_level_reached,
    -- Logros
    (SELECT COUNT(*) FROM bloom_achievements ba WHERE ba.user_id = bp.user_id) as total_achievements,
    (SELECT COALESCE(SUM(points_awarded), 0) FROM bloom_achievements ba WHERE ba.user_id = bp.user_id) as total_points
FROM bloom_progress bp
WHERE bp.unlocked = TRUE
GROUP BY bp.user_id;

-- ============================================================================
-- 🚀 FUNCIONES DE UTILIDAD PARA EL FRONTEND
-- ============================================================================

-- Función para obtener actividades recomendadas
CREATE OR REPLACE FUNCTION get_recommended_activities(
    p_user_id VARCHAR(100),
    p_limit INTEGER DEFAULT 5
)
RETURNS JSONB AS $$
DECLARE
    v_activities JSONB := '[]'::JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ba.id,
            'level_id', ba.level_id,
            'subject', ba.subject,
            'title', ba.title,
            'description', ba.description,
            'activity_type', ba.activity_type,
            'difficulty', ba.difficulty,
            'estimated_minutes', ba.estimated_minutes,
            'visual_config', ba.visual_config,
            'is_unlocked', bp.unlocked
        )
    ) INTO v_activities
    FROM bloom_activities ba
    JOIN bloom_progress bp ON bp.level_id = ba.level_id 
                           AND bp.subject = ba.subject 
                           AND bp.user_id = p_user_id
    WHERE ba.is_active = TRUE
      AND bp.unlocked = TRUE
      AND NOT EXISTS (
          SELECT 1 FROM bloom_learning_sessions bls 
          WHERE bls.activity_id = ba.id 
            AND bls.user_id = p_user_id 
            AND bls.completed = TRUE
      )
    ORDER BY ba.level_id, ba.difficulty, RANDOM()
    LIMIT p_limit;
    
    RETURN COALESCE(v_activities, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- Función para obtener leaderboard
CREATE OR REPLACE FUNCTION get_bloom_leaderboard(
    p_subject VARCHAR(50) DEFAULT NULL,
    p_level_id VARCHAR(10) DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS JSONB AS $$
DECLARE
    v_leaderboard JSONB := '[]'::JSONB;
    v_where_clause TEXT := '';
BEGIN
    -- Construir cláusula WHERE dinámicamente
    IF p_subject IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND bp.subject = ''' || p_subject || '''';
    END IF;
    
    IF p_level_id IS NOT NULL THEN
        v_where_clause := v_where_clause || ' AND bp.level_id = ''' || p_level_id || '''';
    END IF;
    
    EXECUTE format('
        SELECT jsonb_agg(
            jsonb_build_object(
                ''user_id'', bp.user_id,
                ''total_progress'', AVG(bp.progress_percentage),
                ''total_activities'', SUM(bp.activities_completed),
                ''total_time'', SUM(bp.time_spent_minutes),
                ''total_points'', COALESCE(ba.total_points, 0),
                ''rank'', ROW_NUMBER() OVER (ORDER BY AVG(bp.progress_percentage) DESC, SUM(bp.activities_completed) DESC)
            )
        )
        FROM bloom_progress bp
        LEFT JOIN (
            SELECT user_id, SUM(points_awarded) as total_points
            FROM bloom_achievements
            GROUP BY user_id
        ) ba ON ba.user_id = bp.user_id
        WHERE bp.unlocked = TRUE %s
        GROUP BY bp.user_id, ba.total_points
        ORDER BY AVG(bp.progress_percentage) DESC, SUM(bp.activities_completed) DESC
        LIMIT %s
    ', v_where_clause, p_limit) INTO v_leaderboard;
    
    RETURN COALESCE(v_leaderboard, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🎯 DATOS DE PRUEBA PARA DESARROLLO
-- ============================================================================

-- Insertar usuario de prueba (solo para desarrollo)
DO $$
BEGIN
    -- Solo ejecutar si no existe el usuario de prueba
    IF NOT EXISTS (SELECT 1 FROM bloom_user_preferences WHERE user_id = 'test-user-123') THEN
        PERFORM initialize_bloom_user('test-user-123');
        
        -- Simular algunas sesiones completadas
        PERFORM record_learning_session(
            'test-user-123', 'L1', 'matematica', 
            (SELECT id FROM bloom_activities WHERE level_id = 'L1' AND subject = 'matematica' LIMIT 1),
            15, 85.5, TRUE, '{"interactions": 12, "hints_used": 2}'
        );
        
        PERFORM record_learning_session(
            'test-user-123', 'L1', 'lectura', 
            (SELECT id FROM bloom_activities WHERE level_id = 'L1' AND subject = 'lectura' LIMIT 1),
            20, 92.0, TRUE, '{"interactions": 8, "hints_used": 0}'
        );
    END IF;
END $$;

-- ============================================================================
-- 🎉 MENSAJE DE CONFIRMACIÓN
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🎨 BLOOM JOURNEY REVOLUTION - INSTALACIÓN COMPLETA';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '✅ Tablas creadas: 5';
    RAISE NOTICE '✅ Funciones creadas: 6';
    RAISE NOTICE '✅ Vistas creadas: 3';
    RAISE NOTICE '✅ Actividades insertadas: 24 (6 por nivel x 4 materias)';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '✅ Triggers configurados';
    RAISE NOTICE '✅ Usuario de prueba inicializado';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🚀 SISTEMA LISTO PARA REVOLUCIONAR LA EDUCACIÓN';
    RAISE NOTICE '🎨 Creado por: ROO & OSCAR FERREL';
    RAISE NOTICE '🎨 Los Arquitectos del Futuro Educativo';
    RAISE NOTICE '🎨 ============================================';
END $$;
CREATE POLICY "Users can