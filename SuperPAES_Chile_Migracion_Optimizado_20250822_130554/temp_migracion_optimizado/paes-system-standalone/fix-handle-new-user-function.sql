-- ==========================================================================
-- FUNCIÓN CORREGIDA handle_new_user()
-- ==========================================================================
-- Esta función reemplaza la función problemática existente con una versión
-- que usa nuestra función RPC segura y maneja errores correctamente.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Usar nuestra función RPC que respeta las políticas RLS
  PERFORM public.create_user_profile(
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    NEW.email
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log el error pero NO fallar la creación del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- El trigger ya existe, no necesitamos recrearlo
-- Solo hemos reemplazado la función que ejecuta
