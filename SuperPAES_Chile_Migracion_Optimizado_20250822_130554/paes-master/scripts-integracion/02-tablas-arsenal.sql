-- =====================================================================================
-- TABLAS DEL ARSENAL EDUCATIVO
-- =====================================================================================
-- Crea las 7 tablas principales del Arsenal Educativo con integración Leonardo

-- TABLA 1: NEURAL CACHE SESSIONS
CREATE TABLE IF NOT EXISTS arsenal_educativo.neural_cache_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT NOT NULL,
    cache_data JSONB NOT NULL DEFAULT '{}',
    neural_patterns JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cache_hits INTEGER DEFAULT 0,
    cache_misses INTEGER DEFAULT 0,
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    leonardo_integration BOOLEAN DEFAULT true,
    vigoleonrocks_compatible BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_session_key UNIQUE(user_id, session_key)
);

-- TABLA 2: REAL TIME ANALYTICS METRICS
CREATE TABLE IF NOT EXISTS arsenal_educativo.real_time_analytics_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_context JSONB DEFAULT '{}',
    leonardo_correlation JSONB DEFAULT '{}',
    vigoleonrocks_metrics JSONB DEFAULT '{}',
    real_time_score DECIMAL(5,2) DEFAULT 0.0,
    session_id UUID,
    timestamp_precise TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 3: HUD REAL TIME SESSIONS
CREATE TABLE IF NOT EXISTS arsenal_educativo.hud_real_time_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    hud_config JSONB DEFAULT '{}',
    quantum_state JSONB DEFAULT '{}',
    leonardo_insights JSONB DEFAULT '{}',
    optimization_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 4: SMART NOTIFICATIONS
CREATE TABLE IF NOT EXISTS arsenal_educativo.smart_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_type TEXT CHECK (notification_type IN ('achievement', 'warning', 'insight', 'recommendation', 'system', 'leonardo_insight')) DEFAULT 'insight',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical', 'quantum')) DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    metadata JSONB DEFAULT '{}',
    leonardo_generated BOOLEAN DEFAULT FALSE,
    quantum_coherence DECIMAL(3,2) DEFAULT 1.0,
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 5: EXERCISE PLAYLISTS
CREATE TABLE IF NOT EXISTS arsenal_educativo.exercise_playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    playlist_type TEXT CHECK (playlist_type IN ('custom', 'recommended', 'adaptive', 'daily_mix', 'discovery', 'leonardo_curated')) DEFAULT 'custom',
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'mixed', 'quantum')) DEFAULT 'mixed',
    subject_focus TEXT[],
    total_exercises INTEGER DEFAULT 0,
    estimated_duration INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    engagement_score DECIMAL(5,2) DEFAULT 0.0,
    leonardo_optimization JSONB DEFAULT '{}',
    quantum_alignment DECIMAL(3,2) DEFAULT 1.0,
    is_public BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 6: PLAYLIST ITEMS
CREATE TABLE IF NOT EXISTS arsenal_educativo.playlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID REFERENCES arsenal_educativo.exercise_playlists(id) ON DELETE CASCADE,
    exercise_id UUID,
    position INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_time INTEGER,
    score_achieved DECIMAL(5,2),
    attempts_count INTEGER DEFAULT 0,
    adaptive_difficulty DECIMAL(3,2) DEFAULT 1.0,
    neural_feedback JSONB DEFAULT '{}',
    leonardo_insights JSONB DEFAULT '{}',
    quantum_resonance DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_playlist_position UNIQUE(playlist_id, position)
);

-- TABLA 7: PAES SIMULATIONS ADVANCED
CREATE TABLE IF NOT EXISTS arsenal_educativo.paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test', 'quantum_monte_carlo')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    leonardo_analysis JSONB DEFAULT '{}',
    quantum_factors JSONB DEFAULT '{}',
    vigoleonrocks_correlation JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    quantum_coherence DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed', 'quantum_processing')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- COMENTARIOS EN LAS TABLAS
COMMENT ON TABLE arsenal_educativo.neural_cache_sessions IS 'Cache neural integrado con sistema Leonardo existente';
COMMENT ON TABLE arsenal_educativo.real_time_analytics_metrics IS 'Métricas en tiempo real con correlación Leonardo/VLR';
COMMENT ON TABLE arsenal_educativo.hud_real_time_sessions IS 'HUD futurístico integrado con sistema cuántico Leonardo';
COMMENT ON TABLE arsenal_educativo.smart_notifications IS 'Notificaciones inteligentes con generación Leonardo/IA';
COMMENT ON TABLE arsenal_educativo.exercise_playlists IS 'Playlists educativas tipo Spotify con curación Leonardo';
COMMENT ON TABLE arsenal_educativo.playlist_items IS 'Elementos de playlist con feedback neural Leonardo';
COMMENT ON TABLE arsenal_educativo.paes_simulations_advanced IS 'Simulaciones PAES avanzadas con análisis Leonardo y procesamiento cuántico';

SELECT 'Tablas del Arsenal Educativo creadas correctamente' as resultado;
