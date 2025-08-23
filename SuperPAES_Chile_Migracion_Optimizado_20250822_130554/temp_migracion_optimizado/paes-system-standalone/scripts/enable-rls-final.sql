-- =====================================================================================
-- HABILITAR RLS - SCRIPT DEFINITIVO SUPERPAES
-- =====================================================================================
-- COPIAR Y PEGAR EN SQL EDITOR DE SUPABASE
-- Ejecutar TODO de una vez (es seguro)
-- =====================================================================================

-- 1. HABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_exercises ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS RESTRICTIVAS (BLOQUEAR TODO ACCESO PÚBLICO)
-- Esto asegura que NADIE sin autenticación pueda acceder

-- PROFILES: Solo servicio puede acceder (bloquea acceso público)
CREATE POLICY "Block public access to profiles" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');

-- NODE_PROGRESS: Solo servicio puede acceder
CREATE POLICY "Block public access to progress" ON public.node_progress
    FOR ALL USING (auth.role() = 'service_role');

-- DIAGNOSTICS: Solo servicio puede acceder
CREATE POLICY "Block public access to diagnostics" ON public.diagnostics
    FOR ALL USING (auth.role() = 'service_role');

-- STUDY_PLANS: Solo servicio puede acceder
CREATE POLICY "Block public access to plans" ON public.study_plans
    FOR ALL USING (auth.role() = 'service_role');

-- COMPLETED_EXERCISES: Solo servicio puede acceder
CREATE POLICY "Block public access to exercises" ON public.completed_exercises
    FOR ALL USING (auth.role() = 'service_role');

-- 3. VERIFICAR RESULTADO
SELECT 
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN '🔒 PROTEGIDO' ELSE '🔓 EXPUESTO' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'node_progress', 'diagnostics', 'study_plans', 'completed_exercises')
ORDER BY tablename;
