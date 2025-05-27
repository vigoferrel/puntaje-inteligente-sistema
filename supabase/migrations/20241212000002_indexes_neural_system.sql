
-- FASE 2B: ÍNDICES ESPECIALIZADOS PARA SISTEMA NEURAL
-- Optimiza consultas en tiempo real del Neural System v3.0

-- Índices compuestos para consultas temporales
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_user_timestamp 
ON neural_events(user_id, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_type_timestamp 
ON neural_events(event_type, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_component_timestamp 
ON neural_events(component_source, timestamp DESC);

-- Índices para métricas neurales
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_metrics_user_dimension 
ON neural_metrics(user_id, dimension_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_metrics_calculated_at 
ON neural_metrics(last_calculated_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_metrics_type_trend 
ON neural_metrics(metric_type, trend);

-- Índices para sesiones de telemetría
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_telemetry_sessions_user_start 
ON neural_telemetry_sessions(user_id, session_start DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_telemetry_sessions_quality 
ON neural_telemetry_sessions(session_quality DESC);
