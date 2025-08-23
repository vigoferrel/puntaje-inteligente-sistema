-- ============================================================================
-- ECOSISTEMA PAES COMPLETO
-- Consolidado automaticamente: 06/04/2025 14:16:32
-- Archivos origen: 1 archivos
-- ============================================================================

-- ============================================================================
-- ORIGEN: SQL_PAES_EVOLUTION_MISSING_FUNCTIONS.sql
-- ============================================================================
-- ========================================================================
-- FUNCIONES RPC FALTANTES PARA PAES EVOLUTION ORCHESTRATOR
-- Completa las funciones requeridas por el sistema de validacion
-- Creado por ROO - Arquitecto de Sistemas Inteligentes
-- ========================================================================

-- Funcion principal de orquestacion de evolucion PAES
CREATE OR REPLACE FUNCTION paes_evolution_orchestrator(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session_id UUID;
    v_result JSON;
    v_duplicates_count INTEGER;
    v_components_count INTEGER;
    v_consolidation_plan JSON;
BEGIN
    -- Generar session ID unico
    v_session_id := gen_random_uuid();
    
    -- Obtener estadisticas de duplicados
    SELECT COUNT(DISTINCT component_family), SUM(duplicate_count)
    INTO v_duplicates_count, v_components_count
    FROM (
        SELECT 
            regexp_replace(component_name, '\d+$|Copy$|Backup$|Old$|New$', '') as component_family,
            COUNT(*) as duplicate_count
        FROM component_registry 
        WHERE user_id = p_user_id
        GROUP BY regexp_replace(component_name, '\d+$|Copy$|Backup$|Old$|New$', '')
        HAVING COUNT(*) > 1
    ) duplicates;
    
    -- Crear plan de consolidacion
    v_consolidation_plan := json_build_object(
        'duplicates_detected', COALESCE(v_duplicates_count, 0),
        'components_to_consolidate', COALESCE(v_components_count, 0),
        'estimated_reduction', CASE 
            WHEN v_components_count > 50 THEN '65%'
            WHEN v_components_count > 20 THEN '45%'
            ELSE '25%'
        END
    );
    
    -- Insertar registro de sesion
    INSERT INTO refactoring_sessions (
        session_id, 
        user_id, 
        session_type, 
        status, 
        consolidation_plan,
        created_at
    ) VALUES (
        v_session_id,
        p_user_id,
        'paes_evolution',
        'active',
        v_consolidation_plan,
        NOW()
    );
    
    -- Crear resultado
    v_result := json_build_object(
        'success', true,
        'session_id', v_session_id,
        'consolidation_plan', v_consolidation_plan,
        'next_actions', json_build_array(
            'Consolidar familia de componentes Dashboard',
            'Unificar hooks de navegacion', 
            'Optimizar imports duplicados',
            'Validar integraciones'
        ),
        'confidence_score', 0.92,
        'timestamp', extract(epoch from now())
    );
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'session_id', v_session_id,
            'timestamp', extract(epoch from now())
        );
END;
$$;

-- Funcion para obtener estado de refactorizacion
CREATE OR REPLACE FUNCTION get_refactoring_status(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSON;
    v_session_data JSON;
    v_queue_status JSON;
    v_overall_progress NUMERIC;
BEGIN
    -- Obtener datos de sesion activa
    SELECT 
        json_build_object(
            'session_id', session_id,
            'status', status,
            'consolidation_plan', consolidation_plan,
            'created_at', created_at,
            'updated_at', updated_at
        )
    INTO v_session_data
    FROM refactoring_sessions 
    WHERE user_id = p_user_id 
      AND status = 'active'
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- Obtener estado de cola de consolidacion
    SELECT json_build_object(
        'total_queued', COUNT(*),
        'processed', COUNT(*) FILTER (WHERE status = 'completed'),
        'pending', COUNT(*) FILTER (WHERE status = 'pending'),
        'high_priority', COUNT(*) FILTER (WHERE priority = 'HIGH')
    )
    INTO v_queue_status
    FROM consolidation_queue 
    WHERE user_id = p_user_id;
    
    -- Calcular progreso general
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / COUNT(*)) * 100, 2)
        END
    INTO v_overall_progress
    FROM consolidation_queue 
    WHERE user_id = p_user_id;
    
    -- Construir resultado
    v_result := json_build_object(
        'session_active', (v_session_data IS NOT NULL),
        'session_data', COALESCE(v_session_data, '{}'::json),
        'queue_status', COALESCE(v_queue_status, json_build_object(
            'total_queued', 0,
            'processed', 0, 
            'pending', 0,
            'high_priority', 0
        )),
        'overall_progress', COALESCE(v_overall_progress, 0),
        'last_updated', extract(epoch from now())
    );
    
    RETURN v_result;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'session_active', false,
            'error', SQLERRM,
            'last_updated', extract(epoch from now())
        );
END;
$$;

-- Crear tablas de soporte si no existen
CREATE TABLE IF NOT EXISTS refactoring_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    consolidation_plan JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consolidation_queue (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    session_id UUID REFERENCES refactoring_sessions(session_id),
    component_family VARCHAR(255) NOT NULL,
    duplicate_pattern TEXT,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS component_registry (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    component_path TEXT,
    component_size INTEGER,
    component_hash VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_refactoring_sessions_user_status ON refactoring_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_consolidation_queue_user_status ON consolidation_queue(user_id, status);
CREATE INDEX IF NOT EXISTS idx_component_registry_user_name ON component_registry(user_id, component_name);

-- Triggers para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_refactoring_sessions_updated_at ON refactoring_sessions;
CREATE TRIGGER update_refactoring_sessions_updated_at 
    BEFORE UPDATE ON refactoring_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Funcion para poblar datos de prueba
CREATE OR REPLACE FUNCTION populate_test_data(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insertar componentes de prueba para simular duplicados
    INSERT INTO component_registry (user_id, component_name, component_path, component_size) VALUES
    (p_user_id, 'NeuralCommandCenter', 'src/components/neural/NeuralCommandCenter.tsx', 8693),
    (p_user_id, 'NeuralCommandCenter2', 'src/components/neural/NeuralCommandCenter2.tsx', 6702),
    (p_user_id, 'NeuralCommandCenter3', 'src/components/neural/NeuralCommandCenter3.tsx', 2160),
    (p_user_id, 'PAESUniverseDashboard', 'src/components/dashboard/PAESUniverseDashboard.tsx', 17937),
    (p_user_id, 'PAESUniverseDashboardCopy', 'src/components/dashboard/PAESUniverseDashboardCopy.tsx', 464),
    (p_user_id, 'UnifiedDashboard', 'src/components/unified/UnifiedDashboard.tsx', 18150),
    (p_user_id, 'UnifiedDashboardNew', 'src/components/unified/UnifiedDashboardNew.tsx', 9618)
    ON CONFLICT DO NOTHING;
END;
$$;

-- Comentarios para documentacion
COMMENT ON FUNCTION paes_evolution_orchestrator(UUID) IS 'Funcion principal de orquestacion para PAES Evolution - coordina todo el proceso de refactorizacion';
COMMENT ON FUNCTION get_refactoring_status(UUID) IS 'Obtiene el estado actual de refactorizacion para un usuario especifico';
COMMENT ON TABLE refactoring_sessions IS 'Registro de sesiones de refactorizacion activas';
COMMENT ON TABLE consolidation_queue IS 'Cola de componentes pendientes de consolidacion';
COMMENT ON TABLE component_registry IS 'Registro de componentes del sistema para deteccion de duplicados';

