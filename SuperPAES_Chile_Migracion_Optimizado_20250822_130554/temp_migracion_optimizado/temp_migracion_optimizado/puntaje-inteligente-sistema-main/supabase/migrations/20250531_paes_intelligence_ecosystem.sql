-- ============================================================================
-- PAES Intelligence Ecosystem - Schema Completo
-- ============================================================================

-- Tabla para sesiones de aprendizaje
CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    current_node TEXT NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    estimated_duration INTEGER,
    actual_duration INTEGER,
    performance DECIMAL(3,2),
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para mini-evaluaciones
CREATE TABLE IF NOT EXISTS mini_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    questions JSONB NOT NULL,
    user_answers JSONB,
    score DECIMAL(3,2),
    feedback TEXT,
    time_spent INTEGER,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para ajustes adaptativos
CREATE TABLE IF NOT EXISTS adaptive_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('difficulty', 'content', 'pacing', 'style')),
    reason TEXT NOT NULL,
    previous_value TEXT,
    new_value TEXT,
    confidence DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para logros
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('learning', 'consistency', 'improvement', 'mastery', 'social')),
    points INTEGER DEFAULT 0,
    badge_url TEXT,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Tabla para estadísticas de usuario
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    nodes_completed INTEGER DEFAULT 0,
    average_performance DECIMAL(3,2) DEFAULT 0,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para competencias
CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('weekly_challenge', 'skill_tournament', 'speed_learning', 'accuracy_contest')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para participantes de competencias
CREATE TABLE IF NOT EXISTS competition_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- Tabla para certificaciones
CREATE TABLE IF NOT EXISTS user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_code TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('basic', 'intermediate', 'advanced', 'expert')),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    verification_code TEXT UNIQUE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE
);

-- Tabla para notificaciones inteligentes
CREATE TABLE IF NOT EXISTS intelligent_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('study_reminder', 'achievement', 'deadline', 'recommendation', 'streak')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    scheduled_for TIMESTAMPTZ NOT NULL,
    context JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    action_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para evaluaciones de habilidades
CREATE TABLE IF NOT EXISTS skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    skill_code TEXT NOT NULL,
    current_level INTEGER DEFAULT 1,
    target_level INTEGER DEFAULT 5,
    progress DECIMAL(3,2) DEFAULT 0,
    strengths JSONB DEFAULT '[]',
    weaknesses JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    last_assessed TIMESTAMPTZ DEFAULT NOW(),
    next_assessment TIMESTAMPTZ,
    UNIQUE(user_id, skill_code)
);

-- Tabla para banco de ejercicios generados por IA
CREATE TABLE IF NOT EXISTS ai_generated_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
    bloom_level TEXT NOT NULL CHECK (bloom_level IN ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create')),
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('multiple_choice', 'true_false', 'short_answer', 'problem_solving', 'essay')),
    question TEXT NOT NULL,
    options JSONB,
    correct_answer JSONB,
    explanation TEXT,
    hints JSONB DEFAULT '[]',
    time_limit INTEGER,
    points INTEGER DEFAULT 10,
    tags JSONB DEFAULT '[]',
    ai_generated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para sets de ejercicios
CREATE TABLE IF NOT EXISTS exercise_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
    estimated_time INTEGER,
    is_adaptive BOOLEAN DEFAULT FALSE,
    exercise_ids JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_subject_code ON learning_sessions(subject_code);
CREATE INDEX IF NOT EXISTS idx_mini_evaluations_session_id ON mini_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_category ON user_achievements(category);
CREATE INDEX IF NOT EXISTS idx_competition_participants_competition_id ON competition_participants(competition_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_intelligent_notifications_user_id ON intelligent_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_intelligent_notifications_scheduled_for ON intelligent_notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_exercises_subject_topic ON ai_generated_exercises(subject, topic);
CREATE INDEX IF NOT EXISTS idx_ai_generated_exercises_difficulty ON ai_generated_exercises(difficulty);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_sessions_updated_at 
    BEFORE UPDATE ON learning_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
    BEFORE UPDATE ON user_stats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estadísticas de usuario automáticamente
CREATE OR REPLACE FUNCTION update_user_stats_on_session_complete()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        INSERT INTO user_stats (user_id, nodes_completed, total_time_spent, last_activity)
        VALUES (NEW.user_id, 1, COALESCE(NEW.actual_duration, 0), NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            nodes_completed = user_stats.nodes_completed + 1,
            total_time_spent = user_stats.total_time_spent + COALESCE(NEW.actual_duration, 0),
            average_performance = (
                SELECT AVG(performance) 
                FROM learning_sessions 
                WHERE user_id = NEW.user_id AND performance IS NOT NULL
            ),
            last_activity = NOW(),
            updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_user_stats_on_session_complete
    AFTER UPDATE ON learning_sessions
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session_complete();

-- RLS Policies
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mini_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para learning_sessions
CREATE POLICY "Users can view own learning sessions" ON learning_sessions 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning sessions" ON learning_sessions 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning sessions" ON learning_sessions 
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de seguridad para mini_evaluations
CREATE POLICY "Users can view own mini evaluations" ON mini_evaluations 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM learning_sessions 
            WHERE learning_sessions.id = mini_evaluations.session_id 
            AND learning_sessions.user_id = auth.uid()
        )
    );

-- Políticas de seguridad para adaptive_adjustments
CREATE POLICY "Users can view own adaptive adjustments" ON adaptive_adjustments 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM learning_sessions 
            WHERE learning_sessions.id = adaptive_adjustments.session_id 
            AND learning_sessions.user_id = auth.uid()
        )
    );

-- Políticas de seguridad para user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON user_achievements 
    FOR INSERT WITH CHECK (true);

-- Políticas de seguridad para user_stats
CREATE POLICY "Users can view own stats" ON user_stats 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can update stats" ON user_stats 
    FOR ALL USING (true);

-- Políticas de seguridad para user_certifications
CREATE POLICY "Users can view own certifications" ON user_certifications 
    FOR SELECT USING (auth.uid() = user_id);

-- Políticas de seguridad para intelligent_notifications
CREATE POLICY "Users can view own notifications" ON intelligent_notifications 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON intelligent_notifications 
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas de seguridad para skill_assessments
CREATE POLICY "Users can view own skill assessments" ON skill_assessments 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own skill assessments" ON skill_assessments 
    FOR ALL USING (auth.uid() = user_id);

-- Competitions y exercises son públicas para lectura
CREATE POLICY "Anyone can view competitions" ON competitions FOR SELECT USING (true);
CREATE POLICY "Anyone can view competition participants" ON competition_participants FOR SELECT USING (true);
CREATE POLICY "Anyone can view ai generated exercises" ON ai_generated_exercises FOR SELECT USING (true);
CREATE POLICY "Anyone can view exercise sets" ON exercise_sets FOR SELECT USING (true);

-- Insertar datos de ejemplo para achievements
INSERT INTO user_achievements (user_id, achievement_id, title, description, category, points, rarity) 
SELECT 
    auth.uid(),
    'welcome_achievement',
    'Bienvenido a PAES Studio',
    'Has comenzado tu viaje de aprendizaje',
    'learning',
    100,
    'common'
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, achievement_id) DO NOTHING;