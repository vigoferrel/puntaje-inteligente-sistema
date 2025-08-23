-- SCRIPT PARA INSERTAR DATOS DE PRUEBA CON UUIDs VÁLIDOS
-- Ejecutar en el SQL Editor de Supabase

-- Insertar preferencias para usuario de emergencia
INSERT INTO user_preferences (user_id, difficulty, focus_skills, study_time_minutes, notifications_enabled, music_enabled, theme_preference, language) VALUES
('00000000-0000-0000-0000-000000000001', 'auto', '[]', 30, true, true, 'light', 'es')
ON CONFLICT (user_id) DO NOTHING;

-- Insertar progreso inicial para todas las asignaturas PAES
INSERT INTO user_progress (user_id, subject_id, progress, total_exercises, correct_answers, average_score, time_studied_minutes, last_studied, weak_areas, strong_areas) VALUES
('00000000-0000-0000-0000-000000000001', 'MATEMATICA_M1', 0, 0, 0, 0, 0, NOW(), '{}', '{}'),
('00000000-0000-0000-0000-000000000001', 'MATEMATICA_M2', 0, 0, 0, 0, 0, NOW(), '{}', '{}'),
('00000000-0000-0000-0000-000000000001', 'COMPETENCIA_LECTORA', 0, 0, 0, 0, 0, NOW(), '{}', '{}'),
('00000000-0000-0000-0000-000000000001', 'CIENCIAS', 0, 0, 0, 0, 0, NOW(), '{}', '{}'),
('00000000-0000-0000-0000-000000000001', 'HISTORIA', 0, 0, 0, 0, 0, NOW(), '{}', '{}')
ON CONFLICT (user_id, subject_id) DO NOTHING;

-- Insertar algunos ejercicios de ejemplo
INSERT INTO exercise_bank (subject_id, bloom_level_id, question, question_type, options, correct_answer, explanation, difficulty_level, estimated_time_seconds, tags, is_official) VALUES
('MATEMATICA_M1', 'remember', '¿Cuál es la fórmula del área de un círculo?', 'multiple_choice', '["A = πr²", "A = 2πr", "A = πd", "A = r²"]', 'A = πr²', 'El área de un círculo se calcula multiplicando π por el radio al cuadrado.', 1, 30, ARRAY['geometría', 'área'], false),
('MATEMATICA_M1', 'apply', 'Calcula el área de un círculo con radio 5 cm.', 'multiple_choice', '["25π cm²", "10π cm²", "50π cm²", "5π cm²"]', '25π cm²', 'A = πr² = π(5)² = 25π cm²', 2, 45, ARRAY['geometría', 'cálculo'], false),
('COMPETENCIA_LECTORA', 'understand', '¿Cuál es la idea principal del siguiente texto?', 'multiple_choice', '["Opción A", "Opción B", "Opción C", "Opción D"]', 'Opción A', 'La idea principal es...', 2, 60, ARRAY['comprensión', 'análisis'], false)
ON CONFLICT DO NOTHING;

-- Verificar datos insertados
SELECT 'user_preferences' as tabla, COUNT(*) as registros FROM user_preferences WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'user_progress', COUNT(*) FROM user_progress WHERE user_id = '00000000-0000-0000-0000-000000000001'
UNION ALL
SELECT 'exercise_bank', COUNT(*) FROM exercise_bank;
