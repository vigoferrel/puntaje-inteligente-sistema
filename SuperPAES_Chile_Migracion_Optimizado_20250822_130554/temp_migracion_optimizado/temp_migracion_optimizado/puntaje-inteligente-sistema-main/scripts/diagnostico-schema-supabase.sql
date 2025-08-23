-- =====================================================
-- DIAGNÓSTICO COMPLETO DEL SCHEMA SUPABASE PAES
-- Script para identificar la estructura real de los 200+ nodos
-- Fecha: 30/05/2025
-- =====================================================

-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL DE LEARNING_NODES
SELECT 'ESTRUCTURA DE LEARNING_NODES' as seccion;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;

-- PASO 2: CONTAR TOTAL DE NODOS DISPONIBLES
SELECT 'CONTEO TOTAL DE NODOS' as seccion;

SELECT COUNT(*) as total_nodos_disponibles FROM learning_nodes;

-- PASO 3: MUESTRA DE NODOS REALES PARA ANÁLISIS
SELECT 'MUESTRA DE NODOS REALES' as seccion;

SELECT 
    id,
    COALESCE(code, 'SIN_CODIGO') as codigo,
    COALESCE(name, title, 'SIN_NOMBRE') as nombre,
    COALESCE(subject_area, subject, 'SIN_MATERIA') as materia,
    COALESCE(difficulty_level, difficulty, 'SIN_DIFICULTAD') as dificultad,
    COALESCE(primary_skill, skill_type, 'SIN_SKILL') as habilidad_principal,
    COALESCE(bloom_level, cognitive_level, 'SIN_BLOOM') as nivel_bloom,
    COALESCE(level, hierarchy_level, 1) as nivel_jerarquia,
    COALESCE(weight, impact_weight, 1.0) as peso
FROM learning_nodes 
LIMIT 10;

-- PASO 4: DISTRIBUCIÓN POR MATERIAS/PRUEBAS PAES
SELECT 'DISTRIBUCIÓN POR MATERIAS PAES' as seccion;

SELECT 
    COALESCE(subject_area, subject, 'INDEFINIDO') as materia_paes,
    COUNT(*) as total_nodos,
    ROUND(AVG(COALESCE(weight, 1.0)), 2) as peso_promedio,
    MIN(COALESCE(difficulty_level, difficulty, 'básico')) as dificultad_min,
    MAX(COALESCE(difficulty_level, difficulty, 'avanzado')) as dificultad_max
FROM learning_nodes 
GROUP BY COALESCE(subject_area, subject, 'INDEFINIDO')
ORDER BY total_nodos DESC;

-- PASO 5: ANÁLISIS DE COMPETENCIAS/HABILIDADES
SELECT 'ANÁLISIS DE COMPETENCIAS' as seccion;

SELECT 
    COALESCE(primary_skill, skill_type, 'SIN_SKILL') as competencia,
    COUNT(*) as frecuencia,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes)), 2) as porcentaje
FROM learning_nodes 
GROUP BY COALESCE(primary_skill, skill_type, 'SIN_SKILL')
ORDER BY frecuencia DESC;

-- PASO 6: DISTRIBUCIÓN POR NIVELES JERÁRQUICOS
SELECT 'DISTRIBUCIÓN POR NIVELES' as seccion;

SELECT 
    COALESCE(level, hierarchy_level, 1) as nivel,
    COUNT(*) as nodos_por_nivel,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes)), 2) as porcentaje
FROM learning_nodes 
GROUP BY COALESCE(level, hierarchy_level, 1)
ORDER BY nivel;

-- PASO 7: ANÁLISIS DE DIFICULTAD
SELECT 'ANÁLISIS DE DIFICULTAD' as seccion;

SELECT 
    COALESCE(difficulty_level, difficulty, 'indefinido') as dificultad,
    COUNT(*) as total_nodos,
    ROUND(AVG(COALESCE(estimated_time, average_time_minutes, 30)), 2) as tiempo_promedio_minutos
FROM learning_nodes 
GROUP BY COALESCE(difficulty_level, difficulty, 'indefinido')
ORDER BY 
    CASE COALESCE(difficulty_level, difficulty, 'indefinido')
        WHEN 'básico' THEN 1
        WHEN 'basic' THEN 1
        WHEN 'intermedio' THEN 2
        WHEN 'intermediate' THEN 2
        WHEN 'avanzado' THEN 3
        WHEN 'advanced' THEN 3
        ELSE 4
    END;

-- PASO 8: VERIFICAR RELACIONES CON PAES_SKILLS
SELECT 'RELACIÓN CON PAES_SKILLS' as seccion;

SELECT 
    ps.id as skill_id,
    ps.code as skill_code,
    COALESCE(ps.description, ps.name, 'SIN_DESCRIPCION') as skill_descripcion,
    COUNT(ln.id) as nodos_asociados
FROM paes_skills ps
LEFT JOIN learning_nodes ln ON ln.skill_id = ps.id
GROUP BY ps.id, ps.code, COALESCE(ps.description, ps.name, 'SIN_DESCRIPCION')
ORDER BY nodos_asociados DESC;

-- PASO 9: VERIFICAR RELACIONES CON PAES_TESTS
SELECT 'RELACIÓN CON PAES_TESTS' as seccion;

SELECT 
    pt.id as test_id,
    COALESCE(pt.subject_area, pt.name, 'SIN_MATERIA') as test_materia,
    pt.complexity_level,
    pt.questions_count,
    COUNT(ln.id) as nodos_asociados
FROM paes_tests pt
LEFT JOIN learning_nodes ln ON ln.test_id = pt.id
GROUP BY pt.id, COALESCE(pt.subject_area, pt.name, 'SIN_MATERIA'), pt.complexity_level, pt.questions_count
ORDER BY nodos_asociados DESC;

-- PASO 10: IDENTIFICAR CAMPOS ÚNICOS Y ESPECIALES
SELECT 'CAMPOS ESPECIALES IDENTIFICADOS' as seccion;

-- Verificar si existen campos específicos para Historia
SELECT 
    'historical_period' as campo_especial,
    COUNT(*) as nodos_con_campo
FROM learning_nodes 
WHERE historical_period IS NOT NULL
UNION ALL
SELECT 
    'geographical_scope' as campo_especial,
    COUNT(*) as nodos_con_campo
FROM learning_nodes 
WHERE geographical_scope IS NOT NULL
UNION ALL
SELECT 
    'thematic_area' as campo_especial,
    COUNT(*) as nodos_con_campo
FROM learning_nodes 
WHERE thematic_area IS NOT NULL
UNION ALL
-- Verificar campos de posición 3D
SELECT 
    'position_3d' as campo_especial,
    COUNT(*) as nodos_con_campo
FROM learning_nodes 
WHERE position_3d IS NOT NULL
UNION ALL
SELECT 
    'prerequisites' as campo_especial,
    COUNT(*) as nodos_con_campo
FROM learning_nodes 
WHERE prerequisites IS NOT NULL AND prerequisites != '[]';

-- PASO 11: ANÁLISIS DE PRERREQUISITOS
SELECT 'ANÁLISIS DE PRERREQUISITOS' as seccion;

SELECT 
    COALESCE(subject_area, subject, 'INDEFINIDO') as materia,
    COUNT(CASE WHEN prerequisites IS NOT NULL AND prerequisites != '[]' THEN 1 END) as nodos_con_prerrequisitos,
    COUNT(*) as total_nodos,
    ROUND(
        (COUNT(CASE WHEN prerequisites IS NOT NULL AND prerequisites != '[]' THEN 1 END) * 100.0 / COUNT(*)), 
        2
    ) as porcentaje_con_prerrequisitos
FROM learning_nodes 
GROUP BY COALESCE(subject_area, subject, 'INDEFINIDO')
ORDER BY porcentaje_con_prerrequisitos DESC;

-- PASO 12: VERIFICAR INTEGRIDAD DE DATOS
SELECT 'VERIFICACIÓN DE INTEGRIDAD' as seccion;

SELECT 
    'Nodos sin nombre' as problema,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE (name IS NULL OR name = '') AND (title IS NULL OR title = '')
UNION ALL
SELECT 
    'Nodos sin materia' as problema,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE (subject_area IS NULL OR subject_area = '') AND (subject IS NULL OR subject = '')
UNION ALL
SELECT 
    'Nodos sin habilidad' as problema,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE (primary_skill IS NULL OR primary_skill = '') AND (skill_type IS NULL OR skill_type = '')
UNION ALL
SELECT 
    'Nodos sin dificultad' as problema,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE (difficulty_level IS NULL OR difficulty_level = '') AND (difficulty IS NULL OR difficulty = '');

-- PASO 13: MUESTRA DETALLADA DE NODOS POR MATERIA
SELECT 'MUESTRA DETALLADA POR MATERIA' as seccion;

-- Competencia Lectora
SELECT 'COMPETENCIA_LECTORA' as materia, id, 
       COALESCE(code, 'SIN_CODIGO') as codigo,
       COALESCE(name, title) as nombre,
       COALESCE(primary_skill, skill_type) as habilidad
FROM learning_nodes 
WHERE UPPER(COALESCE(subject_area, subject, '')) LIKE '%LECTURA%' 
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%COMPRENSION%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%LECTORA%'
LIMIT 5;

-- Matemática
SELECT 'MATEMATICA' as materia, id,
       COALESCE(code, 'SIN_CODIGO') as codigo,
       COALESCE(name, title) as nombre,
       COALESCE(primary_skill, skill_type) as habilidad
FROM learning_nodes 
WHERE UPPER(COALESCE(subject_area, subject, '')) LIKE '%MATEMAT%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%MATH%'
LIMIT 5;

-- Historia
SELECT 'HISTORIA' as materia, id,
       COALESCE(code, 'SIN_CODIGO') as codigo,
       COALESCE(name, title) as nombre,
       COALESCE(primary_skill, skill_type) as habilidad
FROM learning_nodes 
WHERE UPPER(COALESCE(subject_area, subject, '')) LIKE '%HISTORIA%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%SOCIAL%'
LIMIT 5;

-- Ciencias
SELECT 'CIENCIAS' as materia, id,
       COALESCE(code, 'SIN_CODIGO') as codigo,
       COALESCE(name, title) as nombre,
       COALESCE(primary_skill, skill_type) as habilidad
FROM learning_nodes 
WHERE UPPER(COALESCE(subject_area, subject, '')) LIKE '%CIENCIA%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%BIOLOG%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%FISICA%'
   OR UPPER(COALESCE(subject_area, subject, '')) LIKE '%QUIMICA%'
LIMIT 5;

-- PASO 14: RESUMEN EJECUTIVO
SELECT 'RESUMEN EJECUTIVO' as seccion;

SELECT 
    'Total de nodos disponibles' as metrica,
    COUNT(*)::text as valor
FROM learning_nodes
UNION ALL
SELECT 
    'Materias identificadas' as metrica,
    COUNT(DISTINCT COALESCE(subject_area, subject, 'INDEFINIDO'))::text as valor
FROM learning_nodes
UNION ALL
SELECT 
    'Competencias identificadas' as metrica,
    COUNT(DISTINCT COALESCE(primary_skill, skill_type, 'SIN_SKILL'))::text as valor
FROM learning_nodes
UNION ALL
SELECT 
    'Niveles de dificultad' as metrica,
    COUNT(DISTINCT COALESCE(difficulty_level, difficulty, 'indefinido'))::text as valor
FROM learning_nodes
UNION ALL
SELECT 
    'Nodos con prerrequisitos' as metrica,
    COUNT(CASE WHEN prerequisites IS NOT NULL AND prerequisites != '[]' THEN 1 END)::text as valor
FROM learning_nodes;

SELECT 'DIAGNÓSTICO COMPLETO FINALIZADO - LISTO PARA ANÁLISIS' as resultado_final;