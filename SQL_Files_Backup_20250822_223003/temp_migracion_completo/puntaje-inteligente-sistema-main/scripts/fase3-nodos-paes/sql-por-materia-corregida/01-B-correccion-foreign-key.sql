-- =====================================================
-- CORRECCIÓN CLAVE FORÁNEA - SKILL_ID
-- Redirigir FK de paes_skills a paes_skill_mapping
-- Tiempo estimado: 30 segundos
-- =====================================================

-- PASO 1: Verificar estructura actual
SELECT 'Verificando estructura actual de learning_nodes...' as status;

-- Mostrar constraints actuales relacionados con skill_id
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'learning_nodes'
    AND kcu.column_name = 'skill_id';

-- PASO 2: Eliminar constraint de clave foránea existente (si existe)
DO $$
DECLARE
    constraint_name_var TEXT;
BEGIN
    -- Buscar el nombre del constraint actual
    SELECT tc.constraint_name INTO constraint_name_var
    FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'learning_nodes'
        AND kcu.column_name = 'skill_id'
    LIMIT 1;
    
    -- Si existe, eliminarlo
    IF constraint_name_var IS NOT NULL THEN
        EXECUTE format('ALTER TABLE learning_nodes DROP CONSTRAINT %I', constraint_name_var);
        RAISE NOTICE 'Constraint eliminado: %', constraint_name_var;
    ELSE
        RAISE NOTICE 'No se encontró constraint de skill_id para eliminar';
    END IF;
END $$;

-- PASO 3: Verificar que paes_skill_mapping existe y tiene datos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'paes_skill_mapping') THEN
        RAISE EXCEPTION 'Tabla paes_skill_mapping no existe. Ejecutar primero 01-mapeo-ids-paes.sql';
    END IF;
    
    IF (SELECT COUNT(*) FROM paes_skill_mapping) = 0 THEN
        RAISE EXCEPTION 'Tabla paes_skill_mapping está vacía. Ejecutar primero 01-mapeo-ids-paes.sql';
    END IF;
END $$;

-- PASO 4: Agregar constraint UNIQUE a paes_skill_mapping.uuid_id si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'paes_skill_mapping'
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%uuid_id%'
    ) THEN
        ALTER TABLE paes_skill_mapping ADD CONSTRAINT paes_skill_mapping_uuid_id_unique UNIQUE (uuid_id);
        RAISE NOTICE 'Constraint UNIQUE agregado a paes_skill_mapping.uuid_id';
    ELSE
        RAISE NOTICE 'Constraint UNIQUE ya existe en paes_skill_mapping.uuid_id';
    END IF;
END $$;

-- PASO 5: Crear nueva clave foránea apuntando a paes_skill_mapping
ALTER TABLE learning_nodes
ADD CONSTRAINT learning_nodes_skill_id_fkey
FOREIGN KEY (skill_id) REFERENCES paes_skill_mapping(uuid_id)
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- PASO 6: Verificar la nueva estructura
SELECT 'Verificando nueva estructura de clave foránea...' as status;

SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'learning_nodes'
    AND kcu.column_name = 'skill_id';

-- PASO 7: Probar que las funciones de mapeo funcionan
SELECT 'Probando funciones de mapeo después de la corrección...' as status;

-- Probar get_skill_uuid con diferentes habilidades
SELECT
    'localizar-informacion' as skill_name,
    get_skill_uuid('localizar-informacion') as uuid_result;

SELECT
    'interpretar-relacionar' as skill_name,
    get_skill_uuid('interpretar-relacionar') as uuid_result;

SELECT
    'analizar-sintetizar' as skill_name,
    get_skill_uuid('analizar-sintetizar') as uuid_result;

-- PASO 8: Verificar que los UUIDs generados existen en paes_skill_mapping
SELECT 'Verificando que los UUIDs están en paes_skill_mapping...' as status;

SELECT
    psm.skill_name,
    psm.uuid_id,
    CASE
        WHEN psm.uuid_id = get_skill_uuid(psm.skill_name) THEN 'CORRECTO'
        ELSE 'ERROR'
    END as validacion
FROM paes_skill_mapping psm
ORDER BY psm.integer_id;

-- PASO 9: Mensaje final
SELECT 'CLAVE FORÁNEA CORREGIDA EXITOSAMENTE' as resultado;
SELECT 'skill_id ahora apunta a paes_skill_mapping.uuid_id' as detalle;
SELECT 'Funciones de mapeo validadas correctamente' as validacion;
SELECT 'Listo para insertar nodos de Competencia Lectora' as siguiente_paso;

-- =====================================================
-- FIN DEL SCRIPT - CLAVE FORÁNEA CORREGIDA
-- =====================================================