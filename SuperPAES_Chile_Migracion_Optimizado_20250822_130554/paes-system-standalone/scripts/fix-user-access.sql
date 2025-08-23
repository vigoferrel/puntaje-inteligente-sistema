-- =====================================================================================
-- HABILITAR ACCESO DE USUARIOS AUTENTICADOS - SUPERPAES
-- =====================================================================================
-- Este script modifica las políticas RLS para permitir que usuarios autenticados
-- accedan a sus propios datos, manteniendo la seguridad
-- =====================================================================================

-- 1. ELIMINAR POLÍTICAS RESTRICTIVAS ACTUALES
DROP POLICY IF EXISTS "Block public access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Block public access to progress" ON public.node_progress;
DROP POLICY IF EXISTS "Block public access to diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Block public access to plans" ON public.study_plans;
DROP POLICY IF EXISTS "Block public access to exercises" ON public.completed_exercises;

-- 2. CREAR POLÍTICAS PARA USUARIOS AUTENTICADOS - PROFILES
-- Usuario puede ver, insertar y actualizar su propio perfil
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. CREAR POLÍTICAS PARA DATOS PERSONALES CON user_id
-- NODE_PROGRESS: Usuario puede gestionar su progreso
CREATE POLICY "Users can manage own progress" ON public.node_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all progress" ON public.node_progress
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- DIAGNOSTICS: Usuario puede gestionar sus diagnósticos
CREATE POLICY "Users can manage own diagnostics" ON public.diagnostics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all diagnostics" ON public.diagnostics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- STUDY_PLANS: Usuario puede gestionar sus planes
CREATE POLICY "Users can manage own plans" ON public.study_plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all plans" ON public.study_plans
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- COMPLETED_EXERCISES: Usuario puede gestionar sus ejercicios
CREATE POLICY "Users can manage own exercises" ON public.completed_exercises
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all exercises" ON public.completed_exercises
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 4. POLÍTICAS PARA TABLAS PÚBLICAS (LECTURA)
-- Mantener subjects accesible para usuarios autenticados
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read subjects" ON public.subjects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage subjects" ON public.subjects
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- CRITICAL_NODES accesible para usuarios autenticados
ALTER TABLE public.critical_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read nodes" ON public.critical_nodes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage nodes" ON public.critical_nodes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- NODE_RESOURCES accesible para usuarios autenticados
ALTER TABLE public.node_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read resources" ON public.node_resources
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage resources" ON public.node_resources
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. VERIFICACIÓN FINAL
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual LIKE '%auth.uid()%' THEN '👤 Usuario autenticado'
        WHEN qual LIKE '%service_role%' THEN '🔧 Admin/Service'
        WHEN qual LIKE '%authenticated%' THEN '🔐 Cualquier autenticado'
        ELSE '🔍 Otra condición'
    END as tipo_acceso
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'node_progress', 'diagnostics', 'study_plans', 'completed_exercises', 'subjects', 'critical_nodes', 'node_resources')
ORDER BY tablename, policyname;
