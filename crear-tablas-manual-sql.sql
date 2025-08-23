-- SCRIPT SQL CORREGIDO PARA CREAR TABLAS EDUCATIVAS PAES
-- Ejecutar este script en el SQL Editor de Supabase
-- https://supabase.com/dashboard/project/settifboilityelprvjd/sql/new

-- 1. Crear tabla de asignaturas PAES
CREATE TABLE IF NOT EXISTS paes_subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT true,
    weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla de niveles Bloom
CREATE TABLE IF NOT EXISTS bloom_levels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    level_order INTEGER NOT NULL,
    action_verbs TEXT[],
    indicators TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Crear tabla de temas por asignatura
CREATE TABLE IF NOT EXISTS subject_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL REFERENCES paes_subjects(id),
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level INTEGER DEFAULT 1,
    estimated_hours INTEGER DEFAULT 2,
    prerequisites TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Crear tabla de preferencias de usuario (CORREGIDO: user_id como UUID)
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY,
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

-- 5. Crear tabla de progreso de usuario (CORREGIDO: user_id como UUID)
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    subject_id TEXT NOT NULL,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.0,
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

-- 6. Crear tabla de banco de ejercicios
CREATE TABLE IF NOT EXISTS exercise_bank (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id TEXT NOT NULL,
    topic_id UUID REFERENCES subject_topics(id),
    bloom_level_id TEXT NOT NULL,
    question TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 2,
    estimated_time_seconds INTEGER DEFAULT 60,
    tags TEXT[],
    is_official BOOLEAN DEFAULT false,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(subject_id) REFERENCES paes_subjects(id),
    FOREIGN KEY(bloom_level_id) REFERENCES bloom_levels(id)
);

-- 7. Crear tabla de ejercicios realizados por usuario (SIN session_id para evitar conflictos)
CREATE TABLE IF NOT EXISTS user_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    exercise_id UUID NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_spent_seconds INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    confidence_level INTEGER,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(exercise_id) REFERENCES exercise_bank(id)
);

-- 8. Crear tabla de simulacros PAES
CREATE TABLE IF NOT EXISTS paes_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 9. Crear tabla de simulacros realizados por usuario (CORREGIDO: user_id como UUID)
CREATE TABLE IF NOT EXISTS user_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    simulation_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2),
    total_questions INTEGER,
    correct_answers INTEGER,
    time_spent_minutes INTEGER,
    status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY(simulation_id) REFERENCES paes_simulations(id)
);

-- 10. Crear tabla de logros
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT NOT NULL,
    criteria JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject_id ON user_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_exercise_bank_subject_id ON exercise_bank(subject_id);
CREATE INDEX IF NOT EXISTS idx_exercise_bank_bloom_level_id ON exercise_bank(bloom_level_id);
CREATE INDEX IF NOT EXISTS idx_user_exercises_user_id ON user_exercises(user_id);

-- Habilitar RLS en tablas de usuario
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_simulations ENABLE ROW LEVEL SECURITY;

-- Insertar datos iniciales
INSERT INTO paes_subjects (id, name, description, is_required, weight) VALUES
('MATEMATICA_M1', 'Matemática M1', 'Matemática obligatoria para todas las carreras', true, 1.0),
('MATEMATICA_M2', 'Matemática M2', 'Matemática específica para carreras científicas', false, 1.0),
('COMPETENCIA_LECTORA', 'Competencia Lectora', 'Comprensión lectora y análisis de textos', true, 1.0),
('CIENCIAS', 'Ciencias', 'Ciencias naturales y metodología científica', true, 1.0),
('HISTORIA', 'Historia', 'Historia de Chile y el mundo', true, 1.0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO bloom_levels (id, name, description, level_order, action_verbs, indicators) VALUES
('remember', 'Recordar', 'Recordar información básica', 1, ARRAY['definir', 'identificar', 'listar'], ARRAY['Puede recordar información específica']),
('understand', 'Comprender', 'Comprender el significado', 2, ARRAY['explicar', 'describir', 'interpretar'], ARRAY['Puede explicar conceptos']),
('apply', 'Aplicar', 'Aplicar conocimiento en situaciones nuevas', 3, ARRAY['aplicar', 'calcular', 'resolver'], ARRAY['Puede resolver problemas']),
('analyze', 'Analizar', 'Analizar componentes y relaciones', 4, ARRAY['analizar', 'comparar', 'contrastar'], ARRAY['Puede identificar patrones']),
('evaluate', 'Evaluar', 'Evaluar y juzgar', 5, ARRAY['evaluar', 'juzgar', 'criticar'], ARRAY['Puede evaluar argumentos']),
('create', 'Crear', 'Crear algo nuevo', 6, ARRAY['crear', 'diseñar', 'desarrollar'], ARRAY['Puede crear soluciones'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO achievements (name, description, category, criteria, points) VALUES
('Primer Paso', 'Completa tu primera sesión de estudio', 'study', '{"type": "sessions_completed", "value": 1}', 10),
('Consistencia', 'Estudia 7 días seguidos', 'streak', '{"type": "streak_days", "value": 7}', 50),
('Matemático', 'Completa 100 ejercicios de matemáticas', 'performance', '{"type": "subject_exercises", "subject": "MATEMATICA_M1", "value": 100}', 100);

-- Verificar que las tablas se crearon
SELECT 'paes_subjects' as tabla, COUNT(*) as registros FROM paes_subjects
UNION ALL
SELECT 'bloom_levels', COUNT(*) FROM bloom_levels
UNION ALL
SELECT 'achievements', COUNT(*) FROM achievements;
