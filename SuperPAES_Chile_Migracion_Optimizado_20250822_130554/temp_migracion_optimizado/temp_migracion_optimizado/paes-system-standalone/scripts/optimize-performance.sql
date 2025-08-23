-- =====================================================================================
-- SUPERPAES PERFORMANCE OPTIMIZATION SETUP
-- =====================================================================================
-- Script para crear índices optimizados y configurar monitoring de performance
-- según el Production Checklist de Supabase
-- =====================================================================================

BEGIN;

-- =====================================================================================
-- 1. HABILITAR pg_stat_statements PARA MONITOREO DE QUERIES
-- =====================================================================================

-- Habilitar extensión pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- =====================================================================================
-- 2. ÍNDICES PARA TABLA PROFILES (ACCESO FRECUENTE)
-- =====================================================================================

-- Índice principal por usuario (más crítico)
CREATE INDEX IF NOT EXISTS idx_profiles_id_btree ON public.profiles(id);

-- Índice para búsquedas por región y comuna (filtros demográficos)
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(region, comuna);

-- Índice para filtros académicos
CREATE INDEX IF NOT EXISTS idx_profiles_academic ON public.profiles(current_grade, graduation_year);

-- Índice para búsquedas por intereses profesionales
CREATE INDEX IF NOT EXISTS idx_profiles_interests ON public.profiles USING gin(career_interests);

-- Índice para target PAES score (reportes)
CREATE INDEX IF NOT EXISTS idx_profiles_target_score ON public.profiles(target_paes_score);

-- =====================================================================================
-- 3. ÍNDICES PARA TABLA NODE_PROGRESS (MUY CRÍTICO - ACCESO CONSTANTE)
-- =====================================================================================

-- Índice compuesto usuario + nodo (query más frecuente)
CREATE INDEX IF NOT EXISTS idx_node_progress_user_node ON public.node_progress(user_id, node_id);

-- Índice para reportes de progreso por usuario
CREATE INDEX IF NOT EXISTS idx_node_progress_user_updated ON public.node_progress(user_id, updated_at DESC);

-- Índice para búsqueda de nodos por score diagnóstico
CREATE INDEX IF NOT EXISTS idx_node_progress_diagnostic_score ON public.node_progress(diagnostic_score) 
WHERE diagnostic_score IS NOT NULL;

-- Índice para nodos practicados recientemente
CREATE INDEX IF NOT EXISTS idx_node_progress_recent ON public.node_progress(last_practiced DESC)
WHERE last_practiced IS NOT NULL;

-- =====================================================================================
-- 4. ÍNDICES PARA TABLA DIAGNOSTICS (REPORTES Y ANÁLISIS)
-- =====================================================================================

-- Índice compuesto usuario + materia
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_subject ON public.diagnostics(user_id, subject);

-- Índice para análisis temporal
CREATE INDEX IF NOT EXISTS idx_diagnostics_user_created ON public.diagnostics(user_id, created_at DESC);

-- Índice para análisis de performance por nodo
CREATE INDEX IF NOT EXISTS idx_diagnostics_node_score ON public.diagnostics(node_id, score)
WHERE node_id IS NOT NULL;

-- Índice para búsquedas por rango de puntuación
CREATE INDEX IF NOT EXISTS idx_diagnostics_score_range ON public.diagnostics(score)
WHERE score > 0;

-- =====================================================================================
-- 5. ÍNDICES PARA TABLA COMPLETED_EXERCISES (HISTÓRICO GRANDE)
-- =====================================================================================

-- Índice principal usuario + materia + fecha
CREATE INDEX IF NOT EXISTS idx_exercises_user_subject_date ON public.completed_exercises(user_id, subject, created_at DESC);

-- Índice para estadísticas por tópico
CREATE INDEX IF NOT EXISTS idx_exercises_topic_stats ON public.completed_exercises(topic, score);

-- Índice para análisis de tiempo invertido
CREATE INDEX IF NOT EXISTS idx_exercises_time_analysis ON public.completed_exercises(user_id, time_spent);

-- =====================================================================================
-- 6. ÍNDICES PARA TABLA COMPLETED_SIMULATIONS (RENDIMIENTO PAES)
-- =====================================================================================

-- Índice usuario + fecha para timeline
CREATE INDEX IF NOT EXISTS idx_simulations_user_timeline ON public.completed_simulations(user_id, created_at DESC);

-- Índice para análisis de mejora en simulaciones
CREATE INDEX IF NOT EXISTS idx_simulations_progress ON public.completed_simulations(user_id, score, created_at);

-- =====================================================================================
-- 7. ÍNDICES PARA TABLA STUDY_PLANS (PLANIFICACIÓN)
-- =====================================================================================

-- Índice usuario + estado
CREATE INDEX IF NOT EXISTS idx_study_plans_user_status ON public.study_plans(user_id, status);

-- Índice para planes con fecha objetivo
CREATE INDEX IF NOT EXISTS idx_study_plans_target ON public.study_plans(target_date)
WHERE target_date IS NOT NULL;

-- Índice para búsqueda por materias usando GIN
CREATE INDEX IF NOT EXISTS idx_study_plans_subjects ON public.study_plans USING gin(subjects);

-- =====================================================================================
-- 8. ÍNDICES PARA TABLA CRITICAL_NODES (SISTEMA EDUCATIVO)
-- =====================================================================================

-- Índice por materia y nivel (filtros principales)
CREATE INDEX IF NOT EXISTS idx_critical_nodes_subject_level ON public.critical_nodes(subject, level);

-- Índice para búsqueda por importancia
CREATE INDEX IF NOT EXISTS idx_critical_nodes_importance ON public.critical_nodes(importance DESC);

-- Índice para filtros por tipo de competencia
CREATE INDEX IF NOT EXISTS idx_critical_nodes_competency ON public.critical_nodes(competency_type, skill_type);

-- Índice para nodos certificables
CREATE INDEX IF NOT EXISTS idx_critical_nodes_certifiable ON public.critical_nodes(certifiable)
WHERE certifiable = true;

-- =====================================================================================
-- 9. ÍNDICES PARA TABLA NODE_RELATIONS (GRAFOS DE CONOCIMIENTO)
-- =====================================================================================

-- Índice para búsquedas desde nodo fuente
CREATE INDEX IF NOT EXISTS idx_node_relations_source ON public.node_relations(source_node_id);

-- Índice para búsquedas hacia nodo destino
CREATE INDEX IF NOT EXISTS idx_node_relations_target ON public.node_relations(target_node_id);

-- Índice para relaciones por tipo y fuerza
CREATE INDEX IF NOT EXISTS idx_node_relations_type_strength ON public.node_relations(relation_type, strength DESC);

-- =====================================================================================
-- 10. ÍNDICES PARA TABLA NODE_RESOURCES (CONTENIDO EDUCATIVO)
-- =====================================================================================

-- Índice por nodo y tipo de recurso
CREATE INDEX IF NOT EXISTS idx_node_resources_node_type ON public.node_resources(node_id, resource_type);

-- Índice para recursos premium
CREATE INDEX IF NOT EXISTS idx_node_resources_premium ON public.node_resources(is_premium, resource_type);

-- =====================================================================================
-- 11. ÍNDICES PARA TABLA CERTIFICATIONS (LOGROS)
-- =====================================================================================

-- Índice usuario + fecha de logro
CREATE INDEX IF NOT EXISTS idx_certifications_user_achieved ON public.certifications(user_id, achieved_at DESC);

-- Índice por materia y nivel
CREATE INDEX IF NOT EXISTS idx_certifications_subject_level ON public.certifications(subject, level)
WHERE subject IS NOT NULL;

-- =====================================================================================
-- 12. ÍNDICES PARA TABLA EMAIL_LOGS (AUDITORÍA)
-- =====================================================================================

-- Índice usuario + tipo de reporte
CREATE INDEX IF NOT EXISTS idx_email_logs_user_type ON public.email_logs(user_id, report_type);

-- Índice para logs por estado
CREATE INDEX IF NOT EXISTS idx_email_logs_status_sent ON public.email_logs(status, sent_at)
WHERE sent_at IS NOT NULL;

-- =====================================================================================
-- 13. ÍNDICES PARA TABLA GENERATED_REPORTS (REPORTERÍA)
-- =====================================================================================

-- Índice usuario + tipo + fecha
CREATE INDEX IF NOT EXISTS idx_reports_user_type_date ON public.generated_reports(user_id, report_type, created_at DESC);

-- =====================================================================================
-- 14. FUNCIONES PARA MONITOREO DE PERFORMANCE
-- =====================================================================================

-- Función para obtener queries más lentas
CREATE OR REPLACE FUNCTION get_slow_queries(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    query TEXT,
    calls BIGINT,
    total_time DOUBLE PRECISION,
    mean_time DOUBLE PRECISION,
    rows BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pss.query,
        pss.calls,
        pss.total_exec_time as total_time,
        pss.mean_exec_time as mean_time,
        pss.rows
    FROM pg_stat_statements pss
    ORDER BY pss.mean_exec_time DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de índices
CREATE OR REPLACE FUNCTION get_index_usage()
RETURNS TABLE(
    schemaname TEXT,
    tablename TEXT,
    indexname TEXT,
    idx_tup_read BIGINT,
    idx_tup_fetch BIGINT,
    usage_ratio NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        psi.schemaname::TEXT,
        psi.relname::TEXT as tablename,
        psi.indexrelname::TEXT as indexname,
        psi.idx_tup_read,
        psi.idx_tup_fetch,
        CASE 
            WHEN psi.idx_tup_read > 0 
            THEN round((psi.idx_tup_fetch::numeric / psi.idx_tup_read::numeric) * 100, 2)
            ELSE 0 
        END as usage_ratio
    FROM pg_stat_user_indexes psi
    WHERE psi.schemaname = 'public'
    ORDER BY usage_ratio DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para análisis de tamaño de tablas
CREATE OR REPLACE FUNCTION get_table_sizes()
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    total_size TEXT,
    index_size TEXT,
    table_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        t.n_tup_ins + t.n_tup_upd + t.n_tup_del as row_count,
        pg_size_pretty(pg_total_relation_size(c.oid)) as total_size,
        pg_size_pretty(pg_indexes_size(c.oid)) as index_size,
        pg_size_pretty(pg_relation_size(c.oid)) as table_size
    FROM pg_stat_user_tables t
    JOIN pg_class c ON c.relname = t.relname
    WHERE t.schemaname = 'public'
    ORDER BY pg_total_relation_size(c.oid) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================================
-- 15. CONFIGURAR VACUUM Y ANALYZE AUTOMÁTICO
-- =====================================================================================

-- Configurar autovacuum para tablas con alta actividad
ALTER TABLE public.node_progress SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE public.completed_exercises SET (
    autovacuum_vacuum_scale_factor = 0.2,
    autovacuum_analyze_scale_factor = 0.1
);

ALTER TABLE public.diagnostics SET (
    autovacuum_vacuum_scale_factor = 0.2,
    autovacuum_analyze_scale_factor = 0.1
);

-- =====================================================================================
-- 16. CONFIGURAR ESTADÍSTICAS PARA EL QUERY PLANNER
-- =====================================================================================

-- Aumentar estadísticas para columnas frecuentemente filtradas
ALTER TABLE public.profiles ALTER COLUMN region SET STATISTICS 1000;
ALTER TABLE public.profiles ALTER COLUMN career_interests SET STATISTICS 1000;
ALTER TABLE public.node_progress ALTER COLUMN diagnostic_score SET STATISTICS 1000;
ALTER TABLE public.diagnostics ALTER COLUMN score SET STATISTICS 1000;

COMMIT;

-- =====================================================================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- =====================================================================================
/*
DESPUÉS DE EJECUTAR ESTE SCRIPT:

1. Verificar índices creados:
   SELECT * FROM get_index_usage();

2. Monitorear queries lentas:
   SELECT * FROM get_slow_queries(5);

3. Verificar tamaño de tablas:
   SELECT * FROM get_table_sizes();

4. Analizar estadísticas (ejecutar periódicamente):
   ANALYZE;

5. Configurar monitoreo automático:
   - Ejecutar scripts de performance cada hora
   - Alertas si queries > 1000ms
   - Reportes semanales de uso de índices

6. En Supabase Dashboard:
   - Database > Performance
   - Revisar Performance Advisor
   - Configurar alertas automáticas
*/
