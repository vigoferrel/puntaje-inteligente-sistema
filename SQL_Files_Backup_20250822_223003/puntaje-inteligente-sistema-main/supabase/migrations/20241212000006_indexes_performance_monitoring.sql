
-- FASE 2F: FUNCIONES DE MONITOREO DE PERFORMANCE
-- Sistema de análisis y optimización continua

-- Función para analizar performance de índices
CREATE OR REPLACE FUNCTION analyze_index_performance()
RETURNS TABLE(
  table_name TEXT,
  index_name TEXT,
  index_size TEXT,
  scans BIGINT,
  tuples_read BIGINT,
  tuples_fetched BIGINT,
  usage_efficiency NUMERIC
) LANGUAGE SQL SECURITY DEFINER AS $$
SELECT 
  schemaname||'.'||tablename as table_name,
  indexname as index_name,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched,
  CASE 
    WHEN idx_scan = 0 THEN 0 
    ELSE ROUND((idx_tup_fetch::NUMERIC / idx_tup_read::NUMERIC) * 100, 2) 
  END as usage_efficiency
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC, pg_relation_size(indexrelid) DESC;
$$;

-- Función para identificar consultas lentas
CREATE OR REPLACE FUNCTION identify_slow_queries()
RETURNS TABLE(
  query_text TEXT,
  calls BIGINT,
  total_time_ms NUMERIC,
  mean_time_ms NUMERIC,
  rows_returned BIGINT
) LANGUAGE SQL SECURITY DEFINER AS $$
SELECT 
  query,
  calls,
  ROUND(total_exec_time, 2) as total_time_ms,
  ROUND(mean_exec_time, 2) as mean_time_ms,
  rows
FROM pg_stat_statements 
WHERE mean_exec_time > 10
ORDER BY mean_exec_time DESC
LIMIT 20;
$$;

-- Función para estadísticas de performance neural
CREATE OR REPLACE FUNCTION neural_performance_stats()
RETURNS TABLE(
  metric_name TEXT,
  avg_response_time NUMERIC,
  total_events BIGINT,
  events_per_hour NUMERIC,
  top_components TEXT[]
) LANGUAGE SQL SECURITY DEFINER AS $$
SELECT 
  'neural_events_summary' as metric_name,
  AVG(EXTRACT(EPOCH FROM (timestamp - LAG(timestamp) OVER (ORDER BY timestamp)))) * 1000 as avg_response_time,
  COUNT(*) as total_events,
  COUNT(*) / EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) * 3600 as events_per_hour,
  ARRAY_AGG(DISTINCT component_source) as top_components
FROM neural_events 
WHERE timestamp > NOW() - INTERVAL '24 hours';
$$;

-- Actualizar estadísticas de tablas críticas
ANALYZE neural_events;
ANALYZE neural_metrics;
ANALYZE ai_conversation_sessions;
ANALYZE ai_model_usage;
ANALYZE learning_nodes;
ANALYZE exercises;
