-- ==========================================================================
-- POLÍTICAS RLS PARA LA TABLA PROFILES
-- ==========================================================================

-- 1. Habilitar RLS en la tabla `profiles`
-- Esto asegura que todas las políticas definidas a continuación se apliquen.
alter table public.profiles enable row level security;

-- 2. Política para permitir a los usuarios leer su propio perfil
-- Los usuarios solo pueden ver la información de su propio perfil.
drop policy if exists "users_can_select_own_profile" on public.profiles;

create policy "users_can_select_own_profile" on public.profiles
  for select using (auth.uid() = id);

-- 3. Política para permitir a los usuarios crear su propio perfil
-- Un usuario autenticado puede insertar una fila en `profiles` si el `id` coincide con su `uid`.
drop policy if exists "users_can_insert_own_profile" on public.profiles;

create policy "users_can_insert_own_profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 4. Política para permitir a los usuarios actualizar su propio perfil
-- Los usuarios pueden modificar cualquier campo de su propio perfil.
drop policy if exists "users_can_update_own_profile" on public.profiles;

create policy "users_can_update_own_profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- 5. Política (opcional) para administradores
-- Permite a los usuarios con el rol `service_role` acceder a todas las filas sin restricciones.
-- Útil para mantenimiento y operaciones administrativas.
drop policy if exists "admin_can_access_all_profiles" on public.profiles;

create policy "admin_can_access_all_profiles" on public.profiles
  for all using (true) with check (true);

