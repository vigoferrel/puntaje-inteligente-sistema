-- =====================================================================================
-- ARSENAL EDUCATIVO - POLITICAS RLS DE SEGURIDAD
-- =====================================================================================

-- RLS para neural_cache_sessions
ALTER TABLE neural_cache_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own cache sessions" ON neural_cache_sessions FOR ALL USING (auth.uid() = user_id);

-- RLS para real_time_analytics_metrics
ALTER TABLE real_time_analytics_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own analytics metrics" ON real_time_analytics_metrics FOR ALL USING (auth.uid() = user_id);

-- RLS para hud_real_time_sessions
ALTER TABLE hud_real_time_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own HUD sessions" ON hud_real_time_sessions FOR ALL USING (auth.uid() = user_id);

-- RLS para smart_notifications
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own notifications" ON smart_notifications FOR ALL USING (auth.uid() = user_id);

-- RLS para exercise_playlists
ALTER TABLE exercise_playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own playlists" ON exercise_playlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view public playlists" ON exercise_playlists FOR SELECT USING (is_public = true);

-- RLS para playlist_items
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their playlist items" ON playlist_items FOR ALL USING (auth.uid() = (SELECT user_id FROM exercise_playlists WHERE id = playlist_id));

-- RLS para paes_simulations_advanced
ALTER TABLE paes_simulations_advanced ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own simulations" ON paes_simulations_advanced FOR ALL USING (auth.uid() = user_id);
