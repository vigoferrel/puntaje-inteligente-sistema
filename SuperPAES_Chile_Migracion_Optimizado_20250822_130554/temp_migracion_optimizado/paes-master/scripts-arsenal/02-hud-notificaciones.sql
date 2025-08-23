-- =====================================================================================
-- ARSENAL EDUCATIVO - HUD Y NOTIFICACIONES
-- =====================================================================================

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
