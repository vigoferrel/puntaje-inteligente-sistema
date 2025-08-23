-- =====================================================================================
-- CREAR ESQUEMA ARSENAL_EDUCATIVO
-- =====================================================================================
-- Crea el esquema especializado para el Arsenal Educativo con función mejorada

-- CREAR ESQUEMA ESPECIALIZADO PARA EL ARSENAL
CREATE SCHEMA IF NOT EXISTS arsenal_educativo;

-- COMENTARIO EN EL ESQUEMA
COMMENT ON SCHEMA arsenal_educativo IS 'Arsenal Educativo: Cache Neural, Analytics, HUD, Playlists, SuperPAES';

-- FUNCIÓN BASE MEJORADA (Compatible con Leonardo si existe)
CREATE OR REPLACE FUNCTION enhanced_leonardo_inference(
    prompt TEXT,
    arsenal_context JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB AS $func$
DECLARE
    base_response JSONB;
    arsenal_metrics JSONB;
BEGIN
    -- Verificar si existe vigoleonrocks_inference
    IF EXISTS (
        SELECT 1 FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name = 'vigoleonrocks_inference'
    ) THEN
        -- Usar función Leonardo existente
        EXECUTE 'SELECT vigoleonrocks_inference($1)' INTO base_response USING prompt;
        
        -- Agregar contexto del Arsenal
        arsenal_metrics := jsonb_build_object(
            'leonardo_integration', true,
            'system', 'leonardo_enhanced',
            'quantum_volume', 888999111
        );
        
        RETURN jsonb_build_object(
            'leonardo_response', base_response,
            'arsenal_metrics', arsenal_metrics,
            'integration_version', '1.0.0',
            'unified_system', true
        );
    ELSE
        -- Función base cuando no hay Leonardo
        RETURN jsonb_build_object(
            'response', 'Arsenal Educativo Response: ' || prompt,
            'arsenal_context', arsenal_context,
            'timestamp', NOW(),
            'system', 'arsenal_only',
            'quantum_volume', 888999111
        );
    END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT 'Esquema arsenal_educativo creado con función mejorada' as resultado;
