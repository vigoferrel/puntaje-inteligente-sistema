-- =====================================================================================
-- ARSENAL EDUCATIVO - SUPERPAES AVANZADO
-- =====================================================================================

-- TABLA 7: PAES SIMULATIONS ADVANCED
CREATE TABLE IF NOT EXISTS paes_simulations_advanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    simulation_type TEXT CHECK (simulation_type IN ('predictive', 'vocational', 'improvement_trajectory', 'stress_test')) DEFAULT 'predictive',
    current_scores JSONB NOT NULL DEFAULT '{}',
    predicted_scores JSONB DEFAULT '{}',
    vocational_alignment JSONB DEFAULT '{}',
    improvement_trajectory JSONB DEFAULT '{}',
    confidence_intervals JSONB DEFAULT '{}',
    simulation_parameters JSONB DEFAULT '{}',
    monte_carlo_iterations INTEGER DEFAULT 1000,
    accuracy_score DECIMAL(5,2) DEFAULT 0.0,
    reliability_index DECIMAL(5,2) DEFAULT 0.0,
    execution_time_ms INTEGER,
    status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
    results_summary JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
