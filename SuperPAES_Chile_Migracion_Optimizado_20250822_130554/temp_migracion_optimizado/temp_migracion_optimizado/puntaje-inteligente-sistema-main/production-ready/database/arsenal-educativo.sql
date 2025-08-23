-- =====================================================================================
-- ARSENAL EDUCATIVO - TABLAS BASE
-- =====================================================================================

-- TABLA 1: NEURAL CACHE SESSIONS
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

-- TABLA 2: REAL TIME ANALYTICS METRICS
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

-- TABLA 3: HUD REAL TIME SESSIONS
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

-- TABLA 4: SMART NOTIFICATIONS
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

-- TABLA 5: EXERCISE PLAYLISTS
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

-- TABLA 6: PLAYLIST ITEMS
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

-- TABLA 7: PAES SIMULATIONS ADVANCED
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

-- INDICES OPTIMIZADOS
CREATE INDEX IF NOT EXISTS idx_neural_cache_user ON neural_cache_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON real_time_analytics_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_hud_sessions_user ON hud_real_time_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON smart_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON exercise_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_simulations_user ON paes_simulations_advanced(user_id);

-- POLITICAS RLS
ALTER TABLE neural_cache_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE paes_simulations_advanced ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own cache" ON neural_cache_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own analytics" ON real_time_analytics_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own hud sessions" ON hud_real_time_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notifications" ON smart_notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own playlists" ON exercise_playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own playlist items" ON playlist_items FOR ALL USING (
    EXISTS (SELECT 1 FROM exercise_playlists WHERE id = playlist_id AND user_id = auth.uid())
);
CREATE POLICY "Users access own simulations" ON paes_simulations_advanced FOR ALL USING (auth.uid() = user_id);
