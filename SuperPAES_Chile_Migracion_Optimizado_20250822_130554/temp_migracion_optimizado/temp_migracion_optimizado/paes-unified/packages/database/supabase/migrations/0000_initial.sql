-- Creación del esquema principal
CREATE SCHEMA IF NOT EXISTS superpaes;

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums comunes
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE content_type AS ENUM ('exercise', 'explanation', 'hint', 'solution');
CREATE TYPE session_type AS ENUM ('practice', 'exam', 'diagnostic');
CREATE TYPE institution_type AS ENUM ('university', 'institute', 'school');

-- Tablas principales

-- Usuarios y perfiles
CREATE TABLE superpaes.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role user_role DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  study_hours INTEGER DEFAULT 2,
  difficulty_preference difficulty_level DEFAULT 'medium',
  preferred_subjects TEXT[],
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Estructura educativa
CREATE TABLE superpaes.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  options JSONB NOT NULL,
  difficulty difficulty_level DEFAULT 'medium',
  explanation TEXT,
  skill_id UUID REFERENCES superpaes.skills(id),
  topic VARCHAR(255),
  type content_type DEFAULT 'exercise',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES superpaes.questions(id),
  content TEXT NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  difficulty difficulty_level DEFAULT 'medium',
  explanation TEXT,
  metadata JSONB DEFAULT '{}',
  topic VARCHAR(255),
  type content_type DEFAULT 'exercise',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Progreso y sesiones
CREATE TABLE superpaes.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES superpaes.skills(id),
  level INTEGER DEFAULT 0,
  experience_points INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  last_practice TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_id)
);

CREATE TABLE superpaes.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  session_type session_type NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sistema cuántico
CREATE TABLE superpaes.quantum_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  state_vector JSONB NOT NULL,
  coherence FLOAT NOT NULL DEFAULT 0,
  entanglement_data JSONB DEFAULT '[]',
  last_update TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE superpaes.quantum_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id UUID REFERENCES superpaes.quantum_states(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES superpaes.skills(id),
  amplitude FLOAT NOT NULL DEFAULT 0,
  phase FLOAT NOT NULL DEFAULT 0,
  correlations JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}'
);

-- Sistema de IA y caché
CREATE TABLE superpaes.ai_content_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  input_hash TEXT NOT NULL UNIQUE,
  cached_content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE superpaes.ai_generation_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  generation_time INTEGER NOT NULL, -- en milisegundos
  token_count INTEGER NOT NULL,
  cost FLOAT NOT NULL DEFAULT 0,
  quality_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Spotify Neural Integration
CREATE TABLE superpaes.neural_playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tracks JSONB NOT NULL DEFAULT '[]',
  paes_dna JSONB NOT NULL,
  total_duration INTEGER NOT NULL DEFAULT 0,
  mood VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE superpaes.neural_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES superpaes.neural_playlists(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES superpaes.exercises(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_time INTEGER NOT NULL DEFAULT 0,
  difficulty difficulty_level DEFAULT 'medium',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Educación y carreras
CREATE TABLE superpaes.careers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  requirements JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type institution_type NOT NULL,
  description TEXT,
  address TEXT,
  contact_info JSONB,
  website VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de relación
CREATE TABLE superpaes.career_skills (
  career_id UUID REFERENCES superpaes.careers(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES superpaes.skills(id) ON DELETE CASCADE,
  importance_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE superpaes.learning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES superpaes.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  goals JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE superpaes.learning_plan_skills (
  learning_plan_id UUID REFERENCES superpaes.learning_plans(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES superpaes.skills(id) ON DELETE CASCADE,
  target_level INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (learning_plan_id, skill_id)
);

-- Indices
CREATE INDEX idx_user_progress_user_id ON superpaes.user_progress(user_id);
CREATE INDEX idx_sessions_user_id ON superpaes.sessions(user_id);
CREATE INDEX idx_quantum_states_user_id ON superpaes.quantum_states(user_id);
CREATE INDEX idx_neural_playlists_user_id ON superpaes.neural_playlists(user_id);
CREATE INDEX idx_exercises_topic ON superpaes.exercises(topic);
CREATE INDEX idx_questions_skill_id ON superpaes.questions(skill_id);
CREATE INDEX idx_ai_content_cache_input_hash ON superpaes.ai_content_cache(input_hash);

-- Row Level Security (RLS)
ALTER TABLE superpaes.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE superpaes.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE superpaes.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE superpaes.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE superpaes.quantum_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE superpaes.neural_playlists ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad básicas
CREATE POLICY "Users can view their own data"
  ON superpaes.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON superpaes.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own preferences"
  ON superpaes.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON superpaes.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON superpaes.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON superpaes.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON superpaes.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Funciones utilitarias
CREATE OR REPLACE FUNCTION calculate_user_level(
  experience_points INTEGER
) RETURNS INTEGER AS $$
BEGIN
  -- Fórmula básica: nivel = sqrt(exp_points / 100)
  RETURN FLOOR(SQRT(experience_points::FLOAT / 100));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_user_quantum_state(
  p_user_id UUID
) RETURNS JSONB AS $$
DECLARE
  state_data JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'state_vector', state_vector,
      'coherence', coherence,
      'entanglement', entanglement_data,
      'nodes', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', qn.id,
            'skill_id', qn.skill_id,
            'amplitude', qn.amplitude,
            'phase', qn.phase,
            'correlations', qn.correlations
          )
        )
        FROM superpaes.quantum_nodes qn
        WHERE qn.state_id = qs.id
      )
    )
  INTO state_data
  FROM superpaes.quantum_states qs
  WHERE qs.user_id = p_user_id;

  RETURN state_data;
END;
$$ LANGUAGE plpgsql STABLE;
