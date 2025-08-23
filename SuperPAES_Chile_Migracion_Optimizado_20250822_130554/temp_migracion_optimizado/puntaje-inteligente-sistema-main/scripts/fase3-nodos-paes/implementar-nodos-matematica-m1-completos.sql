-- =====================================================
-- IMPLEMENTACIÓN COMPLETA DE NODOS DE MATEMÁTICA M1
-- 25 nodos especializados en matemática básica obligatoria
-- Tiempo estimado: 8-10 minutos
-- =====================================================

-- PASO 1: Verificar que la tabla learning_nodes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Ejecutar primero la creación de estructura de BD.';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Números y Operaciones (8 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M1-01', 'Operaciones con números enteros', 
 'Resuelve operaciones básicas con números enteros positivos y negativos', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'básico', 1.0, 2.5,
 ARRAY['calculation_problems', 'multiple_choice'], 2),

('M1-02', 'Propiedades de números racionales', 
 'Aplica propiedades de fracciones y decimales en cálculos', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['modelar', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['fraction_operations', 'decimal_calculations'], 2),

('M1-03', 'Potencias y raíces', 
 'Calcula potencias de base entera y raíces cuadradas exactas', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.2, 3.2,
 ARRAY['power_calculations', 'root_operations'], 2),

('M1-04', 'Orden y comparación de números reales', 
 'Ordena y compara números reales en diferentes representaciones', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'comprender', 'básico', 1.0, 2.8,
 ARRAY['number_ordering', 'comparison_problems'], 2),

('M1-05', 'Aproximación y estimación', 
 'Aproxima números y estima resultados de operaciones', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'modelar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.1, 2.5,
 ARRAY['approximation_problems', 'estimation_tasks'], 2),

('M1-06', 'Porcentajes y proporcionalidad', 
 'Resuelve problemas de porcentajes y proporciones directas', 
 'MATEMATICA_M1', 'modelar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.3, 3.5,
 ARRAY['percentage_problems', 'proportion_applications'], 2),

('M1-07', 'Razones y tasas', 
 'Calcula y aplica razones, tasas y escalas en contextos reales', 
 'MATEMATICA_M1', 'modelar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.2, 3.2,
 ARRAY['ratio_problems', 'rate_calculations'], 2),

('M1-08', 'Notación científica', 
 'Expresa números en notación científica y opera con ellos', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.1, 2.8,
 ARRAY['scientific_notation', 'exponential_operations'], 2);

-- PASO 3: Insertar nodos de Álgebra y Funciones (9 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M1-09', 'Expresiones algebraicas básicas', 
 'Simplifica y evalúa expresiones algebraicas con una variable', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.2, 3.0,
 ARRAY['algebraic_simplification', 'variable_evaluation'], 2),

('M1-10', 'Ecuaciones lineales de primer grado', 
 'Resuelve ecuaciones lineales con una incógnita', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.3, 3.5,
 ARRAY['linear_equation_solving', 'algebraic_manipulation'], 2),

('M1-11', 'Sistemas de ecuaciones 2x2', 
 'Resuelve sistemas simples de dos ecuaciones con dos incógnitas', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['modelar', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['system_solving', 'substitution_method'], 2),

('M1-12', 'Inecuaciones lineales', 
 'Resuelve inecuaciones lineales y representa soluciones', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.3, 3.8,
 ARRAY['inequality_solving', 'solution_representation'], 2),

('M1-13', 'Función lineal y afín', 
 'Analiza y grafica funciones lineales y afines', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['modelar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['linear_function_analysis', 'graphing_problems'], 2),

('M1-14', 'Pendiente e intercepto', 
 'Calcula pendiente e interceptos de rectas', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'modelar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'intermedio', 1.1, 3.0,
 ARRAY['slope_calculation', 'intercept_problems'], 2),

('M1-15', 'Función cuadrática básica', 
 'Identifica características básicas de funciones cuadráticas', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'comprender', 'avanzado', 1.3, 3.5,
 ARRAY['quadratic_identification', 'parabola_analysis'], 2),

('M1-16', 'Ecuaciones cuadráticas simples', 
 'Resuelve ecuaciones cuadráticas por factorización', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.4, 4.2,
 ARRAY['quadratic_solving', 'factorization_method'], 2),

('M1-17', 'Modelado con funciones', 
 'Modela situaciones reales usando funciones lineales y cuadráticas', 
 'MATEMATICA_M1', 'modelar', 
 ARRAY['resolver-problemas', 'representar'], 
 'contemporáneo', 'universal', 'algebraic', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['real_world_modeling', 'function_applications'], 2);

-- PASO 4: Insertar nodos de Geometría (8 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M1-18', 'Perímetros y áreas de figuras planas', 
 'Calcula perímetros y áreas de polígonos y círculos', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'modelar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'básico', 1.1, 3.0,
 ARRAY['area_calculation', 'perimeter_problems'], 2),

('M1-19', 'Teorema de Pitágoras', 
 'Aplica el teorema de Pitágoras en triángulos rectángulos', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'intermedio', 1.2, 3.2,
 ARRAY['pythagorean_applications', 'right_triangle_problems'], 2),

('M1-20', 'Semejanza y congruencia', 
 'Identifica figuras semejantes y congruentes', 
 'MATEMATICA_M1', 'argumentar-comunicar', 
 ARRAY['representar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'geometric', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['similarity_problems', 'congruence_identification'], 2),

('M1-21', 'Volúmenes de cuerpos geométricos', 
 'Calcula volúmenes de prismas, cilindros y pirámides', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'modelar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'intermedio', 1.3, 3.8,
 ARRAY['volume_calculation', 'solid_geometry'], 2),

('M1-22', 'Transformaciones isométricas', 
 'Aplica traslaciones, rotaciones y reflexiones', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['resolver-problemas', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'intermedio', 1.1, 3.0,
 ARRAY['transformation_problems', 'isometry_applications'], 2),

('M1-23', 'Coordenadas cartesianas', 
 'Ubica puntos y calcula distancias en el plano cartesiano', 
 'MATEMATICA_M1', 'representar', 
 ARRAY['resolver-problemas', 'modelar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'básico', 1.0, 2.8,
 ARRAY['coordinate_problems', 'distance_calculation'], 2),

('M1-24', 'Trigonometría básica', 
 'Calcula razones trigonométricas en triángulos rectángulos', 
 'MATEMATICA_M1', 'resolver-problemas', 
 ARRAY['representar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'geometric', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['trigonometric_ratios', 'triangle_solving'], 2),

('M1-25', 'Geometría analítica básica', 
 'Relaciona álgebra y geometría en el plano cartesiano', 
 'MATEMATICA_M1', 'modelar', 
 ARRAY['representar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'geometric', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['analytic_geometry', 'coordinate_algebra'], 2);

-- PASO 5: Verificar la implementación
SELECT 'Verificando implementación de nodos de Matemática M1...' as status;

-- Contar nodos por área temática
SELECT 
    CASE 
        WHEN code LIKE 'M1-0%' AND code <= 'M1-08' THEN 'Números y Operaciones'
        WHEN code LIKE 'M1-0%' AND code >= 'M1-09' OR code LIKE 'M1-1%' AND code <= 'M1-17' THEN 'Álgebra y Funciones'
        WHEN code LIKE 'M1-1%' AND code >= 'M1-18' OR code LIKE 'M1-2%' THEN 'Geometría'
    END as area_tematica,
    COUNT(*) as total_nodos,
    ROUND(AVG(weight), 2) as peso_promedio,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1'
GROUP BY 
    CASE 
        WHEN code LIKE 'M1-0%' AND code <= 'M1-08' THEN 'Números y Operaciones'
        WHEN code LIKE 'M1-0%' AND code >= 'M1-09' OR code LIKE 'M1-1%' AND code <= 'M1-17' THEN 'Álgebra y Funciones'
        WHEN code LIKE 'M1-1%' AND code >= 'M1-18' OR code LIKE 'M1-2%' THEN 'Geometría'
    END
ORDER BY total_nodos DESC;

-- Verificar distribución por dificultad
SELECT 
    difficulty,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes WHERE subject = 'MATEMATICA_M1')), 2) as porcentaje
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1'
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
    ROUND(AVG(weight), 2) as peso_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1'
GROUP BY primary_skill
ORDER BY cantidad DESC;

-- Verificar distribución por área temática (thematic_area)
SELECT 
    thematic_area,
    COUNT(*) as cantidad,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1'
GROUP BY thematic_area
ORDER BY cantidad DESC;

-- PASO 6: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 7: Mensaje final
SELECT 
    'IMPLEMENTACIÓN COMPLETA DE NODOS DE MATEMÁTICA M1' as resultado,
    COUNT(*) as total_nodos_implementados
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1';

SELECT 'Distribución de nodos implementados:' as detalle;
SELECT 
    '- ' || COUNT(CASE WHEN code <= 'M1-08' THEN 1 END) || ' nodos de Números y Operaciones (M1-01 a M1-08)' as numeros_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M1'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code >= 'M1-09' AND code <= 'M1-17' THEN 1 END) || ' nodos de Álgebra y Funciones (M1-09 a M1-17)' as algebra_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M1'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code >= 'M1-18' THEN 1 END) || ' nodos de Geometría (M1-18 a M1-25)' as geometria_nodos
FROM learning_nodes WHERE subject = 'MATEMATICA_M1';

-- =====================================================
-- FIN DEL SCRIPT - 25 NODOS DE MATEMÁTICA M1 IMPLEMENTADOS
-- =====================================================