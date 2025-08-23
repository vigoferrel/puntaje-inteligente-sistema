-- Tabla para preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id TEXT PRIMARY KEY,
    difficulty TEXT NOT NULL DEFAULT 'auto',
    focus_skills TEXT DEFAULT '[]',
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla para progreso de usuario por habilidad
CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT NOT NULL,
    skill TEXT NOT NULL,
    progress REAL NOT NULL DEFAULT 0.0,
    PRIMARY KEY (user_id, skill),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla para sesiones de usuario
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress',
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Tabla para ejercicios realizados por usuario
CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    skill TEXT NOT NULL,
    question TEXT,
    user_answer TEXT,
    correct BOOLEAN,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
