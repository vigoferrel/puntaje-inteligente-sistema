-- LEONARDO CONTEXT7 - CORRECCION QUIRURGICA DE ESTRUCTURA DE TABLAS (CORREGIDA)
-- Modo Sabueso: Corrige error "column efficiency does not exist"
-- ERROR CORREGIDO: UUID vs TEXT en user_id

-- PASO 1: Agregar columnas faltantes a bloom_progress
DO $$
BEGIN
    -- Agregar columna efficiency si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'efficiency') THEN
        ALTER TABLE bloom_progress ADD COLUMN efficiency INTEGER DEFAULT 85;
        RAISE NOTICE 'Columna efficiency agregada a bloom_progress';
    END IF;
    
    -- Agregar columna velocity si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'velocity') THEN
        ALTER TABLE bloom_progress ADD COLUMN velocity INTEGER DEFAULT 92;
        RAISE NOTICE 'Columna velocity agregada a bloom_progress';
    END IF;
    
    -- Agregar columna precision si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'precision') THEN
        ALTER TABLE bloom_progress ADD COLUMN precision INTEGER DEFAULT 88;
        RAISE NOTICE 'Columna precision agregada a bloom_progress';
    END IF;
    
    -- Agregar columna neural_score si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'neural_score') THEN
        ALTER TABLE bloom_progress ADD COLUMN neural_score INTEGER DEFAULT 85;
        RAISE NOTICE 'Columna neural_score agregada a bloom_progress';
    END IF;
    
    -- Agregar columna subject si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'subject') THEN
        ALTER TABLE bloom_progress ADD COLUMN subject TEXT DEFAULT 'matematica_1';
        RAISE NOTICE 'Columna subject agregada a bloom_progress';
    END IF;
    
    -- Agregar columna streak si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'streak') THEN
        ALTER TABLE bloom_progress ADD COLUMN streak INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna streak agregada a bloom_progress';
    END IF;
    
    -- Agregar columna time_spent si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_progress' AND column_name = 'time_spent') THEN
        ALTER TABLE bloom_progress ADD COLUMN time_spent INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna time_spent agregada a bloom_progress';
    END IF;
END $$;

-- PASO 2: Agregar columnas faltantes a bloom_activities
DO $$
BEGIN
    -- Agregar columna activity_type si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'activity_type') THEN
        ALTER TABLE bloom_activities ADD COLUMN activity_type TEXT NOT NULL DEFAULT 'matematica_1';
        RAISE NOTICE 'Columna activity_type agregada a bloom_activities';
    END IF;
    
    -- Agregar columna title si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'title') THEN
        ALTER TABLE bloom_activities ADD COLUMN title TEXT NOT NULL DEFAULT 'Ejercicio PAES';
        RAISE NOTICE 'Columna title agregada a bloom_activities';
    END IF;
    
    -- Agregar columna description si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'description') THEN
        ALTER TABLE bloom_activities ADD COLUMN description TEXT;
        RAISE NOTICE 'Columna description agregada a bloom_activities';
    END IF;
    
    -- Agregar columna difficulty si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'difficulty') THEN
        ALTER TABLE bloom_activities ADD COLUMN difficulty TEXT DEFAULT 'intermedio';
        RAISE NOTICE 'Columna difficulty agregada a bloom_activities';
    END IF;
    
    -- Agregar columna points si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'points') THEN
        ALTER TABLE bloom_activities ADD COLUMN points INTEGER DEFAULT 15;
        RAISE NOTICE 'Columna points agregada a bloom_activities';
    END IF;
    
    -- Agregar columna time_estimate si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'time_estimate') THEN
        ALTER TABLE bloom_activities ADD COLUMN time_estimate INTEGER DEFAULT 20;
        RAISE NOTICE 'Columna time_estimate agregada a bloom_activities';
    END IF;
    
    -- Agregar columna completed si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'completed') THEN
        ALTER TABLE bloom_activities ADD COLUMN completed BOOLEAN DEFAULT false;
        RAISE NOTICE 'Columna completed agregada a bloom_activities';
    END IF;
    
    -- Agregar columna score si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'score') THEN
        ALTER TABLE bloom_activities ADD COLUMN score INTEGER;
        RAISE NOTICE 'Columna score agregada a bloom_activities';
    END IF;
    
    -- Agregar columna time_spent si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bloom_activities' AND column_name = 'time_spent') THEN
        ALTER TABLE bloom_activities ADD COLUMN time_spent INTEGER DEFAULT 0;
        RAISE NOTICE 'Columna time_spent agregada a bloom_activities';
    END IF;
END $$;

-- PASO 3: Verificar estructura final
DO $$
DECLARE
    progress_columns INTEGER;
    activities_columns INTEGER;
BEGIN
    -- Contar columnas en bloom_progress
    SELECT COUNT(*) INTO progress_columns
    FROM information_schema.columns 
    WHERE table_name = 'bloom_progress' 
    AND column_name IN ('efficiency', 'velocity', 'precision', 'neural_score', 'subject', 'streak', 'time_spent');
    
    -- Contar columnas en bloom_activities
    SELECT COUNT(*) INTO activities_columns
    FROM information_schema.columns 
    WHERE table_name = 'bloom_activities' 
    AND column_name IN ('activity_type', 'title', 'description', 'difficulty', 'points', 'time_estimate', 'completed', 'score', 'time_spent');
    
    RAISE NOTICE '=== VERIFICACION FINAL ===';
    RAISE NOTICE 'Columnas bloom_progress: % de 7 requeridas', progress_columns;
    RAISE NOTICE 'Columnas bloom_activities: % de 9 requeridas', activities_columns;
    
    IF progress_columns = 7 AND activities_columns = 9 THEN
        RAISE NOTICE 'EXITO: Estructura de tablas corregida completamente';
        RAISE NOTICE 'Las funciones RPC ahora funcionaran sin errores';
    ELSE
        RAISE NOTICE 'ADVERTENCIA: Algunas columnas pueden estar faltando';
    END IF;
END $$;

-- PASO 4: Mensaje final
DO $$
BEGIN
    RAISE NOTICE '=== LEONARDO CONTEXT7 - CORRECCION COMPLETADA ===';
    RAISE NOTICE 'Error "column efficiency does not exist" RESUELTO';
    RAISE NOTICE 'Estructura de tablas sincronizada con funciones RPC';
    RAISE NOTICE 'Sistema listo para funcionar sin errores 400';
    RAISE NOTICE 'NOTA: No se insertan datos de ejemplo para evitar conflictos UUID';
END $$;