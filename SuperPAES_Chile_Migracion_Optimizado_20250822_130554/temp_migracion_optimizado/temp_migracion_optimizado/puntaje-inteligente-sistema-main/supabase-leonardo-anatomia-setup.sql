-- Leonardo Anatomia Tables
-- Ejecutar en Supabase SQL Editor

-- Tabla de metas personales
CREATE TABLE IF NOT EXISTS personal_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    title TEXT NOT NULL,
    target_score INTEGER NOT NULL,
    target_date DATE NOT NULL,
    detailed_expectations JSONB NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ejercicios infinitos
CREATE TABLE IF NOT EXISTS infinite_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    difficulty INTEGER DEFAULT 1,
    bloom_level TEXT DEFAULT 'L1',
    quality_score DECIMAL DEFAULT 0.8,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de progreso optimizado
CREATE TABLE IF NOT EXISTS optimized_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    goal_id UUID REFERENCES personal_goals(id),
    subject TEXT NOT NULL,
    current_score INTEGER DEFAULT 0,
    target_score INTEGER NOT NULL,
    progress_percentage DECIMAL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_personal_goals_student ON personal_goals(student_id);
CREATE INDEX IF NOT EXISTS idx_infinite_exercises_subject_topic ON infinite_exercises(subject, topic);
CREATE INDEX IF NOT EXISTS idx_optimized_progress_student_goal ON optimized_progress(student_id, goal_id);

-- RLS Policies
ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE infinite_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimized_progress ENABLE ROW LEVEL SECURITY;

-- Politicas basicas (ajustar segun necesidades)
CREATE POLICY "Users can view own goals" ON personal_goals FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own goals" ON personal_goals FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update own goals" ON personal_goals FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Everyone can view exercises" ON infinite_exercises FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view own progress" ON optimized_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users can insert own progress" ON optimized_progress FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Users can update own progress" ON optimized_progress FOR UPDATE USING (auth.uid() = student_id);
