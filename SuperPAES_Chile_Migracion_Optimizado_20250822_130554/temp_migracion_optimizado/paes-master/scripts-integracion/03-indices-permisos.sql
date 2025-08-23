-- =====================================================================================
-- ÍNDICES OPTIMIZADOS Y PERMISOS RLS
-- =====================================================================================
-- Configura índices para rendimiento y políticas de seguridad RLS

-- =====================================================================================
-- ÍNDICES OPTIMIZADOS PARA RENDIMIENTO
-- =====================================================================================

-- ÍNDICES PARA NEURAL CACHE SESSIONS
CREATE INDEX IF NOT EXISTS idx_arsenal_neural_cache_user_id ON arsenal_educativo.neural_cache_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_neural_cache_session_key ON arsenal_educativo.neural_cache_sessions(session_key);
CREATE INDEX IF NOT EXISTS idx_arsenal_neural_cache_expires_at ON arsenal_educativo.neural_cache_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_arsenal_neural_cache_performance ON arsenal_educativo.neural_cache_sessions USING GIN(performance_metrics);

-- ÍNDICES PARA REAL TIME ANALYTICS METRICS
CREATE INDEX IF NOT EXISTS idx_arsenal_analytics_user_id ON arsenal_educativo.real_time_analytics_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_analytics_metric_type ON arsenal_educativo.real_time_analytics_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_arsenal_analytics_timestamp ON arsenal_educativo.real_time_analytics_metrics(timestamp_precise);
CREATE INDEX IF NOT EXISTS idx_arsenal_analytics_session ON arsenal_educativo.real_time_analytics_metrics(session_id) WHERE session_id IS NOT NULL;

-- ÍNDICES PARA HUD REAL TIME SESSIONS
CREATE INDEX IF NOT EXISTS idx_arsenal_hud_sessions_user_id ON arsenal_educativo.hud_real_time_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_hud_sessions_active ON arsenal_educativo.hud_real_time_sessions(is_active, created_at);

-- ÍNDICES PARA SMART NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_arsenal_notifications_user_id ON arsenal_educativo.smart_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_notifications_unread ON arsenal_educativo.smart_notifications(user_id, is_read, created_at) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_arsenal_notifications_priority ON arsenal_educativo.smart_notifications(priority, created_at);

-- ÍNDICES PARA EXERCISE PLAYLISTS
CREATE INDEX IF NOT EXISTS idx_arsenal_playlists_user_id ON arsenal_educativo.exercise_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_playlists_type ON arsenal_educativo.exercise_playlists(playlist_type);
CREATE INDEX IF NOT EXISTS idx_arsenal_playlists_public ON arsenal_educativo.exercise_playlists(is_public, is_featured) WHERE is_public = TRUE;

-- ÍNDICES PARA PLAYLIST ITEMS
CREATE INDEX IF NOT EXISTS idx_arsenal_playlist_items_playlist_id ON arsenal_educativo.playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_playlist_items_position ON arsenal_educativo.playlist_items(playlist_id, position);

-- ÍNDICES PARA PAES SIMULATIONS ADVANCED
CREATE INDEX IF NOT EXISTS idx_arsenal_paes_simulations_user_id ON arsenal_educativo.paes_simulations_advanced(user_id);
CREATE INDEX IF NOT EXISTS idx_arsenal_paes_simulations_type ON arsenal_educativo.paes_simulations_advanced(simulation_type);
CREATE INDEX IF NOT EXISTS idx_arsenal_paes_simulations_status ON arsenal_educativo.paes_simulations_advanced(status, created_at);

-- =====================================================================================
-- CONFIGURACIÓN DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- =====================================================================================

-- HABILITAR RLS EN TODAS LAS TABLAS DEL ARSENAL
ALTER TABLE arsenal_educativo.neural_cache_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.smart_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.exercise_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE arsenal_educativo.paes_simulations_advanced ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- POLÍTICAS RLS BÁSICAS DE SEGURIDAD POR USUARIO
-- =====================================================================================

-- POLÍTICAS PARA NEURAL CACHE SESSIONS
CREATE POLICY "Arsenal: Users can access their own neural cache" 
ON arsenal_educativo.neural_cache_sessions FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA REAL TIME ANALYTICS METRICS
CREATE POLICY "Arsenal: Users can access their own analytics metrics" 
ON arsenal_educativo.real_time_analytics_metrics FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA HUD REAL TIME SESSIONS
CREATE POLICY "Arsenal: Users can access their own HUD sessions" 
ON arsenal_educativo.hud_real_time_sessions FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA SMART NOTIFICATIONS
CREATE POLICY "Arsenal: Users can access their own notifications" 
ON arsenal_educativo.smart_notifications FOR ALL 
USING (auth.uid() = user_id);

-- POLÍTICAS PARA EXERCISE PLAYLISTS
CREATE POLICY "Arsenal: Users can access their own playlists" 
ON arsenal_educativo.exercise_playlists FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Arsenal: Public playlists are readable by everyone" 
ON arsenal_educativo.exercise_playlists FOR SELECT 
USING (is_public = TRUE);

-- POLÍTICAS PARA PLAYLIST ITEMS
CREATE POLICY "Arsenal: Users can access their playlist items" 
ON arsenal_educativo.playlist_items FOR ALL 
USING (auth.uid() = (SELECT user_id FROM arsenal_educativo.exercise_playlists WHERE id = playlist_id));

CREATE POLICY "Arsenal: Public playlist items are readable" 
ON arsenal_educativo.playlist_items FOR SELECT 
USING (playlist_id IN (SELECT id FROM arsenal_educativo.exercise_playlists WHERE is_public = TRUE));

-- POLÍTICAS PARA PAES SIMULATIONS ADVANCED
CREATE POLICY "Arsenal: Users can access their own simulations" 
ON arsenal_educativo.paes_simulations_advanced FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================================================
-- GRANTS DE ACCESO Y PERMISOS
-- =====================================================================================

-- Dar acceso completo a usuarios autenticados
GRANT USAGE ON SCHEMA arsenal_educativo TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA arsenal_educativo TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA arsenal_educativo TO authenticated;

-- Dar acceso de solo lectura a usuarios anónimos para playlists públicas
GRANT USAGE ON SCHEMA arsenal_educativo TO anon;
GRANT SELECT ON arsenal_educativo.exercise_playlists TO anon;

SELECT 'Índices optimizados y permisos RLS configurados correctamente' as resultado;
