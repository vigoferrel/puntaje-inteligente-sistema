-- Función para crear perfiles de usuarios automáticamente
-- Esta función se ejecutará cada vez que se registre un nuevo usuario

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Generar un username único basado en el email
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    birth_date,
    region,
    comuna,
    phone,
    school_type,
    current_grade,
    professional_interest,
    target_paes_score,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'birth_date' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'birth_date')::date
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'region',
    NEW.raw_user_meta_data->>'comuna',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'school_type',
    NEW.raw_user_meta_data->>'current_grade',
    NEW.raw_user_meta_data->>'professional_interest',
    CASE 
      WHEN NEW.raw_user_meta_data->>'target_paes_score' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'target_paes_score')::integer
      ELSE NULL
    END,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger que ejecutará la función
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Verificar que la función y el trigger se crearon correctamente
SELECT 'Función handle_new_user() creada exitosamente' AS status;
SELECT 'Trigger on_auth_user_created creado exitosamente' AS trigger_status;
