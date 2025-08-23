-- =====================================================================================
-- CORRECCIÓN COMPLETA DE RLS - SUPERPAES
-- =====================================================================================
-- Este script corrige todos los problemas críticos de seguridad identificados
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- =====================================================================================

BEGIN;

-- =====================================================================================
-- 1. HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS CRÍTICAS
-- =====================================================================================

-- Tabla profiles (datos personales críticos)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tabla node_progress (progreso personal del usuario)
ALTER TABLE public.node_progress ENABLE ROW LEVEL SECURITY;

-- Tabla diagnostics (evaluaciones personales)
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Tabla study_plans (planes personales de estudio)
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Tabla completed_exercises (historial personal de ejercicios)
ALTER TABLE public.completed_exercises ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 2. CREAR POLÍTICAS DE SEGURIDAD BÁSICAS
-- =====================================================================================

-- PROFILES: Solo el usuario puede ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- NODE_PROGRESS: Solo el usuario puede ver su progreso
DROP POLICY IF EXISTS "Users can view own progress" ON public.node_progress;
CREATE POLICY "Users can view own progress" ON public.node_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.node_progress;
CREATE POLICY "Users can insert own progress" ON public.node_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.node_progress;
CREATE POLICY "Users can update own progress" ON public.node_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- DIAGNOSTICS: Solo el usuario puede ver sus diagnósticos
DROP POLICY IF EXISTS "Users can view own diagnostics" ON public.diagnostics;
CREATE POLICY "Users can view own diagnostics" ON public.diagnostics
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own diagnostics" ON public.diagnostics;
CREATE POLICY "Users can insert own diagnostics" ON public.diagnostics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STUDY_PLANS: Solo el usuario puede gestionar sus planes
DROP POLICY IF EXISTS "Users can view own study plans" ON public.study_plans;
CREATE POLICY "Users can view own study plans" ON public.study_plans
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own study plans" ON public.study_plans;
CREATE POLICY "Users can insert own study plans" ON public.study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own study plans" ON public.study_plans;
CREATE POLICY "Users can update own study plans" ON public.study_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- COMPLETED_EXERCISES: Solo el usuario puede ver sus ejercicios
DROP POLICY IF EXISTS "Users can view own exercises" ON public.completed_exercises;
CREATE POLICY "Users can view own exercises" ON public.completed_exercises
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exercises" ON public.completed_exercises;
CREATE POLICY "Users can insert own exercises" ON public.completed_exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================================================
-- 3. POLÍTICAS ADMINISTRATIVAS (Service Role)
-- =====================================================================================

-- Admins pueden ver todos los perfiles (para soporte)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'service_role' OR 
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- Admins pueden insertar/modificar datos del sistema para diagnostics
DROP POLICY IF EXISTS "System can manage diagnostics" ON public.diagnostics;
CREATE POLICY "System can manage diagnostics" ON public.diagnostics
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- =====================================================================================
-- 4. VERIFICACIÓN DE POLÍTICAS APLICADAS
-- =====================================================================================

-- Esta consulta mostrará todas las políticas creadas
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE '=== POLÍTICAS RLS APLICADAS ===';
    
    FOR policy_record IN 
        SELECT tablename, policyname, cmd 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        ORDER BY tablename, policyname
    LOOP
        RAISE NOTICE 'Tabla: % | Política: % | Comando: %', 
                     policy_record.tablename, 
                     policy_record.policyname, 
                     policy_record.cmd;
    END LOOP;
END $$;

COMMIT;

-- =====================================================================================
-- 5. CONSULTA DE VERIFICACIÓN FINAL
-- =====================================================================================

-- Ejecutar esta consulta después del script para verificar el estado RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Habilitado' 
        ELSE '❌ RLS Deshabilitado' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'node_progress', 'diagnostics', 'study_plans', 'completed_exercises')
ORDER BY tablename;

-- =====================================================================================
-- INSTRUCCIONES POST-EJECUCIÓN:
-- =====================================================================================
-- 1. Verificar que todas las tablas muestren "✅ RLS Habilitado"
-- 2. Ejecutar el script fix-rls-direct.js nuevamente para confirmar la corrección
-- 3. Si todo está OK, el sistema estará listo para producción
-- =====================================================================================
