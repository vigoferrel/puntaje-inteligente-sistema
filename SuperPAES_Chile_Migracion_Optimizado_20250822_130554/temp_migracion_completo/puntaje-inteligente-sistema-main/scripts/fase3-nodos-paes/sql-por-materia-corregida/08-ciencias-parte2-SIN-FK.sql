-- =====================================================
-- CIENCIAS PARTE 2 - 33 NODOS PAES (SIN FK)
-- Química y Física - Segunda parte
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

-- PASO 2: Insertar nodos de Ciencias Parte 2 (33 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- QUÍMICA CONTINUACIÓN (13 nodos: QUI-08 a QUI-20)
('QUI-08', 'Electroquímica y pilas', 
 'Reacciones redox y celdas electroquímicas', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'electroquímico', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['electrochemistry', 'redox_reactions'], get_test_text(5)),

('QUI-09', 'Química de polímeros', 
 'Macromoléculas y materiales poliméricos', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'polimérico', 'comprender', 'intermedio', 1.3, 3.5,
 ARRAY['polymer_chemistry', 'macromolecules'], get_test_text(5)),

('QUI-10', 'Química analítica cuantitativa', 
 'Métodos de análisis y determinación cuantitativa', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'analítico', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['quantitative_analysis', 'analytical_methods'], get_test_text(5)),

('QUI-11', 'Química de coordinación', 
 'Complejos metálicos y teoría del campo cristalino', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'coordinación', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['coordination_chemistry', 'metal_complexes'], get_test_text(5)),

('QUI-12', 'Química nuclear', 
 'Radioactividad y reacciones nucleares', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'nuclear', 'comprender', 'avanzado', 1.4, 4.0,
 ARRAY['nuclear_chemistry', 'radioactivity'], get_test_text(5)),

('QUI-13', 'Química de superficies y catálisis', 
 'Fenómenos superficiales y catalizadores', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'superficial', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['surface_chemistry', 'catalysis'], get_test_text(5)),

('QUI-14', 'Química computacional', 
 'Modelado molecular y simulaciones químicas', 
 'CIENCIAS', get_skill_text('modelar'), 
 ARRAY['resolver-problemas', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'computacional', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['computational_chemistry', 'molecular_modeling'], get_test_text(5)),

('QUI-15', 'Química de materiales', 
 'Síntesis y propiedades de materiales avanzados', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'materiales', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['materials_chemistry', 'advanced_materials'], get_test_text(5)),

('QUI-16', 'Química farmacéutica', 
 'Diseño y síntesis de fármacos', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'farmacéutico', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['pharmaceutical_chemistry', 'drug_design'], get_test_text(5)),

('QUI-17', 'Química industrial y procesos', 
 'Procesos químicos industriales y optimización', 
 'CIENCIAS', get_skill_text('modelar'), 
 ARRAY['resolver-problemas', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'industrial', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['industrial_chemistry', 'chemical_processes'], get_test_text(5)),

('QUI-18', 'Espectroscopía y análisis instrumental', 
 'Técnicas espectroscópicas para análisis molecular', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'espectroscópico', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['spectroscopy', 'instrumental_analysis'], get_test_text(5)),

('QUI-19', 'Química verde y sostenible', 
 'Principios de química ambientalmente responsable', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['argumentar-comunicar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'sostenible', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['green_chemistry', 'sustainable_processes'], get_test_text(5)),

('QUI-20', 'Investigación química avanzada', 
 'Metodología de investigación en química', 
 'CIENCIAS', get_skill_text('argumentar-comunicar'), 
 ARRAY['evaluar-reflexionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'investigativo', 'crear', 'avanzado', 1.6, 5.0,
 ARRAY['chemical_research', 'experimental_methodology'], get_test_text(5)),

-- FÍSICA (20 nodos: FIS-01 a FIS-20)
('FIS-01', 'Mecánica clásica y cinemática', 
 'Movimiento de partículas y sistemas mecánicos', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'mecánico', 'aplicar', 'intermedio', 1.3, 4.0,
 ARRAY['kinematics', 'mechanical_problems'], get_test_text(5)),

('FIS-02', 'Dinámica y leyes de Newton', 
 'Fuerzas, masa y aceleración en sistemas físicos', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'dinámico', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['dynamics', 'force_analysis'], get_test_text(5)),

('FIS-03', 'Trabajo, energía y conservación', 
 'Principios de conservación de energía y momentum', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['resolver-problemas', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'energético', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['energy_conservation', 'work_energy_theorem'], get_test_text(5)),

('FIS-04', 'Gravitación y movimiento planetario', 
 'Ley de gravitación universal y mecánica celeste', 
 'CIENCIAS', get_skill_text('modelar'), 
 ARRAY['resolver-problemas', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'gravitacional', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['gravitation', 'planetary_motion'], get_test_text(5)),

('FIS-05', 'Oscilaciones y ondas mecánicas', 
 'Movimiento armónico simple y propagación de ondas', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'ondulatorio', 'aplicar', 'intermedio', 1.3, 4.0,
 ARRAY['oscillations', 'wave_mechanics'], get_test_text(5)),

('FIS-06', 'Termodinámica y gases', 
 'Leyes termodinámicas y teoría cinética', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['resolver-problemas', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'termodinámico', 'analizar', 'intermedio', 1.4, 4.0,
 ARRAY['thermodynamics', 'kinetic_theory'], get_test_text(5)),

('FIS-07', 'Electrostática y campo eléctrico', 
 'Cargas eléctricas y campos electrostáticos', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'electrostático', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['electrostatics', 'electric_fields'], get_test_text(5)),

('FIS-08', 'Corriente eléctrica y circuitos', 
 'Análisis de circuitos eléctricos y componentes', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'eléctrico', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['electric_circuits', 'current_analysis'], get_test_text(5)),

('FIS-09', 'Magnetismo y electromagnetismo', 
 'Campos magnéticos y inducción electromagnética', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['resolver-problemas', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'electromagnético', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['magnetism', 'electromagnetic_induction'], get_test_text(5)),

('FIS-10', 'Ondas electromagnéticas y luz', 
 'Propagación de ondas EM y fenómenos ópticos', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'óptico', 'comprender', 'intermedio', 1.3, 3.5,
 ARRAY['electromagnetic_waves', 'optics'], get_test_text(5)),

('FIS-11', 'Física moderna y relatividad', 
 'Teoría de la relatividad especial y general', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'relativista', 'evaluar', 'avanzado', 1.6, 5.0,
 ARRAY['relativity', 'modern_physics'], get_test_text(5)),

('FIS-12', 'Mecánica cuántica básica', 
 'Principios fundamentales de la física cuántica', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'cuántico', 'evaluar', 'avanzado', 1.7, 5.5,
 ARRAY['quantum_mechanics', 'wave_particle_duality'], get_test_text(5)),

('FIS-13', 'Física atómica y nuclear', 
 'Estructura atómica y procesos nucleares', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'atómico', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['atomic_physics', 'nuclear_processes'], get_test_text(5)),

('FIS-14', 'Física de partículas', 
 'Partículas elementales y fuerzas fundamentales', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'partículas', 'evaluar', 'avanzado', 1.6, 5.0,
 ARRAY['particle_physics', 'fundamental_forces'], get_test_text(5)),

('FIS-15', 'Astrofísica y cosmología', 
 'Física del universo y objetos astronómicos', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'cosmológico', 'comprender', 'avanzado', 1.4, 4.0,
 ARRAY['astrophysics', 'cosmology'], get_test_text(5)),

('FIS-16', 'Física del estado sólido', 
 'Propiedades de materiales cristalinos', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'sólido', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['solid_state_physics', 'crystalline_materials'], get_test_text(5)),

('FIS-17', 'Física computacional', 
 'Simulaciones numéricas y modelado físico', 
 'CIENCIAS', get_skill_text('modelar'), 
 ARRAY['resolver-problemas', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'computacional', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['computational_physics', 'numerical_simulations'], get_test_text(5)),

('FIS-18', 'Física médica y biofísica', 
 'Aplicaciones físicas en medicina y biología', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'médico', 'comprender', 'avanzado', 1.4, 4.0,
 ARRAY['medical_physics', 'biophysics'], get_test_text(5)),

('FIS-19', 'Física ambiental y energías renovables', 
 'Física aplicada a problemas ambientales', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'ambiental', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['environmental_physics', 'renewable_energy'], get_test_text(5)),

('FIS-20', 'Investigación en física experimental', 
 'Metodología experimental y análisis de datos', 
 'CIENCIAS', get_skill_text('argumentar-comunicar'), 
 ARRAY['evaluar-reflexionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'experimental', 'crear', 'avanzado', 1.6, 5.0,
 ARRAY['experimental_physics', 'data_analysis'], get_test_text(5))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Ciencias Parte 2...' as status;

-- Contar nodos insertados de Ciencias total
SELECT COUNT(*) as nodos_ciencias_total 
FROM learning_nodes 
WHERE subject = 'CIENCIAS';

-- Verificar distribución por área temática completa
SELECT 
    CASE 
        WHEN code LIKE 'BIO-%' THEN 'Biología'
        WHEN code LIKE 'QUI-%' THEN 'Química'
        WHEN code LIKE 'FIS-%' THEN 'Física'
        ELSE 'Otro'
    END as area,
    COUNT(*) as cantidad
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY 
    CASE 
        WHEN code LIKE 'BIO-%' THEN 'Biología'
        WHEN code LIKE 'QUI-%' THEN 'Química'
        WHEN code LIKE 'FIS-%' THEN 'Física'
        ELSE 'Otro'
    END
ORDER BY area;

-- PASO 4: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 5: Mensaje final
SELECT 'CIENCIAS PARTE 2 - 33 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'CIENCIAS COMPLETA - 65 NODOS TOTALES' as total;
SELECT 'Biología (25) + Química (20) + Física (20) = 65 nodos' as distribucion;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;

-- =====================================================
-- FIN DEL SCRIPT - 33 NODOS DE CIENCIAS PARTE 2
-- =====================================================