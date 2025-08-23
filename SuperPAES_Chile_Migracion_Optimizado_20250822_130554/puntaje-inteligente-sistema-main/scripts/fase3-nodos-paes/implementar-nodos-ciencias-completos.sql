-- =====================================================
-- IMPLEMENTACIÓN COMPLETA DE NODOS DE CIENCIAS
-- 65 nodos: 25 Biología + 20 Química + 20 Física
-- Tiempo estimado: 18-22 minutos
-- =====================================================

-- PASO 1: Verificar que la tabla learning_nodes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'learning_nodes') THEN
        RAISE EXCEPTION 'Tabla learning_nodes no existe. Ejecutar primero la creación de estructura de BD.';
    END IF;
END $$;

-- PASO 2: Insertar nodos de Biología (25 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- Biología Celular y Molecular (8 nodos)
('BIO-01', 'Estructura y función celular', 
 'Analiza la estructura de células procariotas y eucariotas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['cell_structure_analysis', 'microscopy_interpretation'], 5),

('BIO-02', 'Membrana plasmática y transporte', 
 'Examina los mecanismos de transporte a través de membranas', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['transport_mechanisms', 'membrane_analysis'], 5),

('BIO-03', 'Metabolismo celular básico', 
 'Comprende los procesos de respiración celular y fotosíntesis', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.3, 3.8,
 ARRAY['metabolic_processes', 'energy_transformation'], 5),

('BIO-04', 'División celular: mitosis y meiosis', 
 'Analiza los procesos de división celular y su importancia', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['cell_division_analysis', 'chromosome_behavior'], 5),

('BIO-05', 'Síntesis de proteínas', 
 'Examina los procesos de transcripción y traducción', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'avanzado', 1.4, 4.0,
 ARRAY['protein_synthesis', 'genetic_code'], 5),

('BIO-06', 'Estructura del ADN y ARN', 
 'Analiza la estructura y función de ácidos nucleicos', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.2, 3.0,
 ARRAY['nucleic_acid_structure', 'molecular_analysis'], 5),

('BIO-07', 'Enzimas y catálisis biológica', 
 'Comprende el funcionamiento de enzimas en procesos biológicos', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'aplicar', 'intermedio', 1.3, 3.5,
 ARRAY['enzyme_function', 'catalysis_analysis'], 5),

('BIO-08', 'Regulación génica básica', 
 'Examina mecanismos básicos de regulación de la expresión génica', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'avanzado', 1.4, 4.2,
 ARRAY['gene_regulation', 'expression_control'], 5),

-- Genética (5 nodos)
('BIO-09', 'Leyes de Mendel', 
 'Aplica las leyes de la herencia mendeliana', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'aplicar', 'intermedio', 1.2, 3.2,
 ARRAY['mendelian_genetics', 'inheritance_patterns'], 5),

('BIO-10', 'Herencia ligada al sexo', 
 'Analiza patrones de herencia ligados a cromosomas sexuales', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['sex_linked_inheritance', 'genetic_analysis'], 5),

('BIO-11', 'Mutaciones y variabilidad genética', 
 'Examina tipos de mutaciones y su impacto en la variabilidad', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['mutation_analysis', 'genetic_variation'], 5),

('BIO-12', 'Biotecnología básica', 
 'Comprende aplicaciones básicas de la biotecnología', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.1, 3.0,
 ARRAY['biotechnology_applications', 'genetic_engineering'], 5),

('BIO-13', 'Genética de poblaciones', 
 'Analiza la distribución de alelos en poblaciones', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['population_genetics', 'allele_frequency'], 5),

-- Evolución y Diversidad (4 nodos)
('BIO-14', 'Teoría de la evolución', 
 'Comprende los mecanismos de la evolución biológica', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['evolution_theory', 'natural_selection'], 5),

('BIO-15', 'Especiación y filogenia', 
 'Analiza procesos de especiación y relaciones filogenéticas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['speciation_analysis', 'phylogenetic_trees'], 5),

('BIO-16', 'Biodiversidad y clasificación', 
 'Examina la diversidad biológica y sistemas de clasificación', 
 'CIENCIAS', 'observar-describir', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'básico', 1.1, 2.8,
 ARRAY['biodiversity_analysis', 'taxonomic_classification'], 5),

('BIO-17', 'Adaptaciones evolutivas', 
 'Analiza adaptaciones morfológicas y fisiológicas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'intermedio', 1.2, 3.5,
 ARRAY['evolutionary_adaptations', 'morphological_analysis'], 5),

-- Ecología (4 nodos)
('BIO-18', 'Ecosistemas y flujo de energía', 
 'Analiza el flujo de energía en ecosistemas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['ecosystem_analysis', 'energy_flow'], 5),

('BIO-19', 'Ciclos biogeoquímicos', 
 'Examina los ciclos del carbono, nitrógeno y fósforo', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['biogeochemical_cycles', 'nutrient_cycling'], 5),

('BIO-20', 'Relaciones interespecíficas', 
 'Analiza tipos de relaciones entre especies', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['species_interactions', 'ecological_relationships'], 5),

('BIO-21', 'Impacto humano en ecosistemas', 
 'Evalúa el impacto de actividades humanas en ecosistemas', 
 'CIENCIAS', 'evaluar-argumentar', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'evaluar', 'avanzado', 1.4, 4.0,
 ARRAY['environmental_impact', 'human_ecology'], 5),

-- Fisiología (4 nodos)
('BIO-22', 'Sistema circulatorio', 
 'Analiza la estructura y función del sistema circulatorio', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['circulatory_system', 'physiological_analysis'], 5),

('BIO-23', 'Sistema nervioso', 
 'Examina la estructura y función del sistema nervioso', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['nervous_system', 'neural_function'], 5),

('BIO-24', 'Homeostasis y regulación', 
 'Comprende mecanismos de homeostasis en organismos', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['homeostasis_mechanisms', 'regulatory_systems'], 5),

('BIO-25', 'Sistema inmunológico', 
 'Analiza los mecanismos de defensa del organismo', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'biological', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['immune_system', 'defense_mechanisms'], 5);

-- PASO 3: Insertar nodos de Química (20 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- Estructura Atómica y Tabla Periódica (5 nodos)
('QUI-01', 'Estructura atómica', 
 'Analiza la estructura del átomo y configuración electrónica', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['atomic_structure', 'electron_configuration'], 5),

('QUI-02', 'Tabla periódica y propiedades', 
 'Relaciona posición en tabla periódica con propiedades', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'analizar', 'intermedio', 1.2, 3.0,
 ARRAY['periodic_trends', 'elemental_properties'], 5),

('QUI-03', 'Enlaces químicos', 
 'Analiza tipos de enlaces y sus propiedades', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.3, 3.5,
 ARRAY['chemical_bonding', 'molecular_structure'], 5),

('QUI-04', 'Geometría molecular', 
 'Predice formas moleculares usando teoría VSEPR', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['molecular_geometry', 'vsepr_theory'], 5),

('QUI-05', 'Fuerzas intermoleculares', 
 'Examina fuerzas entre moléculas y sus efectos', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['intermolecular_forces', 'physical_properties'], 5),

-- Estequiometría y Reacciones (5 nodos)
('QUI-06', 'Estequiometría básica', 
 'Calcula cantidades en reacciones químicas', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'intermedio', 1.3, 3.8,
 ARRAY['stoichiometric_calculations', 'mole_concept'], 5),

('QUI-07', 'Tipos de reacciones químicas', 
 'Clasifica y predice productos de reacciones', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'analizar', 'intermedio', 1.2, 3.2,
 ARRAY['reaction_types', 'product_prediction'], 5),

('QUI-08', 'Balanceo de ecuaciones', 
 'Balancea ecuaciones químicas complejas', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'básico', 1.1, 2.8,
 ARRAY['equation_balancing', 'conservation_laws'], 5),

('QUI-09', 'Reactivo limitante', 
 'Identifica reactivo limitante y calcula rendimientos', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'avanzado', 1.4, 4.2,
 ARRAY['limiting_reagent', 'yield_calculations'], 5),

('QUI-10', 'Concentraciones y soluciones', 
 'Calcula concentraciones y prepara soluciones', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['solution_concentration', 'dilution_calculations'], 5),

-- Termodinámica y Cinética (5 nodos)
('QUI-11', 'Termoquímica básica', 
 'Calcula cambios de entalpía en reacciones', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['enthalpy_calculations', 'thermochemistry'], 5),

('QUI-12', 'Cinética química', 
 'Analiza velocidades de reacción y factores que las afectan', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'aplicar-calcular'], 
 'contemporáneo', 'universal', 'chemical', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['reaction_kinetics', 'rate_analysis'], 5),

('QUI-13', 'Equilibrio químico', 
 'Aplica principios de equilibrio químico', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'avanzado', 1.5, 4.5,
 ARRAY['chemical_equilibrium', 'le_chatelier_principle'], 5),

('QUI-14', 'Ácidos y bases', 
 'Analiza propiedades de ácidos y bases', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'analizar', 'intermedio', 1.3, 3.5,
 ARRAY['acid_base_analysis', 'ph_calculations'], 5),

('QUI-15', 'Electroquímica básica', 
 'Comprende procesos electroquímicos básicos', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'aplicar-calcular'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'avanzado', 1.3, 3.8,
 ARRAY['electrochemistry', 'redox_reactions'], 5),

-- Química Orgánica (5 nodos)
('QUI-16', 'Hidrocarburos', 
 'Analiza estructura y propiedades de hidrocarburos', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['hydrocarbon_analysis', 'organic_structure'], 5),

('QUI-17', 'Grupos funcionales', 
 'Identifica y analiza grupos funcionales orgánicos', 
 'CIENCIAS', 'observar-describir', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.1, 3.0,
 ARRAY['functional_groups', 'organic_identification'], 5),

('QUI-18', 'Isomería', 
 'Analiza tipos de isomería en compuestos orgánicos', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['isomerism_analysis', 'structural_comparison'], 5),

('QUI-19', 'Reacciones orgánicas básicas', 
 'Examina mecanismos de reacciones orgánicas simples', 
 'CIENCIAS', 'explicar-predecir', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'chemical', 'aplicar', 'avanzado', 1.4, 4.2,
 ARRAY['organic_reactions', 'mechanism_analysis'], 5),

('QUI-20', 'Biomoléculas', 
 'Analiza estructura de carbohidratos, lípidos y proteínas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['observar-describir', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'chemical', 'comprender', 'intermedio', 1.2, 3.5,
 ARRAY['biomolecule_analysis', 'biochemical_structure'], 5);

-- PASO 4: Insertar nodos de Física (20 nodos)
INSERT INTO learning_nodes (
    code, name, description, subject, primary_skill, secondary_skills,
    historical_period, geographical_scope, thematic_area, bloom_level, 
    difficulty, weight, average_time_minutes, question_types, test_id
) VALUES
-- Mecánica (7 nodos)
('FIS-01', 'Cinemática en una dimensión', 
 'Analiza movimiento rectilíneo uniforme y uniformemente acelerado', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'básico', 1.1, 3.0,
 ARRAY['kinematic_calculations', 'motion_analysis'], 5),

('FIS-02', 'Cinemática en dos dimensiones', 
 'Resuelve problemas de movimiento parabólico y circular', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.3, 3.8,
 ARRAY['projectile_motion', 'circular_motion'], 5),

('FIS-03', 'Leyes de Newton', 
 'Aplica las leyes de Newton a problemas de dinámica', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.3, 3.5,
 ARRAY['newton_laws', 'force_analysis'], 5),

('FIS-04', 'Trabajo y energía', 
 'Analiza trabajo, energía cinética y potencial', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.2, 3.2,
 ARRAY['energy_calculations', 'work_analysis'], 5),

('FIS-05', 'Conservación de la energía', 
 'Aplica principios de conservación en sistemas mecánicos', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['energy_conservation', 'mechanical_systems'], 5),

('FIS-06', 'Momento lineal y colisiones', 
 'Analiza conservación del momento en colisiones', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'avanzado', 1.3, 3.8,
 ARRAY['momentum_conservation', 'collision_analysis'], 5),

('FIS-07', 'Rotación y momento angular', 
 'Examina dinámica rotacional y conservación del momento angular', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'avanzado', 1.4, 4.2,
 ARRAY['rotational_dynamics', 'angular_momentum'], 5),

-- Termodinámica (3 nodos)
('FIS-08', 'Temperatura y calor', 
 'Analiza conceptos de temperatura, calor y capacidad calorífica', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'comprender', 'básico', 1.1, 3.0,
 ARRAY['heat_calculations', 'temperature_analysis'], 5),

('FIS-09', 'Leyes de la termodinámica', 
 'Aplica las leyes de la termodinámica a sistemas simples', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'avanzado', 1.4, 4.0,
 ARRAY['thermodynamic_laws', 'system_analysis'], 5),

('FIS-10', 'Gases ideales', 
 'Analiza comportamiento de gases usando leyes de gases', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['gas_laws', 'ideal_gas_analysis'], 5),

-- Ondas y Sonido (3 nodos)
('FIS-11', 'Ondas mecánicas', 
 'Analiza propiedades de ondas mecánicas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['wave_analysis', 'mechanical_waves'], 5),

('FIS-12', 'Sonido y acústica', 
 'Examina propiedades del sonido y fenómenos acústicos', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'observar-describir'], 
 'contemporáneo', 'universal', 'physical', 'comprender', 'intermedio', 1.1, 3.0,
 ARRAY['sound_analysis', 'acoustic_phenomena'], 5),

('FIS-13', 'Interferencia y resonancia', 
 'Analiza fenómenos de interferencia y resonancia', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'aplicar-calcular'], 
 'contemporáneo', 'universal', 'physical', 'analizar', 'avanzado', 1.3, 3.8,
 ARRAY['interference_analysis', 'resonance_phenomena'], 5),

-- Electricidad y Magnetismo (4 nodos)
('FIS-14', 'Electrostática', 
 'Analiza fuerzas y campos eléctricos estáticos', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo
', 'universal', 'physical', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['electrostatic_analysis', 'electric_field'], 5),

('FIS-15', 'Corriente eléctrica', 
 'Analiza circuitos eléctricos básicos y ley de Ohm', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.3, 3.8,
 ARRAY['circuit_analysis', 'ohm_law'], 5),

('FIS-16', 'Magnetismo', 
 'Examina campos magnéticos y fuerzas magnéticas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'comprender', 'intermedio', 1.2, 3.2,
 ARRAY['magnetic_analysis', 'magnetic_force'], 5),

('FIS-17', 'Inducción electromagnética', 
 'Analiza fenómenos de inducción electromagnética', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['aplicar-calcular', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'analizar', 'avanzado', 1.4, 4.0,
 ARRAY['electromagnetic_induction', 'faraday_law'], 5),

-- Óptica (3 nodos)
('FIS-18', 'Reflexión y refracción', 
 'Analiza leyes de reflexión y refracción de la luz', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'observar-describir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'básico', 1.1, 3.0,
 ARRAY['optics_calculations', 'light_behavior'], 5),

('FIS-19', 'Lentes y espejos', 
 'Resuelve problemas con lentes y espejos', 
 'CIENCIAS', 'aplicar-calcular', 
 ARRAY['analizar-interpretar', 'explicar-predecir'], 
 'contemporáneo', 'universal', 'physical', 'aplicar', 'intermedio', 1.2, 3.5,
 ARRAY['lens_calculations', 'mirror_analysis'], 5),

('FIS-20', 'Ondas electromagnéticas', 
 'Examina propiedades de ondas electromagnéticas', 
 'CIENCIAS', 'analizar-interpretar', 
 ARRAY['explicar-predecir', 'observar-describir'], 
 'contemporáneo', 'universal', 'physical', 'comprender', 'avanzado', 1.3, 3.8,
 ARRAY['electromagnetic_waves', 'wave_properties'], 5);

-- PASO 5: Verificar la implementación
SELECT 'Verificando implementación de nodos de Ciencias...' as status;

-- Contar nodos por disciplina
SELECT 
    CASE 
        WHEN code LIKE 'BIO-%' THEN 'Biología'
        WHEN code LIKE 'QUI-%' THEN 'Química'
        WHEN code LIKE 'FIS-%' THEN 'Física'
    END as disciplina,
    COUNT(*) as total_nodos,
    ROUND(AVG(weight), 2) as peso_promedio,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY 
    CASE 
        WHEN code LIKE 'BIO-%' THEN 'Biología'
        WHEN code LIKE 'QUI-%' THEN 'Química'
        WHEN code LIKE 'FIS-%' THEN 'Física'
    END
ORDER BY total_nodos DESC;

-- Verificar distribución por dificultad
SELECT 
    difficulty,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM learning_nodes WHERE subject = 'CIENCIAS')), 2) as porcentaje
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'básico' THEN 1 
        WHEN 'intermedio' THEN 2 
        WHEN 'avanzado' THEN 3 
    END;

-- Verificar distribución por habilidades primarias
SELECT 
    primary_skill,
    COUNT(*) as cantidad,
    ROUND(AVG(weight), 2) as peso_promedio
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY primary_skill
ORDER BY cantidad DESC;

-- Verificar distribución por área temática (thematic_area)
SELECT 
    thematic_area,
    COUNT(*) as cantidad,
    ROUND(AVG(average_time_minutes), 1) as tiempo_promedio
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY thematic_area
ORDER BY cantidad DESC;

-- Verificar distribución por nivel de Bloom
SELECT 
    bloom_level,
    COUNT(*) as cantidad,
    ROUND(AVG(weight), 2) as peso_promedio
FROM learning_nodes 
WHERE subject = 'CIENCIAS'
GROUP BY bloom_level
ORDER BY 
    CASE bloom_level 
        WHEN 'recordar' THEN 1 
        WHEN 'comprender' THEN 2 
        WHEN 'aplicar' THEN 3 
        WHEN 'analizar' THEN 4 
        WHEN 'evaluar' THEN 5 
        WHEN 'crear' THEN 6 
    END;

-- PASO 6: Actualizar estadísticas
ANALYZE learning_nodes;

-- PASO 7: Mensaje final
SELECT 
    'IMPLEMENTACIÓN COMPLETA DE NODOS DE CIENCIAS' as resultado,
    COUNT(*) as total_nodos_implementados
FROM learning_nodes 
WHERE subject = 'CIENCIAS';

SELECT 'Distribución de nodos implementados:' as detalle;
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'BIO-%' THEN 1 END) || ' nodos de Biología (BIO-01 a BIO-25)' as bio_nodos
FROM learning_nodes WHERE subject = 'CIENCIAS'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'QUI-%' THEN 1 END) || ' nodos de Química (QUI-01 a QUI-20)' as qui_nodos
FROM learning_nodes WHERE subject = 'CIENCIAS'
UNION ALL
SELECT 
    '- ' || COUNT(CASE WHEN code LIKE 'FIS-%' THEN 1 END) || ' nodos de Física (FIS-01 a FIS-20)' as fis_nodos
FROM learning_nodes WHERE subject = 'CIENCIAS';

-- Estadísticas detalladas por disciplina
SELECT 'Estadísticas detalladas por área de Biología:' as bio_detalle;
SELECT 
    CASE 
        WHEN code <= 'BIO-08' THEN 'Biología Celular y Molecular'
        WHEN code >= 'BIO-09' AND code <= 'BIO-13' THEN 'Genética'
        WHEN code >= 'BIO-14' AND code <= 'BIO-17' THEN 'Evolución y Diversidad'
        WHEN code >= 'BIO-18' AND code <= 'BIO-21' THEN 'Ecología'
        WHEN code >= 'BIO-22' THEN 'Fisiología'
    END as area_bio,
    COUNT(*) as nodos
FROM learning_nodes 
WHERE code LIKE 'BIO-%'
GROUP BY 
    CASE 
        WHEN code <= 'BIO-08' THEN 'Biología Celular y Molecular'
        WHEN code >= 'BIO-09' AND code <= 'BIO-13' THEN 'Genética'
        WHEN code >= 'BIO-14' AND code <= 'BIO-17' THEN 'Evolución y Diversidad'
        WHEN code >= 'BIO-18' AND code <= 'BIO-21' THEN 'Ecología'
        WHEN code >= 'BIO-22' THEN 'Fisiología'
    END
ORDER BY nodos DESC;

-- =====================================================
-- FIN DEL SCRIPT - 65 NODOS DE CIENCIAS IMPLEMENTADOS
-- =====================================================