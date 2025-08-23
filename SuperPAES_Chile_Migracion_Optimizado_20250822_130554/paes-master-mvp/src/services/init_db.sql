-- Script de inicialización para PAES Master MVP
-- Crea todas las tablas necesarias según estructura oficial PAES

BEGIN TRANSACTION;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para health checks
CREATE TABLE IF NOT EXISTS system_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT 0,
    severity TEXT DEFAULT 'info'
);

-- Tabla para seguimiento por prueba PAES
CREATE TABLE IF NOT EXISTS paes_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    prueba TEXT NOT NULL,
    topic TEXT NOT NULL,
    habilidad TEXT NOT NULL,
    score FLOAT,
    time_spent INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para preguntas PAES generadas
CREATE TABLE IF NOT EXISTS paes_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prueba TEXT NOT NULL,
    topic TEXT NOT NULL,
    habilidad TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para simulacros PAES
CREATE TABLE IF NOT EXISTS paes_simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    prueba TEXT NOT NULL,
    score INTEGER,
    total_time INTEGER,
    questions_answered INTEGER,
    questions_correct INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para tracking de actividad detallado
CREATE TABLE IF NOT EXISTS user_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration INTEGER,
    metadata TEXT
);

-- Tabla para predicciones
CREATE TABLE IF NOT EXISTS performance_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    prueba TEXT NOT NULL,
    predicted_score INTEGER,
    confidence_level FLOAT,
    factors TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para recomendaciones
CREATE TABLE IF NOT EXISTS study_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    area TEXT NOT NULL,
    priority INTEGER,
    recommendation TEXT,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para métricas agregadas
CREATE TABLE IF NOT EXISTS aggregated_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT NOT NULL,
    value FLOAT,
    dimension TEXT,
    period TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_paes_user ON paes_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_paes_prueba ON paes_progress(prueba);
CREATE INDEX IF NOT EXISTS idx_paes_habilidad ON paes_progress(habilidad);
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON performance_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON study_recommendations(user_id);

COMMIT;

-- Datos iniciales para health checks
INSERT INTO system_alerts (alert_type, message, severity)
VALUES
    ('startup', 'Sistema PAES iniciado correctamente', 'info'),
    ('database', 'Base de datos PAES inicializada', 'info');