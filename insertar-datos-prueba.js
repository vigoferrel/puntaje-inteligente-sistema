import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://settifboilityelprvjd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertarDatosPrueba() {
  console.log('🚀 Insertando datos de prueba...\n');

  try {
    // 1. Insertar preferencias para usuario de emergencia
    console.log('📝 Insertando preferencias de usuario...');
    const { error: prefError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: '920cd028-45ec-4227-a654-8adabf06d54f',
        difficulty: 'auto',
        focus_skills: '[]',
        study_time_minutes: 30,
        notifications_enabled: true,
        music_enabled: true,
        theme_preference: 'light',
        language: 'es'
      });

    if (prefError) {
      console.log('⚠️ Error en preferencias:', prefError.message);
    } else {
      console.log('✅ Preferencias insertadas correctamente');
    }

    // 2. Insertar progreso inicial para todas las asignaturas PAES
    console.log('\n📊 Insertando progreso inicial...');
    const progresoInicial = [
      { user_id: '920cd028-45ec-4227-a654-8adabf06d54f', subject_id: 'MATEMATICA_M1', progress: 0, total_exercises: 0, correct_answers: 0, average_score: 0, time_studied_minutes: 0, weak_areas: [], strong_areas: [] },
      { user_id: '920cd028-45ec-4227-a654-8adabf06d54f', subject_id: 'MATEMATICA_M2', progress: 0, total_exercises: 0, correct_answers: 0, average_score: 0, time_studied_minutes: 0, weak_areas: [], strong_areas: [] },
      { user_id: '920cd028-45ec-4227-a654-8adabf06d54f', subject_id: 'COMPETENCIA_LECTORA', progress: 0, total_exercises: 0, correct_answers: 0, average_score: 0, time_studied_minutes: 0, weak_areas: [], strong_areas: [] },
      { user_id: '920cd028-45ec-4227-a654-8adabf06d54f', subject_id: 'CIENCIAS', progress: 0, total_exercises: 0, correct_answers: 0, average_score: 0, time_studied_minutes: 0, weak_areas: [], strong_areas: [] },
      { user_id: '920cd028-45ec-4227-a654-8adabf06d54f', subject_id: 'HISTORIA', progress: 0, total_exercises: 0, correct_answers: 0, average_score: 0, time_studied_minutes: 0, weak_areas: [], strong_areas: [] }
    ];

    const { error: progError } = await supabase
      .from('user_progress')
      .upsert(progresoInicial);

    if (progError) {
      console.log('⚠️ Error en progreso:', progError.message);
    } else {
      console.log('✅ Progreso inicial insertado correctamente');
    }

    // 3. Insertar ejercicios de ejemplo
    console.log('\n📚 Insertando ejercicios de ejemplo...');
    const ejercicios = [
      {
        subject_id: 'MATEMATICA_M1',
        bloom_level_id: 'remember',
        question: '¿Cuál es la fórmula del área de un círculo?',
        question_type: 'multiple_choice',
        options: ['A = πr²', 'A = 2πr', 'A = πd', 'A = r²'],
        correct_answer: 'A = πr²',
        explanation: 'El área de un círculo se calcula multiplicando π por el radio al cuadrado.',
        difficulty_level: 1,
        estimated_time_seconds: 30,
        tags: ['geometría', 'área'],
        is_official: false
      },
      {
        subject_id: 'MATEMATICA_M1',
        bloom_level_id: 'apply',
        question: 'Calcula el área de un círculo con radio 5 cm.',
        question_type: 'multiple_choice',
        options: ['25π cm²', '10π cm²', '50π cm²', '5π cm²'],
        correct_answer: '25π cm²',
        explanation: 'A = πr² = π(5)² = 25π cm²',
        difficulty_level: 2,
        estimated_time_seconds: 45,
        tags: ['geometría', 'cálculo'],
        is_official: false
      },
      {
        subject_id: 'COMPETENCIA_LECTORA',
        bloom_level_id: 'understand',
        question: '¿Cuál es la idea principal del siguiente texto?',
        question_type: 'multiple_choice',
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correct_answer: 'Opción A',
        explanation: 'La idea principal es...',
        difficulty_level: 2,
        estimated_time_seconds: 60,
        tags: ['comprensión', 'análisis'],
        is_official: false
      }
    ];

    const { error: ejError } = await supabase
      .from('exercise_bank')
      .insert(ejercicios);

    if (ejError) {
      console.log('⚠️ Error en ejercicios:', ejError.message);
    } else {
      console.log('✅ Ejercicios de ejemplo insertados correctamente');
    }

    // 4. Verificar datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    
    const { data: prefData } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', '920cd028-45ec-4227-a654-8adabf06d54f');
    
    const { data: progData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', '920cd028-45ec-4227-a654-8adabf06d54f');
    
    const { data: ejData } = await supabase
      .from('exercise_bank')
      .select('*');

    console.log('📊 RESUMEN:');
    console.log(`   - Preferencias: ${prefData?.length || 0} registros`);
    console.log(`   - Progreso: ${progData?.length || 0} registros`);
    console.log(`   - Ejercicios: ${ejData?.length || 0} registros`);

    console.log('\n🎉 ¡Datos de prueba insertados exitosamente!');
    console.log('✅ El sistema educativo PAES está listo para usar');

  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  }
}

insertarDatosPrueba();
