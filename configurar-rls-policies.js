import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://settifboilityelprvjd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function configurarRLSPolicies() {
  console.log('🔐 Configurando políticas RLS...\n');

  try {
    // Políticas para user_preferences
    console.log('📝 Configurando políticas para user_preferences...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
        CREATE POLICY "Users can view own preferences" ON user_preferences
            FOR SELECT USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
        CREATE POLICY "Users can insert own preferences" ON user_preferences
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
        CREATE POLICY "Users can update own preferences" ON user_preferences
            FOR UPDATE USING (auth.uid() = user_id);
      `
    });

    // Políticas para user_progress
    console.log('📊 Configurando políticas para user_progress...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
        CREATE POLICY "Users can view own progress" ON user_progress
            FOR SELECT USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
        CREATE POLICY "Users can insert own progress" ON user_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
        CREATE POLICY "Users can update own progress" ON user_progress
            FOR UPDATE USING (auth.uid() = user_id);
      `
    });

    // Políticas para exercise_bank (lectura pública)
    console.log('📚 Configurando políticas para exercise_bank...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view exercise bank" ON exercise_bank;
        CREATE POLICY "Anyone can view exercise bank" ON exercise_bank
            FOR SELECT USING (true);
      `
    });

    // Políticas para paes_subjects (lectura pública)
    console.log('📖 Configurando políticas para paes_subjects...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view PAES subjects" ON paes_subjects;
        CREATE POLICY "Anyone can view PAES subjects" ON paes_subjects
            FOR SELECT USING (true);
      `
    });

    // Políticas para bloom_levels (lectura pública)
    console.log('🌱 Configurando políticas para bloom_levels...');
    await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Anyone can view Bloom levels" ON bloom_levels;
        CREATE POLICY "Anyone can view Bloom levels" ON bloom_levels
            FOR SELECT USING (true);
      `
    });

    console.log('✅ Políticas RLS configuradas correctamente');
    console.log('🔓 El sistema educativo PAES ahora tiene acceso correcto');

  } catch (error) {
    console.error('❌ Error configurando políticas RLS:', error);
  }
}

configurarRLSPolicies();
