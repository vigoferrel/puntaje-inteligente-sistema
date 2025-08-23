-- =====================================================
-- MIGRACIÓN DE DATOS EXISTENTES AL NUEVO SCHEMA PAES
-- Script para migrar los 200+ nodos existentes al schema optimizado
-- Preserva todos los datos actuales y los adapta al nuevo formato
-- Fecha: 30/05/2025
-- =====================================================

-- PASO 1: CREAR TABLA TEMPORAL PARA BACKUP
CREATE TABLE IF NOT EXISTS learning_nodes_backup AS 
SELECT * FROM learning_nodes;

SELECT 'Backup creado con ' || COUNT(*) || ' nodos' as backup_status 
FROM learning_nodes_backup;

-- PASO 2: MAPEAR MATERIAS EXISTENTES A ENUM
-- Crear función de mapeo para subject_area
CREATE OR REPLACE FUNCTION map_subject_to_enum(subject_text TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN UPPER(subject_text) LIKE '%LECTURA%' OR 
             UPPER(subject_text) LIKE '%COMPRENSION%' OR 
             UPPER(subject_text) LIKE '%LECTORA%' OR
             UPPER(subject_text) LIKE '%LENGUAJE%' THEN
            RETURN 'COMPETENCIA_LECTORA';
            
        WHEN UPPER(subject_text) LIKE '%MATEMAT%' AND 
             (UPPER(subject_text) LIKE '%M1%' OR 
              UPPER(subject_text) LIKE '%BASICO%' OR
              UPPER(subject_text) LIKE '%MEDIO%') THEN
            RETURN 'MATEMATICA_M1';
            
        WHEN UPPER(subject_text) LIKE '%MATEMAT%' AND 
             (UPPER(subject_text) LIKE '%M2%' OR 
              UPPER(subject_text) LIKE '%AVANZAD%' OR
              UPPER(subject_text) LIKE '%SUPERIOR%') THEN
            RETURN 'MATEMATICA_M2';
            
        WHEN UPPER(subject_text) LIKE '%HISTORIA%' OR 
             UPPER(subject_text) LIKE '%SOCIAL%' OR
             UPPER(subject_text) LIKE '%CIVICA%' OR
             UPPER(subject_text) LIKE '%CIUDADAN%' THEN
            RETURN 'HISTORIA_CS_SOCIALES';
            
        WHEN UPPER(subject_text) LIKE '%CIENCIA%' OR 
             UPPER(subject_text) LIKE '%BIOLOG%' OR
             UPPER(subject_text) LIKE '%FISICA%' OR
             UPPER(subject_text) LIKE '%QUIMICA%' THEN
            RETURN 'CIENCIAS';
            
        ELSE
            RETURN 'COMPETENCIA_LECTORA'; -- Default
    END;
END
$$ LANGUAGE plpgsql;

-- PASO 3: MAPEAR HABILIDADES EXISTENTES
CREATE OR REPLACE FUNCTION map_skill_to_enum(skill_text TEXT)
RETURNS TEXT AS $$
BEGIN
    CASE 
        WHEN UPPER(skill_text) LIKE '%RESOLVER%' OR 
             UPPER(skill_text) LIKE '%PROBLEM%' OR
             UPPER(skill_text) LIKE '%SOLVE%' THEN
            RETURN 'resolver-problemas';
            
        WHEN UPPER(skill_text) LIKE '%REPRESENT%' OR
             UPPER(skill_text) LIKE '%GRAFICO%' OR
             UPPER(skill_text) LIKE '%SIMBOLO%' THEN
            RETURN 'representar';
            
        WHEN UPPER(skill_text) LIKE '%MODEL%' OR
             UPPER(skill_text) LIKE '%SIMULA%' THEN
            RETURN 'modelar';
            
        WHEN UPPER(skill_text) LIKE '%INTERPRET%' OR 
             UPPER(skill_text) LIKE '%RELACION%' OR
             UPPER(skill_text) LIKE '%CONECTA%' THEN
            RETURN 'interpretar-relacionar';
            
        WHEN UPPER(skill_text) LIKE '%EVALUA%' OR 
             UPPER(skill_text) LIKE '%REFLEXION%' OR
             UPPER(skill_text) LIKE '%CRITICA%' THEN
            RETURN 'evaluar-reflexionar';
            
        WHEN UPPER(skill_text) LIKE '%RASTREAR%' OR 
             UPPER(skill_text) LIKE '%LOCALIZAR%' OR
             UPPER(skill_text) LIKE '%BUSCAR%' OR
             UPPER(skill_text) LIKE '%TRACK%' THEN
            RETURN 'rastrear-localizar';
            
        WHEN UPPER(skill_text) LIKE '%TEMPORAL%' OR 
             UPPER(skill_text) LIKE '%CRONOLOG%' OR
             UPPER(skill_text) LIKE '%TIEMPO%' THEN
            RETURN 'pensamiento-temporal';
            
        WHEN UPPER(skill_text) LIKE '%FUENTE%' OR 
             UPPER(skill_text) LIKE '%DOCUMENTO%' OR
             UPPER(skill_text) LIKE '%SOURCE%' THEN
            RETURN 'analisis-fuentes';
            
        WHEN UPPER(skill_text) LIKE '%MULTICAUSAL%' OR 
             UPPER(skill_text) LIKE '%CAUSA%' OR
             UPPER(skill_text) LIKE '%FACTOR%' THEN
            RETURN 'analisis-multicausal';
            
        WHEN UPPER(skill_text) LIKE '%CRITICO%' OR 
             UPPER(skill_text) LIKE '%ARGUMENTO%' OR
             UPPER(skill_text) LIKE '%JUICIO%' THEN
            RETURN 'pensamiento-critico';
            
        ELSE
            RETURN 'interpretar-relacionar'; -- Default
    END;
END
$$ LANGUAGE plpgsql;

-- PASO 4: FUNCIÓN PARA ASIGNAR COLORES POR COMPETENCIA
CREATE OR REPLACE FUNCTION get_skill_color(skill TEXT)
RETURNS VARCHAR(7) AS $$
BEGIN
    CASE skill
        WHEN 'resolver-problemas' THEN RETURN '#4F46E5';
        WHEN 'representar' THEN RETURN '#10B981';
        WHEN 'modelar' THEN RETURN '#F59E0B';
        WHEN 'interpretar-relacionar' THEN RETURN '#3B82F6';
        WHEN 'evaluar-reflexionar' THEN RETURN '#EF4444';
        WHEN 'rastrear-localizar' THEN RETURN '#8B5CF6';
        WHEN 'pensamiento-temporal' THEN RETURN '#F97316';
        WHEN 'analisis-fuentes' THEN RETURN '#06B6D4';
        WHEN 'analisis-multicausal' THEN RETURN '#84CC16';
        WHEN 'pensamiento-critico' THEN RETURN '#EC4899';
        ELSE RETURN '#6B7280'; -- Gray default
    END;
END
$$ LANGUAGE plpgsql;

-- PASO 5: AGREGAR COLUMNAS NECESARIAS SI NO EXISTEN
DO $$
BEGIN
    -- Agregar columnas del nuevo schema si no existen
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'code') THEN
        ALTER TABLE learning_nodes ADD COLUMN code VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'name') THEN
        ALTER TABLE learning_nodes ADD COLUMN name VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'subject') THEN
        ALTER TABLE learning_nodes ADD COLUMN subject VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'primary_skill') THEN
        ALTER TABLE learning_nodes ADD COLUMN primary_skill VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'skill_color') THEN
        ALTER TABLE learning_nodes ADD COLUMN skill_color VARCHAR(7);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'difficulty') THEN
        ALTER TABLE learning_nodes ADD COLUMN difficulty VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'bloom_level') THEN
        ALTER TABLE learning_nodes ADD COLUMN bloom_level VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'level') THEN
        ALTER TABLE learning_nodes ADD COLUMN level INTEGER DEFAULT 4;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'weight') THEN
        ALTER TABLE learning_nodes ADD COLUMN weight DECIMAL(4,2) DEFAULT 1.0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'average_time_minutes') THEN
        ALTER TABLE learning_nodes ADD COLUMN average_time_minutes DECIMAL(4,1);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'learning_nodes' AND column_name = 'cognitive_complexity') THEN
        ALTER TABLE learning_nodes ADD COLUMN cognitive_complexity INTEGER DEFAULT 2;
    END IF;
END $$;

-- PASO 6: ACTUALIZAR DATOS EXISTENTES CON MAPEO INTELIGENTE
UPDATE learning_nodes SET
    -- Mapear materia
    subject = map_subject_to_enum(COALESCE(subject_area, 'COMPETENCIA_LECTORA')),
    
    -- Mapear habilidad principal
    primary_skill = map_skill_to_enum(COALESCE(
        primary_skill, 
        skill_type, 
        'interpretar-relacionar'
    )),
    
    -- Mapear dificultad
    difficulty = CASE 
        WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASIC%' OR 
             UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASICO%' THEN 'básico'
        WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%ADVANCED%' OR 
             UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%AVANZADO%' THEN 'avanzado'
        ELSE 'intermedio'
    END,
    
    -- Mapear Bloom level
    bloom_level = CASE 
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%RECORDAR%' THEN 'recordar'
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%APLICAR%' THEN 'aplicar'
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%ANALIZAR%' THEN 'analizar'
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%EVALUAR%' THEN 'evaluar'
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%CREAR%' THEN 'crear'
        ELSE 'comprender'
    END,
    
    -- Generar código si no existe
    code = CASE 
        WHEN code IS NULL OR code = '' THEN
            CASE map_subject_to_enum(COALESCE(subject_area, 'COMPETENCIA_LECTORA'))
                WHEN 'COMPETENCIA_LECTORA' THEN 'CL-' || LPAD(id::text, 3, '0')
                WHEN 'MATEMATICA_M1' THEN 'M1-' || LPAD(id::text, 3, '0')
                WHEN 'MATEMATICA_M2' THEN 'M2-' || LPAD(id::text, 3, '0')
                WHEN 'HISTORIA_CS_SOCIALES' THEN 'HST-' || LPAD(id::text, 3, '0')
                WHEN 'CIENCIAS' THEN 'CIE-' || LPAD(id::text, 3, '0')
                ELSE 'NOD-' || LPAD(id::text, 3, '0')
            END
        ELSE code
    END,
    
    -- Asegurar que name existe
    name = COALESCE(name, title, 'Nodo ' || id),
    
    -- Asignar peso basado en dificultad
    weight = CASE 
        WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASIC%' OR 
             UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASICO%' THEN 0.8
        WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%ADVANCED%' OR 
             UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%AVANZADO%' THEN 1.3
        ELSE 1.0
    END,
    
    -- Calcular tiempo promedio basado en dificultad
    average_time_minutes = CASE 
        WHEN estimated_time IS NOT NULL THEN estimated_time::DECIMAL
        ELSE CASE 
            WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASIC%' OR 
                 UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%BASICO%' THEN 20.0
            WHEN UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%ADVANCED%' OR 
                 UPPER(COALESCE(difficulty_level, difficulty, 'intermedio')) LIKE '%AVANZADO%' THEN 45.0
            ELSE 30.0
        END
    END,
    
    -- Asignar nivel jerárquico
    level = COALESCE(level, hierarchy_level, 4),
    
    -- Mapear complejidad cognitiva basada en Bloom
    cognitive_complexity = CASE 
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%RECORDAR%' THEN 1
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%COMPRENDER%' THEN 2
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%APLICAR%' THEN 3
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%ANALIZAR%' THEN 4
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%EVALUAR%' THEN 5
        WHEN UPPER(COALESCE(bloom_level, cognitive_level, 'comprender')) LIKE '%CREAR%' THEN 6
        ELSE 2
    END

WHERE subject IS NULL OR primary_skill IS NULL OR difficulty IS NULL;

-- PASO 7: ASIGNAR COLORES BASADOS EN COMPETENCIAS
UPDATE learning_nodes 
SET skill_color = get_skill_color(primary_skill)
WHERE skill_color IS NULL AND primary_skill IS NOT NULL;

-- PASO 8: ASIGNAR TEST_ID BASADO EN MATERIA
UPDATE learning_nodes 
SET test_id = CASE subject
    WHEN 'COMPETENCIA_LECTORA' THEN 1
    WHEN 'MATEMATICA_M1' THEN 2
    WHEN 'MATEMATICA_M2' THEN 3
    WHEN 'HISTORIA_CS_SOCIALES' THEN 4
    WHEN 'CIENCIAS' THEN 5
    ELSE 1
END
WHERE test_id IS NULL;

-- PASO 9: VERIFICAR MIGRACIÓN
SELECT 'VERIFICACIÓN DE MIGRACIÓN' as seccion;

SELECT 
    'Total nodos migrados' as metrica,
    COUNT(*)::text as valor
FROM learning_nodes
WHERE subject IS NOT NULL AND primary_skill IS NOT NULL
UNION ALL
SELECT 
    'Nodos por materia' as metrica,
    subject || ': ' || COUNT(*)::text as valor
FROM learning_nodes
WHERE subject IS NOT NULL
GROUP BY subject
UNION ALL
SELECT 
    'Competencias únicas' as metrica,
    COUNT(DISTINCT primary_skill)::text as valor
FROM learning_nodes
WHERE primary_skill IS NOT NULL
UNION ALL
SELECT 
    'Nodos con código único' as metrica,
    COUNT(DISTINCT code)::text as valor
FROM learning_nodes
WHERE code IS NOT NULL;

-- PASO 10: LIMPIAR FUNCIONES TEMPORALES
DROP FUNCTION IF EXISTS map_subject_to_enum(TEXT);
DROP FUNCTION IF EXISTS map_skill_to_enum(TEXT);
DROP FUNCTION IF EXISTS get_skill_color(TEXT);

SELECT 'MIGRACIÓN COMPLETA EXITOSA - ' || COUNT(*) || ' NODOS MIGRADOS AL NUEVO SCHEMA' as resultado_final
FROM learning_nodes
WHERE subject IS NOT NULL AND primary_skill IS NOT NULL;