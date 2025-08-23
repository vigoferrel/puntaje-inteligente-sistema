-- DATOS DE EJEMPLO PARA TESTING
-- Insertar datos de muestra para validar el sistema

-- Nodos de ejemplo (Tier 1 - Criticos)
INSERT INTO neural_nodes (id, name, tier, skill, subject, paes_value, target_mastery, difficulty_level, bloom_level) VALUES
('CL_COMPRENSION_BASICA', 'Comprension Lectora Basica', 1, 'TRACK_LOCATE', 'COMPETENCIA_LECTORA', 15.2, 85, 'BASIC', 'UNDERSTAND'),
('MAT1_ALGEBRA_LINEAL', 'Algebra Lineal', 1, 'SOLVE_PROBLEMS', 'MATEMATICA_1', 12.8, 85, 'INTERMEDIATE', 'APPLY'),
('MAT1_ECUACIONES_CUADRATICAS', 'Ecuaciones Cuadraticas', 1, 'SOLVE_PROBLEMS', 'MATEMATICA_1', 12.5, 85, 'INTERMEDIATE', 'APPLY'),
('CL_INFERENCIAS', 'Inferencias y Deducciones', 1, 'INTERPRET_RELATE', 'COMPETENCIA_LECTORA', 14.8, 85, 'INTERMEDIATE', 'ANALYZE'),
('MAT1_FUNCIONES_LINEALES', 'Funciones Lineales', 1, 'REPRESENT', 'MATEMATICA_1', 11.9, 85, 'BASIC', 'APPLY');

-- Progreso de usuario de ejemplo
INSERT INTO user_node_progress (user_id, node_id, mastery_level, evidences, time_spent, exercises_completed, success_rate) VALUES
('demo-user', 'MAT1_ALGEBRA_LINEAL', 92, ARRAY['15 ejercicios perfectos', '3 simulaciones exitosas'], 240, 20, 95.0),
('demo-user', 'CL_COMPRENSION_BASICA', 75, ARRAY['5 ejercicios completados', '2 simulaciones exitosas'], 180, 12, 83.0),
('demo-user', 'MAT1_ECUACIONES_CUADRATICAS', 73, ARRAY['8 ejercicios completados', '1 simulacion'], 150, 10, 78.0);

-- Datos historicos de ejemplo
INSERT INTO historical_paes_data (user_id, paes_score, node_mastery_data, exam_date, preparation_days) VALUES
('historical-user-1', 720, '{"MAT1_ALGEBRA_LINEAL": 90, "CL_COMPRENSION_BASICA": 85, "MAT1_ECUACIONES_CUADRATICAS": 80}', '2024-11-15', 45),
('historical-user-2', 680, '{"MAT1_ALGEBRA_LINEAL": 75, "CL_COMPRENSION_BASICA": 70, "MAT1_ECUACIONES_CUADRATICAS": 65}', '2024-11-15', 30),
('historical-user-3', 750, '{"MAT1_ALGEBRA_LINEAL": 95, "CL_COMPRENSION_BASICA": 90, "MAT1_ECUACIONES_CUADRATICAS": 88}', '2024-11-15', 60);

-- Factores de rendimiento de ejemplo
INSERT INTO user_performance_factors (user_id, personal_factor, learning_velocity, consistency_factor) VALUES
('demo-user', 1.1, 1.2, 0.9);
