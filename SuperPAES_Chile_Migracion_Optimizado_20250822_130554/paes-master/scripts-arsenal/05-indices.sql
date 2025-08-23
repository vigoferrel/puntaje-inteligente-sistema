-- =====================================================================================
-- ARSENAL EDUCATIVO - INDICES DE PERFORMANCE
-- =====================================================================================

-- Indices para neural_cache_sessions
CREATE INDEX IF NOT EXISTS idx_neural_cache_user_id ON neural_cache_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_neural_cache_session_key ON neural_cache_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_neural_cache_expires_at ON neural_cache_sessions(expires_at);

-- Indices para real_time_analytics_metrics
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON real_time_analytics_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_type ON real_time_analytics_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON real_time_analytics_metrics(timestamp_precise);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON real_time_analytics_metrics(session_id);

-- Indices para hud_real_time_sessions
CREATE INDEX IF NOT EXISTS idx_hud_sessions_user_id ON hud_real_time_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hud_sessions_active ON hud_real_time_sessions(is_active, created_at);

-- Indices para smart_notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON smart_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON smart_notifications(user_id, is_read, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON smart_notifications(priority, created_at);

-- Indices para exercise_playlists
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON exercise_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_type ON exercise_playlists(playlist_type);
CREATE INDEX IF NOT EXISTS idx_playlists_public ON exercise_playlists(is_public, is_featured);

-- Indices para playlist_items
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_id ON playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_position ON playlist_items(playlist_id, position);

-- Indices para paes_simulations_advanced
CREATE INDEX IF NOT EXISTS idx_paes_simulations_user_id ON paes_simulations_advanced(user_id);
CREATE INDEX IF NOT EXISTS idx_paes_simulations_type ON paes_simulations_advanced(simulation_type);
CREATE INDEX IF NOT EXISTS idx_paes_simulations_status ON paes_simulations_advanced(status, created_at);
