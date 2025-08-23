-- =====================================================
-- MAPEO IDS PAES - POBLADO DE TABLAS Y FUNCIONES
-- Configuración completa de mapeos UUID-INTEGER
-- Tiempo estimado: 1 minuto
-- =====================================================

-- PASO 1: Verificar que las tablas de mapeo existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'paes_test_mapping') THEN
        RAISE EXCEPTION 'Tabla paes_test_mapping no existe. Ejecutar primero 00-estructura-base-completa.sql';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'paes_skill_mapping') THEN
        RAISE EXCEPTION 'Tabla paes_skill_mapping no existe. Ejecutar primero 00-estructura-base-completa.sql';
    END IF;
END $$;

-- PASO 2: Poblar mapeo de pruebas PAES (5 pruebas)
INSERT INTO paes_test_mapping (integer_id, test_name, test_code, description) VALUES
(1, 'Competencia Lectora', 'CL', 'Prueba de comprensión y análisis textual - 30 nodos'),
(2, 'Matemática M1', 'M1', 'Matemática básica obligatoria - 25 nodos'),
(3, 'Matemática M2', 'M2', 'Matemática avanzada electiva - 15 nodos'),
(4, 'Historia y Ciencias Sociales', 'HST', 'Historia, geografía y formación ciudadana - 65 nodos'),
(5, 'Ciencias', 'CIE', 'Biología, química y física - 65 nodos')
ON CONFLICT (integer_id) DO UPDATE SET
    test_name = EXCLUDED.test_name,
    test_code = EXCLUDED.test_code,
    description = EXCLUDED.description;

-- PASO 3: Poblar mapeo de habilidades PAES (7 habilidades principales)
INSERT INTO paes_skill_mapping (integer_id, skill_name, skill_code, description) VALUES
(1, 'localizar-informacion', 'LOC', 'Encontrar y extraer información específica de textos'),
(2, 'interpretar-relacionar', 'INT', 'Conectar conceptos y establecer relaciones'),
(3, 'analizar-sintetizar', 'ANA', 'Descomponer información y reorganizar elementos'),
(4, 'evaluar-reflexionar', 'EVA', 'Juzgar calidad, validez y reflexionar críticamente'),
(5, 'resolver-problemas', 'RES', 'Aplicar conocimientos para resolver situaciones'),
(6, 'modelar', 'MOD', 'Representar situaciones usando modelos matemáticos'),
(7, 'argumentar-comunicar', 'ARG', 'Justificar razonamientos y comunicar ideas')
ON CONFLICT (integer_id) DO UPDATE SET
    skill_name = EXCLUDED.skill_name,
    skill_code = EXCLUDED.skill_code,
    description = EXCLUDED.description;

-- PASO 4: Crear función para convertir integer_id a UUID para pruebas
CREATE OR REPLACE FUNCTION get_test_uuid(int_id INTEGER)
RETURNS UUID AS $$
DECLARE
    result_uuid UUID;
BEGIN
    SELECT uuid_id INTO result_uuid 
    FROM paes_test_mapping 
    WHERE integer_id = int_id;
    
    IF result_uuid IS NULL THEN
        RAISE EXCEPTION 'No se encontró mapeo para test_id: %', int_id;
    END IF;
    
    RETURN result_uuid;
END;
$$ LANGUAGE plpgsql;

-- PASO 5: Crear función para convertir skill_name a UUID para habilidades
CREATE OR REPLACE FUNCTION get_skill_uuid(skill_name_input TEXT)
RETURNS UUID AS $$
DECLARE
    result_uuid UUID;
BEGIN
    SELECT uuid_id INTO result_uuid 
    FROM paes_skill_mapping 
    WHERE skill_name = skill_name_input;
    
    IF result_uuid IS NULL THEN
        RAISE EXCEPTION 'No se encontró mapeo para skill_name: %', skill_name_input;
    END IF;
    
    RETURN result_uuid;
END;
$$ LANGUAGE plpgsql;

-- PASO 6: Crear función auxiliar para obtener skill por código
CREATE OR REPLACE FUNCTION get_skill_uuid_by_code(skill_code_input TEXT)
RETURNS UUID AS $$
DECLARE
    result_uuid UUID;
BEGIN
    SELECT uuid_id INTO result_uuid 
    FROM paes_skill_mapping 
    WHERE skill_code = skill_code_input;
    
    IF result_uuid IS NULL THEN
        RAISE EXCEPTION 'No se encontró mapeo para skill_code: %', skill_code_input;
    END IF;
    
    RETURN result_uuid;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Verificar que los mapeos se crearon correctamente
SELECT 'Verificando mapeos de pruebas PAES...' as status;

SELECT 
    integer_id,
    test_code,
    test_name,
    LEFT(uuid_id::text, 8) || '...' as uuid_preview
FROM paes_test_mapping 
ORDER BY integer_id;

SELECT 'Verificando mapeos de habilidades PAES...' as status;

SELECT 
    integer_id,
    skill_code,
    skill_name,
    LEFT(uuid_id::text, 8) || '...' as uuid_preview
FROM paes_skill_mapping 
ORDER BY integer_id;

-- PASO 8: Probar las funciones de conversión
SELECT 'Probando funciones de conversión...' as status;

-- Probar get_test_uuid()
SELECT 
    'get_test_uuid(1)' as funcion,
    get_test_uuid(1) as resultado,
    'Competencia Lectora' as esperado;

-- Probar get_skill_uuid()
SELECT 
    'get_skill_uuid(''localizar-informacion'')' as funcion,
    get_skill_uuid('localizar-informacion') as resultado,
    'localizar-informacion' as esperado;

-- PASO 9: Crear vista para facilitar consultas
CREATE OR REPLACE VIEW paes_mappings_summary AS
SELECT 
    'PRUEBAS' as tipo,
    COUNT(*) as total_registros,
    string_agg(test_code, ', ' ORDER BY integer_id) as codigos
FROM paes_test_mapping
UNION ALL
SELECT 
    'HABILIDADES' as tipo,
    COUNT(*) as total_registros,
    string_agg(skill_code, ', ' ORDER BY integer_id) as codigos
FROM paes_skill_mapping;

-- Mostrar resumen
SELECT * FROM paes_mappings_summary;

-- PASO 10: Mensaje final
SELECT 'MAPEOS UUID-INTEGER CONFIGURADOS CORRECTAMENTE' as resultado;
SELECT '5 pruebas PAES mapeadas' as pruebas;
SELECT '7 habilidades PAES mapeadas' as habilidades;
SELECT 'Funciones get_test_uuid() y get_skill_uuid() creadas' as funciones;
SELECT 'Listo para ejecutar archivos de nodos corregidos' as siguiente_paso;

-- =====================================================
-- FIN DEL SCRIPT - MAPEOS Y FUNCIONES IMPLEMENTADOS
-- =====================================================