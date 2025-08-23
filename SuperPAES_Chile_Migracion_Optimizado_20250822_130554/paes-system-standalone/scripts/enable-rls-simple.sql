-- =====================================================================================
-- HABILITAR RLS SIMPLE - SUPERPAES
-- =====================================================================================
-- Script básico para habilitar Row Level Security
-- Ejecutar línea por línea en SQL Editor de Supabase
-- =====================================================================================

-- 1. HABILITAR RLS EN TABLAS CRÍTICAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_exercises ENABLE ROW LEVEL SECURITY;

-- 2. CREAR POLÍTICA BÁSICA PARA PROFILES
CREATE POLICY "profiles_policy" ON public.profiles FOR ALL USING (false);

-- 3. CREAR POLÍTICA BÁSICA PARA NODE_PROGRESS  
CREATE POLICY "progress_policy" ON public.node_progress FOR ALL USING (false);

-- 4. CREAR POLÍTICA BÁSICA PARA DIAGNOSTICS
CREATE POLICY "diagnostics_policy" ON public.diagnostics FOR ALL USING (false);

-- 5. CREAR POLÍTICA BÁSICA PARA STUDY_PLANS
CREATE POLICY "plans_policy" ON public.study_plans FOR ALL USING (false);

-- 6. CREAR POLÍTICA BÁSICA PARA COMPLETED_EXERCISES
CREATE POLICY "exercises_policy" ON public.completed_exercises FOR ALL USING (false);

-- 7. VERIFICAR ESTADO
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('profiles', 'node_progress', 'diagnostics', 'study_plans', 'completed_exercises');
