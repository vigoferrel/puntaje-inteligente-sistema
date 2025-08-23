-- =====================================================================================
-- VERIFICACIÓN PRE-INTEGRACIÓN DEL ARSENAL EDUCATIVO
-- =====================================================================================
-- Este script verifica el estado actual antes de la integración

-- 1. VERIFICAR TABLAS EXISTENTES RELACIONADAS CON EDUCACIÓN
SELECT 'TABLA EXISTENTE' as tipo, table_name as nombre
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name ILIKE '%edu%' 
    OR table_name ILIKE '%paes%'
    OR table_name ILIKE '%leonardo%'
    OR table_name ILIKE '%neural%'
    OR table_name ILIKE '%quantum%'
    OR table_name ILIKE '%analytics%'
    OR table_name ILIKE '%playlist%'
    OR table_name ILIKE '%simulation%'
)
ORDER BY table_name;

-- 2. VERIFICAR FUNCIONES RPC EXISTENTES
SELECT 'FUNCIÓN RPC' as tipo, routine_name as nombre
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND (
    routine_name ILIKE '%leonardo%'
    OR routine_name ILIKE '%vigoleonrocks%'
    OR routine_name ILIKE '%quantum%'
    OR routine_name ILIKE '%neural%'
    OR routine_name ILIKE '%inference%'
)
ORDER BY routine_name;

-- 3. MOSTRAR ESTADÍSTICAS ACTUALES
SELECT 
    'ESTADÍSTICAS' as tipo,
    'Total de tablas públicas: ' || COUNT(*) as info
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 
    'ESTADÍSTICAS' as tipo,
    'Total de funciones RPC: ' || COUNT(*) as info
FROM information_schema.routines 
WHERE routine_schema = 'public';
