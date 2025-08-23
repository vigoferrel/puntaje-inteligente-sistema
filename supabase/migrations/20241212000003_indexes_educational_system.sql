
-- FASE 2C: ÍNDICES PARA SISTEMA EDUCATIVO
-- Optimiza consultas de learning nodes y ejercicios

-- Learning Nodes - Índices compuestos principales
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_test_skill 
ON learning_nodes(test_id, skill_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_tier_difficulty 
ON learning_nodes(tier_priority, difficulty);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_subject_cognitive 
ON learning_nodes(subject_area, cognitive_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_tier_subject 
ON learning_nodes(tier_priority, subject_area);

-- Exercises - Índices para filtros frecuentes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_test_skill 
ON exercises(test_id, skill_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_difficulty_bloom 
ON exercises(difficulty, bloom_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_node_difficulty 
ON exercises(node_id, difficulty);

-- Generated Exercises - Índices para generación AI
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_exercises_prueba_skill 
ON generated_exercises(prueba_paes, skill_code);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_exercises_user_created 
ON generated_exercises(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_exercises_success_rate 
ON generated_exercises(success_rate DESC);
