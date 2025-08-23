-- =====================================================
-- CIENCIAS PARTE 1 - 32 NODOS PAES (SIN FK)
-- Biología, Química y Física - Primera parte
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

-- PASO 2: Insertar nodos de Ciencias Parte 1 (32 nodos)
INSERT INTO learning_nodes (
    code, title, description, subject, skill_id, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- BIOLOGÍA (25 nodos: BIO-01 a BIO-25)
('BIO-01', 'Célula: unidad básica de la vida', 
 'Estructura y función de células procariotas y eucariotas', 
 'CIENCIAS', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'biológico', 'comprender', 'básico', 1.0, 2.5,
 ARRAY['cell_structure', 'microscopy_analysis'], get_test_text(5)),

('BIO-02', 'Biomoléculas y metabolismo celular', 
 'Carbohidratos, lípidos, proteínas y ácidos nucleicos', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'bioquímico', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['molecular_analysis', 'biochemical_processes'], get_test_text(5)),

('BIO-03', 'Respiración celular y fotosíntesis', 
 'Procesos de obtención y transformación de energía', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'energético', 'analizar', 'intermedio', 1.3, 4.0,
 ARRAY['energy_processes', 'metabolic_pathways'], get_test_text(5)),

('BIO-04', 'División celular: mitosis y meiosis', 
 'Procesos de reproducción celular y formación de gametos', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'reproductivo', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['cell_division', 'chromosome_analysis'], get_test_text(5)),

('BIO-05', 'Genética mendeliana y herencia', 
 'Leyes de Mendel y patrones de herencia', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'genético', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['genetic_problems', 'inheritance_patterns'], get_test_text(5)),

('BIO-06', 'ADN, ARN y síntesis de proteínas', 
 'Estructura del material genético y expresión génica', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'molecular', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['molecular_genetics', 'protein_synthesis'], get_test_text(5)),

('BIO-07', 'Evolución y selección natural', 
 'Teoría evolutiva y mecanismos de cambio', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'evolutivo', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['evolutionary_analysis', 'natural_selection'], get_test_text(5)),

('BIO-08', 'Biodiversidad y clasificación', 
 'Diversidad de especies y sistemas de clasificación', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'localizar-informacion'], 
 'contemporáneo', 'universal', 'taxonómico', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['taxonomy', 'species_identification'], get_test_text(5)),

('BIO-09', 'Ecosistemas y cadenas alimentarias', 
 'Relaciones tróficas y flujo de energía en ecosistemas', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'modelar'], 
 'contemporáneo', 'universal', 'ecológico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['ecosystem_analysis', 'energy_flow'], get_test_text(5)),

('BIO-10', 'Ciclos biogeoquímicos', 
 'Ciclos del carbono, nitrógeno, fósforo y agua', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'biogeoquímico', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['biogeochemical_cycles', 'environmental_chemistry'], get_test_text(5)),

('BIO-11', 'Anatomía y fisiología humana', 
 'Sistemas del cuerpo humano y sus funciones', 
 'CIENCIAS', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'fisiológico', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['human_anatomy', 'physiological_processes'], get_test_text(5)),

('BIO-12', 'Sistema nervioso y comportamiento', 
 'Estructura y función del sistema nervioso', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'neurológico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['nervous_system', 'behavioral_analysis'], get_test_text(5)),

('BIO-13', 'Sistema inmunológico y salud', 
 'Defensas del organismo y respuesta inmune', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'inmunológico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['immune_response', 'health_analysis'], get_test_text(5)),

('BIO-14', 'Reproducción y desarrollo', 
 'Procesos reproductivos y desarrollo embrionario', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'reproductivo', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['reproductive_biology', 'developmental_processes'], get_test_text(5)),

('BIO-15', 'Biotecnología y ingeniería genética', 
 'Aplicaciones tecnológicas de la biología', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'biotecnológico', 'evaluar', 'avanzado', 1.5, 4.5,
 ARRAY['biotechnology_applications', 'genetic_engineering'], get_test_text(5)),

('BIO-16', 'Microbiología y enfermedades', 
 'Microorganismos y su impacto en la salud', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'microbiológico', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['microbiology', 'disease_analysis'], get_test_text(5)),

('BIO-17', 'Conservación y sustentabilidad', 
 'Preservación de la biodiversidad y recursos naturales', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'conservación', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['conservation_biology', 'sustainability_analysis'], get_test_text(5)),

('BIO-18', 'Biología marina y acuática', 
 'Ecosistemas acuáticos y adaptaciones', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'acuático', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['marine_biology', 'aquatic_ecosystems'], get_test_text(5)),

('BIO-19', 'Botánica y fisiología vegetal', 
 'Estructura y función de las plantas', 
 'CIENCIAS', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'botánico', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['plant_biology', 'plant_physiology'], get_test_text(5)),

('BIO-20', 'Zoología y comportamiento animal', 
 'Diversidad animal y patrones de comportamiento', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'zoológico', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['animal_behavior', 'zoological_classification'], get_test_text(5)),

('BIO-21', 'Biología molecular avanzada', 
 'Técnicas moleculares y análisis genómico', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'molecular', 'aplicar', 'avanzado', 1.6, 5.0,
 ARRAY['molecular_techniques', 'genomic_analysis'], get_test_text(5)),

('BIO-22', 'Bioinformática y genómica', 
 'Análisis computacional de datos biológicos', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'computacional', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['bioinformatics', 'computational_biology'], get_test_text(5)),

('BIO-23', 'Medicina y farmacología', 
 'Principios médicos y acción de fármacos', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'evaluar-reflexionar'], 
 'contemporáneo', 'universal', 'médico', 'analizar', 'avanzado', 1.4, 4.0,
 ARRAY['medical_principles', 'pharmacology'], get_test_text(5)),

('BIO-24', 'Bioética y responsabilidad científica', 
 'Aspectos éticos de la investigación biológica', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['argumentar-comunicar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'ético', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['bioethics', 'scientific_responsibility'], get_test_text(5)),

('BIO-25', 'Investigación científica en biología', 
 'Metodología científica y diseño experimental', 
 'CIENCIAS', get_skill_text('argumentar-comunicar'), 
 ARRAY['evaluar-reflexionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'metodológico', 'crear', 'avanzado', 1.5, 4.5,
 ARRAY['scientific_method', 'experimental_design'], get_test_text(5)),

-- QUÍMICA (7 nodos: QUI-01 a QUI-07)
('QUI-01', 'Estructura atómica y tabla periódica', 
 'Organización de los elementos y propiedades periódicas', 
 'CIENCIAS', get_skill_text('localizar-informacion'), 
 ARRAY['interpretar-relacionar', 'analizar-sintetizar'], 
 'contemporáneo', 'universal', 'atómico', 'comprender', 'básico', 1.0, 2.5,
 ARRAY['atomic_structure', 'periodic_trends'], get_test_text(5)),

('QUI-02', 'Enlaces químicos y geometría molecular', 
 'Tipos de enlaces y estructura tridimensional', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'molecular', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['chemical_bonding', 'molecular_geometry'], get_test_text(5)),

('QUI-03', 'Estequiometría y reacciones químicas', 
 'Cálculos químicos y balanceo de ecuaciones', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'modelar'], 
 'contemporáneo', 'universal', 'cuantitativo', 'aplicar', 'intermedio', 1.4, 4.0,
 ARRAY['stoichiometry', 'chemical_calculations'], get_test_text(5)),

('QUI-04', 'Termodinámica y cinética química', 
 'Energía en reacciones y velocidad de reacción', 
 'CIENCIAS', get_skill_text('analizar-sintetizar'), 
 ARRAY['interpretar-relacionar', 'resolver-problemas'], 
 'contemporáneo', 'universal', 'energético', 'analizar', 'avanzado', 1.5, 4.5,
 ARRAY['thermodynamics', 'reaction_kinetics'], get_test_text(5)),

('QUI-05', 'Equilibrio químico y ácido-base', 
 'Sistemas en equilibrio y teorías ácido-base', 
 'CIENCIAS', get_skill_text('resolver-problemas'), 
 ARRAY['analizar-sintetizar', 'interpretar-relacionar'], 
 'contemporáneo', 'universal', 'equilibrio', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['chemical_equilibrium', 'acid_base_theory'], get_test_text(5)),

('QUI-06', 'Química orgánica básica', 
 'Compuestos del carbono y grupos funcionales', 
 'CIENCIAS', get_skill_text('interpretar-relacionar'), 
 ARRAY['analizar-sintetizar', 'localizar-informacion'], 
 'contemporáneo', 'universal', 'orgánico', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['organic_chemistry', 'functional_groups'], get_test_text(5)),

('QUI-07', 'Química ambiental y sustentabilidad', 
 'Impacto químico en el medio ambiente', 
 'CIENCIAS', get_skill_text('evaluar-reflexionar'), 
 ARRAY['analizar-sintetizar', 'argumentar-comunicar'], 
 'contemporáneo', 'universal', 'ambiental', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['environmental_chemistry', 'green_chemistry'], get_test_text(5))

ON CONFLICT (code) DO NOTHING;

-- PASO 3: Verificar la implementación
SELECT 'Verificando implementación de nodos de Ciencias Parte 1...' as status;

-- Contar nodos insertados
SELECT COUNT(*) as nodos_insertados 
FROM learning_nodes 
WHERE subject = 'CIENCIAS';

-- Verificar distribución por área temática
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
SELECT 'CIENCIAS PARTE 1 - 32 NODOS IMPLEMENTADOS CORRECTAMENTE' as resultado;
SELECT 'Biología (25) + Química (7) = 32 nodos' as detalle;
SELECT 'Sistema sin FK - Códigos TEXT estables' as conversion;

-- =====================================================
-- FIN DEL SCRIPT - 32 NODOS DE CIENCIAS PARTE 1
-- =====================================================