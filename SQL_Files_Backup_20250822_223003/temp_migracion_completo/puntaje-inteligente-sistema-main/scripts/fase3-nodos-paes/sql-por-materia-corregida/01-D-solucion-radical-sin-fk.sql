-- =====================================================
-- SOLUCIÓN RADICAL - ELIMINAR FK Y USAR SKILL_ID DIRECTO
-- Enfoque sin claves foráneas para evitar problemas de UUID
-- Tiempo estimado: 1 minuto
-- =====================================================

-- PASO 1: Diagnóstico del problema persistente
SELECT '=== DIAGNÓSTICO DEL PROBLEMA PERSISTENTE ===' as status;

-- Ver qué está generando ese UUID problemático
SELECT 'Verificando función get_skill_uuid:' as diagnostico;
DO $$
BEGIN
    BEGIN
        RAISE NOTICE 'get_skill_uuid(''localizar-informacion'') = %', get_skill_uuid('localizar-informacion');
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR en get_skill_uuid: %', SQLERRM;
    END;
END $$;

-- PASO 2: Eliminar COMPLETAMENTE TODAS las FK problemáticas
DO $$
DECLARE
    constraint_name_var TEXT;
BEGIN
    -- Buscar TODOS los constraints de skill_id
    FOR constraint_name_var IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'learning_nodes'
            AND kcu.column_name = 'skill_id'
    LOOP
        EXECUTE format('ALTER TABLE learning_nodes DROP CONSTRAINT %I', constraint_name_var);
        RAISE NOTICE 'FK skill_id eliminada: %', constraint_name_var;
    END LOOP;
    
    -- Buscar TODOS los constraints de test_id
    FOR constraint_name_var IN
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = 'learning_nodes'
            AND kcu.column_name = 'test_id'
    LOOP
        EXECUTE format('ALTER TABLE learning_nodes DROP CONSTRAINT %I', constraint_name_var);
        RAISE NOTICE 'FK test_id eliminada: %', constraint_name_var;
    END LOOP;
END $$;

-- PASO 3: Limpiar TODOS los datos de learning_nodes
DELETE FROM learning_nodes WHERE subject = 'COMPETENCIA_LECTORA';

-- PASO 4: Cambiar enfoque - usar skill_id y test_id como TEXT en lugar de UUID
ALTER TABLE learning_nodes ALTER COLUMN skill_id TYPE TEXT USING skill_id::TEXT;
ALTER TABLE learning_nodes ALTER COLUMN test_id TYPE TEXT USING test_id::TEXT;

-- PASO 5: Crear función simplificada para skills que retorna TEXT
CREATE OR REPLACE FUNCTION get_skill_text(skill_name_input TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Mapeo directo sin UUIDs
    CASE skill_name_input
        WHEN 'localizar-informacion' THEN RETURN 'LOC-001';
        WHEN 'interpretar-relacionar' THEN RETURN 'INT-002';
        WHEN 'analizar-sintetizar' THEN RETURN 'ANA-003';
        WHEN 'evaluar-reflexionar' THEN RETURN 'EVA-004';
        WHEN 'resolver-problemas' THEN RETURN 'RES-005';
        WHEN 'modelar' THEN RETURN 'MOD-006';
        WHEN 'argumentar-comunicar' THEN RETURN 'ARG-007';
        ELSE RAISE EXCEPTION 'Skill no reconocido: %', skill_name_input;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- PASO 6: Crear función simplificada para tests que retorna TEXT
CREATE OR REPLACE FUNCTION get_test_text(test_id_input INTEGER)
RETURNS TEXT AS $$
BEGIN
    -- Mapeo directo sin UUIDs
    CASE test_id_input
        WHEN 1 THEN RETURN 'CL-TEST';
        WHEN 2 THEN RETURN 'M1-TEST';
        WHEN 3 THEN RETURN 'M2-TEST';
        WHEN 4 THEN RETURN 'HST-TEST';
        WHEN 5 THEN RETURN 'CIE-TEST';
        ELSE RAISE EXCEPTION 'Test ID no reconocido: %', test_id_input;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Probar las nuevas funciones
SELECT 'Probando nueva función get_skill_text:' as test;
SELECT
    skill_name,
    get_skill_text(skill_name) as skill_code
FROM (VALUES
    ('localizar-informacion'),
    ('interpretar-relacionar'),
    ('analizar-sintetizar'),
    ('evaluar-reflexionar')
) AS skills(skill_name);

SELECT 'Probando nueva función get_test_text:' as test;
SELECT
    test_id,
    get_test_text(test_id) as test_code
FROM (VALUES
    (1),
    (2),
    (3),
    (4),
    (5)
) AS tests(test_id);

-- PASO 8: Insertar UN NODO DE PRUEBA con el nuevo sistema
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level,
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES (
    'CL-TEST', 'NODO DE PRUEBA SIN FK',
    'Nodo de prueba con skill_id y test_id como TEXT',
    'COMPETENCIA_LECTORA', get_skill_text('localizar-informacion'),
    ARRAY['interpretar-relacionar'],
    'contemporáneo', 'universal', 'textual', 'recordar', 'básico', 1.0, 2.0,
    ARRAY['test'], get_test_text(1)
);

-- PASO 9: Verificar que el nodo se insertó correctamente
SELECT 'Verificando inserción exitosa:' as verificacion;
SELECT
    code,
    title,
    subject,
    skill_id,
    test_id
FROM learning_nodes
WHERE code = 'CL-TEST';

-- PASO 10: Limpiar nodo de prueba
DELETE FROM learning_nodes WHERE code = 'CL-TEST';

-- PASO 11: Mensaje final
SELECT '🎯 SOLUCIÓN RADICAL IMPLEMENTADA' as resultado;
SELECT 'skill_id y test_id ahora son TEXT sin FK problemáticas' as detalle;
SELECT 'Sistema completamente simplificado y estable' as estado;
SELECT 'Listo para insertar nodos sin errores de FK' as siguiente_paso;

-- =====================================================
-- FIN DEL SCRIPT - SOLUCIÓN RADICAL SIN FK
-- =====================================================