-- =====================================================================================
-- SUPERPAES PRODUCTION SECURITY SETUP
-- =====================================================================================
-- Script para habilitar Row Level Security (RLS) y crear políticas granulares
-- según el Production Checklist de Supabase
-- 
-- Ejecutar en SQL Editor del panel de Supabase
-- =====================================================================================

BEGIN;

-- =====================================================================================
-- 1. HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
-- =====================================================================================

-- Tabla profiles - Información personal de usuarios
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tabla subjects - Materias PAES (solo lectura para usuarios)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Tabla critical_nodes - Nodos de conocimiento
ALTER TABLE public.critical_nodes ENABLE ROW LEVEL SECURITY;

-- Tabla node_relations - Relaciones entre conceptos
ALTER TABLE public.node_relations ENABLE ROW LEVEL SECURITY;

-- Tabla node_progress - Progreso por nodo (dato personal)
ALTER TABLE public.node_progress ENABLE ROW LEVEL SECURITY;

-- Tabla learning_curves - Curvas de aprendizaje (solo lectura)
ALTER TABLE public.learning_curves ENABLE ROW LEVEL SECURITY;

-- Tabla diagnostics - Evaluaciones diagnósticas (dato personal)
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Tabla study_plans - Planes de estudio (dato personal)
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Tabla node_resources - Recursos educativos
ALTER TABLE public.node_resources ENABLE ROW LEVEL SECURITY;

-- Tabla completed_exercises - Historial ejercicios (dato personal)
ALTER TABLE public.completed_exercises ENABLE ROW LEVEL SECURITY;

-- Tabla completed_simulations - Simulaciones completadas (dato personal)
ALTER TABLE public.completed_simulations ENABLE ROW LEVEL SECURITY;

-- Tabla certifications - Certificaciones (dato personal)
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Tabla generated_reports - Reportes generados (dato personal)
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;

-- Tabla email_logs - Logs de emails (dato personal)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================================================
-- 2. POLÍTICAS PARA TABLA PROFILES
-- =====================================================================================

-- Policy: Usuario solo puede ver y editar su propio perfil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        auth.jwt() ->> 'role' = 'admin' OR 
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- =====================================================================================
-- 3. POLÍTICAS PARA TABLAS DE SOLO LECTURA (PÚBLICO)
-- =====================================================================================

-- Subjects: Todos pueden leer materias
CREATE POLICY "Anyone can view subjects" ON public.subjects
    FOR SELECT USING (true);

-- Critical_nodes: Todos pueden leer nodos
CREATE POLICY "Anyone can view critical nodes" ON public.critical_nodes
    FOR SELECT USING (true);

-- Node_relations: Todos pueden leer relaciones
CREATE POLICY "Anyone can view node relations" ON public.node_relations
    FOR SELECT USING (true);

-- Learning_curves: Todos pueden leer curvas
CREATE POLICY "Anyone can view learning curves" ON public.learning_curves
    FOR SELECT USING (true);

-- Node_resources: Todos pueden leer recursos básicos, premium solo autenticados
CREATE POLICY "Anyone can view free resources" ON public.node_resources
    FOR SELECT USING (is_premium = false);

CREATE POLICY "Authenticated can view premium resources" ON public.node_resources
    FOR SELECT USING (auth.role() = 'authenticated' AND is_premium = true);

-- =====================================================================================
-- 4. POLÍTICAS PARA DATOS PERSONALES DEL USUARIO
-- =====================================================================================

-- Node_progress: Solo el usuario puede ver y modificar su progreso
CREATE POLICY "Users can view own progress" ON public.node_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.node_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.node_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Diagnostics: Solo el usuario puede ver y crear sus diagnósticos
CREATE POLICY "Users can view own diagnostics" ON public.diagnostics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own diagnostics" ON public.diagnostics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study_plans: Solo el usuario puede gestionar sus planes
CREATE POLICY "Users can view own study plans" ON public.study_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans" ON public.study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans" ON public.study_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Completed_exercises: Solo el usuario puede ver y agregar sus ejercicios
CREATE POLICY "Users can view own exercises" ON public.completed_exercises
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" ON public.completed_exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Completed_simulations: Solo el usuario puede ver y agregar sus simulaciones
CREATE POLICY "Users can view own simulations" ON public.completed_simulations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulations" ON public.completed_simulations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certifications: Solo el usuario puede ver sus certificaciones
CREATE POLICY "Users can view own certifications" ON public.certifications
    FOR SELECT USING (auth.uid() = user_id);

-- Generated_reports: Solo el usuario puede ver sus reportes
CREATE POLICY "Users can view own reports" ON public.generated_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.generated_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email_logs: Solo el usuario puede ver sus logs de email
CREATE POLICY "Users can view own email logs" ON public.email_logs
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================================================
-- 5. POLÍTICAS ADMINISTRATIVAS
-- =====================================================================================

-- Admins pueden insertar certifications (cuando el sistema las otorga)
CREATE POLICY "System can insert certifications" ON public.certifications
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- Admins pueden insertar email logs (cuando el sistema envía emails)
CREATE POLICY "System can insert email logs" ON public.email_logs
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- Admins pueden gestionar recursos y nodos (solo para mantenimiento)
CREATE POLICY "Admins can manage resources" ON public.node_resources
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'user_role' = 'admin'
    );

CREATE POLICY "Admins can manage nodes" ON public.critical_nodes
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        auth.jwt() ->> 'user_role' = 'admin'
    );

-- =====================================================================================
-- 6. VERIFICACIÓN DE CONFIGURACIÓN RLS
-- =====================================================================================

-- Función para verificar que todas las tablas tienen RLS habilitado
CREATE OR REPLACE FUNCTION verify_rls_enabled()
RETURNS TABLE(table_name TEXT, rls_enabled BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        CASE WHEN t.row_security = 'YES' THEN true ELSE false END as rls_enabled
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- =====================================================================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- =====================================================================================
/*
DESPUÉS DE EJECUTAR ESTE SCRIPT:

1. Verificar RLS habilitado:
   SELECT * FROM verify_rls_enabled();

2. Probar políticas:
   - Crear usuario de prueba
   - Intentar acceder a datos de otro usuario
   - Confirmar que solo accede a sus propios datos

3. Revisar en Supabase Dashboard:
   - Authentication > Policies
   - Confirmar que todas las tablas aparecen con políticas

4. Alertas de seguridad:
   - Si alguna tabla no tiene RLS o políticas, el sistema debería alertar
   - Registrar cualquier excepción en logs de seguridad
*/
