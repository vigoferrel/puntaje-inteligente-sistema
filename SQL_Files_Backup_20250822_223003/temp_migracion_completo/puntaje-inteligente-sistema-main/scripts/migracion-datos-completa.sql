-- =====================================================
-- MIGRACIÓN COMPLETA DE DATOS: NODOS, SKILLS Y EJERCICIOS
-- Script maestro para poblar toda la base de datos
-- Fecha: 30/05/2025
-- =====================================================

-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL
SELECT 'Verificando estructura de tablas...' as status;

-- Verificar learning_nodes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'learning_nodes' 
ORDER BY ordinal_position;

-- Verificar paes_tests
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'paes_tests' 
ORDER BY ordinal_position;

-- Verificar paes_skills
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'paes_skills' 
ORDER BY ordinal_position;

-- PASO 2: POBLAR TESTS PAES COMPLETOS
INSERT INTO paes_tests (id, complexity_level, questions_count, relative_weight, time_minutes, subject_area, description)
VALUES 
    (1, 'intermediate', 65, 1.0, 150, 'COMPRENSION_LECTORA', 'Test de Comprensión Lectora PAES'),
    (2, 'intermediate', 70, 1.0, 140, 'MATEMATICA_M1', 'Test de Matemática M1 PAES'),
    (3, 'advanced', 80, 1.0, 160, 'MATEMATICA_M2', 'Test de Matemática M2 PAES'),
    (4, 'intermediate', 75, 1.0, 145, 'HISTORIA', 'Test de Historia y Ciencias Sociales PAES'),
    (5, 'intermediate', 65, 1.0, 150, 'CIENCIAS', 'Test de Ciencias PAES'),
    (6, 'basic', 60, 0.8, 120, 'DIAGNOSTICO', 'Test Diagnóstico General'),
    (7, 'advanced', 90, 1.2, 180, 'SIMULACRO_COMPLETO', 'Simulacro Completo PAES')
ON CONFLICT (id) DO UPDATE SET
    complexity_level = EXCLUDED.complexity_level,
    questions_count = EXCLUDED.questions_count,
    relative_weight = EXCLUDED.relative_weight,
    time_minutes = EXCLUDED.time_minutes,
    subject_area = EXCLUDED.subject_area,
    description = EXCLUDED.description;

-- PASO 3: POBLAR SKILLS COMPLETAS
INSERT INTO paes_skills (id, code, impact_weight, test_id, description, category)
VALUES 
    -- Comprensión Lectora
    (1, 'TRACK_LOCATE', 1.0, 1, 'Localizar información explícita', 'COMPRENSION_LECTORA'),
    (2, 'INTERPRET_RELATE', 1.0, 1, 'Interpretar y relacionar información', 'COMPRENSION_LECTORA'),
    (3, 'EVALUATE_REFLECT', 1.0, 1, 'Evaluar y reflexionar sobre textos', 'COMPRENSION_LECTORA'),
    
    -- Matemática M1
    (4, 'SOLVE_PROBLEMS', 1.0, 2, 'Resolver problemas matemáticos', 'MATEMATICA'),
    (5, 'REPRESENT', 1.0, 2, 'Representar información matemática', 'MATEMATICA'),
    (6, 'MODEL', 1.0, 2, 'Modelar situaciones matemáticas', 'MATEMATICA'),
    
    -- Matemática M2
    (7, 'ANALYZE_FUNCTIONS', 1.2, 3, 'Analizar funciones matemáticas', 'MATEMATICA_AVANZADA'),
    (8, 'SOLVE_EQUATIONS', 1.2, 3, 'Resolver ecuaciones complejas', 'MATEMATICA_AVANZADA'),
    (9, 'GEOMETRIC_REASONING', 1.1, 3, 'Razonamiento geométrico', 'MATEMATICA_AVANZADA'),
    
    -- Historia
    (10, 'ANALYZE_SOURCES', 1.0, 4, 'Analizar fuentes históricas', 'HISTORIA'),
    (11, 'CONTEXTUALIZE', 1.0, 4, 'Contextualizar procesos históricos', 'HISTORIA'),
    (12, 'EVALUATE_EVIDENCE', 1.0, 4, 'Evaluar evidencia histórica', 'HISTORIA'),
    
    -- Ciencias
    (13, 'SCIENTIFIC_METHOD', 1.0, 5, 'Aplicar método científico', 'CIENCIAS'),
    (14, 'ANALYZE_DATA', 1.0, 5, 'Analizar datos científicos', 'CIENCIAS'),
    (15, 'FORMULATE_HYPOTHESIS', 1.0, 5, 'Formular hipótesis', 'CIENCIAS')
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    impact_weight = EXCLUDED.impact_weight,
    test_id = EXCLUDED.test_id,
    description = EXCLUDED.description,
    category = EXCLUDED.category;

-- PASO 4: POBLAR LEARNING_NODES MASIVAMENTE
INSERT INTO learning_nodes (id, title, description, difficulty_level, estimated_time, skill_id, test_id, subject_area, node_type, prerequisites, learning_objectives)
VALUES 
    -- Nodos de Comprensión Lectora
    (1, 'Identificación de Ideas Principales', 'Localizar y extraer ideas principales de textos', 'basic', 30, 1, 1, 'COMPRENSION_LECTORA', 'CONCEPT', '[]', '["Identificar ideas centrales", "Distinguir información relevante"]'),
    (2, 'Análisis de Estructura Textual', 'Comprender la organización y estructura de textos', 'intermediate', 45, 2, 1, 'COMPRENSION_LECTORA', 'SKILL', '[1]', '["Analizar organización textual", "Identificar conectores"]'),
    (3, 'Evaluación Crítica de Textos', 'Evaluar argumentos y posiciones en textos', 'advanced', 60, 3, 1, 'COMPRENSION_LECTORA', 'APPLICATION', '[1,2]', '["Evaluar argumentos", "Reflexionar críticamente"]'),
    
    -- Nodos de Matemática M1
    (4, 'Operaciones Básicas', 'Dominio de operaciones aritméticas fundamentales', 'basic', 25, 4, 2, 'MATEMATICA', 'CONCEPT', '[]', '["Realizar operaciones básicas", "Aplicar propiedades"]'),
    (5, 'Álgebra Elemental', 'Manipulación de expresiones algebraicas', 'intermediate', 40, 5, 2, 'MATEMATICA', 'SKILL', '[4]', '["Resolver ecuaciones lineales", "Factorizar expresiones"]'),
    (6, 'Geometría Plana', 'Conceptos y cálculos en geometría plana', 'intermediate', 50, 6, 2, 'MATEMATICA', 'APPLICATION', '[4]', '["Calcular áreas y perímetros", "Aplicar teoremas"]'),
    
    -- Nodos de Matemática M2
    (7, 'Funciones Avanzadas', 'Análisis de funciones complejas', 'advanced', 70, 7, 3, 'MATEMATICA_AVANZADA', 'CONCEPT', '[5]', '["Analizar funciones", "Determinar dominios"]'),
    (8, 'Cálculo Diferencial', 'Conceptos básicos de derivadas', 'advanced', 80, 8, 3, 'MATEMATICA_AVANZADA', 'SKILL', '[7]', '["Calcular derivadas", "Aplicar reglas de derivación"]'),
    (9, 'Geometría Analítica', 'Geometría en el plano cartesiano', 'advanced', 65, 9, 3, 'MATEMATICA_AVANZADA', 'APPLICATION', '[6,7]', '["Ecuaciones de rectas", "Cónicas"]'),
    
    -- Nodos de Historia
    (10, 'Análisis de Fuentes Primarias', 'Interpretación de documentos históricos', 'intermediate', 45, 10, 4, 'HISTORIA', 'SKILL', '[]', '["Analizar documentos", "Extraer información histórica"]'),
    (11, 'Procesos Históricos Chilenos', 'Comprensión de la historia de Chile', 'intermediate', 55, 11, 4, 'HISTORIA', 'CONCEPT', '[10]', '["Contextualizar eventos", "Analizar causas y consecuencias"]'),
    (12, 'Historia Universal', 'Grandes procesos de la historia mundial', 'advanced', 60, 12, 4, 'HISTORIA', 'APPLICATION', '[10,11]', '["Comparar procesos históricos", "Evaluar impactos"]'),
    
    -- Nodos de Ciencias
    (13, 'Método Científico', 'Fundamentos del método científico', 'basic', 35, 13, 5, 'CIENCIAS', 'CONCEPT', '[]', '["Aplicar método científico", "Formular preguntas"]'),
    (14, 'Análisis de Experimentos', 'Interpretación de datos experimentales', 'intermediate', 50, 14, 5, 'CIENCIAS', 'SKILL', '[13]', '["Analizar resultados", "Interpretar gráficos"]'),
    (15, 'Formulación de Hipótesis', 'Creación y validación de hipótesis', 'advanced', 45, 15, 5, 'CIENCIAS', 'APPLICATION', '[13,14]', '["Formular hipótesis", "Diseñar experimentos"]'),
    
    -- Nodos adicionales para completar el sistema
    (16, 'Estrategias de Estudio', 'Técnicas efectivas de aprendizaje', 'basic', 30, 1, 6, 'METODOLOGIA', 'CONCEPT', '[]', '["Organizar tiempo", "Técnicas de memorización"]'),
    (17, 'Manejo de Ansiedad', 'Control del estrés en evaluaciones', 'basic', 25, 2, 6, 'BIENESTAR', 'SKILL', '[]', '["Técnicas de relajación", "Manejo del tiempo"]'),
    (18, 'Simulacro Integral', 'Práctica completa tipo PAES', 'advanced', 180, 3, 7, 'EVALUACION', 'APPLICATION', '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', '["Aplicar conocimientos", "Gestionar tiempo"]')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    difficulty_level = EXCLUDED.difficulty_level,
    estimated_time = EXCLUDED.estimated_time,
    skill_id = EXCLUDED.skill_id,
    test_id = EXCLUDED.test_id,
    subject_area = EXCLUDED.subject_area,
    node_type = EXCLUDED.node_type,
    prerequisites = EXCLUDED.prerequisites,
    learning_objectives = EXCLUDED.learning_objectives;

-- PASO 5: POBLAR EJERCICIOS PARA CADA NODO
INSERT INTO exercises (id, node_id, title, content, difficulty_level, estimated_time, exercise_type, correct_answer, options, explanation)
VALUES 
    -- Ejercicios para Comprensión Lectora
    (1, 1, 'Identificar Idea Principal - Texto Narrativo', 'Lee el siguiente texto y identifica la idea principal...', 'basic', 10, 'multiple_choice', 'A', '["A) La importancia de la educación", "B) Los problemas sociales", "C) El desarrollo tecnológico", "D) La conservación ambiental"]', 'La idea principal se encuentra en el primer párrafo...'),
    (2, 1, 'Localizar Información Específica', 'Encuentra la información solicitada en el texto...', 'basic', 8, 'multiple_choice', 'C', '["A) 1995", "B) 2000", "C) 2005", "D) 2010"]', 'La fecha se menciona explícitamente en el tercer párrafo...'),
    (3, 2, 'Análisis de Conectores', 'Identifica la función del conector en la oración...', 'intermediate', 12, 'multiple_choice', 'B', '["A) Causa", "B) Consecuencia", "C) Oposición", "D) Adición"]', 'El conector "por lo tanto" indica consecuencia...'),
    
    -- Ejercicios para Matemática M1
    (4, 4, 'Operaciones con Fracciones', 'Resuelve: 3/4 + 2/3 - 1/2', 'basic', 15, 'multiple_choice', 'A', '["A) 11/12", "B) 5/6", "C) 7/8", "D) 1"]', 'Primero encuentra el común denominador...'),
    (5, 5, 'Ecuación Lineal Simple', 'Resuelve: 2x + 5 = 13', 'intermediate', 10, 'multiple_choice', 'C', '["A) x = 3", "B) x = 5", "C) x = 4", "D) x = 6"]', 'Despeja x: 2x = 13 - 5 = 8, entonces x = 4'),
    (6, 6, 'Área del Triángulo', 'Calcula el área de un triángulo con base 8 cm y altura 6 cm', 'intermediate', 8, 'multiple_choice', 'B', '["A) 20 cm²", "B) 24 cm²", "C) 28 cm²", "D) 32 cm²"]', 'Área = (base × altura) / 2 = (8 × 6) / 2 = 24 cm²'),
    
    -- Ejercicios para Matemática M2
    (7, 7, 'Dominio de Función', 'Determina el dominio de f(x) = √(x-2)', 'advanced', 20, 'multiple_choice', 'A', '["A) x ≥ 2", "B) x > 2", "C) x ≤ 2", "D) x ∈ ℝ"]', 'Para que la raíz esté definida, x-2 ≥ 0, por lo tanto x ≥ 2'),
    (8, 8, 'Derivada de Función', 'Calcula la derivada de f(x) = 3x² + 2x - 1', 'advanced', 15, 'multiple_choice', 'C', '["A) 6x + 1", "B) 3x + 2", "C) 6x + 2", "D) 6x - 1"]', 'f\'(x) = 6x + 2 aplicando la regla de potencias'),
    
    -- Ejercicios para Historia
    (9, 10, 'Análisis de Documento Histórico', 'Analiza el siguiente documento de la Independencia...', 'intermediate', 25, 'open_ended', '', '[]', 'Considera el contexto histórico, el autor y el propósito del documento'),
    (10, 11, 'Proceso de Independencia', '¿Cuál fue la causa principal de la Independencia de Chile?', 'intermediate', 15, 'multiple_choice', 'B', '["A) Crisis económica", "B) Invasión napoleónica a España", "C) Influencia inglesa", "D) Revolución francesa"]', 'La invasión napoleónica creó un vacío de poder que permitió el proceso independentista'),
    
    -- Ejercicios para Ciencias
    (11, 13, 'Pasos del Método Científico', 'Ordena los pasos del método científico', 'basic', 12, 'ordering', '1,2,3,4,5', '["Observación", "Hipótesis", "Experimentación", "Análisis", "Conclusión"]', 'El método científico sigue un orden lógico desde la observación hasta la conclusión'),
    (12, 14, 'Interpretación de Gráfico', 'Analiza el gráfico de temperatura vs tiempo...', 'intermediate', 18, 'multiple_choice', 'A', '["A) Aumenta linealmente", "B) Disminuye exponencialmente", "C) Se mantiene constante", "D) Aumenta exponencialmente"]', 'La pendiente positiva constante indica aumento lineal')
ON CONFLICT (id) DO UPDATE SET
    node_id = EXCLUDED.node_id,
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    difficulty_level = EXCLUDED.difficulty_level,
    estimated_time = EXCLUDED.estimated_time,
    exercise_type = EXCLUDED.exercise_type,
    correct_answer = EXCLUDED.correct_answer,
    options = EXCLUDED.options,
    explanation = EXCLUDED.explanation;

-- PASO 6: CREAR RELACIONES ADICIONALES Y METADATOS
-- Actualizar nodos sin skill_id o test_id
UPDATE learning_nodes 
SET skill_id = 1, test_id = 6 
WHERE skill_id IS NULL AND test_id IS NULL;

-- PASO 7: POBLAR DATOS DE PROGRESO INICIAL PARA USUARIOS EXISTENTES
INSERT INTO user_progress (user_id, node_id, completion_percentage, last_accessed, status)
SELECT 
    u.id as user_id,
    ln.id as node_id,
    0 as completion_percentage,
    NOW() as last_accessed,
    'not_started' as status
FROM auth.users u
CROSS JOIN learning_nodes ln
WHERE NOT EXISTS (
    SELECT 1 FROM user_progress up 
    WHERE up.user_id = u.id AND up.node_id = ln.id
)
ON CONFLICT (user_id, node_id) DO NOTHING;

-- PASO 8: CREAR ÍNDICES ADICIONALES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_learning_nodes_subject_area ON learning_nodes(subject_area);
CREATE INDEX IF NOT EXISTS idx_learning_nodes_difficulty ON learning_nodes(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_node_difficulty ON exercises(node_id, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_completion ON user_progress(completion_percentage);

-- PASO 9: ACTUALIZAR ESTADÍSTICAS
ANALYZE learning_nodes;
ANALYZE paes_skills;
ANALYZE paes_tests;
ANALYZE exercises;
ANALYZE user_progress;

-- PASO 10: VERIFICACIÓN FINAL COMPLETA
SELECT 'RESUMEN DE MIGRACIÓN COMPLETA' as titulo;

SELECT
    'paes_tests' as tabla,
    COUNT(*) as total_registros,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM paes_tests
UNION ALL
SELECT
    'paes_skills' as tabla,
    COUNT(*) as total_registros,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM paes_skills
UNION ALL
SELECT
    'learning_nodes' as tabla,
    COUNT(*) as total_registros,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM learning_nodes
UNION ALL
SELECT
    'exercises' as tabla,
    COUNT(*) as total_registros,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM exercises
UNION ALL
SELECT
    'user_progress' as tabla,
    COUNT(*) as total_registros,
    MIN(user_id::text::int) as min_id,
    MAX(user_id::text::int) as max_id
FROM user_progress;

-- Verificar relaciones
SELECT 
    'Nodos con skills y tests asignados' as verificacion,
    COUNT(*) as total
FROM learning_nodes 
WHERE skill_id IS NOT NULL AND test_id IS NOT NULL;

SELECT 
    'Ejercicios con nodos asignados' as verificacion,
    COUNT(*) as total
FROM exercises 
WHERE node_id IS NOT NULL;

-- Mostrar distribución por área
SELECT 
    subject_area,
    COUNT(*) as nodos_por_area,
    AVG(estimated_time) as tiempo_promedio
FROM learning_nodes 
GROUP BY subject_area
ORDER BY nodos_por_area DESC;

SELECT 'MIGRACIÓN COMPLETA EXITOSA - TODOS LOS DATOS POBLADOS' as resultado_final;