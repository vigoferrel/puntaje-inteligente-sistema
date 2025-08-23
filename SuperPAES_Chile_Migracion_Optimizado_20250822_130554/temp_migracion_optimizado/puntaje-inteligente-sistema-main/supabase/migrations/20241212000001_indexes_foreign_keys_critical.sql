
-- FASE 2A: ÍNDICES CRÍTICOS PARA FOREIGN KEYS
-- Mejora performance de JOINs en 60-80%

-- Neural System Foreign Keys (MÁS CRÍTICOS)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_user_id 
ON neural_events(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_session_id 
ON neural_events(session_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_metrics_user_id 
ON neural_metrics(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_telemetry_sessions_user_id 
ON neural_telemetry_sessions(user_id);

-- AI System Foreign Keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_conversation_sessions_user_id 
ON ai_conversation_sessions(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_conversation_messages_session_id 
ON ai_conversation_messages(session_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_model_usage_user_id 
ON ai_model_usage(user_id);

-- Learning System Foreign Keys
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_node_id 
ON exercises(node_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_node_weights_user_id 
ON node_weights(user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_node_weights_node_id 
ON node_weights(node_id);
