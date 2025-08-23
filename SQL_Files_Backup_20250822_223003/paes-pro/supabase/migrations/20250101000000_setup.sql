-- Enable RLS
alter table public.users enable row level security;

-- Set up RLS policies
create policy "Users can view own profile"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.users for update
  using ( auth.uid() = id );

create policy "Enable insert for authenticated users only"
  on public.users for insert
  with check ( auth.role() = 'authenticated' );

-- Create default schema for users table if it doesn't exist
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null unique,
  full_name text,
  avatar_url text,
  phone text,
  birth_date date,
  grade_level text,
  target_career text,
  target_university text,
  region text,
  city text,
  study_preferences jsonb default '{}'::jsonb,
  notification_preferences jsonb default '{}'::jsonb,
  is_active boolean default true not null,
  last_login timestamp with time zone,
  total_study_minutes integer default 0 not null,
  current_streak_days integer default 0 not null,
  max_streak_days integer default 0 not null,
  paes_target_date date
);

-- Create indexes
create index if not exists users_email_idx on public.users (email);
create index if not exists users_full_name_idx on public.users (full_name);
create index if not exists users_region_idx on public.users (region);
create index if not exists users_grade_level_idx on public.users (grade_level);

-- Set up realtime
alter publication supabase_realtime add table public.users;
