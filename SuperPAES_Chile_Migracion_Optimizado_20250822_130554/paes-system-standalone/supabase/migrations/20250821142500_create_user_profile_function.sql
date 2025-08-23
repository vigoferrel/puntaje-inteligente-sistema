-- ==========================================================================
-- FUNCIÓN PARA CREAR PERFIL DE USUARIO
-- ==========================================================================
-- Esta función se encarga de crear un perfil para un nuevo usuario.
-- Se ejecuta con los privilegios del usuario que la llama.
--
-- La política RLS de la tabla `profiles` debe permitir esta operación.

create or replace function public.create_user_profile(
  user_id uuid,
  full_name text,
  email text
) 
returns void as $$
begin
  insert into public.profiles (id, full_name, email, updated_at)
  values (user_id, full_name, email, now());
end;
$$ language plpgsql security definer;

