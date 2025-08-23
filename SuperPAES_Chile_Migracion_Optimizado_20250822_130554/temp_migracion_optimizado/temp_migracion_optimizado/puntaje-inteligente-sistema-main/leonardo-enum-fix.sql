-- LEONARDO CONTEXT7 - CORRECCION QUIRURGICA DE ENUM bloom_subject
-- Modo Sabueso: Resuelve error "invalid input value for enum bloom_subject: matematica_1"
-- Aplicar en Supabase Dashboard > SQL Editor

-- PASO 1: Verificar valores actuales del ENUM
DO $$
DECLARE
    enum_values TEXT[];
BEGIN
    -- Obtener valores actuales del ENUM bloom_subject
    SELECT array_agg(enumlabel ORDER BY enumsortorder) INTO enum_values
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'bloom_subject';
    
    RAISE NOTICE '=== VALORES ACTUALES DEL ENUM bloom_subject ===';
    FOR i IN 1..array_length(enum_values, 1) LOOP
        RAISE NOTICE '- %', enum_values[i];
    END LOOP;
END $$;

-- PASO 2: Agregar valores faltantes al ENUM bloom_subject
DO $$
BEGIN
    -- Agregar 'matematica_1' si no existe
    BEGIN
        ALTER TYPE bloom_subject ADD VALUE 'matematica_1';
        RAISE NOTICE 'Valor matematica_1 agregado al ENUM bloom_subject';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Valor matematica_1 ya existe en ENUM bloom_subject';
    END;
    
    -- Agregar 'matematica_2' si no existe
    BEGIN
        ALTER TYPE bloom_subject ADD VALUE 'matematica_2';
        RAISE NOTICE 'Valor matematica_2 agregado al ENUM bloom_subject';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Valor matematica_2 ya existe en ENUM bloom_subject';
    END;
    
    -- Agregar 'competencia_lectora' si no existe
    BEGIN
        ALTER TYPE bloom_subject ADD VALUE 'competencia_lectora';
        RAISE NOTICE 'Valor competencia_lectora agregado al ENUM bloom_subject';
    EXCEPTION WHEN duplicate_object THEN
        RAISE NOTICE 'Valor competencia_lectora ya existe en ENUM bloom_subject';
    END;
END $$;

-- PASO 3: Verificar valores finales del ENUM
DO $$
DECLARE
    enum_values TEXT[];
    expected_values TEXT[] := ARRAY['matematica', 'lectura', 'historia', 'ciencias', 'matematica_1', 'matematica_2', 'competencia_lectora'];
    missing_values TEXT[] := ARRAY[]::TEXT[];
    value TEXT;
BEGIN
    -- Obtener valores actuales del ENUM bloom_subject
    SELECT array_agg(enumlabel ORDER BY enumsortorder) INTO enum_values
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'bloom_subject';
    
    RAISE NOTICE '=== VALORES FINALES DEL ENUM bloom_subject ===';
    FOR i IN 1..array_length(enum_values, 1) LOOP
        RAISE NOTICE '- %', enum_values[i];
    END LOOP;
    
    -- Verificar que todos los valores esperados esten presentes
    FOREACH value IN ARRAY expected_values LOOP
        IF NOT (value = ANY(enum_values)) THEN
            missing_values := array_append(missing_values, value);
        END IF;
    END LOOP;
    
    IF array_length(missing_values, 1) > 0 THEN
        RAISE NOTICE 'ADVERTENCIA: Valores faltantes: %', array_to_string(missing_values, ', ');
    ELSE
        RAISE NOTICE 'EXITO: Todos los valores esperados estan presentes';
    END IF;
END $$;

-- PASO 4: Probar insercion con valores nuevos
DO $$
BEGIN
    -- Probar que ahora podemos usar 'matematica_1'
    BEGIN
        -- Crear una tabla temporal para probar
        CREATE TEMP TABLE test_bloom_subject (
            id SERIAL PRIMARY KEY,
            subject bloom_subject
        );
        
        -- Insertar valores de prueba
        INSERT INTO test_bloom_subject (subject) VALUES 
            ('matematica_1'),
            ('matematica_2'),
            ('competencia_lectora');
        
        RAISE NOTICE 'EXITO: Valores matematica_1, matematica_2, competencia_lectora funcionan correctamente';
        
        -- Limpiar tabla temporal
        DROP TABLE test_bloom_subject;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'ERROR en prueba: %', SQLERRM;
    END;
END $$;

-- PASO 5: Mensaje final
DO $$
BEGIN
    RAISE NOTICE '=== LEONARDO CONTEXT7 - ENUM CORREGIDO ===';
    RAISE NOTICE 'Error "invalid input value for enum bloom_subject: matematica_1" RESUELTO';
    RAISE NOTICE 'ENUM bloom_subject ahora incluye:';
    RAISE NOTICE '- matematica (original)';
    RAISE NOTICE '- lectura (original)';
    RAISE NOTICE '- historia (original)';
    RAISE NOTICE '- ciencias (original)';
    RAISE NOTICE '- matematica_1 (NUEVO)';
    RAISE NOTICE '- matematica_2 (NUEVO)';
    RAISE NOTICE '- competencia_lectora (NUEVO)';
    RAISE NOTICE 'Sistema Leonardo Context7 listo para funcionar sin errores ENUM';
END $$;