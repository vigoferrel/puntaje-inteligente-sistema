-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS - SISTEMA EDUCATIVO PAES
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABLAS PRINCIPALES DEL SISTEMA EDUCATIVO
-- =====================================================

-- Tabla de asignaturas PAES oficiales
CREATE TABLE IF NOT EXISTS paes_subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT true,
    weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de niveles de taxonomía Bloom
CREATE TABLE IF NOT EXISTS bloom_levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    level_order INTEGER NOT NULL,
    action_verbs TEXT[],
    indicators TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de temas por asignatura
CREATE TABLE IF NOT EXISTS subject_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL REFERENCES paes_subjects(id),
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5
    estimated_hours INTEGER DEFAULT 2,
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    difficulty TEXT NOT NULL DEFAULT 'auto',
    focus_skills TEXT DEFAULT '[]',
    study_time_minutes INTEGER DEFAULT 30,
    notifications_enabled BOOLEAN DEFAULT true,
    music_enabled BOOLEAN DEFAULT true,
    theme_preference TEXT DEFAULT 'light',
    language TEXT DEFAULT 'es',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla de progreso de usuario por asignatura
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.0, -- 0-100
    total_exercises INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    time_studied_minutes INTEGER DEFAULT 0,
    last_studied TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    weak_areas TEXT[],
    strong_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES paes_subjects(id),
    UNIQUE(user_id, subject_id)
);

-- Tabla de sesiones de estudio
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    bloom_level_id TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress, completed, paused, abandoned
    total_time_minutes INTEGER DEFAULT 0,
    exercises_completed INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    session_score DECIMAL(5,2) DEFAULT 0.0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(subject_id) REFERENCES paes_subjects(id),
    FOREIGN KEY(bloom_level_id) REFERENCES bloom_levels(id)
);

-- Tabla de banco de ejercicios
CREATE TABLE IF NOT EXISTS exercise_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL,
    topic_id UUID REFERENCES subject_topics(id),
    bloom_level_id TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- multiple_choice, true_false, open_ended, matching
    options JSONB, -- Para preguntas de opción múltiple
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 2, -- 1-5
    estimated_time_seconds INTEGER DEFAULT 60,
    tags TEXT[],
    is_official BOOLEAN DEFAULT false, -- Si es ejercicio oficial PAES
    source TEXT, -- Fuente del ejercicio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(subject_id) REFERENCES paes_subjects(id),
    FOREIGN KEY(bloom_level_id) REFERENCES bloom_levels(id)
);

-- Tabla de ejercicios realizados por usuario
CREATE TABLE IF NOT EXISTS user_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    session_id UUID REFERENCES study_sessions(id),
    exercise_id UUID NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    confidence_level INTEGER, -- 1-5
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(exercise_id) REFERENCES exercise_bank(id)
);

-- Tabla de simulacros PAES
CREATE TABLE IF NOT EXISTS paes_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    subject_id TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    time_limit_minutes INTEGER NOT NULL,
    difficulty_level INTEGER DEFAULT 3,
    is_official BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(subject_id) REFERENCES paes_subjects(id)
);

-- Tabla de simulacros realizados por usuario
CREATE TABLE IF NOT EXISTS user_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    simulation_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2),
    total_questions INTEGER,
    correct_answers INTEGER,
    time_spent_minutes INTEGER,
    status TEXT DEFAULT 'in_progress', -- in_progress, completed, abandoned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(simulation_id) REFERENCES paes_simulations(id)
);

-- Tabla de logros y gamificación
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL, -- study, performance, streak, social
    criteria JSONB NOT NULL, -- Criterios para desbloquear
    points INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de logros desbloqueados por usuario
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    achievement_id UUID NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress DECIMAL(5,2) DEFAULT 100.0, -- Progreso hacia el logro
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

-- Tabla de estadísticas de usuario
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_study_time_minutes INTEGER DEFAULT 0,
    total_exercises_completed INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    longest_streak_days INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para user_progress
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject_id ON user_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_studied ON user_progress(last_studied);

-- Índices para study_sessions
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_subject_id ON study_sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_status ON study_sessions(status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON study_sessions(started_at);

-- Índices para exercise_bank
CREATE INDEX IF NOT EXISTS idx_exercise_bank_subject_id ON exercise_bank(subject_id);
CREATE INDEX IF NOT EXISTS idx_exercise_bank_bloom_level_id ON exercise_bank(bloom_level_id);
CREATE INDEX IF NOT EXISTS idx_exercise_bank_difficulty ON exercise_bank(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercise_bank_tags ON exercise_bank USING GIN(tags);

-- Índices para user_exercises
CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_session_id ON user_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_exercise_id ON user_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_created_at ON user_exercises(created_at);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar asignaturas PAES oficiales
INSERT INTO paes_subjects (id, name, description, is_required, weight) VALUES
('MATEMATICA_M1', 'Matemática M1', 'Matemática obligatoria para todas las carreras', true, 1.0),
('MATEMATICA_M2', 'Matemática M2', 'Matemática específica para carreras científicas', false, 1.0),
('COMPETENCIA_LECTORA', 'Competencia Lectora', 'Comprensión lectora y análisis de textos', true, 1.0),
('CIENCIAS', 'Ciencias', 'Ciencias naturales y metodología científica', true, 1.0),
('HISTORIA', 'Historia', 'Historia de Chile y el mundo', true, 1.0)
ON CONFLICT (id) DO NOTHING;

-- Insertar niveles de taxonomía Bloom
INSERT INTO bloom_levels (id, name, description, level_order, action_verbs, indicators) VALUES
('remember', 'Recordar', 'Recordar información básica', 1, 
 ARRAY['definir', 'identificar', 'listar', 'memorizar', 'repetir'], 
 ARRAY['Puede recordar información específica', 'Puede identificar elementos básicos']),
('understand', 'Comprender', 'Comprender el significado', 2, 
 ARRAY['explicar', 'describir', 'interpretar', 'resumir', 'parafrasear'], 
 ARRAY['Puede explicar conceptos', 'Puede interpretar información']),
('apply', 'Aplicar', 'Aplicar conocimiento en situaciones nuevas', 3, 
 ARRAY['aplicar', 'calcular', 'resolver', 'usar', 'ejecutar'], 
 ARRAY['Puede resolver problemas', 'Puede aplicar fórmulas']),
('analyze', 'Analizar', 'Analizar componentes y relaciones', 4, 
 ARRAY['analizar', 'comparar', 'contrastar', 'organizar', 'estructurar'], 
 ARRAY['Puede identificar patrones', 'Puede analizar relaciones']),
('evaluate', 'Evaluar', 'Evaluar y juzgar', 5, 
 ARRAY['evaluar', 'juzgar', 'criticar', 'valorar', 'argumentar'], 
 ARRAY['Puede evaluar argumentos', 'Puede juzgar la calidad']),
('create', 'Crear', 'Crear algo nuevo', 6, 
 ARRAY['crear', 'diseñar', 'desarrollar', 'construir', 'producir'], 
 ARRAY['Puede crear soluciones', 'Puede diseñar estrategias'])
ON CONFLICT (id) DO NOTHING;

-- Insertar logros básicos
INSERT INTO achievements (name, description, category, criteria, points) VALUES
('Primer Paso', 'Completa tu primera sesión de estudio', 'study', 
 '{"type": "sessions_completed", "value": 1}', 10),
('Consistencia', 'Estudia 7 días seguidos', 'streak', 
 '{"type": "streak_days", "value": 7}', 50),
('Matemático', 'Completa 100 ejercicios de matemáticas', 'performance', 
 '{"type": "subject_exercises", "subject": "MATEMATICA_M1", "value": 100}', 100),
('Lector Avanzado', 'Obtén 90% en Competencia Lectora', 'performance', 
 '{"type": "subject_score", "subject": "COMPETENCIA_LECTORA", "value": 90}', 200)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamps
CREATE TRIGGER update_paes_subjects_updated_at BEFORE UPDATE ON paes_subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subject_topics_updated_at BEFORE UPDATE ON subject_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at BEFORE UPDATE ON study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_bank_updated_at BEFORE UPDATE ON exercise_bank
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Políticas para user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Políticas para user_progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Políticas para study_sessions
CREATE POLICY "Users can view own sessions" ON study_sessions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own sessions" ON study_sessions
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Políticas para user_exercises
CREATE POLICY "Users can view own exercises" ON user_exercises
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own exercises" ON user_exercises
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para user_simulations
CREATE POLICY "Users can view own simulations" ON user_simulations
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own simulations" ON user_simulations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own simulations" ON user_simulations
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Políticas para user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Políticas para user_stats
CREATE POLICY "Users can view own stats" ON user_stats
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
    FOR UPDATE USING (auth.uid()::text = user_id);

-- =====================================================
-- FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para calcular progreso de usuario
CREATE OR REPLACE FUNCTION calculate_user_progress(p_user_id TEXT, p_subject_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    total_exercises INTEGER;
    correct_answers INTEGER;
    progress DECIMAL;
BEGIN
    SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_correct THEN 1 END) as correct
    INTO total_exercises, correct_answers
    FROM user_exercises ue
    JOIN exercise_bank eb ON ue.exercise_id = eb.id
    WHERE ue.user_id = p_user_id AND eb.subject_id = p_subject_id;
    
    IF total_exercises = 0 THEN
        progress := 0;
    ELSE
        progress := (correct_answers::DECIMAL / total_exercises::DECIMAL) * 100;
    END IF;
    
    RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estadísticas de usuario
CREATE OR REPLACE FUNCTION update_user_stats(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_stats (user_id, total_study_time_minutes, total_exercises_completed, total_correct_answers)
    SELECT 
        p_user_id,
        COALESCE(SUM(total_time_minutes), 0),
        COALESCE(SUM(exercises_completed), 0),
        COALESCE(SUM(correct_answers), 0)
    FROM study_sessions
    WHERE user_id = p_user_id AND status = 'completed'
    ON CONFLICT (user_id) DO UPDATE SET
        total_study_time_minutes = EXCLUDED.total_study_time_minutes,
        total_exercises_completed = EXCLUDED.total_exercises_completed,
        total_correct_answers = EXCLUDED.total_correct_answers,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para progreso detallado del usuario
CREATE OR REPLACE VIEW user_detailed_progress AS
SELECT 
    up.user_id,
    up.subject_id,
    ps.name as subject_name,
    up.progress,
    up.total_exercises,
    up.correct_answers,
    up.average_score,
    up.time_studied_minutes,
    up.last_studied,
    up.weak_areas,
    up.strong_areas
FROM user_progress up
JOIN paes_subjects ps ON up.subject_id = ps.id;

-- Vista para estadísticas de sesiones
CREATE OR REPLACE VIEW session_statistics AS
SELECT 
    user_id,
    subject_id,
    COUNT(*) as total_sessions,
    AVG(total_time_minutes) as avg_session_time,
    AVG(session_score) as avg_session_score,
    SUM(exercises_completed) as total_exercises_in_sessions
FROM study_sessions
WHERE status = 'completed'
GROUP BY user_id, subject_id;

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
