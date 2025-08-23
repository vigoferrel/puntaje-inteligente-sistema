-- SQL para RLS de Producción
-- Ejecutar en Supabase después del deployment

-- Eliminar políticas de desarrollo
DO $$
DECLARE
    table_name TEXT;
    tables TEXT[] := ARRAY[
        'neural_metrics',
        'user_exercise_attempts', 
        'user_node_progress',
        'user_diagnostic_results',
        'user_achievements'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for development" ON public.%I', table_name);
        RAISE NOTICE 'Política de desarrollo eliminada para: %', table_name;
    END LOOP;
END $$;

-- Crear políticas de producción
CREATE POLICY "Users can view own neural_metrics" ON public.neural_metrics 
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own neural_metrics" ON public.neural_metrics 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own exercise_attempts" ON public.user_exercise_attempts 
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own exercise_attempts" ON public.user_exercise_attempts 
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own progress" ON public.user_node_progress 
    FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can update own progress" ON public.user_node_progress 
    FOR ALL USING (auth.uid()::text = user_id);

-- Políticas para tablas públicas (solo lectura)
CREATE POLICY "Public read learning_nodes" ON public.learning_nodes FOR SELECT USING (true);
CREATE POLICY "Public read paes_tests" ON public.paes_tests FOR SELECT USING (true);
CREATE POLICY "Public read paes_skills" ON public.paes_skills FOR SELECT USING (true);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.neural_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;