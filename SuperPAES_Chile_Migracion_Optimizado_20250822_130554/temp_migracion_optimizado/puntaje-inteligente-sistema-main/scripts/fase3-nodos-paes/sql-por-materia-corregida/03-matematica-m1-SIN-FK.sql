-- =====================================================
-- MATEMÁTICA M1 - 25 NODOS PAES (SIN FK)
-- Matemática básica obligatoria con sistema TEXT estable
-- Tiempo estimado: 2 minutos
-- =====================================================

-- PASO 1: Verificación de funciones
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_skill_text') THEN
        RAISE EXCEPTION 'Función get_skill_text no existe. Ejecutar primero 01-D-solucion-radical-sin-fk.sql';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_test_text') THEN
        RAISE EXCEPTION 'Función get_test_text no existe. Ejecutar primero 01-D-solucion-radical-sin-fk.sql';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Matemática M1 (25 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M1-01', 'Operaciones con números enteros', 
 'Suma, resta, multiplicación y división de números enteros', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['localizar-informacion', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'numérico', 'aplicar', 'básico', 1.0, 2.5,
 ARRAY['calculation', 'multiple_choice'], get_test_text(2)),

('M1-02', 'Fracciones y números decimales', 
 'Operaciones básicas con fracciones y decimales', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'numérico', 'aplicar', 'básico', 1.1, 3.0,
 ARRAY['calculation', 'fraction_operations'], get_test_text(2)),

('M1-03', 'Porcentajes y proporciones', 
 'Cálculo de porcentajes y resolución de proporciones', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'numérico', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['percentage_calculation', 'proportion_solving'], get_test_text(2)),

('M1-04', 'Potencias y raíces', 
 'Operaciones con potencias de base entera y raíces cuadradas', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'algebraico', 'aplicar', 'intermedio', 1.3, 3.0,
 ARRAY['power_operations', 'root_calculation'], get_test_text(2)),

('M1-05', 'Expresiones algebraicas básicas', 
 'Simplificación y evaluación de expresiones algebraicas simples', 
 'MATEMATICA_M1', get_skill_text('interpretar-relacionar'), 
 ARRAY['resolver-problemas', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'algebraico', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['algebraic_manipulation', 'expression_evaluation'], get_test_text(2)),

('M1-06', 'Ecuaciones lineales de primer grado', 
 'Resolución de ecuaciones lineales con una incógnita', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'algebraico', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['equation_solving', 'linear_equations'], get_test_text(2)),

('M1-07', 'Sistemas de ecuaciones 2x2', 
 'Resolución de sistemas de dos ecuaciones con dos incógnitas', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'algebraico', 'analizar', 'avanzado', 1.6, 5.0,
 ARRAY['system_solving', 'substitution_method'], get_test_text(2)),

('M1-08', 'Inecuaciones lineales', 
 'Resolución e interpretación de inecuaciones de primer grado', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'algebraico', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['inequality_solving', 'interval_notation'], get_test_text(2)),

('M1-09', 'Funciones lineales', 
 'Análisis y representación gráfica de funciones lineales', 
 'MATEMATICA_M1', get_skill_text('modelar'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'funcional', 'analizar', 'intermedio', 1.3, 4.0,
 ARRAY['function_analysis', 'graph_interpretation'], get_test_text(2)),

('M1-10', 'Función cuadrática básica', 
 'Identificación y propiedades básicas de funciones cuadráticas', 
 'MATEMATICA_M1', get_skill_text('modelar'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'funcional', 'comprender', 'avanzado', 1.4, 4.5,
 ARRAY['quadratic_functions', 'parabola_analysis'], get_test_text(2)),

('M1-11', 'Geometría plana básica', 
 'Perímetros y áreas de figuras geométricas básicas', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'geométrico', 'aplicar', 'básico', 1.1, 3.0,
 ARRAY['area_calculation', 'perimeter_calculation'], get_test_text(2)),

('M1-12', 'Teorema de Pitágoras', 
 'Aplicación del teorema de Pitágoras en problemas geométricos', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'geométrico', 'aplicar', 'intermedio', 1.3, 3.5,
 ARRAY['pythagorean_theorem', 'right_triangle_problems'], get_test_text(2)),

('M1-13', 'Semejanza y congruencia', 
 'Identificación de figuras semejantes y congruentes', 
 'MATEMATICA_M1', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'geométrico', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['similarity_analysis', 'congruence_identification'], get_test_text(2)),

('M1-14', 'Volumen de cuerpos geométricos', 
 'Cálculo de volúmenes de prismas, cilindros y conos', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'geométrico', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['volume_calculation', 'geometric_solids'], get_test_text(2)),

('M1-15', 'Trigonometría básica', 
 'Razones trigonométricas en triángulos rectángulos', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'trigonométrico', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['trigonometric_ratios', 'right_triangle_trig'], get_test_text(2)),

('M1-16', 'Estadística descriptiva', 
 'Medidas de tendencia central y dispersión', 
 'MATEMATICA_M1', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'estadístico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['descriptive_statistics', 'central_tendency'], get_test_text(2)),

('M1-17', 'Gráficos estadísticos', 
 'Interpretación y construcción de gráficos estadísticos', 
 'MATEMATICA_M1', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'estadístico', 'analizar', 'básico', 1.1, 3.0,
 ARRAY['graph_interpretation', 'statistical_charts'], get_test_text(2)),

('M1-18', 'Probabilidad básica', 
 'Cálculo de probabilidades en experimentos simples', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'probabilístico', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['probability_calculation', 'simple_events'], get_test_text(2)),

('M1-19', 'Combinatoria básica', 
 'Principios de conteo, permutaciones y combinaciones simples', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'combinatorio', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['counting_principles', 'permutations_combinations'], get_test_text(2)),

('M1-20', 'Secuencias y progresiones', 
 'Identificación y análisis de secuencias aritméticas y geométricas', 
 'MATEMATICA_M1', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'secuencial', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['sequence_analysis', 'arithmetic_geometric_progressions'], get_test_text(2)),

('M1-21', 'Logaritmos básicos', 
 'Propiedades básicas de logaritmos y ecuaciones logarítmicas simples', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'logarítmico', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['logarithm_properties', 'logarithmic_equations'], get_test_text(2)),

('M1-22', 'Matrices básicas', 
 'Operaciones básicas con matrices 2x2 y 3x3', 
 'MATEMATICA_M1', get_skill_text('resolver-problemas'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'matricial', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['matrix_operations', 'matrix_arithmetic'], get_test_text(2)),

('M1-23', 'Optimización básica', 
 'Problemas de máximos y mínimos en contextos reales', 
 'MATEMATICA_M1', get_skill_text('modelar'), 
 ARRAY['resolver-problemas', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'optimización', 'evaluar', 'avanzado', 1.6, 5.0,
 ARRAY['optimization_problems', 'max_min_applications'], get_test_text(2)),

('M1-24', 'Modelamiento matemático', 
 'Traducción de problemas reales a lenguaje matemático', 
 'MATEMATICA_M1', get_skill_text('modelar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'modelamiento', 'crear', 'avanzado', 1.5, 4.5,
 ARRAY['mathematical_modeling', 'real_world_applications'], get_test_text(2)),

('M1-25', 'Razonamiento matemático', 
 'Desarrollo de argumentos lógicos y demostración de propiedades', 
 'MATEMATICA_M1', get_skill_text('argumentar-comunicar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'lógico', 'evaluar', 'avanzado', 1.6, 5.0,
 ARRAY['mathematical_reasoning', 'logical_argumentation'], get_test_text(2))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Matemática M1...' as status;

-- Contar nodos insertados
SELECT COUNT(*) as nodos_insertados 
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M1';

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

-- PASO 4: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 5: Mensaje final
SELECT 'MATEMÁTICA M1 - 25 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;
SELECT 'Matemática básica obligatoria completada' as estado;

-- =====================================================
-- FIN DEL SCRIPT - 25 NODOS DE MATEMÁTICA M1
-- =====================================================