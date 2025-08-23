-- =====================================================================================
-- ARSENAL EDUCATIVO - FUNCIONES RPC
-- =====================================================================================

-- FUNCION 1: Cache Neural Inteligente
CREATE OR REPLACE FUNCTION get_neural_cache_data(session_key_input TEXT)
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT cache_data
        FROM neural_cache_sessions
        WHERE user_id = auth.uid()
        AND session_key = session_key_input
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCION 2: Analytics en Tiempo Real
CREATE OR REPLACE FUNCTION get_real_time_metrics()
RETURNS JSONB AS $$
BEGIN
    RETURN jsonb_build_object(
        'current_session_metrics', (
            SELECT jsonb_agg(jsonb_build_object(
                'metric_type', metric_type,
                'metric_value', metric_value,
                'timestamp', timestamp_precise
            ))
            FROM real_time_analytics_metrics
            WHERE user_id = auth.uid()
            AND timestamp_precise >= NOW() - INTERVAL '1 hour'
        ),
        'engagement_score', (
            SELECT AVG(real_time_score)
            FROM real_time_analytics_metrics
            WHERE user_id = auth.uid()
            AND timestamp_precise >= NOW() - INTERVAL '24 hours'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCION 3: Sistema Spotify de Playlists
CREATE OR REPLACE FUNCTION get_recommended_playlists()
RETURNS JSONB AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(jsonb_build_object(
            'id', id,
            'title', title,
            'description', description,
            'playlist_type', playlist_type,
            'engagement_score', engagement_score,
            'total_exercises', total_exercises
        ))
        FROM exercise_playlists
        WHERE (user_id = auth.uid() OR is_public = true)
        ORDER BY engagement_score DESC, created_at DESC
        LIMIT 10
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCION 4: SuperPAES Predictivo
CREATE OR REPLACE FUNCTION create_paes_simulation(simulation_data JSONB)
RETURNS UUID AS $$
DECLARE
    simulation_id UUID;
BEGIN
    INSERT INTO paes_simulations_advanced (
        user_id,
        simulation_type,
        current_scores,
        simulation_parameters,
        status
    ) VALUES (
        auth.uid(),
        (simulation_data->>'simulation_type')::TEXT,
        simulation_data->'current_scores',
        simulation_data->'parameters',
        'pending'
    ) RETURNING id INTO simulation_id;
    
    RETURN simulation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
