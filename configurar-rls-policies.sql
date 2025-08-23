-- SCRIPT PARA CONFIGURAR POLÍTICAS RLS
-- Ejecutar en el SQL Editor de Supabase

-- 1. Política para user_preferences
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- 2. Política para user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 3. Política para user_exercises
DROP POLICY IF EXISTS "Users can view own exercises" ON user_exercises;
CREATE POLICY "Users can view own exercises" ON user_exercises
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exercises" ON user_exercises;
CREATE POLICY "Users can insert own exercises" ON user_exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Política para user_simulations
DROP POLICY IF EXISTS "Users can view own simulations" ON user_simulations;
CREATE POLICY "Users can view own simulations" ON user_simulations
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own simulations" ON user_simulations;
CREATE POLICY "Users can insert own simulations" ON user_simulations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Política para exercise_bank (lectura pública)
DROP POLICY IF EXISTS "Anyone can view exercise bank" ON exercise_bank;
CREATE POLICY "Anyone can view exercise bank" ON exercise_bank
    FOR SELECT USING (true);

-- 6. Política para paes_subjects (lectura pública)
DROP POLICY IF EXISTS "Anyone can view PAES subjects" ON paes_subjects;
CREATE POLICY "Anyone can view PAES subjects" ON paes_subjects
    FOR SELECT USING (true);

-- 7. Política para bloom_levels (lectura pública)
DROP POLICY IF EXISTS "Anyone can view Bloom levels" ON bloom_levels;
CREATE POLICY "Anyone can view Bloom levels" ON bloom_levels
    FOR SELECT USING (true);

-- 8. Política para achievements (lectura pública)
DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements" ON achievements
    FOR SELECT USING (true);

-- Verificar políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('user_preferences', 'user_progress', 'user_exercises', 'user_simulations', 'exercise_bank', 'paes_subjects', 'bloom_levels', 'achievements')
ORDER BY tablename, policyname;
