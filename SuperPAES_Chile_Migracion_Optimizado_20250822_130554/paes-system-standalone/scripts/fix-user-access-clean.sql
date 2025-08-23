-- =====================================================================================
-- LIMPIAR Y RECREAR POLÍTICAS RLS - SUPERPAES
-- =====================================================================================
-- Script que elimina TODAS las políticas existentes y crea las correctas
-- =====================================================================================

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- PROFILES
DROP POLICY IF EXISTS "Block public access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

-- NODE_PROGRESS
DROP POLICY IF EXISTS "Block public access to progress" ON public.node_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON public.node_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.node_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.node_progress;
DROP POLICY IF EXISTS "Users can manage own progress" ON public.node_progress;
DROP POLICY IF EXISTS "Admins can manage all progress" ON public.node_progress;

-- DIAGNOSTICS
DROP POLICY IF EXISTS "Block public access to diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Users can view own diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Users can insert own diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Users can manage own diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "System can manage diagnostics" ON public.diagnostics;
DROP POLICY IF EXISTS "Admins can manage all diagnostics" ON public.diagnostics;

-- STUDY_PLANS
DROP POLICY IF EXISTS "Block public access to plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can view own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can insert own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can update own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Users can manage own plans" ON public.study_plans;
DROP POLICY IF EXISTS "Admins can manage all plans" ON public.study_plans;

-- COMPLETED_EXERCISES
DROP POLICY IF EXISTS "Block public access to exercises" ON public.completed_exercises;
DROP POLICY IF EXISTS "Users can view own exercises" ON public.completed_exercises;
DROP POLICY IF EXISTS "Users can insert own exercises" ON public.completed_exercises;
DROP POLICY IF EXISTS "Users can manage own exercises" ON public.completed_exercises;
DROP POLICY IF EXISTS "Admins can manage all exercises" ON public.completed_exercises;

-- SUBJECTS
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;

-- CRITICAL_NODES
DROP POLICY IF EXISTS "Anyone can view critical nodes" ON public.critical_nodes;
DROP POLICY IF EXISTS "Authenticated users can read nodes" ON public.critical_nodes;
DROP POLICY IF EXISTS "Admins can manage nodes" ON public.critical_nodes;

-- NODE_RESOURCES
DROP POLICY IF EXISTS "Anyone can view free resources" ON public.node_resources;
DROP POLICY IF EXISTS "Authenticated can view premium resources" ON public.node_resources;
DROP POLICY IF EXISTS "Authenticated users can read resources" ON public.node_resources;
DROP POLICY IF EXISTS "Admins can manage resources" ON public.node_resources;

-- 2. CREAR POLÍTICAS CORRECTAS DESDE CERO

-- ===== PROFILES =====
CREATE POLICY "user_own_profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "admin_all_profiles" ON public.profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== NODE_PROGRESS =====
CREATE POLICY "user_own_progress" ON public.node_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_all_progress" ON public.node_progress
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== DIAGNOSTICS =====
CREATE POLICY "user_own_diagnostics" ON public.diagnostics
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_all_diagnostics" ON public.diagnostics
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== STUDY_PLANS =====
CREATE POLICY "user_own_plans" ON public.study_plans
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_all_plans" ON public.study_plans
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== COMPLETED_EXERCISES =====
CREATE POLICY "user_own_exercises" ON public.completed_exercises
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_all_exercises" ON public.completed_exercises
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== SUBJECTS (PÚBLICO PARA AUTENTICADOS) =====
CREATE POLICY "auth_read_subjects" ON public.subjects
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_manage_subjects" ON public.subjects
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== CRITICAL_NODES (PÚBLICO PARA AUTENTICADOS) =====
CREATE POLICY "auth_read_nodes" ON public.critical_nodes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_manage_nodes" ON public.critical_nodes
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ===== NODE_RESOURCES (PÚBLICO PARA AUTENTICADOS) =====
CREATE POLICY "auth_read_resources" ON public.node_resources
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_manage_resources" ON public.node_resources
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 3. VERIFICACIÓN FINAL
SELECT 
    'POLÍTICAS CREADAS:' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public';

-- Mostrar todas las políticas por tabla
SELECT 
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN policyname LIKE 'user_%' THEN '👤 Usuario'
        WHEN policyname LIKE 'admin_%' THEN '🔧 Admin'
        WHEN policyname LIKE 'auth_%' THEN '🔐 Autenticado'
        ELSE '❓ Otro'
    END as tipo
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'node_progress', 'diagnostics', 'study_plans', 'completed_exercises', 'subjects', 'critical_nodes', 'node_resources')
ORDER BY tablename, policyname;
