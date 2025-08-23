-- =====================================================
-- SCRIPT SQL PARA CREAR TABLAS FALTANTES EN SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. CREAR TABLA user_profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREAR TABLA paes_questions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.paes_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  skill TEXT,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]',
  correct_answer TEXT,
  explanation TEXT,
  difficulty INTEGER DEFAULT 1,
  source TEXT DEFAULT 'PAES Intelligence',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREAR TABLA study_plans
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subjects JSONB DEFAULT '[]',
  schedule JSONB DEFAULT '{}',
  goals JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREAR TABLA achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  points INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  rarity TEXT DEFAULT 'common',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las nuevas tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paes_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREAR POLÍTICAS RLS PERMISIVAS PARA DESARROLLO
-- =====================================================

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow all for development" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all for development" ON public.paes_questions;
DROP POLICY IF EXISTS "Allow all for development" ON public.study_plans;
DROP POLICY IF EXISTS "Allow all for development" ON public.achievements;

-- Crear políticas permisivas para desarrollo
CREATE POLICY "Allow all for development" ON public.user_profiles FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON public.paes_questions FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON public.study_plans FOR ALL USING (true);
CREATE POLICY "Allow all for development" ON public.achievements FOR ALL USING (true);

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO
-- =====================================================

-- Insertar perfil de usuario demo
INSERT INTO public.user_profiles (user_id, email, name, preferences) VALUES
('demo-user', 'demo@paes-intelligence.com', 'Usuario Demo PAES', '{"theme": "dark", "notifications": true, "language": "es"}')
ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  preferences = EXCLUDED.preferences,
  updated_at = NOW();

-- Insertar preguntas PAES de ejemplo
INSERT INTO public.paes_questions (subject, skill, question_text, options, correct_answer, explanation, difficulty) VALUES
('matematica1', 'algebra', '¿Cuál es el resultado de 2x + 3 = 7?', 
 '["x = 1", "x = 2", "x = 3", "x = 4"]', 'x = 2', 
 'Despejando x: 2x = 7 - 3 = 4, entonces x = 4/2 = 2', 1),

('lenguaje', 'comprension', 'En el texto "La educación es la base del progreso", ¿cuál es la idea principal?', 
 '["La educación es importante", "El progreso depende de la educación", "La base es fundamental", "El texto habla de educación"]', 
 'El progreso depende de la educación', 
 'La idea principal establece una relación causal entre educación y progreso', 2),

('ciencias', 'biologia', '¿Cuál es la función principal de los ribosomas?', 
 '["Síntesis de proteínas", "Respiración celular", "Fotosíntesis", "Digestión celular"]', 
 'Síntesis de proteínas', 
 'Los ribosomas son orgánulos responsables de la síntesis de proteínas', 2),

('historia', 'chile', '¿En qué año se firmó la Independencia de Chile?', 
 '["1810", "1818", "1820", "1823"]', '1818', 
 'La Independencia de Chile se declaró el 12 de febrero de 1818', 1),

('matematica2', 'calculo', '¿Cuál es la derivada de x²?', 
 '["x", "2x", "x²", "2x²"]', '2x', 
 'La derivada de x² es 2x según la regla de potencias', 2),

('lenguaje', 'vocabulario', '¿Cuál es el sinónimo de "perspicaz"?', 
 '["Torpe", "Astuto", "Lento", "Confuso"]', 'Astuto', 
 'Perspicaz significa que tiene agudeza mental, similar a astuto', 1),

('ciencias', 'fisica', '¿Cuál es la fórmula de la velocidad?', 
 '["v = d/t", "v = t/d", "v = d*t", "v = d+t"]', 'v = d/t', 
 'La velocidad es igual a la distancia dividida por el tiempo', 1),

('matematica1', 'geometria', '¿Cuál es el área de un círculo con radio 3?', 
 '["6π", "9π", "12π", "18π"]', '9π', 
 'El área de un círculo es πr², entonces π(3)² = 9π', 2)

ON CONFLICT DO NOTHING;

-- Insertar logros del sistema
INSERT INTO public.achievements (name, description, icon, category, points, requirements, rarity) VALUES
('Primer Paso', 'Completaste tu primer ejercicio en el sistema', '🎯', 'inicio', 10, '{"exercises_completed": 1}', 'common'),
('Estudiante Dedicado', 'Estudiaste durante 7 días consecutivos', '📚', 'constancia', 50, '{"consecutive_days": 7}', 'uncommon'),
('Maestro PAES', 'Obtuviste más de 700 puntos en un simulacro', '🏆', 'excelencia', 100, '{"simulation_score": 700}', 'rare'),
('Explorador Neural', 'Activaste el sistema de scoring neural', '🧠', 'tecnologia', 25, '{"neural_system_used": true}', 'uncommon'),
('Analista de Datos', 'Revisaste tus métricas de progreso', '📊', 'analisis', 15, '{"metrics_viewed": true}', 'common'),
('Matemático Experto', 'Completaste 50 ejercicios de matemática', '🔢', 'matematica', 75, '{"math_exercises": 50}', 'rare'),
('Lector Avanzado', 'Completaste 30 ejercicios de lenguaje', '📖', 'lenguaje', 60, '{"language_exercises": 30}', 'uncommon'),
('Científico', 'Completaste 25 ejercicios de ciencias', '🔬', 'ciencias', 50, '{"science_exercises": 25}', 'uncommon'),
('Historiador', 'Completaste 20 ejercicios de historia', '📜', 'historia', 40, '{"history_exercises": 20}', 'uncommon'),
('Velocista Mental', 'Resolviste un ejercicio en menos de 30 segundos', '⚡', 'velocidad', 20, '{"fast_solve": 30}', 'uncommon'),
('Perfeccionista', 'Obtuviste 100% de aciertos en 10 ejercicios consecutivos', '💎', 'precision', 80, '{"perfect_streak": 10}', 'rare'),
('Madrugador', 'Estudiaste antes de las 7:00 AM', '🌅', 'horario', 15, '{"early_study": true}', 'common'),
('Nocturno', 'Estudiaste después de las 10:00 PM', '🌙', 'horario', 15, '{"night_study": true}', 'common'),
('Multitarea', 'Completaste ejercicios de 3 materias en un día', '🎭', 'versatilidad', 30, '{"subjects_per_day": 3}', 'uncommon'),
('Leyenda PAES', 'Obtuviste más de 800 puntos en simulacro', '👑', 'excelencia', 200, '{"simulation_score": 800}', 'legendary')

ON CONFLICT DO NOTHING;

-- Insertar plan de estudio demo
INSERT INTO public.study_plans (user_id, title, description, subjects, schedule, goals, status) VALUES
('demo-user', 'Plan PAES Completo 2024', 'Preparación integral para la Prueba de Acceso a la Educación Superior', 
 '["matematica1", "matematica2", "lenguaje", "ciencias", "historia"]',
 '{
   "monday": ["matematica1", "lenguaje"], 
   "tuesday": ["matematica2", "ciencias"], 
   "wednesday": ["historia", "lenguaje"], 
   "thursday": ["matematica1", "ciencias"], 
   "friday": ["matematica2", "historia"], 
   "saturday": ["repaso_general"], 
   "sunday": ["descanso"]
 }',
 '{
   "matematica1": 700, 
   "matematica2": 650, 
   "lenguaje": 720, 
   "ciencias": 680, 
   "historia": 650,
   "target_date": "2024-12-01"
 }',
 'active'),

('demo-user', 'Plan Intensivo Matemática', 'Enfoque especializado en matemáticas para PAES', 
 '["matematica1", "matematica2"]',
 '{
   "monday": ["matematica1"], 
   "tuesday": ["matematica2"], 
   "wednesday": ["matematica1"], 
   "thursday": ["matematica2"], 
   "friday": ["repaso_matematicas"], 
   "saturday": ["simulacro_matematicas"], 
   "sunday": ["descanso"]
 }',
 '{
   "matematica1": 750, 
   "matematica2": 720,
   "target_date": "2024-11-15"
 }',
 'active')

ON CONFLICT DO NOTHING;

-- =====================================================
-- CREAR ÍNDICES PARA OPTIMIZAR PERFORMANCE
-- =====================================================

-- Índices para user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Índices para paes_questions
CREATE INDEX IF NOT EXISTS idx_paes_questions_subject ON public.paes_questions(subject);
CREATE INDEX IF NOT EXISTS idx_paes_questions_skill ON public.paes_questions(skill);
CREATE INDEX IF NOT EXISTS idx_paes_questions_difficulty ON public.paes_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_paes_questions_subject_skill ON public.paes_questions(subject, skill);

-- Índices para study_plans
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_status ON public.study_plans(status);

-- Índices para achievements
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON public.achievements(rarity);
CREATE INDEX IF NOT EXISTS idx_achievements_points ON public.achievements(points DESC);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que las tablas fueron creadas
DO $$
BEGIN
    RAISE NOTICE '✅ Verificando tablas creadas...';
    
    -- Verificar user_profiles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE NOTICE '✅ user_profiles: Creada exitosamente';
    ELSE
        RAISE NOTICE '❌ user_profiles: No se pudo crear';
    END IF;
    
    -- Verificar paes_questions
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'paes_questions') THEN
        RAISE NOTICE '✅ paes_questions: Creada exitosamente';
    ELSE
        RAISE NOTICE '❌ paes_questions: No se pudo crear';
    END IF;
    
    -- Verificar study_plans
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'study_plans') THEN
        RAISE NOTICE '✅ study_plans: Creada exitosamente';
    ELSE
        RAISE NOTICE '❌ study_plans: No se pudo crear';
    END IF;
    
    -- Verificar achievements
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'achievements') THEN
        RAISE NOTICE '✅ achievements: Creada exitosamente';
    ELSE
        RAISE NOTICE '❌ achievements: No se pudo crear';
    END IF;
    
    RAISE NOTICE '🎉 Proceso de creación completado!';
END $$;

-- Mostrar resumen de datos insertados
SELECT 
    'user_profiles' as tabla,
    COUNT(*) as registros
FROM public.user_profiles
UNION ALL
SELECT 
    'paes_questions' as tabla,
    COUNT(*) as registros
FROM public.paes_questions
UNION ALL
SELECT 
    'study_plans' as tabla,
    COUNT(*) as registros
FROM public.study_plans
UNION ALL
SELECT 
    'achievements' as tabla,
    COUNT(*) as registros
FROM public.achievements
ORDER BY tabla;