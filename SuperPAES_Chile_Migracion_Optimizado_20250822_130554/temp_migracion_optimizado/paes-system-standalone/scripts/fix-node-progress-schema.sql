-- =====================================================================================
-- CORRECCIÓN COMPLETA DEL SCHEMA DE NODE_PROGRESS - SUPERPAES
-- =====================================================================================

-- Verificar estructura actual
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'node_progress' 
ORDER BY ordinal_position;

-- Agregar columna completed_at si no existe
DO $$ 
BEGIN
    -- Verificar si completed_at existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'node_progress' 
        AND column_name = 'completed_at'
    ) THEN
        ALTER TABLE node_progress 
        ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
        
        RAISE NOTICE 'Columna completed_at agregada a node_progress';
    ELSE
        RAISE NOTICE 'Columna completed_at ya existe en node_progress';
    END IF;
END $$;

-- Agregar columna progress_percentage si no existe
DO $$ 
BEGIN
    -- Verificar si progress_percentage existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'node_progress' 
        AND column_name = 'progress_percentage'
    ) THEN
        ALTER TABLE node_progress 
        ADD COLUMN progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);
        
        RAISE NOTICE 'Columna progress_percentage agregada a node_progress';
    ELSE
        RAISE NOTICE 'Columna progress_percentage ya existe en node_progress';
    END IF;
END $$;

-- Crear índices para optimizar consultas si no existen
CREATE INDEX IF NOT EXISTS idx_node_progress_user_id ON node_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_node_progress_node_id ON node_progress(node_id);
CREATE INDEX IF NOT EXISTS idx_node_progress_completed_at ON node_progress(completed_at) WHERE completed_at IS NOT NULL;

-- Actualizar RLS policies si la tabla tiene datos de usuario
-- Asegurar que solo el usuario propietario pueda ver/editar sus registros
DROP POLICY IF EXISTS "Users can view own progress" ON node_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON node_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON node_progress;

CREATE POLICY "Users can view own progress" ON node_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON node_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON node_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Verificar estructura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    CASE 
        WHEN column_name = 'completed_at' THEN '✅ AGREGADA'
        WHEN column_name = 'progress_percentage' THEN '✅ AGREGADA'
        ELSE '📋 EXISTENTE'
    END as status
FROM information_schema.columns 
WHERE table_name = 'node_progress' 
ORDER BY ordinal_position;

-- Mostrar políticas RLS activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'node_progress';

-- Script completado
SELECT 'Schema de node_progress corregido exitosamente ✅' as resultado;
