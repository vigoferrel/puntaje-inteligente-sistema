-- =====================================================
-- SCRIPT DE REPARACIÓN COMPLETA DEL SISTEMA NEURAL
-- Resuelve errores 400 de Supabase y problemas de limpieza
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ACTUALIZACIÓN DEL ESQUEMA NEURAL_NODES
-- =====================================================

-- Agregar columnas faltantes de TLearningNode
ALTER TABLE neural_nodes 
ADD COLUMN IF NOT EXISTS title VARCHAR(200),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS content JSONB,
ADD COLUMN IF NOT EXISTS phase VARCHAR(50),
ADD COLUMN IF NOT EXISTS bloom_level_alt VARCHAR(20),
ADD COLUMN IF NOT EXISTS estimated_time INTEGER,
ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS depends_on TEXT[],
ADD COLUMN IF NOT EXISTS learning_objectives TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS resources TEXT[],
ADD COLUMN IF NOT EXISTS position INTEGER,
ADD COLUMN IF NOT EXISTS cognitive_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS cognitive_level_alt VARCHAR(50),
ADD COLUMN IF NOT EXISTS subject_area VARCHAR(100),
ADD COLUMN IF NOT EXISTS subject_area_alt VARCHAR(100),
ADD COLUMN IF NOT EXISTS code VARCHAR(50),
ADD COLUMN IF NOT EXISTS skill_id INTEGER,
ADD COLUMN IF NOT EXISTS test_id INTEGER,
ADD COLUMN IF NOT EXISTS tier_priority VARCHAR(50),
ADD COLUMN IF NOT EXISTS domain_category VARCHAR(100),
ADD COLUMN IF NOT EXISTS base_weight DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS difficulty_multiplier DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS frequency_bonus DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS prerequisite_weight DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS adaptive_adjustment DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS bloom_complexity_score DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS paes_frequency DECIMAL(5,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS validation_status VARCHAR(20) DEFAULT 'pending';

-- Actualizar constraints existentes
ALTER TABLE neural_nodes 
DROP CONSTRAINT IF EXISTS neural_nodes_tier_check,
ADD CONSTRAINT neural_nodes_tier_check CHECK (tier IN (1, 2, 3));

ALTER TABLE neural_nodes 
DROP CONSTRAINT IF EXISTS neural_nodes_difficulty_check,
ADD CONSTRAINT neural_nodes_difficulty_check CHECK (difficulty_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED'));

ALTER TABLE neural_nodes 
DROP CONSTRAINT IF EXISTS neural_nodes_bloom_check,
ADD CONSTRAINT neural_nodes_bloom_check CHECK (bloom_level IN ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE'));

-- Agregar nuevos constraints
ALTER TABLE neural_nodes 
ADD CONSTRAINT neural_nodes_tier_priority_check CHECK (tier_priority IN ('tier1_critico', 'tier2_importante', 'tier3_complementario')),
ADD CONSTRAINT neural_nodes_validation_check CHECK (validation_status IN ('pending', 'valid', 'invalid', 'needs_review'));

-- =====================================================
-- 2. TABLAS DE SOPORTE PARA SEQUENTIAL THINKING
-- =====================================================

-- Tabla para sesiones de pensamiento secuencial
CREATE TABLE IF NOT EXISTS sequential_thinking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) REFERENCES neural_nodes(id),
    session_data JSONB NOT NULL,
    thought_count INTEGER DEFAULT 0,
    completion_status VARCHAR(20) DEFAULT 'in_progress',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para registro de limpieza automática
CREATE TABLE IF NOT EXISTS node_cleanup_log (
    id SERIAL PRIMARY KEY,
    cleanup_type VARCHAR(50) NOT NULL,
    affected_nodes TEXT[],
    issues_found JSONB,
    actions_taken JSONB,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para nodos problemáticos identificados
CREATE TABLE IF NOT EXISTS problematic_nodes (
    id SERIAL PRIMARY KEY,
    node_id VARCHAR(100) NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    issue_description TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    auto_fixable BOOLEAN DEFAULT false,
    fix_attempted BOOLEAN DEFAULT false,
    fix_successful BOOLEAN DEFAULT false,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    UNIQUE(node_id, issue_type)
);

-- =====================================================
-- 3. FUNCIONES DE VALIDACIÓN Y LIMPIEZA
-- =====================================================

-- Función para detectar nodos problemáticos
CREATE OR REPLACE FUNCTION detect_problematic_nodes()
RETURNS TABLE(node_id VARCHAR, issue_type VARCHAR, description TEXT) AS $$
BEGIN
    -- Limpiar registros anteriores
    DELETE FROM problematic_nodes WHERE detected_at < NOW() - INTERVAL '1 hour';
    
    -- Detectar nodos con referencias circulares
    INSERT INTO problematic_nodes (node_id, issue_type, issue_description, severity, auto_fixable)
    SELECT DISTINCT 
        n1.id,
        'circular_dependency',
        'Nodo tiene dependencia circular con: ' || array_to_string(n1.prerequisites, ', '),
        'high',
        true
    FROM neural_nodes n1
    WHERE EXISTS (
        SELECT 1 FROM neural_nodes n2 
        WHERE n2.id = ANY(n1.prerequisites) 
        AND n1.id = ANY(n2.prerequisites)
    )
    ON CONFLICT (node_id, issue_type) DO NOTHING;
    
    -- Detectar nodos con prerequisites inexistentes
    INSERT INTO problematic_nodes (node_id, issue_type, issue_description, severity, auto_fixable)
    SELECT DISTINCT 
        n.id,
        'broken_prerequisites',
        'Nodo tiene prerequisites que no existen: ' || array_to_string(
            ARRAY(SELECT unnest(n.prerequisites) EXCEPT SELECT id FROM neural_nodes), ', '
        ),
        'medium',
        true
    FROM neural_nodes n
    WHERE EXISTS (
        SELECT 1 FROM unnest(n.prerequisites) AS prereq
        WHERE prereq NOT IN (SELECT id FROM neural_nodes)
    )
    ON CONFLICT (node_id, issue_type) DO NOTHING;
    
    -- Detectar nodos con propiedades inconsistentes
    INSERT INTO problematic_nodes (node_id, issue_type, issue_description, severity, auto_fixable)
    SELECT 
        id,
        'inconsistent_properties',
        'Propiedades duplicadas inconsistentes',
        'low',
        true
    FROM neural_nodes
    WHERE (cognitive_level IS NOT NULL AND cognitive_level_alt IS NOT NULL AND cognitive_level != cognitive_level_alt)
       OR (subject_area IS NOT NULL AND subject_area_alt IS NOT NULL AND subject_area != subject_area_alt)
    ON CONFLICT (node_id, issue_type) DO NOTHING;
    
    -- Detectar nodos con arrays corruptos
    INSERT INTO problematic_nodes (node_id, issue_type, issue_description, severity, auto_fixable)
    SELECT 
        id,
        'corrupted_arrays',
        'Arrays contienen elementos nulos o vacíos',
        'medium',
        true
    FROM neural_nodes
    WHERE (prerequisites IS NOT NULL AND '' = ANY(prerequisites))
       OR (learning_resources IS NOT NULL AND '' = ANY(learning_resources))
       OR (depends_on IS NOT NULL AND '' = ANY(depends_on))
       OR (learning_objectives IS NOT NULL AND '' = ANY(learning_objectives))
       OR (tags IS NOT NULL AND '' = ANY(tags))
       OR (resources IS NOT NULL AND '' = ANY(resources))
    ON CONFLICT (node_id, issue_type) DO NOTHING;
    
    -- Retornar resultados
    RETURN QUERY
    SELECT p.node_id, p.issue_type, p.issue_description
    FROM problematic_nodes p
    WHERE p.resolved_at IS NULL
    ORDER BY 
        CASE p.severity 
            WHEN 'high' THEN 1 
            WHEN 'medium' THEN 2 
            WHEN 'low' THEN 3 
        END;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar nodos problemáticos
CREATE OR REPLACE FUNCTION cleanup_problematic_nodes()
RETURNS JSONB AS $$
DECLARE
    cleanup_result JSONB := '{"fixed": 0, "errors": 0, "details": []}';
    node_record RECORD;
    fixed_count INTEGER := 0;
    error_count INTEGER := 0;
    start_time TIMESTAMP := NOW();
BEGIN
    -- Limpiar referencias circulares
    FOR node_record IN 
        SELECT DISTINCT node_id FROM problematic_nodes 
        WHERE issue_type = 'circular_dependency' AND resolved_at IS NULL
    LOOP
        BEGIN
            UPDATE neural_nodes 
            SET prerequisites = ARRAY(
                SELECT unnest(prerequisites) 
                EXCEPT 
                SELECT id FROM neural_nodes 
                WHERE id = ANY(neural_nodes.prerequisites) 
                AND neural_nodes.id = ANY(prerequisites)
            )
            WHERE id = node_record.node_id;
            
            UPDATE problematic_nodes 
            SET resolved_at = NOW(), fix_successful = true 
            WHERE node_id = node_record.node_id AND issue_type = 'circular_dependency';
            
            fixed_count := fixed_count + 1;
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
        END;
    END LOOP;
    
    -- Limpiar prerequisites rotos
    FOR node_record IN 
        SELECT DISTINCT node_id FROM problematic_nodes 
        WHERE issue_type = 'broken_prerequisites' AND resolved_at IS NULL
    LOOP
        BEGIN
            UPDATE neural_nodes 
            SET prerequisites = ARRAY(
                SELECT unnest(prerequisites) 
                INTERSECT 
                SELECT id FROM neural_nodes
            )
            WHERE id = node_record.node_id;
            
            UPDATE problematic_nodes 
            SET resolved_at = NOW(), fix_successful = true 
            WHERE node_id = node_record.node_id AND issue_type = 'broken_prerequisites';
            
            fixed_count := fixed_count + 1;
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
        END;
    END LOOP;
    
    -- Normalizar propiedades inconsistentes
    UPDATE neural_nodes 
    SET 
        cognitive_level_alt = cognitive_level,
        subject_area_alt = subject_area
    WHERE cognitive_level IS NOT NULL AND subject_area IS NOT NULL;
    
    UPDATE problematic_nodes 
    SET resolved_at = NOW(), fix_successful = true 
    WHERE issue_type = 'inconsistent_properties' AND resolved_at IS NULL;
    
    -- Limpiar arrays corruptos
    UPDATE neural_nodes 
    SET 
        prerequisites = ARRAY(SELECT unnest(prerequisites) WHERE unnest(prerequisites) != ''),
        learning_resources = ARRAY(SELECT unnest(learning_resources) WHERE unnest(learning_resources) != ''),
        depends_on = ARRAY(SELECT unnest(depends_on) WHERE unnest(depends_on) != ''),
        learning_objectives = ARRAY(SELECT unnest(learning_objectives) WHERE unnest(learning_objectives) != ''),
        tags = ARRAY(SELECT unnest(tags) WHERE unnest(tags) != ''),
        resources = ARRAY(SELECT unnest(resources) WHERE unnest(resources) != '')
    WHERE (prerequisites IS NOT NULL AND '' = ANY(prerequisites))
       OR (learning_resources IS NOT NULL AND '' = ANY(learning_resources))
       OR (depends_on IS NOT NULL AND '' = ANY(depends_on))
       OR (learning_objectives IS NOT NULL AND '' = ANY(learning_objectives))
       OR (tags IS NOT NULL AND '' = ANY(tags))
       OR (resources IS NOT NULL AND '' = ANY(resources));
    
    UPDATE problematic_nodes 
    SET resolved_at = NOW(), fix_successful = true 
    WHERE issue_type = 'corrupted_arrays' AND resolved_at IS NULL;
    
    -- Limpiar progreso huérfano
    DELETE FROM user_node_progress 
    WHERE node_id NOT IN (SELECT id FROM neural_nodes);
    
    -- Registrar la limpieza
    INSERT INTO node_cleanup_log (
        cleanup_type, 
        affected_nodes, 
        issues_found, 
        actions_taken, 
        success_count, 
        error_count,
        execution_time_ms
    ) VALUES (
        'auto_cleanup',
        ARRAY(SELECT DISTINCT node_id FROM problematic_nodes WHERE resolved_at >= start_time),
        (SELECT jsonb_agg(jsonb_build_object('node_id', node_id, 'issue', issue_type)) 
         FROM problematic_nodes WHERE resolved_at >= start_time),
        jsonb_build_object(
            'circular_deps_fixed', (SELECT COUNT(*) FROM problematic_nodes WHERE issue_type = 'circular_dependency' AND resolved_at >= start_time),
            'broken_prereqs_fixed', (SELECT COUNT(*) FROM problematic_nodes WHERE issue_type = 'broken_prerequisites' AND resolved_at >= start_time),
            'properties_normalized', (SELECT COUNT(*) FROM problematic_nodes WHERE issue_type = 'inconsistent_properties' AND resolved_at >= start_time),
            'arrays_cleaned', (SELECT COUNT(*) FROM problematic_nodes WHERE issue_type = 'corrupted_arrays' AND resolved_at >= start_time)
        ),
        fixed_count,
        error_count,
        EXTRACT(EPOCH FROM (NOW() - start_time)) * 1000
    );
    
    cleanup_result := jsonb_build_object(
        'fixed', fixed_count,
        'errors', error_count,
        'execution_time_ms', EXTRACT(EPOCH FROM (NOW() - start_time)) * 1000,
        'timestamp', NOW()
    );
    
    RETURN cleanup_result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 4. VISTAS PARA DATOS LIMPIOS
-- =====================================================

-- Vista de nodos saludables (sin problemas)
CREATE OR REPLACE VIEW healthy_nodes AS
SELECT n.*
FROM neural_nodes n
WHERE n.is_active = true
  AND n.validation_status = 'valid'
  AND n.id NOT IN (
      SELECT DISTINCT node_id 
      FROM problematic_nodes 
      WHERE resolved_at IS NULL 
        AND severity IN ('high', 'medium')
  );

-- Vista de progreso válido
CREATE OR REPLACE VIEW valid_user_progress AS
SELECT up.*
FROM user_node_progress up
INNER JOIN healthy_nodes hn ON up.node_id = hn.id;

-- =====================================================
-- 5. TRIGGERS PARA MANTENIMIENTO AUTOMÁTICO
-- =====================================================

-- Trigger para validar nodos al insertar/actualizar
CREATE OR REPLACE FUNCTION validate_node_on_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que no haya referencias circulares
    IF NEW.prerequisites IS NOT NULL THEN
        IF NEW.id = ANY(NEW.prerequisites) THEN
            RAISE EXCEPTION 'Un nodo no puede ser prerequisito de sí mismo';
        END IF;
    END IF;
    
    -- Normalizar propiedades duplicadas
    IF NEW.cognitive_level IS NOT NULL THEN
        NEW.cognitive_level_alt := NEW.cognitive_level;
    END IF;
    
    IF NEW.subject_area IS NOT NULL THEN
        NEW.subject_area_alt := NEW.subject_area;
    END IF;
    
    -- Limpiar arrays de elementos vacíos
    IF NEW.prerequisites IS NOT NULL THEN
        NEW.prerequisites := ARRAY(SELECT unnest(NEW.prerequisites) WHERE unnest(NEW.prerequisites) != '');
    END IF;
    
    -- Marcar como válido si pasa las validaciones básicas
    NEW.validation_status := 'valid';
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_node_on_change
    BEFORE INSERT OR UPDATE ON neural_nodes
    FOR EACH ROW
    EXECUTE FUNCTION validate_node_on_change();

-- =====================================================
-- 6. FUNCIÓN DE INICIALIZACIÓN COMPLETA
-- =====================================================

CREATE OR REPLACE FUNCTION initialize_neural_system()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    detection_result RECORD;
    cleanup_result JSONB;
BEGIN
    -- Paso 1: Detectar problemas
    PERFORM detect_problematic_nodes();
    
    -- Paso 2: Ejecutar limpieza
    SELECT cleanup_problematic_nodes() INTO cleanup_result;
    
    -- Paso 3: Validar todos los nodos existentes
    UPDATE neural_nodes 
    SET validation_status = 'valid', updated_at = NOW()
    WHERE id NOT IN (
        SELECT DISTINCT node_id 
        FROM problematic_nodes 
        WHERE resolved_at IS NULL
    );
    
    -- Paso 4: Crear índices adicionales si no existen
    CREATE INDEX IF NOT EXISTS idx_neural_nodes_validation ON neural_nodes(validation_status);
    CREATE INDEX IF NOT EXISTS idx_neural_nodes_active ON neural_nodes(is_active);
    CREATE INDEX IF NOT EXISTS idx_problematic_nodes_unresolved ON problematic_nodes(node_id) WHERE resolved_at IS NULL;
    CREATE INDEX IF NOT EXISTS idx_sequential_thinking_user ON sequential_thinking_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_cleanup_log_type ON node_cleanup_log(cleanup_type);
    
    result := jsonb_build_object(
        'status', 'success',
        'cleanup_result', cleanup_result,
        'healthy_nodes_count', (SELECT COUNT(*) FROM healthy_nodes),
        'total_nodes_count', (SELECT COUNT(*) FROM neural_nodes),
        'remaining_issues', (SELECT COUNT(*) FROM problematic_nodes WHERE resolved_at IS NULL),
        'timestamp', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. EJECUCIÓN INICIAL
-- =====================================================

-- Ejecutar la inicialización completa del sistema
SELECT initialize_neural_system();

-- Mostrar resumen del estado del sistema
SELECT 
    'RESUMEN DEL SISTEMA NEURAL' as status,
    (SELECT COUNT(*) FROM neural_nodes) as total_nodes,
    (SELECT COUNT(*) FROM healthy_nodes) as healthy_nodes,
    (SELECT COUNT(*) FROM problematic_nodes WHERE resolved_at IS NULL) as remaining_issues,
    (SELECT COUNT(*) FROM user_node_progress) as user_progress_records,
    NOW() as timestamp;

-- =====================================================
-- 8. COMANDOS DE MANTENIMIENTO RECOMENDADOS
-- =====================================================

/*
-- Para ejecutar limpieza manual:
SELECT cleanup_problematic_nodes();

-- Para detectar nuevos problemas:
SELECT * FROM detect_problematic_nodes();

-- Para ver el estado de salud del sistema:
SELECT * FROM healthy_nodes LIMIT 10;

-- Para ver problemas pendientes:
SELECT * FROM problematic_nodes WHERE resolved_at IS NULL;

-- Para ver historial de limpiezas:
SELECT * FROM node_cleanup_log ORDER BY created_at DESC LIMIT 5;
*/