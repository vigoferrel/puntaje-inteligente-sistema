-- ==========================================================================
-- SOLUCIÓN PARA EL TRIGGER PROBLEMÁTICO
-- ==========================================================================
-- Este script identifica y soluciona el problema del trigger que falla
-- al crear perfiles automáticamente.

-- PASO 1: Encontrar triggers en auth.users
-- Ejecuta esto para ver qué triggers existen:
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- PASO 2: Ver funciones relacionadas con perfiles
-- Buscar funciones que mencionen 'profile'
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name ILIKE '%profile%' 
AND routine_schema = 'public';

-- PASO 3: SOLUCIÓN TEMPORAL - Deshabilitar trigger automático
-- Si encuentras un trigger llamado algo como 'on_auth_user_created' o similar:

-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- PASO 4: SOLUCIÓN PERMANENTE - Crear trigger que funcione con RLS
-- Reemplazar el trigger problemático con uno que use nuestra función RPC

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Usar nuestra función RPC que respeta las políticas RLS
  PERFORM public.create_user_profile(
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log el error pero no fallar la creación del usuario
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger corregido
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASO 5: ALTERNATIVA - Deshabilitar RLS temporalmente para el trigger
-- Si prefieres mantener el trigger original, puedes modificar la función
-- para que use privilegios de SECURITY DEFINER:

CREATE OR REPLACE FUNCTION public.create_user_profile_admin(
  user_id uuid,
  full_name text,
  email text
) 
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, updated_at)
  VALUES (user_id, full_name, email, now());
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', user_id, SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Y luego modificar el trigger original para usar esta función
