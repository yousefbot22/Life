create extension if not exists pgcrypto;

create table if not exists profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null,
 role text not null default 'user' check (role in ('user','admin')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists site_settings (
 id uuid primary key default gen_random_uuid(),
 site_name text not null default 'ذكرياتنا ❤️',
 site_title text not null default 'ذكرياتنا | قصتنا الجميلة',
 site_description text not null default '',
 start_date timestamptz not null default now(),
 primary_color text not null default '#e94d78',
 background text not null default 'dark',
 hero_text text not null default '',
 hero_description text not null default '',
 updated_at timestamptz not null default now()
);


-- Central site password (shared by all devices)
alter table public.site_settings add column if not exists site_password text not null default '15122007';

create table if not exists memories (id uuid primary key default gen_random_uuid(), title text not null, description text not null default '', image_url text, memory_date date not null default current_date, emoji text not null default '❤️', sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists messages (id uuid primary key default gen_random_uuid(), title text not null, content text not null, message_date date not null default current_date, emoji text not null default '💌', image_url text, sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists songs (id uuid primary key default gen_random_uuid(), title text not null, artist text not null default '', audio_url text not null, cover_url text, description text not null default '', sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists timeline (id uuid primary key default gen_random_uuid(), title text not null, description text not null default '', timeline_date date not null default current_date, emoji text not null default '✨', image_url text, sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists chat_settings (id uuid primary key default gen_random_uuid(), ai_name text not null default 'ذكرياتنا AI', ai_avatar_url text, welcome_message text not null default '', system_prompt text not null default '', response_style text not null default '', language text not null default 'ar', updated_at timestamptz not null default now());

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin'); $$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,email,role) values(new.id,coalesce(new.email,''),case when not exists(select 1 from public.profiles where role='admin') then 'admin' else 'user' end) on conflict(id) do update set email=excluded.email,updated_at=now(); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users; create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table profiles enable row level security;
alter table site_settings enable row level security;
alter table memories enable row level security;
alter table messages enable row level security;
alter table songs enable row level security;
alter table timeline enable row level security;
alter table chat_settings enable row level security;


-- Admin needs to read only their own profile after Supabase login.
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid());

DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['site_settings','memories','messages','songs','timeline','chat_settings'] LOOP EXECUTE format('drop policy if exists %I on public.%I',t||'_public_read',t); EXECUTE format('create policy %I on public.%I for select to anon,authenticated using(true)',t||'_public_read',t); EXECUTE format('drop policy if exists %I on public.%I',t||'_admin_insert',t); EXECUTE format('create policy %I on public.%I for insert to authenticated with check(public.is_admin())',t||'_admin_insert',t); EXECUTE format('drop policy if exists %I on public.%I',t||'_admin_update',t); EXECUTE format('create policy %I on public.%I for update to authenticated using(public.is_admin()) with check(public.is_admin())',t||'_admin_update',t); EXECUTE format('drop policy if exists %I on public.%I',t||'_admin_delete',t); EXECUTE format('create policy %I on public.%I for delete to authenticated using(public.is_admin())',t||'_admin_delete',t); END LOOP; END $$;

insert into site_settings(id) select gen_random_uuid() where not exists(select 1 from site_settings);
insert into chat_settings(id) select gen_random_uuid() where not exists(select 1 from chat_settings);
