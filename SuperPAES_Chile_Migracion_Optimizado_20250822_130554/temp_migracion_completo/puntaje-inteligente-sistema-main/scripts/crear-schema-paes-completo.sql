-- =====================================================
-- CREACIÓN DEL SCHEMA PAES COMPLETO OPTIMIZADO
-- Script para crear/actualizar estructura completa de 200+ nodos
-- Compatible con el sistema avanzado identificado
-- Fecha: 30/05/2025
-- =====================================================

-- PASO 1: CREAR EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- PASO 2: CREAR ENUMS PARA TIPADO FUERTE
DO $$ 
BEGIN
    -- Enum para materias PAES
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paes_subject_enum') THEN
        CREATE TYPE paes_subject_enum AS ENUM (
            'COMPETENCIA_LECTORA',
            'MATEMATICA_M1', 
            'MATEMATICA_M2',
            'HISTORIA_CS_SOCIALES',
            'CIENCIAS'
        );
    END IF;
    
    -- Enum para competencias/habilidades avanzadas
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'advanced_skill_enum') THEN
        CREATE TYPE advanced_skill_enum AS ENUM (
            'resolver-problemas',
            'representar',
            'modelar', 
            'interpretar-relacionar',
            'evaluar-reflexionar',
            'rastrear-localizar',
            'pensamiento-temporal',
            'analisis-fuentes',
            'analisis-multicausal',
            'pensamiento-critico'
        );
    END IF;
    
    -- Enum para niveles de Bloom
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bloom_level_enum') THEN
        CREATE TYPE bloom_level_enum AS ENUM (
            'recordar',
            'comprender', 
            'aplicar',
            'analizar',
            'evaluar',
            'crear'
        );
    END IF;
    
    -- Enum para dificultad
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
        CREATE TYPE difficulty_enum AS ENUM (
            'básico',
            'intermedio',
            'avanzado'
        );
    END IF;
    
    -- Enum para ámbito geográfico (Historia)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'geographical_scope_enum') THEN
        CREATE TYPE geographical_scope_enum AS ENUM (
            'local',
            'national',
            'regional', 
            'global'
        );
    END IF;
    
    -- Enum para área temática (Historia)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'thematic_area_enum') THEN
        CREATE TYPE thematic_area_enum AS ENUM (
            'political',
            'social',
            'economic',
            'cultural'
        );
    END IF;
    
    -- Enum para área científica
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'scientific_area_enum') THEN
        CREATE TYPE scientific_area_enum AS ENUM (
            'biology',
            'physics',
            'chemistry',
            'general'
        );
    END IF;
END $$;

-- PASO 3: CREAR/ACTUALIZAR TABLA PAES_TESTS
CREATE TABLE IF NOT EXISTS paes_tests (
    id SERIAL PRIMARY KEY,
    subject_area paes_subject_enum NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    complexity_level difficulty_enum DEFAULT 'intermedio',
    questions_count INTEGER DEFAULT 65,
    time_minutes INTEGER DEFAULT 120,
    relative_weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 4: CREAR/ACTUALIZAR TABLA PAES_SKILLS  
CREATE TABLE IF NOT EXISTS paes_skills (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    skill_type advanced_skill_enum NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color code
    impact_weight DECIMAL(3,2) DEFAULT 1.0,
    test_id INTEGER REFERENCES paes_tests(id),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 5: CREAR/ACTUALIZAR TABLA LEARNING_NODES AVANZADA
CREATE TABLE IF NOT EXISTS learning_nodes (
    -- Identificación principal
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Jerarquía y relaciones
    level INTEGER NOT NULL DEFAULT 4 CHECK (level BETWEEN 1 AND 4),
    parent_id UUID REFERENCES learning_nodes(id),
    children_ids UUID[] DEFAULT '{}',
    
    -- Competencias PAES
    primary_skill advanced_skill_enum NOT NULL,
    secondary_skills advanced_skill_enum[] DEFAULT '{}',
    skill_color VARCHAR(7) NOT NULL,
    skill_id INTEGER REFERENCES paes_skills(id),
    
    -- Taxonomía educativa
    bloom_level bloom_level_enum NOT NULL DEFAULT 'comprender',
    cognitive_complexity INTEGER DEFAULT 2 CHECK (cognitive_complexity BETWEEN 1 AND 6),
    
    -- Metadatos PAES
    subject paes_subject_enum NOT NULL,
    difficulty difficulty_enum NOT NULL DEFAULT 'intermedio',
    weight DECIMAL(4,2) DEFAULT 1.0,
    prerequisites UUID[] DEFAULT '{}',
    test_id INTEGER REFERENCES paes_tests(id),
    
    -- Evaluación y tiempo
    question_types TEXT[] DEFAULT '{}',
    average_time_minutes DECIMAL(4,1) DEFAULT 30.0,
    success_rate DECIMAL(3,2),
    estimated_time INTEGER, -- Para compatibilidad
    
    -- Campos específicos por materia
    -- Historia y Ciencias Sociales
    historical_period VARCHAR(100),
    geographical_scope geographical_scope_enum,
    thematic_area thematic_area_enum,
    
    -- Matemáticas
    mathematical_domain VARCHAR(100),
    
    -- Ciencias
    scientific_area scientific_area_enum,
    
    -- Visualización 3D
    position_3d JSONB, -- {x: number, y: number, z: number}
    scale_3d DECIMAL(3,2) DEFAULT 1.0,
    rotation_3d JSONB, -- {x: number, y: number, z: number}
    
    -- Metadatos del sistema
    subject_area VARCHAR(100), -- Para compatibilidad con datos existentes
    difficulty_level VARCHAR(50), -- Para compatibilidad
    node_type VARCHAR(50) DEFAULT 'SKILL',
    learning_objectives JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 6: CREAR TABLA DE COMPETENCIAS PAES
CREATE TABLE IF NOT EXISTS paes_competencies (
    id SERIAL PRIMARY KEY,
    skill_type advanced_skill_enum UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    node_count INTEGER DEFAULT 0,
    percentage DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 7: CREAR TABLA DE EJERCICIOS AVANZADA
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID NOT NULL REFERENCES learning_nodes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty difficulty_enum NOT NULL DEFAULT 'intermedio',
    estimated_time INTEGER DEFAULT 10, -- minutos
    exercise_type VARCHAR(50) DEFAULT 'multiple_choice',
    correct_answer TEXT,
    options JSONB DEFAULT '[]',
    explanation TEXT,
    hints JSONB DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 8: CREAR TABLA DE PROGRESO DE USUARIO
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    node_id UUID NOT NULL REFERENCES learning_nodes(id) ON DELETE CASCADE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'mastered')),
    score DECIMAL(5,2),
    time_spent INTEGER DEFAULT 0, -- minutos
    attempts INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, node_id)
);

-- PASO 9: CREAR ÍNDICES PARA PERFORMANCE OPTIMIZADA
-- Índices principales para learning_nodes
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject ON learning_nodes(subject);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_primary_skill ON learning_nodes(primary_skill);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_level ON learning_nodes(level);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_parent_id ON learning_nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_code ON learning_nodes(code);

-- Índices para búsqueda de texto
CREATE INDEX IF NOT EXISTS idx_learning_nodes_name_trgm ON learning_nodes USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_description_trgm ON learning_nodes USING gin (description gin_trgm_ops);

-- Índices para campos específicos
CREATE INDEX IF NOT EXISTS idx_learning_nodes_historical_period ON learning_nodes(historical_period) WHERE historical_period IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_learning_nodes_scientific_area ON learning_nodes(scientific_area) WHERE scientific_area IS NOT NULL;

-- Índices para ejercicios
CREATE INDEX IF NOT EXISTS idx_exercises_node_id ON exercises(node_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(exercise_type);

-- Índices para progreso de usuario
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_node_id ON user_progress(node_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_completion ON user_progress(completion_percentage);

-- PASO 10: CREAR FUNCIONES DE UTILIDAD
-- Función para actualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para calcular estadísticas de competencias
CREATE OR REPLACE FUNCTION update_competency_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar conteos y porcentajes de competencias
    UPDATE paes_competencies 
    SET 
        node_count = (
            SELECT COUNT(*) 
            FROM learning_nodes 
            WHERE primary_skill = paes_competencies.skill_type
        ),
        percentage = (
            SELECT ROUND(
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes)), 2
            )
            FROM learning_nodes 
            WHERE primary_skill = paes_competencies.skill_type
        );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- PASO 11: CREAR TRIGGERS
-- Triggers para actualizar timestamps
DROP TRIGGER IF EXISTS update_learning_nodes_updated_at ON learning_nodes;
CREATE TRIGGER update_learning_nodes_updated_at 
    BEFORE UPDATE ON learning_nodes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_paes_skills_updated_at ON paes_skills;
CREATE TRIGGER update_paes_skills_updated_at 
    BEFORE UPDATE ON paes_skills 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at 
    BEFORE UPDATE ON exercises 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar estadísticas de competencias
DROP TRIGGER IF EXISTS update_competency_stats_trigger ON learning_nodes;
CREATE TRIGGER update_competency_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON learning_nodes
    FOR EACH STATEMENT EXECUTE FUNCTION update_competency_stats();

-- PASO 12: INSERTAR DATOS BÁSICOS DE COMPETENCIAS
INSERT INTO paes_competencies (skill_type, name, description, color) VALUES
    ('resolver-problemas', 'Resolver Problemas', 'Capacidad para identificar, analizar y resolver problemas matemáticos y científicos', '#4F46E5'),
    ('representar', 'Representar', 'Habilidad para representar información de manera gráfica, simbólica o numérica', '#10B981'),
    ('modelar', 'Modelar', 'Competencia para crear modelos matemáticos y científicos de situaciones reales', '#F59E0B'),
    ('interpretar-relacionar', 'Interpretar y Relacionar', 'Capacidad para interpretar información y establecer relaciones entre conceptos', '#3B82F6'),
    ('evaluar-reflexionar', 'Evaluar y Reflexionar', 'Habilidad para evaluar críticamente información y reflexionar sobre procesos', '#EF4444'),
    ('rastrear-localizar', 'Rastrear y Localizar', 'Competencia para localizar información específica en textos y fuentes', '#8B5CF6'),
    ('pensamiento-temporal', 'Pensamiento Temporal', 'Capacidad para analizar procesos históricos en el tiempo', '#F97316'),
    ('analisis-fuentes', 'Análisis de Fuentes', 'Habilidad para interpretar y analizar fuentes históricas primarias y secundarias', '#06B6D4'),
    ('analisis-multicausal', 'Análisis Multicausal', 'Competencia para identificar múltiples causas en procesos históricos', '#84CC16'),
    ('pensamiento-critico', 'Pensamiento Crítico', 'Capacidad para evaluar argumentos y formar juicios fundamentados', '#EC4899')
ON CONFLICT (skill_type) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color;

-- PASO 13: INSERTAR TESTS PAES BÁSICOS
INSERT INTO paes_tests (id, subject_area, name, description, questions_count, time_minutes) VALUES
    (1, 'COMPETENCIA_LECTORA', 'Competencia Lectora PAES', 'Evaluación de comprensión lectora y habilidades de lectura', 65, 150),
    (2, 'MATEMATICA_M1', 'Matemática M1 PAES', 'Matemática de 7° básico a 2° medio', 65, 140),
    (3, 'MATEMATICA_M2', 'Matemática M2 PAES', 'Matemática de 3° y 4° medio', 80, 160),
    (4, 'HISTORIA_CS_SOCIALES', 'Historia y Ciencias Sociales PAES', 'Historia, geografía y educación cívica', 65, 120),
    (5, 'CIENCIAS', 'Ciencias PAES', 'Biología, física y química', 80, 160)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    questions_count = EXCLUDED.questions_count,
    time_minutes = EXCLUDED.time_minutes;

-- PASO 14: CREAR POLÍTICAS RLS (Row Level Security)
-- Habilitar RLS en tablas principales
ALTER TABLE learning_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública de nodos y ejercicios
CREATE POLICY "learning_nodes_select_policy" ON learning_nodes FOR SELECT USING (true);
CREATE POLICY "exercises_select_policy" ON exercises FOR SELECT USING (true);
CREATE POLICY "paes_competencies_select_policy" ON paes_competencies FOR SELECT USING (true);
CREATE POLICY "paes_tests_select_policy" ON paes_tests FOR SELECT USING (true);
CREATE POLICY "paes_skills_select_policy" ON paes_skills FOR SELECT USING (true);

-- Política para progreso de usuario (solo el propio usuario)
CREATE POLICY "user_progress_policy" ON user_progress 
    FOR ALL USING (auth.uid() = user_id);

-- PASO 15: CREAR VISTAS ÚTILES
-- Vista para nodos con información completa
CREATE OR REPLACE VIEW learning_nodes_complete AS
SELECT 
    ln.*,
    ps.name as skill_name,
    ps.color as skill_color_from_skill,
    pt.name as test_name,
    pt.subject_area as test_subject,
    pc.name as competency_name,
    pc.description as competency_description
FROM learning_nodes ln
LEFT JOIN paes_skills ps ON ln.skill_id = ps.id
LEFT JOIN paes_tests pt ON ln.test_id = pt.id
LEFT JOIN paes_competencies pc ON ln.primary_skill = pc.skill_type;

-- Vista para estadísticas por materia
CREATE OR REPLACE VIEW subject_statistics AS
SELECT 
    subject,
    COUNT(*) as total_nodes,
    COUNT(DISTINCT primary_skill) as unique_skills,
    AVG(weight) as average_weight,
    AVG(average_time_minutes) as average_time,
    COUNT(CASE WHEN difficulty = 'básico' THEN 1 END) as basic_nodes,
    COUNT(CASE WHEN difficulty = 'intermedio' THEN 1 END) as intermediate_nodes,
    COUNT(CASE WHEN difficulty = 'avanzado' THEN 1 END) as advanced_nodes
FROM learning_nodes
GROUP BY subject;

-- PASO 16: ACTUALIZAR ESTADÍSTICAS FINALES
ANALYZE learning_nodes;
ANALYZE paes_skills;
ANALYZE paes_tests;
ANALYZE paes_competencies;
ANALYZE exercises;
ANALYZE user_progress;

-- Ejecutar actualización de estadísticas de competencias
SELECT update_competency_stats();

SELECT 'SCHEMA PAES COMPLETO CREADO EXITOSAMENTE - LISTO PARA 200+ NODOS' as resultado_final;