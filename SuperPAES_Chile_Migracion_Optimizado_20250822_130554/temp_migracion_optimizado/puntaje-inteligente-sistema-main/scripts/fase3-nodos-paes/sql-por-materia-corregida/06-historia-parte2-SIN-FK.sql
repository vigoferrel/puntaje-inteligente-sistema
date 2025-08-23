-- =====================================================
-- HISTORIA PARTE 2 - 33 NODOS PAES (SIN FK)
-- Historia y Ciencias Sociales - Segunda parte
-- Tiempo estimado: 2.5 minutos
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

-- PASO 2: Insertar nodos de Historia Parte 2 (33 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('HST-33', 'Globalización y nuevo orden mundial', 
 'Proceso de globalización económica y cultural', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'económico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['globalization_analysis', 'economic_integration'], get_test_text(4)),

('HST-34', 'Revolución tecnológica e internet', 
 'Impacto de las nuevas tecnologías en la sociedad', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'tecnológico', 'comprender', 'básico', 1.1, 2.5,
 ARRAY['technological_impact', 'digital_revolution'], get_test_text(4)),

('HST-35', 'Terrorismo internacional y seguridad global', 
 'Nuevas amenazas a la seguridad en el siglo XXI', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'global', 'político', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['security_analysis', 'global_threats'], get_test_text(4)),

('HST-36', 'Crisis climática y desarrollo sostenible', 
 'Desafíos ambientales y respuestas globales', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'global', 'ambiental', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['environmental_analysis', 'sustainability_challenges'], get_test_text(4)),

('HST-37', 'Migraciones contemporáneas', 
 'Movimientos migratorios y sus impactos sociales', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'social', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['migration_analysis', 'social_integration'], get_test_text(4)),

('HST-38', 'Democracia y participación ciudadana', 
 'Evolución de los sistemas democráticos contemporáneos', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'global', 'político', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['democratic_analysis', 'citizen_participation'], get_test_text(4)),

('HST-39', 'Derechos humanos y justicia internacional', 
 'Desarrollo del derecho internacional y tribunales', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['argumentar-comunicar', 'analizar-sintetizar'], 
 'contemporáneo', 'global', 'jurídico', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['human_rights_analysis', 'international_justice'], get_test_text(4)),

('HST-40', 'Género e igualdad en la historia', 
 'Evolución de los roles de género y movimientos feministas', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'social', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['gender_analysis', 'equality_movements'], get_test_text(4)),

('HST-41', 'Pueblos originarios y multiculturalismo', 
 'Historia y derechos de los pueblos indígenas', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['interpretar-relacionar', 'argumentar-comunicar'], 
 'contemporáneo', 'america', 'cultural', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['indigenous_rights', 'multicultural_analysis'], get_test_text(4)),

('HST-42', 'Historia de Chile: Independencia y República', 
 'Proceso de independencia y formación del estado chileno', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'localizar-informacion'], 
 'moderno', 'chile', 'político', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['national_history', 'independence_process'], get_test_text(4)),

('HST-43', 'Chile en el siglo XIX: Expansión territorial', 
 'Guerra del Pacífico y consolidación territorial', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'moderno', 'chile', 'territorial', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['territorial_expansion', 'war_analysis'], get_test_text(4)),

('HST-44', 'Transformaciones sociales en Chile siglo XX', 
 'Cambios sociales y económicos en el Chile moderno', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'social', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['social_transformation', 'modernization_process'], get_test_text(4)),

('HST-45', 'Unidad Popular y gobierno de Allende', 
 'Proyecto socialista y polarización política en Chile', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'político', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['political_analysis', 'ideological_conflict'], get_test_text(4)),

('HST-46', 'Dictadura militar en Chile (1973-1990)', 
 'Régimen militar y violación de derechos humanos', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'político', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['authoritarian_regime', 'human_rights_violation'], get_test_text(4)),

('HST-47', 'Transición a la democracia en Chile', 
 'Proceso de recuperación democrática y reconciliación', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['democratic_transition', 'reconciliation_process'], get_test_text(4)),

('HST-48', 'Chile contemporáneo: Desafíos del siglo XXI', 
 'Modernización, desigualdad y movimientos sociales', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'social', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['contemporary_challenges', 'social_movements'], get_test_text(4)),

('HST-49', 'Geografía física de Chile', 
 'Características del territorio y recursos naturales', 
 'HISTORIA', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'chile', 'geográfico', 'comprender', 'básico', 1.0, 2.5,
 ARRAY['geographic_analysis', 'natural_resources'], get_test_text(4)),

('HST-50', 'Regiones de Chile y diversidad territorial', 
 'Organización regional y características específicas', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'contemporáneo', 'chile', 'geográfico', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['regional_analysis', 'territorial_diversity'], get_test_text(4)),

('HST-51', 'Población y demografía chilena', 
 'Características demográficas y distribución poblacional', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'demográfico', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['demographic_analysis', 'population_distribution'], get_test_text(4)),

('HST-52', 'Economía chilena: Sectores productivos', 
 'Estructura económica y principales actividades productivas', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'económico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['economic_analysis', 'productive_sectors'], get_test_text(4)),

('HST-53', 'Instituciones políticas chilenas', 
 'Sistema político, poderes del Estado y Constitución', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'institucional', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['institutional_analysis', 'political_system'], get_test_text(4)),

('HST-54', 'Participación ciudadana en Chile', 
 'Mecanismos de participación y organizaciones sociales', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['argumentar-comunicar', 'analizar-sintetizar'], 
 'contemporáneo', 'chile', 'cívico', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['civic_participation', 'social_organizations'], get_test_text(4)),

('HST-55', 'Desafíos ambientales en Chile', 
 'Problemas ambientales y políticas de sustentabilidad', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'ambiental', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['environmental_challenges', 'sustainability_policies'], get_test_text(4)),

('HST-56', 'Integración regional de Chile', 
 'Relaciones internacionales y bloques regionales', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'america', 'internacional', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['regional_integration', 'international_relations'], get_test_text(4)),

('HST-57', 'Cultura y patrimonio chileno', 
 'Diversidad cultural y preservación del patrimonio', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'cultural', 'comprender', 'básico', 1.1, 2.5,
 ARRAY['cultural_analysis', 'heritage_preservation'], get_test_text(4)),

('HST-58', 'Educación y desarrollo humano', 
 'Sistema educativo y desafíos del desarrollo', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'educativo', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['educational_analysis', 'human_development'], get_test_text(4)),

('HST-59', 'Salud pública y calidad de vida', 
 'Sistema de salud y indicadores de bienestar', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'social', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['public_health_analysis', 'quality_of_life'], get_test_text(4)),

('HST-60', 'Trabajo y relaciones laborales', 
 'Mercado laboral y derechos de los trabajadores', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'argumentar-comunicar'], 
 'contemporáneo', 'chile', 'laboral', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['labor_analysis', 'workers_rights'], get_test_text(4)),

('HST-61', 'Tecnología e innovación en Chile', 
 'Desarrollo tecnológico y sociedad del conocimiento', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'chile', 'tecnológico', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['technological_development', 'innovation_analysis'], get_test_text(4)),

('HST-62', 'Medios de comunicación y democracia', 
 'Rol de los medios en la sociedad democrática', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'global', 'comunicacional', 'evaluar', 'intermedio', 1.3, 3.5,
 ARRAY['media_analysis', 'democratic_communication'], get_test_text(4)),

('HST-63', 'Juventud y cambio social', 
 'Movimientos juveniles y transformaciones culturales', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'generacional', 'comprender', 'básico', 1.1, 2.5,
 ARRAY['youth_movements', 'cultural_change'], get_test_text(4)),

('HST-64', 'Futuro y prospectiva histórica', 
 'Tendencias globales y desafíos del futuro', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'global', 'prospectivo', 'crear', 'avanzado', 1.5, 4.5,
 ARRAY['future_analysis', 'historical_trends'], get_test_text(4)),

('HST-65', 'Metodología histórica y fuentes', 
 'Análisis crítico de fuentes y construcción del conocimiento histórico', 
 'HISTORIA', get_skill_text('argumentar-comunicar'), 
 ARRAY['evaluar-reflexionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'metodológico', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['historical_methodology', 'source_criticism'], get_test_text(4))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Historia Parte 2...' as status;

-- Contar nodos insertados de Historia total
SELECT COUNT(*) as nodos_historia_total 
FROM learning_nodes 
WHERE subject = 'HISTORIA';

-- Verificar distribución por período histórico
SELECT 
    historical_period,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE subject = 'HISTORIA'
GROUP BY historical_period
ORDER BY 
    CASE historical_period 
        WHEN 'antiguo' THEN 1 
        WHEN 'medieval' THEN 2 
        WHEN 'moderno_temprano' THEN 3
        WHEN 'moderno' THEN 4
        WHEN 'contemporáneo' THEN 5
    END;

-- PASO 4: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 5: Mensaje final
SELECT 'HISTORIA PARTE 2 - 33 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'HISTORIA COMPLETA - 65 NODOS TOTALES' as total;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;

-- =====================================================
-- FIN DEL SCRIPT - 33 NODOS DE HISTORIA PARTE 2
-- =====================================================