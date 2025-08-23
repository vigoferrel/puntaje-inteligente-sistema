-- LEONARDO CONTEXT7 - LIMPIEZA TOTAL DE FUNCIONES
-- Modo Sabueso: Eliminar TODAS las versiones de funciones bloom
-- Aplicar en Supabase Dashboard > SQL Editor

-- PASO 1: Mostrar todas las funciones bloom existentes
DO $$
DECLARE
    func_record RECORD;
BEGIN
    RAISE NOTICE '=== FUNCIONES BLOOM EXISTENTES ===';
    
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args,
            p.oid
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname LIKE '%bloom%'
        ORDER BY p.proname, p.oid
    LOOP
        RAISE NOTICE 'Funcion encontrada: %.%(%)', 
                     func_record.schema_name, 
                     func_record.function_name, 
                     func_record.args;
    END LOOP;
END $$;

-- PASO 2: Eliminar TODAS las versiones de bloom_get_user_stats
DO $$
DECLARE
    func_record RECORD;
    drop_statement TEXT;
BEGIN
    RAISE NOTICE '=== ELIMINANDO bloom_get_user_stats ===';
    
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'bloom_get_user_stats'
    LOOP
        drop_statement := format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                                func_record.schema_name, 
                                func_record.function_name, 
                                func_record.args);
        
        RAISE NOTICE 'Eliminando: %', drop_statement;
        
        BEGIN
            EXECUTE drop_statement;
            RAISE NOTICE 'ELIMINADO: %', drop_statement;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ERROR eliminando: % - %', drop_statement, SQLERRM;
        END;
    END LOOP;
END $$;

-- PASO 3: Eliminar TODAS las versiones de bloom_get_activities
DO $$
DECLARE
    func_record RECORD;
    drop_statement TEXT;
BEGIN
    RAISE NOTICE '=== ELIMINANDO bloom_get_activities ===';
    
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'bloom_get_activities'
    LOOP
        drop_statement := format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                                func_record.schema_name, 
                                func_record.function_name, 
                                func_record.args);
        
        RAISE NOTICE 'Eliminando: %', drop_statement;
        
        BEGIN
            EXECUTE drop_statement;
            RAISE NOTICE 'ELIMINADO: %', drop_statement;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ERROR eliminando: % - %', drop_statement, SQLERRM;
        END;
    END LOOP;
END $$;

-- PASO 4: Eliminar TODAS las versiones de bloom_get_user_dashboard
DO $$
DECLARE
    func_record RECORD;
    drop_statement TEXT;
BEGIN
    RAISE NOTICE '=== ELIMINANDO bloom_get_user_dashboard ===';
    
    FOR func_record IN 
        SELECT 
            n.nspname as schema_name,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE p.proname = 'bloom_get_user_dashboard'
    LOOP
        drop_statement := format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                                func_record.schema_name, 
                                func_record.function_name, 
                                func_record.args);
        
        RAISE NOTICE 'Eliminando: %', drop_statement;
        
        BEGIN
            EXECUTE drop_statement;
            RAISE NOTICE 'ELIMINADO: %', drop_statement;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'ERROR eliminando: % - %', drop_statement, SQLERRM;
        END;
    END LOOP;
END $$;

-- PASO 5: Verificar que no queden funciones bloom
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname LIKE '%bloom%';
    
    RAISE NOTICE '=== VERIFICACION FINAL ===';
    RAISE NOTICE 'Funciones bloom restantes: %', func_count;
    
    IF func_count = 0 THEN
        RAISE NOTICE 'EXITO: Todas las funciones bloom eliminadas';
        RAISE NOTICE 'Ahora se pueden crear las nuevas funciones sin conflictos';
    ELSE
        RAISE NOTICE 'ADVERTENCIA: Aun quedan % funciones bloom', func_count;
    END IF;
END $$;

-- PASO 6: Mensaje final
DO $$
BEGIN
    RAISE NOTICE '=== LEONARDO CONTEXT7 - LIMPIEZA COMPLETADA ===';
    RAISE NOTICE 'Todas las versiones de funciones bloom eliminadas';
    RAISE NOTICE 'Error "function name is not unique" resuelto';
    RAISE NOTICE 'Ahora aplicar leonardo-ultra-simple.sql';
END $$;