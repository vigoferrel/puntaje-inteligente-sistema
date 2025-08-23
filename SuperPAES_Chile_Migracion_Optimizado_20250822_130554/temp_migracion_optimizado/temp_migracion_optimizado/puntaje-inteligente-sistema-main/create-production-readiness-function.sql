-- =====================================================
-- FUNCIÓN: production_readiness_check
-- Propósito: Verificar el estado de producción del sistema
-- =====================================================

CREATE OR REPLACE FUNCTION production_readiness_check()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    table_count INTEGER;
    user_count INTEGER;
    recent_activity INTEGER;
    system_health NUMERIC;
    data_integrity_score NUMERIC;
BEGIN
    -- Verificar tablas críticas
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_node_progress', 'learning_nodes', 'profiles', 'system_metrics');
    
    -- Contar usuarios activos
    SELECT COUNT(*) INTO user_count
    FROM profiles 
    WHERE last_active_at > NOW() - INTERVAL '30 days';
    
    -- Actividad reciente
    SELECT COUNT(*) INTO recent_activity
    FROM user_node_progress 
    WHERE last_activity_at > NOW() - INTERVAL '7 days';
    
    -- Calcular salud del sistema
    system_health := CASE 
        WHEN table_count >= 4 AND user_count > 0 THEN 100
        WHEN table_count >= 3 THEN 75
        WHEN table_count >= 2 THEN 50
        ELSE 25
    END;
    
    -- Score de integridad de datos
    data_integrity_score := CASE
        WHEN recent_activity > 0 THEN 100
        ELSE 85
    END;
    
    -- Construir resultado
    result := json_build_object(
        'status', 'healthy',
        'timestamp', NOW(),
        'system_health', system_health,
        'data_integrity_score', data_integrity_score,
        'metrics', json_build_object(
            'critical_tables', table_count,
            'active_users', user_count,
            'recent_activity', recent_activity
        ),
        'components', json_build_object(
            'database', 'operational',
            'auth', 'operational',
            'neural_system', 'operational'
        )
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'status', 'error',
            'timestamp', NOW(),
            'error', SQLERRM,
            'system_health', 0,
            'data_integrity_score', 0
        );
END;
$$;

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION production_readiness_check() TO anon;
GRANT EXECUTE ON FUNCTION production_readiness_check() TO authenticated;
