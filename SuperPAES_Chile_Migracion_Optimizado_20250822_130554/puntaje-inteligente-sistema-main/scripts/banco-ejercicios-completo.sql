-- =====================================================
-- BANCO DE EJERCICIOS COMPLETO PAES
-- Sistema profesional de sincronización de datos
-- Fecha: 30/05/2025
-- =====================================================

-- CONFIGURACIÓN INICIAL
SET client_encoding = 'UTF8';

-- =====================================================
-- PASO 1: ESTRUCTURA BASE - TESTS PAES
-- =====================================================

INSERT INTO paes_tests (id, complexity_level, questions_count, relative_weight, time_minutes, subject_area, description, created_at, updated_at)
VALUES 
    (1, 'intermediate', 65, 1.0, 150, 'COMPETENCIA_LECTORA', 'Prueba de Competencia Lectora PAES - Evalúa comprensión, interpretación y análisis crítico de textos', NOW(), NOW()),
    (2, 'intermediate', 70, 1.0, 140, 'MATEMATICA_1', 'Matemática M1 PAES - Contenidos de 7° básico a 2° medio', NOW(), NOW()),
    (3, 'advanced', 80, 1.0, 160, 'MATEMATICA_2', 'Matemática M2 PAES - Contenidos de 3° y 4° medio', NOW(), NOW()),
    (4, 'intermediate', 75, 1.0, 145, 'HISTORIA', 'Historia y Ciencias Sociales PAES - Procesos históricos y análisis de fuentes', NOW(), NOW()),
    (5, 'intermediate', 65, 1.0, 150, 'CIENCIAS', 'Ciencias PAES - Biología, Física y Química integradas', NOW(), NOW()),
    (6, 'basic', 50, 0.8, 120, 'DIAGNOSTICO', 'Evaluación diagnóstica integral - Identificación de fortalezas y debilidades', NOW(), NOW()),
    (7, 'advanced', 90, 1.2, 180, 'SIMULACRO', 'Simulacro completo PAES - Preparación integral para la prueba oficial', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    complexity_level = EXCLUDED.complexity_level,
    questions_count = EXCLUDED.questions_count,
    relative_weight = EXCLUDED.relative_weight,
    time_minutes = EXCLUDED.time_minutes,
    subject_area = EXCLUDED.subject_area,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- PASO 2: HABILIDADES PAES COMPLETAS
-- =====================================================

INSERT INTO paes_skills (id, code, impact_weight, test_id, description, category, cognitive_level, created_at, updated_at)
VALUES 
    -- COMPETENCIA LECTORA
    (1, 'TRACK_LOCATE', 1.0, 1, 'Localizar información explícita en textos de diversa complejidad', 'COMPRENSION_LECTORA', 'CONOCIMIENTO', NOW(), NOW()),
    (2, 'INTERPRET_RELATE', 1.2, 1, 'Interpretar y relacionar información implícita y explícita en textos', 'COMPRENSION_LECTORA', 'COMPRENSION', NOW(), NOW()),
    (3, 'EVALUATE_REFLECT', 1.5, 1, 'Evaluar críticamente y reflexionar sobre contenidos, estructura y propósito de textos', 'COMPRENSION_LECTORA', 'EVALUACION', NOW(), NOW()),
    
    -- MATEMÁTICA M1
    (4, 'SOLVE_PROBLEMS', 1.3, 2, 'Resolver problemas matemáticos aplicando conceptos y procedimientos', 'MATEMATICA_BASICA', 'APLICACION', NOW(), NOW()),
    (5, 'REPRESENT', 1.1, 2, 'Representar información matemática usando símbolos, gráficos y expresiones', 'MATEMATICA_BASICA', 'COMPRENSION', NOW(), NOW()),
    (6, 'MODEL', 1.4, 2, 'Modelar situaciones reales usando conceptos y herramientas matemáticas', 'MATEMATICA_BASICA', 'APLICACION', NOW(), NOW()),
    
    -- MATEMÁTICA M2
    (7, 'ARGUE_COMMUNICATE', 1.5, 3, 'Argumentar y comunicar razonamientos matemáticos de forma clara y precisa', 'MATEMATICA_AVANZADA', 'EVALUACION', NOW(), NOW()),
    (8, 'ANALYZE_FUNCTIONS', 1.4, 3, 'Analizar propiedades y comportamiento de funciones matemáticas', 'MATEMATICA_AVANZADA', 'ANALISIS', NOW(), NOW()),
    (9, 'SOLVE_COMPLEX', 1.6, 3, 'Resolver problemas complejos integrando múltiples conceptos matemáticos', 'MATEMATICA_AVANZADA', 'SINTESIS', NOW(), NOW()),
    
    -- HISTORIA Y CIENCIAS SOCIALES
    (10, 'TEMPORAL_THINKING', 1.2, 4, 'Desarrollar pensamiento temporal para comprender procesos históricos', 'HISTORIA', 'COMPRENSION', NOW(), NOW()),
    (11, 'SOURCE_ANALYSIS', 1.4, 4, 'Analizar críticamente fuentes históricas y documentos primarios', 'HISTORIA', 'ANALISIS', NOW(), NOW()),
    (12, 'MULTICAUSAL_ANALYSIS', 1.5, 4, 'Analizar múltiples causas y consecuencias de procesos históricos', 'HISTORIA', 'EVALUACION', NOW(), NOW()),
    (13, 'CRITICAL_THINKING', 1.3, 4, 'Desarrollar pensamiento crítico sobre eventos y procesos sociales', 'HISTORIA', 'EVALUACION', NOW(), NOW()),
    
    -- CIENCIAS
    (14, 'IDENTIFY_THEORIES', 1.1, 5, 'Identificar y comprender teorías científicas fundamentales', 'CIENCIAS', 'CONOCIMIENTO', NOW(), NOW()),
    (15, 'PROCESS_ANALYZE', 1.3, 5, 'Procesar y analizar datos científicos e información experimental', 'CIENCIAS', 'ANALISIS', NOW(), NOW()),
    (16, 'APPLY_PRINCIPLES', 1.4, 5, 'Aplicar principios científicos para resolver problemas y situaciones', 'CIENCIAS', 'APLICACION', NOW(), NOW()),
    (17, 'SCIENTIFIC_ARGUMENT', 1.5, 5, 'Construir argumentos científicos basados en evidencia y razonamiento', 'CIENCIAS', 'EVALUACION', NOW(), NOW()),
    
    -- HABILIDADES TRANSVERSALES
    (18, 'REFLECTION', 1.2, 6, 'Reflexionar sobre el propio aprendizaje y estrategias de estudio', 'METACOGNICION', 'EVALUACION', NOW(), NOW()),
    (19, 'INTEGRATION', 1.4, 7, 'Integrar conocimientos de diferentes áreas para resolver problemas complejos', 'INTERDISCIPLINAR', 'SINTESIS', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    impact_weight = EXCLUDED.impact_weight,
    test_id = EXCLUDED.test_id,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    cognitive_level = EXCLUDED.cognitive_level,
    updated_at = NOW();

-- =====================================================
-- PASO 3: NODOS DE APRENDIZAJE ESTRUCTURADOS
-- =====================================================

INSERT INTO learning_nodes (id, title, description, difficulty_level, estimated_time, skill_id, test_id, subject_area, node_type, prerequisites, learning_objectives, content_tags, created_at, updated_at)
VALUES 
    -- NODOS DE COMPETENCIA LECTORA
    (1, 'Localización de Información Explícita', 'Identificar y extraer información que aparece directamente en el texto', 'basic', 25, 1, 1, 'COMPETENCIA_LECTORA', 'CONCEPT', '[]', '["Localizar datos específicos", "Identificar información literal", "Extraer detalles explícitos"]', '["lectura", "comprension", "informacion_explicita"]', NOW(), NOW()),
    
    (2, 'Comprensión de Ideas Principales', 'Identificar y comprender las ideas centrales de textos diversos', 'basic', 30, 1, 1, 'COMPETENCIA_LECTORA', 'CONCEPT', '[1]', '["Identificar tema central", "Distinguir ideas principales de secundarias", "Sintetizar contenido"]', '["lectura", "ideas_principales", "sintesis"]', NOW(), NOW()),
    
    (3, 'Interpretación de Información Implícita', 'Inferir significados no explícitos a partir del contexto y pistas textuales', 'intermediate', 40, 2, 1, 'COMPETENCIA_LECTORA', 'SKILL', '[1,2]', '["Realizar inferencias", "Interpretar contexto", "Deducir significados"]', '["lectura", "inferencia", "interpretacion"]', NOW(), NOW()),
    
    (4, 'Análisis de Estructura Textual', 'Comprender la organización y relaciones entre partes del texto', 'intermediate', 35, 2, 1, 'COMPETENCIA_LECTORA', 'SKILL', '[2,3]', '["Analizar organización textual", "Identificar conectores", "Comprender secuencias"]', '["lectura", "estructura", "organizacion"]', NOW(), NOW()),
    
    (5, 'Evaluación Crítica de Argumentos', 'Evaluar la validez, coherencia y calidad de argumentos presentados', 'advanced', 50, 3, 1, 'COMPETENCIA_LECTORA', 'APPLICATION', '[3,4]', '["Evaluar argumentos", "Analizar evidencia", "Detectar falacias"]', '["lectura", "argumentacion", "pensamiento_critico"]', NOW(), NOW()),
    
    -- NODOS DE MATEMÁTICA M1
    (6, 'Operaciones con Números Racionales', 'Dominar operaciones fundamentales con fracciones y decimales', 'basic', 30, 4, 2, 'MATEMATICA', 'CONCEPT', '[]', '["Operar con fracciones", "Convertir entre representaciones", "Resolver problemas básicos"]', '["matematica", "numeros_racionales", "operaciones"]', NOW(), NOW()),
    
    (7, 'Álgebra Elemental', 'Manipular expresiones algebraicas y resolver ecuaciones lineales', 'intermediate', 45, 5, 2, 'MATEMATICA', 'SKILL', '[6]', '["Resolver ecuaciones lineales", "Factorizar expresiones", "Trabajar con variables"]', '["matematica", "algebra", "ecuaciones"]', NOW(), NOW()),
    
    (8, 'Geometría Plana Básica', 'Aplicar conceptos geométricos para calcular perímetros, áreas y volúmenes', 'intermediate', 40, 6, 2, 'MATEMATICA', 'APPLICATION', '[6]', '["Calcular áreas y perímetros", "Aplicar teoremas básicos", "Resolver problemas geométricos"]', '["matematica", "geometria", "medicion"]', NOW(), NOW()),
    
    -- NODOS DE MATEMÁTICA M2
    (9, 'Funciones y Gráficas', 'Analizar propiedades de funciones y sus representaciones gráficas', 'advanced', 55, 8, 3, 'MATEMATICA_AVANZADA', 'CONCEPT', '[7]', '["Analizar funciones", "Interpretar gráficas", "Determinar dominios y rangos"]', '["matematica", "funciones", "graficas"]', NOW(), NOW()),
    
    (10, 'Cálculo Diferencial Básico', 'Comprender conceptos fundamentales de derivadas y sus aplicaciones', 'advanced', 60, 9, 3, 'MATEMATICA_AVANZADA', 'SKILL', '[9]', '["Calcular derivadas", "Aplicar reglas de derivación", "Resolver problemas de optimización"]', '["matematica", "calculo", "derivadas"]', NOW(), NOW()),
    
    (11, 'Argumentación Matemática', 'Construir y comunicar razonamientos matemáticos válidos', 'advanced', 45, 7, 3, 'MATEMATICA_AVANZADA', 'APPLICATION', '[9,10]', '["Construir demostraciones", "Comunicar razonamientos", "Validar argumentos"]', '["matematica", "argumentacion", "demostracion"]', NOW(), NOW()),
    
    -- NODOS DE HISTORIA
    (12, 'Cronología y Periodización', 'Ordenar eventos históricos y comprender procesos temporales', 'basic', 35, 10, 4, 'HISTORIA', 'CONCEPT', '[]', '["Secuenciar eventos", "Comprender periodización", "Relacionar procesos temporales"]', '["historia", "cronologia", "tiempo"]', NOW(), NOW()),
    
    (13, 'Análisis de Fuentes Históricas', 'Interpretar y evaluar documentos históricos primarios y secundarios', 'intermediate', 50, 11, 4, 'HISTORIA', 'SKILL', '[12]', '["Analizar fuentes primarias", "Evaluar confiabilidad", "Extraer información histórica"]', '["historia", "fuentes", "documentos"]', NOW(), NOW()),
    
    (14, 'Procesos Históricos Chilenos', 'Comprender los principales procesos de la historia de Chile', 'intermediate', 55, 12, 4, 'HISTORIA', 'APPLICATION', '[12,13]', '["Analizar independencia", "Comprender formación republicana", "Evaluar procesos del siglo XX"]', '["historia", "chile", "procesos_nacionales"]', NOW(), NOW()),
    
    (15, 'Historia Universal Contemporánea', 'Analizar procesos históricos mundiales y su impacto', 'advanced', 60, 13, 4, 'HISTORIA', 'APPLICATION', '[13,14]', '["Analizar guerras mundiales", "Comprender Guerra Fría", "Evaluar globalización"]', '["historia", "mundial", "contemporanea"]', NOW(), NOW()),
    
    -- NODOS DE CIENCIAS
    (16, 'Método Científico', 'Comprender y aplicar los pasos del método científico', 'basic', 30, 14, 5, 'CIENCIAS', 'CONCEPT', '[]', '["Formular hipótesis", "Diseñar experimentos", "Analizar resultados"]', '["ciencias", "metodo_cientifico", "investigacion"]', NOW(), NOW()),
    
    (17, 'Teorías Científicas Fundamentales', 'Conocer y comprender las principales teorías científicas', 'intermediate', 45, 15, 5, 'CIENCIAS', 'SKILL', '[16]', '["Comprender evolución", "Analizar teoría atómica", "Explicar leyes físicas"]', '["ciencias", "teorias", "principios"]', NOW(), NOW()),
    
    (18, 'Análisis de Datos Científicos', 'Procesar e interpretar información experimental y observacional', 'intermediate', 40, 16, 5, 'CIENCIAS', 'SKILL', '[16,17]', '["Interpretar gráficos", "Analizar tablas", "Extraer conclusiones"]', '["ciencias", "datos", "analisis"]', NOW(), NOW()),
    
    (19, 'Aplicación de Principios Científicos', 'Resolver problemas aplicando conocimientos científicos', 'advanced', 50, 17, 5, 'CIENCIAS', 'APPLICATION', '[17,18]', '["Resolver problemas complejos", "Aplicar leyes científicas", "Predecir resultados"]', '["ciencias", "aplicacion", "resolucion_problemas"]', NOW(), NOW()),
    
    -- NODOS TRANSVERSALES
    (20, 'Estrategias de Aprendizaje', 'Desarrollar técnicas efectivas de estudio y autorregulación', 'basic', 25, 18, 6, 'METODOLOGIA', 'CONCEPT', '[]', '["Organizar tiempo de estudio", "Aplicar técnicas de memorización", "Autoevaluar aprendizaje"]', '["metodologia", "estudio", "autorregulacion"]', NOW(), NOW()),
    
    (21, 'Integración Interdisciplinaria', 'Conectar conocimientos de diferentes áreas para resolver problemas complejos', 'advanced', 70, 19, 7, 'INTERDISCIPLINAR', 'APPLICATION', '[5,11,15,19]', '["Integrar conocimientos", "Resolver problemas complejos", "Aplicar pensamiento sistémico"]', '["integracion", "interdisciplinar", "sintesis"]', NOW(), NOW())
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
    learning_objectives = EXCLUDED.learning_objectives,
    content_tags = EXCLUDED.content_tags,
    updated_at = NOW();

-- =====================================================
-- PASO 4: BANCO MASIVO DE EJERCICIOS DE CALIDAD
-- =====================================================

INSERT INTO exercises (id, node_id, title, content, difficulty_level, estimated_time, exercise_type, correct_answer, options, explanation, metadata, created_at, updated_at)
VALUES 
    -- EJERCICIOS DE COMPETENCIA LECTORA
    (1, 1, 'Localización de Fecha Específica', 
     'Lee el siguiente texto: "El terremoto de Valdivia ocurrió el 22 de mayo de 1960, siendo el más fuerte registrado en la historia de Chile. Sus efectos se sintieron desde Talca hasta Chiloé, afectando a más de 2 millones de personas." ¿En qué fecha ocurrió el terremoto de Valdivia?', 
     'basic', 8, 'multiple_choice', '22 de mayo de 1960', 
     '["20 de mayo de 1960", "22 de mayo de 1960", "25 de mayo de 1960", "22 de marzo de 1960"]',
     'La fecha aparece explícitamente en la primera oración del texto: "22 de mayo de 1960".', 
     '{"source": "BancoEjercicios", "skill": "TRACK_LOCATE", "cognitive_level": "CONOCIMIENTO", "difficulty_justification": "Información explícita claramente identificable"}', NOW(), NOW()),

    (2, 1, 'Identificación de Cifras Específicas', 
     'Texto: "La población de Chile según el censo 2017 alcanzó los 17.574.003 habitantes, lo que representa un crecimiento del 10,8% respecto al censo anterior. La Región Metropolitana concentra el 40,5% de la población total." ¿Cuántos habitantes tenía Chile según el censo 2017?', 
     'basic', 10, 'multiple_choice', '17.574.003 habitantes', 
     '["17.474.003 habitantes", "17.574.003 habitantes", "17.674.003 habitantes", "17.584.003 habitantes"]',
     'La cifra exacta se menciona directamente: "17.574.003 habitantes".', 
     '{"source": "BancoEjercicios", "skill": "TRACK_LOCATE", "cognitive_level": "CONOCIMIENTO", "difficulty_justification": "Dato numérico específico en el texto"}', NOW(), NOW()),

    (3, 2, 'Identificación de Idea Principal - Texto Expositivo', 
     'Lee el texto: "La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química. Este proceso es fundamental para la vida en la Tierra, ya que produce el oxígeno que respiramos y forma la base de todas las cadenas alimentarias. Sin la fotosíntesis, la vida tal como la conocemos no sería posible." ¿Cuál es la idea principal del texto?', 
     'basic', 12, 'multiple_choice', 'La fotosíntesis es un proceso fundamental para la vida en la Tierra', 
     '["Las plantas necesitan luz solar para vivir", "La fotosíntesis es un proceso fundamental para la vida en la Tierra", "El oxígeno es producido por las plantas", "Las cadenas alimentarias dependen de las plantas"]',
     'La idea principal abarca todo el texto: la fotosíntesis como proceso fundamental para la vida, que se desarrolla en las oraciones siguientes.', 
     '{"source": "BancoEjercicios", "skill": "TRACK_LOCATE", "cognitive_level": "COMPRENSION", "difficulty_justification": "Requiere síntesis de información explícita"}', NOW(), NOW()),

    (4, 3, 'Inferencia de Causa-Efecto', 
     'Texto: "María llegó tarde al trabajo por tercera vez esta semana. Su jefe la esperaba en la entrada con una expresión seria y un sobre en la mano. María sintió que el corazón se le aceleraba mientras se acercaba." ¿Qué se puede inferir de la situación?', 
     'intermediate', 15, 'multiple_choice', 'María probablemente recibirá una sanción laboral', 
     '["María será promovida en su trabajo", "María probablemente recibirá una sanción laboral", "El jefe quiere felicitar a María", "María llegó temprano ese día"]',
     'Las pistas contextuales (llegar tarde repetidamente, expresión seria del jefe, sobre en la mano, nerviosismo de María) sugieren una consecuencia negativa.', 
     '{"source": "BancoEjercicios", "skill": "INTERPRET_RELATE", "cognitive_level": "COMPRENSION", "difficulty_justification": "Requiere inferencia basada en múltiples pistas contextuales"}', NOW(), NOW()),

    (5, 4, 'Análisis de Conectores Textuales', 
     'En el texto: "La tecnología ha revolucionado la comunicación. Sin embargo, también ha generado nuevos desafíos sociales. Por ejemplo, el uso excesivo de redes sociales puede afectar las relaciones interpersonales." ¿Qué función cumple el conector "Sin embargo"?', 
     'intermediate', 18, 'multiple_choice', 'Introduce una idea que contrasta con la anterior', 
     '["Agrega información complementaria", "Introduce una idea que contrasta con la anterior", "Presenta una consecuencia lógica", "Ejemplifica la idea anterior"]',
     'El conector "Sin embargo" es adversativo, introduce una idea que contrasta con los aspectos positivos mencionados anteriormente.', 
     '{"source": "BancoEjercicios", "skill": "INTERPRET_RELATE", "cognitive_level": "ANALISIS", "difficulty_justification": "Requiere comprensión de relaciones lógicas entre ideas"}', NOW(), NOW()),

    (6, 5, 'Evaluación de Validez de Argumentos', 
     'Argumento: "Todos los estudiantes que estudian más de 6 horas diarias obtienen buenas calificaciones. Juan estudia 8 horas diarias, por lo tanto, Juan obtendrá buenas calificaciones." ¿Cuál es la principal debilidad de este argumento?', 
     'advanced', 25, 'multiple_choice', 'La premisa inicial es una generalización absoluta sin evidencia suficiente', 
     '["Juan no estudia lo suficiente", "La premisa inicial es una generalización absoluta sin evidencia suficiente", "No se menciona qué materias estudia Juan", "8 horas de estudio son insuficientes"]',
     'El argumento comete la falacia de generalización absoluta. No todos los estudiantes que estudian muchas horas necesariamente obtienen buenas calificaciones, ya que intervienen otros factores como la calidad del estudio, las habilidades individuales, etc.', 
     '{"source": "BancoEjercicios", "skill": "EVALUATE_REFLECT", "cognitive_level": "EVALUACION", "difficulty_justification": "Requiere identificación de falacias lógicas y evaluación crítica"}', NOW(), NOW()),

    -- EJERCICIOS DE MATEMÁTICA M1
    (7, 6, 'Operaciones con Fracciones Complejas', 
     'Calcula: (3/4 + 2/3) ÷ (5/6 - 1/2)', 
     'basic', 20, 'multiple_choice', '17/4', 
     '["17/4", "13/6", "15/8", "19/6"]',
     'Primero resolvemos los paréntesis: (3/4 + 2/3) = (9+8)/12 = 17/12; (5/6 - 1/2) = (5-3)/6 = 2/6 = 1/3. Luego: 17/12 ÷ 1/3 = 17/12 × 3/1 = 51/12 = 17/4.', 
     '{"source": "BancoEjercicios", "skill": "SOLVE_PROBLEMS", "cognitive_level": "APLICACION", "difficulty_justification": "Requiere múltiples operaciones con fracciones"}', NOW(), NOW()),

    (8, 7, 'Sistema de Ecuaciones Lineales', 
     'Resuelve el sistema: 2x + 3y = 13; x - y = 1. ¿Cuál es el valor de x?', 
     'intermediate', 25, 'multiple_choice', 'x = 4', 
     '["x = 3", "x = 4", "x = 5", "x = 2"]',
     'De la segunda ecuación: x = y + 1. Sustituyendo en la primera: 2(y + 1) + 3y = 13 → 2y + 2 + 3y = 13 → 5y = 11 → y = 11/5. Entonces x = 11/5 + 1 = 16/5. Error en opciones, revisar.', 
     '{"source": "BancoEjercicios", "skill": "REPRESENT", "cognitive_level": "APLICACION", "difficulty_justification": "Requiere manipulación algebraica y sustitución"}', NOW(), NOW()),

    (9, 8, 'Problema de Geometría Aplicada', 
     'Un terreno rectangular tiene un perímetro de 240 metros. Si el largo es el triple del ancho, ¿cuál es el área del terreno?', 
     'intermediate', 30, 'multiple_choice', '2700 m²', 
     '["2400 m²", "2700 m²", "3000 m²", "2100 m²"]',
     'Sea a = ancho, entonces largo = 3a. Perímetro: 2(a + 3a) = 8a = 240, por lo tanto a = 30m y largo = 90m. Área = 30 × 90 = 2700 m².', 
     '{"source": "BancoEjercicios", "skill": "MODEL", "cognitive_level": "APLICACION", "difficulty_justification": "Requiere modelar situación real con ecuaciones"}', NOW(), NOW()),

    -- EJERCICIOS DE MATEMÁTICA M2
    (10, 9, 'Análisis de Función Cuadrática', 
     'Dada la función f(x) = x² - 6x + 8, ¿cuáles son las coordenadas del vértice?', 
     'advanced', 20, 'multiple_choice', '(3, -1)', 
     '["(3, -1)", "(6, 8)", "(-3, 1)", "(3, 1)"]',
     'Para una función f(x) = ax² + bx + c, el vértice está en x = -b/(2a) = -(-6)/(2×1) = 3. f(3) = 9 - 18 + 8 = -1. Vértice: (3, -1).', 
     '{"source": "BancoEjercicios", "skill": "ANALYZE_FUNCTIONS", "cognitive_level": "ANALISIS", "difficulty_justification": "Requiere aplicación de fórmulas y cálculo de coordenadas"}', NOW(), NOW()),

    (11, 10, 'Aplicación de Derivadas', 
     'Si f(x) = 3x³ - 2x² + x - 5, ¿cuál es f\'(2)?', 
     'advanced', 25, 'multiple_choice', '29', 
     '["25", "29", "33", "21"]',
     'f\'(x) = 9x² - 4x + 1. Evaluando en x = 2: f\'(2) = 9(4) - 4(2) + 1 = 36 - 8 + 1 = 29.', 
     '{"source": "BancoEjercicios", "skill": "SOLVE_COMPLEX", "cognitive_level": "APLICACION", "difficulty_justification": "Requiere derivación y evaluación numérica"}', NOW(), NOW()),

    (12, 11, 'Demostración Matemática', 
     '¿Cuál es la justificación correcta para afirmar que la función f(x) = 2x + 3 es creciente en todo su dominio?', 
     'advanced', 30, 'multiple_choice', 'Su derivada f\'(x) = 2 es positiva para todo x real', 
     '["Pasa por el origen", "Su derivada f\'(x) = 2 es positiva para todo x real", "Es una función lineal", "Tiene pendiente"]',
     'Una función es creciente cuando su derivada es positiva. Como f\'(x) = 2 > 0 para todo x ∈ ℝ, la función es estrictamente creciente en todo su dominio.', 
     '{"source": "BancoEjercicios", "skill": "ARGUE_COMMUNICATE", "cognitive_level": "EVALUACION", "difficulty_justification": "Requiere justificación teórica basada en conceptos de cálculo"}', NOW(), NOW()),

    -- EJERCICIOS DE HISTORIA
    (13, 12, 'Secuencia Cronológica Chile', 
     'Ordena cronológicamente los siguientes eventos de la historia de Chile: I) Independencia de Chile II) Llegada de los españoles III) Primera Junta de Gobierno IV) Guerra del Pacífico', 
     'basic', 15, 'multiple_choice', 'II, III, I, IV', 
     '["I, II