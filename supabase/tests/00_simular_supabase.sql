-- Só para testes locais e no CI: reproduz o mínimo do Supabase (schema auth, auth.uid() e papéis).
-- Como nos projetos novos do Supabase, tabelas novas NÃO são expostas a anon/authenticated sozinhas:
-- a migração precisa dar os GRANTs. Nunca rode isto num projeto Supabase.
create extension if not exists pgcrypto;
do $$ begin
  if not exists (select from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
