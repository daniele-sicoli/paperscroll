-- PaperScroll database schema. Run this once in Supabase → SQL Editor.

-- One row per user: Pro status + Stripe references.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_pro boolean not null default false,
  stripe_customer_id text,
  stripe_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per user: synced app state.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  topics jsonb not null default '[]'::jsonb,
  saved jsonb not null default '{}'::jsonb,
  seen jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Create a profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security: users see and edit only their own rows.
alter table public.profiles enable row level security;
alter table public.user_data enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = user_id);
-- No insert/update policy for profiles: only the webhook (service role) changes is_pro.

drop policy if exists "user_data: read own" on public.user_data;
create policy "user_data: read own" on public.user_data
  for select using (auth.uid() = user_id);
drop policy if exists "user_data: insert own" on public.user_data;
create policy "user_data: insert own" on public.user_data
  for insert with check (auth.uid() = user_id);
drop policy if exists "user_data: update own" on public.user_data;
create policy "user_data: update own" on public.user_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Backfill profiles for any users that already exist.
insert into public.profiles (user_id)
  select id from auth.users on conflict do nothing;
