-- =====================================================
-- POBLAR DATOS BÁSICOS: SKILLS Y TESTS
-- Ejecutar DESPUÉS del script de corrección crítica
-- =====================================================

-- PASO 1: VERIFICAR ESTRUCTURA DE PAES_TESTS
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'paes_tests' ORDER BY ordinal_position;

-- PASO 2: VERIFICAR ESTRUCTURA DE PAES_SKILLS  
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'paes_skills' ORDER BY ordinal_position;

-- PASO 3: INSERTAR TESTS BÁSICOS SI NO EXISTEN
INSERT INTO paes_tests (id, complexity_level, questions_count, relative_weight, time_minutes)
VALUES 
    (1, 'intermediate', 65, 1.0, 150),
    (2, 'intermediate', 70, 1.0, 140),
    (3, 'advanced', 80, 1.0, 160),
    (4, 'intermediate', 75, 1.0, 145),
    (5, 'intermediate', 65, 1.0, 150)
ON CONFLICT (id) DO NOTHING;

-- PASO 4: INSERTAR SKILLS BÁSICAS SI NO EXISTEN
INSERT INTO paes_skills (id, code, impact_weight, test_id)
VALUES 
    (1, 'TRACK_LOCATE', 1.0, 1),
    (2, 'INTERPRET_RELATE', 1.0, 1),
    (3, 'EVALUATE_REFLECT', 1.0, 1),
    (4, 'SOLVE_PROBLEMS', 1.0, 2),
    (5, 'REPRESENT', 1.0, 2),
    (6, 'MODEL', 1.0, 2)
ON CONFLICT (id) DO NOTHING;

-- PASO 5: ACTUALIZAR LEARNING_NODES CON DATOS REALES
UPDATE learning_nodes 
SET skill_id = 1, test_id = 1 
WHERE skill_id IS NULL AND test_id IS NULL;

-- PASO 6: VERIFICAR QUE TODO ESTÁ POBLADO
SELECT 'paes_tests' as tabla, COUNT(*) as total FROM paes_tests
UNION ALL
SELECT 'paes_skills' as tabla, COUNT(*) as total FROM paes_skills
UNION ALL  
SELECT 'learning_nodes_con_datos' as tabla, COUNT(*) as total 
FROM learning_nodes WHERE skill_id IS NOT NULL AND test_id IS NOT NULL;

-- PASO 7: VERIFICAR RELACIONES FINALES
SELECT ln.id, ln.title, ln.skill_id, ln.test_id
FROM learning_nodes ln 
WHERE ln.skill_id IS NOT NULL AND ln.test_id IS NOT NULL
LIMIT 10;