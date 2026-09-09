-- Run this ONCE in Supabase SQL Editor to make the existing admin@gmail.com account an Admin.
-- It also creates the profile row if the Auth user existed before the profile trigger was installed.

insert into public.profiles (id, email, role)
select id, coalesce(email, ''), 'admin'
from auth.users
where lower(email) = lower('admin@gmail.com')
on conflict (id) do update
set email = excluded.email,
    role = 'admin',
    updated_at = now();

-- Verify:
select id, email, role from public.profiles
where lower(email) = lower('admin@gmail.com');
