-- =====================================================
-- CIRUGIA TABLA SIMPLE - PARA EJECUTAR EN SUPABASE WEB
-- Copiar y pegar en SQL Editor de Supabase
-- =====================================================

-- Crear tabla learning_nodes
CREATE TABLE IF NOT EXISTS learning_nodes (
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

-- Crear indices basicos
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_code ON learning_nodes(code);