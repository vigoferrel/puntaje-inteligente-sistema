-- ============================================================================
-- OPTIMIZACIONES PRODUCCION
-- Consolidado automaticamente: 06/04/2025 14:16:33
-- Archivos origen: 1 archivos
-- ============================================================================

-- ============================================================================
-- ORIGEN: SQL_CONSOLIDADO_PRODUCCION_FINAL.sql
-- ============================================================================
-- =====================================================================================
-- ðŸš€ SQL CONSOLIDADO PARA PRODUCCIÃ“N - ECOSISTEMA NEURAL COMPLETO
-- =====================================================================================
-- Sequential Thinking + Context7: Todas las tablas y funciones necesarias
-- Para pegar directamente en Supabase y generar tipos TypeScript
-- =====================================================================================

-- =====================================================================================
-- ðŸ“Š TABLAS PRINCIPALES DEL ECOSISTEMA NEURAL
-- =====================================================================================

-- Tabla 1: Neural Cache Sessions
CREATE TABLE IF NOT EXISTS neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT NOT NULL,
    cache_data JSONB NOT NULL DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_session_key UNIQUE(user_id, session_key)
);

-- Tabla 2: Exercise Playlists
CREATE TABLE IF NOT EXISTS exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 3: Playlist Items
CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID,
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);

-- Tabla 4: PAES Simulations Advanced
CREATE TABLE IF NOT EXISTS paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    vocational_alignment JSONB DEFAULT '{}',
    improvement_trajectory JSONB DEFAULT '{}',
    confidence_intervals JSONB DEFAULT '{}',
    simulation_parameters JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla 5: Real Time Analytics Metrics
CREATE TABLE IF NOT EXISTS real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_context JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    engagement_data JSONB DEFAULT '{}',
    performance_indicators JSONB DEFAULT '{}',
    trend_analysis JSONB DEFAULT '{}',
    anomaly_detection JSONB DEFAULT '{}',
    real_time_score DECIMAL(5,2) DEFAULT 0.0,
    session_id UUID,
    timestamp_precise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 6: Micro Certifications
CREATE TABLE IF NOT EXISTS micro_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    certification_type TEXT CHECK (certification_type IN ('skill_mastery', 'subject_completion', 'performance_milestone', 'adaptive_achievement')) DEFAULT 'skill_mastery',
    subject_focus TEXT NOT NULL,
    skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'beginner',
    requirements_met JSONB DEFAULT '{}',
    validation_criteria JSONB DEFAULT '{}',
    evidence_data JSONB DEFAULT '{}',
    quality_score DECIMAL(5,2) DEFAULT 0.0,
    is_validated BOOLEAN DEFAULT FALSE,
    validation_timestamp TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    badge_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 7: Mini Evaluations
CREATE TABLE IF NOT EXISTS mini_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    evaluation_name TEXT NOT NULL,
    evaluation_type TEXT CHECK (evaluation_type IN ('diagnostic', 'formative', 'adaptive', 'quick_check')) DEFAULT 'diagnostic',
    subject_focus TEXT NOT NULL,
    questions_data JSONB NOT NULL DEFAULT '[]',
    user_responses JSONB DEFAULT '[]',
    scoring_algorithm TEXT DEFAULT 'weighted_average',
    results_summary JSONB DEFAULT '{}',
    adaptive_parameters JSONB DEFAULT '{}',
    completion_time_seconds INTEGER,
    accuracy_percentage DECIMAL(5,2),
    difficulty_level DECIMAL(3,2) DEFAULT 1.0,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla 8: Subject Skill Groups
CREATE TABLE IF NOT EXISTS subject_skill_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    group_name TEXT NOT NULL,
    group_type TEXT CHECK (group_type IN ('subject_mastery', 'skill_level', 'difficulty_cluster', 'performance_tier')) DEFAULT 'subject_mastery',
    subjects_included TEXT[] NOT NULL,
    skills_included TEXT[] NOT NULL,
    mastery_levels JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    clustering_algorithm TEXT DEFAULT 'k_means',
    cluster_parameters JSONB DEFAULT '{}',
    group_analytics JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '{}',
    is_auto_generated BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 9: HUD Real Time Sessions
CREATE TABLE IF NOT EXISTS hud_real_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    hud_config JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    alerts_generated JSONB DEFAULT '[]',
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 10: Smart Notifications
CREATE TABLE IF NOT EXISTS smart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT CHECK (notification_type IN ('achievement', 'warning', 'insight', 'recommendation', 'system')) DEFAULT 'insight',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================================
-- ðŸ”§ ÃNDICES OPTIMIZADOS PARA PRODUCCIÃ“N
-- =====================================================================================

-- Ãndices para neural_cache_sessions
CREATE INDEX IF NOT EXISTS idx_neural_cache_user_session ON neural_cache_sessions(user_id, session_key);
CREATE INDEX IF NOT EXISTS idx_neural_cache_expires ON neural_cache_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_neural_cache_performance ON neural_cache_sessions USING GIN(performance_metrics);

-- Ãndices para exercise_playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user_type ON exercise_playlists(user_id, playlist_type);
CREATE INDEX IF NOT EXISTS idx_playlists_public_featured ON exercise_playlists(is_public, is_featured) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_playlists_subject_focus ON exercise_playlists USING GIN(subject_focus);

-- Ãndices para playlist_items
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_playlist_items_completion ON playlist_items(is_completed, completion_time);

-- Ãndices para paes_simulations_advanced
CREATE INDEX IF NOT EXISTS idx_simulations_user_type ON paes_simulations_advanced(user_id, simulation_type);
CREATE INDEX IF NOT EXISTS idx_simulations_status ON paes_simulations_advanced(status, created_at);
CREATE INDEX IF NOT EXISTS idx_simulations_completed ON paes_simulations_advanced(completed_at) WHERE completed_at IS NOT NULL;

-- Ãndices para real_time_analytics_metrics
CREATE INDEX IF NOT EXISTS idx_analytics_user_metric ON real_time_analytics_metrics(user_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON real_time_analytics_metrics(timestamp_precise DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON real_time_analytics_metrics(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_neural_patterns ON real_time_analytics_metrics USING GIN(neural_patterns);

-- Ãndices para micro_certifications
CREATE INDEX IF NOT EXISTS idx_certifications_user ON micro_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_validated ON micro_certifications(is_validated, validation_timestamp);
CREATE INDEX IF NOT EXISTS idx_certifications_expiry ON micro_certifications(expiry_date) WHERE expiry_date IS NOT NULL;

-- Ãndices para mini_evaluations
CREATE INDEX IF NOT EXISTS idx_evaluations_user ON mini_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_completed ON mini_evaluations(is_completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_evaluations_type ON mini_evaluations(evaluation_type, created_at);

-- Ãndices para subject_skill_groups
CREATE INDEX IF NOT EXISTS idx_skill_groups_user_type ON subject_skill_groups(user_id, group_type);
CREATE INDEX IF NOT EXISTS idx_skill_groups_subjects ON subject_skill_groups USING GIN(subjects_included);
CREATE INDEX IF NOT EXISTS idx_skill_groups_skills ON subject_skill_groups USING GIN(skills_included);
CREATE INDEX IF NOT EXISTS idx_skill_groups_auto ON subject_skill_groups(is_auto_generated, last_updated);
CREATE INDEX IF NOT EXISTS idx_skill_groups_mastery ON subject_skill_groups USING GIN(mastery_levels);

-- Ãndices para hud_real_time_sessions
CREATE INDEX IF NOT EXISTS idx_hud_sessions_user_active ON hud_real_time_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_hud_sessions_performance ON hud_real_time_sessions USING GIN(performance_metrics);

-- Ãndices para smart_notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON smart_notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON smart_notifications(priority, created_at) WHERE is_read = FALSE;

-- =====================================================================================
-- ðŸ”’ POLÃTICAS RLS PARA SEGURIDAD
-- =====================================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE neural_cache_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE paes_simulations_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mini_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_skill_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;

-- PolÃ­ticas de acceso por usuario
CREATE POLICY "Users can manage their own cache sessions" ON neural_cache_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playlists" ON exercise_playlists
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own playlist items" ON playlist_items
    FOR ALL USING (
        EXISTS (SELECT 1 FROM exercise_playlists WHERE id = playlist_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can manage their own simulations" ON paes_simulations_advanced
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own analytics" ON real_time_analytics_metrics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own certifications" ON micro_certifications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own evaluations" ON mini_evaluations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own skill groups" ON subject_skill_groups
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own HUD sessions" ON hud_real_time_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notifications" ON smart_notifications
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================================================
-- ðŸ“Š VISTAS MATERIALIZADAS PARA PERFORMANCE
-- =====================================================================================

-- Vista materializada para analytics de usuario
CREATE MATERIALIZED VIEW IF NOT EXISTS user_mastery_summary AS
SELECT 
    ssg.user_id,
    COUNT(DISTINCT ssg.id) as total_groups,
    (SELECT array_agg(DISTINCT subject) FROM (SELECT unnest(subjects_included) as subject FROM subject_skill_groups WHERE user_id = ssg.user_id) sub) as all_subjects,
    (SELECT array_agg(DISTINCT skill) FROM (SELECT unnest(skills_included) as skill FROM subject_skill_groups WHERE user_id = ssg.user_id) sub2) as all_skills,
    AVG((ssg.performance_metrics->>'overall_mastery')::DECIMAL) as avg_mastery,
    MAX(ssg.last_updated) as last_activity
FROM subject_skill_groups ssg
GROUP BY ssg.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_mastery_summary_user_id ON user_mastery_summary(user_id);

-- Vista materializada para playlist analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS playlist_performance_summary AS
SELECT 
    user_id,
    COUNT(*) as total_playlists,
    SUM(total_exercises) as total_exercises,
    AVG(completion_rate) as avg_completion_rate,
    AVG(engagement_score) as avg_engagement,
    SUM(play_count) as total_plays
FROM exercise_playlists
GROUP BY user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_playlist_performance_summary_user_id ON playlist_performance_summary(user_id);

-- =====================================================================================
-- âœ… ECOSISTEMA NEURAL COMPLETO PARA PRODUCCIÃ“N
-- =====================================================================================
-- ðŸš€ Total: 10 tablas principales + Ã­ndices optimizados + polÃ­ticas RLS + vistas materializadas
-- ðŸ“Š Listo para generar tipos TypeScript automÃ¡ticamente en Supabase
-- ðŸ”’ Seguridad completa con Row Level Security
-- âš¡ Performance optimizado con Ã­ndices estratÃ©gicos
-- =====================================================================================

