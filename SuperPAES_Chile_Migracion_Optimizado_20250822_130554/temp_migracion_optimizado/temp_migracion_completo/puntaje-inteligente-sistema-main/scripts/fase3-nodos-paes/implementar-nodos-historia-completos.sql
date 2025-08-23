-- =====================================================
-- IMPLEMENTACIÓN COMPLETA DE NODOS DE HISTORIA Y CS SOCIALES
-- 65 nodos: 45 Historia + 12 Formación Ciudadana + 8 Economía
-- Tiempo estimado: 15-20 minutos
-- =====================================================

-- PASO 1: Verificar que la tabla learning_nodes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Ejecutar primero la creación de estructura de BD.';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Formación Ciudadana (12 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('FC-01', 'Función de partidos políticos en democracia', 
 'Analiza el rol de los partidos políticos en el sistema democrático chileno', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'contemporáneo', 'national', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['multiple_choice', 'analysis_with_context'], 4),

('FC-02', 'Verificación de información (fact-checking)', 
 'Desarrolla habilidades para verificar la veracidad de información en medios', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'cultural', 'evaluar', 'avanzado', 1.3, 3.5,
 ARRAY['analysis_with_context', 'source_evaluation'], 4),

('FC-03', 'Abstención electoral y representatividad', 
 'Examina las causas y consecuencias de la abstención electoral en democracia', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'contemporáneo', 'national', 'political', 'analizar', 'intermedio', 1.1, 2.8,
 ARRAY['multiple_choice', 'data_analysis'], 4),

('FC-04', 'Nepotismo y amenazas democráticas', 
 'Identifica prácticas que debilitan las instituciones democráticas', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'political', 'evaluar', 'avanzado', 1.4, 3.2,
 ARRAY['case_analysis', 'ethical_evaluation'], 4),

('FC-05', 'Medios de comunicación y fiscalización', 
 'Evalúa el rol de los medios en la fiscalización del poder político', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'contemporáneo', 'national', 'cultural', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['media_analysis', 'multiple_choice'], 4),

('FC-06', 'Indicadores de debilitamiento democrático', 
 'Reconoce señales de erosión democrática en sistemas políticos', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-multicausal', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'political', 'evaluar', 'avanzado', 1.5, 3.8,
 ARRAY['indicator_analysis', 'comparative_analysis'], 4),

('FC-07', 'Fortalecimiento institucional democrático', 
 'Propone mecanismos para fortalecer las instituciones democráticas', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-multicausal', 'evaluar-reflexionar'], 
 'contemporáneo', 'national', 'political', 'crear', 'avanzado', 1.4, 4.0,
 ARRAY['proposal_evaluation', 'institutional_analysis'], 4),

('FC-08', 'Influencia mediática en opinión pública', 
 'Analiza cómo los medios moldean la opinión pública en democracia', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'contemporáneo', 'global', 'cultural', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['media_analysis', 'opinion_analysis'], 4),

('FC-09', 'Calidad democrática en Chile', 
 'Evalúa la calidad de la democracia chilena según indicadores internacionales', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'contemporáneo', 'national', 'political', 'evaluar', 'avanzado', 1.3, 3.5,
 ARRAY['indicator_analysis', 'comparative_analysis'], 4),

('FC-10', 'Estados de excepción constitucional', 
 'Comprende los mecanismos constitucionales de estados de excepción', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-fuentes', 'pensamiento-critico'], 
 'contemporáneo', 'national', 'political', 'comprender', 'intermedio', 1.1, 2.5,
 ARRAY['constitutional_analysis', 'multiple_choice'], 4),

('FC-11', 'Sistema electoral y legitimidad', 
 'Analiza la relación entre sistemas electorales y legitimidad democrática', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'contemporáneo', 'global', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['system_analysis', 'comparative_analysis'], 4),

('FC-12', 'Financiamiento de campañas electorales', 
 'Examina los desafíos del financiamiento electoral en la democracia', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'evaluar-reflexionar'], 
 'contemporáneo', 'national', 'political', 'evaluar', 'avanzado', 1.3, 3.3,
 ARRAY['financial_analysis', 'transparency_evaluation'], 4);

-- PASO 3: Insertar nodos de Historia (45 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- Siglo XIX (20 nodos)
('HST-01', 'Liberalismo europeo siglo XIX', 
 'Analiza los principios del liberalismo político y económico en Europa', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XIX', 'global', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['multiple_choice', 'source_analysis'], 4),

('HST-02', 'Soberanía popular y representación', 
 'Examina el desarrollo del concepto de soberanía popular', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XIX', 'global', 'political', 'evaluar', 'avanzado', 1.3, 3.2,
 ARRAY['conceptual_analysis', 'multiple_choice'], 4),

('HST-03', 'Estado-nación y pueblos originarios', 
 'Analiza la tensión entre formación del Estado-nación y pueblos originarios', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'siglo XIX', 'national', 'social', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['multicausal_analysis', 'source_analysis'], 4),

('HST-04', 'Construcción identidad nacional', 
 'Examina los procesos de construcción de identidad nacional en América', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XIX', 'regional', 'cultural', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['identity_analysis', 'comparative_analysis'], 4),

('HST-05', 'Organización política post-independencia Chile', 
 'Analiza los ensayos constitucionales y organización política temprana', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'political', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['constitutional_analysis', 'chronological_analysis'], 4),

('HST-06', 'Constitución 1833 y representatividad', 
 'Evalúa el sistema político establecido por la Constitución de 1833', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'political', 'evaluar', 'intermedio', 1.2, 2.8,
 ARRAY['constitutional_analysis', 'multiple_choice'], 4),

('HST-07', 'Principios liberales en economía chilena', 
 'Examina la aplicación de principios liberales en la economía del siglo XIX', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'economic', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['economic_analysis', 'policy_analysis'], 4),

('HST-08', 'Inserción Chile en mercado capitalista', 
 'Analiza la integración de Chile en el mercado capitalista mundial', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-multicausal', 'interpretar-relacionar'], 
 'siglo XIX', 'global', 'economic', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['market_analysis', 'global_connections'], 4),

('HST-09', 'Desarrollo ferroviario y minería', 
 'Examina el impacto del desarrollo ferroviario en la minería chilena', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'economic', 'analizar', 'intermedio', 1.2, 2.8,
 ARRAY['technological_impact', 'economic_analysis'], 4),

('HST-10', 'Relaciones comerciales asimétricas', 
 'Analiza las relaciones comerciales asimétricas de América Latina', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-multicausal', 'interpretar-relacionar'], 
 'siglo XIX', 'regional', 'economic', 'evaluar', 'avanzado', 1.4, 3.5,
 ARRAY['asymmetric_analysis', 'comparative_analysis'], 4),

('HST-11', 'Sociedad rural chilena siglo XIX', 
 'Examina las características de la sociedad rural y el inquilinaje', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'social', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['social_analysis', 'source_analysis'], 4),

('HST-12', 'Liberalismo político en Chile', 
 'Analiza el desarrollo del liberalismo político en Chile', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'pensamiento-critico'], 
 'siglo XIX', 'national', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['political_analysis', 'ideological_analysis'], 4),

('HST-13', 'Valparaíso y comercio internacional', 
 'Examina el rol de Valparaíso como puerto comercial internacional', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-multicausal', 'interpretar-relacionar'], 
 'siglo XIX', 'national', 'economic', 'analizar', 'intermedio', 1.1, 2.8,
 ARRAY['port_analysis', 'commercial_networks'], 4),

('HST-14', 'Crisis social del Centenario', 
 'Analiza la crisis social de principios del siglo XX en Chile', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'fines siglo XIX - inicios siglo XX', 'national', 'social', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['social_crisis_analysis', 'multicausal_analysis'], 4),

('HST-15', 'Expansión salitrera y transformaciones', 
 'Analiza el impacto de la expansión salitrera en la sociedad chilena', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'fines siglo XIX - inicios siglo XX', 'national', 'social', 'analizar', 'intermedio', 1.2, 2.8,
 ARRAY['analysis_with_context', 'multicausal_explanation'], 4),

('HST-16', 'Organización obrera y sindicalismo', 
 'Examina el surgimiento del movimiento obrero y sindical', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'analisis-multicausal'], 
 'fines siglo XIX - inicios siglo XX', 'national', 'social', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['labor_movement_analysis', 'organizational_analysis'], 4),

('HST-17', 'Cuestión Social y respuestas políticas', 
 'Analiza la Cuestión Social y las respuestas políticas implementadas', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'inicios siglo XX', 'national', 'social', 'evaluar', 'avanzado', 1.4, 3.8,
 ARRAY['social_problem_analysis', 'policy_response_analysis'], 4),

('HST-18', 'Ideologías políticas: anarquismo', 
 'Examina la influencia del anarquismo en el movimiento obrero', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'inicios siglo XX', 'global', 'political', 'analizar', 'avanzado', 1.3, 3.5,
 ARRAY['ideological_analysis', 'source_analysis'], 4),

('HST-19', 'Crisis económica 1929 en América Latina', 
 'Analiza el impacto de la Gran Depresión en América Latina', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'regional', 'economic', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['economic_crisis_analysis', 'regional_impact'], 4),

('HST-20', 'Totalitarismos: nazismo vs estalinismo', 
 'Compara las características de los regímenes totalitarios', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'analisis-multicausal'], 
 'siglo XX', 'global', 'political', 'evaluar', 'avanzado', 1.5, 4.0,
 ARRAY['comparative_analysis', 'totalitarian_analysis'], 4);

-- PASO 4: Insertar más nodos de Historia del siglo XX (25 nodos restantes)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('HST-21', 'Estalinismo y dictadura del proletariado', 
 'Analiza las características del régimen estalinista en la URSS', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'evaluar', 'avanzado', 1.4, 3.8,
 ARRAY['regime_analysis', 'source_analysis'], 4),

('HST-22', 'Retroceso democrático en Europa', 
 'Examina el retroceso democrático en Europa entre guerras', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-multicausal', 'pensamiento-critico'], 
 'siglo XX', 'global', 'political', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['democratic_regression_analysis', 'causal_analysis'], 4),

('HST-23', 'Principios comunes del totalitarismo', 
 'Identifica características comunes de los regímenes totalitarios', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'analizar', 'avanzado', 1.3, 3.5,
 ARRAY['comparative_analysis', 'conceptual_analysis'], 4),

('HST-24', 'Policía secreta y control social', 
 'Analiza los mecanismos de control social en regímenes autoritarios', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-critico', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'analizar', 'avanzado', 1.4, 3.8,
 ARRAY['control_mechanisms_analysis', 'source_analysis'], 4),

('HST-25', 'Derechos fundamentales post-1945', 
 'Examina el desarrollo de los derechos humanos después de 1945', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'pensamiento-critico'], 
 'siglo XX', 'global', 'political', 'evaluar', 'intermedio', 1.2, 3.0,
 ARRAY['rights_development_analysis', 'international_law'], 4),

('HST-26', 'Organismos internacionales multilaterales', 
 'Analiza la creación y función de organismos internacionales', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-fuentes', 'pensamiento-critico'], 
 'siglo XX', 'global', 'political', 'comprender', 'intermedio', 1.1, 2.8,
 ARRAY['institutional_analysis', 'multiple_choice'], 4),

('HST-27', 'Descolonización y Guerra Fría', 
 'Examina la relación entre descolonización y Guerra Fría', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['decolonization_analysis', 'cold_war_context'], 4),

('HST-28', 'Populismo latinoamericano', 
 'Analiza las características del populismo en América Latina', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'analisis-multicausal'], 
 'siglo XX', 'regional', 'political', 'evaluar', 'avanzado', 1.3, 3.5,
 ARRAY['populism_analysis', 'comparative_analysis'], 4),

('HST-29', 'Estrategias populistas de permanencia', 
 'Examina las estrategias de los líderes populistas para mantenerse en el poder', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'regional', 'political', 'evaluar', 'avanzado', 1.4, 3.8,
 ARRAY['political_strategy_analysis', 'power_maintenance'], 4),

('HST-30', 'Autodeterminación de pueblos', 
 'Analiza el principio de autodeterminación en el contexto de descolonización', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'evaluar', 'intermedio', 1.2, 3.2,
 ARRAY['self_determination_analysis', 'international_law'], 4),

('HST-31', 'Tercer Mundo y No Alineados', 
 'Examina el surgimiento del concepto de Tercer Mundo y el Movimiento No Alineado', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['third_world_analysis', 'non_aligned_movement'], 4),

('HST-32', 'Poblaciones callampas y segregación urbana', 
 'Analiza el crecimiento urbano y la segregación en Chile del siglo XX', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'social', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['urban_growth_analysis', 'social_segregation'], 4),

('HST-33', 'Distribución del ingreso Chile siglo XX', 
 'Examina la evolución de la distribución del ingreso en Chile', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-fuentes', 'pensamiento-temporal'], 
 'siglo XX', 'national', 'economic', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['income_distribution_analysis', 'data_analysis'], 4),

('HST-34', 'Problemas de salubridad urbana', 
 'Analiza los problemas de salubridad en el crecimiento urbano', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'social', 'analizar', 'intermedio', 1.1, 2.8,
 ARRAY['public_health_analysis', 'urban_problems'], 4),

('HST-35', 'Intervención estatal en vivienda (CORVI)', 
 'Examina las políticas estatales de vivienda en Chile', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'social', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['housing_policy_analysis', 'state_intervention'], 4),

('HST-36', 'Muro de Berlín y bipolaridad', 
 'Analiza el simbolismo del Muro de Berlín en la Guerra Fría', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'global', 'political', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['cold_war_analysis', 'symbolic_analysis'], 4),

('HST-37', 'Golpe de Estado 1973 y contexto internacional', 
 'Examina el golpe de Estado de 1973 en el contexto de la Guerra Fría', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'siglo XX', 'national', 'political', 'evaluar', 'avanzado', 1.5, 4.0,
 ARRAY['coup_analysis', 'international_context'], 4),

('HST-38', 'Transición democrática y rol de EE.UU.', 
 'Analiza el rol de Estados Unidos en la transición democrática chilena', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'analisis-multicausal'], 
 'siglo XX', 'national', 'political', 'evaluar', 'avanzado', 1.4, 3.8,
 ARRAY['transition_analysis', 'international_influence'], 4),

('HST-39', 'Institucionalidad transicional', 
 'Examina las instituciones creadas durante la transición democrática', 
 'HISTORIA_CS_SOCIALES', 'analisis-fuentes', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'political', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['institutional_analysis', 'transitional_justice'], 4),

('HST-40', 'Sistema AFP y neoliberalismo', 
 'Analiza la implementación del sistema de AFP en el modelo neoliberal', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'siglo XX', 'national', 'economic', 'evaluar', 'avanzado', 1.4, 3.5,
 ARRAY['pension_system_analysis', 'neoliberal_model'], 4),

('HST-41', 'Represión sistemática DDHH', 
 'Examina la violación sistemática de derechos humanos durante la dictadura', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'social', 'evaluar', 'avanzado', 1.5, 4.2,
 ARRAY['human_rights_analysis', 'systematic_repression'], 4),

('HST-42', 'Modelo neoliberal y diversificación exportadora', 
 'Analiza la diversificación exportadora en el modelo neoliberal chileno', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'interpretar-relacionar'], 
 'siglo XX', 'national', 'economic', 'analizar', 'intermedio', 1.3, 3.2,
 ARRAY['export_diversification_analysis', 'economic_model'], 4),

('HST-43', 'Crisis años 80 y rearticulación oposición', 
 'Examina la crisis económica de los 80 y la rearticulación de la oposición', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['pensamiento-temporal', 'pensamiento-critico'], 
 'siglo XX', 'national', 'political', 'analizar', 'avanzado', 1.4, 3.8,
 ARRAY['economic_crisis_analysis', 'political_opposition'], 4),

('HST-44', 'Jornadas de protesta y movilización social', 
de protesta de los años 80 en Chile', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-temporal', 
 ARRAY['analisis-fuentes', 'analisis-multicausal'], 
 'siglo XX', 'national', 'social', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['social_movement_analysis', 'protest_analysis'], 4),

('HST-45', 'Plebiscito 1988 y democratización', 
 'Examina el plebiscito de 1988 y el proceso de democratización', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-fuentes', 'pensamiento-temporal'], 
 'siglo XX', 'national', 'political', 'evaluar', 'avanzado', 1.5, 4.0,
 ARRAY['plebiscite_analysis', 'democratization_process'], 4);

-- PASO 5: Insertar nodos de Sistema Económico (8 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('ECO-01', 'Estado y transacciones de mercado', 
 'Analiza el rol del Estado en la regulación de transacciones de mercado', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-multicausal', 'pensamiento-critico'], 
 'contemporáneo', 'global', 'economic', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['market_regulation_analysis', 'state_role_analysis'], 4),

('ECO-02', 'Políticas anti-inflacionarias', 
 'Examina las políticas económicas para controlar la inflación', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['interpretar-relacionar', 'pensamiento-critico'], 
 'contemporáneo', 'national', 'economic', 'aplicar', 'intermedio', 1.3, 3.2,
 ARRAY['monetary_policy_analysis', 'inflation_control'], 4),

('ECO-03', 'Comportamiento consumidor ante alzas', 
 'Analiza cómo reacciona el consumidor ante alzas de precios', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-multicausal', 'pensamiento-critico'], 
 'contemporáneo', 'global', 'economic', 'analizar', 'básico', 1.1, 2.5,
 ARRAY['consumer_behavior_analysis', 'price_elasticity'], 4),

('ECO-04', 'Deflación y sobreproducción', 
 'Examina las causas y efectos de la deflación y sobreproducción', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['interpretar-relacionar', 'pensamiento-critico'], 
 'contemporáneo', 'global', 'economic', 'analizar', 'avanzado', 1.4, 3.5,
 ARRAY['deflation_analysis', 'overproduction_effects'], 4),

('ECO-05', 'Precio como expresión de valor', 
 'Analiza cómo los precios expresan el valor en el mercado', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['pensamiento-critico', 'analisis-multicausal'], 
 'contemporáneo', 'global', 'economic', 'comprender', 'básico', 1.0, 2.8,
 ARRAY['price_theory_analysis', 'value_expression'], 4),

('ECO-06', 'Estrategias ante escasez de materias primas', 
 'Examina las estrategias económicas ante escasez de recursos', 
 'HISTORIA_CS_SOCIALES', 'analisis-multicausal', 
 ARRAY['interpretar-relacionar', 'pensamiento-critico'], 
 'contemporáneo', 'global', 'economic', 'evaluar', 'avanzado', 1.3, 3.5,
 ARRAY['resource_scarcity_analysis', 'strategic_response'], 4),

('ECO-07', 'Concentración de oferentes y precios', 
 'Analiza el impacto de la concentración de oferentes en los precios', 
 'HISTORIA_CS_SOCIALES', 'pensamiento-critico', 
 ARRAY['analisis-multicausal', 'interpretar-relacionar'], 
 'contemporáneo', 'global', 'economic', 'evaluar', 'intermedio', 1.2, 3.0,
 ARRAY['market_concentration_analysis', 'oligopoly_effects'], 4),

('ECO-08', 'Bienes complementarios en economía', 
 'Examina la relación entre bienes complementarios y su impacto económico', 
 'HISTORIA_CS_SOCIALES', 'interpretar-relacionar', 
 ARRAY['analisis-multicausal', 'pensamiento-critico'], 
 'contemporáneo', 'global', 'economic', 'aplicar', 'básico', 1.1, 2.8,
 ARRAY['complementary_goods_analysis', 'economic_relationships'], 4);

-- PASO 6: Verificar la implementación
SELECT 'Verificando implementación de nodos de Historia...' as status;

-- Contar nodos por categoría
SELECT 
    CASE 
        WHEN code LIKE 'FC-%' THEN 'Formación Ciudadana'
        WHEN code LIKE 'HST-%' THEN 'Historia'
        WHEN code LIKE 'ECO-%' THEN 'Sistema Económico'
    END as categoria,
    COUNT(*) as total_nodos
FROM learning_nodes 
WHERE code LIKE 'FC-%' OR code LIKE 'HST-%' OR code LIKE 'ECO-%'
GROUP BY 
    CASE 
        WHEN code LIKE 'FC-%' THEN 'Formación Ciudadana'
        WHEN code LIKE 'HST-%' THEN 'Historia'
        WHEN code LIKE 'ECO-%' THEN 'Sistema Económico'
    END
ORDER BY total_nodos DESC;

-- Verificar distribución por dificultad
SELECT 
    difficulty,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes WHERE subject = 'HISTORIA_CS_SOCIALES')), 2) as porcentaje
FROM learning_nodes 
WHERE subject = 'HISTORIA_CS_SOCIALES'
GROUP BY difficulty
ORDER BY cantidad DESC;

-- Verificar distribución por habilidades
SELECT 
    primary_skill,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE subject = 'HISTORIA_CS_SOCIALES'
GROUP BY primary_skill
ORDER BY cantidad DESC;

-- PASO 7: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 8: Mensaje final
SELECT 
    'IMPLEMENTACIÓN COMPLETA DE NODOS DE HISTORIA Y CS SOCIALES' as resultado,
    COUNT(*) as total_nodos_implementados
FROM learning_nodes 
WHERE subject = 'HISTORIA_CS_SOCIALES';

SELECT 'Nodos implementados exitosamente:' as detalle;
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'FC-%' THEN 1 END) || ' nodos de Formación Ciudadana' as fc_nodos
FROM learning_nodes WHERE subject = 'HISTORIA_CS_SOCIALES'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'HST-%' THEN 1 END) || ' nodos de Historia' as hist_nodos
FROM learning_nodes WHERE subject = 'HISTORIA_CS_SOCIALES'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'ECO-%' THEN 1 END) || ' nodos de Sistema Económico' as eco_nodos
FROM learning_nodes WHERE subject = 'HISTORIA_CS_SOCIALES';

-- =====================================================
-- FIN DEL SCRIPT - 65 NODOS IMPLEMENTADOS
-- =====================================================
 'Analiza las jornadas