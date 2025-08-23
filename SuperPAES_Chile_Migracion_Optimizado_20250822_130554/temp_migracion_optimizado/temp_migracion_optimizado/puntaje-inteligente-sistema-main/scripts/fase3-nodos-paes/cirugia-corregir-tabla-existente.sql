-- =====================================================
-- CIRUGIA CORREGIR TABLA EXISTENTE
-- Agrega columnas faltantes a learning_nodes
-- =====================================================

-- Verificar estructura actual
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;

-- Agregar columnas faltantes una por una
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

-- Agregar constraint UNIQUE para code si no existe
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

-- Crear indices si no existen
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_code ON learning_nodes(code);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty);

-- Verificar estructura final
SELECT 'Estructura de tabla corregida' as resultado;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;