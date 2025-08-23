-- =====================================================
-- CIRUGIA CREAR TABLA LEARNING_NODES
-- Crea la estructura base para nodos PAES
-- =====================================================

-- Eliminar tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS learning_nodes CASCADE;

-- Crear tabla learning_nodes con estructura completa
CREATE TABLE learning_nodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(50) NOT NULL,
    primary_skill VARCHAR(50),
    secondary_skills TEXT[],
    historical_period VARCHAR(50),
    geographical_scope VARCHAR(20),
    thematic_area VARCHAR(20),
    bloom_level VARCHAR(20),
    difficulty VARCHAR(20),
    weight DECIMAL(3,2),
    average_time_minutes DECIMAL(4,1),
    question_types TEXT[],
    test_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear indices para optimizar consultas
CREATE INDEX idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX idx_learning_nodes_difficulty ON learning_nodes(difficulty);
CREATE INDEX idx_learning_nodes_test_id ON learning_nodes(test_id);
CREATE INDEX idx_learning_nodes_code ON learning_nodes(code);

-- Crear trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_learning_nodes_updated_at 
    BEFORE UPDATE ON learning_nodes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar que la tabla se creo correctamente
SELECT 'Tabla learning_nodes creada exitosamente' as resultado;

-- Mostrar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;