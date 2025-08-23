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
