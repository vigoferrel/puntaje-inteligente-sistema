-- ==================== PAES PRO - SIMPLIFIED DATABASE SETUP ====================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE paes_test_type AS ENUM (
    'COMPETENCIA_LECTORA',
    'MATEMATICA_M1', 
    'MATEMATICA_M2',
    'CIENCIAS',
    'HISTORIA'
);

CREATE TYPE node_status AS ENUM (
    'not-evaluated',
    'in-progress',
    'completed'
);

-- User profiles (simplified)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    current_scores JSONB DEFAULT '{
        "competencia_lectora": 500,
        "matematica_m1": 500,
        "matematica_m2": 500,
        "historia": 500,
        "ciencias": 500
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Learning nodes (simplified)
CREATE TABLE IF NOT EXISTS learning_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    test_type paes_test_type NOT NULL,
    skill VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'intermedio',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress (simplified)
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES learning_nodes(id) ON DELETE CASCADE,
    status node_status DEFAULT 'not-evaluated',
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    score DECIMAL(5,2) DEFAULT 0.0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, node_id)
);

-- Practice sessions (simplified)
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type paes_test_type NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    time_spent_minutes INTEGER NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_test_type ON learning_nodes(test_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON practice_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Learning nodes are publicly readable
ALTER TABLE learning_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learning nodes are publicly readable" ON learning_nodes
    FOR SELECT USING (true);

-- Insert initial learning nodes
INSERT INTO learning_nodes (name, description, test_type, skill, difficulty, position) VALUES
('Localizar información', 'Identificación de información explícita en textos', 'COMPETENCIA_LECTORA', 'Localizar', 'facil', 1),
('Interpretar y relacionar', 'Comprensión e interpretación de información implícita', 'COMPETENCIA_LECTORA', 'Interpretar y relacionar', 'intermedio', 2),
('Evaluar y reflexionar', 'Análisis crítico y evaluación de textos', 'COMPETENCIA_LECTORA', 'Evaluar y reflexionar', 'dificil', 3),
('Números y operaciones', 'Operaciones con números reales', 'MATEMATICA_M1', 'Resolver problemas', 'facil', 1),
('Álgebra básica', 'Ecuaciones y funciones lineales', 'MATEMATICA_M1', 'Modelar', 'intermedio', 2)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'PAES Pro Database Setup Completed!' as status;
