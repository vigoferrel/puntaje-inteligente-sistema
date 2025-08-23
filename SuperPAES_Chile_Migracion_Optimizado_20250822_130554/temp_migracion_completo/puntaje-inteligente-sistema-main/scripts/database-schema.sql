-- ESQUEMAS DE BASE DE DATOS PARA SISTEMA NEURAL
-- Tablas necesarias para datos reales del sistema

-- Tabla de nodos de la taxonomia
CREATE TABLE IF NOT EXISTS neural_nodes (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    tier INTEGER CHECK (tier IN (1, 2, 3)) NOT NULL,
    skill VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    paes_value DECIMAL(5,2) NOT NULL,
    target_mastery INTEGER DEFAULT 85,
    prerequisites TEXT[], -- Array de IDs de nodos prerequisito
    learning_resources TEXT[], -- Array de recursos de aprendizaje
    official_exercises INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')),
    bloom_level VARCHAR(20) CHECK (bloom_level IN ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de progreso de usuarios en nodos
CREATE TABLE IF NOT EXISTS user_node_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) REFERENCES neural_nodes(id),
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    evidences TEXT[], -- Array de evidencias de maestria
    time_spent INTEGER DEFAULT 0, -- Tiempo en minutos
    exercises_completed INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, node_id)
);

-- Tabla de datos historicos PAES
CREATE TABLE IF NOT EXISTS historical_paes_data (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    paes_score INTEGER NOT NULL,
    node_mastery_data JSONB NOT NULL, -- JSON con maestria por nodo
    exam_date DATE NOT NULL,
    preparation_days INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de factores de rendimiento personalizados
CREATE TABLE IF NOT EXISTS user_performance_factors (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    personal_factor DECIMAL(3,2) DEFAULT 1.0,
    learning_velocity DECIMAL(3,2) DEFAULT 1.0,
    consistency_factor DECIMAL(3,2) DEFAULT 1.0,
    stress_factor DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices para optimizacion
CREATE INDEX IF NOT EXISTS idx_neural_nodes_tier ON neural_nodes(tier);
CREATE INDEX IF NOT EXISTS idx_neural_nodes_subject ON neural_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_node_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_node_id ON user_node_progress(node_id);
CREATE INDEX IF NOT EXISTS idx_historical_data_user_id ON historical_paes_data(user_id);
