-- =====================================================
-- MATEMÁTICA M2 - 15 NODOS PAES (SIN FK)
-- Matemática avanzada electiva con sistema TEXT estable
-- Tiempo estimado: 1.5 minutos
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

-- PASO 2: Insertar nodos de Matemática M2 (15 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('M2-01', 'Límites de funciones', 
 'Cálculo e interpretación de límites de funciones reales', 
 'MATEMATICA_M2', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'cálculo', 'analizar', 'avanzado', 1.8, 5.5,
 ARRAY['limit_calculation', 'function_analysis'], get_test_text(3)),

('M2-02', 'Continuidad de funciones', 
 'Análisis de continuidad y discontinuidades de funciones', 
 'MATEMATICA_M2', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'cálculo', 'evaluar', 'avanzado', 1.7, 5.0,
 ARRAY['continuity_analysis', 'discontinuity_classification'], get_test_text(3)),

('M2-03', 'Derivadas y aplicaciones', 
 'Cálculo de derivadas y aplicaciones en problemas de optimización', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'cálculo', 'aplicar', 'avanzado', 1.9, 6.0,
 ARRAY['derivative_calculation', 'optimization_applications'], get_test_text(3)),

('M2-04', 'Integrales definidas e indefinidas', 
 'Técnicas de integración y aplicaciones geométricas', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'cálculo', 'aplicar', 'avanzado', 2.0, 6.5,
 ARRAY['integration_techniques', 'area_calculation'], get_test_text(3)),

('M2-05', 'Funciones exponenciales y logarítmicas', 
 'Análisis avanzado de funciones exponenciales y logarítmicas', 
 'MATEMATICA_M2', get_skill_text('modelar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'funcional', 'analizar', 'avanzado', 1.6, 4.5,
 ARRAY['exponential_analysis', 'logarithmic_modeling'], get_test_text(3)),

('M2-06', 'Trigonometría avanzada', 
 'Identidades trigonométricas y ecuaciones trigonométricas', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'trigonométrico', 'aplicar', 'avanzado', 1.7, 5.0,
 ARRAY['trigonometric_identities', 'trigonometric_equations'], get_test_text(3)),

('M2-07', 'Geometría analítica avanzada', 
 'Cónicas, transformaciones y geometría en el plano', 
 'MATEMATICA_M2', get_skill_text('modelar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'geométrico', 'analizar', 'avanzado', 1.8, 5.5,
 ARRAY['conic_sections', 'geometric_transformations'], get_test_text(3)),

('M2-08', 'Álgebra lineal básica', 
 'Espacios vectoriales, determinantes y sistemas lineales', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'algebraico', 'analizar', 'avanzado', 1.9, 6.0,
 ARRAY['vector_operations', 'linear_systems_advanced'], get_test_text(3)),

('M2-09', 'Probabilidad avanzada', 
 'Distribuciones de probabilidad y teorema de Bayes', 
 'MATEMATICA_M2', get_skill_text('analizar-sintetizar'), 
 ARRAY['resolver-problemas', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'probabilístico', 'analizar', 'avanzado', 1.7, 5.0,
 ARRAY['probability_distributions', 'bayes_theorem'], get_test_text(3)),

('M2-10', 'Estadística inferencial', 
 'Intervalos de confianza y pruebas de hipótesis', 
 'MATEMATICA_M2', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'estadístico', 'evaluar', 'avanzado', 1.8, 5.5,
 ARRAY['confidence_intervals', 'hypothesis_testing'], get_test_text(3)),

('M2-11', 'Ecuaciones diferenciales básicas', 
 'Resolución de ecuaciones diferenciales de primer orden', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'diferencial', 'aplicar', 'avanzado', 2.0, 6.5,
 ARRAY['differential_equations', 'separation_variables'], get_test_text(3)),

('M2-12', 'Series y sucesiones', 
 'Convergencia de series y análisis de sucesiones', 
 'MATEMATICA_M2', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'secuencial', 'evaluar', 'avanzado', 1.8, 5.5,
 ARRAY['series_convergence', 'sequence_analysis'], get_test_text(3)),

('M2-13', 'Transformaciones lineales', 
 'Matrices de transformación y aplicaciones geométricas', 
 'MATEMATICA_M2', get_skill_text('modelar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'transformacional', 'aplicar', 'avanzado', 1.9, 6.0,
 ARRAY['linear_transformations', 'matrix_applications'], get_test_text(3)),

('M2-14', 'Optimización con restricciones', 
 'Multiplicadores de Lagrange y optimización condicionada', 
 'MATEMATICA_M2', get_skill_text('resolver-problemas'), 
 ARRAY['modelar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'optimización', 'crear', 'avanzado', 2.0, 6.5,
 ARRAY['constrained_optimization', 'lagrange_multipliers'], get_test_text(3)),

('M2-15', 'Modelamiento matemático avanzado', 
 'Modelos complejos y análisis de sistemas dinámicos', 
 'MATEMATICA_M2', get_skill_text('modelar'), 
 ARRAY['evaluar-reflexionar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'modelamiento', 'crear', 'avanzado', 2.0, 7.0,
 ARRAY['advanced_modeling', 'dynamic_systems'], get_test_text(3))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Matemática M2...' as status;

-- Contar nodos insertados
SELECT COUNT(*) as nodos_insertados 
FROM learning_nodes 
WHERE subject = 'MATEMATICA_M2';

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

-- PASO 4: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 5: Mensaje final
SELECT 'MATEMÁTICA M2 - 15 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;
SELECT 'Matemática avanzada electiva completada' as estado;

-- =====================================================
-- FIN DEL SCRIPT - 15 NODOS DE MATEMÁTICA M2
-- =====================================================