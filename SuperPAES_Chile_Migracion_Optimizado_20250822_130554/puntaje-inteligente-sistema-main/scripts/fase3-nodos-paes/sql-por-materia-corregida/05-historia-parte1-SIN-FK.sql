-- =====================================================
-- HISTORIA PARTE 1 - 32 NODOS PAES (SIN FK)
-- Historia y Ciencias Sociales - Primera parte
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

-- PASO 2: Insertar nodos de Historia Parte 1 (32 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
('HST-01', 'Civilizaciones antiguas de Mesopotamia', 
 'Desarrollo de las primeras civilizaciones urbanas en Mesopotamia', 
 'HISTORIA', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'antiguo', 'medio_oriente', 'político', 'recordar', 'básico', 1.0, 2.5,
 ARRAY['chronology', 'multiple_choice'], get_test_text(4)),

('HST-02', 'Antiguo Egipto y la civilización del Nilo', 
 'Organización política, social y religiosa del Antiguo Egipto', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['localizar-informacion', 'analizar-sintetizar'], 
 'antiguo', 'africa', 'social', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['cultural_analysis', 'source_interpretation'], get_test_text(4)),

('HST-03', 'Grecia clásica y la democracia ateniense', 
 'Desarrollo de la democracia y la filosofía en la Grecia clásica', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'antiguo', 'europa', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['political_analysis', 'comparative_systems'], get_test_text(4)),

('HST-04', 'Imperio Romano y su legado', 
 'Expansión, organización y legado cultural del Imperio Romano', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'antiguo', 'europa', 'cultural', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['empire_analysis', 'cultural_legacy'], get_test_text(4)),

('HST-05', 'Cristianismo y transformación del mundo antiguo', 
 'Surgimiento y expansión del cristianismo en el Imperio Romano', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'antiguo', 'europa', 'religioso', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['religious_transformation', 'cultural_change'], get_test_text(4)),

('HST-06', 'Feudalismo y sociedad medieval', 
 'Organización social y económica del sistema feudal', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'medieval', 'europa', 'social', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['social_structure_analysis', 'economic_systems'], get_test_text(4)),

('HST-07', 'Islam y expansión árabe', 
 'Surgimiento del Islam y expansión del mundo árabe', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'medieval', 'medio_oriente', 'religioso', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['religious_expansion', 'cultural_diffusion'], get_test_text(4)),

('HST-08', 'Cruzadas y contacto entre civilizaciones', 
 'Las Cruzadas como encuentro entre el mundo cristiano e islámico', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'medieval', 'europa', 'religioso', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['conflict_analysis', 'cultural_encounter'], get_test_text(4)),

('HST-09', 'Renacimiento y humanismo', 
 'Transformaciones culturales y artísticas del Renacimiento', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'moderno_temprano', 'europa', 'cultural', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['cultural_analysis', 'artistic_interpretation'], get_test_text(4)),

('HST-10', 'Reforma protestante y guerras de religión', 
 'División del cristianismo y conflictos religiosos en Europa', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'moderno_temprano', 'europa', 'religioso', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['religious_conflict', 'ideological_analysis'], get_test_text(4)),

('HST-11', 'Descubrimientos geográficos y expansión europea', 
 'Exploraciones marítimas y primeros contactos con América', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'moderno_temprano', 'global', 'económico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['geographic_analysis', 'exploration_impact'], get_test_text(4)),

('HST-12', 'Conquista de América y encuentro de culturas', 
 'Proceso de conquista española y encuentro con civilizaciones americanas', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'moderno_temprano', 'america', 'cultural', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['cultural_encounter', 'conquest_analysis'], get_test_text(4)),

('HST-13', 'Sistema colonial americano', 
 'Organización política, económica y social de las colonias americanas', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'moderno_temprano', 'america', 'social', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['colonial_system_analysis', 'social_hierarchy'], get_test_text(4)),

('HST-14', 'Ilustración y pensamiento político moderno', 
 'Ideas ilustradas y su impacto en el pensamiento político', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'moderno', 'europa', 'político', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['philosophical_analysis', 'political_theory'], get_test_text(4)),

('HST-15', 'Revolución Francesa y sus consecuencias', 
 'Proceso revolucionario francés y su impacto en Europa', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'moderno', 'europa', 'político', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['revolutionary_analysis', 'political_transformation'], get_test_text(4)),

('HST-16', 'Independencias americanas', 
 'Procesos de independencia en América Latina', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'moderno', 'america', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['independence_analysis', 'political_movements'], get_test_text(4)),

('HST-17', 'Revolución Industrial y transformaciones sociales', 
 'Cambios económicos y sociales de la Revolución Industrial', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'moderno', 'europa', 'económico', 'analizar', 'intermedio', 1.4, 4.0,
 ARRAY['industrial_analysis', 'social_transformation'], get_test_text(4)),

('HST-18', 'Nacionalismo y formación de estados nacionales', 
 'Desarrollo del nacionalismo en Europa y América', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'moderno', 'global', 'político', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['nationalism_analysis', 'state_formation'], get_test_text(4)),

('HST-19', 'Imperialismo y colonialismo del siglo XIX', 
 'Expansión imperial europea en África y Asia', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'moderno', 'global', 'político', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['imperial_analysis', 'colonial_impact'], get_test_text(4)),

('HST-20', 'Primera Guerra Mundial y sus consecuencias', 
 'Causas, desarrollo y consecuencias de la Gran Guerra', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'global', 'político', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['war_analysis', 'global_conflict'], get_test_text(4)),

('HST-21', 'Revolución Rusa y surgimiento de la URSS', 
 'Proceso revolucionario ruso y establecimiento del estado soviético', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'europa', 'político', 'analizar', 'avanzado', 1.4, 4.0,
 ARRAY['revolutionary_analysis', 'ideological_transformation'], get_test_text(4)),

('HST-22', 'Crisis económica de 1929 y Gran Depresión', 
 'Crisis del capitalismo y sus efectos globales', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'económico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['economic_crisis_analysis', 'global_impact'], get_test_text(4)),

('HST-23', 'Fascismo y nazismo en Europa', 
 'Surgimiento y características de los regímenes totalitarios', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'europa', 'político', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['totalitarian_analysis', 'ideological_critique'], get_test_text(4)),

('HST-24', 'Segunda Guerra Mundial', 
 'Desarrollo y consecuencias del conflicto mundial más devastador', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['evaluar-reflexionar', 'interpretar-relacionar'], 
 'contemporáneo', 'global', 'político', 'analizar', 'avanzado', 1.6, 5.0,
 ARRAY['global_war_analysis', 'conflict_consequences'], get_test_text(4)),

('HST-25', 'Holocausto y crímenes contra la humanidad', 
 'Genocidio nazi y reflexión sobre los derechos humanos', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'europa', 'social', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['genocide_analysis', 'human_rights_reflection'], get_test_text(4)),

('HST-26', 'Guerra Fría y bipolaridad mundial', 
 'División del mundo en bloques y tensión Este-Oeste', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['cold_war_analysis', 'bipolar_world'], get_test_text(4)),

('HST-27', 'Descolonización de África y Asia', 
 'Procesos de independencia en el Tercer Mundo', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'político', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['decolonization_analysis', 'independence_movements'], get_test_text(4)),

('HST-28', 'Revolución Cubana y América Latina en la Guerra Fría', 
 'Impacto de la Revolución Cubana en el contexto latinoamericano', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'america', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['revolutionary_analysis', 'regional_impact'], get_test_text(4)),

('HST-29', 'Movimientos sociales de los años 60', 
 'Movimientos estudiantiles, feministas y de derechos civiles', 
 'HISTORIA', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'social', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['social_movement_analysis', 'cultural_change'], get_test_text(4)),

('HST-30', 'Crisis del petróleo y transformaciones económicas', 
 'Crisis energética y cambios en la economía mundial', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'económico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['economic_crisis_analysis', 'energy_politics'], get_test_text(4)),

('HST-31', 'Dictaduras militares en América Latina', 
 'Regímenes autoritarios y violación de derechos humanos', 
 'HISTORIA', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'america', 'político', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['authoritarian_analysis', 'human_rights_violation'], get_test_text(4)),

('HST-32', 'Caída del Muro de Berlín y fin de la Guerra Fría', 
 'Colapso del bloque socialista y nuevo orden mundial', 
 'HISTORIA', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'global', 'político', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['political_transformation', 'world_order_change'], get_test_text(4))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Historia Parte 1...' as status;

-- Contar nodos insertados
SELECT COUNT(*) as nodos_insertados 
FROM learning_nodes 
WHERE subject = 'HISTORIA';

-- PASO 4: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 5: Mensaje final
SELECT 'HISTORIA PARTE 1 - 32 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;
SELECT 'Primera parte de Historia completada' as estado;

-- =====================================================
-- FIN DEL SCRIPT - 32 NODOS DE HISTORIA PARTE 1
-- =====================================================