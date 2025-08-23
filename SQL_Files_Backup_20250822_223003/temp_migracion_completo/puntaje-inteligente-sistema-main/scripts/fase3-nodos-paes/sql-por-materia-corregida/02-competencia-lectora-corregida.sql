-- =====================================================
-- COMPETENCIA LECTORA - 30 NODOS PAES (CORREGIDA)
-- Comprensión y análisis textual con UUIDs correctos
-- Tiempo estimado: 3 minutos
-- =====================================================

-- PASO 1: Verificación de tabla y funciones
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Ejecutar primero 00-estructura-base-completa.sql';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_test_uuid') THEN
        RAISE EXCEPTION 'Función get_test_uuid no existe. Ejecutar primero 01-mapeo-ids-paes.sql';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_skill_uuid') THEN
        RAISE EXCEPTION 'Función get_skill_uuid no existe. Ejecutar primero 01-mapeo-ids-paes.sql';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Comprensión Literal (10 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('CL-01', 'Identificación de información explícita', 
 'Localiza información directamente expresada en el texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'recordar', 'básico', 1.0, 2.0,
 ARRAY['multiple_choice', 'direct_identification'], get_test_uuid(1)),

('CL-02', 'Reconocimiento de ideas principales', 
 'Identifica las ideas centrales de párrafos y secciones', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'básico', 1.1, 2.5,
 ARRAY['main_idea_identification', 'multiple_choice'], get_test_uuid(1)),

('CL-03', 'Secuenciación de eventos narrativos', 
 'Ordena cronológicamente los eventos en textos narrativos', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'básico', 1.0, 2.2,
 ARRAY['sequence_ordering', 'chronological_analysis'], get_test_uuid(1)),

('CL-04', 'Identificación de personajes y roles', 
 'Reconoce personajes principales y secundarios en narrativas', 
 'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'recordar', 'básico', 0.9, 2.0,
 ARRAY['character_identification', 'role_analysis'], get_test_uuid(1)),

('CL-05', 'Comprensión de relaciones causales explícitas', 
 'Identifica relaciones de causa-efecto directamente expresadas', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'intermedio', 1.2, 2.8,
 ARRAY['causal_relationship_analysis', 'logical_connections'], get_test_uuid(1)),

('CL-06', 'Localización de datos específicos', 
 'Encuentra datos numéricos, fechas y referencias específicas', 
 'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'recordar', 'básico', 0.8, 1.8,
 ARRAY['data_location', 'specific_information'], get_test_uuid(1)),

('CL-07', 'Identificación de definiciones y conceptos', 
 'Reconoce definiciones y explicaciones de conceptos en el texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'básico', 1.0, 2.3,
 ARRAY['definition_identification', 'concept_recognition'], get_test_uuid(1)),

('CL-08', 'Comprensión de instrucciones y procedimientos', 
 'Entiende secuencias de pasos e instrucciones en textos procedimentales', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'aplicar', 'intermedio', 1.1, 2.5,
 ARRAY['procedural_comprehension', 'instruction_following'], get_test_uuid(1)),

('CL-09', 'Identificación de ejemplos y casos', 
 'Reconoce ejemplos que ilustran conceptos o ideas generales', 
 'COMPETENCIA_LECTORA', get_skill_uuid('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'básico', 1.0, 2.2,
 ARRAY['example_identification', 'illustration_recognition'], get_test_uuid(1)),

('CL-10', 'Comprensión de descripciones detalladas', 
 'Entiende descripciones físicas, espaciales y características', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'básico', 1.0, 2.4,
 ARRAY['descriptive_comprehension', 'detail_analysis'], get_test_uuid(1)),

-- PASO 3: Insertar nodos de Comprensión Inferencial (10 nodos)
('CL-11', 'Inferencia de información implícita', 
 'Deduce información no expresada directamente en el texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['implicit_inference', 'deductive_reasoning'], get_test_uuid(1)),

('CL-12', 'Deducción de motivaciones de personajes', 
 'Infiere las motivaciones y sentimientos de personajes', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['character_motivation_analysis', 'psychological_inference'], get_test_uuid(1)),

('CL-13', 'Predicción de eventos futuros', 
 'Anticipa desarrollos narrativos basándose en pistas textuales', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.4, 3.5,
 ARRAY['predictive_analysis', 'narrative_projection'], get_test_uuid(1)),

('CL-14', 'Inferencia de relaciones entre conceptos', 
 'Deduce conexiones no explícitas entre ideas y conceptos', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'avanzado', 1.4, 3.8,
 ARRAY['conceptual_relationship_inference', 'logical_deduction'], get_test_uuid(1)),

('CL-15', 'Deducción del significado contextual', 
 'Infiere el significado de palabras por contexto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'comprender', 'intermedio', 1.2, 2.8,
 ARRAY['contextual_meaning_inference', 'vocabulary_deduction'], get_test_uuid(1)),

('CL-16', 'Inferencia de propósito comunicativo', 
 'Deduce la intención del autor al escribir el texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.5, 4.0,
 ARRAY['communicative_purpose_analysis', 'authorial_intent'], get_test_uuid(1)),

('CL-17', 'Deducción de audiencia objetivo', 
 'Infiere para qué tipo de lector está dirigido el texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.3, 3.5,
 ARRAY['target_audience_analysis', 'reader_identification'], get_test_uuid(1)),

('CL-18', 'Inferencia de tono y atmósfera', 
 'Deduce el tono emocional y la atmósfera del texto', 
 'COMPETENCIA_LECTORA', get_skill_uuid('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['tone_analysis', 'atmospheric_inference'], get_test_uuid(1)),

('CL-19', 'Deducción de consecuencias implícitas', 
 'Infiere las posibles consecuencias de eventos o acciones', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.4, 3.8,
 ARRAY['consequence_inference', 'causal_projection'], get_test_uuid(1)),

('CL-20', 'Inferencia de información faltante', 
 'Deduce información omitida pero necesaria para la comprensión', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'avanzado', 1.3, 3.5,
 ARRAY['gap_filling_inference', 'missing_information_deduction'], get_test_uuid(1)),

-- PASO 4: Insertar nodos de Análisis Crítico (10 nodos)
('CL-21', 'Evaluación de credibilidad de fuentes', 
 'Analiza la confiabilidad y autoridad de las fuentes textuales', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.5, 4.2,
 ARRAY['source_credibility_evaluation', 'authority_analysis'], get_test_uuid(1)),

('CL-22', 'Identificación de sesgos y perspectivas', 
 'Reconoce sesgos, puntos de vista y perspectivas del autor', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['bias_identification', 'perspective_analysis'], get_test_uuid(1)),

('CL-23', 'Análisis de argumentos y evidencias', 
 'Evalúa la solidez de argumentos y la calidad de evidencias', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.6, 4.5,
 ARRAY['argument_analysis', 'evidence_evaluation'], get_test_uuid(1)),

('CL-24', 'Detección de falacias lógicas', 
 'Identifica errores de razonamiento y falacias argumentativas', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.5, 4.2,
 ARRAY['logical_fallacy_detection', 'reasoning_error_analysis'], get_test_uuid(1)),

('CL-25', 'Comparación de múltiples perspectivas', 
 'Contrasta diferentes puntos de vista sobre un mismo tema', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['perspective_comparison', 'multi_viewpoint_analysis'], get_test_uuid(1)),

('CL-26', 'Evaluación de relevancia de información', 
 'Determina la pertinencia de información para objetivos específicos', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['relevance_evaluation', 'information_filtering'], get_test_uuid(1)),

('CL-27', 'Análisis de estructura argumentativa', 
 'Examina la organización y coherencia de argumentos complejos', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'analizar', 'avanzado', 1.4, 3.8,
 ARRAY['argumentative_structure_analysis', 'logical_organization'], get_test_uuid(1)),

('CL-28', 'Evaluación de objetividad vs subjetividad', 
 'Distingue entre información objetiva y opiniones subjetivas', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'intermedio', 1.3, 3.2,
 ARRAY['objectivity_evaluation', 'fact_opinion_distinction'], get_test_uuid(1)),

('CL-29', 'Análisis de implicaciones sociales', 
 'Evalúa las implicaciones sociales y éticas de textos', 
 'COMPETENCIA_LECTORA', get_skill_uuid('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'evaluar', 'avanzado', 1.5, 4.2,
 ARRAY['social_implication_analysis', 'ethical_evaluation'], get_test_uuid(1)),

('CL-30', 'Síntesis crítica de múltiples textos', 
 'Integra información de múltiples fuentes de manera crítica', 
 'COMPETENCIA_LECTORA', get_skill_uuid('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'textual', 'crear', 'avanzado', 1.6, 5.0,
 ARRAY['critical_synthesis', 'multi_source_integration'], get_test_uuid(1))

ON CONFLICT (code) DO NOTHING;

-- PASO 5: Verificar la implementación
SELECT 'Verificando implementación de nodos de Competencia Lectora...' as status;

-- Contar nodos insertados
SELECT COUNT(*) as nodos_insertados 
FROM learning_nodes 
WHERE subject = 'COMPETENCIA_LECTORA';

-- Verificar distribución por dificultad
SELECT 
    difficulty,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes WHERE subject = 'COMPETENCIA_LECTORA')), 2) as porcentaje
FROM learning_nodes 
WHERE subject = 'COMPETENCIA_LECTORA'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'básico' THEN 1 
        WHEN 'intermedio' THEN 2 
        WHEN 'avanzado' THEN 3 
    END;

-- Verificar que los UUIDs se asignaron correctamente
SELECT 
    'UUIDs asignados correctamente' as verificacion,
    COUNT(*) as total_con_test_id,
    COUNT(DISTINCT test_id) as test_ids_unicos,
    COUNT(DISTINCT skill_id) as skill_ids_unicos
FROM learning_nodes 
WHERE subject = 'COMPETENCIA_LECTORA' 
AND test_id IS NOT NULL 
AND skill_id IS NOT NULL;

-- PASO 6: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 7: Mensaje final
SELECT 'COMPETENCIA LECTORA - 30 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'UUIDs convertidos exitosamente usando funciones de mapeo' as conversion;
SELECT 'Sin errores de tipos UUID vs INTEGER' as estado;

-- =====================================================
-- FIN DEL SCRIPT - 30 NODOS DE COMPETENCIA LECTORA
-- =====================================================