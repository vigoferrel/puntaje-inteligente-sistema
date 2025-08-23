-- =====================================================
-- DIAGNÓSTICO Y CORRECCIÓN COMPLETA - SKILL_ID
-- Solución definitiva para problemas de FK y UUIDs
-- Tiempo estimado: 2 minutos
-- =====================================================

-- PASO 1: Diagnóstico completo del problema
SELECT '=== DIAGNÓSTICO COMPLETO ===' as status;

-- Verificar si paes_skill_mapping tiene datos
SELECT 'Contenido de paes_skill_mapping:' as diagnostico;
SELECT 
    integer_id,
    skill_name,
    skill_code,
    LEFT(uuid_id::text, 8) || '...' as uuid_preview
FROM paes_skill_mapping 
ORDER BY integer_id;

-- Verificar si las funciones existen
SELECT 'Verificando funciones:' as diagnostico;
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN ('get_skill_uuid', 'get_test_uuid');

-- PASO 2: Limpiar datos problemáticos si existen
DELETE FROM learning_nodes WHERE subject = 'COMPETENCIA_LECTORA';

-- PASO 3: Eliminar FK problemática si existe
DO $$
DECLARE
    constraint_name_var TEXT;
BEGIN
    SELECT tc.constraint_name INTO constraint_name_var
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'learning_nodes'
        AND kcu.column_name = 'skill_id'
    LIMIT 1;
    
    IF constraint_name_var IS NOT NULL THEN
        EXECUTE format('ALTER TABLE learning_nodes DROP CONSTRAINT %I', constraint_name_var);
        RAISE NOTICE 'FK eliminada: %', constraint_name_var;
    END IF;
END $$;

-- PASO 4: Repoblar paes_skill_mapping con UUIDs fijos y conocidos
TRUNCATE TABLE paes_skill_mapping RESTART IDENTITY CASCADE;

INSERT INTO paes_skill_mapping (integer_id, skill_name, skill_code, description, uuid_id) VALUES
(1, 'localizar-informacion', 'LOC', 'Encontrar y extraer información específica de textos', '11111111-1111-1111-1111-111111111111'),
(2, 'interpretar-relacionar', 'INT', 'Conectar conceptos y establecer relaciones', '22222222-2222-2222-2222-222222222222'),
(3, 'analizar-sintetizar', 'ANA', 'Descomponer información y reorganizar elementos', '33333333-3333-3333-3333-333333333333'),
(4, 'evaluar-reflexionar', 'EVA', 'Juzgar calidad, validez y reflexionar críticamente', '44444444-4444-4444-4444-444444444444'),
(5, 'resolver-problemas', 'RES', 'Aplicar conocimientos para resolver situaciones', '55555555-5555-5555-5555-555555555555'),
(6, 'modelar', 'MOD', 'Representar situaciones usando modelos matemáticos', '66666666-6666-6666-6666-666666666666'),
(7, 'argumentar-comunicar', 'ARG', 'Justificar razonamientos y comunicar ideas', '77777777-7777-7777-7777-777777777777');

-- PASO 5: Recrear función get_skill_uuid con manejo de errores mejorado
CREATE OR REPLACE FUNCTION get_skill_uuid(skill_name_input TEXT)
RETURNS UUID AS $$
DECLARE
    result_uuid UUID;
BEGIN
    SELECT uuid_id INTO result_uuid 
    FROM paes_skill_mapping 
    WHERE skill_name = skill_name_input;
    
    IF result_uuid IS NULL THEN
        RAISE EXCEPTION 'SKILL NO ENCONTRADO: %. Habilidades disponibles: %', 
            skill_name_input,
            (SELECT string_agg(skill_name, ', ') FROM paes_skill_mapping);
    END IF;
    
    RETURN result_uuid;
END;
$$ LANGUAGE plpgsql;

-- PASO 6: Agregar constraint UNIQUE a uuid_id
ALTER TABLE paes_skill_mapping DROP CONSTRAINT IF EXISTS paes_skill_mapping_uuid_id_unique;
ALTER TABLE paes_skill_mapping ADD CONSTRAINT paes_skill_mapping_uuid_id_unique UNIQUE (uuid_id);

-- PASO 7: Recrear FK correctamente
ALTER TABLE learning_nodes 
ADD CONSTRAINT learning_nodes_skill_id_fkey 
FOREIGN KEY (skill_id) REFERENCES paes_skill_mapping(uuid_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- PASO 8: Probar las funciones con los nuevos UUIDs
SELECT 'Probando funciones con UUIDs fijos:' as test;

SELECT 
    skill_name,
    get_skill_uuid(skill_name) as uuid_generado,
    uuid_id as uuid_real,
    CASE 
        WHEN get_skill_uuid(skill_name) = uuid_id THEN '✅ CORRECTO'
        ELSE '❌ ERROR'
    END as validacion
FROM paes_skill_mapping
ORDER BY integer_id;

-- PASO 9: Insertar UN NODO DE PRUEBA para validar
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES (
    'CL-TEST', 'NODO DE PRUEBA', 
    'Nodo de prueba para validar el sistema', 
    'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
    ARRAY['interpretar-relacionar'], 
    'contemporáneo', 'universal', 'textual', 'recordar', 'básico', 1.0, 2.0,
    ARRAY['test'], get_test_uuid(1)
);

-- PASO 10: Verificar que el nodo de prueba se insertó correctamente
SELECT 'Verificando inserción de nodo de prueba:' as verificacion;
SELECT 
    code,
    title,
    subject,
    skill_id,
    test_id
FROM learning_nodes 
WHERE code = 'CL-TEST';

-- PASO 11: Limpiar nodo de prueba
DELETE FROM learning_nodes WHERE code = 'CL-TEST';

-- PASO 12: Mensaje final
SELECT '🎯 SISTEMA CORREGIDO COMPLETAMENTE' as resultado;
SELECT 'UUIDs fijos implementados para estabilidad' as detalle;
SELECT 'FK configurada correctamente' as foreign_key;
SELECT 'Listo para insertar 30 nodos de Competencia Lectora' as siguiente_paso;

-- =====================================================
-- FIN DEL SCRIPT - CORRECCIÓN COMPLETA IMPLEMENTADA
-- =====================================================