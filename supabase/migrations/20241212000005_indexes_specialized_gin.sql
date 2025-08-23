
-- FASE 2E: ÍNDICES ESPECIALIZADOS GIN Y JSONB
-- Optimiza búsquedas en arrays y datos JSON

-- GIN para arrays (Learning Nodes dependencies)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_learning_nodes_depends_on_gin 
ON learning_nodes USING GIN(depends_on);

-- JSONB para metadatos y configuraciones
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_model_usage_metadata_gin 
ON ai_model_usage USING GIN(metadata);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_event_data_gin 
ON neural_events USING GIN(event_data);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_events_neural_metrics_gin 
ON neural_events USING GIN(neural_metrics);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_neural_metrics_metadata_gin 
ON neural_metrics USING GIN(metadata);

-- Calendar events metadata
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_metadata_gin 
ON calendar_events USING GIN(metadata);

-- Institutional settings and configurations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institutions_settings_gin 
ON institutions USING GIN(settings);
