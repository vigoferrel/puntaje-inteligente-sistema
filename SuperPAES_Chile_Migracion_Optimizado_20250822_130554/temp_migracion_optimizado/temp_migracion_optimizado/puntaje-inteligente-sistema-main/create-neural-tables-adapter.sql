-- LEONARDO NEURAL ENGINE - ADAPTADOR PARA TABLAS EXISTENTES
-- Solución real para producción - mapeo de tablas bloom a neural

-- Crear vista para neural_config usando configuración por defecto
CREATE OR REPLACE VIEW neural_config AS
SELECT 
    1 as id,
    jsonb_build_object(
        'predictionAccuracy', 0.85,
        'learningRate', 0.01,
        'adaptationSpeed', 0.05,
        'confidenceThreshold', 0.7,
        'maxVariations', 10,
        'analyticsInterval', 30000,
        'cacheExpiry', 300000
    ) as config,
    NOW() as created_at;

-- Crear vista para user_performance mapeando desde bloom_progress
CREATE OR REPLACE VIEW user_performance AS
SELECT 
    id::text as id,
    user_id,
    subject,
    COALESCE(neural_score, efficiency, 450) as score,
    created_at,
    ARRAY['comprension', 'calculo'] as error_categories,
    CASE 
        WHEN precision >= 90 THEN 5
        WHEN precision >= 70 THEN 4
        WHEN precision >= 50 THEN 3
        WHEN precision >= 30 THEN 2
        ELSE 1
    END as difficulty,
    COALESCE(time_spent, 1800) as duration
FROM bloom_progress
WHERE user_id IS NOT NULL;

-- Crear vista para study_sessions mapeando desde bloom_learning_sessions
CREATE OR REPLACE VIEW study_sessions AS
SELECT
    id::text as id,
    user_id,
    subject,
    COALESCE(duration_minutes * 60, 1800) as duration,
    COALESCE(score, 50) as score,
    CASE
        WHEN score >= 90 THEN 5
        WHEN score >= 70 THEN 4
        WHEN score >= 50 THEN 3
        WHEN score >= 30 THEN 2
        ELSE 1
    END as difficulty,
    session_start as created_at
FROM bloom_learning_sessions
WHERE user_id IS NOT NULL;

-- Otorgar permisos
GRANT SELECT ON neural_config TO authenticated;
GRANT SELECT ON user_performance TO authenticated;
GRANT SELECT ON study_sessions TO authenticated;

-- Comentarios
COMMENT ON VIEW neural_config IS 'Vista adaptadora para Leonardo Neural Engine - configuración';
COMMENT ON VIEW user_performance IS 'Vista adaptadora para Leonardo Neural Engine - rendimiento de usuario';
COMMENT ON VIEW study_sessions IS 'Vista adaptadora para Leonardo Neural Engine - sesiones de estudio';