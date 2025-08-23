-- LEONARDO CONTEXT7 - DIAGNOSTICO COMPLETO DE TABLAS
-- Modo Sabueso: Verificar estructura real de tablas
-- Solo caracteres ASCII - PowerShell Windows compatible

-- PASO 1: Verificar si las tablas existen
DO $$
BEGIN
    RAISE NOTICE '=== LEONARDO CONTEXT7 - DIAGNOSTICO DE TABLAS ===';
    
    -- Verificar bloom_progress
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bloom_progress') THEN
        RAISE NOTICE 'Tabla bloom_progress: EXISTE';
    ELSE
        RAISE NOTICE 'Tabla bloom_progress: NO EXISTE';
    END IF;
    
    -- Verificar bloom_activities
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bloom_activities') THEN
        RAISE NOTICE 'Tabla bloom_activities: EXISTE';
    ELSE
        RAISE NOTICE 'Tabla bloom_activities: NO EXISTE';
    END IF;
END $$;

-- PASO 2: Mostrar estructura de bloom_progress
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ESTRUCTURA DE bloom_progress ===';
    
    FOR col_record IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'bloom_progress'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Columna: % | Tipo: % | Nullable: % | Default: %', 
                     col_record.column_name, 
                     col_record.data_type, 
                     col_record.is_nullable, 
                     col_record.column_default;
    END LOOP;
END $$;

-- PASO 3: Mostrar estructura de bloom_activities
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ESTRUCTURA DE bloom_activities ===';
    
    FOR col_record IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'bloom_activities'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Columna: % | Tipo: % | Nullable: % | Default: %', 
                     col_record.column_name, 
                     col_record.data_type, 
                     col_record.is_nullable, 
                     col_record.column_default;
    END LOOP;
END $$;

-- PASO 4: Verificar ENUM bloom_subject
DO $$
DECLARE
    enum_values TEXT[];
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== ENUM bloom_subject ===';
    
    -- Verificar si el ENUM existe
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bloom_subject') THEN
        RAISE NOTICE 'ENUM bloom_subject: EXISTE';
        
        -- Obtener valores del ENUM
        SELECT array_agg(enumlabel ORDER BY enumsortorder) INTO enum_values
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'bloom_subject';
        
        RAISE NOTICE 'Valores del ENUM:';
        FOR i IN 1..array_length(enum_values, 1) LOOP
            RAISE NOTICE '- %', enum_values[i];
        END LOOP;
    ELSE
        RAISE NOTICE 'ENUM bloom_subject: NO EXISTE';
    END IF;
END $$;

-- PASO 5: Verificar funciones RPC existentes
DO $$
DECLARE
    func_record RECORD;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== FUNCIONES RPC EXISTENTES ===';
    
    FOR func_record IN 
        SELECT 
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' 
        AND p.proname LIKE '%bloom%'
        ORDER BY p.proname
    LOOP
        RAISE NOTICE 'Funcion: %(%)', func_record.function_name, func_record.args;
    END LOOP;
END $$;

-- PASO 6: Resumen del diagnostico
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=== RESUMEN DEL DIAGNOSTICO ===';
    RAISE NOTICE 'Este diagnostico muestra la estructura real de las tablas';
    RAISE NOTICE 'Usar esta informacion para corregir las funciones RPC';
    RAISE NOTICE 'Si user_id no existe, verificar que columna se usa para identificar usuarios';
    RAISE NOTICE 'Posibles nombres: id, user_uuid, auth_user_id, etc.';
END $$;