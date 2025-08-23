import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://settifboilityelprvjd.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg1ODIyMiwiZXhwIjoyMDYzNDM0MjIyfQ.VlriU1ShZH_PFPJzutat2uqnc-TZ6plxUIaBp7NTZyE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function crearUsuarioEmergencia() {
  console.log('🚀 Creando usuario de emergencia...\n');

  try {
    // Crear usuario en auth.users usando RPC
    console.log('👤 Creando usuario en auth.users...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'emergency@paes.local',
      password: 'emergency123',
      email_confirm: true,
      user_metadata: {
        name: 'Usuario Emergencia',
        role: 'student'
      }
    });

    if (userError) {
      console.log('⚠️ Error creando usuario:', userError.message);
      
      // Intentar obtener el usuario existente
      console.log('🔍 Buscando usuario existente...');
      const { data: existingUser, error: searchError } = await supabase.auth.admin.listUsers();
      
      if (searchError) {
        console.log('❌ Error buscando usuarios:', searchError.message);
        return;
      }
      
      const emergencyUser = existingUser.users.find(u => u.email === 'emergency@paes.local');
      if (emergencyUser) {
        console.log('✅ Usuario de emergencia encontrado:', emergencyUser.id);
        
        // Actualizar el AuthContext para usar este ID
        console.log('📝 Actualizando AuthContext...');
        console.log('ID del usuario de emergencia:', emergencyUser.id);
        console.log('Actualiza el AuthContext con este ID:', emergencyUser.id);
        
        return emergencyUser.id;
      }
    } else {
      console.log('✅ Usuario de emergencia creado:', userData.user.id);
      return userData.user.id;
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

crearUsuarioEmergencia();
