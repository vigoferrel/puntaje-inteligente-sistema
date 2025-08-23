-- =====================================================
-- CORRECCIÓN CRÍTICA: RELACIONES FALTANTES Y COLUMNAS
-- Ejecutar en Supabase SQL Editor paso a paso
-- =====================================================

-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL DE LEARNING_NODES
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;

-- PASO 2: AGREGAR COLUMNA FALTANTE EN user_exercise_attempts
ALTER TABLE user_exercise_attempts 
ADD COLUMN IF NOT EXISTS skill_demonstrated text;

-- PASO 3: VERIFICAR SI LAS COLUMNAS YA EXISTEN Y SUS TIPOS
DO $$
BEGIN
    -- Verificar skill_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'learning_nodes' AND column_name = 'skill_id'
    ) THEN
        -- Verificar tipo de ID en paes_skills
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'paes_skills' AND column_name = 'id' AND data_type = 'integer'
        ) THEN
            ALTER TABLE learning_nodes ADD COLUMN skill_id integer;
        ELSE
            ALTER TABLE learning_nodes ADD COLUMN skill_id uuid;
        END IF;
    END IF;
    
    -- Verificar test_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'learning_nodes' AND column_name = 'test_id'
    ) THEN
        -- Verificar tipo de ID en paes_tests
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'paes_tests' AND column_name = 'id' AND data_type = 'integer'
        ) THEN
            ALTER TABLE learning_nodes ADD COLUMN test_id integer;
        ELSE
            ALTER TABLE learning_nodes ADD COLUMN test_id uuid;
        END IF;
    END IF;
END $$;

-- PASO 4: VERIFICAR ESTRUCTURA DE PAES_TESTS
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'paes_tests'
ORDER BY ordinal_position;

-- PASO 5: VERIFICAR ESTRUCTURA DE PAES_SKILLS
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'paes_skills'
ORDER BY ordinal_position;

-- PASO 6: VERIFICAR SI YA EXISTEN REGISTROS EN PAES_TESTS
SELECT COUNT(*) as total_tests FROM paes_tests;

-- PASO 7: VERIFICAR SI YA EXISTEN REGISTROS EN PAES_SKILLS
SELECT COUNT(*) as total_skills FROM paes_skills;

-- PASO 8: ACTUALIZAR DATOS NULOS EN learning_nodes CON REGISTROS EXISTENTES
-- Usar el primer test disponible
UPDATE learning_nodes
SET test_id = (SELECT id FROM paes_tests LIMIT 1)
WHERE test_id IS NULL AND EXISTS (SELECT 1 FROM paes_tests);

-- Usar el primer skill disponible
UPDATE learning_nodes
SET skill_id = (SELECT id FROM paes_skills LIMIT 1)
WHERE skill_id IS NULL AND EXISTS (SELECT 1 FROM paes_skills);

-- PASO 6: CREAR FOREIGN KEY CONSTRAINTS DESPUÉS DE TENER LAS COLUMNAS
DO $$
BEGIN
    -- Verificar si la constraint ya existe antes de crearla
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'learning_nodes_skill_id_fkey' 
        AND table_name = 'learning_nodes'
    ) THEN
        ALTER TABLE learning_nodes 
        ADD CONSTRAINT learning_nodes_skill_id_fkey 
        FOREIGN KEY (skill_id) REFERENCES paes_skills(id)
        ON DELETE SET NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'learning_nodes_test_id_fkey' 
        AND table_name = 'learning_nodes'
    ) THEN
        ALTER TABLE learning_nodes 
        ADD CONSTRAINT learning_nodes_test_id_fkey 
        FOREIGN KEY (test_id) REFERENCES paes_tests(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- PASO 7: CREAR ÍNDICES PARA MEJORAR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_learning_nodes_skill_id
ON learning_nodes(skill_id);

CREATE INDEX IF NOT EXISTS idx_learning_nodes_test_id
ON learning_nodes(test_id);

-- PASO 8: ACTUALIZAR ESTADÍSTICAS DE TABLAS
ANALYZE learning_nodes;
ANALYZE paes_skills;
ANALYZE paes_tests;
ANALYZE user_exercise_attempts;

-- PASO 9: VERIFICACIÓN FINAL
SELECT
    'learning_nodes' as tabla,
    COUNT(*) as total_registros,
    COUNT(skill_id) as con_skill_id,
    COUNT(test_id) as con_test_id
FROM learning_nodes
UNION ALL
SELECT
    'paes_skills' as tabla,
    COUNT(*) as total_registros,
    COUNT(id) as con_skill_id,
    0 as con_test_id
FROM paes_skills
UNION ALL
SELECT
    'paes_tests' as tabla,
    COUNT(*) as total_registros,
    0 as con_skill_id,
    COUNT(id) as con_test_id
FROM paes_tests;

-- PASO 10: VERIFICAR QUE LAS RELACIONES FUNCIONAN
SELECT ln.id, ln.title, ln.skill_id, ln.test_id
FROM learning_nodes ln
WHERE ln.skill_id IS NOT NULL OR ln.test_id IS NOT NULL
LIMIT 5;