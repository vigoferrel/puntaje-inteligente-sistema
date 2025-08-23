-- =====================================================
-- IMPLEMENTACIÓN COMPLETA DE NODOS DE MATEMÁTICA M2
-- 15 nodos especializados en matemática avanzada electiva
-- Tiempo estimado: 6-8 minutos
-- =====================================================

-- PASO 1: Verificar que la tabla learning_nodes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Ejecutar primero la creación de estructura de BD.';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Álgebra Avanzada (5 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M2-01', 'Funciones exponenciales y logarítmicas', 
 'Analiza y resuelve problemas con funciones exponenciales y logarítmicas', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['modelar', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['exponential_analysis', 'logarithmic_problems'], 3),

('M2-02', 'Ecuaciones exponenciales y logarítmicas', 
 'Resuelve ecuaciones que involucran exponenciales y logaritmos', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['argumentar-comunicar', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['exponential_equations', 'logarithmic_solving'], 3),

('M2-03', 'Progresiones aritméticas y geométricas', 
 'Analiza y calcula términos de progresiones aritméticas y geométricas', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.4, 4.2,
 ARRAY['sequence_analysis', 'progression_problems'], 3),

('M2-04', 'Límites y continuidad básica', 
 'Calcula límites simples y analiza continuidad de funciones', 
 'MATEMATICA_M2', 'argumentar-comunicar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'analizar', 'avanzado', 1.5, 4.8,
 ARRAY['limit_calculation', 'continuity_analysis'], 3),

('M2-05', 'Derivadas básicas y aplicaciones', 
 'Calcula derivadas simples y las aplica a problemas de optimización', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.6, 5.2,
 ARRAY['derivative_calculation', 'optimization_problems'], 3);

-- PASO 3: Insertar nodos de Geometría Avanzada (5 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M2-06', 'Trigonometría avanzada', 
 'Resuelve problemas complejos usando identidades trigonométricas', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['argumentar-comunicar', 'representar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['trigonometric_identities', 'complex_triangle_solving'], 3),

('M2-07', 'Funciones trigonométricas', 
 'Analiza gráficas y propiedades de funciones trigonométricas', 
 'MATEMATICA_M2', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'geometric', 'analizar', 'avanzado', 1.4, 4.2,
 ARRAY['trigonometric_functions', 'periodic_analysis'], 3),

('M2-08', 'Geometría analítica avanzada', 
 'Estudia cónicas y sus propiedades en el plano cartesiano', 
 'MATEMATICA_M2', 'modelar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'geometric', 'analizar', 'avanzado', 1.5, 4.8,
 ARRAY['conic_analysis', 'analytic_geometry_advanced'], 3),

('M2-09', 'Vectores en el plano', 
 'Opera con vectores y los aplica a problemas geométricos', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['representar', 'modelar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['vector_operations', 'geometric_applications'], 3),

('M2-10', 'Transformaciones en el plano', 
 'Analiza transformaciones complejas y sus composiciones', 
 'MATEMATICA_M2', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'geometric', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['transformation_analysis', 'composition_problems'], 3);

-- PASO 4: Insertar nodos de Estadística y Probabilidad (5 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M2-11', 'Probabilidad condicional', 
 'Calcula probabilidades condicionales y aplica teorema de Bayes', 
 'MATEMATICA_M2', 'resolver-problemas', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'statistical', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['conditional_probability', 'bayes_theorem'], 3),

('M2-12', 'Distribuciones de probabilidad', 
 'Analiza distribuciones binomial y normal básica', 
 'MATEMATICA_M2', 'modelar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'statistical', 'analizar', 'avanzado', 1.4, 4.2,
 ARRAY['probability_distributions', 'normal_distribution'], 3),

('M2-13', 'Estadística descriptiva avanzada', 
 'Calcula e interpreta medidas de dispersión y posición', 
 'MATEMATICA_M2', 'argumentar-comunicar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'statistical', 'analizar', 'intermedio', 1.3, 3.8,
 ARRAY['descriptive_statistics', 'data_interpretation'], 3),

('M2-14', 'Correlación y regresión lineal', 
 'Analiza correlaciones y calcula rectas de regresión', 
 'MATEMATICA_M2', 'modelar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'statistical', 'analizar', 'avanzado', 1.5, 4.8,
 ARRAY['correlation_analysis', 'linear_regression'], 3),

('M2-15', 'Inferencia estadística básica', 
 'Realiza estimaciones y pruebas de hipótesis simples', 
 'MATEMATICA_M2', 'argumentar-comunicar', 
 ARRAY['resolver-problemas', 'modelar'], 
 'contemporáneo', 'universal', 'statistical', 'evaluar', 'avanzado', 1.6, 5.0,
 ARRAY['statistical_inference', 'hypothesis_testing'], 3);

-- PASO 5: Verificar la implementación
SELECT 'Verificando implementación de nodos de Matemática M2...' as status;

-- Contar nodos por área temática
SELECT 
    CASE 
        WHEN code LIKE 'M2-0%' AND code <= 'M2-05' THEN 'Álgebra Avanzada'
        WHEN code LIKE 'M2-0%' AND code >= 'M2-06' OR code LIKE 'M2-1%' AND code <= 'M2-10' THEN 'Geometría Avanzada'
        WHEN code LIKE 'M2-1%' AND code >= 'M2-11' THEN 'Estadística y Probabilidad'
    END as area_tematica,
    COUNT(*) as total_nodos,
    ROUND(AVG(weight), 2) as peso_promedio,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2'
GROUP BY 
    CASE 
        WHEN code LIKE 'M2-0%' AND code <= 'M2-05' THEN 'Álgebra Avanzada'
        WHEN code LIKE 'M2-0%' AND code >= 'M2-06' OR code LIKE 'M2-1%' AND code <= 'M2-10' THEN 'Geometría Avanzada'
        WHEN code LIKE 'M2-1%' AND code >= 'M2-11' THEN 'Estadística y Probabilidad'
    END
ORDER BY total_nodos DESC;

-- Verificar distribución por dificultad
SELECT 
    difficulty,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes WHERE subject = 'MATEMATICA_M2')), 2) as porcentaje
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'básico' THEN 1 
        WHEN 'intermedio' THEN 2 
        WHEN 'avanzado' THEN 3 
    END;

-- Verificar distribución por habilidades primarias
SELECT 
    primary_skill,
    COUNT(*) as cantidad,
    ROUND(AVG(weight), 2) as peso_promedio,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2'
GROUP BY primary_skill
ORDER BY cantidad DESC;

-- Verificar distribución por área temática (thematic_area)
SELECT 
    thematic_area,
    COUNT(*) as cantidad,
    ROUND(AVG(weight), 2) as peso_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2'
GROUP BY thematic_area
ORDER BY cantidad DESC;

-- Verificar distribución por nivel de Bloom
SELECT 
    bloom_level,
    COUNT(*) as cantidad,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2'
GROUP BY bloom_level
ORDER BY 
    CASE bloom_level 
        WHEN 'recordar' THEN 1 
        WHEN 'comprender' THEN 2 
        WHEN 'aplicar' THEN 3 
        WHEN 'analizar' THEN 4 
        WHEN 'evaluar' THEN 5 
        WHEN 'crear' THEN 6 
    END;

-- PASO 6: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 7: Mensaje final
SELECT 
    'IMPLEMENTACIÓN COMPLETA DE NODOS DE MATEMÁTICA M2' as resultado,
    COUNT(*) as total_nodos_implementados
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2';

SELECT 'Distribución de nodos implementados:' as detalle;
SELECT 
    '- ' || COUNT(CASE WHEN code <= 'M2-05' THEN 1 END) || ' nodos de Álgebra Avanzada (M2-01 a M2-05)' as algebra_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M2'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code >= 'M2-06' AND code <= 'M2-10' THEN 1 END) || ' nodos de Geometría Avanzada (M2-06 a M2-10)' as geometria_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M2'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code >= 'M2-11' THEN 1 END) || ' nodos de Estadística y Probabilidad (M2-11 a M2-15)' as estadistica_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M2';

-- =====================================================
-- FIN DEL SCRIPT - 15 NODOS DE MATEMÁTICA M2 IMPLEMENTADOS
-- =====================================================