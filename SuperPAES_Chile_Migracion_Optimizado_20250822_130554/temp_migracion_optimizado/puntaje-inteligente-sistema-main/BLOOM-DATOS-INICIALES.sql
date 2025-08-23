-- ============================================================================
-- 🎨 BLOOM JOURNEY REVOLUTION - DATOS INICIALES 🎨
-- Creado por: ROO & OSCAR FERREL - Los Arquitectos del Futuro Educativo
-- ============================================================================

-- 🎯 DATOS INICIALES - ACTIVIDADES POR NIVEL DE BLOOM
-- Ejecutar DESPUÉS de BLOOM-SQL-SIMPLE.sql

-- 🧠 L1 - REMEMBER (Recordar) - Palacio de la Memoria
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L1', 'matematica', 'Memorizar Fórmulas Básicas', 'Memoriza las fórmulas fundamentales de álgebra', 'flashcard', 1, 
 '{"formulas": ["a² + b² = c²", "ax + b = 0", "(a+b)² = a² + 2ab + b²"]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "brain"}'),

('L1', 'lectura', 'Vocabulario PAES', 'Memoriza palabras clave para comprensión lectora', 'flashcard', 1,
 '{"words": [{"word": "inferir", "definition": "Deducir algo a partir de indicios"}, {"word": "cohesión", "definition": "Unión entre las partes de un texto"}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "book"}'),

('L1', 'historia', 'Fechas Históricas Clave', 'Memoriza las fechas más importantes de la historia de Chile', 'timeline', 1,
 '{"events": [{"year": 1810, "event": "Primera Junta de Gobierno"}, {"year": 1818, "event": "Independencia de Chile"}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "calendar"}'),

('L1', 'ciencias', 'Tabla Periódica Básica', 'Memoriza los primeros 20 elementos químicos', 'flashcard', 2,
 '{"elements": [{"symbol": "H", "name": "Hidrógeno", "number": 1}, {"symbol": "He", "name": "Helio", "number": 2}]}',
 '{"theme": "memory_palace", "color": "#FF6B6B", "icon": "atom"}');

-- 🔬 L2 - UNDERSTAND (Comprender) - Laboratorio de Comprensión
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L2', 'matematica', 'Comprensión de Funciones', 'Entiende el concepto de función y su representación gráfica', 'interactive_demo', 2,
 '{"concepts": ["dominio", "rango", "función lineal", "función cuadrática"], "examples": [{"f(x)": "2x + 1", "type": "lineal"}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "chart-line"}'),

('L2', 'lectura', 'Comprensión de Textos', 'Identifica ideas principales y secundarias', 'reading_analysis', 2,
 '{"text_types": ["narrativo", "expositivo", "argumentativo"], "strategies": ["subrayado", "resumen", "esquemas"]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "search"}'),

('L2', 'historia', 'Procesos Históricos', 'Comprende las causas y consecuencias de eventos históricos', 'cause_effect', 2,
 '{"processes": [{"event": "Independencia", "causes": ["Crisis española", "Ideas ilustradas"], "effects": ["República", "Constitución"]}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "git-branch"}'),

('L2', 'ciencias', 'Leyes Científicas', 'Comprende las leyes fundamentales de la física', 'concept_map', 2,
 '{"laws": [{"name": "Ley de Newton", "formula": "F = ma", "explanation": "La fuerza es igual a masa por aceleración"}]}',
 '{"theme": "lab", "color": "#4ECDC4", "icon": "zap"}');

-- 🔧 L3 - APPLY (Aplicar) - Taller de Aplicación
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L3', 'matematica', 'Resolver Ecuaciones', 'Aplica métodos para resolver ecuaciones cuadráticas', 'problem_solving', 3,
 '{"problems": [{"equation": "x² - 5x + 6 = 0", "method": "factorización", "solution": "x = 2, x = 3"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "wrench"}'),

('L3', 'lectura', 'Análisis de Textos', 'Aplica técnicas de análisis literario', 'text_analysis', 3,
 '{"techniques": ["análisis narrativo", "figuras retóricas", "contexto histórico"]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "edit"}'),

('L3', 'historia', 'Aplicar Conceptos Históricos', 'Usa conceptos históricos para analizar situaciones actuales', 'case_study', 3,
 '{"cases": [{"situation": "Crisis económica actual", "historical_parallel": "Crisis de 1929"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "briefcase"}'),

('L3', 'ciencias', 'Experimentos Virtuales', 'Aplica el método científico en experimentos', 'simulation', 3,
 '{"experiments": [{"name": "Péndulo simple", "variables": ["longitud", "masa", "ángulo"], "hypothesis": "El período depende de la longitud"}]}',
 '{"theme": "workshop", "color": "#45B7D1", "icon": "flask"}');

-- 🔍 L4 - ANALYZE (Analizar) - Centro de Análisis
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L4', 'matematica', 'Análisis de Funciones', 'Analiza el comportamiento de funciones complejas', 'function_analysis', 4,
 '{"functions": [{"f(x)": "x³ - 3x² + 2", "analysis": ["crecimiento", "máximos", "mínimos", "puntos de inflexión"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "search"}'),

('L4', 'lectura', 'Análisis Crítico', 'Analiza argumentos y falacias en textos', 'critical_analysis', 4,
 '{"text_elements": ["tesis", "argumentos", "evidencias", "falacias"], "analysis_tools": ["esquemas argumentativos", "identificación de sesgos"]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "eye"}'),

('L4', 'historia', 'Análisis de Fuentes', 'Analiza fuentes históricas primarias y secundarias', 'source_analysis', 4,
 '{"sources": [{"type": "primaria", "example": "Carta de OHiggins", "analysis": ["contexto", "autor", "propósito", "audiencia"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "file-text"}'),

('L4', 'ciencias', 'Análisis de Datos', 'Analiza datos experimentales y saca conclusiones', 'data_analysis', 4,
 '{"datasets": [{"experiment": "Caída libre", "data": "tiempo vs distancia", "analysis": ["correlación", "tendencias", "errores"]}]}',
 '{"theme": "detective", "color": "#96CEB4", "icon": "bar-chart"}');

-- ⚖️ L5 - EVALUATE (Evaluar) - Hub de Evaluación
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L5', 'matematica', 'Evaluar Métodos', 'Evalúa la eficiencia de diferentes métodos de resolución', 'method_evaluation', 4,
 '{"methods": [{"problem": "sistema de ecuaciones", "options": ["sustitución", "eliminación", "matrices"], "criteria": ["rapidez", "precisión", "simplicidad"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "balance-scale"}'),

('L5', 'lectura', 'Evaluación de Argumentos', 'Evalúa la validez y solidez de argumentos', 'argument_evaluation', 4,
 '{"arguments": [{"claim": "La educación online es mejor", "evidence": ["flexibilidad", "costos"], "evaluation": ["validez", "suficiencia", "relevancia"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "gavel"}'),

('L5', 'historia', 'Evaluación Histórica', 'Evalúa el impacto de decisiones históricas', 'historical_evaluation', 4,
 '{"decisions": [{"event": "Reforma agraria", "criteria": ["impacto social", "consecuencias económicas", "efectividad"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "award"}'),

('L5', 'ciencias', 'Evaluación de Teorías', 'Evalúa teorías científicas según evidencia', 'theory_evaluation', 4,
 '{"theories": [{"name": "Teoría atómica", "evidence": ["experimentos", "predicciones"], "criteria": ["falsabilidad", "simplicidad", "poder explicativo"]}]}',
 '{"theme": "court", "color": "#FFEAA7", "icon": "shield"}');

-- 🎨 L6 - CREATE (Crear) - Espacio de Creación
INSERT INTO bloom_activities (level_id, subject, title, description, activity_type, difficulty, content_data, visual_config) VALUES
('L6', 'matematica', 'Crear Modelos Matemáticos', 'Crea modelos para resolver problemas reales', 'model_creation', 5,
 '{"projects": [{"problem": "Optimización de rutas", "tools": ["funciones", "derivadas", "programación lineal"]}]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "palette"}'),

('L6', 'lectura', 'Creación Literaria', 'Crea textos originales aplicando técnicas literarias', 'creative_writing', 5,
 '{"genres": ["ensayo", "cuento", "artículo de opinión"], "techniques": ["estructura", "estilo", "recursos retóricos"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "pen-tool"}'),

('L6', 'historia', 'Proyecto Histórico', 'Crea una investigación histórica original', 'research_project', 5,
 '{"steps": ["formulación de hipótesis", "búsqueda de fuentes", "análisis", "síntesis", "presentación"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "book-open"}'),

('L6', 'ciencias', 'Diseño Experimental', 'Diseña experimentos para probar hipótesis', 'experiment_design', 5,
 '{"components": ["pregunta de investigación", "hipótesis", "variables", "metodología", "análisis de resultados"]}',
 '{"theme": "studio", "color": "#DDA0DD", "icon": "cpu"}');

-- ============================================================================
-- 🎯 USUARIO DE PRUEBA PARA DESARROLLO
-- ============================================================================

-- Inicializar usuario de prueba
SELECT initialize_bloom_user('test-user-bloom-123');

-- Simular algunas sesiones completadas
DO $$
DECLARE
    v_activity_id UUID;
BEGIN
    -- Obtener ID de actividad de matemática L1
    SELECT id INTO v_activity_id 
    FROM bloom_activities 
    WHERE level_id = 'L1' AND subject = 'matematica' 
    LIMIT 1;
    
    IF v_activity_id IS NOT NULL THEN
        PERFORM record_learning_session(
            'test-user-bloom-123', 'L1', 'matematica', 
            v_activity_id, 15, 85.5, TRUE
        );
    END IF;
    
    -- Obtener ID de actividad de lectura L1
    SELECT id INTO v_activity_id 
    FROM bloom_activities 
    WHERE level_id = 'L1' AND subject = 'lectura' 
    LIMIT 1;
    
    IF v_activity_id IS NOT NULL THEN
        PERFORM record_learning_session(
            'test-user-bloom-123', 'L1', 'lectura', 
            v_activity_id, 20, 92.0, TRUE
        );
    END IF;
END $$;

-- ============================================================================
-- 🎉 CONFIRMACIÓN DE DATOS INICIALES
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🎨 DATOS INICIALES BLOOM - CARGA COMPLETA';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '✅ Actividades insertadas: 24 (6 por nivel x 4 materias)';
    RAISE NOTICE '✅ Usuario de prueba: test-user-bloom-123';
    RAISE NOTICE '✅ Sesiones de ejemplo creadas';
    RAISE NOTICE '🎨 ============================================';
    RAISE NOTICE '🚀 DATOS LISTOS PARA EL BLOOM JOURNEY';
    RAISE NOTICE '🎨 ============================================';
END $$;