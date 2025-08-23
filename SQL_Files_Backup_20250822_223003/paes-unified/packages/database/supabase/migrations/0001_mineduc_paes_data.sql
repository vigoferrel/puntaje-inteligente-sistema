-- Creación de tipos ENUM específicos para PAES/MINEDUC
CREATE TYPE paes_subject AS ENUM (
  'MATEMATICA_M1',
  'MATEMATICA_M2',
  'LECTURA',
  'HISTORIA',
  'CIENCIAS'
);

CREATE TYPE bloom_level AS ENUM (
  'REMEMBER',      -- Recordar
  'UNDERSTAND',    -- Comprender
  'APPLY',        -- Aplicar
  'ANALYZE',      -- Analizar
  'EVALUATE',     -- Evaluar
  'CREATE'        -- Crear
);

CREATE TYPE paes_skill AS ENUM (
  -- Matemáticas M1
  'NUMBERS',
  'ALGEBRA',
  'GEOMETRY',
  'FUNCTIONS',
  -- Matemáticas M2
  'CALCULUS',
  'STATISTICS',
  'PROBABILITY',
  'MODELING',
  -- Lectura
  'LOCALIZE',
  'INTERPRET',
  'EVALUATE',
  -- Historia
  'ANALYZE_SOURCES',
  'CONTEXTUALIZE',
  'SYNTHESIZE',
  -- Ciencias
  'OBSERVE',
  'HYPOTHESIZE',
  'EXPERIMENT',
  'CONCLUDE'
);

-- Tablas específicas MINEDUC/PAES

CREATE TABLE superpaes.mineduc_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code paes_subject NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  weight INTEGER NOT NULL DEFAULT 100, -- Ponderación en escala 100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.mineduc_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES superpaes.mineduc_subjects(id),
  code paes_skill NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  bloom_level bloom_level NOT NULL,
  weight INTEGER NOT NULL DEFAULT 100, -- Ponderación en escala 100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.mineduc_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES superpaes.mineduc_subjects(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  importance_level INTEGER NOT NULL DEFAULT 1, -- 1: bajo, 5: alto
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.mineduc_learning_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES superpaes.mineduc_topics(id),
  skill_id UUID REFERENCES superpaes.mineduc_skills(id),
  code VARCHAR(50) NOT NULL, -- Código oficial MINEDUC
  description TEXT NOT NULL,
  bloom_level bloom_level NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.official_paes_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  period VARCHAR(50) NOT NULL, -- 'invierno', 'verano'
  subject_id UUID REFERENCES superpaes.mineduc_subjects(id),
  total_questions INTEGER NOT NULL,
  time_allowed INTEGER NOT NULL, -- en minutos
  passing_score INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.official_paes_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES superpaes.official_paes_exams(id),
  question_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL, -- A, B, C, D, E
  options JSONB NOT NULL, -- {A: "texto", B: "texto", ...}
  explanation TEXT,
  skill_id UUID REFERENCES superpaes.mineduc_skills(id),
  topic_id UUID REFERENCES superpaes.mineduc_topics(id),
  objective_id UUID REFERENCES superpaes.mineduc_learning_objectives(id),
  difficulty INTEGER NOT NULL, -- 1-100
  discrimination FLOAT, -- índice de discriminación
  bloom_level bloom_level NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de estadísticas y análisis

CREATE TABLE superpaes.question_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES superpaes.official_paes_questions(id),
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  average_time INTEGER DEFAULT 0, -- en segundos
  difficulty_actual FLOAT, -- dificultad calculada
  discrimination_index FLOAT,
  distractor_analysis JSONB DEFAULT '{}', -- análisis de opciones incorrectas
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.skill_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID REFERENCES superpaes.mineduc_skills(id),
  year INTEGER NOT NULL,
  period VARCHAR(50) NOT NULL,
  average_score FLOAT,
  national_percentile JSONB, -- {p10: X, p25: Y, p50: Z, p75: W, p90: V}
  region_percentile JSONB,
  difficulty_distribution JSONB, -- distribución de dificultad
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de datos oficiales MINEDUC

-- Matemática M1
INSERT INTO superpaes.mineduc_subjects (code, name, description, weight) VALUES
('MATEMATICA_M1', 'Matemática M1', 'Prueba electiva de matemática que evalúa las competencias matemáticas fundamentales', 100);

-- Matemática M2
INSERT INTO superpaes.mineduc_subjects (code, name, description, weight) VALUES
('MATEMATICA_M2', 'Matemática M2', 'Prueba electiva de matemática que evalúa competencias matemáticas avanzadas', 100);

-- Competencia Lectora
INSERT INTO superpaes.mineduc_subjects (code, name, description, weight) VALUES
('LECTURA', 'Competencia Lectora', 'Prueba obligatoria que evalúa la comprensión lectora', 100);

-- Historia
INSERT INTO superpaes.mineduc_subjects (code, name, description, weight) VALUES
('HISTORIA', 'Historia y Ciencias Sociales', 'Prueba electiva que evalúa conocimientos de historia, geografía y ciencias sociales', 100);

-- Ciencias
INSERT INTO superpaes.mineduc_subjects (code, name, description, weight) VALUES
('CIENCIAS', 'Ciencias', 'Prueba electiva que evalúa conocimientos científicos integrados', 100);

-- Habilidades por asignatura
INSERT INTO superpaes.mineduc_skills (subject_id, code, name, description, bloom_level, weight) 
SELECT 
  id as subject_id,
  'NUMBERS' as code,
  'Números' as name,
  'Comprensión y aplicación de conceptos y procedimientos relacionados con los números' as description,
  'APPLY' as bloom_level,
  100 as weight
FROM superpaes.mineduc_subjects 
WHERE code = 'MATEMATICA_M1';

INSERT INTO superpaes.mineduc_skills (subject_id, code, name, description, bloom_level, weight)
SELECT 
  id as subject_id,
  'ALGEBRA' as code,
  'Álgebra' as name,
  'Comprensión y aplicación de conceptos y procedimientos algebraicos' as description,
  'APPLY' as bloom_level,
  100 as weight
FROM superpaes.mineduc_subjects 
WHERE code = 'MATEMATICA_M1';

-- [Aquí continuarían más inserciones para todas las habilidades...]

-- Índices para optimización

CREATE INDEX idx_paes_questions_exam ON superpaes.official_paes_questions(exam_id);
CREATE INDEX idx_paes_questions_skill ON superpaes.official_paes_questions(skill_id);
CREATE INDEX idx_paes_questions_topic ON superpaes.official_paes_questions(topic_id);
CREATE INDEX idx_paes_questions_objective ON superpaes.official_paes_questions(objective_id);
CREATE INDEX idx_question_stats_question ON superpaes.question_statistics(question_id);
CREATE INDEX idx_skill_stats_skill ON superpaes.skill_statistics(skill_id);

-- Funciones de utilidad

CREATE OR REPLACE FUNCTION calculate_question_difficulty(
  correct_attempts INTEGER,
  total_attempts INTEGER
) RETURNS FLOAT AS $$
BEGIN
  IF total_attempts = 0 THEN
    RETURN 0.5;
  END IF;
  RETURN 1.0 - (correct_attempts::FLOAT / total_attempts::FLOAT);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION calculate_discrimination_index(
  high_group_correct INTEGER,
  high_group_total INTEGER,
  low_group_correct INTEGER,
  low_group_total INTEGER
) RETURNS FLOAT AS $$
BEGIN
  IF high_group_total = 0 OR low_group_total = 0 THEN
    RETURN 0;
  END IF;
  RETURN (high_group_correct::FLOAT / high_group_total::FLOAT) - 
         (low_group_correct::FLOAT / low_group_total::FLOAT);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Vista materializada para estadísticas generales

CREATE MATERIALIZED VIEW superpaes.paes_general_statistics AS
SELECT 
  s.code as subject_code,
  s.name as subject_name,
  sk.code as skill_code,
  sk.name as skill_name,
  COUNT(q.id) as total_questions,
  AVG(q.difficulty) as avg_difficulty,
  AVG(qs.discrimination_index) as avg_discrimination,
  COUNT(DISTINCT e.id) as total_exams,
  AVG(qs.average_time) as avg_time_seconds
FROM superpaes.mineduc_subjects s
JOIN superpaes.mineduc_skills sk ON sk.subject_id = s.id
JOIN superpaes.official_paes_questions q ON q.skill_id = sk.id
JOIN superpaes.official_paes_exams e ON q.exam_id = e.id
LEFT JOIN superpaes.question_statistics qs ON qs.question_id = q.id
GROUP BY s.code, s.name, sk.code, sk.name;

-- Índice para la vista materializada
CREATE UNIQUE INDEX idx_paes_stats_subject_skill 
ON superpaes.paes_general_statistics (subject_code, skill_code);

-- Función para refrescar estadísticas
CREATE OR REPLACE FUNCTION refresh_paes_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY superpaes.paes_general_statistics;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas
CREATE OR REPLACE FUNCTION update_question_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar estadísticas cuando se modifica una pregunta
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO superpaes.question_statistics (
      question_id,
      total_attempts,
      correct_attempts,
      average_time,
      difficulty_actual,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      0,
      0,
      0,
      NEW.difficulty::FLOAT / 100,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    ON CONFLICT (question_id) 
    DO UPDATE SET
      updated_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_question_statistics
AFTER INSERT OR UPDATE ON superpaes.official_paes_questions
FOR EACH ROW EXECUTE FUNCTION update_question_statistics();
