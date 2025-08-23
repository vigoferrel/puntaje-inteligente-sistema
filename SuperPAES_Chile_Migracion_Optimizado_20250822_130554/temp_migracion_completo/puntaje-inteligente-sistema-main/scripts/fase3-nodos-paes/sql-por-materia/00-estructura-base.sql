-- =====================================================
-- ESTRUCTURA BASE - TABLA LEARNING_NODES
-- Corrección y optimización de estructura de BD
-- Tiempo estimado: 1 minuto
-- =====================================================

-- PASO 1: Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Crear primero la tabla base.';
    END IF;
END $$;

-- PASO 2: Agregar columnas faltantes si no existen
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
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS test_id INTEGER;
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE learning_nodes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- PASO 3: Agregar constraint UNIQUE para code si no existe
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

-- PASO 4: Crear índices optimizados
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_code ON learning_nodes(code);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_primary_skill ON learning_nodes(primary_skill);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_test_id ON learning_nodes(test_id);

-- PASO 5: Verificar estructura final
SELECT 'Verificando estructura de tabla learning_nodes...' as status;

-- Mostrar columnas de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'learning_nodes'
ORDER BY ordinal_position;

-- Verificar índices creados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'learning_nodes'
ORDER BY indexname;

-- PASO 6: Mensaje de confirmación
SELECT 'ESTRUCTURA BASE CONFIGURADA CORRECTAMENTE' as resultado;
SELECT 'Tabla learning_nodes lista para recibir nodos PAES' as mensaje;

-- =====================================================
-- FIN DEL SCRIPT - ESTRUCTURA BASE IMPLEMENTADA
-- =====================================================