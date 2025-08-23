-- =====================================================
-- ESTRUCTURA BASE COMPLETA - CORRECCIÓN UUID-INTEGER
-- Tablas de mapeo y funciones de conversión
-- Tiempo estimado: 2 minutos
-- =====================================================

-- PASO 1: Verificar si la tabla learning_nodes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Crear primero la tabla base.';
    END IF;
END $$;

-- PASO 2: Agregar columnas faltantes si no existen (manteniendo tipos existentes)
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS code VARCHAR(10);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS subject VARCHAR(50);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS primary_skill VARCHAR(50);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS secondary_skills TEXT[];
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS historical_period VARCHAR(50);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS geographical_scope VARCHAR(20);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS thematic_area VARCHAR(20);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS bloom_level VARCHAR(20);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS weight DECIMAL(3,2);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS average_time_minutes DECIMAL(4,1);
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS question_types TEXT[];
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- PASO 3: Verificar tipos de test_id y skill_id (deben ser UUID)
DO $$
BEGIN
    -- Agregar test_id como UUID si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'learning_nodes' AND column_name = 'test_id'
    ) THEN
        ALTER TABLE learning_nodes ADD COLUMN test_id UUID;
    END IF;
    
    -- Agregar skill_id como UUID si no existe  
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'learning_nodes' AND column_name = 'skill_id'
    ) THEN
        ALTER TABLE learning_nodes ADD COLUMN skill_id UUID;
    END IF;
END $$;

-- PASO 4: Crear tabla de mapeo para pruebas PAES
CREATE TABLE IF NOT EXISTS paes_test_mapping (
    integer_id INTEGER PRIMARY KEY,
    uuid_id UUID NOT NULL DEFAULT gen_random_uuid(),
    test_name VARCHAR(50) NOT NULL,
    test_code VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PASO 5: Crear tabla de mapeo para habilidades PAES
CREATE TABLE IF NOT EXISTS paes_skill_mapping (
    integer_id INTEGER PRIMARY KEY,
    uuid_id UUID NOT NULL DEFAULT gen_random_uuid(),
    skill_name VARCHAR(50) NOT NULL,
    skill_code VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- PASO 6: Agregar constraint UNIQUE para code si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'learning_nodes' 
        AND constraint_type = 'UNIQUE' 
        AND constraint_name LIKE '%code%'
    ) THEN
        ALTER TABLE learning_nodes ADD CONSTRAINT learning_nodes_code_unique UNIQUE (code);
    END IF;
END $$;

-- PASO 7: Crear índices optimizados
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_code ON learning_nodes(code);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_primary_skill ON learning_nodes(primary_skill);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_test_id ON learning_nodes(test_id);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_skill_id ON learning_nodes(skill_id);

-- Índices para tablas de mapeo
CREATE INDEX IF NOT EXISTS idx_paes_test_mapping_uuid ON paes_test_mapping(uuid_id);
CREATE INDEX IF NOT EXISTS idx_paes_test_mapping_code ON paes_test_mapping(test_code);
CREATE INDEX IF NOT EXISTS idx_paes_skill_mapping_uuid ON paes_skill_mapping(uuid_id);
CREATE INDEX IF NOT EXISTS idx_paes_skill_mapping_name ON paes_skill_mapping(skill_name);

-- PASO 8: Verificar estructura final
SELECT 'Verificando estructura de tabla learning_nodes...' as status;

-- Mostrar columnas relevantes de learning_nodes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'learning_nodes'
AND column_name IN ('test_id', 'skill_id', 'code', 'subject', 'primary_skill')
ORDER BY column_name;

-- Verificar tablas de mapeo creadas
SELECT 'Verificando tablas de mapeo...' as status;
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as total_columns
FROM information_schema.tables t
WHERE table_name IN ('paes_test_mapping', 'paes_skill_mapping')
ORDER BY table_name;

-- PASO 9: Mensaje de confirmación
SELECT 'ESTRUCTURA BASE COMPLETA CONFIGURADA' as resultado;
SELECT 'Tablas de mapeo UUID-INTEGER creadas correctamente' as mensaje;
SELECT 'Listo para ejecutar 01-mapeo-ids-paes.sql' as siguiente_paso;

-- =====================================================
-- FIN DEL SCRIPT - ESTRUCTURA BASE COMPLETA
-- =====================================================