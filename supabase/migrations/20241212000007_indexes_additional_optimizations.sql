
-- FASE 2G: ÍNDICES ADICIONALES PARA OPTIMIZACIÓN COMPLETA
-- Completa la optimización del sistema

-- AI and Analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_model_usage_created_module 
ON ai_model_usage(created_at DESC, module_source);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_conversation_sessions_started 
ON ai_conversation_sessions(started_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_cost_analytics_period_type 
ON ai_cost_analytics(period_type, period_date DESC);

-- Gamification and Battle System
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_battle_sessions_creator_status 
ON battle_sessions(creator_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_battle_sessions_created_at 
ON battle_sessions(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_intelligent_achievements_category_active 
ON intelligent_achievements(category, is_active);

-- Calendar and Planning
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_calendar_events_user_date 
ON calendar_events(user_id, start_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_generated_study_plans_user_active 
ON generated_study_plans(user_id, is_active);

-- Financial and Institutional
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_financial_simulations_user_created 
ON financial_simulations(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_institution_students_institution_status 
ON institution_students(institution_id, status);

-- Lectoguia Conversations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lectoguia_conversations_user_session 
ON lectoguia_conversations(user_id, session_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lectoguia_conversations_created_at 
ON lectoguia_conversations(created_at DESC);
